(function () {
  'use strict';

  angular
    .module('apb.auth')
    .factory('RoleAccessService', RoleAccessService);

  RoleAccessService.$inject = [];

  function RoleAccessService() {
    var ROLE_FEATURES = {
      'seller': {
        dashboard: true,
        inventoryManagement: true,
        adminPanel: false
      },
      'consumer': {
        dashboard: true,
        inventoryManagement: false,
        adminPanel: false
      },
      'admin': {
        dashboard: true,
        inventoryManagement: true,
        adminPanel: true
      }
    };

    var service = {
      canAccessDashboard: canAccessDashboard,
      canAccessInventoryManagement: canAccessInventoryManagement,
      canAccessAdminPanel: canAccessAdminPanel
    };

    return service;

    function getRoleConfig(role) {
      return ROLE_FEATURES[role] || {
        dashboard: false,
        inventoryManagement: false,
        adminPanel: false
      };
    }

    function canAccessDashboard(role) {
      return !!getRoleConfig(role).dashboard;
    }

    function canAccessInventoryManagement(role) {
      return !!getRoleConfig(role).inventoryManagement;
    }

    function canAccessAdminPanel(role) {
      return !!getRoleConfig(role).adminPanel;
    }
  }
})();
