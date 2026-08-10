(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('analyticsService', ['$http', '$q', 'dataAggregationFactory', function($http, $q, dataAggregationFactory) {
      var self = this;
      self.fetchPortfolioMetrics = function(filters) {
        return $http.get('/api/portfolio/metrics', {params: filters})
          .then(function(response) {
            var metrics = response.data;
            metrics.recommendations = self.generateRecommendations(metrics);
            return metrics;
          });
      };
      self.generateRecommendations = function(metrics) {
        var recommendations = [];
        if (metrics.providerBreakdown) {
          var providers = Object.keys(metrics.providerBreakdown);
          if (providers.length > 1) {
            var maxProvider = providers.reduce(function(a, b) {
              return metrics.providerBreakdown[a] > metrics.providerBreakdown[b] ? a : b;
            });
            recommendations.push({
              type: 'consolidation',
              description: 'Consider consolidating workloads to ' + maxProvider + ' to reduce multi-cloud management overhead',
              potentialSavings: metrics.totalSpend * 0.15
            });
          }
        }
        if (metrics.topCompanies && metrics.topCompanies.length > 0) {
          metrics.topCompanies.forEach(function(company) {
            if (company.change && company.change > 20) {
              recommendations.push({
                type: 'cost_spike',
                description: company.name + ' has experienced a ' + company.change + '% cost increase - review usage patterns',
                potentialSavings: company.spend * 0.1
              });
            }
          });
        }
        if (metrics.totalSpend > 100000) {
          recommendations.push({
            type: 'volume_discount',
            description: 'Portfolio spend qualifies for enterprise volume discounts - negotiate with providers',
            potentialSavings: metrics.totalSpend * 0.1
          });
        }
        return recommendations;
      };
      self.calculateKPIs = function(data) {
        var kpis = {
          totalSpend: 0,
          monthOverMonthChange: 0,
          averageCostPerCompany: 0,
          providerDistribution: {}
        };
        if (data.companies && data.companies.length > 0) {
          kpis.totalSpend = data.companies.reduce(function(sum, c) {
            return sum + (c.totalCost || 0);
          }, 0);
          kpis.averageCostPerCompany = kpis.totalSpend / data.companies.length;
        }
        if (data.monthlyTrend && data.monthlyTrend.length >= 2) {
          var current = data.monthlyTrend[data.monthlyTrend.length - 1].spend;
          var previous = data.monthlyTrend[data.monthlyTrend.length - 2].spend;
          kpis.monthOverMonthChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
        }
        return kpis;
      };
      self.getCompanyDetails = function(companyId) {
        return $http.get('/api/portfolio/companies/' + companyId + '/details')
          .then(function(response) {
            return response.data;
          });
      };
      self.getDepartmentBreakdown = function(companyId) {
        return $http.get('/api/portfolio/companies/' + companyId + '/departments')
          .then(function(response) {
            return response.data;
          });
      };
    }]);
})();