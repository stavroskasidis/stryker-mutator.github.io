const path = require('path');
const glob = require('glob');
const src = path.resolve(__dirname, 'src');
const md = require('jstransformer')(require('jstransformer-markdown-it'));
module.exports = {
  context: src,
  entry: {
    all: './js/all.js',
    scss: './scss/all.scss',
    pug: glob.sync('./**/*.pug', {
      cwd: src
    })
  },
  output: {
    path: path.resolve(__dirname, 'generated-root'),
    filename: 'js/[name].bundle.js'
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        { loader: 'file-loader', options: { name: 'css/[name].css' } }, // Extract css into seperate file
        'extract-loader',
        'css-loader?-minimize', // translates CSS into CommonJS modules
        'sass-loader' // compiles Sass to CSS, using Node Sass
      ]
    },
    {
      test: /\.pug$/,
      use: [
        { loader: 'file-loader', options: { name: '[path][name].html' } },
        'extract-loader',
        'html-loader',
        {
          loader: 'pug-html-loader', options: {
            root: src,
            data: require('./src/fillViewModel.js'),
            filters: { // Add markdown-it-named-headers as plugin
              'markdown-it': function (text) {
                return md.render(text, {
                  plugins: ['markdown-it-named-headers'],
                  html: true
                }).body;
              }
            }
          }
        }
      ]
    }]
  }
};
