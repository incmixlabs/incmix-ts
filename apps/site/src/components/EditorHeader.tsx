import { incmix, Button, Icon, Heading, Switch } from "@incmix/ui";
import { createSignal } from "solid-js";
import API from "~/lib/API";
import { MutableActivePage } from "~/lib/MutableActivePage";
import { Site } from "~/lib/Site";

export const EditorHeader = (props: {
  site: Site;
  mutableActivePage: MutableActivePage;
  inEditMode: boolean;
  setInEditMode: (inEditMode: boolean) => void;
}) => {
  const [loading, setLoading] = createSignal(false);
  return (
    <incmix.header
      display="flex"
      alignItems="center"
      gap="$4"
      padding="$4"
      bg="$primary8"
      borderBottomColor="$neutral10"
      borderBottomWidth="$1"
    >
      <Button as="a" href={"/sites/" + props.site?.id}>
        <Icon>
          <path
            fill="currentColor"
            d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
          />
        </Icon>
      </Button>
      <Heading>Editing Site: {props.site?.name}</Heading>

      <Switch
        label="Edit Mode?"
        checked={props.inEditMode}
        onChange={(e) => {
          props.setInEditMode(e.currentTarget.checked);
        }}
      />
      <Button
        loading={loading()}
        marginLeft="auto"
        onClick={async () => {
          setLoading(true);
          await API.sites.update({
            id: props.site.id,
            value: props.site,
          });

          await API.pages.update({
            id: props.mutableActivePage.data?.id,
            value: props.mutableActivePage.data,
          });
          setLoading(false);
        }}
      >
        Save
      </Button>
    </incmix.header>
  );
};
