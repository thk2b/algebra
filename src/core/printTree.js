import { Token } from './lex';

export default function printTree(root, separator=''){
    const token = root.value;

    if(token instanceof Token._Number){
        return token.print();
    }
    else if (token instanceof Token.BinaryOperation){
        return [
            printBinaryOperationChildNode(token, root.left, separator),
            token.print(),
            printBinaryOperationChildNode(token, root.right, separator)
        ].join(separator);
    } else {
        throw new Error('cannot print invalid tree');
    };
};

function printBinaryOperationChildNode(binaryOperationToken, node, separator){
    const token = node.value;
    return token instanceof Token.BinaryOperation
        ? binaryOperationToken.isParenthesized || token.precedence < binaryOperationToken.precedence
            ? ['(', printTree(node, separator), ')'].join(separator)
            : printTree(node, separator)
        : token.print()
    ;
};