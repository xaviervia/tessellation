import {on, stream, scan} from 'flyd'
import {compose, map} from 'ramda'
import {initialState, reducer} from 'store'

import localStorage from 'effects/localStorage'
import log from 'effects/log'
import resize from 'effects/resize'
import seed from 'effects/seed'
import setup from 'effects/setup'
import view from 'effects/view'

const push = stream()

const store = scan(reducer, initialState, push)

const effects = [localStorage, log, resize, seed, setup, view]

const forwarder = (prevState) => (effects) => (nextState) => {
  if (prevState !== nextState) {
    map((f) => f && f(nextState), effects)
  }

  return forwarder(nextState)(effects)
}

const update = compose(
  forwarder(),
  map((f) => f(push)),
)(effects)

on(update, store)
