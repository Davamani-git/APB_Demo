(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .service('AuthService', AuthService);

  AuthService.$inject = ['$window'];

  function AuthService($window) {
    const SESSION_KEY = 'rbApp.userSession';
    let currentSession = null;

    this.isAuthenticated = function () {
      const session = getSession();
      return !!session && session.token && new Date(session.expiresAt) > new Date();
    };

    this.getToken = function () {
      const session = getSession();
      return session ? session.token : null;
    };

    this.setSession = function (sessionData) {
      currentSession = sessionData;
      $window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    };

    this.clearSession = function () {
      currentSession = null;
      $window.sessionStorage.removeItem(SESSION_KEY);
    };

    this.getCurrentUser = function () {
      return getSession();
    };

    function getSession() {
      if (currentSession) {
        return currentSession;
      }
      const stored = $window.sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          currentSession = JSON.parse(stored);
        } catch (e) {
          currentSession = null;
        }
      }
      return currentSession;
    }
  }
})();
