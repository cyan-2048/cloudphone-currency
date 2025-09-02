import { pluginHtmlMinifierTerser } from "rsbuild-plugin-html-minifier-terser";
import { defineConfig } from "@rsbuild/core";

const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  output: {
    assetPrefix: BASE_PATH,
  },
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
