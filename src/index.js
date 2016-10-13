import {on, stream, scan} from 'flyd'
import {mapObjIndexed} from 'ramda'
import {initialState, reducer} from 'store'
// import debuggable from 'decorators/debuggable'

import * as collateral from 'collateral'

const push = stream()

const store = scan(reducer, initialState, push)
// To debug actions and state, comment the previous line and uncomment:
// const store = scan(debuggable(reducer), initialState, push)
// Also import debuggable from 'decorators/debuggable'

const collateralWithPush = mapObjIndexed((f) => f(push), collateral)

let prevState

const update = (state) => {
  if (prevState !== state) {
    mapObjIndexed(
      (f) => f instanceof Function && f(state),
      collateralWithPush
    )
    prevState = state
  }
}

on(update, store)
