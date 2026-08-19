angular.module('fraudAlert.dashboard')
  .controller('AlertController', ['$scope', '$uibModal', 'AlertService', function($scope, $uibModal, AlertService) {
    var vm = this;
    vm.openAlertModal = function(alert) {
      var modalInstance = $uibModal.open({
        templateUrl: 'src/app/fraud-alert/views/alert-modal.html',
        controller: 'AlertModalController',
        controllerAs: 'modal',
        resolve: {
          alert: function() {
            return alert;
          }
        }
      });
      modalInstance.result.then(function(response) {
        if (response === 'acknowledged') {
          AlertService.acknowledgeAlert(alert.alertId);
        }
      });
    };
  }])
  .controller('AlertModalController', ['$uibModalInstance', 'alert', function($uibModalInstance, alert) {
    var modal = this;
    modal.alert = alert;
    modal.acknowledge = function() {
      $uibModalInstance.close('acknowledged');
    };
    modal.close = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }]);