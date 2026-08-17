import { useEffect, useRef, useState, useCallback } from 'react';
import { RemoteInputAction, RemoteGameStatePayload } from '../types';

interface UseRemoteControlOptions {
  role: 'GAME' | 'CONTROLLER';
  roomIdOverride?: string;
  onInputReceived?: (action: RemoteInputAction) => void;
}

// Public WebSocket relay — works from any device, no server needed
const RELAY_URL = 'wss://socketsbay.com/wss/v2/1/demo/';

export function useRemoteControl({
  role,
  roomIdOverride,
  onInputReceived,
}: UseRemoteControlOptions) {
  const [roomId, setRoomId] = useState<string>(() => {
    if (roomIdOverride) return roomIdOverride;

    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room');
    if (roomFromUrl) return roomFromUrl.toUpperCase();

    const hash = window.location.hash;
    if (hash.includes('room=')) {
      const match = hash.match(/room=([A-Za-z0-9-]+)/);
      if (match) return match[1].toUpperCase();
    }

    const saved = localStorage.getItem('pacman_room_id');
    if (saved) return saved;

    const randomId = 'PAC-' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('pacman_room_id', randomId);
    return randomId;
  });

  const [isConnected, setIsConnected] = useState(false);
  const [controllerConnected, setControllerConnected] = useState(false);
  const [controllerCount, setControllerCount] = useState(0);
  const [hasHost, setHasHost] = useState(role === 'GAME');
  const [latestGameState, setLatestGameState] = useState<RemoteGameStatePayload | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const onInputReceivedRef = useRef(onInputReceived);

  useEffect(() => {
    onInputReceivedRef.current = onInputReceived;
  }, [onInputReceived]);

  // ============ BroadcastChannel: same-browser communication ============
  useEffect(() => {
    if (!roomId) return;

    try {
      const bc = new BroadcastChannel(`pacman_room_${roomId}`);
      broadcastRef.current = bc;

      bc.onmessage = (event) => {
        const { type, action, payload } = event.data || {};

        if (type === 'INPUT' && role === 'GAME') {
          if (action && onInputReceivedRef.current) {
            onInputReceivedRef.current(action as RemoteInputAction);
          }
        } else if (type === 'GAME_STATE' && role === 'CONTROLLER') {
          if (payload) {
            setLatestGameState(payload);
            setHasHost(true);
          }
        } else if (type === 'PING') {
          if (role === 'GAME') {
            bc.postMessage({ type: 'PONG', roomId, role: 'GAME' });
            setControllerConnected(true);
            setControllerCount(prev => Math.max(1, prev));
          } else if (role === 'CONTROLLER') {
            bc.postMessage({ type: 'PONG', roomId, role: 'CONTROLLER' });
            setHasHost(true);
          }
        } else if (type === 'PONG') {
          if (role === 'GAME') {
            setControllerConnected(true);
            setControllerCount(prev => Math.max(1, prev));
          } else if (role === 'CONTROLLER') {
            setHasHost(true);
          }
        }
      };

      bc.postMessage({ type: 'PING', role, roomId });
    } catch {
      // BroadcastChannel not supported
    }

    return () => {
      broadcastRef.current?.close();
      broadcastRef.current = null;
    };
  }, [roomId, role]);

  // ============ WebSocket: cross-device via public relay ============
  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`${RELAY_URL}${roomId}`);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          // Announce presence
          ws.send(JSON.stringify({ type: 'PING', role, roomId }));
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            const { type, action, payload, role: msgRole } = data;

            if (type === 'INPUT' && role === 'GAME') {
              if (action && onInputReceivedRef.current) {
                setControllerConnected(true);
                onInputReceivedRef.current(action as RemoteInputAction);
              }
            } else if (type === 'GAME_STATE' && role === 'CONTROLLER') {
              if (payload) {
                setLatestGameState(payload);
                setHasHost(true);
              }
            } else if (type === 'PING') {
              if (role === 'GAME' && msgRole === 'CONTROLLER') {
                ws.send(JSON.stringify({ type: 'PONG', role: 'GAME', roomId }));
                setControllerConnected(true);
                setControllerCount(prev => Math.max(1, prev));
              } else if (role === 'CONTROLLER' && msgRole === 'GAME') {
                ws.send(JSON.stringify({ type: 'PONG', role: 'CONTROLLER', roomId }));
                setHasHost(true);
              }
            } else if (type === 'PONG') {
              if (role === 'GAME') {
                setControllerConnected(true);
                setControllerCount(prev => Math.max(1, prev));
              } else if (role === 'CONTROLLER') {
                setHasHost(true);
              }
            }
          } catch {
            // ignore parse errors
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          reconnectTimer = setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = () => {
          // Will reconnect on close
        };
      } catch {
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [roomId, role]);

  // ============ Send Input ============
  const sendInput = useCallback(
    (action: RemoteInputAction) => {
      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ type: 'INPUT', roomId, action });
      }
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'INPUT', roomId, action }));
      }
    },
    [roomId]
  );

  // ============ Send Game State ============
  const sendGameState = useCallback(
    (payload: RemoteGameStatePayload) => {
      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ type: 'GAME_STATE', roomId, payload });
      }
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'GAME_STATE', roomId, payload }));
      }
    },
    [roomId]
  );

  const changeRoomId = useCallback((newId: string) => {
    const formatted = newId.trim().toUpperCase();
    if (formatted) {
      setRoomId(formatted);
      localStorage.setItem('pacman_room_id', formatted);
    }
  }, []);

  return {
    roomId,
    changeRoomId,
    isConnected,
    controllerConnected,
    controllerCount,
    hasHost,
    latestGameState,
    sendInput,
    sendGameState,
  };
}
