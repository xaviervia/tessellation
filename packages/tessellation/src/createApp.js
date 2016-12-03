export default (reducer, initialState, effects) => {
  let state = initialState
  let listeners = []

  const broadcast = (state) => {
    listeners.forEach((listener) => listener(state))
  }

  const push = (action) => {
    state = reducer(state, action)
    broadcast(state)
  }

  listeners = effects
    .map((effect) => effect(push))
    .filter((listener) => listener != null)

  broadcast(state)
}
