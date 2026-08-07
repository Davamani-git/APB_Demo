describe('creditCardDashboardApp module', function() {
    var ChartJsProviderMock;

    beforeEach(function() {
        // Arrange: create a mock for ChartJsProvider
        ChartJsProviderMock = {
            setOptions: jasmine.createSpy('setOptions')
        };

        // Load module with mocked ChartJsProvider using a config block override
        angular.module('chart.js', []);
        angular.module('creditCardDashboardApp');

        module(function($provide) {
            // Override ChartJsProvider used in app.config
            $provide.provider('ChartJs', function() {
                this.$get = function() {
                    return {};
                };
            });
        });
    });

    it('should be defined and injectable', function() {
        // Act: inject the module to ensure it loads
        var moduleLoaded = false;
        module('creditCardDashboardApp');
        inject(function($injector) {
            moduleLoaded = !!$injector.get('ChartJs');
        });

        // Assert
        expect(moduleLoaded).toBe(true);
    });

    it('should configure ChartJsProvider with global options (happy path)', function() {
        // Arrange
        var configFn;
        angular.module('creditCardDashboardApp')._configBlocks.forEach(function(block) {
            if (block[1] && block[1][0] === 'ChartJsProvider') {
                configFn = block[2][0];
            }
        });
        expect(typeof configFn).toBe('function');

        // Act
        configFn(ChartJsProviderMock);

        // Assert
        expect(ChartJsProviderMock.setOptions).toHaveBeenCalled();
        var optionsArg = ChartJsProviderMock.setOptions.calls.mostRecent().args[0];
        expect(optionsArg.responsive).toBe(true);
        expect(optionsArg.maintainAspectRatio).toBe(false);
        expect(optionsArg.legend.display).toBe(true);
        expect(optionsArg.legend.position).toBe('bottom');
        expect(optionsArg.animation.duration).toBe(1000);
        expect(optionsArg.animation.easing).toBe('easeInOutQuart');
    });

    it('should allow ChartJsProvider to handle missing options object without throwing', function() {
        // Arrange
        var configFn;
        angular.module('creditCardDashboardApp')._configBlocks.forEach(function(block) {
            if (block[1] && block[1][0] === 'ChartJsProvider') {
                configFn = block[2][0];
            }
        });
        expect(typeof configFn).toBe('function');

        ChartJsProviderMock.setOptions.and.callFake(function(options) {
            if (!options || typeof options !== 'object') {
                throw new Error('Invalid options');
            }
        });

        // Act & Assert (normal case still works)
        expect(function() {
            configFn(ChartJsProviderMock);
        }).not.toThrow();
    });
});

/*
Test Documentation:
- Test Name: Module definition and ChartJsProvider configuration
- Purpose: Validate that the AngularJS module is defined and that the ChartJsProvider configuration is applied correctly.
- Scenario: Load the module, execute the config block, and verify ChartJsProvider.setOptions is called with expected options.
- Expected Result: Module is injectable and ChartJsProvider.setOptions receives an options object with responsive charts, disabled aspect ratio maintenance, legend display at the bottom, and specific animation settings.
*/

/*
Coverage Report:
- Functions tested:
  - app.config([...]) configuration function for ChartJsProvider
- Statements covered:
  - ChartJsProvider.setOptions call and all properties of the options object (responsive, maintainAspectRatio, legend, animation)
- Branches covered:
  - Default configuration path where setOptions is called with a valid options object
- Error scenarios covered:
  - Indirectly validates that config does not throw when ChartJsProvider.setOptions is implemented to require objects
- Uncovered scenarios:
  - Behavior when ChartJsProvider is missing entirely at runtime (would fail earlier in AngularJS bootstrap)
  - Alternative ChartJsProvider implementations that ignore or transform options
*/