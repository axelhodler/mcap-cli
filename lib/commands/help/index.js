'use strict';

var opn = require('opn');

module.exports = function () {

  this.prompt([{
    name: 'whereTo',
    type: 'list',
    message:
      'Here are a few helpful resources.\n' +
      '\nI will open the link you select in your browser for you',
    choices: [{
      name: 'Take me to the documentation',
      value: 'https://wiki.mwaysolutions.com/confluence/display/mCAP/Home'
    }, {
      name: 'File an issue on GitHub',
      value: 'http://github.com/mwaylabs/mcap-cli'
    }, {
      name: 'Take me back home',
      value: {
        method: '_home'
      }
    }]
  }], function (answer) {

    if (this._.isFunction(this[answer.whereTo.method])) {
      this[answer.whereTo.method](answer.whereTo.args);
    } else {
      opn(answer.whereTo);
    }
  }.bind(this));
};
