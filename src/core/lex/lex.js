import Token from './Token';
import LexError from './LexError';

const { parseFloat } = Number;

function tokenizeDigits(digits){
    return new Token._Number(parseFloat(digits.join('')));
};

function createNonDigitTokenizer(TokenConstructor){
    return function(char, tokens, digits){
        const token = new TokenConstructor();
        return ({
            tokens: digits.length === 0
                ? tokens.concat(token)
                : tokens.concat( tokenizeDigits(digits), token),
            digits: []
        });
    };
};

/**
 * Patterns:
 * Keys are regular expressions.
 * Values are functions of the current character, the tokens and the digits.
 * They must return an object with keys { tokens, digits },
 * coresponding to the new tokens and digits.
 */

const patterns = {
    '\\s': (whitespace, tokens, digits) => ({
        tokens: digits.length === 0
            ? tokens
            : tokens.concat(tokenizeDigits(digits)),
        digits: []
    }),
    '[\\d\\.]': (digit, tokens, digits) => ({
        tokens, digits: digits.concat(digit)
    }),
    '\\+': createNonDigitTokenizer(Token.Addition),
    '\\-': createNonDigitTokenizer(Token.Substraction),
    '\\/': createNonDigitTokenizer(Token.Division),
    '\\*': createNonDigitTokenizer(Token.Multiplication),
    '\\(': createNonDigitTokenizer(Token.OpenParenthesis),
    '\\)': createNonDigitTokenizer(Token.CloseParenthesis),
    '.': (char) => {
        throw new LexError(char);
    }
};

const transformations = {
    negativeNumbers(tokens, token, index){
        if(!(token instanceof Token.Substraction)) return tokens;
        const prev = tokens[index - 1];
        const next = tokens[index + 1];
        if(prev === undefined ||
            (prev instanceof Token.BinaryOperation) ||
            (prev instanceof Token.OpenParenthesis)
        ){
            /* Negative number: match any expression begining with a substraction or any binary operation followed by a substraction.*/
            if(next instanceof Token._Number) {
                return [
                    ...tokens.slice(0, index),
                    new Token._Number(-1 * next.value),
                    ...tokens.slice(index + 2) // remove the number
                ];
            }
            if (next instanceof Token.OpenParenthesis) return [
                ...tokens.slice(0, index),
                new Token._Number(-1),
                new Token.Multiplication(),
                ...tokens.slice(index)
            ];
        };
        return tokens;
    },
    implicitMultiplication(tokens, token, index){
        if ((token instanceof Token._Number) || (token instanceof Token.CloseParenthesis)){
            const next = tokens[index + 1];
            if(next instanceof Token.OpenParenthesis) {
                return [
                ...tokens.slice(0, index + 1),
                new Token.Multiplication(),
                ...tokens.slice(index + 1)
                ];
            };
        };
        return tokens;
    }
};

function tokenize(expression){
    const { tokens, digits } = expression.split('').reduce(
        ({ tokens, digits }, char, index) => {
            const [ _, tokenizer ] = Object.entries(patterns).find(
                ([ pattern ]) => new RegExp(pattern).test(char)
            );
            return tokenizer(char, tokens, digits);
        }
    , { tokens: [], digits: [] });
    return digits.length > 0
        ? tokens.concat(tokenizeDigits(digits))   
        : tokens
    ;
};

/**
 * Analyzes tokens and transforms them based on their relation to other tokens.
 * @param {{Token}} tokens – Tokens to analyze and transform
 */
function transformTokens(tokens){
    return Object.values(transformations).reduce(
        (transformedTokens, transform) => {
            return transformedTokens.reduce(
                (transformingTokens, _, index) => {
                    /* Transformations can alter the number of tokens.
                    ** If we removed a token, the current token (_) is one element ahead.
                    ** So the correct token to pass to the transformation is the transformingTokens at the current index.
                    */
                    const offsetToken = transformingTokens[index];
                    if (offsetToken === undefined) return transformingTokens;
                    return transform(transformingTokens, offsetToken, index);
                }
            , transformedTokens);
        }
    , tokens);
};

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
 *    
 * @param {String} expression – Input expression.
 * @returns {[ Tokens ]} tokens - List of tokens.
 */
export default function lex(expression){
    return transformTokens(tokenize(expression));
};