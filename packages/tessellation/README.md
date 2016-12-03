# Library for Tessellation

```
npm install --save tessellation
```

## createApp( reducer, initialState, [effect] ): app

## renderEffect( ReactComponent, DomElement ): effect

```javascript
import React from 'react'
import {createApp, renderEffect} from 'tessellation'

const reducer = (state, action) => {
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

const initialState = {value: 0}

const effects = [
  renderEffect(
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

createApp(reducer, initialState, effects)
```
