angular.module('apbDemo.services')
.factory('AnalyticsEngineService', [function() {
    function computeCategoryBreakdown(transactions) {
        // Placeholder for analytics logic
        return [];
    }

    function computeCardBreakdown(transactions) {
        // Placeholder for analytics logic
        return [];
    }

    function computeTrendSeries(transactions, granularity) {
        // Placeholder for analytics logic
        return [];
    }

    return {
        computeCategoryBreakdown: computeCategoryBreakdown,
        computeCardBreakdown: computeCardBreakdown,
        computeTrendSeries: computeTrendSeries
    };
}]);