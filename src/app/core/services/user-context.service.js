(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .service('UserContextService', UserContextService);

  UserContextService.$inject = [];
  function UserContextService() {
    var service = this;
    service.userProfile = null;
    service.token = null;

    service.setUserProfile = function (profile) {
      service.userProfile = profile;
    };

    service.getUserProfile = function () {
      return service.userProfile;
    };

    service.setToken = function (token) {
      service.token = token;
    };

    service.getToken = function () {
      return service.token;
    };
  }
})();
