export const TsRuntimeObject_Type1 = {
  type: 'object',
  properties: { a: { type: 'number' }, b: { type: 'string' } },
}

export const TsRuntimeObject_Type2 = {
  type: 'union',
  values: [
    { type: 'string' },
    { type: 'number', value: 4 },
    { type: 'number', value: 2 },
    { type: 'boolean' },
  ],
}

export const TsRuntimeObject_Type3 = {
  type: 'function',
  parameters: { a: { type: 'number' }, b: { type: 'string' } },
  returns: { type: 'boolean' },
}

export const TsRuntimeObject_Type4 = {
  type: 'object',
  properties: {
    a: {
      type: 'union',
      values: [
        { type: 'number', value: 4 },
        { type: 'number', value: 5 },
        { type: 'string' },
      ],
    },
    b: {
      type: 'Promise',
      value: {
        type: 'union',
        values: [{ type: 'string' }, { type: 'number' }],
      },
    },
  },
}

export const TsRuntimeObject_Type5 = {
  type: 'function',
  parameters: { a: { type: 'number' }, b: { type: 'string' } },
  returns: { type: 'Promise', value: { type: 'boolean' } },
}

export const TsRuntimeObject_Type6 = {
  type: 'object',
  properties: {
    a: { type: 'generic', value: 'A' },
    b: { type: 'generic', value: 'B' },
    c: {
      type: 'union',
      values: [
        { type: 'Promise', value: { type: 'generic', value: 'C' } },
        { type: 'number' },
      ],
    },
    d: {
      type: 'function',
      parameters: { a: { type: 'number' } },
      returns: { type: 'boolean' },
    },
  },
  generics: { a: 'A', b: 'B', c: 'C', type: 'Type' },
}

export const TsRuntimeObject_ttType = {
  type: 'function',
  parameters: {
    a: { type: 'generic', value: 'A' },
    b: { type: 'generic', value: 'B' },
  },
  returns: {
    type: 'object',
    properties: {
      a: { type: 'generic', value: 'A' },
      b: { type: 'generic', value: 'B' },
    },
    generics: { a: 'A', b: 'B' },
  },
}
