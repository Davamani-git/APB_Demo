(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('ValidationService', [function () {
      var allowedStatuses = ['IN_PROGRESS', 'DESIGN_IN_PROGRESS', 'COMPLETED'];

      this.validateCounts = function (total, completed, pending) {
        var errors = {};
        if (total < 0) {
          errors.totalUseCases = 'Total use cases must be greater than or equal to zero.';
        }
        if (completed < 0) {
          errors.completedUseCases = 'Completed use cases must be greater than or equal to zero.';
        }
        if (pending < 0) {
          errors.pendingUseCases = 'Pending use cases must be greater than or equal to zero.';
        }
        if (completed + pending !== total) {
          errors.totalUseCases = 'Completed plus pending must equal total use cases.';
        }
        return errors;
      };

      this.validateReadinessStatus = function (status) {
        if (allowedStatuses.indexOf(status) === -1) {
          return 'Readiness status must be one of IN_PROGRESS, DESIGN_IN_PROGRESS, COMPLETED.';
        }
        return null;
      };

      this.validateAgentificationPercent = function (value) {
        if (value < 0 || value > 100) {
          return 'Agentification percent must be between 0 and 100.';
        }
        return null;
      };

      this.sanitizeText = function (input) {
        if (!input) {
          return '';
        }
        var sanitized = String(input)
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        sanitized = sanitized.replace(/script/gi, '');
        return sanitized;
      };

      this.validateScope = function (scope) {
        var errors = {};
        var countErrors = this.validateCounts(scope.totalUseCases, scope.completedUseCases, scope.pendingUseCases);
        angular.extend(errors, countErrors);
        var statusError = this.validateReadinessStatus(scope.readinessStatus);
        if (statusError) {
          errors.readinessStatus = statusError;
        }
        var agentError = this.validateAgentificationPercent(scope.agentificationPercent);
        if (agentError) {
          errors.agentificationPercent = agentError;
        }
        if (scope.notes) {
          scope.notes = this.sanitizeText(scope.notes);
        }
        var valid = Object.keys(errors).length === 0;
        return {
          valid: valid,
          errors: errors
        };
      };
    }]);
})();