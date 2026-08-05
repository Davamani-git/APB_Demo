(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('KpiCalculationService', ['ValidationService', 'LoggingService', function (ValidationService, LoggingService) {
      this.computeScopeMetrics = function (scope) {
        var total = scope.totalUseCases || 0;
        var completed = scope.completedUseCases || 0;
        var completionPercent = total > 0 ? (completed / total) * 100 : 0;
        var agentificationPercent = scope.agentificationPercent || 0;
        return {
          completionPercent: completionPercent,
          agentificationPercent: agentificationPercent
        };
      };

      this.groupByReadiness = function (scopes) {
        var groupsMap = {};
        var i;
        for (i = 0; i < scopes.length; i++) {
          var scope = scopes[i];
          var status = scope.readinessStatus;
          var validationError = ValidationService.validateReadinessStatus(status);
          if (validationError) {
            LoggingService.warn('Invalid readiness status detected, excluding scope from display', { scopeId: scope.id, status: status });
            continue;
          }
          if (!groupsMap[status]) {
            groupsMap[status] = [];
          }
          groupsMap[status].push(scope);
        }
        var result = [];
        angular.forEach(groupsMap, function (value, key) {
          result.push({
            status: key,
            label: key | 'statusLabel',
            scopes: value
          });
        });
        return result;
      };

      this.computeAll = function (scopes) {
        var validScopes = [];
        var i;
        for (i = 0; i < scopes.length; i++) {
          var scope = scopes[i];
          var validation = ValidationService.validateScope(angular.copy(scope));
          if (!validation.valid) {
            LoggingService.warn('Invalid scope excluded from KPI calculation', { scopeId: scope.id, errors: validation.errors });
            continue;
          }
          validScopes.push(scope);
        }
        var totalUseCases = 0;
        var totalCompletedUseCases = 0;
        var totalPendingUseCases = 0;
        var totalAgentificationPercent = 0;
        var iValid;
        for (iValid = 0; iValid < validScopes.length; iValid++) {
          var s = validScopes[iValid];
          totalUseCases += s.totalUseCases || 0;
          totalCompletedUseCases += s.completedUseCases || 0;
          totalPendingUseCases += s.pendingUseCases || 0;
          totalAgentificationPercent += s.agentificationPercent || 0;
        }
        var overallCompletionPercent = totalUseCases > 0 ? (totalCompletedUseCases / totalUseCases) * 100 : 0;
        var avgAgentificationPercent = validScopes.length > 0 ? totalAgentificationPercent / validScopes.length : 0;
        var scopeCountsByStatus = {};
        var j;
        for (j = 0; j < validScopes.length; j++) {
          var status = validScopes[j].readinessStatus;
          if (!scopeCountsByStatus[status]) {
            scopeCountsByStatus[status] = 0;
          }
          scopeCountsByStatus[status]++;
        }
        var readinessGroups = this.groupByReadiness(validScopes);
        return {
          scopesWithMetrics: validScopes,
          kpiSummary: {
            totalUseCases: totalUseCases,
            totalCompletedUseCases: totalCompletedUseCases,
            totalPendingUseCases: totalPendingUseCases,
            overallCompletionPercent: overallCompletionPercent,
            avgAgentificationPercent: avgAgentificationPercent,
            scopeCountsByStatus: scopeCountsByStatus
          },
          readinessGroups: readinessGroups
        };
      };
    }]);
})();