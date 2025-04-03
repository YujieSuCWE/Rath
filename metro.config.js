const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const {
    wrapWithReanimatedMetroConfig,
  } = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname)

// config.resolver.assetExts.push(
//     'mjs'
//   );  

// config.resolver.alias = {
//   "@": "./"
// };  

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: './global.css' })
);