'use strict';

const {
  ExternalEditor,
  CreateFileError,
  ReadFileError,
  RemoveFileError,
  LaunchEditorError
} = require('external-editor');

function editor(text) {
  var criticalErr;
  var result;
  var editor;

  try {
    editor = new ExternalEditor(text);
    result = editor.run();
  } catch (err) {
    // If the temp file has been created attempt to cleanup before throwing
    // the error.
    if (err instanceof CreateFileError) {
      throw new Error('Failed to create the temporary file');
    } else if (err instanceof ReadFileError) {
      criticalErr = new Error('Failed to read the temporary file');
    } else if (err instanceof LaunchEditorError) {
      criticalErr = new Error('Failed to launch your editor');
    } else {
      criticalErr = err;
    }
  }

  try {
    editor.cleanup();
  } catch (err) {
    if (err instanceof RemoveFileError) {
      console.log('Failed to remove the temporary file');
    } else {
      criticalErr = err;
    }
  }

  if (criticalErr) {
    throw criticalErr;
  } else {
    return result;
  }
}

module.exports = editor;
