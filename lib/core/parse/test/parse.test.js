'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _ = require('../../');

var _2 = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tapeCatch2.default)('core/parse', function (main) {
    main.test('├ number', function (t) {
        var tokens = (0, _.lex)('1');
        var root = (0, _.parse)(tokens);
        t.ok(root instanceof _.Node);
        t.ok(root.value instanceof _.Token._Number);
        t.end();
    });
    main.test('├ negative number', function (t) {
        var tokens = (0, _.lex)('-1');
        var root = (0, _.parse)(tokens);
        t.ok(root.value instanceof _.Token._Number);
        t.equal(root.value.value, -1);
        t.end();
    });

    main.test('├ simple expressions', function (t) {
        t.test('├─ addition', function (t) {
            var tokens = (0, _.lex)('10 + 2.5');
            var root = (0, _.parse)(tokens);
            t.ok(root.value instanceof _.Token.Addition);
            t.ok(root.left.value instanceof _.Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof _.Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ substraction', function (t) {
            var tokens = (0, _.lex)('10 - 2.5');
            var root = (0, _.parse)(tokens);
            t.ok(root.value instanceof _.Token.Substraction);
            t.ok(root.left.value instanceof _.Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof _.Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ multiplication', function (t) {
            var tokens = (0, _.lex)('10 * 2.5');
            var root = (0, _.parse)(tokens);
            t.ok(root.value instanceof _.Token.Multiplication);
            t.ok(root.left.value instanceof _.Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof _.Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ division', function (t) {
            var tokens = (0, _.lex)('10 / 2.5');
            var root = (0, _.parse)(tokens);
            t.ok(root.value instanceof _.Token.Division);
            t.ok(root.left.value instanceof _.Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof _.Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ exponentiation', function (t) {
            var tokens = (0, _.lex)('2 ^ 4');
            var root = (0, _.parse)(tokens);
            t.ok(root.value instanceof _.Token.Exponentiation);
            t.ok(root.left.value instanceof _.Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 2);
            t.ok(root.right.value instanceof _.Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 4);
            t.end();
        });
    });

    main.test('├ more complex expressions', function (t) {
        t.test('├─ a * b / c * d', function (t) {
            var root = (0, _.parse)((0, _.lex)('1*2/3*4'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '*', precedence: 1 }, { operator: '/', precedence: 1 }, { operator: '*', precedence: 1 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]);
            t.end();
        });
        t.test('├─ -a / -b', function (t) {
            var root = (0, _.parse)((0, _.lex)('-4/-2'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '/', precedence: 1 }, { value: -4 }, { value: -2 }]);
            t.end();
        });
        t.test('├─ -a -b', function (t) {
            var root = (0, _.parse)((0, _.lex)('-1-2'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '-', precedence: 0 }, { value: -1 }, { value: 2 }]);
            t.end();
        });
        t.test('├─ a + b + c', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 + 20 + 3.5'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { operator: '+', precedence: 0 }, { value: 1 }, { value: 20 }, { value: 3.5 }]);
            t.end();
        });
        t.test('├─ a + b + c - d - e', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 + 20 + 3.5 - 4 - 5'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '-', precedence: 0 }, { operator: '-', precedence: 0 }, { operator: '+', precedence: 0 }, { operator: '+', precedence: 0 }, { value: 1 }, { value: 20 }, { value: 3.5 }, { value: 4 }, { value: 5 }]);
            t.end();
        });
        t.test('├─ a * b + c ', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 * 20 + 3.5'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { operator: '*', precedence: 1 }, { value: 1 }, { value: 20 }, { value: 3.5 }]);
            t.end();
        });
        t.test('├─ a + b * c ', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 + 20 * 3.5'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { value: 1 }, { operator: '*', precedence: 1 }, { value: 20 }, { value: 3.5 }]);
            t.end();
        });
        t.test('├─ a + b * c - e / f', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 + 20 * 3.5 - 4 / 5'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '-', precedence: 0 }, { operator: '+', precedence: 0 }, { value: 1 }, { operator: '*', precedence: 1 }, { value: 20 }, { value: 3.5 }, { operator: '/', precedence: 1 }, { value: 4 }, { value: 5 }]);
            t.end();
        });
        t.test('├─ a ^ b + c ', function (t) {
            var root = (0, _.parse)((0, _.lex)('4 + 2 ^ 3'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { value: 4 }, { operator: '^', precedence: 2 }, { value: 2 }, { value: 3 }]);
            t.end();
        });
        t.test('├─ a * b ^ c ', function (t) {
            var root = (0, _.parse)((0, _.lex)('4 * 2 ^ 3'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '*', precedence: 1 }, { value: 4 }, { operator: '^', precedence: 2 }, { value: 2 }, { value: 3 }]);
            t.end();
        });
        t.test('├─ a ^ b ^ c ^ c', function (t) {
            var root = (0, _.parse)((0, _.lex)('2 ^ 2 ^ 2 ^ 2'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '^', precedence: 2 }, { operator: '^', precedence: 2 }, { operator: '^', precedence: 2 }, { value: 2 }, { value: 2 }, { value: 2 }, { value: 2 }]);
            t.end();
        });
    });

    main.test('├ expressions with parentheses', function (t) {
        t.test('├─ a + (b + c)', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 + (20 + 3.5)'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { value: 1 }, { operator: '+', precedence: 1 }, { value: 20 }, { value: 3.5 }]);
            t.end();
        });
        t.test('├─ (a + b) * c ', function (t) {
            var root = (0, _.parse)((0, _.lex)('(1 + 20) * 3.5'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '*', precedence: 1 }, { operator: '+', precedence: 1 }, { value: 1 }, { value: 20 }, { value: 3.5 }]);
            t.end();
        });
        t.test('├─ a + (b + (c + d))', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 + (2 + (3 + 4))'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { value: 1 }, { operator: '+', precedence: 1 }, { value: 2 }, { operator: '+', precedence: 1 }, { value: 3 }, { value: 4 }]);
            t.end();
        });
        t.test('├─ a + (b + (c - (d - e)))', function (t) {
            var root = (0, _.parse)((0, _.lex)('1 + (20 + (3.5 - (4 - 5)))'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { value: 1 }, { operator: '+', precedence: 1 }, { value: 20 }, { operator: '-', precedence: 1 }, { value: 3.5 }, { operator: '-', precedence: 1 }, { value: 4 }, { value: 5 }]);
            t.end();
        });
        t.test('├─ a + (b + c) * d', function (t) {
            var root = (0, _.parse)((0, _.lex)('0 + (1 + 20) * 3.5'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { value: 0 }, { operator: '*', precedence: 1 }, { operator: '+', precedence: 1 }, { value: 1 }, { value: 20 }, { value: 3.5 }]);
            t.end();
        });
        t.test('├─ a + ( b * ( c + ( d - e )) * f )', function (t) {
            var root = (0, _.parse)((0, _.lex)('1+(2*(3+(4-5))*6)'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '+', precedence: 0 }, { value: 1 }, { operator: '*', precedence: 2 }, { operator: '*', precedence: 1 }, { value: 2 }, { operator: '+', precedence: 1 }, { value: 3 }, { operator: '-', precedence: 1 }, { value: 4 }, { value: 5 }, { value: 6 }]);
            t.end();
        });
        t.test('├─ a ^ (b ^ (c ^ d))', function (t) {
            var root = (0, _.parse)((0, _.lex)('2 ^ ( 2 ^ ( 2 ^ 2 ))'));
            var walk = Array.from(root);
            t.deepEqual(walk, [{ operator: '^', precedence: 2 }, { value: 2 }, { operator: '^', precedence: 3 }, { value: 2 }, { operator: '^', precedence: 3 }, { value: 2 }, { value: 2 }]);
            t.end();
        });
        t.test('├─ wrapping the entire expression in parentheses', function (t) {
            var tokens = (0, _.lex)('(((10 / 2.5)))');
            var root = (0, _.parse)(tokens);
            t.ok(root.value instanceof _.Token.Division);
            t.ok(root.left.value instanceof _.Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof _.Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
    });

    main.test('├ syntax ParseErrors', function (t) {
        t.test('├─ binary operations', function (t) {
            t.test('├── no left operand', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('* 2'));
                }, _2.ParseError.InvalidOperation);
                t.end();
            });
            t.test('├── two adjacent operands', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('2 * /'));
                }, _2.ParseError.InvalidOperation);
                t.end();
            });
            t.test('├── no right operand', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('2 + '));
                }, _2.ParseError.InvalidOperation);
                t.end();
            });
            t.test('├─ no operands', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('*'));
                }, _2.ParseError.InvalidOperation);
                t.end();
            });
        });
        t.test('├─ parentheses', function (t) {
            t.test('├── no closing parenthesis ', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('(1 - 2 '));
                }, _2.ParseError.UnmatchedParenthesis);
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('1 - ( 2 '));
                }, _2.ParseError.UnmatchedParenthesis, 'throws when missing parenthesis somwhere in the expresison');
                t.end();
            });
            t.test('├── no opening parenthesis', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('1 - 2 )'));
                }, _2.ParseError.UnmatchedParenthesis);
                t.end();
            });
        });
        t.test('├─ empty expression', function (t) {
            t.test('├── inside parentheses', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('()'));
                }, _2.ParseError.MissingExpression);
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)('1 + ()'));
                }, _2.ParseError.MissingExpression, 'shoud throw when there are empty parens in the expression');
                t.end();
            });
            t.test('├── empty input', function (t) {
                t.throws(function () {
                    return (0, _.parse)((0, _.lex)(' '));
                }, _2.ParseError.MissingExpression);
                t.end();
            });
        });
    });
});