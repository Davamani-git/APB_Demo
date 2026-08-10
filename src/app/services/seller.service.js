(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .factory('SellerService', ['$http', '$q', function($http, $q) {
      var apiBase = '/api/sellers';
      return {
        login: function(credentials) {
          return $http.post(apiBase + '/login', credentials)
            .then(function(response) {
              if (response.data.authToken) {
                sessionStorage.setItem('authToken', response.data.authToken);
                sessionStorage.setItem('sellerId', response.data.sellerId);
              }
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        register: function(sellerData) {
          return $http.post(apiBase + '/register', sellerData)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getProfile: function(sellerId) {
          return $http.get(apiBase + '/' + sellerId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        updateProfile: function(sellerId, profileData) {
          return $http.put(apiBase + '/' + sellerId, profileData)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        logout: function() {
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('sellerId');
          return $q.resolve();
        }
      };
    }]);
})();