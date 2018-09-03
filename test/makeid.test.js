/* eslint-env node, jest */
'use strict';

//const { expect } = require('chai');
const makeId = require('../lib/makeid');

test('Should load', () => {
  expect(makeId).toBeInstanceOf(Function);
});

test('Should return a string', () => {
  expect(typeof makeId()).toBe('string');
});

test('Should return sequential IDs', () => {
  var IDs = [];

  for (var i = 0; i < 100; i++) {
    IDs.push(makeId());
  }

  for (var i = 1; i < IDs.length; i++) {
    expect(IDs[i] > IDs[i - 1]).toBeTruthy();
  }
});
