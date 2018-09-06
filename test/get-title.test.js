/* eslint-env node, jest */
'use strict';

var getTitle = require('../lib/prompts/get-name');
var inquirer = require('inquirer');

jest.mock('inquirer');

test('Should return user input', () => {
  const resp = Promise.resolve('Example title');
  inquirer.prompt.mockResolvedValue(resp);

  return getTitle().then((res) => {
    expect(res).toBe('Example title');
  });
});
