import { Arrow } from 'zazen'
import { effect } from 'tessellation'

import {initialState, reducer} from 'store'

import {
  apply,
  compose,
  filter,
  map,
  flatten
} from 'ramda'

import { APP_START } from 'actions'

import log from 'effects/log'
import resize from 'effects/resize'
import seed from 'effects/seed'
import view from 'effects/view'

import debuggable from 'reducers/debuggable'

const store = Arrow( app => ({
  ...app,
  state: app.actions.reduce(app.reducer, app.state)
}))

const next = previous_app => (...actions) => {
  return actions.length > 0 ?
    app({...previous_app, actions}) :
    previous_app
}

const app = store
  .pipe( app => ({
    ...app,
    next: next(app)
  }) )
  .pipe( ({state, next, effects}) => {
    return compose(
      apply(next),
      flatten,
      map( e => e({state, next}) )
    )(effects)
  })

app(app(app({
  state: initialState,
  actions: [],
  reducer: debuggable(reducer),
  effects: [
    effect(seed),
    effect(log),
    effect(resize),
    view,
  ]
})))
