(function(){'use strict';
  angular.module('security').service('authService', authService);
  authService.$inject = ['$http','$window','$q'];
  function authService($http,$window,$q){
    var TOKEN_KEY='apb_token', PROFILE_KEY='apb_profile', self=this;
    self.login=login; self.logout=logout; self.isAuthenticated=isAuthenticated;
    self.getToken=getToken; self.getProfile=getProfile; self.setSession=setSession;
    function login(){
      return $http.post('/api/auth/sso/login',{}).then(function(res){
        setSession(res.data.token,res.data.profile); return res.data.profile;
      });
    }
    function setSession(token,profile){
      $window.sessionStorage.setItem(TOKEN_KEY,token);
      $window.sessionStorage.setItem(PROFILE_KEY,angular.toJson(profile));
    }
    function logout(){
      $window.sessionStorage.removeItem(TOKEN_KEY);
      $window.sessionStorage.removeItem(PROFILE_KEY);
      $window.location.href='/api/auth/sso/logout';
    }
    function getToken(){return $window.sessionStorage.getItem(TOKEN_KEY);}
    function getProfile(){var p=$window.sessionStorage.getItem(PROFILE_KEY);return p?angular.fromJson(p):null;}
    function isAuthenticated(){var t=getToken();return $q.when(!!t);}
  }
})();
