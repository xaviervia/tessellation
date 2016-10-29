import {on, stream, scan} from 'flyd'
import {initialState, reducer} from 'store'

import {compose, filter, map} from 'ramda'

import localStorage from 'effects/localStorage'
import log from 'effects/log'
import resize from 'effects/resize'
import seed from 'effects/seed'
import setup from 'effects/setup'
import view from 'effects/view'

const push = stream()

const store = scan(reducer, initialState, push)

const effects = [localStorage, log, resize, seed, setup, view]

const deduplicatedStore = stream()

let prevState
on((nextState) => {
  prevState !== nextState && deduplicatedStore(nextState)
  prevState = nextState
}, store)

const listeners = compose(
  filter((listener) => listener != null),
  map((effect) => effect(push)),
)(effects)

on(
  (state) => listeners.forEach((listener) => listener(state)),
  deduplicatedStore
)
