import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config: webpack.Configuration = {
  mode: "development",
  entry: "./src/main.tsx",
  devtool: "#source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Phoenix Test"
    })
  ],
  optimization: {
    usedExports: true
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          getCustomTransformers(program: any) {
            return {
              afterDeclarations: []
            };
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  }
};

export default config;
