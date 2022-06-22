import { incmix, Button } from "@incmix/ui";

export type ViewSidebarViewId =
  | "pages"
  | "data"
  | "components"
  | "settings"
  | "props"
  | "tree";

export const ViewSidebar = (props: {
  activeTab: ViewSidebarViewId;
  setActiveTab: (n: ViewSidebarViewId) => void;
  pageSelected: boolean;
  componentSelected: boolean;
}) => {
  return (
    <incmix.aside bg="$neutral4">
      <incmix.nav
        display="flex"
        flexDirection="column"
        padding="0"
        width="$40"
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

            "&[data-selected='true']": {
              backgroundColor: "$neutral8",
              color: "$neutral12",
            },

            "&:disabled": {
              backgroundColor: "$neutral7",
              color: "$neutral9",
            },
          },
        }}
      >
        <Button
          data-selected={props.activeTab === "pages"}
          onClick={() => props.setActiveTab("pages")}
        >
          Pages
        </Button>
        <Button
          data-selected={props.activeTab === "data"}
          disabled={!props.pageSelected}
          onClick={() => props.setActiveTab("data")}
        >
          Data Sources
        </Button>
        <Button
          data-selected={props.activeTab === "components"}
          disabled={!props.pageSelected}
          onClick={() => props.setActiveTab("components")}
        >
          Components
        </Button>
        <Button
          data-selected={props.activeTab === "tree"}
          disabled={!props.pageSelected}
          onClick={() => props.setActiveTab("tree")}
        >
          Tree
        </Button>
        <Button
          data-selected={props.activeTab === "props"}
          disabled={!props.componentSelected}
          onClick={() => props.setActiveTab("props")}
        >
          Props
        </Button>

        <Button
          data-selected={props.activeTab === "settings"}
          onClick={() => props.setActiveTab("settings")}
        >
          Settings
        </Button>
      </incmix.nav>
    </incmix.aside>
  );
};
