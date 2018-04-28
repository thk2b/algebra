'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _Node = require('../Node');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tapeCatch2.default)('core/Node', function (main) {
    main.test('├ constructor', function (t) {
        t.test('├─ with no child nodes', function (t) {
            var n = new _Node2.default(1);
            t.equal(n.right, undefined);
            t.equal(n.left, undefined);
            t.end();
        });
        t.test('├─ with valid child nodes', function (t) {
            var n = new _Node2.default(1, new _Node2.default(2), new _Node2.default(3));
            t.equal(n.value, 1, 'value should be set');
            t.equal(n.left.value, 2, 'left should be set');
            t.equal(n.right.value, 3, 'right should be set');
            t.end();
        });
        t.test('├─ with invalid child nodes', function (t) {
            t.throws(function () {
                return new _Node2.default(1, 2, new _Node2.default(3));
            });
            t.end();
        });
    });
    main.test('├ count', function (t) {
        var n0 = new _Node2.default(1);
        var n1 = new _Node2.default(2, new _Node2.default(3));
        var n2 = new _Node2.default(3, new _Node2.default(4), new _Node2.default(5));
        t.equal(n0.count, 0);
        t.equal(n1.count, 1);
        t.equal(n2.count, 2);
        t.end();
    });
    main.test('├ set', function (t) {
        t.test('├─ invalid child nodes', function (t) {
            t.throws(function () {
                return new _Node2.default(1, 2, new _Node2.default(3));
            });
            t.end();
        });
        var n = new _Node2.default();
        t.equal(n.value, undefined);
        t.equal(n.set(1).value, 1);
        t.equal(n.set(2).value, 2);
        t.end();
    });
    main.test('├ add', function (t) {
        t.test('├─ valid child nodes', function (t) {
            var root = new _Node2.default(0);
            var n1 = new _Node2.default(1);
            var n2 = new _Node2.default(2);
            var n3 = new _Node2.default(3);
            root.add(n1);
            t.equal(root.left, n1, 'should add left node');
            root.add(n2);
            t.equal(root.right, n2, 'should add right node');
            t.throws(function () {
                return root.add(n2);
            }, 'can\'t add more than two nodes');
            t.end();
        });
        t.test('├─ invalid child nodes', function (t) {
            t.throws(function () {
                return new _Node2.default(1).add(1);
            });
            t.end();
        });
    });
    main.test('├ insertRight', function (t) {
        t.test('├─ with a valid node', function (t) {
            var n0 = new _Node2.default(0);
            var n1 = new _Node2.default(1);
            var n2 = new _Node2.default(2);
            var root = new _Node2.default(0, n0, n1);
            var ret = root.insertRight(n2);
            t.equal(root.right, n2, 'should add the node to root');
            t.equal(n2.left, n1, 'the inserted node should point to the old right node');
            t.equal(ret, n2, 'should return the node');
            t.end();
        });
        t.test('├─ with an invalid node', function (t) {
            t.throws(function () {
                return new _Node2.default(0, new Noode(1), new _Node2.default(2)).insertRight(1);
            });
            t.end();
        });
    });
    main.test('├ insertLeft', function (t) {
        t.test('├─ with a valid node', function (t) {
            var n0 = new _Node2.default(0);
            var n1 = new _Node2.default(1);
            var n2 = new _Node2.default(2);
            var root = new _Node2.default(0, n0, n1);
            var ret = root.insertLeft(n2);
            t.equal(root.left, n2, 'should add the node to root');
            t.equal(n2.left, n0, 'the inserted node should point to the old left node');
            t.equal(ret, n2, 'should return the node');
            t.end();
        });
        t.test('├─ with an invalid node', function (t) {
            t.throws(function () {
                return new _Node2.default(0, new Noode(1), new _Node2.default(2)).insertLeft(1);
            });
            t.end();
        });
    });
    main.test('├ walk', function (t) {
        t.test('├─ minimal tree', function (t) {
            var root = new _Node2.default(0);
            var left = new _Node2.default(1);
            var right = new _Node2.default(2);
            root.add(left).add(right);
            var walk = Array.from(root.walk());
            t.deepEqual(walk, [0, 1, 2]);
            t.deepEqual(Array.from(root), walk, 'walk is the default iterator');
            t.end();
        });
        t.test('├─ large tree', function (t) {
            /*    0
             *  1   4
             * 2 3 5 6
             */
            var root = new _Node2.default(0);
            var n1 = new _Node2.default(1);
            var n2 = new _Node2.default(2);
            var n3 = new _Node2.default(3);
            var n4 = new _Node2.default(4);
            var n5 = new _Node2.default(5);
            var n6 = new _Node2.default(6);
            root.add(n1).add(n4);
            n1.add(n2).add(n3);
            n4.add(n5).add(n6);

            var walk = Array.from(root.walk());
            t.deepEqual(walk, [0, 1, 2, 3, 4, 5, 6]);
            t.end();
        });
    });
});