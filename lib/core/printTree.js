'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = printTree;

var _lex = require('./lex');

function printTree(root) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var token = root.value;

    if (token instanceof _lex.Token._Number) {
        return token.print();
    } else if (token instanceof _lex.Token.BinaryOperation) {
        return [printBinaryOperationChildNode(token, root.left, separator), token.print(), printBinaryOperationChildNode(token, root.right, separator)].join(separator);
    } else {
        throw new Error('cannot print invalid tree');
    };
};

function printBinaryOperationChildNode(binaryOperationToken, node, separator) {
    var token = node.value;
    return token instanceof _lex.Token.BinaryOperation ? token.precedence <= binaryOperationToken.precedence ? ['(', printTree(node, separator), ')'].join(separator) : printTree(node, separator) : token.print();
};