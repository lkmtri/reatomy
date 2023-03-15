import { Atom } from './atom'
import { useAtom } from './hooks'

interface AtomConsumerProps<AtomValue = any> {
  atom: Atom<AtomValue>
  children: (value: AtomValue) => React.ReactNode
}

export function AtomConsumer<AtomValue = any>(
  props: AtomConsumerProps<AtomValue>,
) {
  const [atom] = useAtom(props.atom)
  return props.children(atom)
}
