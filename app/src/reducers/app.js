import {set} from 'ramda'

import * as lenses from 'lenses'

export default (actions) => (reducer) => (state, {type, payload}) => {
  switch (type) {
    case actions.APP_RESIZE:
      return set(
        lenses.size,
        payload,
        state
      )

    case actions.APP_SEED:
      return set(
        lenses.points,
        payload,
        state
      )

    case actions.APP_SETUP:
      return set(
        lenses.id,
        payload.id,
        state
      )

    case actions.APP_SYNC:
      return {
        ...state,
        shared: payload
      }

    default:
      return reducer(state, {type, payload})
  }
}
