export default effect => {
  let theNext = () => {}
  const listener = effect(theNext)

  return ({next, state}) => {
    theNext = next
    return listener(state)
  }
}
