import React, {Component} from 'react'
import {render} from 'react-dom'
import {map} from 'ramda'
import {voronoi} from 'd3-voronoi'

import Button from 'components/Button'

import * as selectors from 'selectors'
import {APP_UNDO, POINTS_ADD, APP_SEED} from 'actions'

import normalize from 'lib/normalize'

export default (push) => {
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
      const dots = map(
        ([x, y]) => [
          normalize(storeData.local.size.width + 20)(100, x),
          normalize(storeData.local.size.height + 20)(100, y)
        ],
        selectors.points(storeData)
      )

      const scale = 1
      const diagram = voronoi().extent([[0, 0], [storeData.local.size.width, storeData.local.size.height]])(dots)
      const polygons = diagram.polygons()

      return <main>
        <header>
          <Button
            onClick={() => push({ type: APP_UNDO })}
            title='undo'>
            ⎌
          </Button>

          <Button
            onClick={() => push({ type: APP_SEED })}
            title='reseed'>
            ✕
          </Button>

          <span className='id'>{selectors.id(storeData)}</span>
        </header>

        <svg
          height='100vh'
          onClick={(e) => push({
            type: POINTS_ADD,
            payload: [e.clientX, e.clientY]
          })}
          viewBox={`5 5 ${storeData.local.size.width - 20} ${storeData.local.size.height - 20}`}
          width='100vw'>
          <g className='polygons'>
            {polygons.map((polygon, index) => <polygon
              key={index}
              points={polygon.map((corner) => corner.map((x) => x * scale).join(',')).join(' ')}
            />)}
          </g>

          <g className='circles'>
            {dots.map(([x, y], index) =>
              <circle key={index} cx={x * scale} cy={y * scale} r='2' />
            )}
          </g>
        </svg>
      </main>
    }
  }

  render(<Container />, document.getElementById('tessellation'))

  return onState
}
