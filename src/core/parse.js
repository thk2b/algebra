import Token, { CloseParenthesis } from './Token';
import Node from './Node';

const precedence = {
    '+': 0, '-': 0, '*': 1, '/': 1
}

/**
 * Transforms tokens into a syntax tree.
 * Algorithm:
 * Initialization:
 *   We store a reference to the root, and a reference to the leaf.
 *   There is at most one leaf, because all well-formed algebraic strings have complete binary trees.
 *   The first token is the root, and also the leaf.
 * For each token:
 *   If the token is a number, add it to the leaf. The root stays the leaf.
 *   If the token is a binary operation:
 *     If the root is an operator, and has lower precedence than the operator,
 *       insert the operator between the root and its right child.
 *       The new node becomes the leaf.
 *     Otherwise, the operator becomes the root.
 *       Attatch the previous root to the new root.
 *       The new root becomes the leaf.
 *   If the token is an open parenthesis:
 *     Create a subtree with all the tokens from the next token to the closing parenthesis.
 *     Remove the subexpression tokens from the tokens.
 *     Attatch the subtree to the leaf.
 *     The root becomes the leaf.
 * @param {*} tokens – lexer tokens
 */

export default function parse(tokens){
    if(tokens.length === 0){
        throw new Error('empty expresison');
    };
    let root = new Node(tokens[0]);
    let leaf = root;

    let index = 1;
    while(index < tokens.length){
        let token = tokens[index];
        if(token instanceof Token._Number){
            leaf.add(new Node(token));
            leaf = root;
            index += 1;
            continue;
        }
        else if(token instanceof Token.BinaryOperation){
            if((root.value instanceof Token.BinaryOperation) && token.precedence > root.value.precedence){
                // high precedence: we keep the same root, and insert the operator below it.
                const node = root.insertRight(new Node(token));
                leaf = node;
                index += 1;
                continue;
            } else {
                // low precedence: we replace the root and attach the current root
                root = new Node(token, root);
                leaf = root;
                index += 1;
                continue;
            };
        }
        else if(token instanceof Token.OpenParenthesis){
            /*
            ** Create a subtree with the tokens from here to the closing parens.
            ** Remove all the tokens from the list, since we have parsed them already.
            ** Remove the closing parens.
            ** Attach the subtree to the leaf.
            */
            const closingParenthesisIndex = tokens.findIndex(
                t => t instanceof Token.CloseParenthesis
            )
            if(closingParenthesisIndex === -1){
                throw new Error('unmatched parenthesis');
            };
            const subtreeStartIndex = index + 1;
            const subtreeLength = closingParenthesisIndex - subtreeStartIndex;
            
            const subExpressionTokens = tokens.slice(index + 1, index + 1 + subtreeLength);
            if(subExpressionTokens.length === 0){
                throw new Error('empty expression');
            };
            const subtree = parse(subExpressionTokens);
            leaf.add(subtree);
            leaf = root;
            index += subtreeLength + 2;
            continue;
        }
        else {
            throw new Error(`invalid token at position ${index}: ${token.print()}`)
        };
    }
    if(root !== leaf){
        throw new Error('incomplete expression')
    }
    return root;
}