import {diff} from 'jiff'

export const log = (s) => (x) => (console.log(s, x), true) && x

export const changes = (s) => (x1, x2) => log(s)(diff(x1, x2))
