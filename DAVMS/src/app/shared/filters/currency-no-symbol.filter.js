(function () {
  "use strict";

  currencyNoSymbolFilter.$inject = ["$filter"];

  function currencyNoSymbolFilter($filter) {
    const numberFilter = $filter("number");

    return function (input) {
      const value = Number(input) || 0;
      return numberFilter(value, 2);
    };
  }

  angular
    .module("app")
    .filter("currencyNoSymbol", currencyNoSymbolFilter);
})();
