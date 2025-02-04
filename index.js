import { WebSocketServer } from 'ws';
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client.readyState === 1) { // Check if client is open
        client.send(JSON.stringify({
          type: 'message',
          username: data.username,
          content: data.content,
          timestamp: new Date().toISOString()
        }));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});