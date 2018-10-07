const webpack = require("webpack")
const path    = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {

    watch: true,

    target: 'electron-main',

    entry: './app/src/main.js',

    mode: 'development',

    output: {
        path: __dirname + '/app/build',
        publicPath: 'build/',
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        hotReload: false
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'vue-html-loader'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    query: {
                        name: '[name].[ext]?[hash]'
                    }
                }
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'url-loader?limit=100000'
                }
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '/app/src/'),
            'vue$': 'vue/dist/vue.common.js'
        },
        extensions: ['.js', '.vue', '.json', '.css']
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
