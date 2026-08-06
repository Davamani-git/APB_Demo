angular.module('executiveDashboard').directive('lazyLoad', ['$timeout', function($timeout) {
return {
restrict: 'A',
link: function(scope, element, attrs) {
element.css('display', 'none');
$timeout(function() {
const observer = new IntersectionObserver(function(entries) {
entries.forEach(function(entry) {
if (entry.isIntersecting) {
element.css('display', 'block');
observer.unobserve(element[0]);
}
});
}, {rootMargin: '100px'});
observer.observe(element[0]);
}, 100);
}
};
}]);
