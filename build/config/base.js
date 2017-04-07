import debug from 'debug'
import path from 'path'
import ip from 'ip'

const dbg = debug('Roadiz-front:config:base  ')
dbg.color = debug.colors[2]

const getConfig = () => {
    const config = {
        env: process.env.NODE_ENV || 'development',
        address: ip.address(),
        port: '8090',
        devtool: 'cheap-module-eval-source-map',

        // ----------------------------------
        // Project Structure
        // ----------------------------------
        path_base: path.resolve(__dirname, '..', '..'),
        dir_client: 'app',
        dir_dist: 'static',
        dir_views: 'Resources/views',

        // ----------------------------------
        // Stats
        // ----------------------------------
        stats: {
            chunks: false,
            chunkModules: false,
            colors: true,
            children: false,
            version: false,
            reasons: false
        },

        // ----------------------------------
        // Inputs
        // ----------------------------------
        jsVendors: [
            'starting-blocks/bundle.js',
            'loglevel/dist/loglevel.js',
            'ismobilejs/isMobile.js'
        ],

        // ----------------------------------
        // Outputs
        // ----------------------------------
        assetsNameJs: '[name].js',
        assetsNameImg: '[name].[ext]',
        assetsNameCss: '[name].css',
        assetsNameFont: '[name].[ext]',

        // ----------------------------------
        // SVG Structure
        // ----------------------------------
        svg_paths: 'src-svg/*.svg',
        svg_sprite_name: 'sprite.svg.twig',
        svg_sprite_path: 'svg',

        // ----------------------------------
        // Externals
        // ----------------------------------
        externals: {
            TweenLite: 'TweenLite',
            TweenMax: 'TweenMax',
            Expo: 'Expo',
            CSSPlugin: 'CSSPlugin',
            jQuery: 'jQuery',
            jquery: 'jQuery',
            $: '$'
        }
    }

    config.publicPath = `http://${config.address}:${config.port}/`

// ------------------------------------
// Utilities
// ------------------------------------
    const resolve = path.resolve
    const base = (...args) =>
        Reflect.apply(resolve, null, [config.path_base, ...args])

    config.utils_paths = {
        base: base,
        client: base.bind(null, config.dir_client),
        dist: base.bind(null, config.dir_dist),
        views: base.bind(null, config.dir_views)
    }

    dbg('⚙  Exporting default configuration.')
    return config
}

export default getConfig
