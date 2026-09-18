(function(){
'use strict';
angular.module('helpCenterApp').controller('HelpCenterController',['ContentService','AnalyticsService',HelpCenterController]);
function HelpCenterController(ContentService,AnalyticsService){
var vm=this;
vm.categories=[];
vm.selectedCategory=null;
vm.contentItems=[];
vm.errorMessage='';
vm.selectCategory=selectCategory;
vm.viewContent=viewContent;
vm.downloadMaterial=downloadMaterial;
activate();
function activate(){
AnalyticsService.trackPageView('help-center-landing');
loadCategories();
}
function loadCategories(){
ContentService.getCategories().then(function(data){
vm.categories=data;
vm.errorMessage='';
}).catch(function(err){
vm.errorMessage='Unable to load categories. Please try again later or contact support.';
});
}
function selectCategory(category){
vm.selectedCategory=category;
vm.contentItems=[];
vm.errorMessage='';
ContentService.getContentByCategory(category.id).then(function(data){
vm.contentItems=data;
AnalyticsService.trackEvent('category-selected',{category:category.name});
}).catch(function(err){
vm.errorMessage='Unable to load content for this category. Please try again or browse other categories.';
});
}
function viewContent(item){
if(item.type==='video'){
AnalyticsService.trackEvent('video-play',{title:item.title});
}else if(item.type==='article'){
AnalyticsService.trackEvent('article-view',{title:item.title});
}
}
function downloadMaterial(item){
if(!item.downloadUrl){
vm.errorMessage='Download unavailable. Please contact support or try again later.';
return;
}
AnalyticsService.trackEvent('download',{title:item.title});
window.open(item.downloadUrl,'_blank');
}
}
})();