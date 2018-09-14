/* eslint-env node, jest */
'use strict';

const getStdin = require('../lib/prompts/get-stdin');

test('Should load', () => {
  expect(typeof getStdin).toBe('function');
});

test('Should return the contents of stdin', () => {
  var input = 'Some example text';

  process.stdin.push(input);
  process.stdin.push(null);

  return getStdin().then((content) => {
    expect(content.toString()).toBe(input);
  });
});
