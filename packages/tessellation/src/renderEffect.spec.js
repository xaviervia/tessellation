import React from 'react'
import {equal, deepEqual} from 'assert'
import renderEffect from './renderEffect'

describe('renderEffect', () => {
  it('passes `push` correctly to the component', () => {
    let receivedPush
    const targetNode = document.createElement('div')
    const push = () => {}
    const state = {}

    function Example ({push}) {
      receivedPush = push
      return <div />
    }

    renderEffect(Example, targetNode)(push)(state)

    equal(receivedPush, push)
  })

  it('passes state data correctly to the component', () => {
    let receivedState
    const targetNode = document.createElement('div')
    const push = () => {}
    const state = {
      complex: {
        nested: [
          'structure'
        ]
      }
    }

    function Example ({push, ...state}) {
      receivedState = state
      return <div />
    }

    renderEffect(Example, targetNode)(push)(state)

    deepEqual(receivedState, state)
  })

  it('updates the component when there is new state', () => {
    const targetNode = document.createElement('div')
    const push = () => {}

    function Example ({push, text}) {
      return <div>{text}</div>
    }

    const renderListener = renderEffect(Example, targetNode)(push)

    renderListener({ text: 'Hello' })

    equal(targetNode.children[0].textContent, 'Hello')

    renderListener({ text: '今日は' })

    equal(targetNode.children[0].textContent, '今日は')
  })
})
