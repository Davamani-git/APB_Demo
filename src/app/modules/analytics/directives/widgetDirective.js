(function(){'use strict';
  angular.module('analytics').directive('apbWidget', apbWidgetDirective);
  function apbWidgetDirective(){
    return {
      restrict:'E',
      transclude:true,
      scope:{title:'@',loading:'='},
      template:'<div class="widget"><h3>{{title}}</h3><div ng-if="loading">Loading...</div><div ng-transclude ng-if="!loading"></div></div>'
    };
  }
})();
