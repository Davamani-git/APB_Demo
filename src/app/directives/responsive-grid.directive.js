angular.module('executiveDashboard').directive('responsiveGrid', ['ViewportService', function(ViewportService) {
return {
restrict: 'A',
link: function(scope, element, attrs) {
const updateGrid = function() {
const state = ViewportService.getViewportState();
let columns = 4;
if (state.breakpoint === 'sm') {
columns = 1;
} else if (state.breakpoint === 'md') {
columns = 2;
} else if (state.breakpoint === 'lg') {
columns = 3;
} else {
columns = 4;
}
element.css({
'display': 'grid',
'grid-template-columns': 'repeat(' + columns + ', 1fr)',
'gap': '20px'
});
};
updateGrid();
scope.$on('viewport:resize', function() {
updateGrid();
});
}
};
}]);
