# Tessellation (thesis): Debuggable

This is a demonstration of using the debuggable higher-order reducer to log the store operations in the [Tessellation application](https://github.com/xaviervia/tessellation). Please refer to the [original document](https://github.com/xaviervia/tessellation) for a complete explanation.

## The patch

```diff
diff --git a/src/index.js b/src/index.js
index c211cba..28199d7 100644
--- a/src/index.js
+++ b/src/index.js
@@ -10,9 +10,11 @@ import seed from 'effects/seed'
 import setup from 'effects/setup'
 import view from 'effects/view'

+import debuggable from 'reducers/debuggable'
+
 const push = stream()

-const store = scan(reducer, initialState, push)
+const store = scan(debuggable(reducer), initialState, push)

 const effects = [localStorage, log, resize, seed, setup, view]
```

## License

[The Unlicense](LICENSE)
