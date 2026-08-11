(function() {
  'use strict';
  angular.module('app.insights')
    .factory('RecommendationService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      var service = {
        getRecommendations: getRecommendations
      };
      return service;
      function getRecommendations() {
        return $http.get(API_CONFIG.baseUrl + '/insights/recommendations')
          .then(function(response) {
            return response.data;
          });
      }
    }]);
})();