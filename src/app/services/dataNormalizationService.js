angular.module('apbApp').service('dataNormalizationService', ['cloudIntegrationFactory', function(cloudIntegrationFactory) {
  this.normalize = function(provider, raw) {
    return (raw || []).map(function(r) {
      return {
        id: r.id || (provider + '-' + (r.recordId || Math.random().toString(36).slice(2))),
        companyId: r.companyId,
        provider: provider,
        serviceName: r.serviceName || r.service || 'unknown',
        usageAmount: Number(r.usageAmount != null ? r.usageAmount : r.usage) || 0,
        usageUnit: r.usageUnit || r.unit || 'units',
        cost: Number(r.cost != null ? r.cost : r.amount) || 0,
        currency: r.currency || 'USD',
        timestamp: r.timestamp ? new Date(r.timestamp) : new Date(),
        isFresh: true
      };
    });
  };
  this.normalizeAll = function(companyId) {
    var self = this;
    return cloudIntegrationFactory.fetchAllProviders(companyId).then(function(results) {
      return self.normalize('AWS', results[0]).concat(self.normalize('Azure', results[1])).concat(self.normalize('GCP', results[2]));
    });
  };
}]);
