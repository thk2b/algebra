import {
    NUMBER,
    BINARY_OPERATION,
    OPEN_PARENTHESIS,
    CLOSE_PARENTHESIS,
} from './lex'
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
 *     If it has high precedence (multiplication or division), 
 *     insert the operator between the root and its right child.
 *     The new node becomes the leaf.
 *     If it has low precedence (addition or substraction),
 *     the operator becomes the root. Attatch the previous root to the new root.
 *     The new root becomes the leaf.
 * @param {*} tokens – lexer tokens
 */

function parse(tokens){
    let root = new Node(tokens[0]);
    /* the tree is a complete tree, so there is always at most one temporary leaf */
    let leaf = root;

    for(let token of tokens.slice(1)){    
        if(token.type === NUMBER){            
            leaf.add(new Node(token));
            leaf = root;
            continue;
        }
        else if(token.type === BINARY_OPERATION){
            if(root.count !== 1){
                throw new Error('binary operators require two nodes')
            };
            if(precedence[token.operator]){
                // high precedence: we keep the same root, and insert the operator below it.
                const node = root.insertRight(Node(token));
                leaf = node;
            } else {
                // low precedence: we replace the root and attach the current root
                root = new Node(token, root);
                leaf = root;
                continue;
            };
        };
    }
    return root;
}