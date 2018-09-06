'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(function() {
      // Inserts seed entries
      return knex('notes').insert([
        {id: 1, name: 'Note 1', content: 'content'},
        {id: 2, name: 'Note 2', content: 'content'},
        {id: 3, name: 'Note 3', content: 'content'}
      ]);
    });
};
