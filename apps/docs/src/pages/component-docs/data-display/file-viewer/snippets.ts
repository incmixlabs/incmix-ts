const importComponent = `import { 
  DataTable,
  TableColumnGroup,
} from "@incmix/ui";`;

const basicUsage = `
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

<FileViewer
        id={"root"}
        usedSpace={20971520}
        totalSpace={62914560}
        directory={directory}
/>
`;

export const snippets = {
  importComponent,
  basicUsage,
};
