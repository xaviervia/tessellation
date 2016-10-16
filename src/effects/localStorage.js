import {APP_SYNC} from 'actions'

export default (push) => {
  if (window.localStorage.getItem('tesselation')) {
    push({
      type: APP_SYNC,
      payload: JSON.parse(window.localStorage.getItem('tesselation'))
    })
  }

  window.addEventListener('storage', ({key, newValue}) => push({
    type: APP_SYNC,
    payload: JSON.parse(newValue)
  }))

  return (state) => window.localStorage.setItem(
    'tesselation',
    JSON.stringify(state.shared)
  )
}
