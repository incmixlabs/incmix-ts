## The validity tree returned by `validateTsRuntimeObject`

If the `data` is valid, as per the TSR object schema (ie: the rules to which the form data or field adheres), then a
single [`Valid`](src/lib/helpers/ValidityTree/Valid.ts) node is returned. <br>
Otherwise, a tree of [`Invalid`](src/lib/helpers/ValidityTree/Invalid.ts) nodes is returned. Each node has, attached to
it, an identifier to identify which field or form is invalid. <br>
Leaf nodes of this tree ([`InvalidLeaf`](src/lib/helpers/ValidityTree/InvalidLeaf.ts)) contain
a [`Reason`](src/lib/helpers/ValidityTree/Reason.ts) for their invalidity; outlining the expected and received types and
values. <br>
Non-leaf nodes ([`InvalidNode`](src/lib/helpers/ValidityTree/InvalidNode.ts)) don't contain
a [`Reason`](src/lib/helpers/ValidityTree/Reason.ts) as they are considered invalid due to the invalidity of their
children.

### Why valid nodes aren't included in the tree

The end user isn't concerned with a valid entry as no changes need be made to such entries. Only invalid entries need to
be changed - so the user only needs to know which fields they've entered data into incorrectly. Consequently, this fact
is reflected in what the tree contains. <br>
Put simply: <strong> omission implies validity</strong>.

## Creating a `customValidtor`

Custom TSR objects allow for the creation of forms with custom validity schemas. Due to this, all custom TSR objects
require a custom validator. And, in order for the custom validator to be interoperable with the
validator `validateTsRuntimeObject`,
it needs to adhere to the [`TSRObjValidator`](src/lib/helpers/types.ts) function signature. Pass the custom validator in
the `params` object as the third argument passed to the validator.

### `customValidator` signature

```typescript
customValidator: (
    customTSRObj: CustomTsRuntimeObject,
    data: any
) => ValidityTree
```

Custom TSR objects are defined in [`index`](src/index.ts) as:

```typescript
type CustomTsRuntimeObject = {
    readonly type: `$${string}`;
    readonly schema: any;
};
```

Since the custom validator takes the entire custom TSR objects - the `CustomTsRuntimeObject.type` can be leveraged in
order to allow for custom TSR objects with a different types to have the same `schema` and `customValidator`

## Example `customValidator`

```typescript
function customValidator(
    CustomTSRObj: CustomTsRuntimeObject,
    data: any
): ValidityTree {
    switch (CustomTSRObj.type) {
        case "$foo":
            if (typeof data["fooBar"] === "number")
                return new Valid();
            else
                return new InvalidLeaf(
                    CustomTSRObj.type,
                    new Reason(typeof data, data)
                );
        case "$bar":
            if (typeof data["fooBar"] === "boolean")
                return new Valid();
            else
                return new InvalidLeaf(
                    CustomTSRObj.type,
                    new Reason(typeof data, data)
                );
            break;
        default:
            return new InvalidLeaf(
                CustomTSRObj.type,
                new Reason(typeof data, data)
            );
            break;
    }
}
```

#### Example custom TSR objects

```typescript
const fooCustomTSRObj: CustomTsRuntimeObject = {
    type: "$foo",
    schema: {fooBar: "number"}
};

const barCustomTSRObj: CustomTsRuntimeObject = {
    type: "$bar",
    schema: {fooBar: "boolean"}
};
```

#### Example data received from a form

```typescript
const fooData = {
    fooBar: 0
};

const barData = {
    fooBar: true
};
```

#### Validating the dummy form data against the schema using the custom validator 

```typescript
validateTsRuntimeObject(fooCustomTSRObj, fooData, { customValidator });
validateTsRuntimeObject(barCustomTSRObj, barData, { customValidator });
```

The custom validator should return a [`ValidityTree`](src/lib/helpers/ValidityTree/ValidityTree.ts). This ensures
interoperability between non-custom TSR objects and custom TSR objects. Allowing for the form or field, that the custom
TSR object represents, to be encapsulated within non-custom TSR objects. <br>

Below is a list of the different tree subtypes and the situation in which the custom
validator might return each:
- An [`InvalidLeaf`](src/lib/helpers/ValidityTree/InvalidLeaf.ts) is returned when the expected data is directly
  comparable to the received data on a 1:1 basis. This only applies to single fields and doesn't apply to iterable or
  recursively defined fields or forms.
- An [`InvalidNode`](src/lib/helpers/ValidityTree/InvalidNode.ts) is returned when the field or form is iterable or
  recursively defined. Eg: a drop-down list where multiple items can be selected.
- A [`Valid`](src/lib/helpers/ValidityTree/Valid.ts) node is returned when the field or form is valid.