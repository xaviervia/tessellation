import {on, stream, scan} from 'flyd'
import {mapObjIndexed} from 'ramda'
import {initialState, reducer} from 'store'
// import debuggable from 'reducers/debuggable'

import * as effects from 'effects'

const push = stream()

const store = scan(reducer, initialState, push)
// To debug actions and state, comment the previous line and uncomment:
// const store = scan(debuggable(reducer), initialState, push)
// Also import debuggable from 'decorators/debuggable'

const forwarder = (prevState) => (effects) => (nextState) => {
  if (prevState !== nextState) {
    map((f) => f && f(nextState), effects)
  }

  return forwarder(nextState)(effects)
}

const update = compose(
  forwarder(),
  map((f) => f(push),
  values
)(effects)

on(update, store)

// const effectsWithPush = mapObjIndexed((f) => f(push), effects)
//
// let prevState
//
//
// const update = (state) => {
//   if (prevState !== state) {
//     mapObjIndexed(
//       (f) => f instanceof Function && f(state),
//       effectsWithPush
//     )
//     prevState = state
//   }
// }
//
// on(update, store)
