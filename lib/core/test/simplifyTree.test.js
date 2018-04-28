'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _simplifyTree = require('../simplifyTree');

var _simplifyTree2 = _interopRequireDefault(_simplifyTree);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('core/simplifyTree', function (main) {
    main.test('├ basic expressions', function (t) {
        t.test('├─ irreducible division', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('1/2')));
            t.ok(node.value instanceof _.Token.Division);
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 1 }, { value: 2 }]);
            t.end();
        });
        t.test('├─ reducible division', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('10/20')));
            t.ok(node.value instanceof _.Token.Division);
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 1 }, { value: 2 }]);
            t.end();
        });
        t.test('├─ division by 1', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('20/10')));
            t.ok(node.value instanceof _.Token._Number);
            t.deepEqual(Array.from(node.walk()), [{ value: 2 }]);
            t.end();
        });
        t.test('├─ division by 0', function (t) {
            t.throws(function () {
                return (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('20/0')));
            }, _simplifyTree.ReductionError);
            t.end();
        });
    });
    main.test('├ composed expressions', function (t) {
        t.test('├─ sum of divisions', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('(10/20)+(5/6)')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 4 }, { value: 3 }]);
            t.end();
        });
        t.test('├─ substraction of divisions', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('(6/12)-(4/5)')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: -3 }, { value: 10 }]);
            t.end();
        });
        t.test('├─ product of divisions', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('(8/7)(14/9)')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 16 }, { value: 9 }]);
            t.end();
        });
        t.test('├─ division of divisions', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('(4/6)/(5/17)')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 34 }, { value: 15 }]);
            t.end();
        });
    });
    main.test('more complex expresisons', function (t) {
        t.test('├─ 1', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('((5+5)/20)+(5/6)')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 4 }, { value: 3 }]);
            t.end();
        });
        t.test('├─ 2', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('((3+3)/(6*2))-(2^2/5)')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: -3 }, { value: 10 }]);
            t.end();
        });
        t.test('├─ 3', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('((10-2)/7)(14/3^2)')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 16 }, { value: 9 }]);
            t.end();
        });
        t.test('├─ 4', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('((2+2)/(3*2))/((4+1)/(5*2+7))')));
            t.deepEqual(Array.from(node.walk()), [{ operator: '/', precedence: 1 }, { value: 34 }, { value: 15 }]);
            t.end();
        });
        t.test('├─ 5', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('3*10/30')));
            t.deepEqual(Array.from(node.walk()), [{ value: 1 }]);
            t.end();
        });
        t.test('├─ 6', function (t) {
            var node = (0, _simplifyTree2.default)((0, _.parse)((0, _.lex)('3*(10/30)')));
            t.deepEqual(Array.from(node.walk()), [{ value: 1 }]);
            t.end();
        });
    });
});