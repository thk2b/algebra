'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LexError = exports.Token = undefined;

var _Token = require('./Token');

Object.defineProperty(exports, 'Token', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Token).default;
  }
});

var _LexError = require('./LexError');

Object.defineProperty(exports, 'LexError', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_LexError).default;
  }
});
exports.default = lex;

var _transform = require('./transform');

var _transform2 = _interopRequireDefault(_transform);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseFloat = Number.parseFloat;

/** 
 * Lexer. Takes an input string and returns a list of tokens.
 * Algorithm:
 * Initialization:
 *   We store a temporary stack of digits and the final list of tokens.
 * For every character of the input string:
 *   If the character is a digit, push it to the digit stack and check the next character.
 *   Otherwise,
 *     If there are digits on the digit stack, 
 *       combine them into a number and clear the digit stack.
 *       Add the number to the list of tokens.
 *     If the character is a binary operator,
 *       add it to the list of tokens and check the next character.
 *     If the character is a parenthesis,
 *       add it to the list of tokens and check the next character.
 * Then, transform the resulting tokens:
 * For each token,
 *  If the token is a substraction immediately following undefined, another binary operation, or an opening parenthesis,
 *    and the next token is a number, (negative number) negate the number and remove the substraction from the tokens.
 *  If the token is a number or a closing aprenthesis followed by an opening parenthesis, (implicit multiplication)
 *    insert a multiplication between the token ans the opening parenthesis. 
 * @param {String} expression – Input expression.
 * @returns {[ Tokens ]} tokens - List of tokens.
 */

function lex(expression) {
  return (0, _transform2.default)((0, _tokenize2.default)(expression));
};