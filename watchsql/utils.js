const crypto = require('crypto');

function hashRow(row) {
  return crypto.createHash('md5').update(JSON.stringify(row)).digest('hex');
}

function detectChanges(previous, current, primaryKey = 'id') {
  const prevMap = {};
  previous.forEach(r => prevMap[r[primaryKey]] = r);
  const currMap = {};
  current.forEach(r => currMap[r[primaryKey]] = r);

  const inserts = [];
  const updates = [];
  const deletes = [];

  for (const id in currMap) {
    if (!(id in prevMap)) {
      inserts.push(currMap[id]);
    } else if (hashRow(currMap[id]) !== hashRow(prevMap[id])) {
      updates.push({ before: prevMap[id], after: currMap[id] });
    }
  }

  for (const id in prevMap) {
    if (!(id in currMap)) {
      deletes.push(prevMap[id]);
    }
  }

  return { inserts, updates, deletes };
}

module.exports = { detectChanges };
