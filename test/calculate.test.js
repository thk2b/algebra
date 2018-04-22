import test from 'tape'

import calculate from '../src'

test('calculate(expression)', main => {
    main.test('basic operations with +', t => {
        t.equal(calculate('1 + 1'), 2, 'identity')
        t.equal(calculate('1 + 10'), 11)
        t.equal(calculate('1.54321 + 1'), 2.54321)
        t.end()
    })
    main.test('basic operations with -', t => {
        t.equal(calculate('1 - 1'), 0, 'identity')
        t.equal(calculate('1 - 10'), 9)
        t.equal(calculate('1.54321 - 1'), 1.54321)
        t.end()
    })
    main.test('basic operations with *', t => {
        t.equal(calculate('1 * 1'), 1, 'identity')
        t.equal(calculate('1 * 10'), 10)
        t.equal(calculate('2 * 11'), 22)
        t.equal(calculate('1.54321 * 10'), 15.4321)
        t.end()
    })
    main.test('basic operations with /', t => {
        t.equal(calculate('1 / 1'), 1, 'identity')
        t.equal(calculate('1 / 10'), 0.1)
        t.equal(calculate('147 / 7'), 21)
        t.equal(calculate('1.54321 / 10'), 0.154321)
        t.end()
    })
    main.test('basic operations with %', t => {
        t.equal(calculate('1 % 1'), 0, 'identity')
        t.equal(calculate('1 % 10'), 1)
        t.equal(calculate('123 % 12'), 3)
        t.equal(calculate('15.4321 % 4'), 3.4321)
        t.end()
    })
})