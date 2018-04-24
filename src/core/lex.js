import Token from './Token'

function isWhitespace(char){
    return /\s/.test(char)
};

function isDigit(char){
    return /[\d\.]/.test(char);
}

function isBinaryOperation(char){
    return /[+\-*\//]/.test(char);
}

function isParenthesis(char){
    return /[\(\)]/.test(char)
}

function tokenizeDigits(digits){
    const rawNumber = digits.splice(0, digits.length).join('');
    return new Token._Number(Number.parseFloat(rawNumber));
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
    const digits = [];
    const tokens = [];
    for(let [index, char] of expression.split('').entries()){
        if(isWhitespace(char)){
            continue;
        }
        else if(isDigit(char)){
            digits.push(char);
            continue;
        } else if(digits.length){
            tokens.push(tokenizeDigits(digits));
        };
        
        if(isBinaryOperation(char)){
            tokens.push(new {
                '+': Token.Addition,
                '-': Token.Substraction,
                '*': Token.Multiplication,
                '/': Token.Division,
            }[char]());
            continue;
        }
        else if(isParenthesis(char)){
            tokens.push(new {
                '(': Token.OpenParenthesis,
                ')': Token.CloseParenthesis
            }[char]());
            continue;
        }
        else {
            throw new Error(`invalid character at position ${index}:${char}`);
        };
    };
    if(digits.length){
        tokens.push(tokenizeDigits(digits));
    };
    return tokens;
};