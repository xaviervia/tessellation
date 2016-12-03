import {map, range} from 'ramda'

const {floor, random} = Math

export default () => map(
  () => [floor(random() * 100), floor(random() * 100)],
  range(0, 9)
)
