import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { DEFAULT_EXTENSIONS as babel_extensions } from "@babel/core";

module.exports = {
  input: "src/index.ts",
  output: {
    name: "VueVtable",
    globals: {
      vue: "Vue",
    },
  },
  external: ["vue"],
  plugins: [
    resolve(),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      extensions: [...babel_extensions, ".ts", ".tsx"],
      exclude: ["node_modules/**"],
    }),
  ],
};
