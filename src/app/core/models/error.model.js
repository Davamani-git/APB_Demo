(function () {
  'use strict';

  ErrorModelFactory.$inject = [];

  angular
    .module('app')
    .factory('ErrorModel', ErrorModelFactory);

  function ErrorModelFactory() {
    function ErrorModel(props) {
      var p = props || {};

      this.code = p.code || '';
      this.message = p.message || '';
      this.httpStatus = typeof p.httpStatus === 'number' ? p.httpStatus : 0;
      this.type = p.type || 'unknown';
      this.retryable = typeof p.retryable === 'boolean' ? p.retryable : false;
      this.correlationId = p.correlationId || '';
    }

    return ErrorModel;
  }
})();
