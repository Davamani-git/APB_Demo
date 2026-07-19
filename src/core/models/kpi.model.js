(function () {
  "use strict";

  function KpiModelFactory() {
    class KpiModel {
      constructor(label, value, icon, format, unit) {
        this.label = label || "";
        this.value = typeof value === "number" ? value : 0;
        this.icon = icon || "";
        this.format = format || "number"; // "currency" | "number" | "integer"
        this.unit = unit || ""; // e.g., "USD", "txns"
      }

      formatValue() {
        var value = this.value;
        if (this.format === "currency") {
          return value.toFixed(2);
        }
        if (this.format === "integer") {
          return Math.round(value).toString();
        }
        return value.toString();
      }
    }

    return KpiModel;
  }

  angular.module("app")
    .factory("KpiModel", KpiModelFactory);
})();
