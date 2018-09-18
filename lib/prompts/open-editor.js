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
    // Don't throw anything yet. Attempt to clean up first.

    if (err instanceof CreateFileError) {
      criticalErr = new Error('Failed to create the temporary file');
    } else if (err instanceof ReadFileError) {
      criticalErr = new Error('Failed to read the temporary file');
    } else if (err instanceof LaunchEditorError) {
      criticalErr = new Error('Failed to launch your editor');
    } else {
      criticalErr = err;
    }
    //criticalErr = err;
  }

  try {
    editor.cleanup();
  } catch (err2) {
    throw err2;
    criticalErr = err;
    /*if (err instanceof RemoveFileError) {
      //console.log('Failed to remove the temporary file');
    } else {
      criticalErr = err;
    }*/
  }

  if (criticalErr) {
    throw criticalErr;
  } else {
    return result;
  }
}

module.exports = editor;
