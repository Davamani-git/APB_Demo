(function() {
  'use strict';
  angular.module('app.nlquery')
    .service('NLQueryService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      this.submitQuery = function(query) {
        return $http.post(API_CONFIG.baseUrl + '/insights/query', {
          query: query
        }).then(function(response) {
          return response.data;
        });
      };
    }]);
})();