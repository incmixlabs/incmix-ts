import { DataTable, Text } from "@incmix/ui";
import Prism from "prismjs";
import { onMount } from "solid-js";

import Code from "@/components/Code";
import CodeSnippet from "@/components/CodeSnippet";
import { ContextualNavLink } from "@/components/ContextualNav";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Preview } from "@/components/Preview";
import { PropsTable, PropsTableItem } from "@/components/PropsTable";
import SectionSubtitle from "@/components/SectionSubtitle";
import SectionTitle from "@/components/SectionTitle";

import { snippets } from "./snippets";

export default function TableDoc() {
  const previousLink: ContextualNavLink = {
    href: "/docs/data-display/list",
    label: "List",
  };

  const nextLink: ContextualNavLink = {
    href: "/docs/data-display/tag",
    label: "Tag",
  };
  const contextualNavLinks: ContextualNavLink[] = [
    { href: "#import", label: "Import" },
    { href: "#usage", label: "Usage" },
    { href: "#props", label: "Props" },
    { href: "#table-props", label: "Table props", indent: true },
    {
      href: "#table-column-group-props",
      label: "Table Column Props",
      indent: true,
    },
    { href: "#table-column-props", label: "Table Column Props", indent: true },
  ];

  const tablePropItems: PropsTableItem[] = [
    {
      name: "columns",
      description:
        "An array containing TableColumnGroup items. This is the main property that defines how the table should be structured for the data you wish  to pass.",
      type: "TableColumnGroup[]",
    },
    {
      name: "data",
      description:
        "An array of data to display in the table. The data for a row is passed as an object with the keys matching the TableColumnGroup",
      type: "Record<string, any>[]",
    },
    {
      name: "sortable",
      description: "Set to true to enable sorting of the table.",
      type: "boolean",
      defaultValue: "false",
    },
    {
      name: "headerRowProps",
      description: "Props to pass to the header row.",
      type: "object",
    },
    {
      name: "headerCellProps",
      description: "Props to pass to the header cell.",
      type: "object",
    },
    {
      name: "bodyRowProps",
      description: "Props to pass to the body row.",
      type: "object",
    },
    {
      name: "bodyCellProps",
      description: "Props to pass to the body cell.",
      type: "object",
    },
    {
      name: "striped",
      description:
        "Set a neutral background color on odd or even row of table.",
      type: '"odd" | "even"',
    },
    {
      name: "dense",
      description:
        "If `true`, row will have less padding and smaller font size.",
      type: "boolean",
    },
    {
      name: "highlightOnHover",
      description: "If `true`, row will have hover color.",
      type: "boolean",
    },
  ];

  const tableColumnGroupProps: PropsTableItem[] = [
    {
      name: "group",
      description:
        "A group defines the columns that should be displayed in the table. The group can be used to group columns together.",
      type: `
      {
        header: string;
        columns: TableColumn[];
      }
      `,
    },
  ];

  const tableColumnGroup: PropsTableItem[] = [
    {
      name: "key",
      description:
        "A unique key for the group. It is used to match the data to the column",
      type: "string",
    },
    {
      name: "columnLabel",
      description: "The label for the column",
      type: "string",
    },
    {
      name: "id",
      description: "The id of the column",
      type: "string",
      defaultValue: "createUniqueId()",
    },
  ];
  onMount(() => {
    Prism.highlightAll();
  });
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
    <PageLayout
      previousLink={previousLink}
      nextLink={nextLink}
      contextualNavLinks={contextualNavLinks}
    >
      <PageTitle>Data Table</PageTitle>
      <Text mb="$5">
        Data Tables are used to organize and display consistent data
        efficiently. It renders a <Code>table</Code> element by default.
      </Text>
      <SectionTitle id="import">Import</SectionTitle>
      <CodeSnippet snippet={snippets.importComponent} mb="$12" />
      <SectionTitle id="usage">Usage</SectionTitle>
      <Preview snippet={snippets.basicUsage} mb="$12">
        <DataTable columns={columns} data={data} />
      </Preview>
      <SectionTitle id="striped">Sortable table</SectionTitle>
      <Text mb="$5">
        Use the <Code>sortable</Code> prop to render sortable columns. You can
        set the value to <Code>true</Code> or <Code>false</Code>.
      </Text>
      <Preview snippet={snippets.sortable} mb="$12">
        <DataTable columns={columns} data={data} sortable={true} />
      </Preview>

      <SectionTitle id="props">Props</SectionTitle>
      <SectionSubtitle id="table-props">Table props</SectionSubtitle>
      <PropsTable items={tablePropItems} mb="$10" />
      <SectionSubtitle id="table-column-group-props">
        Table Column Group props
      </SectionSubtitle>
      <PropsTable items={tableColumnGroupProps} mb="$10" />
      <SectionSubtitle id="table-column-props">
        Table Column Props
      </SectionSubtitle>
      <PropsTable items={tableColumnGroup} mb="$10" />
    </PageLayout>
  );
}
