(function () {
  "use strict";

  dashboardKpiCards.$inject = [];

  function dashboardKpiCards() {
    return {
      restrict: "E",
      scope: {
        kpis: "<"
      },
      bindToController: true,
      controller: DashboardKpiCardsController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-kpi-cards.html",
      transclude: false,
      replace: false
    };
  }

  DashboardKpiCardsController.$inject = [];

  function DashboardKpiCardsController() {
    var vm = this;

    vm.getKpiList = function () {
      if (!vm.kpis) {
        return [];
      }

      return [
        {
          key: "totalSpend",
          label: "Total Spend",
          value: vm.kpis.totalSpend,
          cssClass: "panel-primary",
          iconPath: "assets/img/icons/spending-total.png"
        },
        {
          key: "transactionCount",
          label: "Number of Transactions",
          value: vm.kpis.transactionCount,
          cssClass: "panel-info",
          iconPath: "assets/img/icons/transactions-count.png"
        },
        {
          key: "averageTransactionAmount",
          label: "Average Transaction",
          value: vm.kpis.averageTransactionAmount,
          cssClass: "panel-success",
          iconPath: "assets/img/icons/average-spend.png"
        },
        {
          key: "maxTransactionAmount",
          label: "Max Transaction",
          value: vm.kpis.maxTransactionAmount,
          cssClass: "panel-warning",
          iconPath: "assets/img/icons/max-transaction.png"
        }
      ];
    };
  }

  angular
    .module("app")
    .directive("dashboardKpiCards", dashboardKpiCards);
}());
