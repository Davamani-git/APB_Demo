(function() {
  'use strict';
  angular.module('dashboardModule').service('analyticsService', ['dataAggregationFactory', 'CompanyModel', function(dataAggregationFactory, CompanyModel) {
    var self = this;
    self.computeBenchmarks = function(portfolioModel) {
      var companies = portfolioModel.getCompanies();
      if (!companies || companies.length === 0) {
        return {
          avgSpend: 0,
          maxSpend: 0,
          minSpend: 0,
          totalAlerts: 0
        };
      }
      var totalSpend = 0;
      var maxSpend = 0;
      var minSpend = Infinity;
      var totalAlerts = 0;
      companies.forEach(function(company) {
        var spend = company.totalSpend || 0;
        totalSpend += spend;
        if (spend > maxSpend) maxSpend = spend;
        if (spend < minSpend) minSpend = spend;
        if (company.alertStatus !== 'none') totalAlerts++;
      });
      return {
        avgSpend: totalSpend / companies.length,
        maxSpend: maxSpend,
        minSpend: minSpend === Infinity ? 0 : minSpend,
        totalAlerts: totalAlerts
      };
    };
    self.detectAnomalies = function(portfolioModel) {
      var companies = portfolioModel.getCompanies();
      var benchmarks = self.computeBenchmarks(portfolioModel);
      var anomalies = [];
      companies.forEach(function(company) {
        if (company.totalSpend > benchmarks.avgSpend * 1.5) {
          anomalies.push({
            companyId: company.companyId,
            companyName: company.companyName,
            reason: 'Spend 50% above average',
            spend: company.totalSpend
          });
        }
      });
      return anomalies;
    };
    self.generateRecommendations = function(portfolioModel) {
      var recommendations = [];
      var companies = portfolioModel.getCompanies();
      companies.forEach(function(company) {
        if (company.alertStatus === 'budget_exceeded') {
          recommendations.push({
            companyId: company.companyId,
            companyName: company.companyName,
            recommendation: 'Review AI spend - budget threshold exceeded',
            priority: 'high'
          });
        }
        if (!company.isDataFresh) {
          recommendations.push({
            companyId: company.companyId,
            companyName: company.companyName,
            recommendation: 'Data sync required - last update over 24 hours ago',
            priority: 'medium'
          });
        }
      });
      return recommendations;
    };
  }]);
})();