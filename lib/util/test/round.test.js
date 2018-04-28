'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _round = require('../round');

var _round2 = _interopRequireDefault(_round);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tapeCatch2.default)('util/round', function (t) {
    t.equal((0, _round2.default)(1, 0), 1, '1');
    t.equal((0, _round2.default)(1, 2), 1, '2');
    t.equal((0, _round2.default)(1.9, 0), 2, '2.1');
    t.equal((0, _round2.default)(1.5, 1), 1.5, '3');
    t.equal((0, _round2.default)(1.56, 1), 1.6, 'should round up when last decimal place is > 5');
    t.equal((0, _round2.default)(1.55, 1), 1.6, 'should round up when last decimal place is === 5');
    t.equal((0, _round2.default)(1.44, 1), 1.4, 'should round down when last decimal place is < 5');
    t.equal((0, _round2.default)(1.99991, 1), 2, '4');
    t.equal((0, _round2.default)(1.55554, 1), 1.6, '5');
    t.end();
});