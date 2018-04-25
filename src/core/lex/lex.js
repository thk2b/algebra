import Token from './Token'

const { parseFloat } = Number

function tokenizeDigits(digits){
    return new Token._Number(parseFloat(digits.join('')))
};

/**
 * Patterns.
 * Keys are regular expressions.
 * Values are functions of the current character, the tokens and the digits.
 * They must return an object with keys { tokens, digits },
 * coresponding to the new tokens and digits.
 */

function concatWithDigits(token, tokens, digits){
    return digits.length === 0
        ? tokens.concat(token)
        : tokens.concat(
            tokenizeDigits(digits),
            token
        );
};

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
    '\\+': (binaryOperator, tokens, digits) => ({
        tokens: concatWithDigits(new Token.Addition(), tokens, digits),
        digits: []
    }),
    '\\-': (binaryOperator, tokens, digits) => ({
        tokens: concatWithDigits(new Token.Substraction(), tokens, digits),
        digits: []
    }),
    '\\/': (binaryOperator, tokens, digits) => ({
        tokens: concatWithDigits(new Token.Division(), tokens, digits),
        digits: []
    }),
    '\\*': (binaryOperator, tokens, digits) => ({
        tokens: concatWithDigits(new Token.Multiplication(), tokens, digits),
        digits: []
    }),
    '\\(': (parenthesis, tokens, digits) => ({
        tokens: concatWithDigits(new Token.OpenParenthesis(), tokens, digits),
        digits: []
    }),
    '\\)': (parenthesis, tokens, digits) => ({
        tokens: concatWithDigits(new Token.CloseParenthesis(), tokens, digits),
        digits: []
    }),
    '.': (char) => {
        throw new Error(`invalid character:'${char}'`);
    }
}

function tokenize(expression){
    const { tokens, digits } = expression.split('').reduce(
        ({ tokens, digits }, char, index) => {
            return Object.entries(patterns)
                .find(([ pattern, _ ]) => new RegExp(pattern).test(char))
                [1](char, tokens, digits);
        }
    , { tokens: [], digits: [] });
    return digits.length === 0
        ? tokens    
        : tokens.concat(tokenizeDigits(digits));
};

/**
 * Analyzes tokens and transforms them based on their relation to other tokens.
 * @param {{Token}} tokens – Tokens to analyze and transform
 */
function transformTokens(_tokens){
    const tokens = _tokens.slice();
    return tokens.reduce((transformedTokens, token, index) => {
        if(token instanceof Token.Substraction){
            const prev = transformedTokens[index - 1];
            const next = tokens[index + 1];
            if(prev === undefined ||
                (prev instanceof Token.BinaryOperation) ||
                (prev instanceof Token.OpenParenthesis)
            ){
                /* Negative number: match any expression begining with a substraction or any binary operation followed by a substraction.*/
                if(next instanceof Token._Number){
                    tokens.splice(index + 1, 1); // remove the number
                    return transformedTokens.concat(new Token._Number(-1 * next.value));
                } else if (next instanceof Token.OpenParenthesis){
                    // multiply the whole expression by -1
                    return transformedTokens.concat(new Token._Number, new Token.Multiplication());
                }
            }
        }
        else if ((token instanceof Token._Number) || (token instanceof Token.CloseParenthesis)){
            const next = tokens[index + 1];
            if(next instanceof Token.OpenParenthesis){
                // implicit multiplication
                return transformedTokens.concat(token, new Token.Multiplication());
            }
        }
        return transformedTokens.concat(token);
    }, []);
}

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