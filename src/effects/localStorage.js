import {APP_SYNC} from 'actions'

export default (push) => {
  if (window.localStorage.getItem('tessellation')) {
    push({
      type: APP_SYNC,
      payload: JSON.parse(window.localStorage.getItem('tessellation'))
    })
  }

  window.addEventListener('storage', ({key, newValue}) => push({
    type: APP_SYNC,
    payload: JSON.parse(newValue)
  }))

  return (state) => window.localStorage.setItem(
    'tessellation',
    JSON.stringify(state.shared)
  )
}
