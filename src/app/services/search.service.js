(function(){
'use strict';
angular.module('helpCenterApp').factory('SearchService',['$http','$q',SearchService]);
function SearchService($http,$q){
var service={searchContent:searchContent};
return service;
function searchContent(query,filters){
var mockResults=[{id:1,title:'Quick Start Guide',description:'Get started quickly.',type:'article',url:'/articles/quick-start',category:'getting-started'},{id:2,title:'FAQ Document',description:'Common questions answered.',type:'download',url:'/downloads/faq.pdf',category:'faqs'},{id:3,title:'Troubleshooting Video',description:'Video troubleshooting guide.',type:'video',url:'/videos/troubleshooting',category:'troubleshooting'}];
var filtered=mockResults.filter(function(item){
var matchQuery=item.title.toLowerCase().indexOf(query.toLowerCase())!==-1||item.description.toLowerCase().indexOf(query.toLowerCase())!==-1;
var matchCategory=!filters.category||item.category===filters.category;
var matchType=!filters.type||item.type===filters.type;
return matchQuery&&matchCategory&&matchType;
});
return $q.resolve(filtered);
}
}
})();