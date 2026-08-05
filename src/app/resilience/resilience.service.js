(function() {
  'use strict';
  angular
    .module('execDashboard.resilience')
    .service('ResilienceService', ResilienceService);

  ResilienceService.$inject = [];
  function ResilienceService() {
    var failureCount = 0;
    var threshold = 3;
    var circuitOpen = false;

    this.recordFailure = function() {
      failureCount++;
      if (failureCount >= threshold) {
        circuitOpen = true;
      }
    };

    this.canAttempt = function() {
      return !circuitOpen;
    };

    this.reset = function() {
      failureCount = 0;
      circuitOpen = false;
    };
  }
})();
