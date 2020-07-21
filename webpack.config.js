const webpack = require('webpack');
const mode = process.env.NODE_ENV || 'development';

module.exports = {
    entry: './index.js',
    devtool: 'source-map',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ],
                        plugins: [ '@babel/plugin-transform-runtime', '@babel/plugin-transform-modules-commonjs' ],
                    }
                }
            }
        ]
    },
    resolve: {},
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            ENVIRONMENT: JSON.stringify(mode)
        })
    ],
    mode
};