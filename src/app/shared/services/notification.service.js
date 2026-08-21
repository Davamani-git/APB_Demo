'use strict';

angular.module('shared.services.notification', [])
  .service('NotificationService', ["$http", function($http) {
    var baseUrl = '/api/notifications';

    this.sendEmailConfirmation = function(userId) {
      return $http.post(baseUrl + '/email-confirmation', { userId: userId })
        .then(function(response) {
          return response.data;
        });
    };
  }]);
