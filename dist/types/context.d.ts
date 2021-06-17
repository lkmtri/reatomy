import React from 'react';
import type { Atom, AtomState } from './atom';
export declare type InitialAtomState<T = unknown> = readonly [Atom<T>, T];
export interface AtomProviderProps {
    initialState?: InitialAtomState<any>[];
}
export declare const AtomProvider: React.FC<AtomProviderProps>;
export declare function useAtomContext<T>(atom: Atom<T>): AtomState<T>;
