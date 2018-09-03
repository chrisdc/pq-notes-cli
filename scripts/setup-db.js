/* global emit */
'use strict';

var db = require('../db');

function setup() {
  const nameIndex = {
    _id: '_design/name_index',
    views: {
      'name_index': {
        map: function(doc) {
          emit(doc.name);
        }.toString()
      }
    }
  };

  return db.put(nameIndex)
    .then(() => {
      // Start building the index.
      return db.query('name_index', {
        limit: 0 // don't return any results
      });
    }).then(() => {
      return;
    }).catch((err) => {
      if (err.status === 409) {
        return; // Index already exists.
      }
      throw err;
    });
}

module.exports = setup;
