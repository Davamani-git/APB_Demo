(function() {
  'use strict';

  ErrorModel.$inject = [];

  function ErrorModel() {}

  ErrorModel.prototype.fromResponse = function(data, defaultMessage) {
    this.code = data && data.code ? String(data.code) : '';
    this.message = data && data.message ? data.message : (defaultMessage || 'An unexpected error occurred.');
    this.details = data && data.details ? data.details : '';
    this.correlationId = data && data.correlationId ? data.correlationId : '';
    return this;
  };

  angular.module('app')
    .factory('ErrorModel', function() {
      return ErrorModel;
    });
})();
