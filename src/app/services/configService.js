angular.module('apbApp').service('configService', function() {
  var config = {
    apiBaseUrl: '/api',
    ssoAuthorizeUrl: 'https://sso.example.com/oauth2/authorize',
    ssoClientId: 'apb-dashboard',
    ssoRedirectUri: window.location.origin + '/#!/login',
    freshnessThresholdHours: 24,
    freshnessPollMs: 300000,
    alertPollMs: 60000
  };
  this.get = function(key) { return key ? config[key] : config; };
});
