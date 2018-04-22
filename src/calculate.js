import round from './round';
import precision from './precision';
import options from './options';
const { min, max } = Math;

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
        '+': round(left + right, max(precision(left), precision(right))),
        '-': round(left - right, max(precision(left), precision(right))),
        '*': round(left * right, max(precision(left), precision(right))),
        '/': round(left / right, max(options.precision, precision(left), precision(right))),
        // '/': round(left / right, options.precision),
        // '/': left / right,
        '%': round(left % right, max(precision(left), precision(right)))
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