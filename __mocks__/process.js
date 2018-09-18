/* eslint-env node, jest */

'use strict';

console.log('mocking');

const process = jest.genMockFromModule('process');
const { Duplex } = require('stream');

function __reset() {
  Object.defineProperty(process, 'stdin', new Duplex({
    read() {},
    write() {}
  }));
}

const stdin = new Duplex({
  read() {},
  write() {}
});

process.__reset = __reset;
process.stdin = 'stdin';

module.exports = process;
