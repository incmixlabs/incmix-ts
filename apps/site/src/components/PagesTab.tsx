import { Heading, Button, incmix } from "@incmix/ui";
import { generateId } from "@incmix/utils";
import { Component, For } from "solid-js";
import API from "~/lib/API";

import { Page } from "~/lib/Page";
import { Site } from "~/lib/Site";
import { PageWrapperInformation } from "~/temporaryUiBuilderComponents/PageWrapper";

import NewPageForm from "./NewPageForm";

const PagesTab: Component<{
  mutableActivePage: { data: Page | null };
  site: Site;
  pages: Page[];
  mutatePagesToIncludePage: (page: { route: string; title: string }) => void;
}> = (props) => {
  return (
    <>
      <Heading size="2xl" marginBottom="$4">
        Pages
      </Heading>

      <div class="flex flex-col">
        <incmix.nav
          display="flex"
          flexDirection="column"
          padding="0"
          css={{
            [`& > ${Button}`]: {
              textAlign: "left",
              padding: "$2",
              transitionDuration: "200",
              width: "100%",
              borderRadius: "0",
              bg: "transparent",
              color: "$neutral12",
              justifyContent: "start",

              "&:hover": {
                backgroundColor: "$neutral8",
              },

              "&:disabled": {
                backgroundColor: "$neutral8",
                color: "$neutral12",
              },
            },
          }}
        >
          <For each={props.pages}>
            {(page) => (
              <Button
                onClick={() => {
                  // TODO: Add funcionality that warns users to save changes before switching pages if necessary.
                  props.mutableActivePage.data = page;
                }}
                disabled={page.id === props.mutableActivePage.data?.id}
              >
                {page.route}
              </Button>
            )}
          </For>
        </incmix.nav>
        <NewPageForm
          onSubmit={async (p) => {
            const newPageData: Omit<Page, "id"> = {
              ...p,
              site_id: props.site.id,
              pageData: {
                componentId: PageWrapperInformation.id,
                children: [],
                id: generateId(),
                props: {},
              },
              rootDatasources: [],
            };
            const newPage = await API.pages.create(newPageData);

            props.mutatePagesToIncludePage(newPage);
          }}
        />
      </div>
    </>
  );
};

export default PagesTab;
