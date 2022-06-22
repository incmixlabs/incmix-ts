const npmInstall =
  "npm install @incmix/ui @stitches/core solid-transition-group";
const yarnAdd = "yarn add @incmix/ui @stitches/core solid-transition-group";
const pnpmAdd = "pnpm add @incmix/ui @stitches/core solid-transition-group";

const providerSetup = `// 1. import \`ThemeProvider\` component
import { ThemeProvider } from '@incmix/ui'

// 2. Wrap ThemeProvider at the root of your app
function App() {
  return (
    <ThemeProvider>
      <MyApp />
    </ThemeProvider>
  )
}`;

const customizeTheme = `// 1. Import the \`HopeThemeConfig\` type
import { HopeThemeConfig, ThemeProvider } from '@incmix/ui'

// 2. Create a theme config to include custom colors, fonts, etc
const config: HopeThemeConfig = {
  lightTheme: {
    colors: {
      primary9: "salmon"
    }
  }
}

// 3. Pass the \`config\` prop to the \`ThemeProvider\`
function App() {
  return (
    <ThemeProvider config={config}>
      <MyApp />
    </ThemeProvider>
  )
}`;

export const snippets = {
  npmInstall,
  yarnAdd,
  pnpmAdd,
  providerSetup,
  customizeTheme,
};
