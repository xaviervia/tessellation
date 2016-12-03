import {lensPath} from 'ramda'

export const id = lensPath(['local', 'id'])

export const points = lensPath(['shared', 'points'])

export const size = lensPath(['local', 'size'])

export const point = (index) => lensPath(['shared', 'points', index])
