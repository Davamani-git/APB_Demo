(function () {
  'use strict';

  angular
    .module('userModule')
    .service('NotificationService', NotificationService);

  NotificationService.$inject = ['$http'];

  function NotificationService($http) {
    var API_BASE = '/api/notifications';

    this.sendEmailConfirmation = function (email, userId) {
      return $http.post(API_BASE + '/email-confirmation', {
        email: email,
        userId: userId
      }).then(function (response) {
        return response.data;
      });
    };
  }
})();
