import Token from './Token';

/**
 * Runs all transformations on the tokens.
 * For each transformation, run the transformation on each token.
 * The token passed to transformations is taken from the tokens
 * returned from the transformation of the previous token.
 * @param {{Token}} tokens – Tokens to analyze and transform
 * @returns {[Token]} – Array of transformed tokens
 */
export default function transform(tokens){
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
 * [Function(tokens, token, index), ...]
 * Transformations are functions of the tokens, current token an index of the current token.
 * Must returns the tokens, even if no changes were made.
 * May remove or add tokens.
 */
const transformations = [
    function negativeNumber(tokens, token, index){
        if(!(token instanceof Token.Substraction)) return tokens;
        const prev = tokens[index - 1];
        const next = tokens[index + 1];
        /* Transform substractions that 
         *   - are the first character of an expression
         *   - follow a binary operation
         *   - follow a closed parenthesis
         * into a nugative number
         */
        if(prev === undefined ||
            (prev instanceof Token.BinaryOperation) ||
            (prev instanceof Token.OpenParenthesis)
        ){
            if(next instanceof Token._Number){
                return [
                    ...tokens.slice(0, index),
                    new Token._Number(-1 * next.value),
                    ...tokens.slice(index + 2) // remove the number
                ];
            };
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
            if((next instanceof Token.OpenParenthesis) || (next instanceof Token.UnaryOperation) || (next instanceof Token._Number)) {
                return [
                ...tokens.slice(0, index + 1),
                new Token.Multiplication(),
                ...tokens.slice(index + 1)
                ];
            }
        } else if (token instanceof Token.UnaryOperation){
            const next = tokens[index + 1];
            if((next instanceof Token.UnaryOperation) || (next instanceof Token._Number)){
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
