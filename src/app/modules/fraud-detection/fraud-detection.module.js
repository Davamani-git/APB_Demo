(function() {
  'use strict';
  angular.module('fraudDetection.ingestion', []);
  angular.module('fraudDetection.riskEngine', []);
  angular.module('fraudDetection.policy', []);
  angular.module('fraudDetection.alerts', ['ngResource']);
  angular.module('fraudDetection.notification', []);
  angular.module('fraudDetection.response', []);
  angular.module('fraudDetection.protection', []);
  angular.module('fraudDetection.audit', []);
})();