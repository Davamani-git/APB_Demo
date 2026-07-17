(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .factory('RecurringPatternModel', RecurringPatternModelFactory);

  function RecurringPatternModelFactory() {
    class RecurringPatternModel {
      constructor(dto) {
        dto = dto || {};
        this.id = dto.id || '';
        this.merchantName = dto.merchantName || '';
        this.estimatedDueDate = dto.estimatedDueDate ? new Date(dto.estimatedDueDate) : null;
        this.averageAmount = typeof dto.averageAmount === 'number' ? dto.averageAmount : 0;
        this.frequency = dto.frequency || 'MONTHLY';
      }
    }

    return RecurringPatternModel;
  }
})();
