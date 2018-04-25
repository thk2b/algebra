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
    '\\(': createNonDigitTokenizer(Token.OpenParenthesis),
    '\\)': createNonDigitTokenizer(Token.CloseParenthesis),
    '.': (char) => {
        throw new LexError(char);
    }
};

/**
 * {name<String> : transformation<Function(tokens, token, index)>}
 * Transformations are functions of the tokens, current token an index of the current token.
 * Must returns the tokens, even if no changes were made.
 * May remove or add tokens.
 */
const transformations = [
    function negativeNumber(tokens, token, index){
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
    function implicitMultiplication(tokens, token, index){
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
];

/**
 * For every character in the expression, finds the first pattern that matches and updates the 
 * tokens and digits with the return value of the pattern's tokenizer.
 * @param {String} expression 
 */
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
 * Runs all transformations on the tokens.
 * For each transformation, run the transformation on each token.
 * The token passed to transformations is taken from the tokens
 * returned from the transformation of the previous token.
 * @param {{Token}} tokens – Tokens to analyze and transform
 * @returns {[Token]} – Array of transformed tokens
 */
function transform(tokens){
    return transformations.reduce(
        (transformedTokens, transformation) => {
            return transformedTokens.reduce(
                (transformingTokens, _, index) => {
                    /* Transformations can alter the number of tokens.
                    ** If we removed a token, the current token (_) is one element ahead.
                    ** So the correct token to pass to the transformation is the transformingTokens at the current index.
                    */
                    const offsetToken = transformingTokens[index];
                    if (offsetToken === undefined) return transformingTokens;
                    return transformation(transformingTokens, offsetToken, index);
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