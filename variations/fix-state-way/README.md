# Tessellation (thesis): Bug fixed the state way

This is a demonstration of the [state way](https://github.com/xaviervia/tessellation#the-state-way) of fixing the bug in the Tessellation thesis. Please refer to the [original document](https://github.com/xaviervia/tessellation) for a complete explanation of the thesis and of this particular solution.

## The patch

```diff
diff --git a/src/effects/seed.js b/src/effects/seed.js
index b5610f7..9bb6fb8 100644
--- a/src/effects/seed.js
+++ b/src/effects/seed.js
@@ -1,15 +1,8 @@
-import {map, range} from 'ramda'
 import {APP_SEED} from 'actions'

-const {floor, random} = Math
-
 // This effect needs to be loaded last
 // to avoid colliding with any state recovered from localStorage
 export default (push) => (state) => state.shared.points.length === 0 &&
   push({
-    type: APP_SEED,
-    payload: map(
-      () => [floor(random() * 100), floor(random() * 100)],
-      range(0, 9)
-    )
+    type: APP_SEED
   })
diff --git a/src/effects/view.js b/src/effects/view.js
index 2087f3d..b365bfb 100644
--- a/src/effects/view.js
+++ b/src/effects/view.js
@@ -6,7 +6,7 @@ import {voronoi} from 'd3-voronoi'
 import Button from 'components/Button'

 import * as selectors from 'selectors'
-import {APP_UNDO, POINTS_ADD, POINTS_CLEANUP} from 'actions'
+import {APP_UNDO, POINTS_ADD, APP_SEED} from 'actions'

 import normalize from 'lib/normalize'

@@ -47,7 +47,7 @@ export default (push) => {
           </Button>

           <Button
-            onClick={() => push({ type: POINTS_CLEANUP })}
+            onClick={() => push({ type: APP_SEED })}
             title='reseed'>
             ✕
           </Button>
diff --git a/src/lib/seedableRandom.js b/src/lib/seedableRandom.js
new file mode 100644
index 0000000..c1b2473
--- /dev/null
+++ b/src/lib/seedableRandom.js
@@ -0,0 +1,10 @@
+import {reduce} from 'ramda'
+const {floor, sin} = Math
+
+export default (seed, counter) => {
+  const x = sin(
+    reduce((value, char) => value + char.charCodeAt(0), 0, seed.split('')) +
+    counter
+  ) * 10000
+  return x - floor(x)
+}
diff --git a/src/reducers/app.js b/src/reducers/app.js
index 3261b61..8ea34f5 100644
--- a/src/reducers/app.js
+++ b/src/reducers/app.js
@@ -1,6 +1,9 @@
-import {set} from 'ramda'
+import {map, range, set} from 'ramda'

 import * as lenses from 'lenses'
+import seedableRandom from 'lib/seedableRandom'
+
+const {floor} = Math

 export default (actions) => (reducer) => (state, {type, payload}) => {
   switch (type) {
@@ -12,18 +15,48 @@ export default (actions) => (reducer) => (state, {type, payload}) => {
       )

     case actions.APP_SEED:
-      return set(
-        lenses.points,
-        payload,
-        state
-      )
+      return {
+        ...state,
+        shared: {
+          ...state.shared,
+          // `18` is the amount of numbers that we will use,
+          // two numbers for each dot.
+          counter: (state.shared.counter || 0) + 18,
+          points: map(
+            (index) => [
+              floor(
+                seedableRandom(
+                  state.shared.seed,
+                  state.shared.counter + (index * 2)
+                ) * 100
+              ),
+              floor(
+                seedableRandom(
+                  state.shared.seed,
+                  state.shared.counter + (index * 2) + 1
+                ) * 100
+              )
+            ],
+            range(0, 9)
+          )
+        }
+      }

     case actions.APP_SETUP:
-      return set(
-        lenses.id,
-        payload.id,
-        state
-      )
+      return {
+        ...state,
+        local: {
+          ...state.local,
+          id: payload.id
+        },
+        shared: state.shared.seed
+          ? state.shared
+          : {
+            ...state.shared,
+            seed: payload.id,
+            counter: 0
+          }
+      }

     case actions.APP_SYNC:
       return {
```

## License

[The Unlicense](LICENSE)
