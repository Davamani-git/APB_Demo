angular.module('apbApp').service('alertService', ['notificationService', function(notificationService) {
  var self = this;
  self.alerts = [];
  self.raise = function(alert) {
    self.alerts.push(alert);
    notificationService.warning(alert.message || 'Alert triggered');
  };
  self.staleData = function(companyName) {
    self.raise({ type: 'stale', companyName: companyName, message: 'Data for ' + companyName + ' is outdated (>24h).' });
  };
  self.clear = function() { self.alerts = []; };
  self.getAll = function() { return self.alerts; };
}]);
