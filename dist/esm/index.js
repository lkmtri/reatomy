import React, { useState, useContext, useEffect, useRef, useLayoutEffect, useCallback } from 'react';

function createAtom(state) {
  return (initialState) => {
    let _state = initialState != null ? initialState : state;
    let _subsribers = [];
    const notify = () => {
      _subsribers.forEach((sub) => sub(_state));
    };
    return {
      get: () => _state,
      set: (setFn) => {
        if (typeof setFn === "function") {
          _state = setFn(_state);
        } else {
          _state = setFn;
        }
        notify();
      },
      subscribe: (fn) => {
        _subsribers.push(fn);
        return () => {
          _subsribers = _subsribers.filter((sub) => sub !== fn);
        };
      }
    };
  };
}

const createAtomContext = (initialStates) => {
  const atomMap = new WeakMap();
  for (const [a, s] of initialStates) {
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
const AtomContext = React.createContext(createAtomContext([]));
const AtomProvider = ({ children, initialState = [] }) => {
  const [context] = useState(() => createAtomContext(initialState));
  return /* @__PURE__ */ React.createElement(AtomContext.Provider, {
    value: context
  }, children);
};
function useAtomContext(atom) {
  const getAtom = useContext(AtomContext);
  return getAtom(atom);
}

function useAtom(atom) {
  const atomState = useAtomContext(atom);
  const [state, setState] = useState(atomState.get);
  useEffect(() => atomState.subscribe(setState), [atomState]);
  return [state, atomState.set];
}
function useAtomReducer(atom, reducer) {
  const atomState = useAtomContext(atom);
  const [state, setState] = useState(atomState.get);
  const reducerRef = useRef(reducer);
  useLayoutEffect(() => {
    reducerRef.current = reducer;
  });
  useEffect(() => atomState.subscribe(setState), [atomState]);
  const dispatch = useCallback((action) => {
    atomState.set(reducerRef.current(atomState.get(), action));
  }, [atomState]);
  return [state, dispatch];
}

export { AtomProvider, createAtom as atom, useAtom, useAtomReducer };
