export const Type1_$TSR = {
  type: "object",
  properties: { a: { type: "number" }, b: { type: "string" } },
};

export const Type2_$TSR = {
  type: "union",
  values: [
    { type: "string" },
    { type: "primitive", value: 4 },
    { type: "primitive", value: 2 },
    { type: "boolean" },
  ],
};

export const Type3_$TSR = {
  type: "function",
  parameters: { a: { type: "number" }, b: { type: "string" } },
  returns: { type: "boolean" },
};

export const Type4_$TSR = {
  type: "object",
  properties: {
    a: {
      type: "union",
      values: [
        { type: "primitive", value: 4 },
        { type: "primitive", value: 5 },
        { type: "string" },
      ],
    },
    b: {
      type: "Promise",
      value: {
        type: "union",
        values: [{ type: "string" }, { type: "number" }],
      },
    },
  },
};

export const Type5_$TSR = {
  type: "function",
  parameters: { a: { type: "number" }, b: { type: "string" } },
  returns: { type: "Promise", value: { type: "boolean" } },
};

// export const Type6_$TSR= { type: 'object', properties: { a: { type: 'generic', value: 'A'A', value: },b: { type: 'generic', value: 'B'B', value: },c: {
//     type: "union",
//     values: [
//   { type: 'Promise', value: { type: 'generic', value: 'C'C', value: }},{ type: 'number' },]},d: { type: 'function', parameters: {a:{ type: 'number' },}, returns: { type: 'boolean' }},} ,generics: {a: 'A',b: 'B',c: 'C',type: 'Type',},}

export const ttType_$TSR = {
  type: "function",
  parameters: {
    a: { type: "generic", value: "A" },
    b: { type: "generic", value: "B" },
  },
  returns: {
    type: "object",
    properties: {
      a: { type: "generic", value: "A" },
      b: { type: "generic", value: "A" },
    },
  },
  generics: ["A", "B"],
};
