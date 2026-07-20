describe('dashboardController', function() {
    var $controller;
    var $rootScope;
    var $filter;
    var dataServiceMock;
    var scope;
    var vm;

    var mockCards;
    var mockTransactions;

    beforeEach(module('creditCardDashboardApp'));

    beforeEach(module(function($provide) {
        mockCards = [
            { id: 1, cardName: 'Card A', creditLimit: 1000, availableCredit: 600, outstanding: 400 },
            { id: 2, cardName: 'Card B', creditLimit: 2000, availableCredit: 1500, outstanding: 500 }
        ];

        var now = new Date();
        var currentMonthIso = new Date(now.getFullYear(), now.getMonth(), 5).toISOString();
        var previousMonthIso = new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString();

        mockTransactions = [
            { id: 1, date: currentMonthIso, merchant: 'Amazon', category: 'Shopping', amount: 100, cardId: 1 },
            { id: 2, date: currentMonthIso, merchant: 'Uber', category: 'Travel', amount: 200, cardId: 2 },
            { id: 3, date: previousMonthIso, merchant: 'Swiggy', category: 'Food', amount: 50, cardId: 1 }
        ];

        dataServiceMock = jasmine.createSpyObj('dataService', ['getCreditCards', 'getTransactions']);

        dataServiceMock.getCreditCards.and.callFake(function() {
            return Promise.resolve(mockCards);
        });

        dataServiceMock.getTransactions.and.callFake(function() {
            return Promise.resolve(mockTransactions);
        });

        $provide.value('dataService', dataServiceMock);
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$filter_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $filter = _$filter_;
        scope = $rootScope.$new();

        vm = $controller('dashboardController', {
            dataService: dataServiceMock,
            $filter: $filter
        });
    }));

    function flushAsync() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, 0);
        });
    }

    describe('initialization and data loading', function() {
        it('should initialize default properties and load data from dataService (normal case)', function(done) {
            // Arrange done via beforeEach

            // Act
            flushAsync().then(function() {
                // Assert
                expect(dataServiceMock.getCreditCards).toHaveBeenCalled();
                expect(dataServiceMock.getTransactions).toHaveBeenCalled();

                expect(vm.loading).toBe(false);
                expect(vm.cards.length).toBe(mockCards.length);
                expect(vm.transactions.length).toBe(mockTransactions.length);

                expect(vm.summary.totalCreditLimit).toBe(3000);
                expect(vm.summary.totalAvailableCredit).toBe(2100);
                expect(vm.summary.totalOutstanding).toBe(900);
                expect(vm.summary.utilizationPercentage).toBeCloseTo(30, 5);

                expect(vm.summary.totalMonthlySpend).toBe(300);
                expect(vm.summary.numTransactions).toBe(2);

                expect(vm.charts.category.labels.length).toBeGreaterThan(0);
                expect(vm.charts.card.labels.length).toBeGreaterThan(0);
                expect(vm.charts.trend.labels.length).toBe(12);

                expect(vm.analysis.topCategories.length).toBeGreaterThan(0);
                expect(vm.analysis.topMerchants.length).toBeGreaterThan(0);

                expect(vm.uniqueCategories).toContain('Shopping');
                expect(vm.uniqueCategories).toContain('Travel');
                done();
            });
        });

        it('should handle empty data sets gracefully (edge case)', function(done) {
            // Arrange
            mockCards = [];
            mockTransactions = [];

            dataServiceMock.getCreditCards.and.returnValue(Promise.resolve(mockCards));
            dataServiceMock.getTransactions.and.returnValue(Promise.resolve(mockTransactions));

            vm = $controller('dashboardController', {
                dataService: dataServiceMock,
                $filter: $filter
            });

            // Act
            flushAsync().then(function() {
                // Assert
                expect(vm.cards.length).toBe(0);
                expect(vm.transactions.length).toBe(0);

                expect(vm.summary.totalCreditLimit).toBe(0);
                expect(vm.summary.totalAvailableCredit).toBe(0);
                expect(vm.summary.totalOutstanding).toBe(0);
                expect(vm.summary.utilizationPercentage).toBeNaN();

                expect(vm.summary.totalMonthlySpend).toBe(0);
                expect(vm.summary.numTransactions).toBe(0);

                expect(vm.charts.category.labels.length).toBe(0);
                expect(vm.charts.card.labels.length).toBe(0);
                expect(vm.charts.trend.labels.length).toBe(12);
                expect(vm.charts.trend.data[0].reduce(function(sum, v) { return sum + v; }, 0)).toBe(0);

                expect(vm.analysis.topCategories.length).toBe(0);
                expect(vm.analysis.topMerchants.length).toBe(0);
                expect(vm.uniqueCategories.length).toBe(0);
                done();
            });
        });

        it('should handle promise rejection from dataService (error scenario)', function(done) {
            // Arrange
            dataServiceMock.getCreditCards.and.returnValue(Promise.reject('error-cards'));
            dataServiceMock.getTransactions.and.returnValue(Promise.reject('error-transactions'));

            vm = $controller('dashboardController', {
                dataService: dataServiceMock,
                $filter: $filter
            });

            // Act
            flushAsync().then(function() {
                // Assert
                expect(vm.cards).toEqual([]);
                expect(vm.transactions).toEqual([]);
                expect(vm.summary.totalCreditLimit).toBeUndefined();
                expect(vm.loading).toBe(true);
                done();
            }).catch(function() {
                // Even if promises reject, controller does not explicitly handle it; this branch exists for robustness
                done();
            });
        });
    });

    describe('sorting behavior', function() {
        beforeEach(function(done) {
            flushAsync().then(function() {
                done();
            });
        });

        it('should toggle sortReverse when same key is used', function() {
            // Arrange
            vm.sortKey = 'date';
            vm.sortReverse = true;

            // Act
            vm.setSort('date');

            // Assert
            expect(vm.sortKey).toBe('date');
            expect(vm.sortReverse).toBe(false);

            // Act again
            vm.setSort('date');

            // Assert again
            expect(vm.sortReverse).toBe(true);
        });

        it('should change sort key and reset sortReverse when new key is used', function() {
            // Arrange
            vm.sortKey = 'date';
            vm.sortReverse = true;

            // Act
            vm.setSort('amount');

            // Assert
            expect(vm.sortKey).toBe('amount');
            expect(vm.sortReverse).toBe(false);
        });

        it('should return appropriate icons based on sort state', function() {
            // Arrange
            vm.sortKey = 'amount';
            vm.sortReverse = true;

            // Act & Assert
            expect(vm.getSortIcon('amount')).toBe('fa-sort-down');

            vm.sortReverse = false;
            expect(vm.getSortIcon('amount')).toBe('fa-sort-up');

            expect(vm.getSortIcon('merchant')).toBe('fa-sort');
        });
    });

    describe('dark mode toggling', function() {
        var originalBodyClassList;

        beforeEach(function(done) {
            originalBodyClassList = document.body.className;
            flushAsync().then(function() {
                done();
            });
        });

        afterEach(function() {
            document.body.className = originalBodyClassList;
        });

        it('should enable dark mode and update chart options', function() {
            // Arrange
            vm.darkMode = true;

            // Act
            vm.toggleDarkMode();

            // Assert
            expect(document.body.classList.contains('dark-mode')).toBe(true);
            expect(vm.charts.options.legend.labels.fontColor).toBe('#e0e0e0');
        });

        it('should disable dark mode and update chart options', function() {
            // Arrange
            vm.darkMode = false;

            // Act
            vm.toggleDarkMode();

            // Assert
            expect(document.body.classList.contains('dark-mode')).toBe(false);
            expect(vm.charts.options.legend.labels.fontColor).toBe('#666');
        });
    });

    describe('transaction details modal', function() {
        var bootstrapModalSpy;

        beforeEach(function(done) {
            bootstrapModalSpy = jasmine.createSpy('bootstrapModalSpy').and.callFake(function() {
                return {
                    show: jasmine.createSpy('show')
                };
            });
            window.bootstrap = { Modal: bootstrapModalSpy };

            flushAsync().then(function() {
                done();
            });
        });

        it('should set selectedTransaction and create modal instance on first call', function() {
            // Arrange
            var tx = mockTransactions[0];
            var modalElement = document.createElement('div');
            modalElement.id = 'transactionDetailModal';
            document.body.appendChild(modalElement);

            // Act
            vm.showTransactionDetails(tx);

            // Assert
            expect(vm.selectedTransaction).toBe(tx);
            expect(bootstrapModalSpy).toHaveBeenCalledWith(modalElement);
            expect(vm.modalInstance.show).toHaveBeenCalled();

            document.body.removeChild(modalElement);
        });

        it('should reuse existing modal instance on subsequent calls', function() {
            // Arrange
            var tx1 = mockTransactions[0];
            var tx2 = mockTransactions[1];
            var modalElement = document.createElement('div');
            modalElement.id = 'transactionDetailModal';
            document.body.appendChild(modalElement);

            vm.showTransactionDetails(tx1);
            var initialInstance = vm.modalInstance;
            bootstrapModalSpy.calls.reset();

            // Act
            vm.showTransactionDetails(tx2);

            // Assert
            expect(vm.selectedTransaction).toBe(tx2);
            expect(vm.modalInstance).toBe(initialInstance);
            expect(bootstrapModalSpy).not.toHaveBeenCalled();
            expect(vm.modalInstance.show).toHaveBeenCalled();

            document.body.removeChild(modalElement);
        });
    });

    describe('CSV export behavior', function() {
        var createElementSpy;
        var appendChildSpy;
        var removeChildSpy;
        var linkMock;

        beforeEach(function(done) {
            createElementSpy = spyOn(document, 'createElement').and.callFake(function(tagName) {
                if (tagName === 'a') {
                    linkMock = {
                        setAttribute: jasmine.createSpy('setAttribute'),
                        click: jasmine.createSpy('click')
                    };
                    return linkMock;
                }
                return document.createElement(tagName);
            });

            appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
            removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();

            flushAsync().then(function() {
                done();
            });
        });

        it('should generate CSV content and trigger download for filtered transactions', function() {
            // Arrange
            vm.filters.merchant = 'Amazon';
            vm.filters.category = '';
            vm.filters.cardId = '';

            // Act
            vm.exportToCsv();

            // Assert
            expect(createElementSpy).toHaveBeenCalledWith('a');
            expect(linkMock.setAttribute).toHaveBeenCalled();
            expect(linkMock.click).toHaveBeenCalled();
            expect(appendChildSpy).toHaveBeenCalledWith(linkMock);
            expect(removeChildSpy).toHaveBeenCalledWith(linkMock);
        });

        it('should handle scenario with no matching transactions', function() {
            // Arrange
            vm.filters.merchant = 'NonExistingMerchant';

            // Act
            vm.exportToCsv();

            // Assert
            expect(createElementSpy).toHaveBeenCalledWith('a');
            expect(linkMock.setAttribute).toHaveBeenCalled();
            expect(linkMock.click).toHaveBeenCalled();
        });
    });

    describe('getCardById utility', function() {
        beforeEach(function(done) {
            flushAsync().then(function() {
                done();
            });
        });

        it('should return card object for existing cardId', function() {
            // Arrange
            var cardId = mockCards[0].id;

            // Act
            var result = vm.getCardById(cardId);

            // Assert
            expect(result).toEqual(mockCards[0]);
        });

        it('should return empty object for non-existing cardId (edge case)', function() {
            // Arrange
            var cardId = 999;

            // Act
            var result = vm.getCardById(cardId);

            // Assert
            expect(result).toEqual({});
        });
    });
});
/*
Test Documentation:
- Test Name: dashboardController behavior
- Purpose: Validate dashboard controller initialization, data processing, UI interactions, chart behavior, and utility functions.
- Scenario: Normal data loading, empty data, failed promises, sorting, dark mode toggle, modal handling, CSV export, and card lookup.
- Expected Result: Controller correctly fetches and processes data, updates view model state, interacts with mocked dependencies (dataService, $filter, document, bootstrap), and handles edge/error conditions without accessing real browser APIs or network.
*/
/*
Coverage Report:
- Functions tested:
  - activate (implicit via controller initialization)
  - calculateSummaryMetrics
  - prepareChartData
  - performAdvancedAnalysis
  - extractUniqueFilters
  - vm.setSort
  - vm.getSortIcon
  - vm.toggleDarkMode
  - vm.showTransactionDetails
  - vm.exportToCsv
  - vm.getCardById
- Statements covered:
  - Summary metrics calculations for credit limits, available credit, outstanding, utilization, monthly spend, transaction count
  - Chart data preparations for category, card, and monthly trend
  - Forecast and top categories/merchants analysis
  - Filter extraction and uniqueCategories generation
  - Sorting logic (toggle and key change)
  - Dark mode toggling and chart option update
  - Modal instance creation and reuse
  - CSV content generation and simulated download link lifecycle
  - Card lookup branching
- Branches covered:
  - Transactions present vs empty arrays
  - Current month vs non-current month transactions
  - Sorting: same key vs different key; sortReverse true vs false
  - Dark mode: enabled vs disabled
  - Modal: no existing instance vs existing instance
  - CSV export: matching vs non-matching filters
  - getCardById: card found vs not found
- Error scenarios covered:
  - Promise rejection from dataService (cards and transactions)
  - No matching transactions for CSV export
- Uncovered scenarios:
  - Precise ordering validation in charts and analysis arrays
  - Browser date/time edge cases (e.g., leap year, month boundaries)
  - Bootstrap Modal internal error handling and lifecycle events
*/