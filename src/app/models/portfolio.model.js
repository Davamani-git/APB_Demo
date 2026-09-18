(function() {
  'use strict';
  angular.module('dashboardModule').factory('PortfolioModel', [function() {
    class PortfolioModel {
      constructor(data) {
        this.portfolioId = data.portfolioId || '';
        this.companies = data.companies || [];
        this.totalSpend = data.totalSpend || 0;
        this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
        this.currency = data.currency || 'USD';
      }
      getPortfolioId() { return this.portfolioId; }
      setPortfolioId(id) { this.portfolioId = id; }
      getCompanies() { return this.companies; }
      setCompanies(companies) { this.companies = companies; }
      getTotalSpend() { return this.totalSpend; }
      setTotalSpend(spend) { this.totalSpend = spend; }
      getLastUpdated() { return this.lastUpdated; }
      setLastUpdated(date) { this.lastUpdated = new Date(date); }
      getCurrency() { return this.currency; }
      setCurrency(currency) { this.currency = currency; }
    }
    return PortfolioModel;
  }]);
})();