'use strict';

const WAYCore = {};

(() => {
  class EventEmitter {
    constructor() {
      this._events = {};
    }

    once(eventName, handler) {
      this.setupEventNameSpace(eventName);
      this.registerEventHandler(eventName, 'once', handler);
      return this;
    }

    on(eventName, handler) {
      this.setupEventNameSpace(eventName);
      this.registerEventHandler(eventName, 'on', handler);
      return this;
    }

    emit(eventName) {
      const args = Array.prototype.slice.call(arguments);

      if (this._events[eventName] !== undefined) {
        this._events[eventName].forEach((listener, index) => {
          if (/once/.test(listener.type)) {
            this._events[eventName].splice(index, 1);
          }

          this.callHandler(listener.handler, args.slice(1));
        });
      }
    }

    setupEventNameSpace(eventName) {
      if (this._events[eventName] === undefined) {
        this._events[eventName] = [];
      }
    }

    registerEventHandler(eventName, type, handler) {
      this._events[eventName].push({
        type,
        handler
      });
    }

    callHandler(handler, args) {
      if (typeof handler === 'function') {
        handler.apply(this, args);
      }
    }

  }

  WAYCore.EventEmitter = new EventEmitter();
})();