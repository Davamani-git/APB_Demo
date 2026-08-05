(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .factory('dashboardSummaryService', [
      '$http',
      '$q',
      'envConfig',
      'apiConfig',
      'DashboardSummary',
      'loggingService',
      'errorHandlerService',
      function ($http, $q, envConfig, apiConfig, DashboardSummary, loggingService, errorHandlerService) {
        function getDashboardSummary(params) {
          var baseUrl = envConfig.get('apiBaseUrl');
          if (!baseUrl || baseUrl.indexOf('https://') !== 0) {
            loggingService.warn('Non-HTTPS apiBaseUrl configured. Blocking request.', { apiBaseUrl: baseUrl });
            return $q.reject(errorHandlerService.handleHttpError({
              status: 0,
              data: {
                code: 'CCD-CLI-002',
                message: 'Secure API base URL is not configured.'
              }
            }));
          }

          var endpoint = baseUrl + apiConfig.endpoints.dashboardSummary;

          var query = {};
          if (params && params.fromDate) {
            query.fromDate = toIsoDate(params.fromDate);
          }
          if (params && params.toDate) {
            query.toDate = toIsoDate(params.toDate);
          }

          var config = {
            params: query
          };

          loggingService.info('Requesting dashboard summary', { endpoint: endpoint, params: query });

          return $http.get(endpoint, config)
            .then(function (response) {
              var data = response.data || {};
              var summary = DashboardSummary.fromApiResponse(data);
              loggingService.audit('DASHBOARD_ACCESS', {
                correlationId: data.correlationId || null
              });
              return summary;
            })
            .catch(function (errorModel) {
              return $q.reject(errorModel);
            });
        }

        function validateParams(params) {
          if (!params) {
            return null;
          }
          var fromDate = params.fromDate;
          var toDate = params.toDate;
          if (fromDate && toDate && fromDate > toDate) {
            return {
              code: 'CCD-CLI-001',
              message: 'The from date must be earlier than or equal to the to date.',
              details: null,
              correlationId: null,
              httpStatus: null
            };
          }
          return null;
        }

        function toIsoDate(date) {
          var year = date.getFullYear();
          var month = (date.getMonth() + 1).toString().padStart(2, '0');
          var day = date.getDate().toString().padStart(2, '0');
          return year + '-' + month + '-' + day;
        }

        return {
          getDashboardSummary: getDashboardSummary,
          validateParams: validateParams
        };
      }
    ]);
})();
