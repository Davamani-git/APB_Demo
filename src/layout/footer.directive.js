(function () {
  'use strict';

  angular
    .module('apb.layout')
    .directive('apbFooter', apbFooter);

  function apbFooter() {
    return {
      restrict: 'E',
      template: [
        '<footer class="footer text-center">',
        '  <div class="container">',
        '    <p class="text-muted">&copy; ',
        new Date().getFullYear().toString(),
        ' Monthly Spend Dashboard</p>',
        '  </div>',
        '</footer>'
      ].join('')
    };
  }
})();
