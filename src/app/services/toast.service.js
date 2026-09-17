(function(){
'use strict';
angular.module('fraudAlertApp').service('ToastService',[function(){
const self=this;
self.show=function(message,type){
alert((type||'INFO')+': '+message);
};
self.error=function(message){
self.show(message,'ERROR');
};
self.success=function(message){
self.show(message,'SUCCESS');
};
self.info=function(message){
self.show(message,'INFO');
};
}]);
})();