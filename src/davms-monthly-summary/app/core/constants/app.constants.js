(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .constant('APP_CONSTANTS', {
      DATE_FORMAT_MONTH: 'YYYY-MM',
      ERROR_CODES: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
      },
      PRODUCT_TYPES: {
        CREDIT_CARD: 'CREDIT_CARD'
      }
    });
})();
