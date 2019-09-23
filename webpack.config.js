const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
