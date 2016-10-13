import leftPad from 'left-pad'
import {point} from 'selectors'
import {compose, join, map, view} from 'ramda'

const p = (index) => compose(
  join(','),
  map((value) => leftPad(value, 2, 0)),
  view(point(index))
)

// Intentionally manual
export default () => (state) => view(point(0), state) &&
  console.log(
`
  ⎢ ${p(0)(state)} ${p(1)(state)} ${p(2)(state)} ⎢
  ⎢ ${p(2)(state)} ${p(4)(state)} ${p(5)(state)} ⎢
  ⎢ ${p(6)(state)} ${p(7)(state)} ${p(7)(state)} ⎢

`
)
