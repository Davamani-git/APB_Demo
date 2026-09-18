(function() {
  'use strict';
  angular.module('providerEnrollmentApp').directive('ocrConfirmationModal', [ocrConfirmationModal]);
  function ocrConfirmationModal() {
    return {
      restrict: 'E',
      scope: { extractedDate: '=', onConfirm: '&', onOverride: '&' },
      template: '<div class="modal" ng-if="extractedDate"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4>Confirm OCR Extracted Date</h4></div><div class="modal-body"><p>Extracted expiration date: <strong>{{extractedDate}}</strong></p><p>Please confirm or override this value.</p></div><div class="modal-footer"><button class="btn btn-success" ng-click="onConfirm()">Confirm</button><button class="btn btn-default" ng-click="onOverride()">Override</button></div></div></div></div>'
    };
  }
})();