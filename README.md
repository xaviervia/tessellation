# Tesselation (thesis)

> See the live application in [https://xaviervia.github.io/tesselation/](https://xaviervia.github.io/tesselation/)

![tesselation screenshot](images/tesselation-app.png)

> This app was tested and intended for a recent version of Chrome. It might not work somewhere else.

This project is a thesis on how to build front end applications.

**Tesselation** is a simple but not trivial application that keeps a set of points in the state and renders them as a [Voronoi tesselation](https://en.wikipedia.org/wiki/Voronoi_diagram) with a little help from [d3](https://d3js.org/) and [React](https://facebook.github.io/react/).

## Features

- Automatic saving locally in the browser.
- Automatic synchronization across browser tabs/windows.
- Logging updates to the console.
- Rendering a SVG diagram and doing mouse interactions with it.
- Seeding with random data.

The point is to explore a simple way of dealing with distinct types of side effects. These side effects are real requirements of many front end applications.

They also cover the full spectrum of [effect directionalities](#effect-directionality), so in theory any side effect could be implemented with the same APIs. More on that later.

## Principles

- The [core application logic](#core-application-logic) is purely functional: that is, it's done entirely with pure functions, and it's implemented using functional programming patterns.
- The core application logic [is composable](#composing-the-state-management-logic-from-smaller-pieces).
- [Side effects](#effects) are wired to the state using a reactive programming approach.
- All side effects are treated in the same way.
- Use few libraries and use them as little as possible.

### A note on the status of this thesis

Before going on, a disclaimer: please don't take this project too seriously or assume that I'm completely sold on the ideas that I put together here. This is an experiment, and while I'm rather happy with the results, there are no simple answers in programming. It will also likely evolve, and if that's the case I'll continue publishing the new versions as I refine the ideas that make up the architecture.

## Libraries

There are several libraries used throughout this project. The architecture, however, is built so that none of these is indispensable to the underlying thesis, so don't get too fixated on the choice of libraries. It's extremely likely that the libraries will vary from context to context, while hopefully the underlying approach will not.

### [ramda](ramdajs.com)

Ramda is the Swiss army knife of the functional programming community in JavaScript. It supports a close analog of the [Prelude](https://hackage.haskell.org/package/base-4.9.0.0/docs/Prelude.html) standard library of [Haskell](https://www.haskell.org/), and takes type signatures, performance, consistency and the functional principles very seriously. It provides a good foundation of functions that is lacking the JavaScript standard library, and as such is extremely useful for building applications using functional programming principles.

That said, a lot of the functions from Ramda can be found in plain modern ES when using something as the [Babel polyfills](https://babeljs.io/docs/usage/polyfill/), or plain old [lodash](https://lodash.com/), or [1-liners](https://github.com/1-liners/1-liners), etc.

### [flyd](https://github.com/paldepind/flyd)

Flyd is the most minimalistic and elegant reactive programming library that I could find. It provides an extremely easy way of creating streams a no-nonsense way of dealing with them. It follows the [fantasy-land](https://github.com/fantasyland/fantasy-land) specification, which means flyd streams interoperate fantastically with Ramda (although I'm not making use of that at all in this project).

There are many alternatives to flyd out there. For the scope of this thesis, maybe the most prominent is [Redux](redux.js.org) itself, but if you are looking for a more complete reactive programming toolkit you can take a look at [most](https://github.com/cujojs/most) or [Rx](https://github.com/Reactive-Extensions/RxJS).

### [react](https://facebook.github.io/react/)

I'm assuming React needs no introduction. The point here is that _not even React_ is necessary for this architecture to work. Of course, as long as the side effects are treated as a function that is called each time a new state is generated, a reactive UI library is ideal for the wiring to be simple to do. But React is not alone there: you can also try out [Preact](https://github.com/developit/preact), or [Act](https://github.com/act-framework/act) or [virtual-dom](https://github.com/Matt-Esch/virtual-dom) directly.

## Let's get started

First, open the live app in [https://xaviervia.github.io/tesselation/](https://xaviervia.github.io/tesselation/).

You are watching a very simple example of a [Voronoi tesselation](https://en.wikipedia.org/wiki/Voronoi_diagram), a kind of cell diagram automatically generated from points spread across a plane. There are 9 points in total.

If this is the first time you open the application, the distribution of dots that you see is random, and was generated by the [Seed](#seed) effect.

Let's play around:

1. Reload the application: the distribution of dots didn't change! This is because each time the state is updated, the new distribution of dots is saved by the [LocalStorage effect](#localStorage) into, well, `localStorage`. When you reload, the same LocalStorage effects recovers the points from there.

2. Resize the window: you will see that the tesselation changes it's proportions to fit the new window size. The way this works is that the [Resize](#resize) effect notifies each time the window got resized, and the positions of the dots and lines are recalculated using the new size to skew the 100x100 grid.

3. Click around: one dot will be removed, then another point will be aded in roughly the position where you clicked. It will be placed roughly where the mouse was because positions are normalized from whatever size your window is to a 100x100 grid, so the applications grid doesn't match the pixels that you see. This action is sent from the [View effect](#view) – which is a React component.

4. Open the console and click around in the app: you will see that each new distribution of dots is logged to the console (the [Log effect](#log) is responsible for this). Try clicking several times in the same place without moving the mouse: you will see that the distribution of dots is printed only once. The state management part of the application is taking care of not sending the same state twice to the effects. We will see this later in more detail.

5. Now that you clicked around a couple of times, click the `⎌` (undo) button: you will see that the point distribution goes back to the previous one. How this is achieved is an interesting part of the state manipulation and [state logic composition](#state-logic-composition) exploration.

6. Click the `✕` (reseed) button: a new random distribution of dots will appear.

7. Finally, open another browser window, go to [https://xaviervia.github.io/tesselation/](https://xaviervia.github.io/tesselation/), put it side by side with the current one, and click around in one and the other: you would see that both update at the same time, completely synchronized. This is also done by the [LocalStorage effect](#localstorage)

> There is a bug caused by a race condition that you can trigger having the windows side by side. We will discuss it later, but see if you can find it if you want.

## Project structure

The file structure of the application is significant for the architecture: not because of a convention of how to name the file, Ruby on Rails style, but because hopefully the file and folder names themselves give already a good grasp of how the architecture works. One of my goals in general when maintaining a codebase is trying to achieve a file structure that:

1. Follows naturally from the architecture.
2. It's concise.
3. Says something to the new developer about where and what things are.

## Core application logic

The application logic is contained in the `src` folder and the `src/reducers` folder. In the `src` folder, for the application logic you can find:

- `actions.js` contains the constant declarations for the action types. I'm using `Symbol`s because I wanted to try them out as action types, inspired in [Keith Cirkel's Metaprogramming in ES6: Symbol's and why they're awesome](https://www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/). And it turned out great, but of course I've only tried it in Chrome, so it might not fly for a real application.

  If they are though, Symbols are a great way of setting up these kind of "unique value" identifiers: since they are impossible to reproduce without a direct reference to the Symbol itself, the integrity of the action name is guaranteed, and there is no possibility of naming collisions. (it might still be confusing when debugging though).

- `index.html` is the HTML entry point. [Sagui](https://github.com/saguijs/sagui) will configure webpack to load it with the corresponding `index.js`

- `index.js` is the JavaScript entry point. It's the only place where the effects meet the store, and the place where the application wiring is done. Note that, unlike many React applications, the `index.js` is _not in charge or rendering_: this is because rendering the view is considered just another of the effects, and not a core part of the application (core !== important, core just means where the logic resides).

- `lenses.js` is the only file that is, to some extent, a **Ramda** artifact. Ramda provides this really cool functionality for selecting values in nested object structures that is done via [`lensPath`](http://ramdajs.com/docs/#lensPath) functions, which combined with [`view`](http://ramdajs.com/docs/#view) and [`set`](http://ramdajs.com/docs/#set) make for great ways of querying and immutably setting values in a complex state object. I still haven't decided what to do with this file.

- `selectors.js` contains the functions that make it easy to query the state blob.

- `store.js` contains the initial state blob and the reducer, which is in turn built from all the high order reducers in `reducers/`.

- `reducers/` contains files with each of the high order reducers.

It's important to notice that, with the exception of `index.js` that has the streams, _all of the above mentioned as pure functions_. There is nothing weird going on in them, and any complexity is derived mostly from the complexity of the application functionality itself. I consider this one of the biggest achievements of this proposed architecture.

> Note: the `reducers/debuggable.js` high order reducer is also not pure, but the intent of that reducer is just to introspect the state while in development, so it doesn't really count.

The whole application state is contained in a single object blob, Redux-style. Actually, the whole architecture is heavily inspired by Redux, but with two core differences:

- To prove that the "single object" state approach goes beyond libraries and it's easily reproducible with any reactive programming library, it's not using Redux.
- It is highly decoupled from the UI: Redux was originally meant to represent the data necessary to drive the UI, and the patterns that emerged around it reflect that intent. The thesis here is that the way Redux drives state can be used to manage any type of side effect, and for that purpose I introduced a generalized wiring interface that, the thesis goes, can be used for _any_ side effect.

To emphasize the fact that the architecture is meant to be a generalization of Redux and not another Flux implementation (?), the nomenclature is slightly different:
- `dispatch` is called `push` to represent the fact that the actual operation of dispatching an action is analogous to pushing into an array structure. As a matter of fact, it's pushing data into a stream that get's reduced on each addition – or `scan`ned in `flyd` lingo.
- There is no `getState`. State is always pushed to the effects as an object each time the application state is updated.

### Composing the state management logic from smaller pieces

Redux reducer composition is some times done with the [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) utility, that segments the state into several disconnected namespaces that the reducers target separately. In the past I had real problems with this approach though: long story short, keeping reducers from affecting each other lead to manufacture artificial actions to be able to communicate between them (TODO: expand). The documentation itself warns about `combineReducers` [being just a convenience](http://redux.js.org/docs/api/combineReducers.html#tips) though, so I tried exploring alternative ways of working with several reducers.

TODO: Hmm no -> I consider that a lesson learned. In general reducer combination has been a hairy issue, mainly because affecting a single global state with several functions raises possibilities of collisions.

#### High order reducers

In this project I wanted to explore a pattern for composition of reducers that I first saw presented in React Europe for [undoing](https://github.com/omnidan/redux-undo): high order reducers. In a nutshell, that means that instead of implementing your most basic reducer as:

```javascript
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return state + 1

    default:
      return state
  }
}
```

...you add take another reducer as the first argument and pass it through when you are not interested in the current action:

```diff
- const reducer = (state, action) => {
+ const highOrderReducer = (reducer) => (state, action) => {
  switch (action.type) {
    case 'ADD':
      return state + 1

    default:
-      return state
+      return reducer(state, action)
  }
}
```

The advantages are plenty, but the main hidden one I discovered is that this means is very natural to now make your reducers parametrizable, which means they can be _reusable_. In a silly example, let's say that you want to have the above shown _addition_ reducer, but the specific name of the property to be updated and the name of the action are meant to be application dependent. Then you could write your highOrderReducer reducer as:

```javascript
const additionHighOrderReducer = (property, actionType) => (reducer) => (state, action) => {
  switch (action.type) {
    case actionType:
      return {
        ...state,
        [property]: state[property] + 1
      }

    default:
      return reducer(state, action)
  }
}
```

The other obvious advantage is that allows a reducer to intercept the state as other reducer processed it and manipulate it in some way or the other, or decide to intercept the propagation of an action by passing forward an empty action type, etc.

#### High order reducer composition

In this application this is effectively being used to achieve the _undo_ functionality. The last piece then is, how to put all the reducers back together?

Well, simple enough (you can see this in the live code in `src/index.js`):

TODO: Actually do in the app!
```javascript
const reducer = compose(
  additionHighOrderReducer('counter', 'ADD'),

)
```

## Effects

TODO: The state is a stream

Here comes another semantic part of the thesis: I'm renaming _side effects_ as _effects_ since, as many pointed out, an application without side effects is just a way of transforming electricity into heat. _Effects_ is a correct name: the purpose of the application are in fact it's effects, while side effects refer to the _unintended_ effects of performing a purely functional operation. In informal contexts I will use _effect_ and _side effect_ interchangeably, but when the specific functionalities of the application will referred solely as _effects_ (?).

TODO: surface area of the application with the outside world: interactions of the application with the outside world.

### Effect directionality

In the `src/effects` folder you can find the implementation of all the side effects of the application. They can be cataloged into three _types_, and although these types don't tell much about what the specific effects do, they are helpful to understand why the wiring API has the specific signature that it has, so I'll explain them briefly:

- Incoming: Effects that only inject data into the application. [Resize](#resize) and [Setup](#setup).

- Outgoing: Effects that react to the new state by performing some operation, but never inject anything back. [Log](#log).

- Bidirectional: Effects that react to the state _and_ inject information into it via actions:
  - [LocalStorage](src/effects/localStorage.js): when first invoked, it checks if there is an entry in `localStorage` for `tesselation`, and if there is, it immediately pushes an action with the previously saved state. It also sets up a listener on the window `storage` event, and whenever said `tesselation` entry is updated it pushes another state override, thus keeping it in sync with whatever other instance of the application is running in a different window or tab (this will conspire with another effect and come back to bite us in one of the gotchas).

### Effect wiring API

Effects are wired to the store with a simple API: each effect is a function with the signature (in [Flowtype annotations](https://flowtype.org/)):

```javascript
type FluxAction = {
  type: Symbol,
  payload: any
}

type Effect = (push: (action: FluxAction) => void) => ?(state: any) => void
```

For example, wiring so that the state is simply logged each time it is updated is easy enough:

```javascript
export default (push) => (state) => console.log(state)
```

Another thing that you can do is to push an action the moment the application is setup. This is useful to initialize values on startup. For that case we can use a little API sugar: since the `(state: any) => void` part of the signature is optional (preceded by a `?`) we can push directly:

```javascript
import {RANDOM_VALUE} from 'actions'

export default (push) => push({
  type: RANDOM_VALUE,
  payload: Math.random()
})
```

### The effects

Next follows an explanation (?)

### Resize

> [src/effects/resize.js](src/effects/resize.js)

Listens to `resize` events on the window and pushes an action with the new value:


### Setup

> [Code](src/effects/setup.js)

When initialized, it immediately pushes an action with a newly generated UUID to identify the instance of the application. There is an interesting gotcha here: I initially modeled this as being part of the `initialState` object in the `store`, but you can see how that violates the purity of the store implementation. It's a common temptation to include "one off" effects in the creation of the `initialState`, but that is likely to create problems down the line. It's a good litmus test for the store implementation that no libraries with side effects are used in it.

### Log

> [Code](src/effects/log.js)

Simply logs the current points each time the state is updated.

### Seed



## Debugging


## Gotchas and easter eggs

The application has two bugs that were left there to demonstrate the kind of quirks that can emerge out of this architecture, and I will discuss here possible solutions.

TODO: Where should the logic for preprocessing the actions be done?

## Take aways

- **Symbols** make for pretty cool action types.

## Credits and references

- [Redux](http://redux.js.org/) which "single reducer" idea heavily inspired this architecture.
- @joaomilho who originally gave me the idea of using [`flyd`](https://github.com/paldepind/flyd) to re implement the Redux store, and who's [Act framework](https://github.com/act-framework/act) and [Ion language](https://github.com/ion-lang/ion) motivated the wish to do more and more functional and reactive programming in JavaScript.
- @Nevon's [demystifying Redux](https://gist.github.com/Nevon/eada09788b10b6a1a02949ec486dc3ce)
- []
