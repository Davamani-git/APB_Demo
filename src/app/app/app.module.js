(function () {
  'use strict';

  angular
    .module('execSummary.controllers', []);

  angular
    .module('execSummary.services', []);

  angular
    .module('execSummary.directives', []);

  angular
    .module('execSummary.filters', []);

  angular
    .module('execSummary.models', []);

  angular
    .module('execSummary.config', []);

  angular
    .module('execSummaryApp', [
      'ngAnimate',
      'ui.bootstrap',
      'execSummary.controllers',
      'execSummary.services',
      'execSummary.directives',
      'execSummary.filters',
      'execSummary.models',
      'execSummary.config'
    ]);
})();