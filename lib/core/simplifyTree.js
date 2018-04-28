'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReductionError = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = simplifyTree;

var _round = require('../util/round');

var _round2 = _interopRequireDefault(_round);

var _precision = require('../util/precision');

var _precision2 = _interopRequireDefault(_precision);

var _gcd = require('../util/gcd');

var _gcd2 = _interopRequireDefault(_gcd);

var _options = require('../options');

var _options2 = _interopRequireDefault(_options);

var _lex = require('./lex');

var _parse = require('./parse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var min = Math.min,
    max = Math.max,
    pow = Math.pow;

var ReductionError = exports.ReductionError = function ReductionError(node, message) {
    _classCallCheck(this, ReductionError);

    this.node = node;
    this.message = message;
};

;

/**
 * simplifyTree
 * 
 * Reduces an expression to lowest terms.
 * Algorithm:
 * Begin with a root Node.
 * If root is a Number, return the root (Base case 1).
 * Otherwise, recurse on the node's child nodes.
 *   Given base cases 1 and 2, we obtain either a Number or an ireducible Division.
 * If both nodes contain Numbers,
 *   If the root contains a Division, reduce it to lowest terms
 *     And return it.
 *   Otherwise, calculate the resulting Number.
 * Given base cases 1 and 2, at least one of the node must be an ireducible division. 
 * If both nodes do not contain Divisions,
 *   transform the node containing a Number into a division by 1.
 *   We now have two irreducible divisions.
 *   We proceed to return a single Node containing an ireducible Division,
 *     equivalent to the two divisions (Base case 2):
 *   If root is a Division,
 *     Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *       The formula is (a/b)/(c/d) = (a*d)/(b*c).
 *   If the root is an Addition,
 *     Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *       The formula is (a/b)+(c/d) = (a*d + b*c) / (b*d).
 *   If the root is a Substraction,
 *     Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *       The formula is (a/b)-(c/d) = (a*d - b*c) / (b*d).
 *   If the root is a Multiplication,
 *     Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *       The formula is (a/b)*(c/d) = (a*c)/(b*d).
 * Otherwise, the provided tree is invalid.
 * 
 * @param {Node} root – Syntax tree to be reduced
 * @returns {Node} – A node containing either a Token._Number (Base case 1),
 *   or an ireducible Token.Division such that its left and right
 *   nodes are Token._Number and they have no common factor (Base case 2).
 */
function simplifyTree(root) {
    if (!(root instanceof _parse.Node)) {
        throw new TypeError('Expected a Node in calculateTree: got ' + root);
    };
    var token = root.value;

    /* Base case 1: return a Node containing a Token._Number */
    if (token instanceof _lex.Token._Number) return root;

    /* Base case 2: return a Node containing a Token.Division in lowest terms or a Token._Number*/
    var leftNode = simplifyTree(root.left);
    var rightNode = simplifyTree(root.right);
    var leftToken = leftNode.value;
    var rightToken = rightNode.value;

    return rightToken instanceof _lex.Token._Number && leftToken instanceof _lex.Token._Number ? calculateTree(token, leftToken, rightToken) : simplifyDivision(token, leftNode, rightNode);
};

/**
 * CalculateTree
 * 
 * Executes the operation 
 * Returns a node containing Token._number or an ireducible Token.Division
 * 
 * For instance, it reduces divisions of the form `a/b`.
 * 
 * @param {Token} operationToken – The operation to perform with the tokens
 * @param {Token} leftToken 
 * @param {Token} rightToken 
 * @returns {Node}
 */
function calculateTree(operationToken, leftToken, rightToken) {
    var value = void 0;
    var l = leftToken.value;
    var r = rightToken.value;

    if (operationToken instanceof _lex.Token.Division) {
        if (r === 0) {
            throw new ReductionError(operationToken, 'Cannot divide by zero');
        };

        var divisor = (0, _gcd2.default)(l, r);
        var newL = l / divisor;
        var newR = r / divisor;

        return newR === 1 ? new _parse.Node(new _lex.Token._Number(newL)) : new _parse.Node(new _lex.Token.Division(), new _parse.Node(new _lex.Token._Number(newL)), new _parse.Node(new _lex.Token._Number(newR)));
    } else {
        var places = max((0, _precision2.default)(r), (0, _precision2.default)(l));
        var _value = operationToken instanceof _lex.Token.Addition ? (0, _round2.default)(l + r, places) : operationToken instanceof _lex.Token.Substraction ? (0, _round2.default)(l - r, places) : operationToken instanceof _lex.Token.Multiplication ? (0, _round2.default)(l * r, places) : operationToken instanceof _lex.Token.Exponentiation ? (0, _round2.default)(pow(l, r), places) : null;
        if (_value === null) {
            throw new ReductionError(root, 'Cannot calculate non-binary operation');
        };
        return new _parse.Node(new _lex.Token._Number(_value));
    };
};

/**
 * getNumeratorAndDenominator
 * 
 * If the node is a number, returns the number and 1.
 * Otherwise, returns the numerator and denominator of the division.
 * @param {Node} node – Node containing a Token.Number
 * or Token.Division in lowest terms
 * @returns {[Number, Number]} – Numerator and denominator.
 */
function getNumeratorAndDenominator(node) {
    return node.value instanceof _lex.Token._Number ? [node.value.value, 1] : [node.left.value.value, node.right.value.value];
};

/**
 * simplifyDivision
 * 
 * Executes an operation which has at least one ireducible Token.Division as a value.
 * Returns a Token._Number or a Token.Division in lowest terms.
 * 
 * For instance, it reduces divisions of the form `(a/b) * 4` or `(a/b)(c/d)`.
 * 
 * @param {Token} operationToken 
 * @param {Node} leftNode 
 * @param {Node} rightNode
 * @returns {Node}
 */
function simplifyDivision(operationToken, leftNode, rightNode) {
    var _getNumeratorAndDenom = getNumeratorAndDenominator(leftNode),
        _getNumeratorAndDenom2 = _slicedToArray(_getNumeratorAndDenom, 2),
        a = _getNumeratorAndDenom2[0],
        b = _getNumeratorAndDenom2[1];

    var _getNumeratorAndDenom3 = getNumeratorAndDenominator(rightNode),
        _getNumeratorAndDenom4 = _slicedToArray(_getNumeratorAndDenom3, 2),
        c = _getNumeratorAndDenom4[0],
        d = _getNumeratorAndDenom4[1];

    if (b === 0 || d === 0) {
        throw new ReductionError(operationToken, 'Cannot divide by 0');
    };

    var places = max.apply(undefined, _toConsumableArray([a, b, c, d].map(_precision2.default)));

    var _ref = operationToken instanceof _lex.Token.Addition
    /* (a/b)+(c/d) = (a*d+b*c)/(b*d) */
    ? [(0, _round2.default)(a * d + b * c, places), (0, _round2.default)(b * d, places)] : operationToken instanceof _lex.Token.Substraction
    /* (a/b)-(c/d) = (a*d-b*c)/(b*d) */
    ? [(0, _round2.default)(a * d - b * c, places), (0, _round2.default)(b * d, places)] : operationToken instanceof _lex.Token.Multiplication
    /* (a/b)*(c/d) = (a*c)/(b*d) */
    ? [(0, _round2.default)(a * c, places), (0, _round2.default)(b * d, places)] : operationToken instanceof _lex.Token.Division
    /* (a/b)/(c/d) = (a*d)/(b*c) */
    ? [(0, _round2.default)(a * d, places), (0, _round2.default)(b * c, places)] : [null, null],
        _ref2 = _slicedToArray(_ref, 2),
        l = _ref2[0],
        r = _ref2[1];

    if (l === null || r === null) {
        throw new ReductionError(root, 'Cannot calculate non-binary operation');
    };

    var divisor = (0, _gcd2.default)(l, r);
    var newR = r / divisor;
    var newL = l / divisor;

    return newR === 1 ? new _parse.Node(new _lex.Token._Number(newL)) : new _parse.Node(new _lex.Token.Division(), new _parse.Node(new _lex.Token._Number(newL)), new _parse.Node(new _lex.Token._Number(newR)));
};