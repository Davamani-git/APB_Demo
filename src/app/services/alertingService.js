angular.module('apbApp').service('alertingService', ['$http', '$interval', 'alertService', 'configService', function($http, $interval, alertService, configService) {
  var self = this;
  var timer = null;
  var base = configService.get('apiBaseUrl') + '/alerts';
  self.checkBudgetThresholds = function() {
    return $http.get(base + '/budget').then(function(res) {
      (res.data || []).forEach(function(alert) {
        alertService.raise({ type: 'budget', companyId: alert.companyId, message: alert.message });
      });
      return res.data;
    });
  };
  self.startPolling = function() {
    if (timer) { return; }
    timer = $interval(function(){ self.checkBudgetThresholds(); }, configService.get('alertPollMs'));
  };
  self.stopPolling = function() {
    if (timer) { $interval.cancel(timer); timer = null; }
  };
}]);
