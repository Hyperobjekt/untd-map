const Dotenv = require('dotenv-webpack')

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    extra: {
      plugins: [new Dotenv()],
    },
  },
}
