(function() {
  'use strict';
  angular.module('executiveDashboardApp').controller('AgentificationController', ['$scope', 'AgentificationService', 'StatusDataService', function($scope, AgentificationService, StatusDataService) {
    var vm = this;
    vm.agentificationData = [];
    function init() {
      loadAgentificationData();
    }
    function loadAgentificationData() {
      try {
        vm.agentificationData = AgentificationService.getAgentificationProgress();
      } catch(e) {
        console.error('Error loading agentification data:', e);
        vm.agentificationData = [];
      }
    }
    vm.updateAgentificationProgress = function(scopeId, progress, eta) {
      try {
        AgentificationService.saveAgentificationProgress(scopeId, progress, eta);
        StatusDataService.updateEta(scopeId, eta);
      } catch(e) {
        console.error('Error updating agentification progress:', e);
      }
    };
    init();
  }]);
})();