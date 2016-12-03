import {createStore} from 'redux'
import {initialState, reducer} from 'store'

import {compose, filter, map} from 'ramda'

import localStorage from 'effects/localStorage'
import log from 'effects/log'
import resize from 'effects/resize'
import seed from 'effects/seed'
import setup from 'effects/setup'
import view from 'effects/view'

const store = createStore(reducer, initialState)

const push = store.dispatch

const effects = [localStorage, log, resize, seed, setup, view]

const listeners = compose(
  filter((listener) => listener != null),
  map((effect) => effect(push)),
)(effects)

let prevState
store.subscribe(
  () => {
    if (prevState !== store.getState()) {
      listeners.forEach((listener) => listener(store.getState()))
      prevState = store.getState()
    }
  }
)

listeners.forEach((listener) => listener(store.getState()))
