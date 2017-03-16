import {compose, identity} from 'ramda'

import app from 'reducers/app'
import points from 'reducers/points'
import undoable from 'reducers/undoable'

import * as actions from 'actions'

export const initialState = {
  initial: true,

  local: {
    id: undefined,
    size: {
      height: undefined,
      width: undefined
    }
  },

  shared: {
    points: []
  }
}

export const reducer = compose(
  undoable(actions),
  app(actions),
  points(actions)
)(identity)
