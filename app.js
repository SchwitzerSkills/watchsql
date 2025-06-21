const { watchSQL } = require('./watchsql');

watchSQL(
  {
    type: 'sqlite', // oder 'mysql'
    path: './mydb.sqlite', // bei SQLite
    // connection: { ... } // bei MySQL
    table: 'users'
  },
  {
    onInsert: (row) => {
      console.log('[INSERT]', row);
    },
    onUpdate: (before, after) => {
      console.log('[UPDATE]');
      console.log('ALT:', before);
      console.log('NEU:', after);
    },
    onDelete: (row) => {
      console.log('[DELETE]', row);
    }
  },
  {
    pollingInterval: 1000, // alle 1 Sekunde
    primaryKey: 'id'       // wichtig: eindeutiger Schlüssel!
  }
);
watchSQL(
  {
    type: 'mysql',
    table: 'users',
    connection: {
      host: 'localhost',
      user: 'username',
      password: 'password',
      database: 'test'
    }
  },
  {
    onInsert: console.log,
    onUpdate: (before, after) => console.log('Updated:', before, '=>', after),
    onDelete: console.log
  }
);
