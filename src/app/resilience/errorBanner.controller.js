(function() {
  'use strict';
  angular
    .module('execDashboard.resilience')
    .controller('ErrorBannerController', ErrorBannerController);

  ErrorBannerController.$inject = ['$scope'];
  function ErrorBannerController($scope) {
    var vm = this;
    vm.messages = [];

    vm.dismiss = function(messageId) {
      vm.messages = vm.messages.filter(function(m) { return m.id !== messageId; });
    };

    $scope.$on('error:storage', function(event, data) {
      addMessage('storage', data.message);
    });

    $scope.$on('error:validation', function(event, data) {
      addMessage('validation', 'Validation errors occurred');
    });

    $scope.$on('error:notify', function(event, data) {
      addMessage('notify', data.message);
    });

    function addMessage(type, text) {
      vm.messages.push({
        id: type + '-' + new Date().getTime(),
        type: type,
        text: text
      });
    }
  }
})();
