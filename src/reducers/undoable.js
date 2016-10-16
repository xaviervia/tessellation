export default (actions) => (reducer) => (state, {type, payload}) => {
  const {undo, ...restOfState} = state // eslint-disable-line no-unused-vars

  switch (type) {
    case actions.APP_UNDO:
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
