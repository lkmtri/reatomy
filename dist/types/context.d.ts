import React from 'react';
import type { Atom, AtomState } from './atom';
declare type InitialAtomState<T = unknown> = readonly [Atom<T>, T];
interface AtomProviderProps {
    initialState?: InitialAtomState[];
}
export declare const AtomProvider: React.FC<AtomProviderProps>;
export declare function useAtomContext<T>(atom: Atom<T>): AtomState<T>;
export {};
