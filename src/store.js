import {compose, identity} from 'ramda'

import app from 'reducers/app'
import points from 'reducers/points'
import undoable from 'reducers/undoable'

import * as actions from 'actions'

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

export const reducer = compose(
  undoable(actions),
  app(actions),
  points(actions)
)(identity)
