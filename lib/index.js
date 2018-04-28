'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calculate = require('./calculate');

Object.defineProperty(exports, 'calculate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_calculate).default;
  }
});

var _simplify = require('./simplify');

Object.defineProperty(exports, 'simplify', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_simplify).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }