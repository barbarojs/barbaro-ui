import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import stylelint from 'stylelint';
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import path from 'path';
import parseArgs from 'minimist';

const cliArgs = parseArgs(process.argv.slice(2));
const ENV = process.env.NODE_ENV || 'development';
const CSS_MAPS = ENV == 'development' && !cliArgs['no-sm'];

module.exports = {
	context: path.resolve(__dirname, 'src'),

	entry: [
		'./index.js'
	],

	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		compress: false,
		filename: 'bundle.js',
		chunkFilename: 'bundle-[id].js'
	},

	resolve: {
		root: [
			path.resolve('./src')
		],
		extensions: [
			'', '.jsx', '.js', '.json', '.scss'
		],
		modulesDirectories: [
			path.resolve(__dirname, 'node_modules'),
			'node_modules'
		],
		alias: {
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	module: {
		preLoaders: [{
			test: /\.jsx?$/,
			exclude: path.resolve(__dirname, 'src'),
			loader: 'source-map'
		}],
		loaders: [{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.(scss|css)$/,
				loaders: [
					['css-loader?modules',
						'localIdentName=[local]-[hash:base64:5]',
						'importLoaders=1',
						`sourceMap=${CSS_MAPS}`
					].join('&'),
					`sass-loader?sourceMap=${CSS_MAPS}`,
					'postcss-loader?parser=postcss-scss'
				]
			},
			{
				test: /\.json$/,
				loader: 'json'
			}, {
				test: /\.(xml|html|txt|md)$/,
				loader: 'raw'
			}, {
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				loader: ENV === 'production' ?
					'file?name=[path][name]_[hash:base64:5].[ext]' : 'url'
			}
		]
	},

	postcss: () => [
		stylelint,
		autoprefixer({
			browsers: 'last 2 versions'
		})
	],

	plugins: ([
			new webpack.NoErrorsPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(ENV)
			})
		])
		.concat(ENV === 'production' ? [
			// strip out babel-helper invariant checks
			new ReplacePlugin([{
				// this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
				partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
				replacement: () => 'return;('
			}]),
			new webpack.optimize.UglifyJsPlugin({
				minimize: false,
				compress: false,
				mangle: false
			})
		] : []),
	stats: {
		colors: true
	},
	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: ENV === 'production' ?
		'' : 'cheap-module-eval-source-map',

	devServer: {
		port: process.env.PORT || 8080,
		host: 'localhost',
		colors: true,
		publicPath: '/',
		contentBase: './build',
		compress: true,
		historyApiFallback: true,
		open: true,
		proxy: {
			// OPTIONAL: proxy configuration:
			// '/optional-prefix/**': { // path pattern to rewrite
			//   target: 'http://target-host.com',
			//   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
			// }
		}
	}
};