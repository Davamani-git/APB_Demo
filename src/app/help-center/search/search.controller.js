(function(){
'use strict';
angular.module('helpCenterApp').controller('SearchController',['SearchService','AnalyticsService',SearchController]);
function SearchController(SearchService,AnalyticsService){
var vm=this;
vm.searchQuery='';
vm.searchResults=[];
vm.filters={category:'',type:''};
vm.errorMessage='';
vm.search=search;
vm.applyFilter=applyFilter;
function search(){
if(!vm.searchQuery||vm.searchQuery.trim()===''){
vm.searchResults=[];
return;
}
vm.errorMessage='';
SearchService.searchContent(vm.searchQuery,vm.filters).then(function(data){
vm.searchResults=data;
AnalyticsService.trackEvent('search',{query:vm.searchQuery,filters:vm.filters});
}).catch(function(err){
vm.errorMessage='Search failed. Please try again or contact support.';
});
}
function applyFilter(){
search();
}
}
})();