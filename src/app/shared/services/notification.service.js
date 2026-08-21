'use strict';

angular
  .module('sharedServices')
  .service('NotificationService', NotificationService);

NotificationService.$inject = ['$http'];

function NotificationService($http) {
  const apiBase = '/api/notifications';

  this.sendEmailConfirmation = function sendEmailConfirmation(userId) {
    return $http.post(apiBase + '/email-confirmation', { userId: userId })
      .then(response => response.data);
  };
}
