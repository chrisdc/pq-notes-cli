'use strict';

function getStdin() {
  return new Promise((resolve, reject) => {
    var content = '';

    process.stdin.on('readable', () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        content = content + chunk;
      }
    });

    process.stdin.on('error', (err) => {
      reject(err);
    });

    process.stdin.on('end', () => {
      resolve(content);
    });
  });
}

module.exports = getStdin;
