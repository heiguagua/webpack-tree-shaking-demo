module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@babel/env'
  ],
  plugins: [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]
}
