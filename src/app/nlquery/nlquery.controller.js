(function() {
  'use strict';
  angular.module('app.nlquery')
    .controller('NLQueryController', ['$scope', 'NLQueryService', function($scope, NLQueryService) {
      var vm = this;
      vm.queryHistory = [];
      vm.currentQuery = '';
      vm.loading = false;
      vm.error = null;
      vm.submitQuery = submitQuery;
      function submitQuery() {
        if (!vm.currentQuery.trim()) {
          return;
        }
        var userQuery = vm.currentQuery;
        vm.queryHistory.push({
          type: 'user',
          text: userQuery,
          timestamp: new Date()
        });
        vm.currentQuery = '';
        vm.loading = true;
        NLQueryService.submitQuery(userQuery)
          .then(function(result) {
            vm.queryHistory.push({
              type: 'system',
              text: result.response,
              supportingData: result.supportingData,
              timestamp: new Date()
            });
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to process query';
            vm.loading = false;
          });
      }
    }]);
})();