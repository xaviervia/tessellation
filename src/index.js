import {on, stream, scan} from 'flyd'
import {mapObjIndexed} from 'ramda'
import {initialState, reducer} from 'store'

import * as collateral from 'collateral'

const push = stream()

const store = scan(reducer, initialState, push)

const collateralWithPush = mapObjIndexed((f) => f(push), collateral)

const update = (state) =>
  mapObjIndexed(
    (f) => f instanceof Function && f(state),
    collateralWithPush
  )

on(update, store)
