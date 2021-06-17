import React, { useState, useContext, useEffect, useRef, useLayoutEffect, useCallback } from 'react';

function createAtom(state) {
    return function (initialState) {
        var _state = initialState !== null && initialState !== void 0 ? initialState : state;
        var _subsribers = [];
        var notify = function () {
            _subsribers.forEach(function (sub) { return sub(_state); });
        };
        return {
            get: function () { return _state; },
            set: function (setFn) {
                if (typeof setFn === 'function') {
                    _state = setFn(_state);
                }
                else {
                    _state = setFn;
                }
                notify();
            },
            subscribe: function (fn) {
                _subsribers.push(fn);
                return function () {
                    _subsribers = _subsribers.filter(function (sub) { return sub !== fn; });
                };
            }
        };
    };
}

var createAtomContext = function (initialStates) {
    var atomMap = new WeakMap();
    for (var _i = 0, initialStates_1 = initialStates; _i < initialStates_1.length; _i++) {
        var _a = initialStates_1[_i], a = _a[0], s = _a[1];
        atomMap.set(a, a(s));
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
var AtomContext = React.createContext(createAtomContext([]));
var AtomProvider = function (_a) {
    var children = _a.children, _b = _a.initialState, initialState = _b === void 0 ? [] : _b;
    var context = useState(function () { return createAtomContext(initialState); })[0];
    return React.createElement(AtomContext.Provider, { value: context }, children);
};
function useAtomContext(atom) {
    var getAtom = useContext(AtomContext);
    return getAtom(atom);
}

function useAtom(atom) {
    var atomState = useAtomContext(atom);
    var _a = useState(atomState.get), state = _a[0], setState = _a[1];
    useEffect(function () { return atomState.subscribe(setState); }, [atomState]);
    return [state, atomState.set];
}
function useAtomReducer(atom, reducer) {
    var atomState = useAtomContext(atom);
    var _a = useState(atomState.get), state = _a[0], setState = _a[1];
    var reducerRef = useRef(reducer);
    useLayoutEffect(function () {
        reducerRef.current = reducer;
    });
    useEffect(function () { return atomState.subscribe(setState); }, [atomState]);
    var dispatch = useCallback(function (action) {
        atomState.set(reducerRef.current(atomState.get(), action));
    }, [atomState]);
    return [state, dispatch];
}

export { AtomProvider, createAtom as atom, useAtom, useAtomReducer };
