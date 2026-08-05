describe('Factory: ErrorInterceptor', function() {
  var ErrorInterceptor, $rootScope, $q;

  beforeEach(module('appmrn25.shared'));

  beforeEach(inject(function(_ErrorInterceptor_, _$rootScope_, _$q_) {
    ErrorInterceptor = _ErrorInterceptor_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('should broadcast auth:logout on 401 error and reject with normalized error payload', function() {
    // Arrange
    var rejection = { status: 401, data: { message: 'Unauthorized' } };
    spyOn($rootScope, '$broadcast');

    // Act
    var promise = ErrorInterceptor.responseError(rejection);
    var result;
    promise.catch(function(err) {
      result = err;
    });
    // Trigger digest to resolve promise
    $rootScope.$apply();

    // Assert
    expect($rootScope.$broadcast).toHaveBeenCalledWith('auth:logout');
    expect(result).toEqual(rejection.data);
  });

  it('should not broadcast when status is not 401 and reject with data when available', function() {
    // Arrange
    var rejection = { status: 500, data: { message: 'Server error' } };
    spyOn($rootScope, '$broadcast');

    // Act
    var promise = ErrorInterceptor.responseError(rejection);
    var result;
    promise.catch(function(err) {
      result = err;
    });
    $rootScope.$apply();

    // Assert
    expect($rootScope.$broadcast).not.toHaveBeenCalled();
    expect(result).toEqual(rejection.data);
  });

  it('should reject with entire rejection object when data is not present', function() {
    // Arrange
    var rejection = { status: 400 };
    spyOn($rootScope, '$broadcast');

    // Act
    var promise = ErrorInterceptor.responseError(rejection);
    var result;
    promise.catch(function(err) {
      result = err;
    });
    $rootScope.$apply();

    // Assert
    expect(result).toBe(rejection);
  });
});

/*
Test Documentation:
- Test Name: ErrorInterceptor responseError behavior
- Purpose: Verify that auth:logout events and error normalization are handled correctly.
- Scenario: Invoke responseError with 401, 500 with data, and 400 without data.
- Expected Result: 401 triggers broadcast and rejection of data; non-401 does not broadcast; missing data leads to rejection of original rejection object.
*/

/*
Coverage Report:
- Functions tested: responseError function of ErrorInterceptor.
- Statements covered: Status check, $rootScope.$broadcast call, $q.reject with data or rejection.
- Branches covered: status === 401 vs other; presence vs absence of rejection.data.
- Error scenarios covered: Unauthorized (401), server error (non-401), malformed rejection without data.
- Uncovered scenarios: None significant within current function.
*/