import {createApp} from 'tessellation'

import {initialState, reducer} from 'store'

import localStorage from 'effects/localStorage'
import log from 'effects/log'
import resize from 'effects/resize'
import seed from 'effects/seed'
import setup from 'effects/setup'
import view from 'effects/view'

createApp(reducer, initialState, [localStorage, log, resize, seed, setup, view])
