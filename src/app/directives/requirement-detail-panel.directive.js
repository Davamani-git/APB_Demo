(function() {
  'use strict';
  angular.module('providerEnrollmentApp').directive('requirementDetailPanel', [requirementDetailPanel]);
  function requirementDetailPanel() {
    return {
      restrict: 'E',
      scope: { requirements: '=', applicationId: '=', onUpload: '&' },
      templateUrl: 'src/app/directives/requirement-detail-panel.template.html',
      controller: ['$scope', function($scope) {
        $scope.selectedRequirement = null;
        $scope.selectRequirement = function(req) {
          $scope.selectedRequirement = req;
        };
        $scope.getStatusClass = function(status) {
          if (status === 'Present & Valid') return 'success';
          if (status === 'Missing') return 'danger';
          if (status === 'Expired') return 'danger';
          if (status === 'Expiring Soon') return 'warning';
          return 'default';
        };
      }]
    };
  }
})();