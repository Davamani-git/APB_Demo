(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .factory('dataAggregationFactory', ['cloudProviderService', function(cloudProviderService) {
      var factory = {};
      factory.aggregateData = function(rawData) {
        var aggregated = {
          companyId: rawData.companyId,
          totalCost: 0,
          providers: [],
          dataFreshness: 'current',
          lastAggregated: new Date()
        };
        if (rawData.providers && Array.isArray(rawData.providers)) {
          rawData.providers.forEach(function(provider) {
            var normalized = factory.normalizeProviderData(provider);
            aggregated.providers.push(normalized);
            aggregated.totalCost += normalized.cost;
          });
        }
        aggregated.dataFreshness = factory.calculateFreshness(aggregated.providers);
        return aggregated;
      };
      factory.normalizeProviderData = function(providerData) {
        var normalized = {
          provider: providerData.provider || providerData.name,
          cost: 0,
          usage: {},
          lastUpdated: new Date(providerData.lastSync || providerData.timestamp)
        };
        if (providerData.usageMetrics) {
          normalized.usage = providerData.usageMetrics;
        }
        if (providerData.cost !== undefined) {
          normalized.cost = parseFloat(providerData.cost);
        } else if (providerData.billing && providerData.billing.total) {
          normalized.cost = parseFloat(providerData.billing.total);
        }
        return normalized;
      };
      factory.calculateFreshness = function(providers) {
        if (!providers || providers.length === 0) return 'missing';
        var now = new Date();
        var threshold = 24 * 60 * 60 * 1000;
        var hasStale = providers.some(function(p) {
          return (now - new Date(p.lastUpdated)) > threshold;
        });
        return hasStale ? 'stale' : 'current';
      };
      factory.consolidateMultipleCompanies = function(companiesData) {
        var consolidated = {
          totalCost: 0,
          companies: [],
          providerBreakdown: {AWS: 0, AZURE: 0, GCP: 0},
          lastAggregated: new Date()
        };
        companiesData.forEach(function(companyData) {
          var aggregated = factory.aggregateData(companyData);
          consolidated.companies.push(aggregated);
          consolidated.totalCost += aggregated.totalCost;
          aggregated.providers.forEach(function(p) {
            if (consolidated.providerBreakdown[p.provider] !== undefined) {
              consolidated.providerBreakdown[p.provider] += p.cost;
            }
          });
        });
        return consolidated;
      };
      return factory;
    }]);
})();