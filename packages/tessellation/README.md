# Library for Tessellation

```
npm install --save-dev tessellation
```

## createApp( initialState, [higherOrderReducer], [effect] )

```javascript
import React from 'react'
import {
  createApp,
  containAndRenderReactComponent
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
    }
  ],

  [
    containAndRenderReactComponent(
      function View ({push, value}) {
        return <div>
          <span>{value}</span>
          <button onClick={() => push({type: 'ADD'})}>
            Add
          </button>
        </div>
      },
      document.getElementById('root')
    ),

    () => (state) => console.log(state)
  ]
)
```
