import {map, range, set} from 'ramda'

import * as lenses from 'lenses'
import seedableRandom from 'lib/seedableRandom'

const {floor} = Math

export default (actions) => (reducer) => (state, {type, payload}) => {
  switch (type) {
    case actions.APP_RESIZE:
      return set(
        lenses.size,
        payload,
        state
      )

    case actions.APP_SEED:
      return {
        ...state,
        shared: {
          ...state.shared,
          // `18` is the amount of numbers that we will use,
          // two numbers for each dot.
          counter: (state.shared.counter || 0) + 18,
          points: map(
            (index) => [
              floor(
                seedableRandom(
                  state.shared.seed,
                  state.shared.counter + (index * 2)
                ) * 100
              ),
              floor(
                seedableRandom(
                  state.shared.seed,
                  state.shared.counter + (index * 2) + 1
                ) * 100
              )
            ],
            range(0, 9)
          )
        }
      }

    case actions.APP_SETUP:
      return {
        ...state,
        local: {
          ...state.local,
          id: payload.id
        },
        shared: state.shared.seed
          ? state.shared
          : {
            ...state.shared,
            seed: payload.id,
            counter: 0
          }
      }

    case actions.APP_SYNC:
      return {
        ...state,
        shared: payload
      }

    default:
      return reducer(state, {type, payload})
  }
}
