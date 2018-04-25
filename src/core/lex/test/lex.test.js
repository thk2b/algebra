import test from 'tape-catch';

import lex from '../lex';
import Token from '../Token';
import LexError from '../LexError';

test('core/lex', main => {
    main.test('├ individual tokens', t => {
        main.test('├ whitespace', t => {
            const tokens = lex(' ');
            t.equal(tokens.length, 0)
            t.end();
        });
        t.test('├─ numbers', t => {
            t.test('├── single digit', t => {
                const [ token ] = lex('1');
                t.ok(token);
                t.ok(token instanceof Token._Number, 'should be a _Number');
                t.equal(token.value, 1);
                t.end();
            });
            t.test('├── multiple digits', t => {
                const [ token ] = lex('1234');
                t.ok(token);
                t.ok(token instanceof Token._Number, 'should be a _Number');
                t.equal(token.value, 1234);
                t.end();
            });
            t.test('├── multiple digits with decimals', t => {
                const [ token ] = lex('1234.5678');
                t.ok(token);
                t.ok(token instanceof Token._Number, 'should be a _Number');
                t.equal(token.value, 1234.5678);
                t.end();
            });
            t.test('├── negative number', t => {
                const [ token ] = lex('-1234.5678');
                t.equal(token.value, -1234.5678);
                t.ok(token instanceof Token._Number);
                t.end();
            });
        })
        t.test('├─ binary operators', t => {
            t.test('├── +', t => {
                const [ token ] = lex('+');
                t.ok(token);
                t.ok(token instanceof Token.BinaryOperation, 'should be a BinaryOperation');
                t.ok(token instanceof Token.Addition, 'should be an Addition');
                t.equal(token.operator, '+');
                t.equal(token.precedence, 0, 'should have the correct precedence');
                t.end();
            });
            t.test('├── -', t => {
                t.test('├─── operator', t => {
                    const [ x, token, y ] = lex('1-2');
                    t.ok(token);
                    t.ok(token instanceof Token.BinaryOperation, 'should be a BinaryOperation');
                    t.ok(token instanceof Token.Substraction, 'should be an Substraction');
                    t.equal(token.operator, '-');
                    t.equal(token.precedence, 0, 'should have the correct precedence');
                    t.end();
                });
                t.test('├─── interpreted as a multiplication by -1 when at the start of expression', t => {
                    const [ token ] = lex('-1234.5678');
                    t.equal(token.value, -1234.5678);
                    t.ok(token instanceof Token._Number);
                    t.end();
                });
                t.test('├─── interpreted as a multiplication by -1 following another operator', t => {
                    const tokens = lex('1+-2');
                    t.equal(tokens.length, 3, 'should find 3 tokens');
                    t.deepEqual(tokens, [
                        { value: 1}, { operator: '+', precedence: 0 },
                        { value: -2 }
                    ])
                    t.end();
                });
                t.test('├─ -a -b', t => {
                    const tokens = lex('-1-2')
                    t.deepEqual(tokens, [
                        { value: -1 },
                        { operator: '-', precedence: 0 },
                        { value: 2 },
                    ]);
                    t.end();
                });
                t.test('├─── interpreted as a multiplication by -1 following an open parenthesis', t => {
                    const tokens = lex('0*(-1+2)');
                    t.equal(tokens.length, 7, 'should find 9 tokens');
                    t.deepEqual(tokens, [
                        { value: 0}, { operator: '*', precedence: 1 },
                        {}, 
                        { value: -1 },
                        { operator: '+', precedence: 0 },
                        { value: 2 },
                        {}
                    ])
                    t.end();
                });
            });
            t.test('├── *', t => {
                t.test('├─── operator', t => {
                    const [ token ] = lex('*');
                    t.ok(token);
                    t.ok(token instanceof Token.BinaryOperation, 'should be a BinaryOperation');
                    t.ok(token instanceof Token.Multiplication, 'should be a Multiplication');
                    t.equal(token.operator, '*');
                    t.equal(token.precedence, 1, 'should have the correct precedence');
                    t.end();
                });
                t.test('├─── implicit multiplication', t => {
                    const tokens = lex('1(2 + 3)');
                    t.equal(tokens.length, 7, 'should add a Multiplication token');
                    t.ok(tokens[0] instanceof Token._Number, '0 should be a _Number');
                    t.ok(tokens[1] instanceof Token.Multiplication, '1 should be a Multiplication');
                    t.ok(tokens[2] instanceof Token.OpenParenthesis, '2 should be an OpenParenthesis');
                    t.ok(tokens[6] instanceof Token.CloseParenthesis, 'last token should be an CloseParenthesis');
                    t.end();
                });
            });
            t.test('├── /', t => {
                const [ token ] = lex('/');
                t.test('├─── operator', t => {
                    t.ok(token);
                    t.ok(token instanceof Token.BinaryOperation, 'should be a BinaryOperation');
                    t.ok(token instanceof Token.Division, 'should be a Division');
                    t.equal(token.operator, '/');
                    t.equal(token.precedence, 1, 'should have the correct precedence');
                    t.end();
                });
                t.test('├─── negative division', t => {
                    const tokens = lex('-4/-2');
                    t.deepEqual(tokens, [
                        { value: -4 },
                        { operator: '/', precedence: 1 },
                        { value: -2 }
                    ]);
                    t.end();
                });
            });
        });
        t.test('├─ parentheses', t => {
            t.test('├── open', t => {
                const [ token ] = lex('(');
                t.ok(token);
                t.ok(token instanceof Token.OpenParenthesis, 'should be an OpenParenthesis');
                t.end();
            });
            t.test('├── close', t => {
                const [ token ] = lex(')');
                t.ok(token);
                t.ok(token instanceof Token.CloseParenthesis, 'should be a CloseParenthesis');
                t.end();
            });
        });
        t.test('├─ invalid token', t => {
            t.throws(
                () => lex('@'),
                LexError
            );
            t.end();
        });
    });
    main.test('├ full expression ', t => {
        const tokens = lex('1+22*33.33/444.444');
        t.equal(tokens.length, 7, 'should find 7 tokens');
        t.ok(tokens[0] instanceof Token._Number, '0 is a _Number');
        t.equal(tokens[0].value, 1);
        t.ok(tokens[1] instanceof Token.Addition, '1 is an Addition');
        t.ok(tokens[2] instanceof Token._Number, '2 is a _Number');
        t.equal(tokens[2].value, 22);
        t.ok(tokens[3] instanceof Token.Multiplication, '3 is an Multiplication');
        t.ok(tokens[4] instanceof Token._Number, '4 is a _Number');
        t.equal(tokens[4].value, 33.33);
        t.ok(tokens[5] instanceof Token.Division, '5 is an Division');
        t.ok(tokens[6] instanceof Token._Number, '6 is a _Number');
        t.equal(tokens[6].value, 444.444);
        t.equal(tokens[7], undefined, '7 is undefined');
        t.end();
    });
});