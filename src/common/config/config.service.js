angular.module('davms.summary').service('ConfigService', ConfigService);

ConfigService.$inject = [];
function ConfigService() {
  const env = window.__DAVMS_ENV__ || {};

  this.getApiBaseUrl = function() {
    return env.API_BASE_URL || '/api';
  };

  this.getFeatureFlag = function(key) {
    return !!(env.FEATURE_FLAGS && env.FEATURE_FLAGS[key]);
  };

  this.getMaxHistoryMonths = function() {
    return env.MAX_HISTORY_MONTHS || 12;
  };

  this.loadEnvironmentConfig = function() {
    // Environment config is already loaded via script tag
  };

  this.useMockData = function() {
    return env.USE_MOCK_DATA === true;
  };
}