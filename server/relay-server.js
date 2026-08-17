const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', rooms: rooms.size }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });
console.log(`WebSocket relay starting on port ${PORT}`);

const rooms = new Map();

wss.on('connection', (ws) => {
  let roomId = null;
  let role = null;

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === 'JOIN_ROOM') {
        roomId = data.roomId;
        role = data.role;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, { host: null, controllers: new Set() });
        }

        const room = rooms.get(roomId);
        if (role === 'GAME') {
          room.host = ws;
          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            controllerConnected: room.controllers.size > 0,
            controllerCount: room.controllers.size
          }));
        } else {
          room.controllers.add(ws);
          if (room.host && room.host.readyState === 1) {
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
        if (room && room.host && room.host.readyState === 1) {
          room.host.send(JSON.stringify({ type: 'INPUT', action: data.action }));
        }
      } else if (data.type === 'GAME_STATE' && role === 'GAME') {
        const room = rooms.get(data.roomId);
        if (room) {
          room.controllers.forEach(c => {
            if (c.readyState === 1) {
              c.send(JSON.stringify({ type: 'GAME_STATE', payload: data.payload }));
            }
          });
        }
      } else if (data.type === 'PING') {
        if (role === 'GAME') {
          const room = rooms.get(roomId);
          if (room) {
            room.controllers.forEach(c => {
              if (c.readyState === 1) {
                c.send(JSON.stringify({ type: 'PONG', role: 'GAME' }));
              }
            });
          }
        } else if (role === 'CONTROLLER') {
          const room = rooms.get(roomId);
          if (room && room.host && room.host.readyState === 1) {
            room.host.send(JSON.stringify({ type: 'PONG', role: 'CONTROLLER' }));
          }
        }
      } else if (data.type === 'PONG') {
        if (role === 'CONTROLLER') {
          const room = rooms.get(roomId);
          if (room && room.host && room.host.readyState === 1) {
            room.host.send(JSON.stringify({ type: 'PONG', role: 'CONTROLLER' }));
          }
        } else if (role === 'GAME') {
          const room = rooms.get(roomId);
          if (room) {
            room.controllers.forEach(c => {
              if (c.readyState === 1) {
                c.send(JSON.stringify({ type: 'PONG', role: 'GAME' }));
              }
            });
          }
        }
      }
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  });

  ws.on('close', () => {
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      if (role === 'GAME') {
        room.host = null;
        room.controllers.forEach(c => {
          if (c.readyState === 1) {
            c.send(JSON.stringify({ type: 'HOST_DISCONNECTED' }));
          }
        });
      } else {
        room.controllers.delete(ws);
        if (room.host && room.host.readyState === 1) {
          room.host.send(JSON.stringify({
            type: 'CONTROLLER_STATUS',
            connected: room.controllers.size > 0,
            count: room.controllers.size
          }));
        }
      }
      if (!room.host && room.controllers.size === 0) {
        rooms.delete(roomId);
      }
    }
  });

  ws.on('error', () => {});
});

server.listen(PORT, () => {
  console.log(`Relay running on port ${PORT}`);
});
