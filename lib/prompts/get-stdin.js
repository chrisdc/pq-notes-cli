'use strict';

function getStdin() {
  return new Promise((resolve) => {
    var content = '';

    process.stdin.on('data', (chunk) => {
      content = content + chunk;
    });

    process.stdin.on('end', () => {
      resolve(content);
    });
  });
}

module.exports = getStdin;
