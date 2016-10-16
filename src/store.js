import {contains, set} from 'ramda'

import undoable from 'decorators/undoable'

import * as actions from 'actions'
import * as lenses from 'lenses'
import * as selectors from 'selectors'

import normalize from 'lib/normalize'

export const initialState = {
  local: {
    id: undefined,
    size: {
      height: 0,
      width: 0
    }
  },

  shared: {
    points: []
  }
}

export const reducer = undoable(actions.APP_UNDO)((state, {type, payload}) => {
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

    case actions.POINTS_ADD:
      // The action comes with the size adjusted to the canvas size,
      // it has to be normalized to fit in a 100 x 100 grid
      const normalized = [
        normalize(100)(state.local.size.width, payload[0]),
        normalize(100)(state.local.size.height, payload[1])
      ]

      return contains(normalized, selectors.points(state))
        ? state
        : set(
          lenses.points,
          [
            ...selectors.points(state).slice(1),
            normalized
          ],
          state
        )

    case actions.POINTS_CLEANUP:
      return set(
        lenses.points,
        [],
        state
      )

    default:
      return state
  }
})
