import { Button, Heading, Box, Icon } from "@incmix/ui";
import { useParams } from "solid-app-router";
import { createResource, Show } from "solid-js";

import API from "~/lib/API";

export default function AppsName(props) {
  const params = useParams();

  const [site, _] = createResource(
    async () => await API.sites.get({ id: params.id })
  );

  return (
    <Show when={site()} fallback={<p>LOADING...</p>}>
      <Box
        display="flex"
        flexDirection="column"
        gap="$4"
        maxWidth="$prose"
        marginLeft="auto"
        marginRight="auto"
        marginTop="$4"
      >
        <Heading>This is the index page for {site().name ?? site().id}</Heading>

        <Button href={`/sites/editor/${site()?.id}`} as="a">
          Editor
        </Button>

        <Box color="$primary8" as="a" class="text-blue-800" href={`/sites`}>
          <Icon>
            <path
              fill="currentColor"
              d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
            />
          </Icon>{" "}
          Sites
        </Box>
      </Box>
    </Show>
  );
}
