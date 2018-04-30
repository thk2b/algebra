import Token from './Token';
import CharError from '../../Errors/Character';

/**
 * For every character in the expression, finds the first pattern that matches and updates the 
 * tokens and digits with the return value of the pattern's tokenizer.
 * @param {String} expression 
 */
export default function tokenize(expression){
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
 * {pattern<String> : tokenizer<Function(character, tokens, digits)>}
 * Patterns are regular expression strings.
 * Tokenizers are functions of the current character, the tokens and the digits.
 * They must return an object with keys { tokens, digits } coresponding to the new tokens and digits.
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
    '\\^': createNonDigitTokenizer(Token.Exponentiation),
    '\\(': createNonDigitTokenizer(Token.OpenParenthesis),
    '\\)': createNonDigitTokenizer(Token.CloseParenthesis),
    '.': (char) => {
        throw new CharError.UnknownCharacter(char);
    },
};