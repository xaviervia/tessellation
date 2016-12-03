import {contains, set} from 'ramda'

import * as lenses from 'lenses'
import * as selectors from 'selectors'

import normalize from 'lib/normalize'

export default (actions) => (reducer) => (state, {type, payload}) => {
  switch (type) {
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
      return reducer(state, {type, payload})
  }
}
