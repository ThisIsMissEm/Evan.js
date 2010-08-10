;(function(root, undefined){
// Setup an isArray, for browsers in which it isn't native.
  var isArray = Array.isArray || function(obj) {
    return !!(obj && obj.concat && obj.unshift && !obj.callee);
  };

  function async_call(func, args, thisArg){
    setTimeout(function(){
      func.apply(thisArg, args || []);
    }, 1);
  };

/*-----------------------------------------------
  The actual Emitter
-----------------------------------------------*/
  function Emitter(){
    this._events = {};
  };

  Emitter.prototype.bind = function(evt, listener) {
    if ('function' !== typeof listener) {
      throw new Error('addListener only takes instances of Function');
    }

    if (!this._events) this._events = {};
    if (!this._events[evt]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[evt] = listener;
    } else if (isArray(this._events[evt])) {
      // If we've already got an array, just append.
      this._events[evt].push(listener);
    } else {
      // Adding the second element, need to change to array.
      this._events[evt] = [this._events[evt], listener];
    }
    return this;
  };

  Emitter.prototype.unbind = function(evt, listener){
    if (!this._events || !this._events[evt])
      return this;

    if(listener === undefined || this._events[evt] === listener) {
      delete this._events[evt];
    } else {
      if ('function' !== typeof listener) {
        throw new Error('unbind only takes instances of Function');
      }

      var list = this._events[evt];

      if (isArray(list)) {
        var i = list.indexOf(listener);
        if (i > -1) {
          list.splice(i, 1);
          if (list.length == 0){
            delete this._events[evt];
          }
        }
      }
    }

    return this;
  };

  Emitter.prototype.emit = function(evt){
    if (!this._events || !this._events[evt]) return false;

    if (typeof this._events[evt] == 'function') {
      if (arguments.length < 3) { // fast case
        async_call(this._events[evt], [arguments[1], arguments[2]], this);
      } else { // slower
        async_call(this._events[evt], Array.prototype.slice.call(arguments, 1), this);
      }
      return true;
    } else if (isArray(this._events[evt])) {
      for (var i = 0
        , args = Array.prototype.slice.call(arguments, 1)
        , listeners = this._events[evt].slice(0), l = listeners.length
        ; i < l; ++i
      ) {
        async_call(listeners[i], args, this);
      }
      return true;
    } else {
      return false;
    }
  };

/*-----------------------------------------------
  The Sir Evan
-----------------------------------------------*/
  root.Evan = function(klass){
    if(klass === undefined){
      return new Emitter;
    } else {
      Emitter.call(klass);

      // Let's extend!
      var kp = (klass.prototype ? klass.prototype : klass)
        , ep = Emitter.prototype;

      for(var p in ep) if(Object.prototype.hasOwnProperty.call(ep, p)) {
        kp[p] = ep[p];
      }

      return klass;
    }
  };

  // So that if you do overload bind, unbind, or emit then
  // you can easily monkey patch it back.
  root.Evan.Emitter = Emitter;

  if(typeof exports !== 'undefined'){
    exports.Evan = root.Evan;
  }
})(this);