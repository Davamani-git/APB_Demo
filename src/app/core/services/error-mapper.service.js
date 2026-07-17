(function () {
  'use strict';

  angular.module('app.core')
    .service('errorMapperService', ['ClientError', function (ClientError) {
      this.mapHttpError = function (rejection) {
        var status = rejection.status;
        var data = rejection.data || {};
        var code = data.errorCode || 'UNKNOWN_ERROR';
        var message;

        if (code === 'INVALID_MONTH') {
          message = 'Please select a valid month within the allowed range.';
        } else if (code === 'CONSENT_REQUIRED') {
          message = 'Insights cannot be displayed because consent is not granted.';
        } else if (code === 'NO_DATA_FOR_MONTH') {
          message = 'No spending data is available for the selected month.';
        } else if (code === 'SERVICE_UNAVAILABLE' || status >= 500) {
          message = 'The service is temporarily unavailable. Please try again later.';
        } else if (status === 401) {
          message = 'You are not authenticated to view this information.';
        } else if (status === 403) {
          message = 'You do not have access to view these insights.';
        } else {
          message = 'An unexpected error occurred while loading insights.';
        }

        return new ClientError({
          code: code,
          httpStatus: status,
          message: message,
          details: data.details || null,
          correlationId: data.correlationId || null
        });
      };
    }]);
}());
