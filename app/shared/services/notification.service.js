'use strict';

angular
  .module('userModule')
  .service('NotificationService', NotificationService);

NotificationService.$inject = ['$http'];

function NotificationService($http) {
  var apiBase = '/api/notifications';

  this.sendEmailConfirmation = function sendEmailConfirmation(userId) {
    return $http.post(apiBase + '/email-confirmation', { userId: userId });
  };
}
