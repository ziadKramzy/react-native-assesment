const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable Hermes optimizations
config.transformer.hermesParser = true;
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_keys: true,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  compress: {
    reduce_funcs: false,
  },
};

// Add resolver extensions
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable support for async storage
config.resolver.assetExts.push('db');

module.exports = config;