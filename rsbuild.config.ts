import { pluginHtmlMinifierTerser } from "rsbuild-plugin-html-minifier-terser";
import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  tools: {
    cssLoader: {
      url: {
        filter: (url) => {
          if (/\/img\//.test(url)) {
            return false;
          }
          return true;
        },
      },
    },
  },

  plugins: [
    pluginHtmlMinifierTerser({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
    }),
  ],

  html: {
    template: "index.html",
  },
});
