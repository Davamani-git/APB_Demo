describe('dashboardController', function () {
    var $controller;
    var $rootScope;
    var $scope;
    var $filter;
    var mockDataService;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(module(function ($provide) {
        mockDataService = jasmine.createSpyObj('dataService', ['getCards', 'getTransactions']);

        var mockCards = [
            {
                id: 1,
                cardName: 'Card One',
                bank: 'Bank A',
                cardNumber: 'XXXX-XXXX-XXXX-1111',
                creditLimit: 100000,
                availableCredit: 60000,
                outstanding: 40000,
                billingDate: '5',
                dueDate: '25'
            },
            {
                id: 2,
                cardName: 'Card Two',
                bank: 'Bank B',
                cardNumber: 'XXXX-XXXX-XXXX-2222',
                creditLimit: 200000,
                availableCredit: 100000,
                outstanding: 100000,
                billingDate: '10',
                dueDate: '30'
            }
        ];

        var today = new Date();
        var thisMonthDate = new Date(today.getFullYear(), today.getMonth(), 10).toISOString();
        var lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString();

        var mockTransactions = [
            {
                id: 'TXN1',
                date: thisMonthDate,
                merchant: 'Amazon',
                amount: 5000,
                category: 'Shopping',
                cardId: 1,
                status: 'Settled',
                remarks: 'Online Payment'
            },
            {
                id: 'TXN2',
                date: lastMonthDate,
                merchant: 'Swiggy',
                amount: 1500,
                category: 'Food & Dining',
                cardId: 2,
                status: 'Pending',
                remarks: 'Food Order'
            }
        ];

        mockDataService.getCards.and.returnValue(mockCards);
        mockDataService.getTransactions.and.returnValue(mockTransactions);

        $provide.value('dataService', mockDataService);
    }));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$filter_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $filter = _$filter_;
        $scope = $rootScope.$new();
        $controller('dashboardController', {
            $scope: $scope,
            $filter: $filter,
            dataService: mockDataService
        });
    }));

    describe('initialization and metrics', function () {
        it('should initialize loading state to false after dashboard setup (normal case)', function () {
            // Arrange
            // Act
            // Controller initialization happens in beforeEach

            // Assert
            expect($scope.loading).toBe(false);
        });

        it('should load cards and transactions from dataService (dependency interaction)', function () {
            // Arrange
            // Act

            // Assert
            expect(mockDataService.getCards).toHaveBeenCalled();
            expect(mockDataService.getTransactions).toHaveBeenCalled();
            expect($scope.cards.length).toBe(2);
            expect($scope.transactions.length).toBe(2);
        });

        it('should calculate total credit metrics correctly (normal case)', function () {
            // Arrange
            // Act

            // Assert
            expect($scope.totalCreditLimit).toBe(300000);
            expect($scope.totalAvailableCredit).toBe(160000);
            expect($scope.totalOutstanding).toBe(140000);
            expect($scope.utilizationPercentage).toBeCloseTo(($scope.totalOutstanding / $scope.totalCreditLimit) * 100, 5);
        });

        it('should calculate totalMonthlySpend for current month only (branch logic)', function () {
            // Arrange
            var today = new Date();

            // Act
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            var manualCurrentMonthSpend = 0;
            $scope.transactions.forEach(function (tx) {
                var txDate = new Date(tx.date);
                if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                    manualCurrentMonthSpend += tx.amount;
                }
            });

            // Assert
            expect($scope.totalMonthlySpend).toBe(manualCurrentMonthSpend);
        });

        it('should set budget utilization based on monthly budget and totalMonthlySpend (normal case)', function () {
            // Arrange
            // Act

            // Assert
            expect($scope.monthlyBudget).toBe(200000);
            expect($scope.budgetUtilization).toBeCloseTo(($scope.totalMonthlySpend / $scope.monthlyBudget) * 100, 5);
        });

        it('should calculate spend forecast when totalMonthlySpend > 0 (forecast positive branch)', function () {
            // Arrange
            // Act

            // Assert
            expect($scope.spendForecast).toBeGreaterThan(0);
        });

        it('should calculate topCategories and topMerchants maps (normal case)', function () {
            // Arrange
            // Act

            // Assert
            expect($scope.topCategories).toBeDefined();
            expect(Object.keys($scope.topCategories).length).toBeGreaterThan(0);
            expect($scope.topMerchants).toBeDefined();
            expect(Object.keys($scope.topMerchants).length).toBeGreaterThan(0);
        });

        it('should build transactionCategories from unique transaction categories (normal case)', function () {
            // Arrange
            var expectedCategories = ['Food & Dining', 'Shopping'];

            // Act
            var categories = $scope.transactionCategories;

            // Assert
            expect(categories).toEqual(expectedCategories.sort());
        });
    });

    describe('getCardById', function () {
        it('should return the card object when ID exists (normal case)', function () {
            // Arrange
            var cardId = 1;

            // Act
            var card = $scope.getCardById(cardId);

            // Assert
            expect(card).toBeDefined();
            expect(card.id).toBe(cardId);
            expect(card.cardName).toBe('Card One');
        });

        it('should return an empty object when card ID does not exist (edge case)', function () {
            // Arrange
            var nonExistingId = 999;

            // Act
            var card = $scope.getCardById(nonExistingId);

            // Assert
            expect(card).toEqual({});
        });

        it('should handle null or undefined cardId safely (error/edge case)', function () {
            // Arrange
            // Act
            var cardNull = $scope.getCardById(null);
            var cardUndefined = $scope.getCardById(undefined);

            // Assert
            expect(cardNull).toEqual({});
            expect(cardUndefined).toEqual({});
        });
    });

    describe('toggleDarkMode', function () {
        it('should toggle darkMode flag (normal interaction case)', function () {
            // Arrange
            var initialState = $scope.darkMode;

            // Act
            $scope.toggleDarkMode();

            // Assert
            expect($scope.darkMode).toBe(!initialState);
        });

        it('should toggle darkMode multiple times consistently (state transition case)', function () {
            // Arrange
            // Act
            $scope.toggleDarkMode();
            var afterFirstToggle = $scope.darkMode;
            $scope.toggleDarkMode();
            var afterSecondToggle = $scope.darkMode;

            // Assert
            expect(afterSecondToggle).toBe(!afterFirstToggle);
        });
    });

    describe('sortBy', function () {
        it('should change sort column when new column provided (branch case)', function () {
            // Arrange
            var initialColumn = $scope.sort.column;

            // Act
            $scope.sortBy('merchant');

            // Assert
            expect($scope.sort.column).toBe('merchant');
            expect($scope.sort.reverse).toBe(false);
            expect($scope.sort.column).not.toBe(initialColumn);
        });

        it('should toggle sort.reverse when same column is clicked (branch case)', function () {
            // Arrange
            var initialReverse = $scope.sort.reverse;
            var initialColumn = $scope.sort.column;

            // Act
            $scope.sortBy(initialColumn);

            // Assert
            expect($scope.sort.reverse).toBe(!initialReverse);
        });
    });

    describe('getSortIcon', function () {
        it('should return fa-sort-up when sorting ascending on a column (branch case)', function () {
            // Arrange
            $scope.sort.column = 'merchant';
            $scope.sort.reverse = false;

            // Act
            var icon = $scope.getSortIcon('merchant');

            // Assert
            expect(icon).toBe('fa-sort-up');
        });

        it('should return fa-sort-down when sorting descending on a column (branch case)', function () {
            // Arrange
            $scope.sort.column = 'amount';
            $scope.sort.reverse = true;

            // Act
            var icon = $scope.getSortIcon('amount');

            // Assert
            expect(icon).toBe('fa-sort-down');
        });

        it('should return fa-sort when column is not the active sort column (default branch)', function () {
            // Arrange
            $scope.sort.column = 'date';
            $scope.sort.reverse = true;

            // Act
            var icon = $scope.getSortIcon('merchant');

            // Assert
            expect(icon).toBe('fa-sort');
        });
    });

    describe('showTransactionDetails', function () {
        it('should set selectedTransaction on scope (normal case)', function () {
            // Arrange
            var tx = $scope.transactions[0];

            // Act
            $scope.showTransactionDetails(tx);

            // Assert
            expect($scope.selectedTransaction).toBe(tx);
        });

        it('should handle null transaction gracefully (edge case)', function () {
            // Arrange
            // Act
            $scope.showTransactionDetails(null);

            // Assert
            expect($scope.selectedTransaction).toBeNull();
        });
    });

    describe('exportToCSV', function () {
        var originalCreateElement;
        var originalBodyAppendChild;
        var originalBodyRemoveChild;
        var mockLinkElement;

        beforeEach(function () {
            // Arrange: mock document.createElement and document.body interaction
            originalCreateElement = document.createElement;
            mockLinkElement = {
                setAttribute: jasmine.createSpy('setAttribute'),
                click: jasmine.createSpy('click')
            };

            document.createElement = jasmine.createSpy('createElement').and.returnValue(mockLinkElement);

            originalBodyAppendChild = document.body.appendChild;
            originalBodyRemoveChild = document.body.removeChild;
            spyOn(document.body, 'appendChild').and.callFake(function () {});
            spyOn(document.body, 'removeChild').and.callFake(function () {});
        });

        afterEach(function () {
            // Restore originals to avoid side effects across specs
            document.createElement = originalCreateElement;
            document.body.appendChild = originalBodyAppendChild;
            document.body.removeChild = originalBodyRemoveChild;
        });

        it('should construct a CSV link and trigger download with filtered transactions (normal case)', function () {
            // Arrange
            $scope.filters.search = '';
            $scope.sort.column = 'date';
            $scope.sort.reverse = true;

            // Act
            $scope.exportToCSV();

            // Assert
            expect(document.createElement).toHaveBeenCalledWith('a');
            expect(mockLinkElement.setAttribute).toHaveBeenCalledWith('href', jasmine.any(String));
            expect(mockLinkElement.setAttribute).toHaveBeenCalledWith('download', 'transactions.csv');
            expect(document.body.appendChild).toHaveBeenCalledWith(mockLinkElement);
            expect(mockLinkElement.click).toHaveBeenCalled();
            expect(document.body.removeChild).toHaveBeenCalledWith(mockLinkElement);
        });

        it('should handle case where no transactions match filter by still creating CSV header row only (edge case)', function () {
            // Arrange
            $scope.transactions = [];
            $scope.filters.search = 'NonExistingMerchant';

            // Act
            $scope.exportToCSV();

            // Assert
            expect(document.createElement).toHaveBeenCalledWith('a');
            expect(mockLinkElement.setAttribute).toHaveBeenCalledWith('href', jasmine.any(String));
            expect(mockLinkElement.setAttribute).toHaveBeenCalledWith('download', 'transactions.csv');
            expect(mockLinkElement.click).toHaveBeenCalled();
        });
    });
});

/*
Test Documentation:
- Test Name: dashboardController behavior
- Purpose: Validate initialization, metric calculations, helper utilities, UI interaction handlers, and CSV export logic of dashboardController.
- Scenario: Normal data loading from mocked dataService, edge cases for helper methods, branch logic for sorting and icons, and safe handling of DOM-dependent CSV export.
- Expected Result: Controller correctly initializes scope state, computes metrics, handles user interactions, and exports CSV without hitting real browser APIs directly.
*/

/*
Coverage Report:
- Functions tested:
  - initializeDashboard (indirectly via controller instantiation)
  - calculateDashboardMetrics (indirectly via initialization)
  - prepareChartData (indirectly via initialization)
  - getCardById
  - calculateForecast (indirectly via calculateDashboardMetrics)
  - toggleDarkMode
  - sortBy
  - getSortIcon
  - showTransactionDetails
  - exportToCSV
- Statements covered:
  - All assignments in initialization block
  - All computations inside calculateDashboardMetrics and calculateForecast for non-zero spend
  - Chart data preparation for category and monthly charts
  - Helper map creation for topCategories, topMerchants, and transactionCategories
  - Branch paths in sortBy and getSortIcon
  - CSV building and DOM interaction via mocked document APIs
- Branches covered:
  - sortBy: same column (toggle reverse) and new column (change column and reset reverse)
  - getSortIcon: active column with reverse true/false, non-active column default
  - calculateForecast: branch where totalMonthlySpend > 0 and dayOfMonth > 0 (positive forecast)
  - getCardById: card found vs card not found vs null/undefined parameter
  - exportToCSV: normal transactions list vs empty/filtered-out transactions
- Error scenarios covered:
  - Handling of unknown card IDs and null/undefined cardId without throwing errors
  - Handling of null transaction in showTransactionDetails
  - Safe execution of exportToCSV when transactions array is empty or filters match no records
- Uncovered scenarios:
  - calculateForecast branch where totalMonthlySpend is 0 or dayOfMonth is 0 (e.g., first day of month with no spend)
  - Detailed verification of chartOptions and resulting chart configuration objects consumed by angular-chart.js
  - Behavior when document.createElement or document.body APIs throw errors (browser-level failures)
*/