import Token from './Token';
import CharError from '../../Errors/Character';

/**
 * For every character in the expression, finds the first pattern that matches and updates the 
 * tokens and digits with the return value of the pattern's tokenizer.
 * @param {String} expression 
 */
export default function tokenize(expression){
    const { tokens, digits, operator } = expression.split('').reduce(
        ({ tokens, digits, operator }, char, index) => {
            const [ _, tokenizer ] = Object.entries(patterns).find(
                ([ pattern ]) => new RegExp(pattern).test(char)
            );
            return tokenizer(char, tokens, digits, operator);
        }
    , { tokens: [], digits: [], operator: [] });

    if(operator.length){
        throw new CharError.InvalidOperator(operator.concat(digit).join(''));
    };
    return digits.length > 0
        ? tokens.concat(tokenizeDigits(digits))   
        : tokens
    ;
};

function tokenizeDigits(digits){
    return new Token._Number(parseFloat(digits.join('')));
};
function tokenizeOperator(operator){
    const name = operator.slice(1).join('');
    const token = {
        'sqrt': new Token.SquareRoot(),
        'cos': new Token.Cos(),
        'sin': new Token.Sin(),
        'tan': new Token.Tan(),
    }[name];
    if(!token) throw new CharError.InvalidOperator()
    return token;
}

function createCharacterTokenizer(TokenConstructor){
    return function(char, tokens, digits, operator){
        if(operator.length){
            throw new CharError.InvalidOperator(operator.concat(digit).join(''));
        };

        const token = new TokenConstructor();
        return ({
            tokens: digits.length === 0
                ? tokens.concat(token)
                : tokens.concat( tokenizeDigits(digits), token),
            digits: [], operator: []
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
    '\\s': (whitespace, tokens, digits, operator) => {
        if(operator.length){
            throw new CharError.InvalidOperator(operator.concat(digit).join(''));
        };
        return {
            tokens: digits.length === 0
                ? tokens
                : tokens.concat(tokenizeDigits(digits)),
            digits: [],
            operator: []
        };
    },
    '\\.': (point, tokens, digits, operator) => {
        if(digits.length === 0){
            throw new CharError.InvalidNumber(point);
        } else if(operator.length){
            throw new CharError.InvalidOperator(operator.concat(digit).join(''));
        };
        return { tokens, digits: digits.concat(point), operator };
    },
    '\\d': (digit, tokens, digits, operator) => {
        if(operator.length){
            throw new CharError.InvalidOperator(operator.concat(digit).join(''));
        };
        return {
            tokens, digits: digits.concat(digit), operator
        };
    },
    '\:': (colon, tokens, digits, operator) => {
        if(operator.length){
            throw new CharError.InvalidOperator(operator.concat(digit).join(''));
        };
        return {
            tokens, digits, operator: [colon]
        };
    },
    '\^[a-zA-Z]+$': (character, tokens, digits, operator) => {
        if(!operator.length) throw new CharError.UnknownCharacter(character);
        return digits.length 
            ? {
                tokens: tokens.concat(tokenizeDigits(digits)), digits: [], operator: operator.concat(character)
            }
            : {
                tokens, digits, operator: operator.concat(character)
            }
        ;
    },
    '\\+': createCharacterTokenizer(Token.Addition),
    '\\-': createCharacterTokenizer(Token.Substraction),
    '\\/': createCharacterTokenizer(Token.Division),
    '\\*': createCharacterTokenizer(Token.Multiplication),
    '\\^': createCharacterTokenizer(Token.Exponentiation),
    '\\(': (openParenthesis, tokens, digits, operator) => {
        if(operator.length){
            return {
                tokens: tokens.concat(tokenizeOperator(operator), new Token.OpenParenthesis()),
                digits: [], operator: []
            };
        }
        return {
            tokens: digits.length === 0
                ? tokens.concat(new Token.OpenParenthesis())
                : tokens.concat( tokenizeDigits(digits), new Token.OpenParenthesis()),
            digits: [], operator: []
        };
    },
    '\\)': createCharacterTokenizer(Token.CloseParenthesis),
    '.': (char) => {
        throw new CharError.UnknownCharacter(char);
    },
};