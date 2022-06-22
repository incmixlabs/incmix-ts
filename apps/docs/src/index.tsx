import "./index.css";

import { NotificationsProvider, ThemeConfig, ThemeProvider } from "@incmix/ui";
import Prism from "prismjs";
import { Router } from "solid-app-router";
import { render } from "solid-js/web";

import App from "./App";

const config: ThemeConfig = {
  initialColorMode: "system",
  components: {
    Menu: {
      baseStyle: {
        content: {
          zIndex: 10,
        },
      },
    },
    Popover: {
      baseStyle: {
        content: {
          zIndex: 10,
        },
      },
    },
    Tooltip: {
      baseStyle: {
        zIndex: 10,
      },
    },
  },
};

render(
  () => (
    <Router>
      <ThemeProvider config={config}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </ThemeProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);

setTimeout(() => {
  Prism.highlightAll();
}, 0);
