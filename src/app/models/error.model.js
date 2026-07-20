(function () {
  'use strict';

  angular
    .module('apbDemo')
    .factory('ErrorModel', ErrorModelFactory);

  ErrorModelFactory.$inject = [];
  function ErrorModelFactory() {
    function ErrorModel(data) {
      data = data || {};
      this.code = data.code || '';
      this.message = data.message || '';
      this.details = data.details || '';
      this.correlationId = data.correlationId || '';
    }

    return ErrorModel;
  }
})();
