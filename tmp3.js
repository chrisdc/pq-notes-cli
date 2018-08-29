'use strict';

const db = require('./lib/db');
db.allDocs({
  include_docs: true
}).then(results => {
  //console.log(results);
  console.log(results.rows);
});
