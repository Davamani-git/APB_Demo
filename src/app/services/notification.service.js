(function() {
  'use strict';
  angular.module('app.shared')
    .service('NotificationService', [function() {
      this.error = function(message) {
        console.error('Error:', message);
        alert(message);
      };
      
      this.success = function(message) {
        console.log('Success:', message);
      };
      
      this.info = function(message) {
        console.info('Info:', message);
      };
    }]);
})();