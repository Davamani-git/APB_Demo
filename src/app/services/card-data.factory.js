(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardDataFactory', ['$http', '$q', function($http, $q) {
      var apiBase = '/api';
      return {
        fetchCards: function() {
          return $http.get(apiBase + '/creditcards')
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();