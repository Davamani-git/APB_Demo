/*
Test Documentation:
- Test Name: ToastFactory success method with toastr
- Purpose: Validates success toast display using toastr library
- Scenario: toastr is available globally
- Expected Result: toastr.success is called with message
*/
/*
Test Documentation:
- Test Name: ToastFactory success method without toastr
- Purpose: Validates fallback to alert when toastr unavailable
- Scenario: toastr is not defined
- Expected Result: alert is called with message
*/
/*
Test Documentation:
- Test Name: ToastFactory error method
- Purpose: Validates error toast display
- Scenario: toastr is available
- Expected Result: toastr.error is called with message
*/
/*
Test Documentation:
- Test Name: ToastFactory info method
- Purpose: Validates info toast display
- Scenario: toastr is available
- Expected Result: toastr.info is called with message
*/
/*
Test Documentation:
- Test Name: ToastFactory warning method
- Purpose: Validates warning toast display
- Scenario: toastr is available
- Expected Result: toastr.warning is called with message
*/
/*
Coverage Report:
- Functions tested: success, error, info, warning
- Scenarios covered: all toast types with toastr, fallback to alert
- Uncovered scenarios: none
*/

describe('ToastFactory', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var ToastFactory;
  var originalToastr;
  var originalAlert;
  
  beforeEach(inject(function(_ToastFactory_) {
    ToastFactory = _ToastFactory_;
    originalToastr = window.toastr;
    originalAlert = window.alert;
  }));
  
  afterEach(function() {
    window.toastr = originalToastr;
    window.alert = originalAlert;
  });
  
  describe('success', function() {
    it('should call toastr.success when toastr is available', function() {
      window.toastr = {
        success: jasmine.createSpy('success')
      };
      
      ToastFactory.success('Operation successful');
      
      expect(window.toastr.success).toHaveBeenCalledWith('Operation successful');
    });
    
    it('should call alert when toastr is not available', function() {
      window.toastr = undefined;
      window.alert = jasmine.createSpy('alert');
      
      ToastFactory.success('Operation successful');
      
      expect(window.alert).toHaveBeenCalledWith('Operation successful');
    });
  });
  
  describe('error', function() {
    it('should call toastr.error when toastr is available', function() {
      window.toastr = {
        error: jasmine.createSpy('error')
      };
      
      ToastFactory.error('Operation failed');
      
      expect(window.toastr.error).toHaveBeenCalledWith('Operation failed');
    });
    
    it('should call alert when toastr is not available', function() {
      window.toastr = undefined;
      window.alert = jasmine.createSpy('alert');
      
      ToastFactory.error('Operation failed');
      
      expect(window.alert).toHaveBeenCalledWith('Operation failed');
    });
  });
  
  describe('info', function() {
    it('should call toastr.info when toastr is available', function() {
      window.toastr = {
        info: jasmine.createSpy('info')
      };
      
      ToastFactory.info('Information message');
      
      expect(window.toastr.info).toHaveBeenCalledWith('Information message');
    });
    
    it('should call alert when toastr is not available', function() {
      window.toastr = undefined;
      window.alert = jasmine.createSpy('alert');
      
      ToastFactory.info('Information message');
      
      expect(window.alert).toHaveBeenCalledWith('Information message');
    });
  });
  
  describe('warning', function() {
    it('should call toastr.warning when toastr is available', function() {
      window.toastr = {
        warning: jasmine.createSpy('warning')
      };
      
      ToastFactory.warning('Warning message');
      
      expect(window.toastr.warning).toHaveBeenCalledWith('Warning message');
    });
    
    it('should call alert when toastr is not available', function() {
      window.toastr = undefined;
      window.alert = jasmine.createSpy('alert');
      
      ToastFactory.warning('Warning message');
      
      expect(window.alert).toHaveBeenCalledWith('Warning message');
    });
  });
});