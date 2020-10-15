const path = require("path");

module.exports = (env, argv) => ({
  context: __dirname,
  entry: {
    main: "./example/src/main.ts",
  },
  output: {
    path: path.join(__dirname, "./example/dist"),
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [__dirname, "node_modules"],
    alias: {
      "vue3-vtable": argv.mode === "development" ? path.join(__dirname, "src") : __dirname,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  devServer: {
    contentBase: path.join(__dirname, "example"),
    publicPath: "/dist/",
  },
});
