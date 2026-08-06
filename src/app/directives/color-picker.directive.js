angular.module('executiveDashboard').directive('colorPicker', [function() {
return {
restrict: 'A',
require: 'ngModel',
link: function(scope, element, attrs, ngModel) {
element.on('change', function() {
const color = element.val();
ngModel.$setViewValue(color);
scope.$apply();
});
scope.$watch(function() {
return ngModel.$modelValue;
}, function(newVal) {
if (newVal) {
element.val(newVal);
}
});
}
};
}]);
