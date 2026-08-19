(function() {
  'use strict';
  angular.module('deliveryTracking')
    .directive('partnerInfo', [function() {
      return {
        restrict: 'E',
        scope: {
          partner: '='
        },
        template: '<div class="partner-info" ng-if="partner">' +
          '<img ng-src="{{partner.photoUrl}}" alt="{{partner.name}}" class="partner-photo" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23ddd%22 width=%2260%22 height=%2260%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22%3E?%3C/text%3E%3C/svg%3E\'">' +
          '<div class="partner-details">' +
          '<h3>{{partner.name}}</h3>' +
          '<p ng-if="partner.vehicleType">{{partner.vehicleType}}</p>' +
          '<p ng-if="partner.phone">Phone: {{partner.phone}}</p>' +
          '<p ng-if="partner.rating">Rating: {{partner.rating}} ⭐</p>' +
          '</div>' +
          '</div>'
      };
    }]);
})();