module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Reanimated/Worklets must be listed last or in correct sequence
      "react-native-worklets/plugin",
      "react-native-reanimated/plugin",
    ],
  };
};
