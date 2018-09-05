'use strict';
const path = require('path');
console.log(path.join(__dirname, '/data/db.sqlite'));

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: __dirname + '/data/db.sqlite'
  },
  migrations: {
    tableName: 'migrations'
  },
  useNullAsDefault: true,
  debug: true,
  acquireConnectionTimeout: 10
};
