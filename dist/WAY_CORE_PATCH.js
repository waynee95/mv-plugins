"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WAYCore = {};

(function () {
  var EventEmitter = /*#__PURE__*/function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      this._events = {};
    }

    _createClass(EventEmitter, [{
      key: "once",
      value: function once(eventName, handler) {
        this.setupEventNameSpace(eventName);
        this.registerEventHandler(eventName, "once", handler);
        return this;
      }
    }, {
      key: "on",
      value: function on(eventName, handler) {
        this.setupEventNameSpace(eventName);
        this.registerEventHandler(eventName, "on", handler);
        return this;
      }
    }, {
      key: "emit",
      value: function emit(eventName) {
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
    }, {
      key: "setupEventNameSpace",
      value: function setupEventNameSpace(eventName) {
        if (this._events[eventName] === undefined) {
          this._events[eventName] = [];
        }
      }
    }, {
      key: "registerEventHandler",
      value: function registerEventHandler(eventName, type, handler) {
        this._events[eventName].push({
          type: type,
          handler: handler
        });
      }
    }, {
      key: "callHandler",
      value: function callHandler(handler, args) {
        if (typeof handler === "function") {
          handler.apply(this, args);
        }
      }
    }]);

    return EventEmitter;
  }();

  WAYCore.EventEmitter = new EventEmitter();
})();