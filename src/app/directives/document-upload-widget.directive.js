(function() {
  'use strict';
  angular.module('providerEnrollmentApp').directive('documentUploadWidget', [documentUploadWidget]);
  function documentUploadWidget() {
    return {
      restrict: 'E',
      scope: { applicationId: '=', requirementId: '=', onUpload: '&' },
      templateUrl: 'src/app/directives/document-upload-widget.template.html',
      controller: 'DocumentUploadController',
      controllerAs: 'vm'
    };
  }
})();