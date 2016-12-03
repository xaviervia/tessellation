# Library for Tessellation

Tessellation is a Redux-inspired architecture for applications, front-end or otherwise. It is one of the simplest ways to get started with React. Like Redux, it makes a clear separation between the state management in the store and the components, making it possible for your components to be stateless functions; but it doesn’t require a `connect`, so it’s easier for beginners and it makes bootstrapping a new app very straightforward.

This library provides a simple wrapper for a Redux-like store that incorporates support for [Tessellation’s Effect Wiring API](https://github.com/xaviervia/tessellation#effect-wiring-api). Please refer to the [complete thesis](https://github.com/xaviervia/tessellation) for more details on the why and how of this architecture.

## Installation

```
npm install --save tessellation
```

## Usage

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
      </div>
    },
    document.getElementById('root')
  ),

  () => (state) => console.log(state)
]

createApp(reducer, initialState, effects)
```

## API

The library contains two functions:

- `createApp` is the analog to Redux’s `createStore`. It also takes a reducer as the first argument and an initial state as the second. The difference is that the third argument is the list of effects.
- `renderEffect` is the "connect" of Tessellation, similar to the React Redux `connect`. There are several important differences though:
  1. There is no `<Provider>` component. This means that only one component can be connected, and it has to be done at the root of the component tree.
  2. `renderEffect` renders directly to the DOM as well. In order to render to other targets (such as React Native) it would be necessary to implement other helpers.

### Type annotation

In pseudo-flowtype notation (`Action` is a [Flux Standard Action](https://github.com/acdlite/flux-standard-action)):

```typescript
type Effect = <State>(Action) => (State): void

createApp = <State>(reducer: (State, Action) => State, initialState: State, effects: Array<Effect>): void

renderEffect( component: ReactComponent, target: DomElement ): Effect
```

## License

[The Unlicense](../../LICENSE)
