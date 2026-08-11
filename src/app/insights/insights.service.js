(function() {
  'use strict';
  angular.module('app.insights')
    .service('InsightsService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      this.getInsights = function() {
        return $http.get(API_CONFIG.baseUrl + '/insights')
          .then(function(response) {
            return response.data;
          });
      };
      this.getExplanation = function(insightId) {
        return $http.get(API_CONFIG.baseUrl + '/insights/' + insightId + '/explain')
          .then(function(response) {
            return response.data;
          });
      };
      this.postFeedback = function(insightId, feedback) {
        return $http.post(API_CONFIG.baseUrl + '/insights/' + insightId + '/feedback', {
          feedback: feedback
        }).then(function(response) {
          return response.data;
        });
      };
    }]);
})();