const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Editor metadata is never part of the runtime bundle. Excluding it also keeps
// Metro's fallback watcher from spending an inotify watch on this directory.
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : [config.resolver.blockList]),
  /(^|[\\/])\.vscode([\\/]|$)/,
];

module.exports = config;
