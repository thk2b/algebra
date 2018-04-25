export { default as Token } from './Token'
export { default as LexError } from './LexError'

import transform from './transform';
import tokenize from './tokenize';
const { parseFloat } = Number;

/** 
 * Lexer. Takes an input string and returns a list of tokens.
 * Algorithm:
 * Initialization:
 *   We store a temporary stack of digits and the final list of tokens.
 * For every character of the input string:
 *   If the character is a digit, push it to the digit stack and check the next character.
 *   Otherwise,
 *     If there are digits on the digit stack, 
 *       combine them into a number and clear the digit stack.
 *       Add the number to the list of tokens.
 *     If the character is a binary operator,
 *       add it to the list of tokens and check the next character.
 *     If the character is a parenthesis,
 *       add it to the list of tokens and check the next character.
 * Then, transform the resulting tokens:
 * For each token,
 *  If the token is a substraction immediately following undefined, another binary operation, or an opening parenthesis,
 *    and the next token is a number, (negative number) negate the number and remove the substraction from the tokens.
 *  If the token is a number or a closing aprenthesis followed by an opening parenthesis, (implicit multiplication)
 *    insert a multiplication between the token ans the opening parenthesis. 
 * @param {String} expression – Input expression.
 * @returns {[ Tokens ]} tokens - List of tokens.
 */
export default function lex(expression){
    return transform(tokenize(expression));
};