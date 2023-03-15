/// <reference types="react" />
import { Atom } from './atom';
interface AtomConsumerProps<AtomValue = any> {
    atom: Atom<AtomValue>;
    children: (value: AtomValue) => React.ReactNode;
}
export declare function AtomConsumer<AtomValue = any>(props: AtomConsumerProps<AtomValue>): import("react").ReactNode;
export {};
