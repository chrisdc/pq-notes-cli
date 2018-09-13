/* eslint-env node, jest */
'use strict';

var getConfirmation = require('../lib/prompts/get-confirmation');
var inquirer = require('inquirer');

jest.mock('inquirer');

beforeEach(() => {
  inquirer.prompt.mockResolvedValueOnce(true).mockResolvedValue(false);
});

afterEach(() => {
  inquirer.prompt.mockClear();
});

test('Should call inquirer once', () => {
  return getConfirmation().then(() => {
    expect(inquirer.prompt.mock.calls.length).toBe(1);
  });
});

test('Should default to the standard prompt', () => {
  return getConfirmation().then(() => {
    expect(inquirer.prompt.mock.calls[0][0][0].message).toBe('Are you sure?');
  });
});

test('Should use an alternative prompt if supplied', () => {
  return getConfirmation('Continue?').then(() => {
    expect(inquirer.prompt.mock.calls[0][0][0].message).toBe('Continue?');
  });
});

test('Should use the default value if provided', () => {
  return getConfirmation('Continue?', false).then(() => {
    expect(inquirer.prompt.mock.calls[0][0][0].default).toBeFalsy();
  });
});

test('Should return user input', () => {
  return getConfirmation().then((res) => {
    expect(res).toBeTruthy();
  }).then(() => {
    return getConfirmation();
  }).then((res) => {
    expect(res).toBeFalsy();
  });
});
