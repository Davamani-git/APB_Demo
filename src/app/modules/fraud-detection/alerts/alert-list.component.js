(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .component('alertListComponent', {
      templateUrl: 'src/app/views/fraud-detection/alert-list.html',
      controller: ['AlertService', function(AlertService) {
        var ctrl = this;
        ctrl.$onInit = function() {
          ctrl.alerts = [];
        };
      }],
      bindings: {}
    });
})();