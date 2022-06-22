import {
  Button,
  Input,
  Text,
  FormControl,
  Heading,
  FormLabel,
  Box,
} from "@incmix/ui";
import { useNavigate } from "solid-app-router";
import { createSignal } from "solid-js";

import API from "~/lib/API";

export default function Create(props) {
  const [name, setName] = createSignal("");
  const navigate = useNavigate();

  return (
    <Box
      as="form"
      padding="$4"
      display="flex"
      flexDirection="column"
      gap="$4"
      margin="$4"
      backgroundColor="$neutral4"
      maxWidth="$prose"
      marginLeft="auto"
      marginRight="auto"
      onSubmit={async (e) => {
        e.preventDefault();

        const site = await API.sites.create({ name: name() });
        navigate(`/sites/${site.id}`);
      }}
    >
      <Heading>Create a new site</Heading>

      <FormControl>
        <FormLabel mb="$2" for="$name">
          Name
        </FormLabel>
        <Input
          id="$name"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
      </FormControl>

      <Button type="submit">Add</Button>
    </Box>
  );
}
