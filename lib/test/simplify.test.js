'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _simplify = require('../simplify');

var _simplify2 = _interopRequireDefault(_simplify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('/simplify', function (main) {
    /* Internals are throughly tested at simplifyTree.test.js */
    main.test('├─ basic operations', function (t) {
        t.deepEqual((0, _simplify2.default)('1/2'), '1/2');
        t.deepEqual((0, _simplify2.default)('20/40'), '1/2');
        t.deepEqual((0, _simplify2.default)('1+2'), '3');
        t.deepEqual((0, _simplify2.default)('1*2'), '2');
        t.deepEqual((0, _simplify2.default)('1-2'), '-1');
        t.deepEqual((0, _simplify2.default)('2^2'), '4');
        t.end();
    });
    main.test('├─ operations', function (t) {
        t.deepEqual((0, _simplify2.default)('(6^2)/(5*3*2)'), '6/5');
        t.deepEqual((0, _simplify2.default)('(10-3)/(5+9)'), '1/2');
        t.deepEqual((0, _simplify2.default)('(15/5)/(100/10)'), '3/10');
        t.deepEqual((0, _simplify2.default)('(8/7)(14/9)'), '16/9');
        t.end();
    });
});