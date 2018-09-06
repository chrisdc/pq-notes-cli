'use strict';

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  migrations: {
    tableName: 'migrations'
  },
  useNullAsDefault: true,
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
