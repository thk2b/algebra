import round from '../util/round';
import precision from '../util/precision';
import gcd from '../util/gcd';
import options from '../options';
import { Token } from './lex';
import { Node } from './parse';
import Errors from '../Errors';

const { min, max, pow } = Math;

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
export default function simplifyTree(root){
    if(!(root instanceof Node)){
        throw new TypeError(`Expected a Node in calculateTree: got ${root}`);
    };
    const token = root.value;
    
    /* Base case 1: return a Node containing a Token._Number */
    if(token instanceof Token._Number) return root;

    /* Base case 2: return a Node containing a Token.Division in lowest terms or a Token._Number*/
    const leftNode = simplifyTree(root.left);
    const rightNode = simplifyTree(root.right);
    const leftToken = leftNode.value;
    const rightToken = rightNode.value;

    return (rightToken instanceof Token._Number) && (leftToken instanceof Token._Number)
        ? calculateTree(token, leftToken, rightToken)
        : simplifyDivision(token, leftNode, rightNode)
    ;
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
function calculateTree(operationToken, leftToken, rightToken){
    let value;
    const l = leftToken.value;
    const r = rightToken.value;

    if(operationToken instanceof Token.Division){
        if(r === 0){
            throw new Errors.Math.DivisionByZero(operationToken);
        };

        const divisor = gcd(l, r);
        const newL = l / divisor;
        const newR = r / divisor;

        return newR === 1
            ? new Node(new Token._Number(newL))
            : new Node(new Token.Division,
                new Node(new Token._Number(newL)),
                new Node(new Token._Number(newR))
            )
        ;
    } else {
        const places = max(precision(r), precision(l));
        const value = operationToken instanceof Token.Addition
            ? round(l + r, places)
            : operationToken instanceof Token.Substraction
            ? round(l - r, places)
            : operationToken instanceof Token.Multiplication
            ? round(l * r, places)
            : operationToken instanceof Token.Exponentiation
            ? round(pow(l, r), places)
            : null
        ;
        if(value === null){
            throw new TypeError('Cannot calculate non-binary operation');
        };
        return new Node(new Token._Number(value));
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
function getNumeratorAndDenominator(node){
    return node.value instanceof Token._Number
        ? [node.value.value, 1]
        : [node.left.value.value, node.right.value.value]
    ;
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
function simplifyDivision(operationToken, leftNode, rightNode){
    const [ a, b ] = getNumeratorAndDenominator(leftNode);
    const [ c, d ] = getNumeratorAndDenominator(rightNode);

    if(b === 0 || d === 0){
        throw new ReductionError(operationToken, 'Cannot divide by 0');
    };

    const places = max(...[a,b,c,d].map(precision));

    const [ l, r ] = operationToken instanceof Token.Addition
        /* (a/b)+(c/d) = (a*d+b*c)/(b*d) */
        ? [ round(a * d + b * c, places), round(b * d, places) ]
        : operationToken instanceof Token.Substraction
        /* (a/b)-(c/d) = (a*d-b*c)/(b*d) */
        ? [ round(a * d - b * c, places), round(b * d, places) ]
        : operationToken instanceof Token.Multiplication
        /* (a/b)*(c/d) = (a*c)/(b*d) */
        ? [ round(a * c, places), round(b * d, places) ]
        : operationToken instanceof Token.Division
        /* (a/b)/(c/d) = (a*d)/(b*c) */
        ? [ round(a * d, places), round(b * c, places) ]
        : [ null, null ]
    ;
    if(l === null || r === null){
        throw new ReductionError(root, 'Cannot calculate non-binary operation');
    };

    const divisor = gcd(l, r);
    const newR = r / divisor;
    const newL = l / divisor;

    return newR === 1
        ? new Node(new Token._Number(newL))
        : new Node(new Token.Division,
            new Node(new Token._Number(newL)),
            new Node(new Token._Number(newR))
        )
    ;
};