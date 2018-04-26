const { min, abs } = Math;

export default function gcd(a, b){
    if(a === 0 || b === 0){
        throw new Error('Cannot find divisors of 0');
    };
    let x = min(abs(a), abs(b));
    while(x >= 1){
        if(a % x === 0 && b % x === 0){
            return x;
        };
        x -= 1;
    };
    return x;
};