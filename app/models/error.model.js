(function () {
  'use strict';

  angular.module('apbDemo')
    .factory('ErrorModel', ErrorModelFactory);

  ErrorModelFactory.$inject = [];

  function ErrorModelFactory() {
    function ErrorModel(data) {
      this.code = data.code || null;
      this.message = data.message || '';
      this.details = data.details || '';
      this.correlationId = data.correlationId || null;
    }

    return ErrorModel;
  }
})();
