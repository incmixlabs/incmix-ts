const importGlobalCssFunction = `import { globalCss } from "@incmix/ui"`;

const usingGlobalCssFunction = `import { globalCss } from "@incmix/ui"

const globalStyles = globalCss({
  '*': { 
    margin: 0, 
    padding: 0 
  },
});

function App() {
  globalStyles();

  return <MyApp />
}`;

export const snippets = {
  importGlobalCssFunction,
  usingGlobalCssFunction,
};
