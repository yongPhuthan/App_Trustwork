module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    // 'module:react-native-dotenv'
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ['@babel/plugin-proposal-class-properties'],
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": false,
      "allowUndefined": true
    }]
  ]
};