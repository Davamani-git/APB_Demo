(function() {
    'use strict';
    angular.module('app')
        .factory('AuthFactory', ['$window', '$http', function($window, $http) {
            const factory = {};
            factory.getAuthToken = function() {
                return $window.localStorage.getItem('authToken') || 'mock-jwt-token-12345';
            };
            factory.setAuthToken = function(token) {
                $window.localStorage.setItem('authToken', token);
            };
            factory.clearAuthToken = function() {
                $window.localStorage.removeItem('authToken');
            };
            factory.isAuthenticated = function() {
                return !!factory.getAuthToken();
            };
            return factory;
        }]);
})();