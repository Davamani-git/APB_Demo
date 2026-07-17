(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .factory('ProfileModel', ProfileModelFactory);

  function ProfileModelFactory() {
    class ProfileModel {
      constructor(dto) {
        dto = dto || {};
        this.customerId = dto.customerId || '';
        this.segment = dto.segment || '';
        this.incomeTrend = dto.incomeTrend || { direction: 'FLAT', percent: 0 };
        this.spendingCategories = Array.isArray(dto.spendingCategories) ? dto.spendingCategories : [];
        this.lastUpdated = dto.lastUpdated ? new Date(dto.lastUpdated) : null;
      }
    }

    return ProfileModel;
  }
})();
