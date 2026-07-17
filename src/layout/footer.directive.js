(function () {
  'use strict';

  angular
    .module('apb.layout')
    .directive('apbFooter', apbFooter);

  function apbFooter() {
    return {
      restrict: 'E',
      template: '<footer class="apb-footer text-center">' +
        '<span>&copy; ' + new Date().getFullYear() + ' Spend Insights Dashboard</span>' +
        '</footer>'
    };
  }
})();
