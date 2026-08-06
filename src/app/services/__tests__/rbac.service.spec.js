/*
Test Documentation:
- Test Name: RBACService hasRole with matching role
- Purpose: Validates user has required role
- Scenario: User role matches required role
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: RBACService hasRole with admin override
- Purpose: Validates admin has access to all roles
- Scenario: User is admin, any role required
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: RBACService hasRole when not authenticated
- Purpose: Validates unauthenticated users are denied
- Scenario: User not authenticated
- Expected Result: Returns false
*/
/*
Test Documentation:
- Test Name: RBACService hasPermission
- Purpose: Validates user has specific permission
- Scenario: User role has required permission
- Expected Result: Returns true if permission exists
*/
/*
Test Documentation:
- Test Name: RBACService validateRole success
- Purpose: Validates role validation passes for authorized user
- Scenario: User has required role
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: RBACService validateRole failure
- Purpose: Validates role validation throws error for unauthorized user
- Scenario: User does not have required role
- Expected Result: Throws 'Unauthorized access' error
*/
/*
Coverage Report:
- Functions tested: hasRole, hasPermission, validateRole
- Scenarios covered: role matching, admin override, unauthenticated user, permission check, successful validation, failed validation with error
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('RBACService', function() {
    var RBACService, AuthService, PermissionFactory;

    beforeEach(module('shoppingPlatform'));

    beforeEach(inject(function(_RBACService_, _AuthService_, _PermissionFactory_) {
      RBACService = _RBACService_;
      AuthService = _AuthService_;
      PermissionFactory = _PermissionFactory_;

      spyOn(AuthService, 'isAuthenticated').and.returnValue(true);
      spyOn(AuthService, 'getUserRole').and.returnValue('consumer');
      spyOn(PermissionFactory, 'checkPermission').and.returnValue(false);
    }));

    describe('hasRole', function() {
      it('should return true when user role matches required role', function() {
        AuthService.getUserRole.and.returnValue('seller');

        var hasRole = RBACService.hasRole('seller');

        expect(hasRole).toBe(true);
      });

      it('should return true when user is admin regardless of required role', function() {
        AuthService.getUserRole.and.returnValue('admin');

        var hasRole = RBACService.hasRole('seller');

        expect(hasRole).toBe(true);
      });

      it('should return false when user role does not match required role', function() {
        AuthService.getUserRole.and.returnValue('consumer');

        var hasRole = RBACService.hasRole('seller');

        expect(hasRole).toBe(false);
      });

      it('should return false when user is not authenticated', function() {
        AuthService.isAuthenticated.and.returnValue(false);

        var hasRole = RBACService.hasRole('consumer');

        expect(hasRole).toBe(false);
      });

      it('should return true for admin when checking admin role', function() {
        AuthService.getUserRole.and.returnValue('admin');

        var hasRole = RBACService.hasRole('admin');

        expect(hasRole).toBe(true);
      });
    });

    describe('hasPermission', function() {
      it('should return true when user has permission', function() {
        AuthService.getUserRole.and.returnValue('seller');
        PermissionFactory.checkPermission.and.returnValue(true);

        var hasPermission = RBACService.hasPermission('manage_own_products');

        expect(PermissionFactory.checkPermission).toHaveBeenCalledWith('seller', 'manage_own_products');
        expect(hasPermission).toBe(true);
      });

      it('should return false when user does not have permission', function() {
        AuthService.getUserRole.and.returnValue('consumer');
        PermissionFactory.checkPermission.and.returnValue(false);

        var hasPermission = RBACService.hasPermission('manage_users');

        expect(PermissionFactory.checkPermission).toHaveBeenCalledWith('consumer', 'manage_users');
        expect(hasPermission).toBe(false);
      });

      it('should check permission for admin role', function() {
        AuthService.getUserRole.and.returnValue('admin');
        PermissionFactory.checkPermission.and.returnValue(true);

        var hasPermission = RBACService.hasPermission('fraud_detection');

        expect(PermissionFactory.checkPermission).toHaveBeenCalledWith('admin', 'fraud_detection');
        expect(hasPermission).toBe(true);
      });
    });

    describe('validateRole', function() {
      it('should return true when user has required role', function() {
        AuthService.getUserRole.and.returnValue('seller');
        AuthService.isAuthenticated.and.returnValue(true);

        var result = RBACService.validateRole('seller');

        expect(result).toBe(true);
      });

      it('should return true when user is admin', function() {
        AuthService.getUserRole.and.returnValue('admin');
        AuthService.isAuthenticated.and.returnValue(true);

        var result = RBACService.validateRole('seller');

        expect(result).toBe(true);
      });

      it('should throw error when user does not have required role', function() {
        AuthService.getUserRole.and.returnValue('consumer');
        AuthService.isAuthenticated.and.returnValue(true);

        expect(function() {
          RBACService.validateRole('admin');
        }).toThrowError('Unauthorized access');
      });

      it('should throw error when user is not authenticated', function() {
        AuthService.isAuthenticated.and.returnValue(false);

        expect(function() {
          RBACService.validateRole('consumer');
        }).toThrowError('Unauthorized access');
      });
    });
  });
})();