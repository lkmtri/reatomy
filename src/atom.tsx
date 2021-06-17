export type Subscriber<T> = (state: T) => void

export type UpdateFn<T> = (s: T) => T

export type AtomState<T> = {
  get: () => T
  set: (updater: T | UpdateFn<T>) => void
  subscribe: (s: Subscriber<T>) => void
}

export type Atom<T> = {
  (s?: T): AtomState<T>
}

export function createAtom<T>(state: T): Atom<T> {
  return (initialState?: T) => {
    let _state = initialState ?? state
    let _subsribers: Subscriber<T>[] = []

    const notify = () => {
      _subsribers.forEach((sub) => sub(_state))
    }

    return {
      get: () => _state,
      set: (setFn) => {
        if (typeof setFn === 'function') {
          _state = (setFn as UpdateFn<T>)(_state)
        } else {
          _state = setFn
        }

        notify()
      },
      subscribe: (fn) => {
        _subsribers.push(fn)

        return () => {
          _subsribers = _subsribers.filter((sub) => sub !== fn)
        }
      },
    }
  }
}
