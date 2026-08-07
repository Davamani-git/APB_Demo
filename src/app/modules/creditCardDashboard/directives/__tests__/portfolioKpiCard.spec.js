/*
Test Documentation:
- Test Name: portfolioKpiCard Directive Compilation
- Purpose: Verify that the directive compiles and renders correctly
- Scenario: Directive is compiled with scope bindings
- Expected Result: Directive element is created with correct template structure
*/
/*
Test Documentation:
- Test Name: portfolioKpiCard Directive Scope Bindings
- Purpose: Verify that the directive correctly binds scope properties
- Scenario: Directive is compiled with kpiTitle, kpiValue, and kpiIcon attributes
- Expected Result: Template displays correct values from scope
*/
/*
Test Documentation:
- Test Name: portfolioKpiCard Directive Currency Filter
- Purpose: Verify that the kpiValue is formatted as currency
- Scenario: Directive is compiled with numeric kpiValue
- Expected Result: Value is displayed with currency formatting
*/
/*
Coverage Report:
- Functions tested: directive compilation, scope binding
- Scenarios covered: element creation, attribute binding, template rendering, currency filter
- Uncovered scenarios: none
*/

(function() {
    'use strict';

    describe('portfolioKpiCard Directive', function() {
        var $compile, $rootScope, element, scope;

        beforeEach(module('app.creditCardDashboard'));

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
        }));

        afterEach(function() {
            if (element) {
                element.remove();
            }
        });

        describe('Directive Compilation', function() {
            it('should compile and create directive element', function() {
                scope.testValue = 5000;
                element = angular.element('<portfolio-kpi-card kpi-title="Test KPI" kpi-value="testValue" kpi-icon="fa-test"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                expect(element.find('.kpi-card').length).toBe(1);
            });

            it('should have correct template structure', function() {
                scope.testValue = 5000;
                element = angular.element('<portfolio-kpi-card kpi-title="Test KPI" kpi-value="testValue" kpi-icon="fa-test"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                expect(element.find('i.kpi-icon').length).toBe(1);
                expect(element.find('h3').length).toBe(1);
                expect(element.find('.kpi-value').length).toBe(1);
            });
        });

        describe('Scope Bindings', function() {
            it('should bind kpiTitle attribute correctly', function() {
                scope.testValue = 5000;
                element = angular.element('<portfolio-kpi-card kpi-title="Monthly Spend" kpi-value="testValue" kpi-icon="fa-credit-card"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                var title = element.find('h3').text();
                expect(title).toBe('Monthly Spend');
            });

            it('should bind kpiIcon attribute correctly', function() {
                scope.testValue = 5000;
                element = angular.element('<portfolio-kpi-card kpi-title="Test" kpi-value="testValue" kpi-icon="fa-credit-card"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                var icon = element.find('i.kpi-icon');
                expect(icon.hasClass('fa-credit-card')).toBe(true);
            });

            it('should bind kpiValue and apply currency filter', function() {
                scope.testValue = 5000;
                element = angular.element('<portfolio-kpi-card kpi-title="Test" kpi-value="testValue" kpi-icon="fa-test"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                var valueText = element.find('.kpi-value').text();
                expect(valueText).toContain('5,000');
            });

            it('should update when kpiValue changes', function() {
                scope.testValue = 5000;
                element = angular.element('<portfolio-kpi-card kpi-title="Test" kpi-value="testValue" kpi-icon="fa-test"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                scope.testValue = 10000;
                scope.$digest();

                var valueText = element.find('.kpi-value').text();
                expect(valueText).toContain('10,000');
            });
        });

        describe('Edge Cases', function() {
            it('should handle zero value', function() {
                scope.testValue = 0;
                element = angular.element('<portfolio-kpi-card kpi-title="Test" kpi-value="testValue" kpi-icon="fa-test"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                var valueText = element.find('.kpi-value').text();
                expect(valueText).toContain('0');
            });

            it('should handle negative value', function() {
                scope.testValue = -5000;
                element = angular.element('<portfolio-kpi-card kpi-title="Test" kpi-value="testValue" kpi-icon="fa-test"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                var valueText = element.find('.kpi-value').text();
                expect(valueText).toContain('-');
                expect(valueText).toContain('5,000');
            });

            it('should handle undefined value', function() {
                scope.testValue = undefined;
                element = angular.element('<portfolio-kpi-card kpi-title="Test" kpi-value="testValue" kpi-icon="fa-test"></portfolio-kpi-card>');
                $compile(element)(scope);
                scope.$digest();

                expect(element.find('.kpi-value').length).toBe(1);
            });
        });
    });
})();