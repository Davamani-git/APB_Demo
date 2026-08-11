(function() {
  'use strict';
  angular.module('financeApp')
    .factory('NotificationService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      var service = {
        getPreferences: getPreferences,
        updatePreferences: updatePreferences
      };
      return service;
      function getPreferences() {
        return $http.get(API_CONFIG.baseUrl + '/notifications/preferences')
          .then(function(response) {
            return response.data;
          });
      }
      function updatePreferences(preferences) {
        return $http.put(API_CONFIG.baseUrl + '/notifications/preferences', preferences)
          .then(function(response) {
            return response.data;
          });
      }
    }]);
})();