'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('notes', function(table) {
      table.increments('id');
      table.timestamps(false, true);
      table.string('name').notNullable();
      table.text('content');
      table.boolean('is_deleted').defaultTo(false);
      table.unique('name');
    }),
    knex.schema.createTable('tags', function(table) {
      table.increments('id');
      table.timestamps(false, true);
      table.string('name');
      table.unique('name');
    }),
    knex.schema.createTable('notes_tags', function(table) {
      table.increments('id');
      table.integer('note_id').unsigned();
      table.integer('tag_id').unsigned();
      table.foreign('note_id').references('notes.id');
      table.foreign('tag_id').references('tags.id');
      table.unique(['note_id', 'tag_id']);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('notes'),
    knex.schema.dropTable('tags'),
    knex.schema.dropTable('notes_tags')
  ]);
};
