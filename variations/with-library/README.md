# Tessellation (thesis): with Tessellation library

This is a demonstration of using the [Tessellation library](../../packages/tessellation) instead of Flyd to implement the [Tessellation application](https://github.com/xaviervia/tessellation). Please refer to the [original document](https://github.com/xaviervia/tessellation) for a complete explanation.

## The patch

```diff
diff --git a/src/index.js b/src/index.js
index 17ad26f..e37fe64 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,7 +1,6 @@
-import {createStore} from 'redux'
-import {initialState, reducer} from 'store'
+import {createApp} from 'tessellation'

-import {compose, filter, map} from 'ramda'
+import {initialState, reducer} from 'store'

 import localStorage from 'effects/localStorage'
 import log from 'effects/log'
@@ -10,25 +9,4 @@ import seed from 'effects/seed'
 import setup from 'effects/setup'
 import view from 'effects/view'

-const store = createStore(reducer, initialState)
-
-const push = store.dispatch
-
-const effects = [localStorage, log, resize, seed, setup, view]
-
-const listeners = compose(
-  filter((listener) => listener != null),
-  map((effect) => effect(push)),
-)(effects)
-
-let prevState
-store.subscribe(
-  () => {
-    if (prevState !== store.getState()) {
-      listeners.forEach((listener) => listener(store.getState()))
-      prevState = store.getState()
-    }
-  }
-)
-
-listeners.forEach((listener) => listener(store.getState()))
+createApp(reducer, initialState, [localStorage, log, resize, seed, setup, view])
diff --git a/src/effects/view.js b/src/effects/view.js
index 2087f3d..9986f86 100644
--- a/src/effects/view.js
+++ b/src/effects/view.js
@@ -1,5 +1,5 @@
-import React, {Component} from 'react'
-import {render} from 'react-dom'
+import React from 'react'
+import {renderEffect} from 'tessellation'
 import {map} from 'ramda'
 import {voronoi} from 'd3-voronoi'

@@ -10,77 +10,63 @@ import {APP_UNDO, POINTS_ADD, POINTS_CLEANUP} from 'actions'

 import normalize from 'lib/normalize'

-export default (push) => {
-  let onState
+function View ({push, ...state}) {
+  const dots = map(
+    ([x, y]) => [
+      normalize(state.local.size.width + 20)(100, x),
+      normalize(state.local.size.height + 20)(100, y)
+    ],
+    selectors.points(state)
+  )

-  class Container extends Component {
-    componentDidMount () {
-      onState = (state) => this.setState({
-        storeData: state
-      })
-    }
+  const scale = 1
+  const diagram = voronoi().extent(
+    [[0, 0], [state.local.size.width, state.local.size.height]]
+  )(dots)
+  const polygons = diagram.polygons()

-    render () {
-      if (this.state == null) {
-        return false
-      }
+  return <main>
+    <header>
+      <Button
+        onClick={() => push({ type: APP_UNDO })}
+        title='undo'>
+        ⎌
+      </Button>

-      const {storeData} = this.state
-      const dots = map(
-        ([x, y]) => [
-          normalize(storeData.local.size.width + 20)(100, x),
-          normalize(storeData.local.size.height + 20)(100, y)
-        ],
-        selectors.points(storeData)
-      )
+      <Button
+        onClick={() => push({ type: POINTS_CLEANUP })}
+        title='reseed'>
+        ✕
+      </Button>

-      const scale = 1
-      const diagram = voronoi().extent([[0, 0], [storeData.local.size.width, storeData.local.size.height]])(dots)
-      const polygons = diagram.polygons()
+      <span className='id'>{selectors.id(state)}</span>
+    </header>

-      return <main>
-        <header>
-          <Button
-            onClick={() => push({ type: APP_UNDO })}
-            title='undo'>
-            ⎌
-          </Button>
+    <svg
+      height='100vh'
+      onClick={(e) => push({
+        type: POINTS_ADD,
+        payload: [e.clientX, e.clientY]
+      })}
+      viewBox={`5 5 ${state.local.size.width - 20} ${state.local.size.height - 20}`}
+      width='100vw'>
+      <g className='polygons'>
+        {polygons.map((polygon, index) => <polygon
+          key={index}
+          points={polygon.map((corner) => corner.map((x) => x * scale).join(',')).join(' ')}
+        />)}
+      </g>

-          <Button
-            onClick={() => push({ type: POINTS_CLEANUP })}
-            title='reseed'>
-            ✕
-          </Button>
-
-          <span className='id'>{selectors.id(storeData)}</span>
-        </header>
-
-        <svg
-          height='100vh'
-          onClick={(e) => push({
-            type: POINTS_ADD,
-            payload: [e.clientX, e.clientY]
-          })}
-          viewBox={`5 5 ${storeData.local.size.width - 20} ${storeData.local.size.height - 20}`}
-          width='100vw'>
-          <g className='polygons'>
-            {polygons.map((polygon, index) => <polygon
-              key={index}
-              points={polygon.map((corner) => corner.map((x) => x * scale).join(',')).join(' ')}
-            />)}
-          </g>
-
-          <g className='circles'>
-            {dots.map(([x, y], index) =>
-              <circle key={index} cx={x * scale} cy={y * scale} r='2' />
-            )}
-          </g>
-        </svg>
-      </main>
-    }
-  }
-
-  render(<Container />, document.getElementById('tessellation'))
-
-  return onState
+      <g className='circles'>
+        {dots.map(([x, y], index) =>
+          <circle key={index} cx={x * scale} cy={y * scale} r='2' />
+        )}
+      </g>
+    </svg>
+  </main>
 }
+
+export default renderEffect(
+  View,
+  document.getElementById('tessellation')
+)
```

## License

[The Unlicense](LICENSE)
