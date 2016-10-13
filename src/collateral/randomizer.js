import {map, range} from 'ramda'
import {APP_SEED} from 'actions'

const {floor, random} = Math

// Load last to avoid re rendering if there was state from localStorage
export default (push) => (state) => state.shared.points.length === 0 &&
  push({
    type: APP_SEED,
    payload: map(
      () => [floor(random() * 100), floor(random() * 100)],
      range(0, 10)
    )
  })
