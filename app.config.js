export default ({ config }) => {
    config.version = '48.0.18';
    config.plugins = [
      // @nozbe/watermelonDB simdjson plugin
      './plugins/withSimdjson',
    ];
    return config;
  };