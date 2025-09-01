module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'react' }]
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.json', '.tsx', '.ts'],
          alias: {
            '@': './',
          },
        },
      ],
    ],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
          'transform-remove-console'
        ]
      }
    }
  };
};