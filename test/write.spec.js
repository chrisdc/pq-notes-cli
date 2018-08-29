/* eslint-env node, mocha */
'use strict';

const { expect } = require('chai');
const write = require('../lib/write');
const sinon = require('sinon');
const db = require('../lib/db');
const editor = require('../lib/editor');

describe('makeId', () => {
  it('Should load', () => {
    expect(write).to.be.a('function');
  });

  it('Should accept a content option', (done) => {
    //sinon.stub(db.prototype, 'put', () => 'mock');
    sinon.stub(db, 'put').callsFake(() => {
      return 'mock';
    });

    write('note title', {
      content: 'note content'
    }).then(() => {
      sinon.assert.calledOnce(db.put);
      db.put.restore();
      done();
    });
  });

  it('Should load an editor if not given content', (done) => {
    sinon.stub(editor).callsFake(() => {
      return 'mock';
    });

    write('note title').then(() => {
      sinon.assert.calledOnce(editor);
      //db.put.restore();
      done();
    });
  });
});
