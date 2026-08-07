(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .directive('imageUploadDirective', ['Upload', '$timeout', function(Upload, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'src/app/product-management/image-upload.template.html',
        scope: {
          onUpload: '&'
        },
        link: function(scope, element, attrs) {
          scope.images = [];
          scope.uploadedUrls = [];
          scope.selectFiles = function(files) {
            if (!files || files.length === 0) return;
            angular.forEach(files, function(file) {
              if (file.size > 5242880) {
                toastr.error('File size must be less than 5MB: ' + file.name);
                return;
              }
              if (!file.type.match('image.*')) {
                toastr.error('Only image files are allowed: ' + file.name);
                return;
              }
              var reader = new FileReader();
              reader.onload = function(e) {
                scope.$apply(function() {
                  scope.images.push({
                    file: file,
                    preview: e.target.result
                  });
                });
              };
              reader.readAsDataURL(file);
              scope.uploadFile(file);
            });
          };
          scope.uploadFile = function(file) {
            Upload.upload({
              url: '/api/upload',
              data: {file: file}
            }).then(function(response) {
              scope.uploadedUrls.push(response.data.url);
              scope.onUpload({urls: scope.uploadedUrls});
            }, function(error) {
              toastr.error('Upload failed: ' + file.name);
            });
          };
          scope.removeImage = function(index) {
            scope.images.splice(index, 1);
            scope.uploadedUrls.splice(index, 1);
            scope.onUpload({urls: scope.uploadedUrls});
          };
        }
      };
    }]);
})();