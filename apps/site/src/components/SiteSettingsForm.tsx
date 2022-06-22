import { Component } from "solid-js";
import { Site } from "~/lib/Site";
import { Button, FormControl, FormLabel, Input, Heading } from "@incmix/ui";

const SiteSettingsForm: Component<{
  site: Site;
  setSite: (n: Site) => void;
}> = (props) => {
  return (
    <div>
      <Heading level="2" size="xl" marginBottom="$4">
        Settings
      </Heading>

      <FormControl marginBottom="$4">
        <FormLabel for="siteName">Name</FormLabel>

        <Input
          id="siteName"
          value={props.site.name}
          onInput={(e) =>
            props.setSite({ ...props.site, name: e.currentTarget.value })
          }
        />
      </FormControl>
    </div>
  );
};

export default SiteSettingsForm;
