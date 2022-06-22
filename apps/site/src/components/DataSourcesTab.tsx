import { generateId, RootDatasource } from "@incmix/utils";
import { Component, createSignal, For } from "solid-js";
import { Input, Button, Heading } from "@incmix/ui";
import { MutableActivePage } from "~/lib/MutableActivePage";

const DataSourcesTab: Component<{
  mutableActivePage: MutableActivePage;
}> = (props) => {
  const [newRootDataSourceUrl, setNewRootDataSourceUrl] = createSignal("");

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const newRootDatasouce: RootDatasource = {
            id: generateId(),
            url: newRootDataSourceUrl(),
            method: "GET",
            type: "api",
            name: "THE NEW API " + newRootDataSourceUrl(),
          };

          props.mutableActivePage.data.rootDatasources = [
            ...props.mutableActivePage.data.rootDatasources,
            newRootDatasouce,
          ];

          setNewRootDataSourceUrl(null);
        }}
      >
        <Heading marginBottom="$4">Data Sources</Heading>
        <Input
          value={newRootDataSourceUrl()}
          onInput={(e) => {
            setNewRootDataSourceUrl(e.currentTarget.value);
          }}
          marginBottom="$4"
        />

        <Button type="submit">Add</Button>
      </form>

      <div class="flex flex-col">
        <For each={props.mutableActivePage.data.rootDatasources}>
          {(rootDatasource) => (
            <div>
              <p>{rootDatasource.url}</p>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default DataSourcesTab;
