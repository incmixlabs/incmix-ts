The tsRuntime type object will specify the format for the tsRuntime Objects. This is mainly a thinking phase.

TEST CASES

```typescript
export type Type = string | 4 | 2 | boolean;
```

```ts
export type Type = {
  a: 4 | 5 | string;
  b: Promise<string | number>;
};
```

```ts
export type Type = (a: number, b: string) => Promise<boolean>;
```

```ts
export type Type<A, B, C> = {
  a: A;
  b: B;
  c: Promise<C> | number;
  d: (a: number) => boolean;
};
```

```ts
import { createSignal } from "solid-js";

export type Type = typeof createSignal;
```

```ts
export type Type = <A, B>(a: A, b: B) => { a: A; b: B };
```

I would hope for metadata about where the original types came from such as there names and if and where they were imported from withing the exported `TypeObject`. Show this in the example conversion.

This format should be able to represent all possible ts types. I understand there are edge cases you might miss, and that's fine, but just do your best. I provided the examples just to make sure you handle some of the most common difficult parts, but this doesn't mean these are the only types expected to work with this format

To complete this task:

1. Show how these will be represented in the data format,
2. Create the general type of a TsRuntimeObject:

```
type TsRuntimeObject = { //...
```

One possible example and solution: It isn't required you follow this format this is just an example, although you totally can if you want to:

```ts
import { createSignal } from "solid-js";

export type Type<T, U, V> = {
  a: T;
  b: U;
  c: V;
  d: typeof createSignal;
};

export const typeObject = {
  $$generics: {
    a: "asdfasdfsadf",
    b: "asdfassdfsfd",
    c: "asdfas234sadf",
  },
  type: "object",
  properties: {
    a: {
      type: "$$generic-a",
    },
    b: {
      type: "$$generic-b",
    },
    c: {
      type: "$$generic-c",
    },
    d: {
      $$source: {
        lib: "solid-js",
        export: "createSignal",
      },
      type: "function",
      parameters: [
        // not going to fill this in now
      ],
      returns: {
        // also not now but you get the point
      },
    },
  },
} as const;
```

- Support Generators
- Symbol properties

```ts
type Cat = {
  fur: boolean;
};

type Animal = {
  name: string;
};

type Bear = Animal &
  Cat & {
    honey: boolean;
  };

const Animal = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
  },
};

/*
const Bear = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    honey: {
      type: "boolean",
    },
  },
} as const;*/

const Cat = {
  type: "object",
  properties: {
    fur: {
      type: "boolean",
    },
  },
};

const Bear = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    fur: {
      type: "boolean",
    },
    honey: {
      type: "boolean",
    },
  },
} as const;
```

```ts
export type Type = {
  a: string | number;
} & {
  a: string | string[] | { b: 87 };
};

export type TypeEquiv = {
  a: string;
};

export type Type = string | number;

export type TypeEquiv = never;
```
