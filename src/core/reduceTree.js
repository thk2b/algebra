import round from '../util/round';
import precision from '../util/precision';
import options from '../options';
import { Token } from './lex';
import { Node } from './parse';
import { calculateTree } from '.';
const { min, max, pow } = Math;

export class ReductionError {
    constructor(node, message){
        this.node = node;
        this.message = message;
    };
};

/**
 * Reduces an expression to lowest terms.
 * Algorithm:
 * Begin with a root Node.
 * If root is a Number, return the root (Base case 1).
 * If root is any token other than a Division, calculate its value.
 * Otherwise, recurse on the node's child nodes.
 *   Given base cases 1 and 2, we obtain either a Number or an ireducible Division.
 * If root is a Division,
 *   If both children are Numbers,
 *     return a Node containing a Division such that its left and right
 *     nodes are Numbers and have no common factor.
 *   If both children are not Divisions, transform the Number node into a division by 1.
 *   Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *     The formula is (a/b)/(c/d) = (a*d)/(b*c).
 * If the root is an Addition,
 *   If both children are Numbers: execute the operation and return a Node
 *     containing a Number (Base case 1).
 *   If both children are not Divisions, transform the Number node into a division by 1.
 *   Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *     The formula is (a/b)+(c/d) = (a*d + b*c) / (b*d).
 * If the root is a Substraction,
 *   If both children are Numbers: execute the operation and return a Node
 *     containing a Number (Base case 1).
 *   If both children are not Divisions, transform the Number node into a division by 1.
 *   Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *     The formula is (a/b)-(c/d) = (a*d - b*c) / (b*d).
 * If the root is a Multiplication,
 *   If both children are Numbers: execute the operation and return a Node
 *     containing a Number (Base case 1).
 *   If both children are not Divisions, transform the Number node into a division by 1.
 *   Return a Node containing a Division equivalent to the two divisions. (Base case 2)
 *     The formula is (a/b)*(c/d) = (a*c)/(b*d).
 * Otherwise, the provided tree is invalid.
 * (wrong: what happens to nested operations ?)
 * 
 * @param {Node} root – Syntax tree to be calculated
 * @returns {Node} – A node containing either a Token._Number (Base case 1),
 *   or an ireducible Token.Division such that its left and right
 *   nodes are Token._Number and they have no common factor (Base case 2).
 */
export default function reduceTree(root){
    if(!(root instanceof Node)) throw new TypeError(`Expected a Node in calculateTree: got ${root}`);
    const token = root.value;
    /* 
     * Base case 1: return a Node containing a Token._Number
     */
    if(token instanceof Token._Number) return root;
    // if(!(token instanceof Token.Division)){
    //     return calculateTree(root);
    // };

    const leftNode = reduceTree(root.left);
    const rightNode = reduceTree(root.right);
    const leftToken = leftNode.value;
    const rightToken = rightNode.value;
    /*
     * Base case 2: return a Node containing a Token.Division
     */
    if(token instanceof Token.Division){
        if((rightToken instanceof Token._Number)&&(leftToken instanceof Token._Number)){
            const r = rightToken.value;
            if(rightToken.value === 0){
                throw new ReductionError(root, 'Cannot divide by zero');
            };
            const l = leftToken.value; 
            const divisor = gcd(l, r);
            return new Node(
                new Token.Division(),
                new Node(new Token._Number(l / divisor)),
                new Node(new Token._Number(r / divisor))
            );
        } else {
            /* One node is therefore a division */
            let a, b, c, d;
            if(leftToken instanceof Token._Number){
                /* RightNode must be an irreducible Division */
                a = 1;
                b = leftToken.value;
                c = rightNode.left.value.value;
                d = rightNode.right.value.value;
            } else if(rightToken instanceof Token._Number){
                /* LeftNode must be an irreducible Division */
                a = LeftNode.left.value.value;
                b = LeftNode.right.value.value;
                c = 1;
                d = leftToken.value;
            } else {
                a = LeftNode.left.value.value;
                b = LeftNode.right.value.value;
                c = rightNode.left.value.value;
                d = rightNode.right.value.value;
            };
            return new Node(
                new Token.Division,
                new Node(new Token._Number(a * d)),
                new Node(new Token._Number(b * c))
            );
        };
    } else if (token instanceof Token.Multiplication){

    } else if (token instanceof Token.Addition){
        
    } else if (token instanceof Token.Substraction){
        
    };
    /* 
     * Base case 1: calculate the value of the operation
     * and return a Node containing a Token._Number
     */
    let value = null;
    if((rightToken instanceof Token._Number) && (leftToken instanceof Token._Number)){
        const l = leftToken.value;
        const r = rightToken.value;
        switch(token.constructor){
            case Token.Addition:
                value = round(l + r, max(precision(l), precision(r)));
                break;
            case Token.Substraction:
                value = round(l - r, max(precision(l), precision(r)));
                break;
            case Token.Multiplication:
                value = round(l * r, max(precision(l), precision(r)));
                break;
            case Token.Exponentiation:
                value = round(pow(l, r), max(precision(l), precision(r)));
                break;
            default:
                throw new ReductionError(root, 'Cannot calculate non-binary operation');
        };
        return new Node(new Token._Number( value ));
    };
};