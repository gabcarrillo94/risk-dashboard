(function() {
  'use strict';

  angular
    .module('dashboard')
    .run(runBlock);

  /** @ngInject */
  function runBlock($http, $location, $rootScope, 
    $state, $q, LoginFactory) {
    // keep user logged in after page refresh

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
      var url = $location.absUrl();

      $rootScope.$broadcast('checkToken');
      if(url.indexOf('#/login') > -1 &&
      url.indexOf('username=') > -1 &&
      url.indexOf('token=') > -1) {
        console.log(1);
        url = url.substring(0, url.indexOf('#/login'));
        url = url.substring(url.indexOf('?') + 1);
        var params = url.split('&');
        params[0] = params[0].replace('username=', '');
        params[1] = params[1].replace('token=', '');

        $rootScope.passChangeData = {
          username: params[0],
          token: params[1]
        }
      }
    });


    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.log(error);
      if (angular.isString(error)) {
          event.preventDefault();
          switch (error) {
            case 'NotAuthorized':
              $state.go('login');
            break;
            case 'TokenExpired':
              LoginFactory.Logout();
              $state.go("login");
            break;
            case 'NotAccess':
            case 'Authenticated':
             fromState.name ? $state.go(fromState.name) : $state.go('app.home');
            break;
          }
        }
      });



  }

})();
