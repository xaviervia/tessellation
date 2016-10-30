export default (actionType, handler) => (next) => (state, action) =>
  action.type === actionType
    ? handler(state, action)
    : next(state, action)
