(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('ValidationService', ValidationService);

  ValidationService.$inject = [];
  function ValidationService() {
    this.validateKpi = function(kpi) {
      var errors = [];
      if (!kpi.id) {
        errors.push({ field: 'id', message: 'KPI id is required' });
      }
      if (!kpi.name || kpi.name.length > 100) {
        errors.push({ field: 'name', message: 'KPI name is required and must be less than 100 characters' });
      }
      if (!this.isNonNegativeInteger(kpi.value)) {
        errors.push({ field: 'value', message: 'Value must be a non-negative integer' });
      }
      if (['%', 'count', 'ratio'].indexOf(kpi.unit) === -1) {
        errors.push({ field: 'unit', message: 'Unit is invalid' });
      }
      if (kpi.plannedCompletionDate && !this.isValidDate(kpi.plannedCompletionDate)) {
        errors.push({ field: 'plannedCompletionDate', message: 'Planned completion date is invalid' });
      }
      if (['On Track', 'At Risk', 'Off Track'].indexOf(kpi.status) === -1) {
        errors.push({ field: 'status', message: 'Status is invalid' });
      }
      return { valid: errors.length === 0, errors: errors };
    };

    this.validateScope = function(scope) {
      var errors = [];
      if (!this.isNonNegativeInteger(scope.totalCases)) {
        errors.push({ field: 'totalCases', message: 'Total cases must be non-negative' });
      }
      if (!this.isNonNegativeInteger(scope.executedCases) || scope.executedCases > scope.totalCases) {
        errors.push({ field: 'executedCases', message: 'Executed cases must be between 0 and total cases' });
      }
      if (!this.isNonNegativeInteger(scope.passedCases) || scope.passedCases > scope.executedCases) {
        errors.push({ field: 'passedCases', message: 'Passed cases must be between 0 and executed cases' });
      }
      if (!this.isValidStatus(scope.status)) {
        errors.push({ field: 'status', message: 'Status is invalid' });
      }
      if (scope.agentificationRequired && !scope.agentificationEta) {
        errors.push({ field: 'agentificationEta', message: 'Agentification ETA is required when agentification is required' });
      }
      if (scope.agentificationEta && !this.isValidDate(scope.agentificationEta)) {
        errors.push({ field: 'agentificationEta', message: 'Agentification ETA is invalid' });
      }
      if (scope.plannedCompletionDate && !this.isValidDate(scope.plannedCompletionDate)) {
        errors.push({ field: 'plannedCompletionDate', message: 'Planned completion date is invalid' });
      }
      return { valid: errors.length === 0, errors: errors };
    };

    this.validateConfig = function(config) {
      var errors = [];
      if (!config.themeId) {
        errors.push({ field: 'themeId', message: 'Theme is required' });
      }
      if (config.dataSourceNote && config.dataSourceNote.length > 500) {
        errors.push({ field: 'dataSourceNote', message: 'Data source note is too long' });
      }
      return { valid: errors.length === 0, errors: errors };
    };

    this.validateLoadedState = function(state) {
      if (!state) {
        return { valid: false, errors: [{ message: 'State is empty' }] };
      }
      return { valid: true, errors: [] };
    };

    this.isNonNegativeInteger = function(value) {
      return typeof value === 'number' && value >= 0 && Math.floor(value) === value;
    };

    this.isPercentage = function(value) {
      return typeof value === 'number' && value >= 0 && value <= 100;
    };

    this.isValidDate = function(value) {
      if (!value) {
        return false;
      }
      var parsed = Date.parse(value);
      return !isNaN(parsed) && value !== '0000-00-00';
    };

    this.isValidStatus = function(status) {
      var allowed = ['Not Started', 'In Progress', 'Design in Progress', 'Completed'];
      return allowed.indexOf(status) !== -1;
    };
  }
})();
