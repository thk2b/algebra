"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
    function Node(value, left, right) {
        _classCallCheck(this, Node);

        this.value = value;
        this.left = left && this._validate(left);
        this.right = right && this._validate(right);
        return this;
    }

    _createClass(Node, [{
        key: "_validate",
        value: function _validate(node) {
            if (node instanceof Node) {
                return node;
            };
            throw new TypeError("Invalid Node: " + node);
        }
    }, {
        key: "set",
        value: function set(value) {
            this.value = value;
            return this;
        }
    }, {
        key: "add",
        value: function add(node) {
            if (this.left === undefined) {
                this.left = this._validate(node);
            } else if (this.right === undefined) {
                this.right = this._validate(node);
            } else {
                throw new Error("A node cannot have more than two children: you tried adding " + node + " to " + this);
            };
            return this;
        }
    }, {
        key: "insertRight",
        value: function insertRight(node) {
            this._validate(node).add(this.right);
            this.right = node;
            return node;
        }
    }, {
        key: "insertLeft",
        value: function insertLeft(node) {
            this._validate(node).add(this.left);
            this.left = node;
            return node;
        }
    }, {
        key: "walk",
        value: /*#__PURE__*/regeneratorRuntime.mark(function walk() {
            return regeneratorRuntime.wrap(function walk$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this.value;

                        case 2:
                            if (!(this.left !== undefined)) {
                                _context.next = 4;
                                break;
                            }

                            return _context.delegateYield(this.left, "t0", 4);

                        case 4:
                            ;

                            if (!(this.right !== undefined)) {
                                _context.next = 7;
                                break;
                            }

                            return _context.delegateYield(this.right, "t1", 7);

                        case 7:
                            ;

                        case 8:
                        case "end":
                            return _context.stop();
                    }
                }
            }, walk, this);
        })
    }, {
        key: Symbol.iterator,
        value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
            return regeneratorRuntime.wrap(function value$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            return _context2.delegateYield(this.walk(), "t0", 1);

                        case 1:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, value, this);
        })
    }, {
        key: "count",
        get: function get() {
            return [this.right, this.left].reduce(function (count, child) {
                return child === undefined ? count : count + 1;
            }, 0);
        }
    }]);

    return Node;
}();

exports.default = Node;
;