(function(){
'use strict';
angular.module('FraudAlertModule').filter('riskLevel',[riskLevel]);
function riskLevel(){
return function(input){
if(!input)return'';
var mapping={'low':'Low Risk','medium':'Medium Risk','high':'High Risk','confirmed_fraud':'Confirmed Fraud'};
return mapping[input.toLowerCase()]||input;
};
}
})();