module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // ⬇️ Put any other plugins here first, e.g. react-native-paper or inline-dotenv
        'react-native-reanimated/plugin', // ⬅️ Must always be last
      ],
    };
  };
  