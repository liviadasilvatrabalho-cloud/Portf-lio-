import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";

interface Room {
  hostSocket?: WebSocket;
  controllerSockets: Set<WebSocket>;
  lastGameState?: any;
}

const rooms = new Map<string, Room>();

function getOrCreateRoom(roomId: string): Room {
  let room = rooms.get(roomId);
  if (!room) {
    room = { controllerSockets: new Set() };
    rooms.set(roomId, room);
  }
  return room;
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", activeRooms: rooms.size });
  });

  app.get("/api/room/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    const room = rooms.get(roomId);
    res.json({
      exists: !!room,
      hasHost: !!room?.hostSocket,
      controllerCount: room?.controllerSockets.size || 0,
    });
  });

  // WebSocket Server Setup
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, "http://localhost").pathname : "";
    if (pathname === "/ws" || pathname === "/ws/") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      // Allow general WS upgrade or fallback
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    let currentRoomId: string | null = null;
    let currentRole: "GAME" | "CONTROLLER" | null = null;

    ws.on("message", (rawMessage: Buffer | string) => {
      try {
        const data = JSON.parse(rawMessage.toString());

        switch (data.type) {
          case "JOIN_ROOM": {
            const { roomId, role } = data;
            if (!roomId) return;

            currentRoomId = roomId;
            currentRole = role;

            const room = getOrCreateRoom(roomId);

            if (role === "GAME") {
              room.hostSocket = ws;
              ws.send(
                JSON.stringify({
                  type: "ROOM_JOINED",
                  roomId,
                  role: "GAME",
                  controllerConnected: room.controllerSockets.size > 0,
                  controllerCount: room.controllerSockets.size,
                })
              );
            } else if (role === "CONTROLLER") {
              room.controllerSockets.add(ws);
              ws.send(
                JSON.stringify({
                  type: "ROOM_JOINED",
                  roomId,
                  role: "CONTROLLER",
                  hasHost: !!room.hostSocket,
                  lastGameState: room.lastGameState || null,
                })
              );

              // Notify Host that controller connected
              if (room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN) {
                room.hostSocket.send(
                  JSON.stringify({
                    type: "CONTROLLER_STATUS",
                    connected: true,
                    count: room.controllerSockets.size,
                  })
                );
              }
            }
            break;
          }

          case "INPUT": {
            if (!currentRoomId) return;
            const room = rooms.get(currentRoomId);
            if (room && room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN) {
              room.hostSocket.send(
                JSON.stringify({
                  type: "INPUT",
                  action: data.action,
                  params: data.params,
                  timestamp: Date.now(),
                })
              );
            }
            break;
          }

          case "GAME_STATE": {
            if (!currentRoomId) return;
            const room = rooms.get(currentRoomId);
            if (room) {
              room.lastGameState = data.payload;
              // Broadcast state to all connected controllers in this room
              for (const controllerWs of room.controllerSockets) {
                if (controllerWs.readyState === WebSocket.OPEN) {
                  controllerWs.send(
                    JSON.stringify({
                      type: "GAME_STATE",
                      payload: data.payload,
                    })
                  );
                }
              }
            }
            break;
          }

          case "PING": {
            ws.send(JSON.stringify({ type: "PONG" }));
            break;
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      if (currentRoomId && currentRole) {
        const room = rooms.get(currentRoomId);
        if (room) {
          if (currentRole === "GAME") {
            if (room.hostSocket === ws) {
              room.hostSocket = undefined;
              // Notify controllers that host disconnected
              for (const ctrlWs of room.controllerSockets) {
                if (ctrlWs.readyState === WebSocket.OPEN) {
                  ctrlWs.send(JSON.stringify({ type: "HOST_DISCONNECTED" }));
                }
              }
            }
          } else if (currentRole === "CONTROLLER") {
            room.controllerSockets.delete(ws);
            // Notify host that controller disconnected
            if (room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN) {
              room.hostSocket.send(
                JSON.stringify({
                  type: "CONTROLLER_STATUS",
                  connected: room.controllerSockets.size > 0,
                  count: room.controllerSockets.size,
                })
              );
            }
          }

          // Cleanup empty room
          if (!room.hostSocket && room.controllerSockets.size === 0) {
            rooms.delete(currentRoomId);
          }
        }
      }
    });
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Arcade Pac-Man Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
