import {
  Button,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  incmix,
  Heading,
} from "@incmix/ui";
import { createResource, For } from "solid-js";

import API from "~/lib/API";

export default function Index() {
  const [sites, _] = createResource(() => API.sites.index());

  return (
    <div>
      <Heading padding="$6" size="4xl">Sites</Heading>
      <Table>
        <TableCaption>Sites</TableCaption>

        <Thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
        </Thead>

        <Tbody>
          <For each={sites() ?? []}>
            {(site) => (
              <Tr>
                <Td>
                  <incmix.a color="$primary10" href={`/sites/${site.id}`}>
                    {site.name}
                  </incmix.a>
                </Td>
              </Tr>
            )}
          </For>
        </Tbody>
      </Table>

      <Button as="a" href="/sites/create" margin="$4">
        Create
      </Button>
    </div>
  );
}
