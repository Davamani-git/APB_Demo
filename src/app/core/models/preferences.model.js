(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .factory('PreferencesModel', PreferencesModelFactory);

  function PreferencesModelFactory() {
    class PreferencesModel {
      constructor(dto) {
        dto = dto || {};
        this.key = dto.key || '';
        this.value = dto.value !== undefined ? dto.value : null;
        this.updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : new Date();
      }
    }

    return PreferencesModel;
  }
})();
