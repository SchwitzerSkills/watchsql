const sqlite = require('./sqliteMonitor');
const mysql = require('./mysqlMonitor');
const { createServer, broadcast, targetedBroadcast, registerClient } = require('./websocket');

function watchSQL(config, handlers, options = {}) {
  if (!config || !config.type) {
    throw new Error("Missing 'type' in config (e.g., 'sqlite' or 'mysql')");
  }

  switch (config.type) {
    case 'sqlite':
      return sqlite.watch(config, handlers, options);
    case 'mysql':
      return mysql.watch(config, handlers, options);
    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

function serveWebSocket(options = {}) {
  return createServer(options);
}

module.exports = { watchSQL, serveWebSocket, registerClient, targetedBroadcast };
