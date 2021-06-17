import React, { useContext, useState } from 'react'
import type { Atom, AtomState } from './atom'

export type InitialAtomState<T = unknown> = readonly [Atom<T>, T]

const createAtomContext = (initialStates: InitialAtomState[]) => {
  const atomMap = new WeakMap<Atom<any>, AtomState<any>>()

  for (const [a, s] of initialStates) {
    atomMap.set(a, a(s))
  }

  function getAtom<T>(a: Atom<T>): AtomState<T> {
    if (atomMap.has(a)) {
      return atomMap.get(a) as AtomState<T>
    }

    atomMap.set(a, a())
    return atomMap.get(a) as AtomState<T>
  }

  return getAtom
}

const AtomContext = React.createContext(createAtomContext([]))

export interface AtomProviderProps {
  initialState?: InitialAtomState[]
}

export const AtomProvider: React.FC<AtomProviderProps> = ({ children, initialState = [] }) => {
  const [context] = useState(() => createAtomContext(initialState))
  return <AtomContext.Provider value={context}>{children}</AtomContext.Provider>
}

export function useAtomContext<T>(atom: Atom<T>) {
  const getAtom = useContext(AtomContext)
  return getAtom(atom)
}
