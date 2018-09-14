/*
Loads
Should call editor.run() once
Different error options
Should attempt to clean up after a critical error
*/
/* eslint-env node, jest */
'use strict';

const {
  ExternalEditor,
  CreateFileError,
  ReadFileError,
  RemoveFileError,
  LaunchEditorError
} = require('external-editor');
const openEditor = require('../lib/prompts/open-editor');

jest.mock('external-editor');

test('Should load', () => {
  expect(typeof openEditor).toBe('function');
});

test('Should call editor.run once.', () => {
  expect(inquirer.prompt.mock.calls.length).toBe(1);
});
