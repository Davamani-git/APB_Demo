'use strict';

angular
  .module('sharedServices')
  .service('AuthService', AuthService);

AuthService.$inject = ['$http', '$window'];

function AuthService($http, $window) {
  const apiBase = '/api/auth';
  const tokenKey = 'auth_token';
  const rolesKey = 'auth_roles';

  this.login = function login(email, password) {
    return $http.post(apiBase + '/login', { email: email, password: password })
      .then(response => {
        const data = response.data || {};
        if (data.token) {
          $window.localStorage.setItem(tokenKey, data.token);
        }
        if (Array.isArray(data.roles)) {
          $window.localStorage.setItem(rolesKey, JSON.stringify(data.roles));
        }
        return data;
      });
  };

  this.getToken = function getToken() {
    return $window.localStorage.getItem(tokenKey);
  };

  this.getRoles = function getRoles() {
    const raw = $window.localStorage.getItem(rolesKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  };
}
