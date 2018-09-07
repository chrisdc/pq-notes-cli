'use strict';

// Merge new and exsiting content according to options.
function merge(existingContent, newContent, options) {
  var content;

  if (options.append) {
    content = existingContent + newContent;
  } else if (options.prepend) {
    content = newContent + existingContent;
  } else {
    content = options.content;
  }

  return content;
}

module.exports = merge;
