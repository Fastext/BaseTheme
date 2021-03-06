import webpack from 'webpack';

const sourcePath = './app/src';
const nodeEnv = process.env.NODE_ENV;
const production = nodeEnv === 'production';

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
    }),
    new webpack.EnvironmentPlugin({
        NODE_ENV: nodeEnv,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
        jQuery: 'jQuery',
        jquery: 'jquery',
        $: '$'
    })
];

if (production) {
    plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle:   true,
            comments: false,
            sourceMap: false,
        }),
        new webpack.DefinePlugin({
            __SERVER__:      !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__:    !production,
            'process.env':   {
                BABEL_ENV: JSON.stringify(nodeEnv),
            },
        })
    );
}

const config = {
    cache: true,
    devtool: production ? false : 'eval-source-map',
    entry: {
        app: sourcePath + '/main.js',
        vendor: [
            'starting-blocks/bundle.js',
            'loglevel/dist/loglevel.js',
            'ismobilejs/isMobile.js'
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'build/',
    },
    externals: {
        TweenLite: 'TweenLite',
        TweenMax: 'TweenMax',
        Expo: 'Expo',
        CSSPlugin: 'CSSPlugin',
        jQuery: 'jQuery',
        jquery: 'jQuery',
        $: '$'
    },
    module: {
        rules: [{
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                babelrc: false,
                presets: [
                    ["es2015", {"modules": false}],
                    "stage-0"
                ]
            }
        }],
    },
    resolve: {
        unsafeCache: true,
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules',
            sourcePath
        ]
    },
    plugins
};

export default config;
