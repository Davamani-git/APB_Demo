angular.module('davms.summary').service('MonthContextService', MonthContextService);

MonthContextService.$inject = ['ConfigService'];
function MonthContextService(ConfigService) {
  const maxMonths = ConfigService.getMaxHistoryMonths();
  let selectedMonth = null;
  const months = buildMonths();

  this.getAvailableMonths = function() {
    return months.slice();
  };

  this.setSelectedMonth = function(monthKey) {
    const found = months.find(function(m) { return m.key === monthKey; });
    if (found) {
      selectedMonth = found;
    }
  };

  this.getSelectedMonth = function() {
    return selectedMonth || months[0];
  };

  function buildMonths() {
    const result = [];
    const now = new Date();
    for (let i = 0; i < maxMonths; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.getFullYear() + '-' + pad(d.getMonth() + 1);
      result.push({
        key: key,
        label: d.toLocaleString(undefined, { month: 'short', year: 'numeric' }),
        startDate: new Date(d.getFullYear(), d.getMonth(), 1),
        endDate: new Date(d.getFullYear(), d.getMonth() + 1, 0)
      });
    }
    return result;
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }
}