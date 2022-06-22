```ts
type TsRunTimeObject = {
  type: string;
  properties: {
      type: object;
      items: {
          name: string;
          type: object;

      }
  };
  values: {
      type: array,
      items: {
          type: string
      }
  };
  parameters: {
      type: object;
      items: {
          name: string;
          type: object;
      }
  };
} as const;
```
