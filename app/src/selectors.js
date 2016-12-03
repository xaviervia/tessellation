import {view} from 'ramda'
import * as lenses from 'lenses'

export const id = view(lenses.id)

export const points = view(lenses.points)

export const point = (index) => view(lenses.point(index))
