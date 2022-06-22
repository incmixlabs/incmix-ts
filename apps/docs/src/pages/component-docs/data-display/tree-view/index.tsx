import { Text, TreeView } from "@incmix/ui";
import { getId } from "@incmix/utils";
import Prism from "prismjs";
import { Accessor, createSignal, onMount, Setter } from "solid-js";

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
    href: "/docs/data-display/tag",
    label: "Tag",
  };

  const nextLink: ContextualNavLink = {
    href: "/docs/navigation/anchor",
    label: "Anchor",
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
      name: "data",
      description: "An array of nested data containing a required key of 'id'",
      type: "T",
    },
    {
      name: "item",
      description:
        "Function that determines how render the items in the TreeView",
      type: "(item: T) => unknown",
    },
    {
      name: "getChildren",
      description: "Function that returns an array of children for a tree item",
      type: "(item: T) => Accessor<T[] | undefined>",
    },
    {
      name: "getSupportsChildren",
      description:
        "Function that returns a boolean indicating if the item supports children",
      type: "(item: T) => boolean",
    },
    {
      name: "setChildren",
      description: "Function that sets the children for a tree item",
      type: "(item: T, children: T[]) => unknown",
    },
    {
      name: "openItems",
      description: "An array of items that are open",
      type: "Accessor<Record<string, boolean>>",
      required: false,
    },
    {
      name: "setOpenItems",
      description: "Function that sets the open items",
      type: "Setter<Record<string, boolean>>",
      required: false,
    },
    {
      name: "ref",
      description: "A reference to the TreeView",
      type: "unknown",
      required: false,
    },
    {
      name: "dragDisabled",
      description: "A boolean indicating if the tree is drag disabled",
      type: "boolean",
      defaultValue: "false",
      required: false,
    },
    {
      name: "onClick",
      description: "A function that is called when an item is clicked",
      type: "(e: Event, id: unknown) => unknown",
      required: false,
    },
  ];

  onMount(() => {
    Prism.highlightAll();
  });

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

  return (
    <PageLayout
      previousLink={previousLink}
      nextLink={nextLink}
      contextualNavLinks={contextualNavLinks}
    >
      <PageTitle>TreeView</PageTitle>
      <Text mb="$5">
        TreeView displays nested data in a tree-like structure.
      </Text>
      <SectionTitle id="import">Import</SectionTitle>
      <CodeSnippet snippet={snippets.importComponent} mb="$12" />
      <SectionTitle id="usage">Usage</SectionTitle>
      <Preview snippet={snippets.basicUsage} mb="$12">
        <TreeView
          data={data}
          setChildren={(parent, children) => parent.setChildren(children)}
          getSupportsChildren={() => true}
          getChildren={(query) => query.children}
          item={(props) => <p>{props.data.name}</p>}
        />
      </Preview>
      <SectionTitle id="props">Props</SectionTitle>
      <SectionSubtitle id="table-props">TreeView props</SectionSubtitle>
      <PropsTable items={tablePropItems} mb="$10" />
    </PageLayout>
  );
}
