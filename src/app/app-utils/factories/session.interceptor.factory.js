angular
.module('dashboard')
.factory('SessionInterceptor', function($window, $q, $localStorage){

    return {
      request: function(config) {
        if ($localStorage.currentUser) {
          config.headers.token = $localStorage.currentUser.tokenInfo.token;
          if  ( new Date  > new Date($localStorage.currentUser.tokenInfo.expiration) ){
            return $q.reject('TokenExpired');
          }
        } 
        return config;
      }
    };
});
