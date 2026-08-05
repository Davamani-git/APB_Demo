describe('Factory: AuthInterceptor', function() {
  var AuthInterceptor, AuthContextServiceMock;

  beforeEach(module('appmrn25.shared', function($provide) {
    AuthContextServiceMock = jasmine.createSpyObj('AuthContextService', ['getToken']);
    $provide.value('AuthContextService', AuthContextServiceMock);
  }));

  beforeEach(inject(function(_AuthInterceptor_) {
    AuthInterceptor = _AuthInterceptor_;
  }));

  it('should add Authorization header when token is present', function() {
    // Arrange
    var config = { headers: {} };
    AuthContextServiceMock.getToken.and.returnValue('abc123');

    // Act
    var result = AuthInterceptor.request(config);

    // Assert
    expect(AuthContextServiceMock.getToken).toHaveBeenCalled();
    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  it('should create headers object if none exists and token present', function() {
    // Arrange
    var config = {}; // no headers
    AuthContextServiceMock.getToken.and.returnValue('token-value');

    // Act
    var result = AuthInterceptor.request(config);

    // Assert
    expect(result.headers.Authorization).toBe('Bearer token-value');
  });

  it('should not modify headers when token is not present', function() {
    // Arrange
    var config = { headers: {} };
    AuthContextServiceMock.getToken.and.returnValue(null);

    // Act
    var result = AuthInterceptor.request(config);

    // Assert
    expect(result.headers.Authorization).toBeUndefined();
  });
});

/*
Test Documentation:
- Test Name: AuthInterceptor request behavior
- Purpose: Ensure Authorization header is conditionally added based on token presence.
- Scenario: Invoke request with/without existing headers and with/without token.
- Expected Result: When token exists, Authorization header is set; when no token, headers remain unchanged.
*/

/*
Coverage Report:
- Functions tested: request function of AuthInterceptor.
- Statements covered: Token retrieval, header initialization, header assignment, return statements.
- Branches covered: token truthy vs falsy; headers pre-existing vs undefined.
- Error scenarios covered: None explicitly (no error handling in interceptor).
- Uncovered scenarios: Behavior with complex config objects beyond headers; interaction with other interceptors.
*/