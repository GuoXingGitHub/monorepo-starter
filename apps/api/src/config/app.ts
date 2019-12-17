export default {
  env: process.env.APP_ENV || 'local',
  port: process.env.PORT || '8080',
  rootPath: __dirname,
  name: 'App Name',
  url: process.env.APP_URL || 'http://localhost:8080',

  isGAE() {
    return process.env.APP_ENGINE_ENVIRONMENT === 'appengine';
  },

  isProduction() {
    return process.env.NODE_ENV === 'production';
  },

  isDevelopment() {
    return process.env.NODE_ENV !== 'production';
  },
};
