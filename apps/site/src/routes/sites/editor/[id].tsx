import { incmix, Button, Heading, Icon } from "@incmix/ui";
import {
  createEffect,
  createResource,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import { useParams } from "solid-app-router";
import API from "~/lib/API";
import PagesTab from "~/components/PagesTab";
import { createMutable } from "solid-js/store";
import { Page } from "~/lib/Page";
import { ViewSidebar, ViewSidebarViewId } from "~/components/ViewSidebar";
import SiteSettingsForm from "~/components/SiteSettingsForm";
import DataSourcesTab from "~/components/DataSourcesTab";
import { ComponentsTab } from "~/components/ComponentsTab";
import {
  ButtonInformation,
  Button as ButtonWrapped,
} from "~/temporaryUiBuilderComponents/Button";
import {
  PageWrapper,
  PageWrapperInformation,
} from "~/temporaryUiBuilderComponents/PageWrapper";
import { SiteTreeRenderer } from "~/components/SiteTreeRenderer";
import { TreeTab } from "~/components/TreeTab";
import { Flex, FlexInformation } from "~/temporaryUiBuilderComponents/Flex";
import { PageComponentTree } from "@incmix/utils";
import { PropsTab } from "~/components/PropsTab";
import { EditorHeader } from "~/components/EditorHeader";

export default function Id() {
  const params = useParams();
  const id = () => params.id;

  const [site, setSite] = createResource(
    async () => await API.sites.get({ id: id() })
  );

  const [pages, setPages] = createResource(
    async () =>
      await API.pages.index({
        where: {
          site_id: id(),
        },
      })
  );

  const [activeTab, setActiveTab] = createSignal<ViewSidebarViewId>("pages");

  const mutableActivePage = createMutable<{ data: Page | null }>({
    data: null,
  });

  const mutableActivePageComponentTree = createMutable<{
    data: PageComponentTree | null;
  }>({
    data: null,
  });

  const componentRegistry = {
    [ButtonInformation.id]: ButtonWrapped,
    [PageWrapperInformation.id]: PageWrapper,
    [FlexInformation.id]: Flex,
  };

  const componentInformations = [
    ButtonInformation,
    FlexInformation,
    PageWrapperInformation,
  ];

  const [inEditMode, setInEditMode] = createSignal<boolean>(true);

  createEffect(() => {
    console.log(inEditMode());
  });

  return (
    <incmix.div
      width="$screenW"
      height="$screenH"
      display="flex"
      flexDirection="column"
    >
      <EditorHeader
        mutableActivePage={mutableActivePage}
        site={site()}
        inEditMode={inEditMode()}
        setInEditMode={setInEditMode}
      />

      <incmix.div flexGrow="1" display="flex">
        <ViewSidebar
          activeTab={activeTab()}
          setActiveTab={setActiveTab}
          pageSelected={!!mutableActivePage.data}
          componentSelected={!!mutableActivePageComponentTree.data}
        />
        <incmix.div padding="$4" width="$80" borderRight="1px solid $primary10">
          <Switch
            fallback={
              <Heading textAlign="center">
                This tab hasn't been implemented yet. Thanks for your patience!
              </Heading>
            }
          >
            <Match when={activeTab() === "pages"}>
              <PagesTab
                pages={pages()}
                site={site()}
                mutableActivePage={mutableActivePage}
                mutatePagesToIncludePage={async (p: Page) => {
                  setPages.mutate([...pages(), p]);
                }}
              />
            </Match>

            <Match when={activeTab() === "data"}>
              <DataSourcesTab mutableActivePage={mutableActivePage} />
            </Match>

            <Match when={activeTab() === "components"}>
              <ComponentsTab
                mutableActivePage={mutableActivePage}
                componentInformations={componentInformations}
                componentRegistry={componentRegistry}
              />
            </Match>

            <Match when={activeTab() === "settings"}>
              <SiteSettingsForm
                setSite={async (n) => {
                  setSite.mutate(n);
                }}
                site={site()}
              />
            </Match>

            <Match when={activeTab() === "tree"}>
              <TreeTab
                mutableActivePage={mutableActivePage}
                componentRegistry={componentRegistry}
                mutableActivePageComponentTree={mutableActivePageComponentTree}
              />
            </Match>

            <Match when={activeTab() === "props"}>
              <PropsTab
                mutableActivePageComponentTree={mutableActivePageComponentTree}
                componentInformations={componentInformations}
              />
            </Match>
          </Switch>
        </incmix.div>

        <Show when={mutableActivePage.data}>
          <incmix.div flexGrow="1">
            <SiteTreeRenderer
              inEditMode={inEditMode()}
              componentInformations={componentInformations}
              componentRegistry={componentRegistry}
              pageData={mutableActivePage.data?.pageData}
              mutableActivePageComponentTree={mutableActivePageComponentTree}
            />
          </incmix.div>
        </Show>
      </incmix.div>
    </incmix.div>
  );
}
