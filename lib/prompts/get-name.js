'use strict';

const inquirer = require('inquirer');

function getName() {
  return inquirer
    .prompt([{
      name: 'name',
      message: 'Enter a title:'
    }]).then(answer => {
      return answer;
    });
}

module.exports = getName;
