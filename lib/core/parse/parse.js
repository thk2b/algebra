'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = parse;

var _lex = require('../lex');

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

var _ParseError = require('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Transforms tokens into a syntax tree.
 * Algorithm:
 * For each token:
 *   If the token is a number,
 *     If the leaf exists, add it to the leaf. The root stays the leaf.
 *     Otherwise, the root becomes the number.
 *   If the token is a binary operation:
 *     If the root does not exist, throw.
 *     If the root is an operator, and has lower precedence than the operator,
 *       Insert the operator between the root and its right child.
 *       The new node becomes the leaf.
 *     Otherwise, the operator becomes the root.
 *       Attatch the previous root to the new root.
 *       The new root becomes the leaf.
 *   If the token is an open parenthesis:
 *     Create a subtree with all the tokens from the next token to the closing parenthesis.
 *     If the subtree root is an operation, it has high precedence.
 *     If the leaf does not exist, the subtree becomes the root.    
 *     Otherwise,    
 *       Attatch the subtree to the leaf.
 *       The root becomes the leaf.
 *     Check the token that immediately follows the closing parenthesis.
 * @param {[Token]} tokens – lexer tokens
 */
function parse(tokens) {
    var _tokens = tokens.slice();

    var _tokens$reduce = _tokens.reduce(function (tree, token, index) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = expectedTokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var expectedToken = _step.value;

                var parseToken = expectedToken(token, index);
                if (parseToken) return parseToken(tree.root, tree.leaf, _tokens);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        ;
        if (token instanceof _lex.Token.CloseParenthesis) {
            throw new _ParseError2.default.UnmatchedParenthesis(token);
        } else {
            throw new _ParseError2.default.ParseError(token);
        };
    }, { root: null, leaf: null }),
        root = _tokens$reduce.root,
        leaf = _tokens$reduce.leaf;

    if (root === null) {
        throw new _ParseError2.default.MissingExpression();
    };
    if (root.count === 1) {
        if (root.value instanceof _lex.Token.BinaryOperation) {
            throw new _ParseError2.default.InvalidOperation(root);
        };
    };
    return root;
};

function findCloseParensIndex(tokens, openParensIndex) {
    var openParensCount = 0;
    var index = tokens.slice(openParensIndex + 1).findIndex(function (token) {
        if (token instanceof _lex.Token.CloseParenthesis) {
            if (openParensCount === 0) return true;
            openParensCount -= 1;
        } else if (token instanceof _lex.Token.OpenParenthesis) {
            openParensCount += 1;
        }
        return false;
    });
    return index === -1 ? index : index + openParensIndex + 1;
};

/**
 * [Function(token) => false || Function(root, leaf) => tree ]
 * Array of functions that take a token and its index. If the function cannot handle the token, return false.
 * Otherwise return a function that takes the root and leaf of the syntax tree and all tokens 
 * and returns the new syntax tree.
 */
var expectedTokens = [function number(token) {
    if (token instanceof _lex.Token._Number) return function parseNumber(root, leaf) {
        var node = new _Node2.default(token);
        if (leaf === null) {
            return { root: node, leaf: node };
        };
        leaf.add(node);
        return { root: root, leaf: root };
    };
    return false;
}, function binaryOperation(token) {
    if (token instanceof _lex.Token.BinaryOperation) return function parseBinaryOperation(root, leaf) {
        if (root === null) throw new _ParseError2.default.InvalidOperation(token, 'Missing left expression');
        if (root.value instanceof _lex.Token.BinaryOperation && token.precedence > root.value.precedence) {
            var node = new _Node2.default(token);
            root.insertRight(node);
            return { root: root, leaf: node };
        } else {
            var newRoot = new _Node2.default(token, root);
            return { root: newRoot, leaf: newRoot };
        };
    };
    return false;
}, function openParenthesis(token, index) {
    if (token instanceof _lex.Token.OpenParenthesis) return function parseOpenParenthesis(root, leaf, tokens) {
        var closingParenthesisIndex = findCloseParensIndex(tokens, index);
        if (closingParenthesisIndex === -1) {
            throw new _ParseError2.default.UnmatchedParenthesis(token);
        };
        var subtreeStartIndex = index + 1;
        var subtreeLength = closingParenthesisIndex - subtreeStartIndex;
        var subExpressionTokens = tokens.slice(index + 1, index + 1 + subtreeLength);
        if (subExpressionTokens.length === 0) {
            throw new _ParseError2.default.MissingExpression();
        };

        var subtreeRoot = parse(subExpressionTokens);
        if (subtreeRoot.value instanceof _lex.Token.BinaryOperation) {
            subtreeRoot.value.precedence += 1;
        }

        tokens.splice(index, subtreeLength + 1);
        if (root === null) {
            return { root: subtreeRoot, leaf: subtreeRoot };
        };
        leaf.add(subtreeRoot);
        return { root: root, leaf: root };
    };
    return false;
}];