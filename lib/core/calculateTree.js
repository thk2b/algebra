'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CalculationError = undefined;
exports.default = calculateTree;

var _round = require('../util/round');

var _round2 = _interopRequireDefault(_round);

var _precision = require('../util/precision');

var _precision2 = _interopRequireDefault(_precision);

var _options = require('../options');

var _options2 = _interopRequireDefault(_options);

var _lex = require('./lex');

var _parse = require('./parse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var min = Math.min,
    max = Math.max,
    pow = Math.pow;

var CalculationError = exports.CalculationError = function CalculationError(node, message) {
    _classCallCheck(this, CalculationError);

    this.node = node;
    this.message = message;
};

;

/**
 * Calculates the result of an expression.
 * @param {Node} root – Syntax tree to be calculated
 * @returns {Node} – A node containing the resulting Token.
 */
function calculateTree(root) {
    if (!(root instanceof _parse.Node)) throw new TypeError('Expected a Node in calculateTree: got ' + root);
    var token = root.value;
    if (token instanceof _lex.Token._Number) return root;

    var l = calculateTree(root.left).value.value;
    var r = calculateTree(root.right).value.value;

    var value = null;
    switch (token.constructor) {
        case _lex.Token.Addition:
            value = (0, _round2.default)(l + r, max((0, _precision2.default)(l), (0, _precision2.default)(r)));
            break;
        case _lex.Token.Substraction:
            value = (0, _round2.default)(l - r, max((0, _precision2.default)(l), (0, _precision2.default)(r)));
            break;
        case _lex.Token.Multiplication:
            value = (0, _round2.default)(l * r, max((0, _precision2.default)(l), (0, _precision2.default)(r)));
            break;
        case _lex.Token.Division:
            if (r === 0) throw new CalculationError(root, 'Cannot divide by zero');
            value = (0, _round2.default)(l / r, max(_options2.default.precision, (0, _precision2.default)(l), (0, _precision2.default)(r)));
            break;
        case _lex.Token.Exponentiation:
            value = (0, _round2.default)(pow(l, r), max((0, _precision2.default)(l), (0, _precision2.default)(r)));
            break;
        default:
            throw new CalculationError(root, 'Cannot calculate non-binary operation');
    };
    return new _parse.Node(new _lex.Token._Number(value));
};