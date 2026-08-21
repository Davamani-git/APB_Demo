'use strict';

angular.module('sharedServices')
  .service('NotificationService', ['$http', function($http) {
    var API_BASE = '/api/notifications';

    this.sendEmailConfirmation = function(userId) {
      return $http.post(API_BASE + '/email-confirmation', { userId: userId })
        .then(function(response) {
          return response.data;
        });
    };
  }]);
