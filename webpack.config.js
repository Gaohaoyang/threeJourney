const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const generateHtmlPlugins = () => glob.sync('./src/**/index.html').map(
  (item) => new HtmlWebpackPlugin({
    template: item,
    filename: `./${item.replace('/src', '').replace('./', '')}`,
    inject: false,
    templateParameters: {
      path: `.${item.replace('/src', '').replace('.html', '.js')}`,
    },
  }),
)

module.exports = {
  entry: glob.sync('./src/**/index.ts').reduce((acc, filePath) => {
    const entry = filePath.replace('/index.ts', '').replace('/src', '')
    acc[entry] = filePath
    return acc
  }, {}),
  output: {
    filename: './[name]/index.js',
    path: path.resolve(__dirname, 'demo'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', 'mjs'],
  },
  plugins: [
    ...generateHtmlPlugins(),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/assets/*',
          to: 'assets/[name][ext]',
        },
      ],
    }),
  ],
  mode: 'development',
  devServer: {
    contentBase: './demo',
    open: true,
    host: '0.0.0.0',
  },
}
