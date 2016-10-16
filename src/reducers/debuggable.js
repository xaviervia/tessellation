import {changes, log} from 'lib/debug'

export default (reducer) => (state, action) => {
  const newState = reducer(state, action)

  log('action')(action)
  log('state')(newState)
  changes('diff')(state, newState)

  return newState
}
