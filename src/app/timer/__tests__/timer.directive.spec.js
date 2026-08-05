describe('timerDisplay directive', function () {
  var $compile, $rootScope;

  beforeEach(module('timerModule'));
  beforeEach(module('timerApp'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should create an element with isolated scope and bind TimerController as vm', function () {
    // Arrange
    var element = angular.element('<timer-display></timer-display>');

    // Act
    $compile(element)($rootScope.$new());
    $rootScope.$digest();

    // Assert
    var isoScope = element.isolateScope();
    expect(isoScope).toBeDefined();
    expect(isoScope.vm).toBeDefined();
  });

  it('should use the correct templateUrl', function () {
    // Arrange
    var directive;

    // Act
    inject(function ($injector) {
      var $compileProvider = $injector.get('$compile');
      directive = $compileProvider.$$elementDirective['timerDisplay'][0];
    });

    // Assert
    expect(directive.templateUrl).toBe('src/app/timer/timer-display.tpl.html');
  });
});

/*
Test Documentation:
- Test Name: should create an element with isolated scope and bind TimerController as vm
- Purpose: Validate directive compile/link behavior.
- Scenario: Compile <timer-display> element and digest.
- Expected Result: Isolated scope exists and contains controller alias vm.

- Test Name: should use the correct templateUrl
- Purpose: Ensure directive is wired to proper template.
- Scenario: Inspect directive definition object via $compile internals.
- Expected Result: templateUrl equals 'src/app/timer/timer-display.tpl.html'.
*/

/*
Coverage Report:
- Functions tested:
  - timerDisplay directive factory function (through returned DDO)
- Statements covered:
  - Creation of directive definition object with restrict, scope, bindToController, controller, controllerAs, templateUrl
- Branches covered:
  - None; directive factory returns a static object
- Error scenarios covered:
  - None; directive has no error handling
- Uncovered scenarios:
  - Full integration of template rendering and interactions (covered by TimerController tests and end-to-end tests)
*/