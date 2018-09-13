'use strict';

const inquirer = require('inquirer');

function getConfirmation(prompt, defaultValue) {
  prompt = prompt || 'Are you sure?';

  if (typeof defaultValue === 'undefined') {
    defaultValue = true;
  }

  return inquirer
    .prompt([{
      type: 'confirm',
      name: 'confirmed',
      default: defaultValue,
      message: prompt
    }]).then(answer => {
      return answer;
    });
}

module.exports = getConfirmation;
