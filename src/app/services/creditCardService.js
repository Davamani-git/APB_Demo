(function() {
  'use strict';
  angular.module('creditCardApp').factory('creditCardService', ['$http', '$q', function($http, $q) {
    const baseUrl = '/api/cards';
    return {
      getUserCards: function() {
        return $http.get(baseUrl)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject('Failed to fetch credit cards.');
          });
      }
    };
  }]);
})();