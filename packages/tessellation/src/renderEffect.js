import React, {Component} from 'react'
import {render} from 'react-dom'

export default (Target, targetElement) => (push) => {
  let onState

  class Container extends Component {
    componentDidMount () {
      onState = (state) => this.setState({
        storeData: state
      })
    }

    render () {
      if (this.state == null) {
        return false
      }

      const {storeData} = this.state
      return <Target {...storeData} push={push} />
    }
  }

  render(<Container />, targetElement)

  return onState
}
