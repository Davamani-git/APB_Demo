(function() {
  'use strict';

  function ErrorModel(data) {
    data = data || {};
    this.code = data.code || '';
    this.message = data.message || 'Something went wrong while retrieving your spending information.';
    this.details = data.details || '';
    this.correlationId = data.correlationId || '';
  }

  angular.module('app')
    .factory('ErrorModel', function() {
      return ErrorModel;
    });
})();
