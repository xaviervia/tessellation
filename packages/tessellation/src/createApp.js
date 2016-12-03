import {on, stream, scan} from 'flyd'
import {compose, filter, map} from 'ramda'

export default (reducer, initialState, effects) => {
  const push = stream()

  const listeners = compose(
    filter((listener) => listener != null),
    map((effect) => effect(push)),
  )(effects)

  const store = scan(reducer, initialState, push)

  let prevState
  on(
    (nextState) => {
      if (prevState !== nextState) {
        listeners.forEach((listener) => listener(nextState))
      }
    },
    store
  )
}
