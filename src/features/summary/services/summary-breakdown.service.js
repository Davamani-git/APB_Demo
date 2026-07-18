angular.module('davms.summary').service('SummaryBreakdownService', SummaryBreakdownService);

SummaryBreakdownService.$inject = ['ConfigService', 'LoggingService'];
function SummaryBreakdownService(ConfigService, LoggingService) {
  this.mapBreakdown = function(summaryResponse) {
    const rawItems = summaryResponse.breakdown || [];
    const mapped = rawItems.map(function(item) {
      return {
        categoryCode: item.categoryCode,
        categoryLabel: item.categoryLabel,
        amount: item.amount,
        percentage: item.percentage
      };
    });

    LoggingService.info('BREAKDOWN_MAPPED', { count: mapped.length });
    return mapped;
  };
}