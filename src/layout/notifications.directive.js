(function () {
  'use strict';

  angular
    .module('apb.layout')
    .directive('apbNotifications', apbNotifications);

  function apbNotifications() {
    return {
      restrict: 'E',
      template: '<div class="apb-notifications-container"></div>'
    };
  }
})();
