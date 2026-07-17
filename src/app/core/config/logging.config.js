(function () {
  'use strict';

  angular.module('app.core')
    .constant('loggingConfig', {
      endpoint: '/client-logs',
      redactFields: ['token', 'Authorization', 'cardNumber']
    });
}());
