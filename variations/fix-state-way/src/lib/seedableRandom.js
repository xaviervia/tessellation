import {reduce} from 'ramda'
const {floor, sin} = Math

export default (seed, counter) => {
  const x = sin(
    reduce((value, char) => value + char.charCodeAt(0), 0, seed.split('')) +
    counter
  ) * 10000
  return x - floor(x)
}
