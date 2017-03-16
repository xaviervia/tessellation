import uuid from 'uuid'

import {
  map,
  range,
} from 'ramda'

import {
  APP_SEED,
  APP_SETUP,
  APP_SYNC,
} from 'actions'

const {floor, random} = Math

const randomize = () => ({
  type: APP_SEED,
  payload: map(
    () => [floor(random() * 100), floor(random() * 100)],
    range(0, 9)
  )
})

const on_storage = (next) => {
  return ({key, newValue}) => key === 'tessellation' &&
    next({
      type: APP_SYNC,
      payload: JSON.parse(newValue)
    })
}

const from_storage = (key) => JSON.parse(window.localStorage.getItem(key))
const to_storage = (key, val) => window.localStorage.setItem(key, JSON.stringify(val))

const restore = () => {
  const local_storage = from_storage('tessellation')

  return local_storage
    ? {
      type: APP_SYNC,
      payload: from_storage('tessellation')
    }
    : randomize()
}

const setup = () => ({
  type: APP_SETUP,
  payload: {
    id: uuid.v4()
  }
})

export default next => state => {
  if (state.local.id == undefined) {
    // window.addEventListener('storage', on_storage(next))

    return [setup()] // , restore()]
  } else {
    // to_storage('tessellation', state.shared)
    return state.shared.points.length === 0 ? randomize() : []
  }
}
