(function () {
    'use strict';

    angular
            .module('dashboard')
            .controller('UsuarioPasswordController', UsuarioPasswordController);

    UsuarioPasswordController.$inject = ['$scope','toastr', '$localStorage', 'PerfilesFactory', '$rootScope' ];
    function UsuarioPasswordController($scope, toastr, $localStorage, PerfilesFactory, $rootScope) {


        $scope.riskUserPassword = {};
        $scope.idUser = $localStorage.currentUser.userId;

        $scope.closeModalPassword = function () {
            $rootScope.$broadcast('closeModalUserPassword');
        };

        $scope.validarCambiarPassword = function (id, riskUserPassword) {
            var validacion = {content: '', show: false};
            if (!id) {
                validacion.content = 'Debe elegir el usuario a cambiar el password.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!riskUserPassword.passwordAntigua) {
                validacion.content = 'Debe ser llenar el campo Password Antiguo.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!riskUserPassword.passwordNueva) {
                validacion.content = 'Debe ser llenar el campo Password Nuevo.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!riskUserPassword.passwordConfirmar) {
                validacion.content = 'Debe ser llenar el campo Confirmar Password.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (riskUserPassword.passwordConfirmar !== riskUserPassword.passwordNueva) {
                validacion.content = 'La contraseñas deben ser iguales.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            }
            return validacion;
        };

        //  Método de ingreso de cambio de PASSWORD.
        $scope.cambiarPassword = function () {
            var v = $scope.validarCambiarPassword($scope.idUser, $scope.riskUserPassword);
            $scope.validacion = v;
            if (!v.show) {
                //  Llamado a servicios, en este caso de reseteo de contraseña.
                $scope.request = true;
                PerfilesFactory.cambiarPassword($scope.idUser, $scope.riskUserPassword)
                        .then(function (res) {
                            console.log(res);
                            $scope.riskUserPassword = [];
                            $scope.mensajeExito = "Se modifico el password exitosamente";
                            toastr.success($scope.mensajeExito);
                            $rootScope.$broadcast('closeModalUserPassword');
                            $scope.request = false;
                            return res;
                        }).catch(function (e) {
                            console.log("ERROR EN EL REST WEB");
                            $scope.mensajeError = "Clave actual incorrecta";
                            toastr.error($scope.mensajeError);
                            $scope.request = false;
                            console.log(e);
                        });
            }

        };
    }


})();