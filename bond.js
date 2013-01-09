// Generated by CoffeeScript 1.4.0
(function() {
  var arrayEqual, bond, createReturnSpy, createThroughSpy, enhanceSpy,
    __slice = [].slice;

  createThroughSpy = function(getValue, bondApi) {
    var spy;
    spy = function() {
      var args, isConstructor, result;
      args = Array.prototype.slice.call(arguments);
      spy.calledArgs[spy.called] = args;
      spy.called++;
      isConstructor = Object.keys(this).length === 0;
      result = getValue.apply(this, args);
      if (isConstructor) {
        return this;
      }
      return result;
    };
    return enhanceSpy(spy, getValue, bondApi);
  };

  createReturnSpy = function(getValue, bondApi) {
    var spy;
    spy = function() {
      var args;
      args = Array.prototype.slice.call(arguments);
      spy.calledArgs[spy.called] = args;
      spy.called++;
      return getValue.apply(this, args);
    };
    return enhanceSpy(spy, getValue, bondApi);
  };

  enhanceSpy = function(spy, original, bondApi) {
    var k, v;
    spy.prototype = original.prototype;
    spy.called = 0;
    spy.calledArgs = [];
    spy.calledWith = function() {
      var args, lastArgs;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!spy.called) {
        return false;
      }
      lastArgs = spy.calledArgs[spy.called - 1];
      return arrayEqual(args, lastArgs);
    };
    for (k in bondApi) {
      v = bondApi[k];
      spy[k] = v;
    }
    return spy;
  };

  arrayEqual = function(A, B) {
    var a, b, i, _i, _len;
    for (i = _i = 0, _len = A.length; _i < _len; i = ++_i) {
      a = A[i];
      b = B[i];
      if (a !== b) {
        return false;
      }
    }
    return true;
  };

  bond = function(obj, property) {
    var previous, restore, returnMethod, through, to, unregistered;
    if (arguments.length === 0) {
      return createReturnSpy(function() {});
    }
    previous = obj[property];
    if (!(previous != null)) {
      throw new Error("Could not find property " + property + ".");
    }
    unregistered = false;
    restore = function() {
      if (unregistered) {
        return;
      }
      obj[property] = previous;
      return unregistered = true;
    };
    to = function(newValue) {
      afterEach(restore);
      obj[property] = newValue;
      return obj[property];
    };
    returnMethod = function(returnValue) {
      var returnValueFn;
      afterEach(restore);
      returnValueFn = function() {
        return returnValue;
      };
      obj[property] = createReturnSpy(returnValueFn, this);
      return obj[property];
    };
    through = function() {
      afterEach(restore);
      obj[property] = createThroughSpy(previous, this);
      return obj[property];
    };
    return {
      to: to,
      "return": returnMethod,
      through: through,
      restore: restore
    };
  };

  if (typeof window !== "undefined" && window !== null) {
    window.bond = bond;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = bond;
  }

}).call(this);
