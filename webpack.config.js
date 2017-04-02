const webpack = require( 'webpack' );
const path = require( 'path' );

module.exports = {
	devtool: 'source-map',
    entry: './src/index.js',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
		loaders: [
			{
				test: /\.jsx?/,
				include: path.join(__dirname, 'src'),
				loader: 'babel-loader'
			},
			{
				test: /\.css/,
				loaders: [ 'style-loader', 'css-loader' ]
			},
		]
	}
}