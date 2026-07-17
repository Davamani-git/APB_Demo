'use strict';

(function () {
  class SecurityContextService {
    constructor($window, $log) {
      'ngInject';
      this.$window = $window;
      this.$log = $log;
      this._user = null;
    }

    isAuthenticated() {
      return !!this.getUser();
    }

    getUser() {
      if (!this._user) {
        var raw = this.$window.localStorage.getItem('davBankingUserContext');
        if (raw) {
          try {
            this._user = JSON.parse(raw);
          } catch (e) {
            this.$log.error('Failed to parse user context', e);
          }
        }
      }
      return this._user;
    }

    hasRole(role) {
      var user = this.getUser();
      return !!(user && user.roles && user.roles.indexOf(role) !== -1);
    }

    hasAttribute(attr, value) {
      var user = this.getUser();
      return !!(user && user.attributes && user.attributes[attr] === value);
    }
  }

  angular
    .module('davBanking.insightDelivery')
    .service('SecurityContextService', SecurityContextService);
})();
