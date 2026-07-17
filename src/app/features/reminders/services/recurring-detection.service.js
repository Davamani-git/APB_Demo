(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .service('RecurringDetectionService', RecurringDetectionService);

  RecurringDetectionService.$inject = ['ApiGatewayService'];

  function RecurringDetectionService(ApiGatewayService) {
    this.getDetectedBills = function () {
      return ApiGatewayService.get('REMINDERS', '/recurring/detected');
    };
  }
})();
