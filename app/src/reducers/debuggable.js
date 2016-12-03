import {diff} from 'jiff'

export default (reducer) => (prevState, action) => {
  const nextState = reducer(prevState, action)

  console.log('action', action)
  console.log('state', nextState)
  console.log('diff', diff(prevState, nextState))

  return nextState
}
