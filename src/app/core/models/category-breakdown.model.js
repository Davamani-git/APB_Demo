(function () {
  'use strict';

  angular.module('app.core')
    .factory('CategoryBreakdown', [function () {
      function CategoryBreakdown(props) {
        angular.extend(this, props);
      }

      CategoryBreakdown.fromDto = function (dto) {
        return new CategoryBreakdown({
          categoryCode: dto.categoryCode,
          categoryLabel: dto.categoryLabel,
          amount: dto.amount || 0,
          percentage: dto.percentage || 0
        });
      };

      return CategoryBreakdown;
    }]);
}());
