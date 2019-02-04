(function() {
'use strict';

  angular
    .module('dashboard')
    .controller('LoginController', LoginController)
    .controller('PasswordResetController', PasswordResetController);

  PasswordResetController.$inject = ['$scope', 'PasswordResetFactory', 
                                      '$modal', '$timeout'];

  function PasswordResetController($scope, PasswordResetFactory, $modal, $timeout) {

    $scope.username = '';
    $scope.showAlerta = '';
    $scope.changeProcessed = false;

    $scope.startReset = function() {
      $scope.request = true;
      PasswordResetFactory.passwordResetRequest($scope.username)
      .then(function(r){
        $scope.showAlerta = 'success';
        // $scope.changeProcessed = true;
        $scope.openEmailSuccess();
        $scope.request = false;
        $scope.$apply();
        setTimeout(function() {
          $('#closePasswordRecovery').click();
        }, 4000);
      })
      .catch(function(e){
        console.log(e);
        $scope.showAlerta = 'error';
        $scope.request = false;        
        $scope.$apply();
      })
    }

    $scope.openEmailSuccess = function(){
        $timeout(function() {
          $('#closePasswordRecovery').click();
        }, 50);
        $modal({
          templateUrl: 'app/login/modal-reset-success.html',
          backdrop: 'static',
          size: 'md',
          scope: $scope,
          keyboard: false,
          show: true
      });
    }

  }

  LoginController.$inject = ['$location', 'LoginFactory', '$state', '$stateParams', '$modal', '$scope', 'PasswordResetFactory', '$rootScope', 'env'];
  function LoginController($location, LoginFactory, $state, $stateParams, $modal, $scope, PasswordResetFactory, $rootScope, env) {
      var vm = this;

      vm.login = login;

      vm.errorPassChange = '';

      vm.successPassChange = '';

      vm.changePassword1 = '';

      vm.changePassword2 = '';
      $scope.showPasswordEdit = false;
      vm.habilitarCambioPassword = false;

//        console.log($location.absUrl());
        var searchObject = $location.search();
//        console.log(searchObject.user);
//        console.log(searchObject.token);
        
        if(searchObject.user == null && searchObject.token == null){
            vm.habilitarCambioPassword = false;
            $scope.showPasswordEdit = false;
        }else{
            vm.habilitarCambioPassword = true;
            $scope.showPasswordEdit = true;
        }

      if($rootScope.passChangeData) {
        $scope.showPasswordEdit = true;
      }
      
        vm.cambiarPasswordModal = function () {
            $modal({
                templateUrl: 'app/login/cambiarPassword.html',
                backdrop: 'static',
                size: 'md',
                scope: $scope,
                keyboard: false,
                show: true
            });
        };
        
        
        $scope.validarCambiarPassword = function () {
            var validacion = {content: '', show: false};
            if (!vm.passwordAntigua) {
                validacion.content = 'Debe ser llenar el campo Password Antiguo.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!vm.passwordNueva) {
                validacion.content = 'Debe ser llenar el campo Password Nuevo.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!vm.passwordConfirmar) {
                validacion.content = 'Debe ser llenar el campo Confirmar Password.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (vm.passwordConfirmar !== vm.passwordNueva) {
                validacion.content = 'La contraseñas deben ser iguales.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            }
            return validacion;
        };

      vm.passwordResetModal = function(){
        $modal({ templateUrl: 'app/login/modal-reset-password.html', show: true, controller: PasswordResetController });
      };

      vm.changePassword = function() {
          console.log("CAMBIAMOS NUESTRA CONTRASEÑA");
        if(vm.changePassword1 != vm.changePassword2) {
          vm.errorPassChange = 'Las contraseñas no coinciden';
        }
        else {
          vm.errorPassChange = '';
          PasswordResetFactory.changePassword(
            searchObject.user.trim(),
            searchObject.token.trim(),
            vm.changePassword1,
            vm.changePassword2
          )
          .then(function(r, s) {
            vm.successPassChange = 'Contraseña modificada correctamente.';
            $scope.$apply()
            setTimeout(function(){
              $scope.showPasswordEdit = false;
              $scope.$apply()
            }, 3000)
          })
          .catch(function(e, s) {
            vm.errorPassChange = 'Ocurrió un error cambiando la contraseña.';
            $scope.$apply();
          });
        }

      }

      var sessionExpired = $modal({ templateUrl: 'app/login/modal-expired.html', show: false });

      if($stateParams.id == 1) {
        vm.error = $stateParams.message;
        sessionExpired.$promise.then(sessionExpired.show);
      }

      // initController();

      function initController() {
          // reset login status
          console.log("INICIO DEL CONTROLLER LOGIN");
          LoginFactory.Logout();
      };

      function login() {
          vm.loading = true;
          LoginFactory.Login(vm.username, vm.password, function (result) {
            console.log(result);
              if (result === true) {
                  // $location.path('/');
                  $state.go('app.home');
              } else {
                  vm.error = 'Usuario o contraseña incorrectos';
                  vm.loading = false;
              }
          });
      };
  }
})();
