import React, {Component} from 'react'
import {render} from 'react-dom'
import {view} from 'ramda'

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
          <button onClick={() => push({ type: APP_UNDO })}>
            ⎌
          </button>

          <button onClick={() => push({ type: POINTS_CLEANUP })}>
            ✕
          </button>

          {view(selectors.id, this.state.storeData)}
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
