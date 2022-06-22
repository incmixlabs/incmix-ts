import { Button, Heading, Input, incmix } from "@incmix/ui";
import { Component, createEffect, createSignal } from "solid-js";

const NewPageForm: Component<{
  onSubmit: (data: { route: string; title: string }) => void;
}> = (props) => {
  const [route, setRoute] = createSignal("");
  const [title, setTitle] = createSignal("");

  return (
    <incmix.form
      display="flex"
      flexDirection="column"
      gap="$4"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit({ route: route(), title: title() });
        setRoute("");
        setTitle("");
      }}
    >
      <Heading level="2">Create a Page</Heading>
      <Input
        value={title()}
        onInput={(e) => {
          setTitle(e.currentTarget.value);
        }}
        placeholder="Title"
      />
      <Input
        value={route()}
        onInput={(e) => {
          setRoute(e.currentTarget.value);
        }}
        placeholder="Route"
      />

      <Button type="submit">Create</Button>
    </incmix.form>
  );
};

export default NewPageForm;
