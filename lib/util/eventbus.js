'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var EventBus = function() {};
util.inherits(EventBus, EventEmitter);

EventBus.prototype.CMD_EVENT = 'CMD_EVENT';

module.exports = new EventBus();
