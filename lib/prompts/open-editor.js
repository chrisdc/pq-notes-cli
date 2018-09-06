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
  var text;
  var editor;

  try {
    editor = new ExternalEditor();
    text = editor.run();
  } catch (err) {
    // Don't throw anything yet. Attempt to clean up first.
    if (err instanceof CreateFileError) {
      new Error('Failed to create the temporary file');
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
    return text;
  }
}

module.exports = editor;
