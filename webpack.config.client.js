const path = require("path");
const webpack = require('webpack');
const CURRENT_WORKING_DIR = process.cwd();

const config = {
    name: "browser",
    mode: "development",
    devtool: "eval-source-map",
    entry: [
        path.join(CURRENT_WORKING_DIR, "client/main.js")
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR, "/dist/"),
        filename: "bundle.js",
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: { presets: ["@babel/preset-react"]}
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png|webp)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        alias: {
            "react-dom": "@hot-loader/react-dom"
        }
    }
}

module.exports = config;