angular.module('davms.summary').service('SummaryKpiService', SummaryKpiService);

SummaryKpiService.$inject = [];
function SummaryKpiService() {
  this.computeKpis = function(summaryResponse) {
    const totalAmount = summaryResponse.totalAmount || 0;
    const transactionCount = summaryResponse.transactionCount || 0;
    const averageTransactionValue = transactionCount > 0 ? totalAmount / transactionCount : 0;

    return {
      totalAmount: totalAmount,
      transactionCount: transactionCount,
      averageTransactionValue: averageTransactionValue,
      currency: summaryResponse.currency || 'USD'
    };
  };
}