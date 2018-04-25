import { lex, parse, Token } from './core';

import round from './util/round';
import precision from './util/precision';
import options from './options';
const { min, max } = Math;

const operators = {
    '+': (l, r) => round(l + r, max(precision(l), precision(r))),
    '-': (l, r) => round(l - r, max(precision(l), precision(r))),
    '*': (l, r) => round(l * r, max(precision(l), precision(r))),
    '/': (l, r) => {
        if(r === 0) throw new Error('cannot divide by zero');
        return round(l / r, max(options.precision, precision(l), precision(r)));
    }
};

function _calculate(node){
    // TODO: reduce the expression in lowest terms before calculating to reduce rounding aproximations.
    const token = node.value;
    if(token instanceof Token._Number){
        return token.value;
    }
    else if(token instanceof Token.BinaryOperation){
        const left = _calculate(node.left);
        const right = _calculate(node.right);
        return operators[token.operator](left, right);
    };
    throw new Error('Invalid node. Should never happen! All syntax errors shoud be caught by the parser');
}
/**
 * 
 * @param {String} expression - The algebraic expression to evaluate
 */

export default function calculate(expression){
    const root = parse(lex(expression))
    return _calculate(root)

};