/*
Test Documentation:
- Test Name: NotificationService - error method
- Purpose: Validates that the error method logs to console.error and displays an alert
- Scenario: Call error method with a message
- Expected Result: console.error is called with 'Error:' prefix and alert is displayed with the message
*/
/*
Test Documentation:
- Test Name: NotificationService - success method
- Purpose: Validates that the success method logs to console.log
- Scenario: Call success method with a message
- Expected Result: console.log is called with 'Success:' prefix and the message
*/
/*
Test Documentation:
- Test Name: NotificationService - info method
- Purpose: Validates that the info method logs to console.info
- Scenario: Call info method with a message
- Expected Result: console.info is called with 'Info:' prefix and the message
*/
/*
Coverage Report:
- Functions tested: error, success, info
- Scenarios covered: error notification with console and alert, success notification with console log, info notification with console info
- Uncovered scenarios: none
*/

describe('NotificationService', function() {
  'use strict';
  
  beforeEach(module('app.shared'));
  
  var NotificationService;
  
  beforeEach(inject(function(_NotificationService_) {
    NotificationService = _NotificationService_;
  }));
  
  describe('error method', function() {
    it('should log error message to console.error and display alert', function() {
      spyOn(console, 'error');
      spyOn(window, 'alert');
      
      var errorMessage = 'Test error message';
      NotificationService.error(errorMessage);
      
      expect(console.error).toHaveBeenCalledWith('Error:', errorMessage);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
    
    it('should handle empty error message', function() {
      spyOn(console, 'error');
      spyOn(window, 'alert');
      
      NotificationService.error('');
      
      expect(console.error).toHaveBeenCalledWith('Error:', '');
      expect(window.alert).toHaveBeenCalledWith('');
    });
    
    it('should handle null error message', function() {
      spyOn(console, 'error');
      spyOn(window, 'alert');
      
      NotificationService.error(null);
      
      expect(console.error).toHaveBeenCalledWith('Error:', null);
      expect(window.alert).toHaveBeenCalledWith(null);
    });
  });
  
  describe('success method', function() {
    it('should log success message to console.log', function() {
      spyOn(console, 'log');
      
      var successMessage = 'Test success message';
      NotificationService.success(successMessage);
      
      expect(console.log).toHaveBeenCalledWith('Success:', successMessage);
    });
    
    it('should handle empty success message', function() {
      spyOn(console, 'log');
      
      NotificationService.success('');
      
      expect(console.log).toHaveBeenCalledWith('Success:', '');
    });
    
    it('should handle undefined success message', function() {
      spyOn(console, 'log');
      
      NotificationService.success(undefined);
      
      expect(console.log).toHaveBeenCalledWith('Success:', undefined);
    });
  });
  
  describe('info method', function() {
    it('should log info message to console.info', function() {
      spyOn(console, 'info');
      
      var infoMessage = 'Test info message';
      NotificationService.info(infoMessage);
      
      expect(console.info).toHaveBeenCalledWith('Info:', infoMessage);
    });
    
    it('should handle empty info message', function() {
      spyOn(console, 'info');
      
      NotificationService.info('');
      
      expect(console.info).toHaveBeenCalledWith('Info:', '');
    });
    
    it('should handle complex object as info message', function() {
      spyOn(console, 'info');
      
      var complexObject = { key: 'value', nested: { data: 123 } };
      NotificationService.info(complexObject);
      
      expect(console.info).toHaveBeenCalledWith('Info:', complexObject);
    });
  });
});