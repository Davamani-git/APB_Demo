(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .component('alertDetailComponent', {
      templateUrl: 'src/app/views/fraud-detection/alert-detail.html',
      controller: ['ResponseService', function(ResponseService) {
        var ctrl = this;
        ctrl.$onInit = function() {
          ctrl.alert = null;
        };
      }],
      bindings: {
        alertId: '@'
      }
    });
})();