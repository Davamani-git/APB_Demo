angular.module('apbApp').directive('customizableWidget', function() {
  return {
    restrict: 'E',
    scope: { config: '=' },
    template: '<div class="widget-card"><h4>{{config.title}}</h4><p>{{config.value}}</p></div>'
  };
});
