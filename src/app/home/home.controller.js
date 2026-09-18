(function(){
'use strict';
angular.module('helpCenterApp').controller('HomeController',['$location',HomeController]);
function HomeController($location){
var vm=this;
vm.navigateToHelpCenter=navigateToHelpCenter;
function navigateToHelpCenter(){
$location.path('/help-center');
}
}
})();