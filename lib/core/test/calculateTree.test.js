'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _calculateTree = require('../calculateTree');

var _calculateTree2 = _interopRequireDefault(_calculateTree);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('core/calculateTree', function (main) {
    main.test('├ basic operations', function (t) {
        t.test('├─ with +', function (t) {
            var node = (0, _calculateTree2.default)((0, _.parse)((0, _.lex)('1 + 1')));
            t.ok(node instanceof _.Node);
            t.ok(node.value instanceof _.Token._Number);
            t.deepEqual(node.value, { value: 2 });
            t.end();
        });
        t.test('├─ with -', function (t) {
            var node = (0, _calculateTree2.default)((0, _.parse)((0, _.lex)('1 -10')));
            t.ok(node instanceof _.Node);
            t.ok(node.value instanceof _.Token._Number);
            t.deepEqual(node.value, { value: -9 });
            t.end();
        });
        t.test('├─ with *', function (t) {
            var node = (0, _calculateTree2.default)((0, _.parse)((0, _.lex)('2 * 10')));
            t.ok(node instanceof _.Node);
            t.ok(node.value instanceof _.Token._Number);
            t.deepEqual(node.value, { value: 20 });
            t.end();
        });
        t.test('├─ with /', function (t) {
            var node = (0, _calculateTree2.default)((0, _.parse)((0, _.lex)('10 / 2')));
            t.ok(node instanceof _.Node);
            t.ok(node.value instanceof _.Token._Number);
            t.deepEqual(node.value, { value: 5 });
            t.test('├── division by 0', function (t) {
                t.throws(function () {
                    return (0, _calculateTree2.default)((0, _.parse)((0, _.lex)('10/0')));
                }, _calculateTree.CalculationError);
                t.end();
            });
            t.end();
        });
        t.test('├─ nested operation', function (t) {
            var node = (0, _calculateTree2.default)((0, _.parse)((0, _.lex)('10 / 2 + 5')));
            t.ok(node instanceof _.Node);
            t.ok(node.value instanceof _.Token._Number);
            t.deepEqual(node.value, { value: 10 });
            t.end();
        });
        t.test('├─ invalid operation', function (t) {
            t.throws(function () {
                return (0, _calculateTree2.default)(new _.Node(new _.Token.OpenParenthesis(), new _.Node(new _.Token._Number(1)), new _.Node(new _.Token._Number(1))));
            }, _calculateTree.CalculationError);
            t.end();
        });
        t.test('├─ with ^', function (t) {
            var node = (0, _calculateTree2.default)((0, _.parse)((0, _.lex)('10 ^ 2')));
            t.ok(node instanceof _.Node);
            t.ok(node.value instanceof _.Token._Number);
            t.deepEqual(node.value, { value: 100 });
            t.end();
        });
        t.test('├─ result should always be in the same precision as the most precise input', function (t) {
            t.equal((0, _calculateTree2.default)((0, _.parse)((0, _.lex)('1.11111 + 0'))).value.value, 1.11111);
            t.end();
        });
        t.test('├── rounding', function (t) {
            t.equal((0, _calculateTree2.default)((0, _.parse)((0, _.lex)('2/3'))).value.value, 0.667, 'division should be rounded to 3 decimal places by default');
            t.end();
        });
        t.test('├── precision', function (t) {
            t.equal((0, _calculateTree2.default)((0, _.parse)((0, _.lex)('1.11111 + 0'))).value.value, 1.11111, 'should be in the same precision as the most precise input');
            t.end();
        });
    });
});