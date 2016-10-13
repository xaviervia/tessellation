export default (actionType) => (reducer) => (state, {type, payload}) => {
  const {undo, ...restOfState} = state // eslint-disable-line no-unused-vars

  switch (type) {
    case actionType:
      return state.undo

    default:
      const newState = reducer(state, {type, payload})

      return newState !== state
        ? {
          ...newState,
          undo: restOfState
        }
        : newState
  }
}
