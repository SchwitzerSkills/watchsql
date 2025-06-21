// server.js
const express = require('express');
const { watchSQL, serveWebSocket, targetedBroadcast } = require('./watchsql');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors({
  origin: 'http://192.168.178.147', // oder '*'
}));


// WebSocket starten
serveWebSocket({ port: 3000 });

// SQLite init (test.db muss existieren)
const db = new sqlite3.Database('./mydb.sqlite');

// API: Benutzer sendet SQL-Statement
app.post('/api/insert', (req, res) => {
  const { userId, name, email } = req.body;
  if (!userId || !name || !email) return res.status(400).json({ error: 'missing fields' });

  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  stmt.run(name, email, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // gezielt zurücksenden
    console.log('[API] Insert durchgeführt, targetedBroadcast an:', userId);
    targetedBroadcast(userId, 'inserted', { id: this.lastID, name, email, userId });
    res.json({ success: true, id: this.lastID });
  });
});

// DB Monitoring
watchSQL(
  {
    type: 'sqlite',
    path: './mydb.sqlite',
    table: 'users'
  },
  {
    onInsert: r => console.log('[Insert]', r),
    onUpdate: (b, a) => console.log('[Update]', b, a),
    onDelete: r => console.log('[Delete]', r)
  }
);

// API starten
app.listen(3001, "0.0.0.0", () => console.log('HTTP API läuft auf http://localhost:3001'));
