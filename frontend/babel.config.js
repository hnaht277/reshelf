module.exports = function (api) {
  api.cache(true);
  const nativewind = require("nativewind/babel").default;

  return {
    presets: ["babel-preset-expo", nativewind],
    plugins: ["react-native-reanimated/plugin"]
  };
};
