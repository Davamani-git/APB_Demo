(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .factory('UserSessionModel', UserSessionModelFactory);

  function UserSessionModelFactory() {
    class UserSessionModel {
      constructor(dto) {
        dto = dto || {};
        this.userId = dto.userId || '';
        this.token = dto.token || '';
        this.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : new Date();
        this.roles = Array.isArray(dto.roles) ? dto.roles : [];
        this.attributes = dto.attributes || {};
      }

      isValid() {
        return !!this.token && this.expiresAt > new Date();
      }
    }

    return UserSessionModel;
  }
})();
