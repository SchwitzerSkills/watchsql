const sqlite3 = require('sqlite3').verbose();
const { detectChanges } = require('./utils');
const { broadcast } = require('./websocket');

function watch(config, handlers, options) {
  const db = new sqlite3.Database(config.path);
  const table = config.table;
  const pk = options.primaryKey || 'id';
  const interval = options.pollingInterval || 1000;

  let previousRows = [];

  return setInterval(() => {
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) return console.error('[SQLiteMonitor]', err);
      const { inserts, updates, deletes } = detectChanges(previousRows, rows, pk);
      inserts.forEach(r => {
        handlers.onInsert && handlers.onInsert(r);
        broadcast('insert', r);
      });
      updates.forEach(r => {
        handlers.onUpdate && handlers.onUpdate(r.before, r.after);
        broadcast('update', r);
      });
      deletes.forEach(r => {
        handlers.onDelete && handlers.onDelete(r);
        broadcast('delete', r);
      });
      previousRows = rows;
    });
  }, interval);
}

module.exports = { watch };

