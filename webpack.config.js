var webpack = require("webpack")
var path    = require("path")

module.exports = {

    watch: true,

    target: 'electron',

    entry: './app/src/main.js',

    output: {
        path: __dirname + '/app/build',
        publicPath: 'build/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '/app/src/client'),
            //'vue$': 'vue/dist/vue.esm.js',
            'vue$': 'vue/dist/vue.common.js'
        },
        extensions: ['.js', '.vue', '.json', '.css']
    }
}
