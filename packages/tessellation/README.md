# Library for Tessellation

```
npm install --save tessellation
```

## createApp( initialState, [higherOrderReducer], [effect] ): app

## action( actionType, reducer ): higherOrderReducer

## renderReactComponent( ReactComponent, domElement ): effect

```javascript
import React from 'react'
import {
  action,
  createApp,
  renderReactComponent
} from 'tessellation'

createApp(
  {value: 0},
  [
    (reducer) => (state, action) => {
      switch (action.type) {
        case 'ADD':
          return {
            ...state,
            value: state.value + 1
          }

        default:
          return reducer(state, action)
      }
    },

    action('REMOVE', (state, action) => ({
      value: state.value - 1
    }))
  ],

  [
    renderReactComponent(
      function View ({push, value}) {
        return <div>
          <span>{value}</span>
          <button onClick={() => push({type: 'ADD'})}>
            Add
          </button>
          <button onClick={() => push({type: 'REMOVE'})}>
            Remove
          </button>
        </div>
      },
      document.getElementById('root')
    ),

    () => (state) => console.log(state)
  ]
)
```
