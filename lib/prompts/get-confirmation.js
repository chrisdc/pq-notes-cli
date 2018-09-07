'use strict';

const inquirer = require('inquirer');

function getConfirmation(prompt) {
  prompt = prompt || 'Are you sure?';

  return inquirer
    .prompt([{
      type: 'confirm',
      name: 'confirmed',
      message: prompt
    }]).then(answer => {
      return answer;
    });
}

module.exports = getConfirmation;
