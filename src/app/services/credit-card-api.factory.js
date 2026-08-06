(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardAPIFactory', ['$http', '$q', function($http, $q) {
      var apiBase = '/api';
      return {
        fetchCreditCardData: function() {
          return $http.get(apiBase + '/creditcards')
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getCreditCards: function() {
          return this.fetchCreditCardData();
        }
      };
    }]);
})();