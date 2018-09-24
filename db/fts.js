'use strict';

const lunr = require('lunr');
const fs = require('fs');

var idx = lunr(function() {
  this.ref('name');
  this.field('content');
});

function buildIndex(notes) {
  notes.forEach(function(note) {
    idx.add(note);
  });
}

function saveIndex() {
  return new Promise((resolve, reject) => {
    const serializedIdx = JSON.stringify(idx);
    fs.writeFile('./db/data/search-index.json', serializedIdx, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function loadIndex() {
  return new Promise((resolve, reject) => {
    fs.readFile('./db/data/search-index.json', (err, data) => {
      if (err) {
        reject(err);
      }
      idx = lunr.Index.load(JSON.parse(data));
      resolve(idx);
    });
  });
}

/*
var documents = [{
  "name": "Lunr",
  "text": "Like Solr, but much smaller, and not as bright. Running is silly"
}, {
  "name": "React",
  "text": "A JavaScript library for building user interfaces."
}, {
  "name": "Lodash",
  "text": "A modern JavaScript utility library delivering modularity, performance & extras."
}];

var idx = lunr(function() {
  this.ref('name');
  this.field('text');
  this.metadataWhitelist = ['position'];

  documents.forEach(function(doc) {
    this.add(doc);
  }, this);
});

idx.search('term');*/



module.exports = idx;
