(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('ErrorModel', ErrorModelFactory);

  ErrorModelFactory.$inject = [];

  function ErrorModelFactory() {
    function ErrorModel(data) {
      this.code = data && data.code || 'UNKNOWN';
      this.message = data && data.message || '';
      this.details = data && data.details || '';
      this.correlationId = data && data.correlationId || '';
    }

    return ErrorModel;
  }
})();
