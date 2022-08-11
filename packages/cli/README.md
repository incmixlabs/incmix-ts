# ts.runtime

This tool converts TypeScript types into TS Runtime objects.

# Usage - via CLI

Install it globally:

```sh
npm i ts.runtime -g
```

We have this file:

```ts
// test/test.ts
export type Type = string | 4 | 2 | boolean;
```

To convert the type in the file above, we do this:

```
ts.runtime test/test.ts
```

This generates the TS Runtime objects from the types in the file and prints them:

```ts
export type Type = string | 4 | 2 | boolean;

export type TsRuntimeObject_Type = {
  type: "union";
  members: [
    { type: "string" },
    { type: "number"; value: 4 },
    { type: "number"; value: 2 },
    { type: "boolean" }
  ];
};
```

# Usage - via programmatic interface

You can use `ts.runtime` in your projects.

```sh
npm i ts.runtime
```

In our project, we import `generateTSRuntimeObjectFromFile` from `ts.runtime`:

```ts
import { generateTSRuntimeObjectFromFile } from "ts.runtime";

const tsRuntimeObject = generateTSRuntimeObjectFromFile("test/test.ts");
```
