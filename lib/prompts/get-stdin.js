'use strict';

function getStdin() {
  return new Promise((resolve) => {
    var content = '';

    process.stdin.on('readable', () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        content = content + chunk;
      }
    });

    process.stdin.on('end', () => {
      resolve(content);
    });
  });
}

module.exports = getStdin;
