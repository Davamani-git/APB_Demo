(function() {
  'use strict';

  angular
    .module('sharedServices')
    .service('NotificationService', NotificationService);

  NotificationService.$inject = ['$http'];

  function NotificationService($http) {
    var service = {
      sendRegistrationConfirmation: sendRegistrationConfirmation
    };

    return service;

    function sendRegistrationConfirmation(userId) {
      return $http.post('/api/notifications/registration-confirmation', { userId: userId })
        .then(function(response) {
          return response.data;
        });
    }
  }
})();
