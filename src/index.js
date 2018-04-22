function parseOperands(expression){

}

function parseNumbers(expressions){

}

function parse(expression){
    return {
        numbers: parseNumbers(expression),
        operands: parseOperands(expression)
    }
}

function evaluate({ numbers, operands }){
    
}

/**
 * 
 * @param {String} expression - The algebraic expression to calculate
 */
export default function calculate(expression){
    return evaluate(parse(expression))
}