import round from '../util/round';
import precision from '../util/precision';
import gcd from '../util/gcd';
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

    const leftNode = reduceTree(root.left);
    const rightNode = reduceTree(root.right);
    const leftToken = leftNode.value;
    const rightToken = rightNode.value;
    /*
     * Base case 2: return a Node containing a Token.Division
     */
    if((rightToken instanceof Token._Number)&&(leftToken instanceof Token._Number)){
        let value;
        const l = leftToken.value;
        const r = rightToken.value;
        if(token instanceof Token.Division){
            if(r === 0) throw new ReductionError(root, 'Cannot divide by zero');
            const divisor = gcd(l, r);
            const newL = l / divisor;
            const newR = r / divisor;
            if(newR === 1){
                return new Node(new Token._Number(newL));
            };
            return new Node(new Token.Division,
                new Node(new Token._Number(newL)),
                new Node(new Token._Number(newR))
            );
        };
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
    let a, b, c, d;
    if(leftToken instanceof Token._Number){
        a = leftToken.value;
        b = 1;
    } else {
        a = leftNode.left.value.value;
        b = leftNode.right.value.value;
    };
    if(rightToken instanceof Token._Number){
        c = rightToken.value;
        d = 1;
    } else {
        c = rightNode.left.value.value;
        d = rightNode.right.value.value;
    };
    let l, r;
    switch(token.constructor){
        case Token.Addition:
            /* (a/b)+(c/d) = (a*d+b*c)/(b*d) */
            l = a * d + b * c;
            r = b * d;
            break;
        case Token.Substraction:
            /* (a/b)-(c/d) = (a*d-b*c)/(b*d) */
            l = a * d - b * c;
            r = b * d;
            break;
        case Token.Multiplication:
            /* (a/b)*(c/d) = (a*c)/(b*d) */
            l = a * c;
            r = b * d;
            break;
        case Token.Division:
            /* (a/b)/(c/d) = (a*d)/(b*c) */
            l = a * d;
            r = b * c;
            break;
        default: throw new ReductionError(root, 'Cannot calculate non-binary operation');
    };
    const divisor = gcd(l, r);
    const newR = r / divisor;
    const newL = l / divisor;
    if(newR === 1){
        return new Node(new Token._Number(newL));
    };
    return new Node(new Token.Division,
        new Node(new Token._Number(newL)),
        new Node(new Token._Number(newR))
    );
};