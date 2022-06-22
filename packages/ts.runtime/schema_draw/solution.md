```ts
export type Type = { a: number; b: string };

type TsRuntimeObject = {
  type: "object";
  properties: {
    a: {
      type: "number";
    };
    b: {
      type: "string";
    };
  };
};
```

```typescript
export type Type = string | 4 | 2 | boolean;

type TsRuntimeObject = {
  type: "union";
  values: [
    { type: "string" },
    { type: "number"; value: 4 },
    { type: "number"; value: 2 },
    { type: "boolean" }
  ];
};
```

```ts
export type Type = {
  a: 4 | 5 | string;
  b: Promise<string | number>;
};

type TsRuntimeObject = {
  type: "object";
  properties: {
    a: {
      type: "union";
      values: [
        {
          type: "number";
          value: 4;
        },
        {
          type: "number";
          value: 5;
        },
        {
          type: "string";
        }
      ];
    };
    b: {
      type: "promise";
      value: {
        type: "union";
        values: [
          {
            type: "number";
          },
          {
            type: "string";
          }
        ];
      };
    };
  };
};
```

```ts
export type Type = (a: number, b: string) => boolean;

type TsRuntimeObject = {
  type: "function";
  parameters: {
    a: "number";
    b: "string";
  };
  return: {
    type: "boolean";
  };
};
```

```ts
export type Type = (a: number, b: string) => Promise<boolean>;

type TsRuntimeObject = {
  type: "function";
  parameters: {
    a: "number";
    b: "string";
  };
  return: {
    type: "promise";
    value: {
      type: "union";
      values: [
        {
          type: "boolean";
        }
      ];
    };
  };
};
```

```ts
export type Type<A, B, C> = {
  a: A;
  b: B;
  c: Promise<C> | number;
  d: (a: number) => boolean;
};

type TsRuntimeObject = {
  type: "object";
  properties: {
    a: {
      type: "generic-a";
      generics: {
        a: "number";
        b: "string";
        c: "boolean";
      };
    };
    b: {
      type: "generic-b";
      generics: {
        a: "number";
        b: "string";
        c: "boolean";
      };
    };
    c: {
      type: "promise";
      value: {
        type: "union";
        values: [
          {
            type: "number";
          },
          {
            type: "boolean";
          }
        ];
      };
    };
    d: {
      type: "function";
      generics: {
        a: "number";
        b: "string";
        c: "boolean";
      };
      parameters: {
        a: "number";
      };
      return: {
        type: "union";
        values: [
          {
            type: "boolean";
          }
        ];
      };
    };
  };
};
```

```ts
import { createSignal } from "solid-js";

export type Type = typeof createSignal;

type TsRuntimeObject = {
  type: "function";
  generics: {
    a: "number";
    b: "string";
  };
  parameters: {
    a: "number";
    b: "string";
  };
  return: {
    type: "signal";
    value: {
      type: "union";
      values: [
        {
          type: "number";
        },
        {
          type: "string";
        }
      ];
    };
  };
};
```

```ts
export type Type = <A, B>(a: A, b: B) => { a: A; b: B };

type TsRuntimeObject = {
  type: "function";
  generics: {
    a: "A";
    b: "B";
  };
  parameters: {
    a: { type: "generic"; value: "a" };
    b: { type: "generic"; value: "b" };
  };
  return: {
    type: "object";
    properties: {
      a: {
        type: "any";
      };
      b: {
        type: "any";
      };
    };
  };
};
```

```js
 enum Direction {
  Up,
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
  Side = 2
}

export type En = Direction

type TsRuntimeObject = {
  type: "enum";
  values: [
    {
      type: "string";
      name: "UP";
      value: "UP";
    },
    {
      type: "string";
      value: "DOWN";
    },
    {
      type: "string";
      value: "LEFT";
    },
    {
      type: "string";
      value: "RIGHT";
    },
    {
      type: "number",
      name: "Side",
      value: 2
    }
  ];
};

```
