(function() {
  'use strict';
  angular
    .module('execDashboard.core')
    .service('DataStoreService', DataStoreService);

  DataStoreService.$inject = ['ValidationService', '$rootScope', 'StorageService', 'KpiModel', 'ScopeModel', 'ConfigModel'];
  function DataStoreService(ValidationService, $rootScope, StorageService, KpiModel, ScopeModel, ConfigModel) {
    var state = {
      kpis: [],
      scopes: [],
      config: ConfigModel.create()
    };

    this.initialize = function(initialState) {
      state.kpis = (initialState.kpis || []).map(function(k) { return KpiModel.create(k); });
      state.scopes = (initialState.scopes || []).map(function(s) { return ScopeModel.create(s); });
      state.config = ConfigModel.create(initialState.config || {});
      broadcastChange();
    };

    this.initializeDefaults = function() {
      state.kpis = [
        KpiModel.create({
          id: 'kpi1',
          name: 'Test Coverage',
          description: 'Overall test coverage',
          value: 75,
          unit: '%',
          status: 'On Track'
        })
      ];
      state.scopes = [];
      state.config = ConfigModel.create();
      broadcastChange();
    };

    this.getState = function() {
      return angular.copy(state);
    };

    this.getKpis = function() {
      return state.kpis.map(function(k) { return angular.copy(k); });
    };

    this.getScopes = function() {
      return state.scopes.map(function(s) { return angular.copy(s); });
    };

    this.getConfig = function() {
      return angular.copy(state.config);
    };

    this.updateKpi = function(kpiId, partialKpi) {
      var existing = findById(state.kpis, kpiId);
      if (!existing) {
        return;
      }
      angular.extend(existing, partialKpi);
      existing.lastUpdated = new Date().toISOString();
      recalculateKpiDerived(existing);
      persistAndBroadcast();
    };

    this.addScope = function(scope) {
      var created = ScopeModel.create(scope);
      recalculateScopeDerived(created);
      state.scopes.push(created);
      persistAndBroadcast();
    };

    this.updateScope = function(scopeId, partialScope) {
      var existing = findById(state.scopes, scopeId);
      if (!existing) {
        return;
      }
      angular.extend(existing, partialScope);
      existing.lastUpdated = new Date().toISOString();
      recalculateScopeDerived(existing);
      persistAndBroadcast();
    };

    this.removeScope = function(scopeId) {
      state.scopes = state.scopes.filter(function(s) { return s.id !== scopeId; });
      persistAndBroadcast();
    };

    this.setConfig = function(config) {
      state.config = ConfigModel.create(config);
      persistAndBroadcast();
    };

    this.onChange = function(callback) {
      $rootScope.$on('state:changed', function(event, newState) {
        callback(angular.copy(newState));
      });
    };

    function persistAndBroadcast() {
      StorageService.saveState(state);
      broadcastChange();
    }

    function broadcastChange() {
      $rootScope.$broadcast('state:changed', state);
    }

    function findById(list, id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i];
        }
      }
      return null;
    }

    function recalculateKpiDerived(kpi) {
      if (kpi.targetValue != null && kpi.value != null) {
        if (kpi.value >= kpi.targetValue) {
          kpi.status = 'On Track';
        } else if (kpi.value >= kpi.targetValue * 0.8) {
          kpi.status = 'At Risk';
        } else {
          kpi.status = 'Off Track';
        }
      }
    }

    function recalculateScopeDerived(scope) {
      var total = scope.totalCases || 0;
      var executed = scope.executedCases || 0;
      var passed = scope.passedCases || 0;
      var passRatio = total > 0 ? passed / total : 0;
      if (scope.status === 'Completed' && total > 0 && passRatio >= 0.95) {
        scope.readinessFlag = 'Ready';
      } else if (scope.status === 'Completed') {
        scope.readinessFlag = 'Not Ready';
      } else if (scope.status === 'In Progress') {
        scope.readinessFlag = 'Not Ready';
      } else {
        scope.readinessFlag = 'Unknown';
      }
    }
  }
})();
