# Vite plugin for tsr

This is a Vite plugin for generating ts runtime objects from `.tsr` files.

# Usage

Install this package:

```sh
yarn add vite-plugin-tsr

    or

npm install vite-plugin-tsr
```

Open the `vite.config.js` file in your project.

Import the plugin:

```js
import { viteTsrPlugin } from "vite-plugin-tsr";
```

Then,

```js
// vite.config.js

import { defineConfig } from "vite";
import viteTsrPlugin from "vite-plugin-tsr";

export default defineConfig({
  plugins: [viteTsrPlugin()],
});
```
