module.exports = {
  mode: 'production',
  output: {
    library: 'AwesomeValidator',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [

      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}