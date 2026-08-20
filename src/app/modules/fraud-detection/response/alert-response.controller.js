(function() {
  'use strict';
  angular.module('fraudDetection.response')
    .controller('AlertDetailController', ['$scope', '$routeParams', '$location', 'AlertService', 'ResponseService', function($scope, $routeParams, $location, AlertService, ResponseService) {
      var vm = this;
      vm.alert = null;
      vm.loading = true;
      vm.error = null;
      vm.processing = false;
      vm.alertId = $routeParams.alertId;
      vm.loadAlert = function() {
        vm.loading = true;
        AlertService.getAlertById(vm.alertId)
          .then(function(alert) {
            vm.alert = alert;
            vm.loading = false;
            if (alert.status === 'delivered') {
              AlertService.updateAlert(vm.alertId, { status: 'viewed', viewedAt: new Date() });
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load alert details';
            vm.loading = false;
          });
      };
      vm.confirmTransaction = function() {
        vm.processing = true;
        ResponseService.submitResponse(vm.alertId, 'confirmed')
          .then(function(result) {
            vm.alert.status = 'confirmed';
            vm.processing = false;
            vm.message = 'Thank you for confirming. This transaction has been verified.';
          })
          .catch(function(error) {
            vm.error = 'Failed to submit response';
            vm.processing = false;
          });
      };
      vm.reportTransaction = function() {
        vm.processing = true;
        ResponseService.submitResponse(vm.alertId, 'reported')
          .then(function(result) {
            vm.alert.status = 'reported';
            vm.processing = false;
            vm.message = 'Your card has been secured. A replacement card will be sent to you. Case ID: ' + result.caseId;
          })
          .catch(function(error) {
            vm.error = 'Failed to submit response';
            vm.processing = false;
          });
      };
      vm.goBack = function() {
        $location.path('/alerts');
      };
      vm.loadAlert();
    }]);
})();