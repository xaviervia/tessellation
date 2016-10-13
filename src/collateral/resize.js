import {APP_RESIZE} from 'actions'

export default (push) => {
  push({
    type: APP_RESIZE,
    payload: {
      height: window.innerHeight,
      width: window.innerWidth
    }
  })

  window.addEventListener('resize', () => push({
    type: APP_RESIZE,
    payload: {
      height: window.innerHeight,
      width: window.innerWidth
    }
  }))
}
