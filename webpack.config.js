const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    results: "./src/modules/results.js",
  },
  devServer: {
    static: "./dist",
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "results.html",
      template: "./src/results.html",
      chunks: ["results"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/images", // output folder for images
            },
          },
        ],
      },
    ],
  },
};
