angular.module('apbApp').service('ssoAuthService', ['$http', '$window', '$q', 'configService', function($http, $window, $q, configService) {
  var self = this;
  self.redirectToProvider = function() {
    var url = configService.get('ssoAuthorizeUrl') +
      '?response_type=code&client_id=' + encodeURIComponent(configService.get('ssoClientId')) +
      '&redirect_uri=' + encodeURIComponent(configService.get('ssoRedirectUri')) +
      '&scope=openid%20profile%20email';
    $window.location.href = url;
  };
  self.exchangeCode = function(code) {
    return $http.post(configService.get('apiBaseUrl') + '/auth/sso/token', { code: code }).then(function(res) {
      return res.data.token;
    });
  };
  self.handleCallback = function() {
    var q = $window.location.search;
    var m = q.match(/[?&]code=([^&]+)/);
    if (m) { return self.exchangeCode(decodeURIComponent(m[1])); }
    return $q.reject('no_code');
  };
}]);
