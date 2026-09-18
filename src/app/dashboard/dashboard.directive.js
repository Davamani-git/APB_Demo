(function(){
'use strict';
angular.module('creditCardApp').directive('kpiCard',function(){
return{restrict:'E',scope:{label:'@',value:'@'},template:'<div class="kpi-card-directive"><div class="kpi-label">{{label}}</div><div class="kpi-value">{{value}}</div></div>'};
});
})();