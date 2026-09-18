(function() {
  'use strict';
  angular.module('dashboardModule').factory('dataAggregationFactory', ['cloudIntegrationService', 'PortfolioModel', 'CompanyModel', '$q', '$cacheFactory', function(cloudIntegrationService, PortfolioModel, CompanyModel, $q, $cacheFactory) {
    var cache = $cacheFactory('dataAggregationCache');
    var factory = {};
    factory.getPortfolioData = function() {
      var cached = cache.get('portfolioData');
      if (cached) return $q.resolve(cached);
      return $q.all({
        aws: cloudIntegrationService.fetchAWSData(),
        azure: cloudIntegrationService.fetchAzureData(),
        gcp: cloudIntegrationService.fetchGCPData()
      }).then(function(results) {
        var normalized = factory.normalizeData(results);
        var portfolio = new PortfolioModel(normalized);
        cache.put('portfolioData', portfolio);
        return portfolio;
      }).catch(function(error) {
        throw error;
      });
    };
    factory.getCompanyDetail = function(companyId) {
      var cacheKey = 'company_' + companyId;
      var cached = cache.get(cacheKey);
      if (cached) return $q.resolve(cached);
      return $q.all({
        aws: cloudIntegrationService.fetchAWSData(companyId),
        azure: cloudIntegrationService.fetchAzureData(companyId),
        gcp: cloudIntegrationService.fetchGCPData(companyId)
      }).then(function(results) {
        var normalized = factory.normalizeCompanyData(results, companyId);
        var company = new CompanyModel(normalized);
        cache.put(cacheKey, company);
        return company;
      }).catch(function(error) {
        throw error;
      });
    };
    factory.normalizeData = function(rawData) {
      var companies = [];
      var totalSpend = 0;
      var companyMap = {};
      ['aws', 'azure', 'gcp'].forEach(function(provider) {
        if (rawData[provider] && rawData[provider].companies) {
          rawData[provider].companies.forEach(function(comp) {
            if (!companyMap[comp.companyId]) {
              companyMap[comp.companyId] = {
                companyId: comp.companyId,
                companyName: comp.companyName,
                aiProviders: [],
                totalSpend: 0,
                budgetThreshold: comp.budgetThreshold || 0,
                lastDataSync: new Date(),
                departments: comp.departments || [],
                alertStatus: 'none'
              };
            }
            companyMap[comp.companyId].aiProviders.push(provider.toUpperCase());
            companyMap[comp.companyId].totalSpend += comp.spend || 0;
            totalSpend += comp.spend || 0;
          });
        }
      });
      for (var id in companyMap) {
        if (companyMap[id].totalSpend > companyMap[id].budgetThreshold) {
          companyMap[id].alertStatus = 'budget_exceeded';
        }
        companies.push(companyMap[id]);
      }
      return {
        portfolioId: 'portfolio_001',
        companies: companies,
        totalSpend: totalSpend,
        lastUpdated: new Date(),
        currency: 'USD'
      };
    };
    factory.normalizeCompanyData = function(rawData, companyId) {
      var companyData = {
        companyId: companyId,
        companyName: '',
        aiProviders: [],
        totalSpend: 0,
        budgetThreshold: 0,
        lastDataSync: new Date(),
        departments: [],
        alertStatus: 'none'
      };
      ['aws', 'azure', 'gcp'].forEach(function(provider) {
        if (rawData[provider] && rawData[provider].company) {
          var comp = rawData[provider].company;
          companyData.companyName = comp.companyName || companyData.companyName;
          companyData.aiProviders.push(provider.toUpperCase());
          companyData.totalSpend += comp.spend || 0;
          companyData.budgetThreshold = comp.budgetThreshold || companyData.budgetThreshold;
          if (comp.departments) {
            companyData.departments = companyData.departments.concat(comp.departments);
          }
        }
      });
      if (companyData.totalSpend > companyData.budgetThreshold) {
        companyData.alertStatus = 'budget_exceeded';
      }
      return companyData;
    };
    factory.clearCache = function() {
      cache.removeAll();
    };
    return factory;
  }]);
})();