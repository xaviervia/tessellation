import * as actions from 'actions'
import * as selectors from 'selectors'
import {set, view} from 'ramda'

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

const withUndo = (reducer) => (state, {type, payload}) => {
  switch (type) {
    case actions.APP_UNDO:
      return state.history[history.length - 1]

    default:
      const {history, ...restOfState} = state

      return reducer({
        ...restOfState,
        history: [...(history || []), restOfState]
      }, {type, payload})
  }
}

export const reducer = withUndo((state, {type, payload}) => {
  switch (type) {
    case actions.APP_RESIZE:
      return set(
        selectors.size,
        payload,
        state
      )

    case actions.APP_SEED:
      return set(
        selectors.points,
        payload,
        state
      )

    case actions.APP_SETUP:
      return set(
        selectors.id,
        payload.id,
        state
      )

    case actions.APP_SYNC:
      return {
        ...state,
        shared: payload
      }

    case actions.POINTS_ADD:
      return set(
        selectors.points,
        [...view(selectors.points, state), payload],
        state
      )
  }
})
