// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry point file
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel for JavaScript and JSX files
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing without specifying file extensions
  },
};
