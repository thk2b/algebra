'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = transform;

var _Token = require('./Token');

var _Token2 = _interopRequireDefault(_Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Runs all transformations on the tokens.
 * For each transformation, run the transformation on each token.
 * The token passed to transformations is taken from the tokens
 * returned from the transformation of the previous token.
 * @param {{Token}} tokens – Tokens to analyze and transform
 * @returns {[Token]} – Array of transformed tokens
 */
function transform(tokens) {
    return transformations.reduce(function (transformedTokens, transformation) {
        return transformedTokens.reduce(function (transformingTokens, _, index) {
            /* Transformations can alter the number of tokens.
            ** If we removed a token, the current token (_) is one element ahead.
            ** So the correct token to pass to the transformation is the transformingTokens at the current index.
            */
            var offsetToken = transformingTokens[index];
            if (offsetToken === undefined) return transformingTokens;
            return transformation(transformingTokens, offsetToken, index);
        }, transformedTokens);
    }, tokens);
};

/**
 * [Function(tokens, token, index), ...]
 * Transformations are functions of the tokens, current token an index of the current token.
 * Must returns the tokens, even if no changes were made.
 * May remove or add tokens.
 */
var transformations = [function negativeNumber(tokens, token, index) {
    if (!(token instanceof _Token2.default.Substraction)) return tokens;
    var prev = tokens[index - 1];
    var next = tokens[index + 1];
    /* Transform substractions that 
     *   - are the first character of an expression
     *   - follow a binary operation
     *   - follow a closed parenthesis
     * into a nugative number
     */
    if (prev === undefined || prev instanceof _Token2.default.BinaryOperation || prev instanceof _Token2.default.OpenParenthesis) {
        if (next instanceof _Token2.default._Number) {
            return [].concat(_toConsumableArray(tokens.slice(0, index)), [new _Token2.default._Number(-1 * next.value)], _toConsumableArray(tokens.slice(index + 2)));
        }
        if (next instanceof _Token2.default.OpenParenthesis) return [].concat(_toConsumableArray(tokens.slice(0, index)), [new _Token2.default._Number(-1), new _Token2.default.Multiplication()], _toConsumableArray(tokens.slice(index)));
    };
    return tokens;
}, function implicitMultiplication(tokens, token, index) {
    if (token instanceof _Token2.default._Number || token instanceof _Token2.default.CloseParenthesis) {
        var next = tokens[index + 1];
        if (next instanceof _Token2.default.OpenParenthesis) {
            return [].concat(_toConsumableArray(tokens.slice(0, index + 1)), [new _Token2.default.Multiplication()], _toConsumableArray(tokens.slice(index + 1)));
        };
    };
    return tokens;
}];