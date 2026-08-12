angular.module('apbApp').service('dataFreshnessService', ['$interval', 'dataStorageService', 'alertService', 'configService', function($interval, dataStorageService, alertService, configService) {
  var self = this;
  var timer = null;
  var thresholdMs = configService.get('freshnessThresholdHours') * 3600000;
  self.check = function() {
    return dataStorageService.getFreshness().then(function(data) {
      var now = Date.now();
      (data || []).forEach(function(item) {
        if (item.lastUpdate && (now - new Date(item.lastUpdate).getTime()) > thresholdMs) {
          alertService.staleData(item.companyName);
        }
      });
      return data;
    });
  };
  self.startMonitoring = function() {
    if (timer) { return; }
    timer = $interval(function(){ self.check(); }, configService.get('freshnessPollMs'));
  };
  self.stopMonitoring = function() {
    if (timer) { $interval.cancel(timer); timer = null; }
  };
}]);
