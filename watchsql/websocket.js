const WebSocket = require('ws');
let wss = null;
const clientMap = new Map();

function createServer(options = {}) {
  const port = options.port || 3000;
  wss = new WebSocket.Server({ port });
  console.log(`[watchsql] WebSocket Server läuft auf ws://localhost:${port}`);

  wss.on('connection', (ws, req) => {
    ws.on('message', msg => {
      try {
        const parsed = JSON.parse(msg);
        if (parsed.type === 'identify' && parsed.id) {
          clientMap.set(parsed.id, ws);
          ws._watchsql_id = parsed.id;
        }
      } catch (e) {
        console.error('Ungültige Nachricht vom Client:', msg);
      }
    });

    ws.on('close', () => {
      if (ws._watchsql_id) {
        clientMap.delete(ws._watchsql_id);
      }
    });
  });
}

function broadcast(type, data) {
  if (!wss) return;
  const message = JSON.stringify({ type, data });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function targetedBroadcast(clientId, type, data) {
  const ws = clientMap.get(clientId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, data }));
  }
}

function registerClient(id, ws) {
  clientMap.set(id, ws);
}

module.exports = { createServer, broadcast, targetedBroadcast, registerClient };
