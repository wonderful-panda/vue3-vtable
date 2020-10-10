import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { DEFAULT_EXTENSIONS as babel_extensions } from "@babel/core";

const dev = process.env.DEV === "true";

const plugins = [
  resolve(),
  typescript({
    tsconfig: "example/tsconfig.json",
  }),
  alias({
    entries: [{ find: "vue3-vtable", replacement: "../.." }],
  }),
  replace({
    "process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production"),
  }),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    extensions: [...babel_extensions, ".ts", ".tsx"],
    exclude: ["node_modules/**"],
  }),
];
if (dev) {
  plugins.push(
    serve({
      contentBase: "example",
      port: 8080,
    }),
    livereload()
  );
}

module.exports = {
  input: "example/src/main.ts",
  output: {
    file: "example/dist/bundle.js",
    format: "cjs",
  },
  plugins,
};
