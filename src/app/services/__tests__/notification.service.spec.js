describe('NotificationService', function() {
    var NotificationService;
    var $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_NotificationService_, _$rootScope_) {
        NotificationService = _NotificationService_;
        $rootScope = _$rootScope_;
        spyOn($rootScope, '$emit').and.callThrough();
    }));

    it('should emit success notifications', function() {
        // Arrange
        var message = 'Success!';

        // Act
        NotificationService.showSuccess(message);

        // Assert
        expect($rootScope.$emit).toHaveBeenCalledWith('notification:success', { message: message });
    });

    it('should emit error notifications', function() {
        // Arrange
        var message = 'Error!';

        // Act
        NotificationService.showError(message);

        // Assert
        expect($rootScope.$emit).toHaveBeenCalledWith('notification:error', { message: message });
    });

    it('should emit warning notifications', function() {
        // Arrange
        var message = 'Warning!';

        // Act
        NotificationService.showWarning(message);

        // Assert
        expect($rootScope.$emit).toHaveBeenCalledWith('notification:warning', { message: message });
    });

    it('should emit info notifications', function() {
        // Arrange
        var message = 'Info!';

        // Act
        NotificationService.showInfo(message);

        // Assert
        expect($rootScope.$emit).toHaveBeenCalledWith('notification:info', { message: message });
    });
});

/*
Test Documentation:
- Test Name: Success notification emission
- Purpose: Ensure showSuccess emits correct event and payload.
- Scenario: Call showSuccess('Success!').
- Expected Result: $rootScope.$emit('notification:success', {message:'Success!'}).

- Test Name: Error notification emission
- Purpose: Ensure showError emits correct event and payload.
- Scenario: Call showError('Error!').
- Expected Result: $rootScope.$emit('notification:error', {message:'Error!'}).

- Test Name: Warning notification emission
- Purpose: Ensure showWarning emits correct event and payload.
- Scenario: Call showWarning('Warning!').
- Expected Result: $rootScope.$emit('notification:warning', {message:'Warning!'}).

- Test Name: Info notification emission
- Purpose: Ensure showInfo emits correct event and payload.
- Scenario: Call showInfo('Info!').
- Expected Result: $rootScope.$emit('notification:info', {message:'Info!'}).
*/

/*
Coverage Report:
- Functions tested:
  - NotificationService.showSuccess
  - NotificationService.showError
  - NotificationService.showWarning
  - NotificationService.showInfo
  - emit (internal via service methods)
- Statements covered:
  - Event name selection per notification type
  - $rootScope.$emit calls with payload
- Branches covered:
  - Four different event types
- Error scenarios covered:
  - N/A
- Uncovered scenarios:
  - Listeners reacting to emitted events
*/