function parseOperands(expression){
    return expression.match(/[+\-*\//%]/g);
};

function parseNumbers(expression){
    return expression
        .match(/\d+(\.\d+)?/g)
        .map(Number.parseFloat);
};

function parse(expression){
    return {
        numbers: parseNumbers(expression),
        operands: parseOperands(expression)
    };
};

function compute(left, operand, right){
    return {
        '+': left + right,
        '-': left - right,
        '*': left * right,
        '/': left / right,
        '%': left % right
    }[operand];
};

function evaluate({ numbers, operands }){
    return numbers.slice(1).reduce(
        (left, right, i) => compute(left, operands[i], right)
    , numbers[0]);
};

/**
 * 
 * @param {String} expression - The algebraic expression to calculate
 */
export default function calculate(expression){
    return evaluate(parse(expression));
};