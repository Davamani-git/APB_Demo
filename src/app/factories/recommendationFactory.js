(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .factory('recommendationFactory', ['analyticsService', function(analyticsService) {
      return {
        generateRecommendations: function(companyData) {
          var recommendations = [];
          if (companyData.totalSpend > 10000) {
            recommendations.push({
              type: 'cost',
              suggestion: 'Consider reserved instances to reduce spend by up to 30%',
              estimatedImpact: companyData.totalSpend * 0.3
            });
          }
          Object.keys(companyData.spendByProvider || {}).forEach(function(provider) {
            var spend = companyData.spendByProvider[provider];
            if (spend > 5000) {
              recommendations.push({
                type: 'performance',
                suggestion: 'Optimize ' + provider + ' usage patterns for better cost efficiency',
                estimatedImpact: spend * 0.15
              });
            }
          });
          return recommendations;
        },
        getTopRecommendations: function(allCompaniesData, limit) {
          var allRecommendations = [];
          allCompaniesData.forEach(function(company) {
            var recs = this.generateRecommendations(company);
            recs.forEach(function(rec) {
              rec.companyId = company.companyId;
            });
            allRecommendations = allRecommendations.concat(recs);
          }.bind(this));
          allRecommendations.sort(function(a, b) {
            return b.estimatedImpact - a.estimatedImpact;
          });
          return allRecommendations.slice(0, limit || 5);
        }
      };
    }]);
})();