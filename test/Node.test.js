import test from 'tape';

import Node from '../src/util/Node';

test('Node', main => {
    main.test('├ constructor', t => {
        t.test('├─ with no child nodes', t => {
            const n = new Node(1)
            t.equal(n.right, undefined)    
            t.equal(n.left, undefined)
            t.end()
        })
        t.test('├─ with valid child nodes', t => {
            const n = new Node(1, new Node(2), new Node(3))
            t.equal(n.value, 1, 'value should be set')
            t.equal(n.left.value, 2, 'left should be set')
            t.equal(n.right.value, 3, 'right should be set')
            t.end()
        })
        t.test('├─ with invalid child nodes', t => {
            t.throws(
                () => new Node(1, 2, new Node(3))
            )
            t.end()
        })
        
    })
    main.test('├ count', t => {
        const n0 = new Node(1)
        const n1 = new Node(2, new Node(3))
        const n2 = new Node(3, new Node(4), new Node(5))
        t.equal(n0.count, 0)
        t.equal(n1.count, 1)
        t.equal(n2.count, 2)
        t.end()
    })
    main.test('├ set', t => {
        t.test('├─ invalid child nodes', t => {
            t.throws(
                () => new Node(1, 2, new Node(3))
            )
            t.end()
        })
        const n = new Node()
        t.equal(n.value, undefined)
        t.equal(n.set(1).value, 1)
        t.equal(n.set(2).value, 2)
        t.end()
    })
    main.test('├ add', t => {
        t.test('├─ valid child nodes', t => {
            const root = new Node(0)
            const n1 = new Node(1)
            const n2 = new Node(2)
            const n3 = new Node(3)
            root.add(n1)
            t.equal(root.left, n1, 'should add left node')
            root.add(n2)
            t.equal(root.right, n2, 'should add right node')
            t.throws(
                () => root.add(n2), 'can\'t add more than two nodes'
            )
            t.end()
        })
        t.test('├─ invalid child nodes', t => {
            t.throws(
                () => new Node(1).add(1)
            )
            t.end()
        })
    })
    main.test('├ insertRight', t => {
        t.test('├─ with a valid node', t => {
            const n0 = new Node(0)
            const n1 = new Node(1)
            const n2 = new Node(2)
            const root = new Node(0, n0, n1)
            const ret = root.insertRight(n2)
            t.equal(root.right, n2, 'should add the node to root')
            t.equal(n2.left, n1, 'the inserted node should point to the old right node')
            t.equal(ret, n2, 'should return the node')
            t.end()
        })
        t.test('├─ with an invalid node', t => {
            t.throws(
                () => new Node(0, new Noode(1), new Node(2)).insertRight(1)
            )
            t.end()
        })
    })
    main.test('├ insertLeft', t => {
        t.test('├─ with a valid node', t => {
            const n0 = new Node(0)
            const n1 = new Node(1)
            const n2 = new Node(2)
            const root = new Node(0, n0, n1)
            const ret = root.insertLeft(n2)
            t.equal(root.left, n2, 'should add the node to root')
            t.equal(n2.left, n0, 'the inserted node should point to the old left node')
            t.equal(ret, n2, 'should return the node')
            t.end()
        })
        t.test('├─ with an invalid node', t => {
            t.throws(
                () => new Node(0, new Noode(1), new Node(2)).insertLeft(1)
            )
            t.end()
        })
    })
    main.test('├ walk', t => {
        t.test('├─ minimal tree', t => {
            const root = new Node(0)
            const left = new Node(1)            
            const right = new Node(2)
            root.add(left).add(right)
            const walk = Array.from(root.walk())
            t.deepEqual(walk, [0, 1, 2])
            t.deepEqual(Array.from(root), walk, 'walk is the default iterator')
            t.end()
        })
        t.test('├─ large tree', t => {
            /*    0
             *  1   4
             * 2 3 5 6
             */
            const root = new Node(0)
            const n1 = new Node(1)
            const n2 = new Node(2)
            const n3 = new Node(3)
            const n4 = new Node(4)
            const n5 = new Node(5)
            const n6 = new Node(6)
            root.add(n1).add(n4)
            n1.add(n2).add(n3)
            n4.add(n5).add(n6)
            
            const walk = Array.from(root.walk())
            t.deepEqual(walk, [0,1,2,3,4,5,6])
            t.end()
        })
    })
})