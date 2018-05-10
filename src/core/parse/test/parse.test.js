import test from 'tape-catch';

import { parse, Node, lex, Token } from '../../';
import _SyntaxError from '../../../Errors/Syntax';

test('core/parse', main => {
    main.test('├ number', t => {
        const tokens = lex('1');
        const root = parse(tokens);
        t.ok(root instanceof Node);
        t.ok(root.value instanceof Token._Number);
        t.end();
    });
    main.test('├ negative number', t => {
        const tokens = lex('-1');
        const root = parse(tokens);
        t.ok(root.value instanceof Token._Number);
        t.equal(root.value.value, -1);
        t.end();
    });
    main.test('├─ simple expressions with unary operations', t => {
        t.test('├── sqrt', t => {
            const tokens = lex(':sqrt(1)');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.SquareRoot, 'root is a square root operation');
            t.ok(root.left.value instanceof Token._Number, 'left is a number');
            t.end();
        })
        t.test('├── sin', t => {
            const tokens = lex(':sin(1)');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Sin, 'root is a sin operation');
            t.ok(root.left.value instanceof Token._Number, 'left is a number');
            t.end();
        })
        t.test('├── cos', t => {
            const tokens = lex(':cos(1)');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Cos, 'root is a cos operation');
            t.ok(root.left.value instanceof Token._Number, 'left is a number');
            t.end();
        })
        t.test('├── tan', t => {
            const tokens = lex(':tan(1)');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Tan, 'root is a tan operation');
            t.ok(root.left.value instanceof Token._Number, 'left is a number');
            t.end();
        })
    })
    main.test('├ more complex unary operations', t => {
        t.test('├─ cos(a+b)', t => {
            const tokens = lex(':cos(1+2)');
            const root = parse(tokens);
            const walk = Array.from(root.walk());
            t.deepEqual(walk, [
                { name: 'cos' },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 1 },
                { value: 2 }
            ]);
            t.end();
        });
        t.test('├─ a + b * sqrt(a)', t => {
            const tokens = lex('1 + 2 * :sqrt(5)');
            const root = parse(tokens);
            const walk = Array.from(root.walk());
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { operator: '*', precedence: 1, isParenthesized: null },
                { value: 2 },
                { name: 'sqrt' },
                { value: 5 },
            ]);
            t.end();
        });
        t.test('├─ sqrt(a) b + c', t => {
            const tokens = lex(':sqrt(50) 20 + 40');
            const root = parse(tokens);
            const walk = Array.from(root.walk());
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { operator: '*', precedence: 1, isParenthesized: null },
                { name: 'sqrt' },
                { value: 50 },
                { value: 20 },
                { value: 40 }
            ]);
            t.end();
        });
    })
    main.test('├ simple binary expressions', t => {
        t.test('├─ addition', t => {
            const tokens = lex('10 + 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Addition);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ substraction', t => {
            const tokens = lex('10 - 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Substraction);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ multiplication', t => {
            const tokens = lex('10 * 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Multiplication);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ division', t => {
            const tokens = lex('10 / 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Division);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ exponentiation', t => {
            const tokens = lex('2 ^ 4');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Exponentiation);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 2);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 4);
            t.end();
        });
    });

    main.test('├ more complex expressions', t => {
        t.test('├─ a * b / c * d', t => {
            const root = parse(lex('1*2/3*4'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '*', precedence: 1, isParenthesized: null },
                { operator: '/', precedence: 1, isParenthesized: null },
                { operator: '*', precedence: 1, isParenthesized: null },
                { value: 1 }, { value: 2 },
                { value: 3 }, { value: 4 },
            ]);
            t.end();
        });
        t.test('├─ -a / -b', t => {
            const root = parse(lex('-4/-2'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '/', precedence: 1, isParenthesized: null },
                { value: -4 },
                { value: -2 },
            ]);
            t.end();
        });
        t.test('├─ -a -b', t => {
            const root = parse(lex('-1-2'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '-', precedence: 0, isParenthesized: null },
                { value: -1 },
                { value: 2 },
            ]);
            t.end();
        });
        t.test('├─ a + b + c', t => {
            const root = parse(lex('1 + 20 + 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ]);
            t.end();
        });
        t.test('├─ a + b + c - d - e', t => {
            const root = parse(lex('1 + 20 + 3.5 - 4 - 5'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '-', precedence: 0, isParenthesized: null },
                { operator: '-', precedence: 0, isParenthesized: null },
                { operator: '+', precedence: 0, isParenthesized: null },
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { value: 20 },
                { value: 3.5 },
                { value: 4 },
                { value: 5 },
            ]);
            t.end();
        });
        t.test('├─ a * b + c ', t => {
            const root = parse(lex('1 * 20 + 3.5'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { operator: '*', precedence: 1, isParenthesized: null },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ]);
            t.end();
        });
        t.test('├─ a + b * c ', t => {
            const root = parse(lex('1 + 20 * 3.5'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { operator: '*', precedence: 1, isParenthesized: null },
                { value: 20 },
                { value: 3.5 }
            ]);
            t.end();
        });
        t.test('├─ a + b * c - e / f', t => {
            const root = parse(lex('1 + 20 * 3.5 - 4 / 5'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '-', precedence: 0, isParenthesized: null },
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { operator: '*', precedence: 1, isParenthesized: null },
                { value: 20 },
                { value: 3.5 },
                { operator: '/', precedence: 1, isParenthesized: null },
                { value: 4 },
                { value: 5 },
            ]);
            t.end();
        });
        t.test('├─ a ^ b + c ', t => {
            const root = parse(lex('4 + 2 ^ 3'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 4 },
                { operator: '^', precedence: 2, isParenthesized: null },
                { value: 2 },
                { value: 3 }
            ]);
            t.end();
        });
        t.test('├─ a * b ^ c ', t => {
            const root = parse(lex('4 * 2 ^ 3'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '*', precedence: 1, isParenthesized: null },
                { value: 4 },
                { operator: '^', precedence: 2, isParenthesized: null },
                { value: 2 },
                { value: 3 }
            ]);
            t.end();
        });
        t.test('├─ a ^ b ^ c ^ c', t => {
            const root = parse(lex('2 ^ 2 ^ 2 ^ 2'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '^', precedence: 2, isParenthesized: null },
                { operator: '^', precedence: 2, isParenthesized: null },
                { operator: '^', precedence: 2, isParenthesized: null },
                { value: 2 },
                { value: 2 },
                { value: 2 },
                { value: 2 },
            ]);
            t.end();
        });
    });
    
    main.test('├ expressions with parentheses', t => {
        t.test('├─ a + (b + c)', t => {
            const root = parse(lex('1 + (20 + 3.5)'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ (a + b) * c ', t => {
            const root = parse(lex('(1 + 20) * 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '*', precedence: 1, isParenthesized: null },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ a + (b + (c + d))', t => {
            const root = parse(lex('1 + (2 + (3 + 4))'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 2 },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 3 },
                { value: 4 },
            ])
            t.end()
        });
        t.test('├─ a + (b + (c - (d - e)))', t => {
            const root = parse(lex('1 + (20 + (3.5 - (4 - 5)))'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 20 },
                { operator: '-', precedence: 0, isParenthesized: true },
                { value: 3.5 },
                { operator: '-', precedence: 0, isParenthesized: true },
                { value: 4 },
                { value: 5 },
            ])
            t.end()
        });
        t.test('├─ a + (b + c) * d', t => {
            const root = parse(lex('0 + (1 + 20) * 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 0 },
                { operator: '*', precedence: 1, isParenthesized: null },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ a + ( b * ( c + ( d - e )) * f )', t => {
            const root = parse(lex('1+(2*(3+(4-5))*6)'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0, isParenthesized: null },
                { value: 1 },
                { operator: '*', precedence: 1, isParenthesized: true },
                { operator: '*', precedence: 1, isParenthesized: null },
                { value: 2 },
                { operator: '+', precedence: 0, isParenthesized: true },
                { value: 3 },
                { operator: '-', precedence: 0, isParenthesized: true },
                { value: 4 },
                { value: 5 },
                { value: 6 },
            ])
            t.end()
        });
        t.test('├─ a ^ (b ^ (c ^ d))', t => {
            const root = parse(lex('2 ^ ( 2 ^ ( 2 ^ 2 ))'));
            const walk = Array.from(root);
            t.deepEqual(walk, [
                { operator: '^', precedence: 2, isParenthesized: null },
                { value: 2 },
                { operator: '^', precedence: 2, isParenthesized: true },
                { value: 2 },
                { operator: '^', precedence: 2, isParenthesized: true },
                { value: 2 },
                { value: 2 },
            ]);
            t.end();
        });
        t.test('├─ wrapping the entire expression in parentheses', t => {
            const tokens = lex('(((10 / 2.5)))');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Division);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
    });

    main.test('├ syntax ParseErrors', t => {
        t.test('├─ binary operations', t => {
            t.test('├── no left operand', t => {
                t.throws(
                    () => parse(lex('* 2')),
                    _SyntaxError.InvalidOperation
                );
                t.end();
            });
            t.test('├── two adjacent operands', t => {
                t.throws(
                    () => parse(lex('2 * /')),
                    _SyntaxError.InvalidOperation
                );
                t.end();
            });
            t.test('├── no right operand', t => {
                t.throws(
                    () => parse(lex('2 + ')),
                    _SyntaxError.MissingNumber
                );
                t.end();
            });
            t.test('├─ no left operand', t => {
                t.throws(
                    () => parse(lex('* 3')),
                    _SyntaxError.MissingNumber
                );
                t.end();
            });
            t.test('├─ no operands', t => {
                t.throws(
                    () => parse(lex('*')),
                    _SyntaxError.MissingNumber
                );
                t.end();
            });
        });
        t.test('├─ parentheses', t => {
            t.test('├── no closing parenthesis ', t => {
                t.throws(
                    () => parse(lex('(1 - 2 ')),
                    _SyntaxError.UnmatchedParenthesis
                );
                t.throws(
                    () => parse(lex('1 - ( 2 ')),
                    _SyntaxError.UnmatchedParenthesis,
                    'throws when missing parenthesis somwhere in the expresison'
                );
                t.end();
            });
            t.test('├── no opening parenthesis', t => {
                t.throws(
                    () => parse(lex('1 - 2 )')),
                    _SyntaxError.UnmatchedParenthesis
                );
                t.end();
            });
        });
        t.test('├─ empty expression', t => {
            t.test('├── inside parentheses', t => {
                t.throws(
                    () => parse(lex('()')),
                    _SyntaxError.EmptyExpression
                );
                t.throws(
                    () => parse(lex('1 + ()')),
                    _SyntaxError.EmptyExpression,
                    'shoud throw when there are empty parens in the expression'
                );
                t.end();
            });
            t.test('├── empty input', t => {
                t.throws(
                    () => parse(lex(' ')),
                    _SyntaxError.EmptyExpression
                );
                t.end();
            });
        });
    });
});