import { Token } from '../lex';
import Node from './Node';
import _SyntaxError from '../../Errors/Syntax';

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
export default function parse(tokens){
    const _tokens = tokens.slice();
    const { root, leaf } = _tokens.reduce(
        (tree, token, index) => {
            for(let expectedToken of expectedTokens){
                const parseToken = expectedToken(token, index);
                if(parseToken) return parseToken(tree.root, tree.leaf, _tokens);
            };
            if(token instanceof Token.CloseParenthesis){
                throw new _SyntaxError.UnmatchedParenthesis(token);
            } else {
                throw new _SyntaxError.SyntaxError(token);
            };
        }
    , { root: null, leaf: null });
    if(root === null){
        throw new _SyntaxError.EmptyExpression();
    };
    if(root.count === 1){
        if(root.value instanceof Token.BinaryOperation){
            throw new _SyntaxError.MissingNumber(root.value);
        };
    };
    return root;
};

function findCloseParensIndex(tokens, openParensIndex){
    let openParensCount = 0;
    const index = tokens.slice(openParensIndex + 1).findIndex( token => {
        if(token instanceof Token.CloseParenthesis){
            if(openParensCount === 0) return true;
            openParensCount -= 1;
        } else if (token instanceof Token.OpenParenthesis){
            openParensCount += 1;
        }
        return false;
    });
    return index === -1 ? index : index + openParensIndex + 1;
};

function hasPrecedence(token1, token2){
    return token1.isParenthesized 
        || token1.precedence > token2.precedence
    ;
}

/**
 * [Function(token) => false || Function(root, leaf) => tree ]
 * Array of functions that take a token and its index. If the function cannot handle the token, return false.
 * Otherwise return a function that takes the root and leaf of the syntax tree and all tokens 
 * and returns the new syntax tree.
 */
const expectedTokens = [
    function number(token){
        if(token instanceof Token._Number) return function parseNumber(root, leaf){
            const node = new Node(token);
            if(leaf === null){
                return { root: node, leaf: node };
            };
            leaf.add(node);
            return { root, leaf: root };
        }
        return false;
    },
    function binaryOperation(token){
        if(token instanceof Token.BinaryOperation) return function parseBinaryOperation(root, leaf){
            if(root === null) throw new _SyntaxError.MissingNumber(token)
            if((root.value instanceof Token.BinaryOperation) &&
                (!root.value.isParenthesized && (token.precedence > root.value.precedence))
            ){
                const node = new Node(token);
                root.insertRight(node);
                return { root, leaf: node };
            } else {
                const newRoot = new Node(token, root);
                return { root: newRoot, leaf: newRoot };
            };
        };
        return false;
    },
    function openParenthesis(token, index){
        if(token instanceof Token.OpenParenthesis) return function parseOpenParenthesis(root, leaf, tokens){
            const closingParenthesisIndex = findCloseParensIndex(tokens, index);
            if(closingParenthesisIndex === -1){
                throw new _SyntaxError.UnmatchedParenthesis(token);
            };
            const subtreeStartIndex = index + 1;
            const subtreeLength = closingParenthesisIndex - subtreeStartIndex;
            const subExpressionTokens = tokens.slice(index + 1, index + 1 + subtreeLength);
            if(subExpressionTokens.length === 0){
                throw new _SyntaxError.EmptyExpression();
            };

            const subtreeRoot = parse(subExpressionTokens);
            if(subtreeRoot.value instanceof Token.BinaryOperation){
                subtreeRoot.value.isParenthesized = true;
            };

            tokens.splice(index, subtreeLength + 1);
            if(root === null){
                return { root: subtreeRoot, leaf: subtreeRoot };
            };
            leaf.add(subtreeRoot);
            return { root, leaf: root };
        };
        return false;
    },
];
