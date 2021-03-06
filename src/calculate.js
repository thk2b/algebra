import { lex, parse , calculateTree } from './core';

/**
 * 
 * @param {String} expression - The algebraic expression to evaluate
 */

export default function calculate(expression){
    return calculateTree(
        parse(lex(expression))
    ).value.value;
};