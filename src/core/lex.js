import Token from './Token'

function isWhitespace(char){
    return /\s/.test(char)
};

function isDigit(char){
    return /[\d\.]/.test(char);
}

function isSign(char){
    return /[\-+]/.test(char);
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
 * Takes an input string and returns a list of tokens.
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
function tokenize(expression){
    const digits = [];
    const tokens = [];
    for(let [index, char] of expression.split('').entries()){
        if(isDigit(char)){
            digits.push(char);
            continue;
        } else if(digits.length){
            tokens.push(tokenizeDigits(digits));
        };   
        if(isWhitespace(char)){
            continue;
        }
        else if(isBinaryOperation(char)){
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
}

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
                    return transformedTokens.concat(new Token.Number, new Token.Multiplication());
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