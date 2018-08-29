'use strict';

function don() {
  return new Promise((resolve, reject) => {
    resolve('gg');
  }).then(result => {
    //return result;
    throw new Error('nope');
    //return Promise.reject(new Error('nope'));
  }).catch((err) => {
    console.log('err');
    console.log(err);
  }).then(() => {
    console.log('done');
  });
}

don();
