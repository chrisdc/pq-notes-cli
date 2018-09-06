#!/bin/bash

'use strict';

const program = require('commander');
const config = require('./lib/commands/config');
const deleteNotes = require('./lib/commands/delete');
const detag = require('./lib/commands/detag');
const exportNotes = require('./lib/commands/export');
const importNotes = require('./lib/commands/import');
const read = require('./lib/commands/read');
const rename = require('./lib/commands/rename');
const search = require('./lib/commands/search');
const tag = require('./lib/commands/tag');
const write = require('./lib/commands/write');

program
  .version('0.0.1')
  .usage('[command]');

program
  .command('config')
  .description('Configure notebk')
  .action(function() {
    config();
  });

program
  .command('delete [name...]')
  .description('Delete one or more notes.')
  .option('-f, --force', 'Delete notes without confirmation.')
  .action(function(names, options) {
    deleteNotes(names, options);
  }).on('--help', function() {
    console.log('  If [name...] is empty stdin is used instead.');
    console.log('');
  });

program
  .command('detag <tag_name> [name...]')
  .description('Remove a tag from one or more notes.')
  .action(function(tagName, names) {
    detag(tagName, names);
  }).on('--help', function() {
    console.log('  If [name...] is empty stdin is used instead.');
    console.log('');
  });

program
  .command('export [name...]')
  .description('Writes the named notes to stdout in JSON format.')
  .option('-P, --pretty-print', 'Format JSON data for readability')
  .action(function(names, options) {
    exportNotes(names, options);
  }).on('--help', function() {
    console.log('  If [name...] is empty stdin is used instead.');
    console.log('  If stdin all notes are exported');
    console.log('');
  });

program
  .command('import [path]')
  .description('Attempts to import the file at [path] as JSON, replacing exisiting notes with matching names')
  .option('-r, --reset', 'Delete existing notes before import.')
  .option('-f, --force', 'Delete or replace exsting notes without confirmation.')
  .action(function(names, options) {
    importNotes(names, options);
  }).on('--help', function() {
    console.log('  If [path] is empty stdin is used instead.');
    console.log('');
  });

program
  .command('read [name...]')
  .description('Read one or more name notes to stdout.')
  .action(function(names) {
    read(names);
  });

program
  .command('rename <name> <new_name>')
  .description('Rename a note')
  .option('-f, --force', 'Overwrite exisiting notes without confirmation.')
  .action(function(name, newName, options) {
    rename(name, newName, options);
  });

program
  .command('search [search_term]')
  .description('Search for notes matching [search_term]. Returns all notes if no dates or search terms are provided.')
  .option('-F, --from-date <from_date>', 'Overwrite exisiting notes without confirmation.')
  .option('-T, --to-date <to_date>', 'Overwrite exisiting notes without confirmation.')
  .action(function(searchTerm, options) {
    search(searchTerm, options);
  });

program
  .command('tag <tag_name> [name...]')
  .description('Add a tag to one or more notes.')
  .action(function(tagName, names) {
    tag(tagName, names);
  }).on('--help', function() {
    console.log('  If [name...] is empty stdin is used instead.');
    console.log('');
  });

program
  .command('write [name]', {isDefault: true})
  .option('-a, --append', 'Prepend content to the beginning of exisiting content')
  .option('-c, --content <content>', 'Specify the notes contents from the command line.')
  .option('-f, --force', 'Overwrite exisiting content without confirmation')
  .option('-p, --prepend', 'Append content to the end of exisiting content')
  .description('Create or edit a note.')
  .action(function(name, options) {
    write(name, options);
  }).on('--help', function() {
    console.log('  The note contents are determined as follows:');
    console.log('');
    console.log('    --content is used if present.');
    console.log('    If --content is empty stdin is used.');
    console.log('    If stdin is also empty launch the text editor defined by $VISUAL or $ENVIRONMENT.');
    console.log('');
  });

program.parse(process.argv);
