# @ts-r/utils

## 0.1.1

### Patch Changes

- 3b993b7: Added TSR objects for null and undefined in utils. Added tests in core for null and undefined.
- 6807993: Added npmrc file so that peer dependencies are ignored
- a575a9f: Bug fix: validateTSRObj now handles undefined/null data - but not null or undefined TSRObjects.

## 0.1.0

### Minor Changes

- 671cac2: Implemented and tested validateTsRuntimeObject. Tests for more complex types (under the "objects" document comment) only ensure that the validation reports invalid data and doesn't yet ensure correctness of the stack trace returned

## 0.0.2

### Patch Changes

- 768a960: Change to ts-r
