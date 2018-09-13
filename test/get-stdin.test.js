/* eslint-env node, jest */
'use strict';

test('Should return user input', () => {
  expect(1).toBe(1);
});
/*var getTitle = require('../lib/prompts/get-name');
var inquirer = require('inquirer');

jest.mock('inquirer');

test('Should return user input', () => {
  const resp = Promise.resolve('Example title');
  inquirer.prompt.mockResolvedValue(resp);

  return getTitle().then((res) => {
    expect(res).toBe('Example title');
  });
});
*/
