//задайте main.js точкой входа;
//в качестве директории для сборки укажите папку build.
//Помните, что путь должен быть абсолютный. Используйте path.resolve;
//файл сборки (бандл) назовите bundle.js;
//активируйте опцию очистки директории для сборки перед новой сборкой;
//активируйте генерацию source-maps


const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
entry: './src/main.js',
output: {
  filename: 'bundle.[contenthash].js',
  path: path.resolve(__dirname, 'build'),
  clean: true,
},
devtool: 'source-map',
plugins: [
  new HtmlPlugin({
    template: 'public/index.html' ,
  }),
  new CopyPlugin({
    patterns: [
      {
        from: 'public',
        globOptions: {
          ignore: ['**/index.html'],
        },
      },
    ]
  })
],
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presents: ['@babel/preset-env']
        },
      },
    },
  ]
}
};


