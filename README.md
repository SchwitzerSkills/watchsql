# watchsql

**Live SQL change monitor with WebSocket broadcasting for SQLite and MySQL.**

Monitor specific tables in your SQLite or MySQL database and trigger live updates via WebSocket or callback hooks – without setting up native triggers or polling logic.

## Features

- 🔄 Detects INSERT, UPDATE, DELETE operations
- 🔌 WebSocket server included
- ⚡ Lightweight and dependency-free monitoring
- ✅ Supports SQLite and MySQL
- 🧠 Custom logic on insert/update/delete
- 🎯 Broadcast data to specific WebSocket clients via `targetedBroadcast`

---

## Installation

```bash
npm install watchsql
```

## Usage

### 1. Start a WebSocket Server

```js
const { serveWebSocket } = require('watchsql');

serveWebSocket({ port: 3000 });
```

### 2. Start Watching a Table (SQLite)

```js
const { watchSQL } = require('watchsql');
const sqlite3 = require('sqlite3').verbose();

watchSQL(
  {
    type: 'sqlite',
    path: './mydb.sqlite',
    table: 'users',
  },
  {
    onInsert: row => console.log('[INSERT]', row),
    onUpdate: (before, after) => console.log('[UPDATE]', before, after),
    onDelete: row => console.log('[DELETE]', row),
  }
);
```

### 3. Start Watching a Table (MySQL)

```js
const { watchSQL } = require('watchsql');

watchSQL(
  {
    type: 'mysql',
    config: {
      host: 'localhost',
      user: 'root',
      password: 'pass',
      database: 'mydb',
    },
    table: 'customers',
  },
  {
    onInsert: row => console.log('[INSERT]', row),
    onUpdate: (before, after) => console.log('[UPDATE]', before, after),
    onDelete: row => console.log('[DELETE]', row),
  }
);
```

---

## WebSocket Integration

```js
const { serveWebSocket, targetedBroadcast } = require('watchsql');

// Start server
serveWebSocket({ port: 3000 });

// Broadcast to a specific client
targetedBroadcast('user123', { event: 'update', data: { id: 1 } });
```

---

## Client Example

```js
const ws = new WebSocket('ws://localhost:3000');
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'identify', id: 'user123' }));
};
ws.onmessage = event => {
  const data = JSON.parse(event.data);
  console.log('Received update:', data);
};
```

---

## License

MIT © 2025 SchwitzerSkills
