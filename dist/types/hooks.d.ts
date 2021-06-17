import type { Atom } from './atom';
export declare function useAtom<T>(atom: Atom<T>): readonly [T, (updater: T | import("./atom").UpdateFn<T>) => void];
export declare type Reducer<T, A> = (s: T, a: A) => T;
export declare function useAtomReducer<T, A>(atom: Atom<T>, reducer: Reducer<T, A>): readonly [T, (action: A) => void];
