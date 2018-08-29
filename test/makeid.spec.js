/* eslint-env node, mocha */
'use strict';

const { expect } = require('chai');
const makeId = require('../lib/makeid');

describe('makeId', () => {
  it('Should load', () => {
    expect(makeId).to.be.a('function');
  });

  it('Should return a string', () => {
    expect(makeId()).to.be.a('string');
  });

  it('Should return sequential IDs', () => {
    var IDs = [];

    for (var i = 0; i < 100; i++) {
      IDs.push(makeId());
    }

    for (var i = 1; i < IDs.length; i++) {
      expect(IDs[i] > IDs[i - 1]).to.be.true;
    }
  });
});
