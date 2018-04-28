'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = calculate;

var _core = require('./core');

/**
 * 
 * @param {String} expression - The algebraic expression to evaluate
 */

function calculate(expression) {
    return (0, _core.calculateTree)((0, _core.parse)((0, _core.lex)(expression))).value.value;
};