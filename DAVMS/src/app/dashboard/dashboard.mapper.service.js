(function () {
  "use strict";

  dashboardMapperService.$inject = [];

  function dashboardMapperService() {
    const service = {
      mapKpiCards: mapKpiCards,
      mapBreakdownChartData: mapBreakdownChartData
    };

    function mapKpiCards(monthlySummary) {
      if (!monthlySummary || !monthlySummary.kpiSummary) {
        return [];
      }
      return [
        {
          id: "totalSpend",
          label: "Total Spend",
          value: monthlySummary.kpiSummary.totalSpend,
          icon: "assets/img/icons/kpi-total-spend.png",
          cssClass: "davms-kpi-card-total"
        },
        {
          id: "transactionCount",
          label: "Transactions",
          value: monthlySummary.kpiSummary.transactionCount,
          icon: "assets/img/icons/kpi-tx-count.png",
          cssClass: "davms-kpi-card-count"
        },
        {
          id: "avgTransaction",
          label: "Average Transaction",
          value: monthlySummary.kpiSummary.averageTransactionValue,
          icon: "assets/img/icons/kpi-avg-spend.png",
          cssClass: "davms-kpi-card-avg"
        }
      ];
    }

    function mapBreakdownChartData(monthlySummary) {
      const labels = [];
      const data = [];
      const colors = [];

      if (!monthlySummary || !Array.isArray(monthlySummary.breakdownEntries)) {
        return { labels: labels, data: data, colors: colors };
      }

      const baseColors = [
        "#337ab7",
        "#5cb85c",
        "#f0ad4e",
        "#d9534f",
        "#5bc0de"
      ];

      for (let i = 0; i < monthlySummary.breakdownEntries.length; i += 1) {
        const entry = monthlySummary.breakdownEntries[i];
        labels.push(entry.categoryLabel);
        data.push(entry.amount);
        colors.push(baseColors[i % baseColors.length]);
      }

      return {
        labels: labels,
        data: data,
        colors: colors
      };
    }

    return service;
  }

  angular
    .module("app.dashboard")
    .service("dashboardMapperService", dashboardMapperService);
})();
