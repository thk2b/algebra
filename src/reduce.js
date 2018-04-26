import { Token, Node } from './core'

/**
 * Returns a Node containing a Token.Division in lowest terms.
 * @param {Node} division – A division node containing a token to reduce to lowest terms.
 */
export default function reduce(divisionNode){
    if(!divisionNode instanceof Node){
        throw new Error('cannot reduce a non-Node');
    };
    const division = divisionNode.value;
    if(!division instanceof Token.Division){
        throw new Error('cannot reduce a non-Division');
    };

    const { left, right } = divisionNode;
    const numerator = divisionNode.left.value;
    const denominator = divisionNode.left.value;
    const divisor = gcd(numerator, denominator);
    left.set(left.value / divisor);
    right.set(right.value / divisor);
    return divisionNode
};