'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _gcd = require('../gcd');

var _gcd2 = _interopRequireDefault(_gcd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tapeCatch2.default)('/util/gcd', function (t) {
    t.equal((0, _gcd2.default)(1, 1), 1);
    t.equal((0, _gcd2.default)(2, 4), 2);
    t.equal((0, _gcd2.default)(20, 40), 20);
    t.equal((0, _gcd2.default)(20, 41), 1);
    t.equal((0, _gcd2.default)(2, 1), 1);
    t.equal((0, _gcd2.default)(-15, 5), 5);
    t.equal((0, _gcd2.default)(-15, -5), 5);
    t.throws(function () {
        return (0, _gcd2.default)(1, 0);
    });
    t.throws(function () {
        return (0, _gcd2.default)(0, 0);
    });
    t.end();
});