module.exports = function (api) {
  return {
    ignore: ['./node_modules'],
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
  }
}
