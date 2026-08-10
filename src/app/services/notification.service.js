(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('notificationService', ['$rootScope', function($rootScope) {
      var self = this;
      self.success = function(message, title) {
        if (typeof toastr !== 'undefined') {
          toastr.success(message, title || 'Success');
        }
        $rootScope.$broadcast('notification:success', {message: message, title: title});
      };
      self.error = function(message, title) {
        if (typeof toastr !== 'undefined') {
          toastr.error(message, title || 'Error');
        }
        $rootScope.$broadcast('notification:error', {message: message, title: title});
      };
      self.warning = function(message, title) {
        if (typeof toastr !== 'undefined') {
          toastr.warning(message, title || 'Warning');
        }
        $rootScope.$broadcast('notification:warning', {message: message, title: title});
      };
      self.info = function(message, title) {
        if (typeof toastr !== 'undefined') {
          toastr.info(message, title || 'Info');
        }
        $rootScope.$broadcast('notification:info', {message: message, title: title});
      };
    }]);
})();