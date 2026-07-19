(function () {
    "use strict";

    window.BreakdownMockData = {
        "2026-06": {
            month: "2026-06",
            totalSpend: 32540.75,
            segments: [
                { label: "Online", value: 18000, percentage: 55.3 },
                { label: "In-Store", value: 13000.75, percentage: 39.9 },
                { label: "Others", value: 540, percentage: 4.8 }
            ]
        },
        "2026-07": {
            month: "2026-07",
            totalSpend: 45872.50,
            segments: [
                { label: "Online", value: 25000, percentage: 54.5 },
                { label: "In-Store", value: 18000.5, percentage: 39.3 },
                { label: "Travel", value: 2872, percentage: 6.3 }
            ]
        },
        "2026-05": {
            month: "2026-05",
            totalSpend: 0,
            segments: []
        },
        "default": {
            month: "2026-07",
            totalSpend: 45872.50,
            segments: [
                { label: "Online", value: 25000, percentage: 54.5 },
                { label: "In-Store", value: 18000.5, percentage: 39.3 },
                { label: "Travel", value: 2872, percentage: 6.3 }
            ]
        }
    };
})();
