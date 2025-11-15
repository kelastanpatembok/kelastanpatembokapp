const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(mergeConfig(config, {
  resolver: {
    sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
  },
}), { input: './src/globals.css' });

