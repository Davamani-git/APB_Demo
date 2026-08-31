angular.module('app').directive('mappingGrid',function(){return{restrict:'E',scope:{mappings:'=',onOverride:'&'},template:'<div class="grid-container">'+
'<table>'+
'<thead>'+
'<tr>'+
'<th>Legacy Account Code</th>'+
'<th>Legacy Account Name</th>'+
'<th>Suggested Master Code</th>'+
'<th>Confidence</th>'+
'<th>Source</th>'+
'<th>Status</th>'+
'<th>Actions</th>'+
'</tr>'+
'</thead>'+
'<tbody>'+
'<tr ng-repeat="mapping in mappings track by mapping.legacyAccountCode" ng-class="{ambiguous: mapping.isAmbiguous}">'+
'<td>{{mapping.legacyAccountCode}}</td>'+
'<td>{{mapping.legacyAccountName||"N/A"}}</td>'+
'<td>'+
'<span ng-if="!mapping.editing">{{mapping.suggestedMasterCode}}</span>'+
'<input ng-if="mapping.editing" type="text" ng-model="mapping.masterAccountCode" style="width:100%">'+
'</td>'+
'<td>{{mapping.confidence}}%</td>'+
'<td><span class="status-badge" ng-class="{\"status-auto\": mapping.mappingSource===\"AI\", \"status-manual\": mapping.mappingSource===\"RULE\"}">{{mapping.mappingSource}}</span></td>'+
'<td><span class="status-badge" ng-class="{\"status-pending\": mapping.isAmbiguous, \"status-auto\": !mapping.isAmbiguous}">{{mapping.isAmbiguous?"PENDING":"AUTO"}}</span></td>'+
'<td>'+
'<button ng-if="!mapping.editing" class="btn btn-primary" ng-click="editMapping(mapping)">Override</button>'+
'<button ng-if="mapping.editing" class="btn btn-success" ng-click="saveMapping(mapping)">Save</button>'+
'<button ng-if="mapping.editing" class="btn btn-danger" ng-click="cancelEdit(mapping)">Cancel</button>'+
'</td>'+
'</tr>'+
'</tbody>'+
'</table>'+
'</div>',link:function(scope,element,attrs){scope.editMapping=function(mapping){mapping.editing=true;mapping.originalValue=mapping.suggestedMasterCode;mapping.masterAccountCode=mapping.suggestedMasterCode;};scope.saveMapping=function(mapping){mapping.editing=false;mapping.suggestedMasterCode=mapping.masterAccountCode;mapping.isAmbiguous=false;scope.onOverride({mapping:mapping});};scope.cancelEdit=function(mapping){mapping.editing=false;mapping.masterAccountCode=mapping.originalValue;};}};})