(function() {
  'use strict';
  angular.module('onlineShoppingApp').factory('ToastFactory', [ToastFactory]);
  function ToastFactory() {
    return {
      success: function(message) {
        if (typeof toastr !== 'undefined') {
          toastr.success(message);
        } else {
          alert(message);
        }
      },
      error: function(message) {
        if (typeof toastr !== 'undefined') {
          toastr.error(message);
        } else {
          alert(message);
        }
      },
      info: function(message) {
        if (typeof toastr !== 'undefined') {
          toastr.info(message);
        } else {
          alert(message);
        }
      },
      warning: function(message) {
        if (typeof toastr !== 'undefined') {
          toastr.warning(message);
        } else {
          alert(message);
        }
      }
    };
  }
})();