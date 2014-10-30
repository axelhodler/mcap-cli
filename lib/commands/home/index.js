'use strict';

var fullname = require('fullname');

var menuEntries = [
  {
    name: 'Create a new project',
    value: {
      method: '_createProject'
    }
  },
  {
    name: 'Server',
    value: {
      method: '_server'
    }
  },
  {
    name: 'Find some help',
    value: {
      method: '_findHelp'
    }
  },
  {
    name: 'Get me out of here!',
    value: {
      method: '_exit'
    }
  }
];

module.exports = function (options) {
  var done = this.async();

  options = options || {};

  fullname(function (err, name) {
    if (err) {
      done(err);
      return;
    }

    var allo = name ? ('\'Allo ' + name.split(' ')[0] + '! ') : '\'Allo! ';

    this.prompt([{
      name: 'whatNext',
      type: 'list',
      message: allo + 'What would you like to do?',
      choices: menuEntries
    }], function (answer) {
      this[answer.whatNext.method](done);
    }.bind(this));
  }.bind(this));
};
