import round from '../util/round';
import precision from '../util/precision';
import options from '../options';
import { Token } from './lex';
import { Node } from './parse';
const { min, max, pow } = Math;

class CalculationError {
    constructor(node, message){
        this.node = node;
        this.message = message;
    };
};

/**
 * Calculates the result of an expression.
 * @param {Node} root – Syntax tree to be calculated
 * @returns {Node} – A node containing the resulting Token.
 */
export default function calculateTree(root){
    if(!(root instanceof Node)) throw new TypeError(`Expected a Node in calculateTree: got ${root}`);
    const token = root.value;
    if(token instanceof Token._Number) return root;
    
    const l = calculateTree(root.left).value.value;
    const r = calculateTree(root.right).value.value;
    
    let value = null;
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
        case Token.Division:
            if(r === 0) throw new CalculationError(root, 'Cannot divide by zero');
            value = round(l / r, max(precision(l), precision(r)));
            break;
        case Token.Exponentiation:
            value = round(pow(l, r), max(precision(l), precision(r)));
            break;
        default:
            throw new CalculationError(root, 'Cannot calculate non-binary operation');
    }
    return new Node(new Token._Number( value ));
}