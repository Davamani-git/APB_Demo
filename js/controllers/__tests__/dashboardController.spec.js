describe('DashboardController', function() {
    var $controller;
    var $rootScope;
    var $scope;
    var $timeout;
    var dataServiceMock;
    var bootstrapMock;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(function() {
        dataServiceMock = jasmine.createSpyObj('dataService', [
            'getCards',
            'getTransactions',
            'getFilteredTransactions',
            'getUniqueCategories',
            'getDashboardSummary',
            'getCategorySpending',
            'getMonthlySpendingTrend',
            'getMonthlySpendForecast',
            'getTopSpendingGroups'
        ]);

        // Provide a minimal bootstrap Modal mock to avoid real DOM interactions
        bootstrapMock = {
            Modal: function() {
                return {
                    show: jasmine.createSpy('show')
                };
            }
        };

        module(function($provide) {
            $provide.value('dataService', dataServiceMock);
            $provide.value('bootstrap', bootstrapMock);
        });
    });

    beforeEach(inject(function(_$controller_, _$rootScope_, _$timeout_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $scope = $rootScope.$new();
    }));

    function createController() {
        return $controller('DashboardController as vm', {
            $scope: $scope,
            $timeout: $timeout,
            dataService: dataServiceMock
        });
    }

    describe('initialization', function() {
        it('should initialize with loading true and then false after timeout, populating data and applying filters', function() {
            // Arrange
            var cards = [{ id: 1, creditLimit: 100, outstanding: 50, availableCredit: 50 }];
            var transactions = [];
            var filteredTransactions = [];

            dataServiceMock.getCards.and.returnValue(cards);
            dataServiceMock.getTransactions.and.returnValue(transactions);
            dataServiceMock.getUniqueCategories.and.returnValue(['Shopping']);
            dataServiceMock.getFilteredTransactions.and.returnValue(filteredTransactions);
            dataServiceMock.getDashboardSummary.and.returnValue({
                totalLimit: 100,
                totalOutstanding: 50,
                totalAvailable: 50,
                monthlySpend: 0,
                utilization: 50
            });
            dataServiceMock.getMonthlySpendForecast.and.returnValue(0);
            dataServiceMock.getTopSpendingGroups.and.returnValue([]);
            dataServiceMock.getCategorySpending.and.returnValue({ labels: [], data: [] });
            dataServiceMock.getMonthlySpendingTrend.and.returnValue({ labels: [], data: [] });

            // Act
            var vm = createController();

            // Assert - before timeout
            expect(vm.loading).toBe(true);

            // Act - flush timeout
            $timeout.flush(1000);

            // Assert - after timeout
            expect(vm.loading).toBe(false);
            expect(vm.cards).toBe(cards);
            expect(vm.transactions).toBe(transactions);
            expect(vm.filteredTransactions).toBe(filteredTransactions);
            expect(vm.filterOptions.categories).toEqual(['Shopping']);
            expect(dataServiceMock.getFilteredTransactions).toHaveBeenCalled();
            expect(vm.summary.totalLimit).toBe(100);
        });

        it('should set default filters including date range in init', function() {
            // Arrange
            dataServiceMock.getCards.and.returnValue([]);
            dataServiceMock.getTransactions.and.returnValue([]);
            dataServiceMock.getUniqueCategories.and.returnValue([]);
            dataServiceMock.getFilteredTransactions.and.returnValue([]);
            dataServiceMock.getDashboardSummary.and.returnValue({
                totalLimit: 0,
                totalOutstanding: 0,
                totalAvailable: 0,
                monthlySpend: 0,
                utilization: 0
            });
            dataServiceMock.getMonthlySpendForecast.and.returnValue(0);
            dataServiceMock.getTopSpendingGroups.and.returnValue([]);
            dataServiceMock.getCategorySpending.and.returnValue({ labels: [], data: [] });
            dataServiceMock.getMonthlySpendingTrend.and.returnValue({ labels: [], data: [] });

            // Act
            var vm = createController();
            $timeout.flush(1000);

            // Assert
            expect(vm.filters.merchant).toBe('');
            expect(vm.filters.category).toBe('');
            expect(vm.filters.cardId).toBe('');
            expect(vm.filters.startDate instanceof Date).toBe(true);
            expect(vm.filters.endDate instanceof Date).toBe(true);
        });
    });

    describe('applyFilters', function() {
        it('should update filteredTransactions and recalculate metrics and chart data', function() {
            // Arrange
            var vm = createController();
            dataServiceMock.getFilteredTransactions.and.returnValue([{ id: 'TX1', date: new Date(), amount: 100 }]);
            dataServiceMock.getDashboardSummary.and.returnValue({
                totalLimit: 200,
                totalOutstanding: 50,
                totalAvailable: 150,
                monthlySpend: 100,
                utilization: 25
            });
            dataServiceMock.getMonthlySpendForecast.and.returnValue(500);
            dataServiceMock.getTopSpendingGroups.and.returnValues(
                [{ category: 'Shopping', amount: 100 }],
                [{ merchant: 'Amazon', amount: 100 }]
            );
            dataServiceMock.getCategorySpending.and.returnValue({ labels: ['Shopping'], data: [100] });
            dataServiceMock.getMonthlySpendingTrend.and.returnValue({ labels: ['Jan'], data: [100] });

            // Act
            vm.applyFilters();

            // Assert
            expect(dataServiceMock.getFilteredTransactions).toHaveBeenCalledWith(vm.filters);
            expect(vm.filteredTransactions.length).toBe(1);
            expect(vm.summary.totalLimit).toBe(200);
            expect(vm.monthlyForecast).toBe(500);
            expect(vm.topCategories.length).toBe(1);
            expect(vm.topMerchants.length).toBe(1);
            expect(vm.categoryChart.labels).toEqual(['Shopping']);
            expect(vm.categoryChart.data).toEqual([100]);
            expect(vm.monthlyTrendChart.labels).toEqual(['Jan']);
            expect(vm.monthlyTrendChart.data).toEqual([[100]]);
        });
    });

    describe('getCardById', function() {
        it('should return the card when a matching id is found', function() {
            // Arrange
            var vm = createController();
            vm.cards = [
                { id: 1, cardName: 'Card 1' },
                { id: 2, cardName: 'Card 2' }
            ];

            // Act
            var result = vm.getCardById(2);

            // Assert
            expect(result.cardName).toBe('Card 2');
        });

        it('should return an empty object when no card matches the id', function() {
            // Arrange
            var vm = createController();
            vm.cards = [{ id: 1, cardName: 'Card 1' }];

            // Act
            var result = vm.getCardById(999);

            // Assert
            expect(result).toEqual({});
        });

        it('should handle null and undefined cardId without throwing', function() {
            // Arrange
            var vm = createController();
            vm.cards = [{ id: 1, cardName: 'Card 1' }];

            // Act
            var resultNull = vm.getCardById(null);
            var resultUndefined = vm.getCardById(undefined);

            // Assert
            expect(resultNull).toEqual({});
            expect(resultUndefined).toEqual({});
        });
    });

    describe('sortData', function() {
        it('should set sortColumn and toggle sortReverse when same column is provided', function() {
            // Arrange
            var vm = createController();
            vm.sortColumn = 'date';
            vm.sortReverse = false;

            // Act
            vm.sortData('date');

            // Assert
            expect(vm.sortColumn).toBe('date');
            expect(vm.sortReverse).toBe(true);
        });

        it('should reset sortReverse to false when a new column is provided', function() {
            // Arrange
            var vm = createController();
            vm.sortColumn = 'date';
            vm.sortReverse = true;

            // Act
            vm.sortData('merchant');

            // Assert
            expect(vm.sortColumn).toBe('merchant');
            expect(vm.sortReverse).toBe(false);
        });
    });

    describe('getSortIcon', function() {
        it('should return fa-sort when column is not the current sortColumn', function() {
            // Arrange
            var vm = createController();
            vm.sortColumn = 'date';
            vm.sortReverse = false;

            // Act
            var icon = vm.getSortIcon('merchant');

            // Assert
            expect(icon).toBe('fa-sort');
        });

        it('should return fa-sort-up when sortReverse is false for active column', function() {
            // Arrange
            var vm = createController();
            vm.sortColumn = 'amount';
            vm.sortReverse = false;

            // Act
            var icon = vm.getSortIcon('amount');

            // Assert
            expect(icon).toBe('fa-sort-up');
        });

        it('should return fa-sort-down when sortReverse is true for active column', function() {
            // Arrange
            var vm = createController();
            vm.sortColumn = 'amount';
            vm.sortReverse = true;

            // Act
            var icon = vm.getSortIcon('amount');

            // Assert
            expect(icon).toBe('fa-sort-down');
        });
    });

    describe('toggleDarkMode', function() {
        it('should toggle isDarkMode flag', function() {
            // Arrange
            var vm = createController();
            vm.isDarkMode = false;

            // Act
            vm.toggleDarkMode();

            // Assert
            expect(vm.isDarkMode).toBe(true);

            // Act
            vm.toggleDarkMode();

            // Assert
            expect(vm.isDarkMode).toBe(false);
        });
    });

    describe('exportToCSV', function() {
        var originalDocument;

        beforeEach(function() {
            // Mock document.createElement and related DOM operations
            originalDocument = window.document;

            var linkMock = {
                setAttribute: jasmine.createSpy('setAttribute'),
                click: jasmine.createSpy('click')
            };

            spyOn(window.document, 'createElement').and.returnValue(linkMock);
            spyOn(window.document.body, 'appendChild');
            spyOn(window.document.body, 'removeChild');
        });

        it('should generate CSV content and attempt to create and click a download link when there are filtered transactions', function() {
            // Arrange
            var vm = createController();
            vm.filteredTransactions = [{
                date: new Date('2024-01-01T00:00:00Z'),
                merchant: 'Amazon',
                category: 'Shopping',
                amount: 100,
                cardId: 1,
                status: 'Completed'
            }];
            vm.cards = [{ id: 1, cardName: 'Card 1' }];

            // Act
            vm.exportToCSV();

            // Assert
            expect(window.document.createElement).toHaveBeenCalledWith('a');
            expect(window.document.body.appendChild).toHaveBeenCalled();
            expect(window.document.body.removeChild).toHaveBeenCalled();
        });

        it('should handle empty filteredTransactions without throwing and still create link', function() {
            // Arrange
            var vm = createController();
            vm.filteredTransactions = [];
            vm.cards = [];

            // Act
            vm.exportToCSV();

            // Assert
            expect(window.document.createElement).toHaveBeenCalledWith('a');
        });
    });

    describe('showTransactionDetails', function() {
        it('should set selectedTransaction and invoke bootstrap Modal.show', function() {
            // Arrange
            var vm = createController();
            var tx = { id: 'TX1' };
            var modalInstance = { show: jasmine.createSpy('show') };
            spyOn(bootstrapMock, 'Modal').and.returnValue(modalInstance);
            spyOn(window.document, 'getElementById').and.returnValue({});

            // Act
            vm.showTransactionDetails(tx);

            // Assert
            expect(vm.selectedTransaction).toBe(tx);
            expect(bootstrapMock.Modal).toHaveBeenCalled();
            expect(modalInstance.show).toHaveBeenCalled();
        });
    });

});
/*
Test Documentation:
- Test Name: DashboardController
- Purpose: Validate the behavior of the dashboard view model including initialization, filtering, sorting, theming, CSV export, and transaction detail display.
- Scenario: Normal operation with valid data, edge cases such as empty datasets and invalid card IDs, and error-like cases such as DOM interactions being mocked.
- Expected Result: The controller initializes correctly, interacts with dataService as expected, correctly manages filters and sorting, toggles dark mode, generates CSV exports without relying on real DOM, and shows transaction details using a mocked bootstrap Modal.
*/
/*
Coverage Report:
- Functions tested:
  - init
  - applyFilters
  - getCardById
  - sortData
  - getSortIcon
  - exportToCSV
  - toggleDarkMode
  - showTransactionDetails
- Statements covered:
  - Initialization of view model properties
  - $timeout-based data loading and filter application
  - Metric and chart data preparation via dataService calls
  - CSV header and row generation logic
  - Dark mode flag toggling and transaction selection
- Branches covered:
  - sortData when the same column is re-selected vs a new column
  - getSortIcon for active vs inactive columns and sortReverse true/false
  - getCardById when card exists vs does not exist vs null/undefined id
  - exportToCSV with non-empty vs empty filteredTransactions
- Error scenarios covered:
  - DOM-related operations mock for exportToCSV to avoid real browser interactions
  - bootstrap Modal interactions mocked to prevent real UI operations
- Uncovered scenarios:
  - Exact CSV string content verification (only structural behavior tested)
  - Real integration with angular-chart.js directives and Chart.js rendering
  - Persistence of dark mode preference (e.g., localStorage) not present in current implementation
*/