/* eslint-env node, jest */
'use strict';

var getTitle = require('../lib/prompts/get-name');
var inquirer = require('inquirer');

jest.mock('inquirer');

beforeEach(() => {
  /*inquirer.prompt.mockResolvedValueOnce(true).mockResolvedValue(false);
  const resp = Promise.resolve('Example title');*/
  inquirer.prompt.mockResolvedValue('Example title');
});

afterEach(() => {
  inquirer.prompt.mockClear();
});

test('Should load', () => {
  expect(typeof getTitle).toBe('function');
});

test('Should call inquirer once', ()=> {
  return getTitle().then(() => {
    expect(inquirer.prompt.mock.calls.length).toBe(1);
  });
});

test('Should return user input', () => {
  return getTitle().then((res) => {
    expect(res).toBe('Example title');
  });
});
