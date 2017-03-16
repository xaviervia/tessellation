import {APP_RESIZE} from 'actions'

const initial = ({local: {size}}) => size.height === undefined

let teardown = () => {}
let prevState

export default next => state  => {
  if (state !== prevState) {
    teardown()
  }

  const listener = () => next({
    type: APP_RESIZE,
    payload: {
      height: window.innerHeight,
      width: window.innerWidth
    }
  })

  window.addEventListener('resize', listener)

  teardown = () => window.removeEventListener('resize', listener)
  prevState = state

  return initial(state) ? {
    type: APP_RESIZE,
    payload: {
      height: window.innerHeight,
      width: window.innerWidth
    }
  } : []
}
