(function() {
  'use strict';
  angular.module('shoppingPlatform').factory('PermissionFactory', [function() {
    var permissions = {
      admin: ['manage_users', 'view_analytics', 'manage_products', 'manage_orders', 'fraud_detection', 'dispute_resolution'],
      seller: ['manage_own_products', 'manage_own_inventory', 'view_own_orders', 'view_own_analytics'],
      consumer: ['browse_products', 'manage_cart', 'place_orders', 'view_own_orders', 'write_reviews']
    };
    return {
      checkPermission: function(role, permission) {
        if (!role || !permissions[role]) {
          return false;
        }
        return permissions[role].indexOf(permission) !== -1;
      },
      getRolePermissions: function(role) {
        return permissions[role] || [];
      }
    };
  }]);
})();