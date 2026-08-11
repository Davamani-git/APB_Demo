(function() {
  'use strict';
  angular.module('financeApp')
    .factory('AuthService', ['$http', '$window', '$q', 'API_CONFIG', function($http, $window, $q, API_CONFIG) {
      var service = {
        login: login,
        logout: logout,
        getToken: getToken,
        setToken: setToken,
        isAuthenticated: isAuthenticated,
        refreshToken: refreshToken
      };
      return service;
      function login(credentials) {
        return $http.post(API_CONFIG.baseUrl + '/auth/login', credentials)
          .then(function(response) {
            if (response.data.token) {
              setToken(response.data.token);
            }
            return response.data;
          });
      }
      function logout() {
        $window.localStorage.removeItem('authToken');
        $window.location.href = '#/login';
      }
      function getToken() {
        return $window.localStorage.getItem('authToken');
      }
      function setToken(token) {
        $window.localStorage.setItem('authToken', token);
      }
      function isAuthenticated() {
        return !!getToken();
      }
      function refreshToken() {
        var token = getToken();
        if (!token) {
          return $q.reject('No token');
        }
        return $http.post(API_CONFIG.baseUrl + '/auth/refresh', {token: token})
          .then(function(response) {
            if (response.data.token) {
              setToken(response.data.token);
            }
            return response.data;
          });
      }
    }]);
})();