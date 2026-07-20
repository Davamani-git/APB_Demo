(function () {
    "use strict";

    angular.module("app")
        .service("DashboardApiService", DashboardApiService);

    DashboardApiService.$inject = ["ENV_CONFIG", "HttpErrorFactory", "LoggingService", "$injector", "MonthlySummaryMockService", "MonthlySummaryModel", "KpiSummaryModel", "BreakdownItemModel"];

    function DashboardApiService(ENV_CONFIG, HttpErrorFactory, LoggingService, $injector, MonthlySummaryMockService, MonthlySummaryModel, KpiSummaryModel, BreakdownItemModel) {
        this.getMonthlySummary = function (cardId, month) {
            var trimmedCardId = (cardId || "").trim();
            var trimmedMonth = (month || "").trim();

            if (!trimmedCardId) {
                var errorModelCard = HttpErrorFactory.fromHttpResponse({
                    status: 400,
                    data: {
                        code: "CARD_ID_REQUIRED",
                        message: "No card selected."
                    }
                });
                return Promise.reject(errorModelCard);
            }

            var monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
            if (!monthRegex.test(trimmedMonth)) {
                var errorModelMonth = HttpErrorFactory.fromHttpResponse({
                    status: 400,
                    data: {
                        code: "INVALID_MONTH_FORMAT",
                        message: "Please select a valid month."
                    }
                });
                return Promise.reject(errorModelMonth);
            }

            if (ENV_CONFIG.useMockData) {
                LoggingService.info("Using mock data for monthly summary", {
                    cardId: maskCardId(trimmedCardId),
                    month: trimmedMonth
                });
                return MonthlySummaryMockService.getMonthlySummary(trimmedCardId, trimmedMonth);
            }

            var $http = $injector.get("$http");

            var url = ENV_CONFIG.apiBaseUrl + "/spend-dashboard/" + encodeURIComponent(trimmedCardId) + "/months/" + encodeURIComponent(trimmedMonth);

            LoggingService.info("Calling DashboardAPI", {
                url: url,
                timeoutMs: ENV_CONFIG.apiTimeoutMs
            });

            return $http({
                method: "GET",
                url: url,
                timeout: ENV_CONFIG.apiTimeoutMs
            }).then(function (response) {
                var dto = response && response.data ? response.data : {};
                var mapped = mapResponse(dto);
                LoggingService.info("DashboardAPI response received", {
                    cardId: maskCardId(trimmedCardId),
                    month: trimmedMonth
                });
                return mapped;
            }).catch(function (errorResponse) {
                var errorModel = HttpErrorFactory.fromHttpResponse(errorResponse);
                LoggingService.error("DashboardAPI call failed", {
                    code: errorModel.code,
                    message: errorModel.message,
                    correlationId: errorModel.correlationId
                });
                return Promise.reject(errorModel);
            });
        };

        function mapResponse(dto) {
            if (!dto || !dto.cardId || !dto.month || dto.totalSpend === undefined || !dto.currency || !dto.breakdown || !dto.kpis) {
                var errorModel = HttpErrorFactory.fromHttpResponse({
                    status: 500,
                    data: {
                        code: "INVALID_RESPONSE",
                        message: "Received an invalid response from the dashboard service."
                    }
                });
                throw errorModel;
            }

            var summaryModel = new MonthlySummaryModel({
                cardId: dto.cardId,
                month: dto.month,
                totalSpend: dto.totalSpend,
                currency: dto.currency,
                statementType: dto.statementType,
                dataFreshness: dto.dataFreshness
            });

            var kpiModels = [];
            if (angular.isArray(dto.kpis)) {
                dto.kpis.forEach(function (kpiDto) {
                    var kpiModel = new KpiSummaryModel({
                        id: kpiDto.id,
                        label: kpiDto.label,
                        value: kpiDto.value,
                        formattedValue: kpiDto.formattedValue,
                        icon: getKpiIcon(kpiDto.id),
                        supportingLabel: getSupportingLabel(kpiDto.id),
                        trend: kpiDto.trend
                    });
                    kpiModels.push(kpiModel);
                });
            }

            var breakdownModels = [];
            if (angular.isArray(dto.breakdown)) {
                dto.breakdown.forEach(function (breakdownDto) {
                    var breakdownModel = new BreakdownItemModel({
                        categoryId: breakdownDto.categoryId,
                        categoryName: breakdownDto.categoryName,
                        amount: breakdownDto.amount,
                        percentageOfTotal: breakdownDto.percentageOfTotal
                    });
                    breakdownModels.push(breakdownModel);
                });
            }

            return {
                summary: summaryModel,
                kpis: kpiModels,
                breakdown: breakdownModels
            };
        }

        function getKpiIcon(id) {
            if (id === "totalSpend") {
                return "fa fa-dollar";
            }
            if (id === "numTransactions") {
                return "fa fa-list-ul";
            }
            if (id === "avgTransactionValue") {
                return "fa fa-calculator";
            }
            return "fa fa-circle";
        }

        function getSupportingLabel(id) {
            if (id === "totalSpend") {
                return "Monthly total spend";
            }
            if (id === "numTransactions") {
                return "Number of transactions";
            }
            if (id === "avgTransactionValue") {
                return "Average transaction value";
            }
            return "";
        }

        function maskCardId(cardId) {
            if (!cardId) {
                return "";
            }
            if (cardId.length <= 4) {
                return "****" + cardId;
            }
            var last4 = cardId.substring(cardId.length - 4);
            return "****" + last4;
        }
    }
})();
