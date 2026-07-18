(function () {
  'use strict';

  function MonthContextModel(data) {
    data = data || {};
    this.requestedMonth = data.requestedMonth || '';
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || '';
    this.type = data.type || 'BILLING_CYCLE';
  }

  angular.module('davmsApp')
    .factory('MonthContextModel', function () {
      return MonthContextModel;
    });
})();
