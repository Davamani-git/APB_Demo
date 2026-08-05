(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('ScopeDataService', ['StorageService', 'ENV_CONFIG', 'ValidationService', 'LoggingService', '$rootScope', 'ScopeModel', function (StorageService, ENV_CONFIG, ValidationService, LoggingService, $rootScope, ScopeModel) {
      var scopes = [];

      function emitDataUpdated() {
        $rootScope.$broadcast('execSummary:dataUpdated', scopes);
      }

      this.loadFromStorage = function () {
        var stored = StorageService.load(ENV_CONFIG.storageKeyScopes);
        if (!stored) {
          scopes = ScopeModel.createDefaults();
          LoggingService.info('Initialized default scopes');
        } else {
          scopes = stored;
        }
        emitDataUpdated();
        return scopes;
      };

      this.saveToStorage = function () {
        var success = StorageService.save(ENV_CONFIG.storageKeyScopes, scopes);
        if (!success) {
          LoggingService.warn('Failed to persist scopes');
        }
      };

      this.getAllScopes = function () {
        return scopes;
      };

      this.getScopeById = function (scopeId) {
        var i;
        for (i = 0; i < scopes.length; i++) {
          if (scopes[i].id === scopeId) {
            return scopes[i];
          }
        }
        return null;
      };

      this.updateScope = function (updatedScope) {
        var validation = ValidationService.validateScope(updatedScope);
        if (!validation.valid) {
          return validation;
        }
        var i;
        for (i = 0; i < scopes.length; i++) {
          if (scopes[i].id === updatedScope.id) {
            var oldScope = scopes[i];
            scopes[i] = {
              id: updatedScope.id,
              name: updatedScope.name,
              totalUseCases: updatedScope.totalUseCases,
              completedUseCases: updatedScope.completedUseCases,
              pendingUseCases: updatedScope.pendingUseCases,
              agentificationPercent: updatedScope.agentificationPercent,
              readinessStatus: updatedScope.readinessStatus,
              notes: updatedScope.notes
            };
            LoggingService.audit('SCOPE_UPDATE', {
              scopeId: updatedScope.id,
              fieldName: 'scope',
              oldValue: oldScope,
              newValue: scopes[i]
            });
            this.saveToStorage();
            emitDataUpdated();
            return { valid: true, errors: {} };
          }
        }
        return {
          valid: false,
          errors: { id: 'Scope not found.' }
        };
      };

      this.resetToDefaults = function () {
        scopes = ScopeModel.createDefaults();
        this.saveToStorage();
        emitDataUpdated();
      };
    }]);
})();