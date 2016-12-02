# Tessellation (thesis): Bug fixed the helper way

This is a demonstration of the [helper way](https://github.com/xaviervia/tessellation#the-helper-way) of fixing the bug in the Tessellation thesis. Please refer to the [original document](https://github.com/xaviervia/tessellation) for a complete explanation of the thesis and of this particular solution.

### The patch

```diff
diff --git a/src/effects/seed.js b/src/effects/seed.js
index b5610f7..d413d20 100644
--- a/src/effects/seed.js
+++ b/src/effects/seed.js
@@ -1,15 +1,10 @@
-import {map, range} from 'ramda'
+import getRandomizedPoints from 'lib/getRandomizedPoints'
 import {APP_SEED} from 'actions'

-const {floor, random} = Math
-
 // This effect needs to be loaded last
 // to avoid colliding with any state recovered from localStorage
 export default (push) => (state) => state.shared.points.length === 0 &&
   push({
     type: APP_SEED,
-    payload: map(
-      () => [floor(random() * 100), floor(random() * 100)],
-      range(0, 9)
-    )
+    payload: getRandomizedPoints()
   })
diff --git a/src/effects/view.js b/src/effects/view.js
index 2087f3d..caee930 100644
--- a/src/effects/view.js
+++ b/src/effects/view.js
@@ -6,8 +6,9 @@ import {voronoi} from 'd3-voronoi'
 import Button from 'components/Button'

 import * as selectors from 'selectors'
-import {APP_UNDO, POINTS_ADD, POINTS_CLEANUP} from 'actions'
+import {APP_UNDO, POINTS_ADD, APP_SEED} from 'actions'

+import getRandomizedPoints from 'lib/getRandomizedPoints'
 import normalize from 'lib/normalize'

 export default (push) => {
@@ -47,7 +48,9 @@ export default (push) => {
           </Button>

           <Button
-            onClick={() => push({ type: POINTS_CLEANUP })}
+            onClick={() => push({
+              type: APP_SEED, payload: getRandomizedPoints()
+            })}
             title='reseed'>
             ✕
           </Button>
diff --git a/src/lib/getRandomizedPoints.js b/src/lib/getRandomizedPoints.js
new file mode 100644
index 0000000..469871c
--- /dev/null
+++ b/src/lib/getRandomizedPoints.js
@@ -0,0 +1,8 @@
+import {map, range} from 'ramda'
+
+const {floor, random} = Math
+
+export default () => map(
+  () => [floor(random() * 100), floor(random() * 100)],
+  range(0, 9)
+)
```

## License

[The Unlicense](LICENSE)
