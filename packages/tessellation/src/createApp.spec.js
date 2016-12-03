import {equal} from 'assert'
import createApp from './createApp'

describe('createApp', () => {
  it('sends push and the initial state to all the effects', () => {
    const stateList = []
    const pushList = []

    const effect1 = (push) => {
      pushList.push(push)
      return (state) => {
        stateList.push(state)
      }
    }

    const effect2 = (push) => {
      pushList.push(push)
      return (state) => {
        stateList.push(state)
      }
    }

    const reducer = (state, action) => state

    const initialState = {}

    createApp(reducer, initialState, [effect1, effect2])

    equal(stateList.length, 2)
    equal(stateList[0], initialState)
    equal(stateList[1], initialState)

    equal(pushList.length, 2)
    equal(pushList[0], pushList[1])
  })

  it('pushing calls all the effects with the new state', () => {
    const stateList = []
    let manualPush

    const effect1 = (push) => {
      manualPush = push

      return (state) => {
        stateList.push(state)
      }
    }

    const effect2 = (push) => (state) => {
      stateList.push(state)
    }

    const reducer = (state, action) => {
      return {
        value: state.value + action
      }
    }

    const initialState = {
      value: 'hello '
    }

    createApp(reducer, initialState, [effect1, effect2])

    manualPush('world')

    equal(stateList.length, 4)
    equal(stateList[2].value, 'hello world')
    equal(stateList[3].value, 'hello world')
  })
})
