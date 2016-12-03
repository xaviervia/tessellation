# Tessellation (thesis): Redux

This is a demonstration of using Redux instead of Flyd to implement the [Tessellation application](https://github.com/xaviervia/tessellation). Please refer to the [original document](https://github.com/xaviervia/tessellation) for a complete explanation.

## The patch

```diff
diff --git a/src/index.js b/src/index.js
index c211cba..17ad26f 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,4 +1,4 @@
-import {on, stream, scan} from 'flyd'
+import {createStore} from 'redux'
 import {initialState, reducer} from 'store'

 import {compose, filter, map} from 'ramda'
@@ -10,26 +10,25 @@ import seed from 'effects/seed'
 import setup from 'effects/setup'
 import view from 'effects/view'

-const push = stream()
+const store = createStore(reducer, initialState)

-const store = scan(reducer, initialState, push)
+const push = store.dispatch

 const effects = [localStorage, log, resize, seed, setup, view]

-const deduplicatedStore = stream()
-
-let prevState
-on((nextState) => {
-  prevState !== nextState && deduplicatedStore(nextState)
-  prevState = nextState
-}, store)
-
 const listeners = compose(
   filter((listener) => listener != null),
   map((effect) => effect(push)),
 )(effects)

-on(
-  (state) => listeners.forEach((listener) => listener(state)),
-  deduplicatedStore
+let prevState
+store.subscribe(
+  () => {
+    if (prevState !== store.getState()) {
+      listeners.forEach((listener) => listener(store.getState()))
+      prevState = store.getState()
+    }
+  }
 )
+
+listeners.forEach((listener) => listener(store.getState()))
```

## License

[The Unlicense](LICENSE)
