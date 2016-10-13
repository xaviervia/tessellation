import React, {Component} from 'react'
import {render} from 'react-dom'
import {view} from 'ramda'

import Button from 'components/Button'

import * as selectors from 'selectors'
import {APP_UNDO, POINTS_ADD, POINTS_CLEANUP} from 'actions'

export default (push) => {
  let onState

  class Container extends Component {
    componentDidMount () {
      onState = (state) => this.setState({
        storeData: state
      })
    }

    render () {
      return this.state && <main>
        <header>
          <Button
            onClick={() => push({ type: APP_UNDO })}
            title='undo'>
            ⎌
          </Button>

          <Button
            onClick={() => push({ type: POINTS_CLEANUP })}
            title='reseed'>
            ✕
          </Button>

          <span className='id'>{view(selectors.id, this.state.storeData)}</span>
        </header>

        <svg
          height='100vh'
          onClick={(e) => push({
            type: POINTS_ADD,
            payload: [e.clientX, e.clientY]
          })}
          width='100vw'
        />
      </main>
    }
  }

  render(<Container />, document.getElementById('tesselation'))

  return onState
}
