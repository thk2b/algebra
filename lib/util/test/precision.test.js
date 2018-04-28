'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _precision = require('../precision');

var _precision2 = _interopRequireDefault(_precision);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tapeCatch2.default)('util/precision', function (t) {
    t.equal((0, _precision2.default)(1), 0);
    t.equal((0, _precision2.default)(1.1), 1);
    t.equal((0, _precision2.default)(1.11), 2);
    t.equal((0, _precision2.default)(1.111), 3);
    t.equal((0, _precision2.default)(1.1111), 4);
    /*...*/
    t.end();
});