// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Expo preset, with NativeWind JSX support
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      // NativeWind v4 Babel preset (must be in presets, NOT plugins)
      'nativewind/babel',
    ],
    // 🔥 IMPORTANT: no plugins at all for now
    // Expo Router works fine without 'expo-router/babel' on SDK 54
  };
};
