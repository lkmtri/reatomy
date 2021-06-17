'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function createAtom(state) {
  return function (initialState) {
    var _state = initialState !== null && initialState !== void 0 ? initialState : state;

    var _subsribers = [];

    var notify = function notify() {
      _subsribers.forEach(function (sub) {
        return sub(_state);
      });
    };

    return {
      get: function get() {
        return _state;
      },
      set: function set(setFn) {
        if (typeof setFn === 'function') {
          _state = setFn(_state);
        } else {
          _state = setFn;
        }

        notify();
      },
      subscribe: function subscribe(fn) {
        _subsribers.push(fn);

        return function () {
          _subsribers = _subsribers.filter(function (sub) {
            return sub !== fn;
          });
        };
      }
    };
  };
}

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var createAtomContext = function createAtomContext(initialStates) {
  var atomMap = new WeakMap();

  var _iterator = _createForOfIteratorHelper(initialStates),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray__default['default'](_step.value, 2),
          a = _step$value[0],
          s = _step$value[1];

      atomMap.set(a, a(s));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  function getAtom(a) {
    if (atomMap.has(a)) {
      return atomMap.get(a);
    }

    atomMap.set(a, a());
    return atomMap.get(a);
  }

  return getAtom;
};

var AtomContext = React__default['default'].createContext(createAtomContext([]));
var AtomProvider = function AtomProvider(_ref) {
  var children = _ref.children,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? [] : _ref$initialState;

  var _useState = React.useState(function () {
    return createAtomContext(initialState);
  }),
      _useState2 = _slicedToArray__default['default'](_useState, 1),
      context = _useState2[0];

  return React__default['default'].createElement(AtomContext.Provider, {
    value: context
  }, children);
};
function useAtomContext(atom) {
  var getAtom = React.useContext(AtomContext);
  return getAtom(atom);
}

function useAtom(atom) {
  var atomState = useAtomContext(atom);

  var _useState = React.useState(atomState.get),
      _useState2 = _slicedToArray__default['default'](_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  React.useEffect(function () {
    return atomState.subscribe(setState);
  }, [atomState]);
  return [state, atomState.set];
}
function useAtomReducer(atom, reducer) {
  var atomState = useAtomContext(atom);

  var _useState3 = React.useState(atomState.get),
      _useState4 = _slicedToArray__default['default'](_useState3, 2),
      state = _useState4[0],
      setState = _useState4[1];

  var reducerRef = React.useRef(reducer);
  React.useLayoutEffect(function () {
    reducerRef.current = reducer;
  });
  React.useEffect(function () {
    return atomState.subscribe(setState);
  }, [atomState]);
  var dispatch = React.useCallback(function (action) {
    atomState.set(reducerRef.current(atomState.get(), action));
  }, [atomState]);
  return [state, dispatch];
}

exports.AtomProvider = AtomProvider;
exports.atom = createAtom;
exports.useAtom = useAtom;
exports.useAtomReducer = useAtomReducer;
