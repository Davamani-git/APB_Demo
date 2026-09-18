(function() {
  'use strict';
  angular.module('providerEnrollmentApp').controller('DocumentUploadController', ['$scope', 'DocumentService', 'OcrService', DocumentUploadController]);
  function DocumentUploadController($scope, DocumentService, OcrService) {
    var vm = this;
    vm.file = null;
    vm.metadata = { documentType: '', expirationDate: '', notes: '' };
    vm.ocrExtractedDate = null;
    vm.showOcrConfirmation = false;
    vm.uploading = false;
    vm.errorMessage = '';
    vm.onFileSelected = function(file) {
      vm.file = file;
      vm.errorMessage = '';
      if (file && file.type === 'application/pdf') {
        vm.uploading = true;
        OcrService.extractExpirationDate(file).then(function(result) {
          if (result.extractedDate) {
            vm.ocrExtractedDate = result.extractedDate;
            vm.metadata.expirationDate = result.extractedDate;
            vm.showOcrConfirmation = true;
          }
        }).catch(function() {
          vm.showOcrConfirmation = false;
        }).finally(function() {
          vm.uploading = false;
        });
      }
    };
    vm.confirmOcrDate = function() {
      vm.showOcrConfirmation = false;
    };
    vm.overrideOcrDate = function() {
      vm.metadata.expirationDate = '';
      vm.showOcrConfirmation = false;
    };
    vm.uploadDocument = function() {
      vm.errorMessage = '';
      if (!vm.file) {
        vm.errorMessage = 'Please select a file.';
        return;
      }
      if (!vm.metadata.documentType) {
        vm.errorMessage = 'Please select a document type.';
        return;
      }
      if (!vm.metadata.expirationDate) {
        vm.errorMessage = 'Please enter an expiration date.';
        return;
      }
      if (!DocumentService.validateExpiration(vm.metadata.expirationDate)) {
        vm.errorMessage = 'This document expired on ' + vm.metadata.expirationDate + ' and cannot satisfy this requirement. Please upload a current version.';
        return;
      }
      vm.uploading = true;
      DocumentService.uploadDocument($scope.applicationId, $scope.requirementId, vm.file, vm.metadata).then(function(result) {
        if ($scope.onUpload) {
          $scope.onUpload();
        }
        vm.resetForm();
      }).catch(function(error) {
        vm.errorMessage = error.data && error.data.message ? error.data.message : 'Upload failed. Please try again.';
      }).finally(function() {
        vm.uploading = false;
      });
    };
    vm.resetForm = function() {
      vm.file = null;
      vm.metadata = { documentType: '', expirationDate: '', notes: '' };
      vm.ocrExtractedDate = null;
      vm.showOcrConfirmation = false;
      vm.errorMessage = '';
    };
  }
  DocumentUploadController.$inject = ['$scope', 'DocumentService', 'OcrService'];
})();