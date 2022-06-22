import { FileViewer, Text } from "@incmix/ui";
import Prism from "prismjs";
import { createUniqueId, onMount } from "solid-js";

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
    href: "/docs/data-display/badge",
    label: "badge",
  };

  const nextLink: ContextualNavLink = {
    href: "/docs/data-display/icon",
    label: "Icon",
  };

  const contextualNavLinks: ContextualNavLink[] = [
    { href: "#import", label: "Import" },
    { href: "#usage", label: "Usage" },
    { href: "#props", label: "Props" },
  ];

  const FileProps: PropsTableItem[] = [
    {
      name: "id",
      description: "The id of the root directory",
      type: "string",
    },
    {
      name: "name",
      description: "The name of the root directory",
      type: "string",
      required: false,
      defaultValue: "My Files",
    },
    {
      name: "directory",
      description: "The directory to display",
      type: "Directory",
      required: true,
    },
    {
      name: "showSideNav",
      description: "Whether to show the side nav",
      type: "boolean",
      required: false,
      defaultValue: "true",
    },
    {
      name: "totalSpace",
      description: "The total space of the directory",
      type: "number",
      required: true,
    },
    {
      name: "usedSpace",
      description: "The used space of the directory",
      type: "number",
      required: true,
    },
  ];

  const DirectoryProps: PropsTableItem[] = [
    {
      name: "files",
      description: "The files in the directory",
      type: "File[]",
    },
    {
      name: "id",
      description: "The id of the directory",
      type: "string",
    },
    {
      name: "icon",
      description: "The icon of the directory",
      type: "string",
      required: false,
    },
    {
      name: "name",
      description: "The name of the directory",
      type: "string",
      required: true,
    },
    {
      name: "size",
      description: "The size of the directory",
      type: "number",
      required: true,
    },
    {
      name: "createdAt",
      description: "The creation date of the directory",
      type: "Date",
      required: true,
    },
    {
      name: "modifiedAt",
      description: "The modification date of the directory",
      type: "Date",
      required: true,
    },
    {
      name: "type",
      description: "The type of the directory",
      type: "string",
      required: true,
    },
    {
      name: "src",
      description: "The source of the directory",
      type: "string",
      required: true,
    },
    {
      name: "directory",
      description: "The sub-directory of the directory",
      type: "Directory",
      required: false,
    },
  ];

  onMount(() => {
    Prism.highlightAll();
  });

  const directory = {
    name: "My Files",
    id: "root",
    size: 10001,
    createdAt: new Date(),
    type: "folder",
    src: "",
    files: [
      { name: "code.xls", size: 1000, id: createUniqueId() },
      {
        name: "wedding.jpg",
        size: 90,
        id: createUniqueId(),
        src: "https://eadexhor.sirv.com/incmix/pexels-photo-3014937.jpeg",
        type: "image",
      },
      {
        id: createUniqueId(),
        name: "docs",
        size: 10020,
        files: [
          { name: "code", size: 1000, id: createUniqueId() },
          {
            id: createUniqueId(),
            name: "images",
            size: 10020,
            files: [
              {
                name: "wedding.jpg",
                size: 90,
                id: createUniqueId(),
                src: "https://eadexhor.sirv.com/incmix/pexels-photo-3014937.jpeg",
                type: "image",
              },
              {
                id: createUniqueId(),
                name: "party",
                size: 900,
                files: [
                  { name: "party.jpg", size: 90, id: createUniqueId() },
                  { name: "films", size: 677, id: createUniqueId() },
                ],
              },
            ],
          },
        ],
      },
      {
        id: createUniqueId(),
        name: "images",
        size: 10020,
        files: [
          { name: "wedding.jpg", size: 90, id: createUniqueId() },
          {
            id: createUniqueId(),
            name: "party",
            size: 900,
            files: [
              { name: "party.jpg", size: 90, id: createUniqueId() },
              { name: "films", size: 677, id: createUniqueId() },
              {
                id: createUniqueId(),
                name: "docs",
                size: 10020,
                files: [
                  { name: "code", size: 1000, id: createUniqueId() },
                  {
                    id: createUniqueId(),
                    name: "images",
                    size: 10020,
                    files: [
                      { name: "wedding.jpg", size: 90, id: createUniqueId() },
                      {
                        id: createUniqueId(),
                        name: "party",
                        size: 900,
                        files: [
                          { name: "party.jpg", size: 90, id: createUniqueId() },
                          { name: "films", size: 677, id: createUniqueId() },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: createUniqueId(),
                name: "images",
                size: 10020,
                files: [
                  { name: "wedding.jpg", size: 90, id: createUniqueId() },
                  {
                    id: createUniqueId(),
                    name: "party",
                    size: 900,
                    files: [
                      { name: "party.jpg", size: 90, id: createUniqueId() },
                      { name: "films", size: 677, id: createUniqueId() },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

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
        <FileViewer
          id={"root"}
          usedSpace={20971520}
          totalSpace={62914560}
          directory={directory}
        />
      </Preview>
      <SectionTitle id="props">Props</SectionTitle>
      <SectionSubtitle id="table-props">File props</SectionSubtitle>
      <PropsTable items={FileProps} mb="$10" />
      <SectionSubtitle id="table-props">Directory props</SectionSubtitle>
      <PropsTable items={DirectoryProps} mb="$10" />
    </PageLayout>
  );
}
