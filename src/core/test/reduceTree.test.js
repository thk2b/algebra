import test from 'tape';

import reduceTree, { ReductionError } from '../reduceTree';
import { lex, parse, Node, Token } from '../';

test('core/reduceTree', main => {
    main.test('├ basic expressions', t => {
        t.test('├─ irreducible division', t => {
            const node = reduceTree(parse(lex('1/2')));
            t.ok(node.value instanceof Token.Division);
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 1 },
                { value: 2 },
            ]);
            t.end();
        });
        t.test('├─ reducible division', t => {
            const node = reduceTree(parse(lex('10/20')));
            t.ok(node.value instanceof Token.Division);
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 1 },
                { value: 2 },
            ]);
            t.end();
        });
        t.test('├─ division by 1', t => {
            const node = reduceTree(parse(lex('20/10')));
            t.ok(node.value instanceof Token.Division);
            t.deepEqual(Array.from(node.walk()), [
                { value: 2 }
            ]);
            t.end();
        });
        t.test('├─ division by 0', t => {
            t.throws(
                () => reduceTree(parse(lex('20/0'))),
                ReductionError
            );
            t.end();
        });
    });
    main.test('├ composed expressions', t => {
        t.test('├─ sum of divisions', t => {
            const node = reduceTree(parse(lex('(10/20)+(5/6)')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 4 },
                { value: 3 },
            ]);
            t.end();
        });  
        t.test('├─ substraction of divisions', t => {
            const node = reduceTree(parse(lex('(6/12))-(4/5)')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: -3 },
                { value: 10 },
            ]);
            t.end();
        });  
        t.test('├─ product of divisions', t => {
            const node = reduceTree(parse(lex('(8/7)(14/9)')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 16 },
                { value: 9 },
            ]);
            t.end();
        });  
        t.test('├─ division of divisions', t => {
            const node = reduceTree(parse(lex('(4/6)/(5/17)')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 34 },
                { value: 15 },
            ]);
            t.end();
        });  
    });
    t.test('more complex expresisons', t => {
        t.test('├─ 1', t => {
            const node = reduceTree(parse(lex('(5+5/20)+(5/6)')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 4 },
                { value: 3 },
            ]);
            t.end();
        });  
        t.test('├─ 2', t => {
            const node = reduceTree(parse(lex('(3+3/(6*2))-(2^2/5)')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: -3 },
                { value: 10 },
            ]);
            t.end();
        });  
        t.test('├─ 3', t => {
            const node = reduceTree(parse(lex('((10-2)/7)(14/3^2)')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 16 },
                { value: 9 },
            ]);
            t.end();
        });  
        t.test('├─ 4', t => {
            const node = reduceTree(parse(lex('(2+2/3*2)/(4+1/(5*2+7))')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '/', precedence: 1 },
                { value: 34 },
                { value: 15 },
            ]);
            t.end();
        });
        t.test('├─ 5', t => {
            const node = reduceTree(parse(lex('3*10/30')));
            t.deepEqual(Array.from(node.walk()), [
                { operator: '*', precedence: 1 },
                { value: 3 },
                { operator: '/', precedence: 1 },
                { value: 1 },
                { value: 3 },
            ]);
            t.end();
        });
    });
});