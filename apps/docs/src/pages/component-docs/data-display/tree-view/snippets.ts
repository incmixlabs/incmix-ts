const importComponent = `import { 
  DataTable,
  TableColumnGroup,
} from "@incmix/ui";`;

const basicUsage = `
type Data = {
  id: string | number;
  children: Accessor<Data[] | undefined>;
  setChildren: Setter<Data[] | undefined>;
  name: string;
};

const h = (name: string, children?: Data[]): Data => {
  const [c, setC] = createSignal<Data[] | undefined>(children ?? []);

  return {
    id: getId(),
    name,
    children: () => c(),
    setChildren: setC,
  };
};

const data = h("Baptist", [
  h("newton"),
  h("uma", [h("Me"), h("Fish"), h("Berry", [h("Meter"), h("Darlington")])]),
]);
<TreeView
data={data}
setChildren={(parent, children) => parent.setChildren(children)}
getSupportsChildren={() => true}
getChildren={(query) => query.children}
item={(props) => <p>{props.data.name}</p>}
/>
`;

export const snippets = {
  importComponent,
  basicUsage,
};
