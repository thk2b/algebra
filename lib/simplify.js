'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (expression) {
    return (0, _core.printTree)((0, _core.simplifyTree)((0, _core.parse)((0, _core.lex)(expression))));
};

var _core = require('./core');

;