'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WAYCore = {};

(function () {
    var EventEmitter = function () {
        function EventEmitter() {
            _classCallCheck(this, EventEmitter);

            this._events = {};
        }

        _createClass(EventEmitter, [{
            key: 'once',
            value: function () {
                function once(eventName, handler) {
                    this.setupEventNameSpace(eventName);
                    this.registerEventHandler(eventName, 'once', handler);
                    return this;
                }

                return once;
            }()
        }, {
            key: 'on',
            value: function () {
                function on(eventName, handler) {
                    this.setupEventNameSpace(eventName);
                    this.registerEventHandler(eventName, 'on', handler);
                    return this;
                }

                return on;
            }()
        }, {
            key: 'emit',
            value: function () {
                function emit(eventName) {
                    var _this = this;

                    var args = Array.prototype.slice.call(arguments);
                    if (this._events[eventName] !== undefined) {
                        this._events[eventName].forEach(function (listener, index) {
                            if (/once/.test(listener.type)) {
                                _this._events[eventName].splice(index, 1);
                            }
                            _this.callHandler(listener.handler, args.slice(1));
                        });
                    }
                }

                return emit;
            }()
        }, {
            key: 'setupEventNameSpace',
            value: function () {
                function setupEventNameSpace(eventName) {
                    if (this._events[eventName] === undefined) {
                        this._events[eventName] = [];
                    }
                }

                return setupEventNameSpace;
            }()
        }, {
            key: 'registerEventHandler',
            value: function () {
                function registerEventHandler(eventName, type, handler) {
                    this._events[eventName].push({ type: type, handler: handler });
                }

                return registerEventHandler;
            }()
        }, {
            key: 'callHandler',
            value: function () {
                function callHandler(handler, args) {
                    if (typeof handler === 'function') {
                        handler.apply(this, args);
                    }
                }

                return callHandler;
            }()
        }]);

        return EventEmitter;
    }();

    WAYCore.EventEmitter = new EventEmitter();
})();