'use strict';
const path = require('path');

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
  acquireConnectionTimeout: 10,
  log: {
    warn(message) {
    },
    error(message) {
    },
    deprecate(message) {
    },
    debug(message) {
    }
  }
};
