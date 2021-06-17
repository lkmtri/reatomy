import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import type { Atom } from './atom'
import { useAtomContext } from './context'

export function useAtom<T>(atom: Atom<T>) {
  const atomState = useAtomContext(atom)

  const [state, setState] = useState(atomState.get)

  useEffect(() => atomState.subscribe(setState), [atomState])

  return [state, atomState.set] as const
}

export type Reducer<T, A> = (s: T, a: A) => T

export function useAtomReducer<T, A>(atom: Atom<T>, reducer: Reducer<T, A>) {
  const atomState = useAtomContext(atom)

  const [state, setState] = useState(atomState.get)

  const reducerRef = useRef(reducer)

  useLayoutEffect(() => {
    reducerRef.current = reducer
  })

  useEffect(() => atomState.subscribe(setState), [atomState])

  const dispatch = useCallback(
    (action: A) => {
      atomState.set(reducerRef.current(atomState.get(), action))
    },
    [atomState]
  )

  return [state, dispatch] as const
}
