import React, {Component} from 'react'
import {render} from 'react-dom'
import * as selectors from 'selectors'
import {view} from 'ramda'

export default (push) => {
  let onState

  class Container extends Component {
    componentDidMount () {
      onState = (state) => this.setState({
        storeData: state
      })
    }

    render () {
      return this.state && <div>
        {view(selectors.id, this.state.storeData)}
      </div>
    }
  }

  render(<Container />, document.getElementById('tesselation'))

  return onState
}
