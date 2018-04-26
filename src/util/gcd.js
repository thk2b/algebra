const { min, max, abs } = Math;

function _gcd(a, b){
    if(b === 0) return a;
    return _gcd(b, a % b);
};

export default function gcd(a, b){
    if(a === 0 || b === 0){
        throw new Error('Cannot find divisors of 0');
    };
    return _gcd(abs(a), abs(b));
};