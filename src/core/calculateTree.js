import round from '../util/round';
import precision from '../util/precision';
import options from '../options';
import { Token } from './lex';
import { Node } from './parse';
import Errors from '../Errors';
import { SIGBREAK } from 'constants';
const { min, max, pow, sqrt } = Math;

/**
 * Calculates the result of an expression.
 * @param {Node} root – Syntax tree to be calculated
 * @returns {Node} – A node containing the resulting Token.
 */
export default function calculateTree(root){
    if(!(root instanceof Node)) throw new TypeError(`Expected a Node in calculateTree: got ${root}`);
    const token = root.value;
    if(token instanceof Token._Number) return root;
    
    let result;
    if(token instanceof Token.BinaryOperation){
        const l = calculateTree(root.left).value.value;
        const r = calculateTree(root.right).value.value;
        
        switch(token.constructor){
            case Token.Addition:
                result = round(l + r, max(precision(l), precision(r)));
                break;
            case Token.Substraction:
                result = round(l - r, max(precision(l), precision(r)));
                break;
            case Token.Multiplication:
                result = round(l * r, max(precision(l), precision(r)));
                break;
            case Token.Division:
                if(r === 0) throw new Errors.Math.DivisionByZero(root.value, 'Cannot divide by zero');
                result = round(l / r, max(options.precision, precision(l), precision(r)));
                break;
            case Token.Exponentiation:
                result = round(pow(l, r), max(precision(l), precision(r)));
                break;
            case Token.SquareRoot:
                result = round(sqrt());
                break;
            default:
                throw new TypeError(`Invalid operand ${token.operator}`);
        };
    }
    else if (token instanceof Token.UnaryOperation){
        const value = calculateTree(root.left).value.value;

        switch(token.constructor){
            case Token.SquareRoot:
                result = round(sqrt(value), max(precision(value), options.precision));
                break;
            default:
                throw new TypeError(`Invalid operand ${token.name}`);
        };
    }
    else throw new TypeError('Cannot calculate non-binary operation');
    
    return new Node(new Token._Number( result ));
};