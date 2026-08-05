(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('SecurityService', SecurityService);

  SecurityService.$inject = [];
  function SecurityService() {
    this.sanitizeText = function(text) {
      if (!text) {
        return '';
      }
      var stripped = this.stripHtml(text);
      return stripped;
    };

    this.stripHtml = function(text) {
      return String(text).replace(/<[^>]*>/g, '');
    };

    this.enforceSafeBinding = function(text) {
      return this.sanitizeText(text);
    };

    this.maskSensitive = function(text) {
      return text;
    };
  }
})();
