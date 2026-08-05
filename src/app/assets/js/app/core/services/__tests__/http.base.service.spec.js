describe('Service: BaseHttpService', function() {
  var BaseHttpService, $http, $q, $rootScope;

  beforeEach(module('appmrn25.shared', function($provide) {
    $http = jasmine.createSpyObj('$http', ['get', 'post']);
    $provide.value('$http', $http);
  }));

  beforeEach(inject(function(_BaseHttpService_, _$q_, _$rootScope_) {
    BaseHttpService = _BaseHttpService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  it('should perform GET and resolve with response', function() {
    // Arrange
    var response = { data: { foo: 'bar' } };
    var deferred = $q.defer();
    $http.get.and.returnValue(deferred.promise);

    // Act
    var resultPromise = BaseHttpService.get('/test');
    var result;
    resultPromise.then(function(res) {
      result = res;
    });
    deferred.resolve(response);
    $rootScope.$apply();

    // Assert
    expect($http.get).toHaveBeenCalledWith('/test', {});
    expect(result).toBe(response);
  });

  it('should wrap GET errors and reject with normalized error payload', function() {
    // Arrange
    var errorResponse = { data: { message: 'error' } };
    var deferred = $q.defer();
    $http.get.and.returnValue(deferred.promise);

    // Act
    var resultPromise = BaseHttpService.get('/test');
    var result;
    resultPromise.catch(function(err) {
      result = err;
    });
    deferred.reject(errorResponse);
    $rootScope.$apply();

    // Assert
    expect(result).toEqual(errorResponse.data);
  });

  it('should perform POST and resolve with response', function() {
    // Arrange
    var response = { data: { ok: true } };
    var deferred = $q.defer();
    $http.post.and.returnValue(deferred.promise);

    // Act
    var resultPromise = BaseHttpService.post('/test', { foo: 'bar' });
    var result;
    resultPromise.then(function(res) {
      result = res;
    });
    deferred.resolve(response);
    $rootScope.$apply();

    // Assert
    expect($http.post).toHaveBeenCalledWith('/test', { foo: 'bar' }, {});
    expect(result).toBe(response);
  });

  it('should wrap POST errors and reject with normalized error payload or full response', function() {
    // Arrange
    var errorResponse = { status: 500 };
    var deferred = $q.defer();
    $http.post.and.returnValue(deferred.promise);

    // Act
    var resultPromise = BaseHttpService.post('/test', {});
    var result;
    resultPromise.catch(function(err) {
      result = err;
    });
    deferred.reject(errorResponse);
    $rootScope.$apply();

    // Assert
    expect(result).toBe(errorResponse);
  });
});

/*
Test Documentation:
- Test Name: BaseHttpService GET/POST behavior
- Purpose: Verify that BaseHttpService delegates to $http and normalizes errors.
- Scenario: Successful and failing GET/POST calls with mocked $http.
- Expected Result: GET/POST calls invoke $http.get/post with defaults; errors reject with response.data when present, otherwise response object.
*/

/*
Coverage Report:
- Functions tested: get, post methods of BaseHttpService.
- Statements covered: Config defaulting, $http calls, catch handlers, $q.reject.
- Branches covered: Success vs error for GET and POST; errorResponse.data present vs missing.
- Error scenarios covered: HTTP errors for GET and POST paths.
- Uncovered scenarios: Custom config objects beyond default {}; different HTTP verbs (not implemented).
*/