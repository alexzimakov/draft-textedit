module.exports = {
  compilerConfig: {
    transforms: { dangerousTaggedTemplateString: true },
  },
  components: 'src/components/**/[A-Z]*.js',
  require: [],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: ['babel-loader'],
        },
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader'],
        },
      ],
    },
  },
};
