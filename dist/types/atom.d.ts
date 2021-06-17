export declare type Subscriber<T> = (state: T) => void;
export declare type UpdateFn<T> = (s: T) => T;
export declare type AtomState<T> = {
    get: () => T;
    set: (updater: T | UpdateFn<T>) => void;
    subscribe: (s: Subscriber<T>) => void;
};
export declare type Atom<T> = {
    (s?: T): AtomState<T>;
};
export declare function createAtom<T>(state: T): Atom<T>;
