# @ts-r/core

## 0.0.5

### Patch Changes

- 5a1f01c: visitor can now handle the never keyword and bigint literals and NeverTSRObj was added to utils

## 0.0.4

### Patch Changes

- 629cd19: Added support for excluding all nodes that the visitor doesn't visit from being output
- 8fc8d24: Added tests for optional object keys

## 0.0.3

### Patch Changes

- 3b993b7: Added TSR objects for null and undefined in utils. Added tests in core for null and undefined.
- 6807993: Added npmrc file so that peer dependencies are ignored
- f7cad10: TSR objects are now exported as constants. Core tests were modified to account for this change.
- a52d846: JS doc comments in tsr.ts files are now prepended onto their corresponding output nodes in tsr.o.ts files

## 0.0.2

### Patch Changes

- 768a960: Change to ts-r
