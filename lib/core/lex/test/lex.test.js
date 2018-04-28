'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _LexError = require('../LexError');

var _LexError2 = _interopRequireDefault(_LexError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tapeCatch2.default)('core/lex', function (main) {
    main.test('├ individual tokens', function (t) {
        main.test('├ whitespace', function (t) {
            var tokens = (0, _2.default)(' ');
            t.equal(tokens.length, 0);
            t.end();
        });
        t.test('├─ numbers', function (t) {
            t.test('├── single digit', function (t) {
                var _lex = (0, _2.default)('1'),
                    _lex2 = _slicedToArray(_lex, 1),
                    token = _lex2[0];

                t.ok(token);
                t.ok(token instanceof _.Token._Number, 'should be a _Number');
                t.equal(token.value, 1);
                t.end();
            });
            t.test('├── multiple digits', function (t) {
                var _lex3 = (0, _2.default)('1234'),
                    _lex4 = _slicedToArray(_lex3, 1),
                    token = _lex4[0];

                t.ok(token);
                t.ok(token instanceof _.Token._Number, 'should be a _Number');
                t.equal(token.value, 1234);
                t.end();
            });
            t.test('├── multiple digits with decimals', function (t) {
                var _lex5 = (0, _2.default)('1234.5678'),
                    _lex6 = _slicedToArray(_lex5, 1),
                    token = _lex6[0];

                t.ok(token);
                t.ok(token instanceof _.Token._Number, 'should be a _Number');
                t.equal(token.value, 1234.5678);
                t.end();
            });
            t.test('├── negative number', function (t) {
                var _lex7 = (0, _2.default)('-1234.5678'),
                    _lex8 = _slicedToArray(_lex7, 1),
                    token = _lex8[0];

                t.equal(token.value, -1234.5678);
                t.ok(token instanceof _.Token._Number);
                t.end();
            });
        });
        t.test('├─ binary operators', function (t) {
            t.test('├── +', function (t) {
                var _lex9 = (0, _2.default)('+'),
                    _lex10 = _slicedToArray(_lex9, 1),
                    token = _lex10[0];

                t.ok(token);
                t.ok(token instanceof _.Token.BinaryOperation, 'should be a BinaryOperation');
                t.ok(token instanceof _.Token.Addition, 'should be an Addition');
                t.equal(token.operator, '+');
                t.equal(token.precedence, 0, 'should have the correct precedence');
                t.end();
            });
            t.test('├── -', function (t) {
                t.test('├─── operator', function (t) {
                    var _lex11 = (0, _2.default)('1-2'),
                        _lex12 = _slicedToArray(_lex11, 3),
                        x = _lex12[0],
                        token = _lex12[1],
                        y = _lex12[2];

                    t.ok(token);
                    t.ok(token instanceof _.Token.BinaryOperation, 'should be a BinaryOperation');
                    t.ok(token instanceof _.Token.Substraction, 'should be an Substraction');
                    t.equal(token.operator, '-');
                    t.equal(token.precedence, 0, 'should have the correct precedence');
                    t.end();
                });
                t.test('├─── interpreted as a multiplication by -1 when at the start of expression', function (t) {
                    var _lex13 = (0, _2.default)('-1234.5678'),
                        _lex14 = _slicedToArray(_lex13, 1),
                        token = _lex14[0];

                    t.equal(token.value, -1234.5678);
                    t.ok(token instanceof _.Token._Number);
                    t.end();
                });
                t.test('├─── interpreted as a multiplication by -1 following another operator', function (t) {
                    var tokens = (0, _2.default)('1+-2');
                    t.equal(tokens.length, 3, 'should find 3 tokens');
                    t.deepEqual(tokens, [{ value: 1 }, { operator: '+', precedence: 0 }, { value: -2 }]);
                    t.end();
                });
                t.test('├─ -a -b', function (t) {
                    var tokens = (0, _2.default)('-1-2');
                    t.deepEqual(tokens, [{ value: -1 }, { operator: '-', precedence: 0 }, { value: 2 }]);
                    t.end();
                });
                t.test('├─── interpreted as a multiplication by -1 following an open parenthesis', function (t) {
                    var tokens = (0, _2.default)('0*(-1+2)');
                    t.equal(tokens.length, 7, 'should find 9 tokens');
                    t.deepEqual(tokens, [{ value: 0 }, { operator: '*', precedence: 1 }, {}, { value: -1 }, { operator: '+', precedence: 0 }, { value: 2 }, {}]);
                    t.end();
                });
            });
            t.test('├── *', function (t) {
                t.test('├─── operator', function (t) {
                    var _lex15 = (0, _2.default)('*'),
                        _lex16 = _slicedToArray(_lex15, 1),
                        token = _lex16[0];

                    t.ok(token);
                    t.ok(token instanceof _.Token.BinaryOperation, 'should be a BinaryOperation');
                    t.ok(token instanceof _.Token.Multiplication, 'should be a Multiplication');
                    t.equal(token.operator, '*');
                    t.equal(token.precedence, 1, 'should have the correct precedence');
                    t.end();
                });
                t.test('├─── implicit multiplication with a number', function (t) {
                    var tokens = (0, _2.default)('1(2 + 3)');
                    t.equal(tokens.length, 7, 'should add a Multiplication token');
                    t.deepEqual(tokens, [{ value: 1 }, { operator: '*', precedence: 1 }, {}, { value: 2 }, { operator: '+', precedence: 0 }, { value: 3 }, {}]);
                    t.end();
                });
                t.test('├─── implicit multiplication with an open parenthesis', function (t) {
                    var tokens = (0, _2.default)('(3 + 7)(2 + 3)');
                    t.deepEqual(tokens, [{}, { value: 3 }, { operator: '+', precedence: 0 }, { value: 7 }, {}, { operator: '*', precedence: 1 }, {}, { value: 2 }, { operator: '+', precedence: 0 }, { value: 3 }, {}]);
                    t.end();
                });
            });
            t.test('├── /', function (t) {
                var _lex17 = (0, _2.default)('/'),
                    _lex18 = _slicedToArray(_lex17, 1),
                    token = _lex18[0];

                t.test('├─── operator', function (t) {
                    t.ok(token);
                    t.ok(token instanceof _.Token.BinaryOperation, 'should be a BinaryOperation');
                    t.ok(token instanceof _.Token.Division, 'should be a Division');
                    t.equal(token.operator, '/');
                    t.equal(token.precedence, 1, 'should have the correct precedence');
                    t.end();
                });
                t.test('├─── negative division', function (t) {
                    var tokens = (0, _2.default)('-4/-2');
                    t.deepEqual(tokens, [{ value: -4 }, { operator: '/', precedence: 1 }, { value: -2 }]);
                    t.end();
                });
            });
            t.test('├── ^', function (t) {
                var _lex19 = (0, _2.default)('^'),
                    _lex20 = _slicedToArray(_lex19, 1),
                    token = _lex20[0];

                t.test('├─── operator', function (t) {
                    t.ok(token);
                    t.ok(token instanceof _.Token.BinaryOperation, 'should be a BinaryOperation');
                    t.ok(token instanceof _.Token.Exponentiation, 'should be a Division');
                    t.equal(token.operator, '^');
                    t.equal(token.precedence, 2, 'should have the correct precedence');
                    t.end();
                });
            });
        });
        t.test('├─ parentheses', function (t) {
            t.test('├── open', function (t) {
                var _lex21 = (0, _2.default)('('),
                    _lex22 = _slicedToArray(_lex21, 1),
                    token = _lex22[0];

                t.ok(token);
                t.ok(token instanceof _.Token.OpenParenthesis, 'should be an OpenParenthesis');
                t.end();
            });
            t.test('├── close', function (t) {
                var _lex23 = (0, _2.default)(')'),
                    _lex24 = _slicedToArray(_lex23, 1),
                    token = _lex24[0];

                t.ok(token);
                t.ok(token instanceof _.Token.CloseParenthesis, 'should be a CloseParenthesis');
                t.end();
            });
        });
        t.test('├─ invalid token', function (t) {
            t.throws(function () {
                return (0, _2.default)('@');
            }, _LexError2.default);
            t.end();
        });
    });
    main.test('├ full expression ', function (t) {
        var tokens = (0, _2.default)('1+22*33.33/444.444');
        t.equal(tokens.length, 7, 'should find 7 tokens');
        t.ok(tokens[0] instanceof _.Token._Number, '0 is a _Number');
        t.equal(tokens[0].value, 1);
        t.ok(tokens[1] instanceof _.Token.Addition, '1 is an Addition');
        t.ok(tokens[2] instanceof _.Token._Number, '2 is a _Number');
        t.equal(tokens[2].value, 22);
        t.ok(tokens[3] instanceof _.Token.Multiplication, '3 is an Multiplication');
        t.ok(tokens[4] instanceof _.Token._Number, '4 is a _Number');
        t.equal(tokens[4].value, 33.33);
        t.ok(tokens[5] instanceof _.Token.Division, '5 is an Division');
        t.ok(tokens[6] instanceof _.Token._Number, '6 is a _Number');
        t.equal(tokens[6].value, 444.444);
        t.equal(tokens[7], undefined, '7 is undefined');
        t.end();
    });
});