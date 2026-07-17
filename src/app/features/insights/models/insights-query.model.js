(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .factory('InsightsQueryModel', InsightsQueryModelFactory);

  InsightsQueryModelFactory.$inject = ['EnvConfig'];

  function InsightsQueryModelFactory(EnvConfig) {
    class InsightsQueryModel {
      constructor(dto) {
        dto = dto || {};
        const now = new Date();
        const past = new Date();
        past.setDate(now.getDate() - 90);
        this.fromDate = dto.fromDate ? new Date(dto.fromDate) : past;
        this.toDate = dto.toDate ? new Date(dto.toDate) : now;
        this.category = dto.category || null;
        this.segment = dto.segment || null;
        this.page = dto.page || 1;
        this.pageSize = dto.pageSize || 20;
        this.maxDateRangeDays = EnvConfig.maxDateRangeDays;
      }

      isValidRange() {
        const from = this.fromDate;
        const to = this.toDate;
        if (!from || !to) {
          return false;
        }
        if (from > to) {
          return false;
        }
        const diffDays = Math.abs((to - from) / (1000 * 60 * 60 * 24));
        return diffDays <= this.maxDateRangeDays;
      }
    }

    return InsightsQueryModel;
  }
})();
