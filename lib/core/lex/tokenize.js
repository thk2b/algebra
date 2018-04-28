'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = tokenize;

var _Token = require('./Token');

var _Token2 = _interopRequireDefault(_Token);

var _LexError = require('./LexError');

var _LexError2 = _interopRequireDefault(_LexError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * For every character in the expression, finds the first pattern that matches and updates the 
 * tokens and digits with the return value of the pattern's tokenizer.
 * @param {String} expression 
 */
function tokenize(expression) {
    var _expression$split$red = expression.split('').reduce(function (_ref, char, index) {
        var tokens = _ref.tokens,
            digits = _ref.digits;

        var _Object$entries$find = Object.entries(patterns).find(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 1),
                pattern = _ref3[0];

            return new RegExp(pattern).test(char);
        }),
            _Object$entries$find2 = _slicedToArray(_Object$entries$find, 2),
            _ = _Object$entries$find2[0],
            tokenizer = _Object$entries$find2[1];

        return tokenizer(char, tokens, digits);
    }, { tokens: [], digits: [] }),
        tokens = _expression$split$red.tokens,
        digits = _expression$split$red.digits;

    return digits.length > 0 ? tokens.concat(tokenizeDigits(digits)) : tokens;
};

function tokenizeDigits(digits) {
    return new _Token2.default._Number(parseFloat(digits.join('')));
};

function createNonDigitTokenizer(TokenConstructor) {
    return function (char, tokens, digits) {
        var token = new TokenConstructor();
        return {
            tokens: digits.length === 0 ? tokens.concat(token) : tokens.concat(tokenizeDigits(digits), token),
            digits: []
        };
    };
};

/**
 * {pattern<String> : tokenizer<Function(character, tokens, digits)>}
 * Patterns are regular expression strings.
 * Tokenizers are functions of the current character, the tokens and the digits.
 * They must return an object with keys { tokens, digits } coresponding to the new tokens and digits.
 */
var patterns = {
    '\\s': function s(whitespace, tokens, digits) {
        return {
            tokens: digits.length === 0 ? tokens : tokens.concat(tokenizeDigits(digits)),
            digits: []
        };
    },
    '[\\d\\.]': function d(digit, tokens, digits) {
        return {
            tokens: tokens, digits: digits.concat(digit)
        };
    },
    '\\+': createNonDigitTokenizer(_Token2.default.Addition),
    '\\-': createNonDigitTokenizer(_Token2.default.Substraction),
    '\\/': createNonDigitTokenizer(_Token2.default.Division),
    '\\*': createNonDigitTokenizer(_Token2.default.Multiplication),
    '\\^': createNonDigitTokenizer(_Token2.default.Exponentiation),
    '\\(': createNonDigitTokenizer(_Token2.default.OpenParenthesis),
    '\\)': createNonDigitTokenizer(_Token2.default.CloseParenthesis),
    '.': function _(char) {
        throw new _LexError2.default(char);
    }
};