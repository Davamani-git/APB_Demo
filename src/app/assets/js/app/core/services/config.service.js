(function(){
  'use strict';
  angular.module('appmrn25.shared')
    .service('ConfigService', ['ENV', function(ENV){
      var ENV_CONFIG = {
        apiBaseUrl: '/api/v1',
        featureFlags: {
          showMonthlySpendChart: true,
          showStaleDataBanner: true
        }
      };
      this.getApiBaseUrl = function(){
        return ENV_CONFIG.apiBaseUrl + '/dashboard';
      };
      this.getFeatureFlags = function(){
        return ENV_CONFIG.featureFlags;
      };
    }]);
})();
