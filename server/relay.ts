import { WebSocketServer } from 'ws';

const PORT = 5174;
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });
console.log(`WebSocket relay running on 0.0.0.0:${PORT}`);

const rooms = new Map<string, { host: any; controllers: Set<any> }>();

wss.on('connection', (ws) => {
  let roomId: string | null = null;
  let role: 'GAME' | 'CONTROLLER' | null = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'JOIN_ROOM') {
        roomId = data.roomId;
        role = data.role;
        
        if (!rooms.has(roomId!)) {
          rooms.set(roomId!, { host: null, controllers: new Set() });
        }
        
        const room = rooms.get(roomId!)!;
        if (role === 'GAME') {
          room.host = ws;
          ws.send(JSON.stringify({ 
            type: 'ROOM_JOINED', 
            controllerConnected: room.controllers.size > 0,
            controllerCount: room.controllers.size
          }));
        } else {
          room.controllers.add(ws);
          if (room.host) {
            room.host.send(JSON.stringify({ 
              type: 'CONTROLLER_STATUS', 
              connected: true,
              count: room.controllers.size
            }));
          }
          ws.send(JSON.stringify({ type: 'ROOM_JOINED', hasHost: !!room.host }));
        }
      } else if (data.type === 'INPUT' && role === 'CONTROLLER') {
        const room = rooms.get(data.roomId);
        if (room?.host) {
          room.host.send(JSON.stringify({ type: 'INPUT', action: data.action }));
        }
      } else if (data.type === 'GAME_STATE' && role === 'GAME') {
        const room = rooms.get(data.roomId);
        if (room) {
          room.controllers.forEach(c => c.send(JSON.stringify({ type: 'GAME_STATE', payload: data.payload })));
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on('close', () => {
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId)!;
      if (role === 'GAME') {
        room.host = null;
        room.controllers.forEach(c => c.send(JSON.stringify({ type: 'HOST_DISCONNECTED' })));
      } else {
        room.controllers.delete(ws);
        if (room.host) {
          room.host.send(JSON.stringify({ 
            type: 'CONTROLLER_STATUS', 
            connected: room.controllers.size > 0,
            count: room.controllers.size
          }));
        }
      }
    }
  });
});
