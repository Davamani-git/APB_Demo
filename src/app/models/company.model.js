(function() {
  'use strict';
  angular.module('dashboardModule').factory('CompanyModel', [function() {
    class CompanyModel {
      constructor(data) {
        this.companyId = data.companyId || '';
        this.companyName = data.companyName || '';
        this.aiProviders = data.aiProviders || [];
        this.totalSpend = data.totalSpend || 0;
        this.budgetThreshold = data.budgetThreshold || 0;
        this.lastDataSync = data.lastDataSync ? new Date(data.lastDataSync) : new Date();
        this.departments = data.departments || [];
        this.isDataFresh = this._checkDataFreshness();
        this.alertStatus = data.alertStatus || 'none';
      }
      _checkDataFreshness() {
        const now = new Date();
        const diff = now - this.lastDataSync;
        return diff < 24 * 60 * 60 * 1000;
      }
      getCompanyId() { return this.companyId; }
      setCompanyId(id) { this.companyId = id; }
      getCompanyName() { return this.companyName; }
      setCompanyName(name) { this.companyName = name; }
      getAiProviders() { return this.aiProviders; }
      setAiProviders(providers) { this.aiProviders = providers; }
      getTotalSpend() { return this.totalSpend; }
      setTotalSpend(spend) { this.totalSpend = spend; }
      getBudgetThreshold() { return this.budgetThreshold; }
      setBudgetThreshold(threshold) { this.budgetThreshold = threshold; }
      getLastDataSync() { return this.lastDataSync; }
      setLastDataSync(date) {
        this.lastDataSync = new Date(date);
        this.isDataFresh = this._checkDataFreshness();
      }
      getDepartments() { return this.departments; }
      setDepartments(departments) { this.departments = departments; }
      getIsDataFresh() { return this.isDataFresh; }
      getAlertStatus() { return this.alertStatus; }
      setAlertStatus(status) { this.alertStatus = status; }
    }
    return CompanyModel;
  }]);
})();