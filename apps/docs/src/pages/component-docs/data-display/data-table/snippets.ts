const importComponent = `import { 
  DataTable,
  TableColumnGroup,
} from "@incmix/ui";`;

const basicUsage = `
function BasicUsage() {
  const columns = [
    {
      group: {
        header: "Numbers",
        columns: [
          {
            key: "column1",
            columnLabel: "Column 1",
          },
          {
            key: "column2",
            columnLabel: "Column 2",
          },
        ],
      },
    },
  ];
  
  const data = [
    {
      column1: "Data 1",
      column2: "Data 2",
    },
    {
      column1: "Data 3",
      column2: "Data 4",
    },
    {
      column1: "Data 5",
      column2: "Data 6",
    },
    {
      column1: "Data 1",
      column2: "Data 2",
    },
    {
      column1: "Data 3",
      column2: "Data 4",
    },
    {
      column1: "Data 5",
      column2: "Data 6",
    },
  ];
  return (
    <DataTable columns={columns} data={data} />
  )
}
`;

const sortable = `
function BasicUsage() {
  const columns = [
    {
      group: {
        header: "Numbers",
        columns: [
          {
            key: "column1",
            columnLabel: "Column 1",
          },
          {
            key: "column2",
            columnLabel: "Column 2",
          },
        ],
      },
    },
  ];
  
  const data = [
    {
      column1: "Data 1",
      column2: "Data 2",
    },
    {
      column1: "Data 3",
      column2: "Data 4",
    },
    {
      column1: "Data 5",
      column2: "Data 6",
    },
    {
      column1: "Data 1",
      column2: "Data 2",
    },
    {
      column1: "Data 3",
      column2: "Data 4",
    },
    {
      column1: "Data 5",
      column2: "Data 6",
    },
  ];
  return (
    <DataTable columns={columns} data={data} />
  )
}
`;

export const snippets = {
  importComponent,
  basicUsage,
  sortable,
};
