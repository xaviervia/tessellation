import React from 'react'
import {renderEffect} from 'tessellation'
import {map} from 'ramda'
import {voronoi} from 'd3-voronoi'

import Button from 'components/Button'

import * as selectors from 'selectors'
import {APP_UNDO, POINTS_ADD, POINTS_CLEANUP} from 'actions'

import normalize from 'lib/normalize'

function View ({push, ...state}) {
  const dots = map(
    ([x, y]) => [
      normalize(state.local.size.width + 20)(100, x),
      normalize(state.local.size.height + 20)(100, y)
    ],
    selectors.points(state)
  )

  const scale = 1
  const diagram = voronoi().extent(
    [[0, 0], [state.local.size.width, state.local.size.height]]
  )(dots)
  const polygons = diagram.polygons()

  return <main>
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

      <span className='id'>{selectors.id(state)}</span>
    </header>

    <svg
      height='100vh'
      onClick={(e) => push({
        type: POINTS_ADD,
        payload: [e.clientX, e.clientY]
      })}
      viewBox={`5 5 ${state.local.size.width - 20} ${state.local.size.height - 20}`}
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

export default renderEffect(
  View,
  document.getElementById('tessellation')
)
