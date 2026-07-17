(function () {
  'use strict';

  angular
    .module('apb.shared')
    .factory('ErrorModel', ErrorModelFactory);

  function ErrorModelFactory() {
    function ErrorModel(code, message, httpStatus, details) {
      this.code = code || 'UNKNOWN_ERROR';
      this.message = message || 'An unexpected error occurred.';
      this.httpStatus = httpStatus || 0;
      this.details = details || null;
    }

    return ErrorModel;
  }
})();
