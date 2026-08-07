(function() {
    'use strict';
    angular.module('app.creditCardDashboard')
        .service('CreditCardPortfolioService', ['$http', 'AuthFactory', '$q', function($http, AuthFactory, $q) {
            const self = this;
            let cachedData = null;
            let cacheTimestamp = null;
            const CACHE_DURATION = 5 * 60 * 1000;
            self.getPortfolioSummary = function() {
                const now = Date.now();
                if (cachedData && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
                    return $q.resolve(cachedData);
                }
                const token = AuthFactory.getAuthToken();
                return $http({
                    method: 'GET',
                    url: '/api/creditcards/portfolio',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(function(response) {
                    const data = response.data;
                    if (data.cards && Array.isArray(data.cards)) {
                        data.cards.forEach(function(card) {
                            if (card.availableCredit === undefined || card.availableCredit === null) {
                                card.availableCredit = card.creditLimit - card.outstandingAmount;
                            }
                        });
                    }
                    cachedData = data;
                    cacheTimestamp = now;
                    return data;
                }).catch(function(error) {
                    console.error('Error fetching portfolio data:', error);
                    return $q.reject(error);
                });
            };
            self.clearCache = function() {
                cachedData = null;
                cacheTimestamp = null;
            };
        }]);
})();