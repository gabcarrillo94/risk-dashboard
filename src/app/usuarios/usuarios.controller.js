(function () {
    'use strict';

    angular
            .module('dashboard')
            .controller('UsuariosController', UsuariosController);

    UsuariosController.$inject = ['$scope', '$state', '$rootScope', '$interval', 
                                  '$localStorage', '$stateParams', '$modal', 
                                  'PerfilesFactory', '$http', 'toastr', '$timeout'];
    function UsuariosController($scope, $state, $rootScope, $interval, $localStorage, 
                                $stateParams, $modal, PerfilesFactory, $http, toastr,
                                $timeout) {
        var vm = this;

        $scope.filtrarUsuario = '';
        $scope.editActive = false;
        $scope.botonesDeAccion = {
            crear : true,
            guardar: false,
            editar: false,
            eliminar: false,
            cancelar: false
        }
        $scope.campoEditable = true;
        $scope.userStateTemp = false;
        $scope.filterUsers = [];

        $scope.listadoTipoUsuarios = [{
            type: 'Super Administrador',
            value: 'SA'
        },{
            type: 'Usuario',
            value: 'U'
        }]

        $scope.noBusqueda = true;


        
        $scope.ejecutarListadoUsuariosRoles = function () {

            PerfilesFactory.listadoUsuariosRoles()
                    .then(function (res) {
                        $scope.listadoUsuariosRoles = res;
                        $scope.listadoUsuarios = [];
                        console.log(res);
//                        jsonListadoRolesUsuario = JSON.stringify($scope.listadoUsuariosRoles);
//                        console.log(jsonListadoRolesUsuario);
//                        console.log("$scope.listadoUsuariosRoles.riskUser");
                        if($scope.listadoUsuariosRoles.length){

                            for (var i = 0; i < $scope.listadoUsuariosRoles.length; i++) {
                                $scope.listadoUsuarios[i] = $scope.listadoUsuariosRoles[i].riskUser;
                                $scope.listadoUsuarios[i].riskRole = $scope.listadoUsuariosRoles[i].riskRole;
                                $scope.listadoUsuarios[i].usroProfileId = $scope.listadoUsuariosRoles[i].usroProfileId;
                                $scope.searchUsername[i] = $scope.listadoUsuarios[i].username;
                                $scope.searchEmail[i] = $scope.listadoUsuarios[i].email;
                            }
                        }
                        
//                        console.log("USUARIOS RESPUESTA");             
//                        console.log($scope.listadoUsuarios);
                        for (var i = 0; i < $scope.listadoUsuarios.length; i++) {
                            $scope.searchUsername[i] = $scope.listadoUsuarios[i].username;
                            $scope.searchEmail[i] = $scope.listadoUsuarios[i].email;
                        }
                        $scope.$apply();
                        return res;
                    }).catch(function (e) {
                console.log("ERROR EN PerfilesFactory.listadoUsuariosRoles");
                console.log(e);
            });

        };

        //  Método donde inicializamos nuestros servicios al ingresar al módulo.
        vm.initPerfilesController = function () {
            //  Listado de usuarios.
//            PerfilesFactory.listadoUsuarios()
//                    .then(function (res) {
//                        $scope.listadoUsuarios = res;
//                        console.log($scope.listadoUsuarios);
//                        $scope.listadoUsuariosEditar = res;
//                        for (var i = 0; i < $scope.listadoUsuarios.length; i++) {
//                            $scope.searchUsername[i] = $scope.listadoUsuarios[i].username;
//                            $scope.searchEmail[i] = $scope.listadoUsuarios[i].email;
//                        }
//                        $scope.$apply();
//                        return res;
//                    }).catch(function (e) {
//                console.log("ERROR EN PerfilesFactory.listadoUsuarios");
//                console.log(e);
//            });

            //  Listado de usuarios con sus roles.
            $scope.roles = [];
            $scope.ejecutarListadoUsuariosRoles();
//            PerfilesFactory.listadoUsuariosRoles()
//                    .then(function (res) {
//                        $scope.listadoUsuariosRoles = res;
////                        jsonListadoRolesUsuario = JSON.stringify($scope.listadoUsuariosRoles);
////                        console.log(jsonListadoRolesUsuario);
////                        console.log("$scope.listadoUsuariosRoles.riskUser");
//                        console.log($scope.listadoUsuariosRoles);
//                        for (var i = 0; i < $scope.listadoUsuariosRoles.length; i++) {
//                            $scope.listadoUsuarios[i] = $scope.listadoUsuariosRoles[i].riskUser;
//                            $scope.listadoUsuarios[i].riskRole = $scope.listadoUsuariosRoles[i].riskRole;
//                            $scope.listadoUsuarios[i].usroProfileId = $scope.listadoUsuariosRoles[i].usroProfileId;
//                            $scope.searchUsername[i] = $scope.listadoUsuarios[i].username;
//                            $scope.searchEmail[i] = $scope.listadoUsuarios[i].email;
//                        }
//                        
////                        console.log("USUARIOS RESPUESTA");             
////                        console.log($scope.listadoUsuarios);
//                        for (var i = 0; i < $scope.listadoUsuarios.length; i++) {
//                            $scope.searchUsername[i] = $scope.listadoUsuarios[i].username;
//                            $scope.searchEmail[i] = $scope.listadoUsuarios[i].email;
//                        }
//                        $scope.$apply();
//                        return res;
//                    }).catch(function (e) {
//                console.log("ERROR EN PerfilesFactory.listadoUsuariosRoles");
//                console.log(e);
//            });

//             //  Listado de Opciones.
            // PerfilesFactory.listarOpciones()
            // .then(function (res) {
            //     $scope.listadoOpcion = res;
            //     $scope.listadoOpcionRespaldo = $scope.listadoOpcion;
            //     $scope.$apply();
            //     console.log($scope.listadoOpcion);
            // })
            // .catch(function (e) {
            //     console.log("ERRORES EN EL PerfilesFactory.listadoOpciones");
            //     console.log(e);
            // });

            PerfilesFactory.listadoPerfilesRolesOpcionesActivos()
            .then(function(res){
                $scope.perfilesActivos = res;
                console.log($scope.perfilesActivos);
            })
            .catch(function(err){
                console.log('dio este error en listadoPerfilesRolesOpcionesActivos');
            });

            PerfilesFactory.listarOpciones()
            .then(function (res) {
                $scope.opcionesPerfiles = res.map(function(option){
                    option.habilitado = false;
                    return option;
                })
                $scope.opcionesPerfiles.forEach(function(perfil){
                    $scope.copiaOpcionesPerfiles.push(Object.assign({}, perfil));
                })
//                 $scope.listadoOpcion = res;
// //                        console.log($scope.listadoOpcion);
//                 $scope.listadoOpcionRespaldo = $scope.listadoOpcion;
                $scope.$apply();
                console.log($scope.copiaOpcionesPerfiles);
                return res;
            })
            .catch(function (e) {
                console.log("ERRORES EN EL PerfilesFactory.listadoOpciones");
                console.log(e);
            });

            //  Listado de Roles.
            PerfilesFactory.listadoRoles()
                    .then(function (res) {
                        $scope.listadoRol = res;
//                        console.log("LISTADO DE ROLES");
//                        console.log($scope.listadoRol);
//                        for (var i = 0; i < $scope.listadoRol.length; i++) {
//                            $scope.listadoRol[i].value = false;
//                        }
//                        ;
//                        console.log($scope.listadoRol);
//                        $scope.listadoRolRespaldo = $scope.listadoRol;
                        $scope.$apply();
                        return res;
                    })
                    .catch(function (e) {
                        console.log("ERRORES EN EL PerfilesFactory.listadoRoles");
                        console.log(e);
                        $scope.listadoRol = [];
                    });

        };

        vm.initPerfilesController();

        $scope.mensajeError = "";
        $scope.mensajeExito = "";

        $scope.listadoPerfiles = [];
        $scope.codigoRolOriginal = "";
        $scope.codigoPerfilOriginal = "";
        $scope.content = "";

        $scope.opcionesPerfiles = [];
        $scope.copiaOpcionesPerfiles = [];

        $scope.actualListadoPerfiles = [];

        $scope.orderOptionGrid = function(){
            $scope.perfilSeleccionado = $scope.perfilesActivos.find(function(perfil){
                return perfil.profileId === $scope.riskUser.usroProfileId.profileId
            })  
            console.log($scope.perfilesActivos);
            console.log($scope.perfilSeleccionado);
            $scope.opcionesPerfiles.map(function(perfil){
                perfil.habilitado = false;
            })
            $scope.opcionesPerfiles.map(function(perfil){
                var option;
                option = $scope.perfilSeleccionado.riskOptionList.find(function(option){
                    return perfil.contenedor === option.contenedor;
                })
                if (option) perfil.habilitado = true;
                return perfil;
            })
            
            $scope.opcionesPerfiles.sort(function (perfil){
                return !perfil.habilitado
            })
        }

        $scope.selectedPerfil = function () {
            if ($scope.riskUser.usroProfileId) {
                $scope.orderOptionGrid();
            }else{
                $scope.opcionesPerfiles = [];
                $scope.copiaOpcionesPerfiles.forEach(function(perfilDefault){
                    $scope.opcionesPerfiles.push(Object.assign({}, perfilDefault));
                })
            }

        };

        $scope.selectedRol = function () {
            $scope.listadoOpcion = [];
//            console.log("ROL SELECCIONADO");
//            console.log($scope.riskUser.riskRole);

            if (null !== $scope.riskUser.riskRole) {
//                console.log("CONSUMIMOS NUESTRO SERVICIO");
//                console.log($scope.riskUser.riskRole.roleId);
                $scope.codigoRolOriginal = $scope.riskUser.riskRole.roleId;
                PerfilesFactory.listadoPerfilesPorRol($scope.riskUser.riskRole.roleId)
                        .then(function (res) {
                            $scope.listadoPerfiles = res.filter(function (perfil){
                                return perfil.profileId.activo;
                            })
                           
                            $scope.$apply();
                            return res;
                        })
                        .catch(function (e) {
                            console.log("ERRORES EN EL PerfilesFactory.listadoPerfilesPorRol");
                            console.log(e);
                        });

            } else {
                console.log("LIMPIAMOS NUESTRO COMBO DE PERFILES");
                $scope.listadoPerfiles = [];
            }

        };

        $scope.signup = {};

        $scope.complete = function (string) {
            $scope.hidethis = false;
            var output = [];
            angular.forEach($scope.countryList, function (country) {
                if (country.toLowerCase().indexOf(string.toLowerCase()) >= 0)
                {
                    output.push(country);
                }
            });
            $scope.filterCountry = output;
        };

        $scope.fillTextbox = function (string) {
            $scope.country = string;
            if ($scope.country.length > 0) {
                $scope.hidethis = false;
            } else {
                $scope.hidethis = false;
            }

        };

        //

//        //Sort Array
//        $scope.searchUsername.sort();
//
//        //Change It To lowercase
//        $scope.searchItemsSmallLetter = [];
//        for (var i = 0; i < $scope.searchUsername.length; i++) {
//            $scope.searchItemsSmallLetter.push($scope.searchUsername[i].toLowerCase());
//        }
//
//        //Function To Call on ng-keydown
//        $scope.autoCompleteInput = function () {
//            $("#busquedaUsername").autocomplete({
//                source: function (request, response) {
//                    var results = $.ui.autocomplete.filter($scope.searchUsername, request.term);
//                    response(results.slice(0, 5));
//                }
//            });
//        };

        $scope.listadoOpcion = [];
        $scope.listadoOpcionRespaldo = [];
        $scope.listadoRol = [];
        $scope.listadoRolRespaldo = [];
        $scope.listadoUsuarios = [];
        $scope.listadoUsuarios.riskRole = [];
        $scope.listadoUsuariosRespaldo = [];
        $scope.listadoUsuariosEditar = [];
        $scope.listadoUsuariosRoles = [];
        $scope.listadoPerfilesRolesOpciones = [];
        $scope.mensajeServicio = "";

        /**
         * Variables hidden utilizadas para comporar los username y email ocultos para la validación edicicón.
         * 
         * **/
        $scope.usernameHidden = "";
        $scope.emailHidden = "";
        $scope.codigoRolHidden = "";
        $scope.codigoPerfilHidden = "";

        $scope.riskUserPassword = {};

        $scope.localStore = $localStorage.currentUser;
        $scope.mensajeEliminarUsuario = "";

        $scope.searchUsername = {};     //  Listado de usernames del sistema.
        $scope.searchEmail = {};        //  Listado de email del sistema.

        //  Verificamos el usuario si existe.
        $scope.errorUsername = "";
        $scope.errorEmail = "";

        vm.verificarUsername = function (username) {
            var result = false;
            var nombreUsuario = "";
            var listado = $scope.listadoUsuarios.length;
//            console.log($scope.searchUsername);
            if (null !== username || username !== "") {
                console.log($scope.listadoUsuarios);
                for (var i = 0; i < listado; i++) {
//                    console.log($scope.listadoUsuarios[i].username);
//                    console.log(username);
                    nombreUsuario = $scope.searchUsername[i];
//                    console.log(nombreUsuario);
                    if (nombreUsuario === username) {
                        console.log($scope.searchUsername[i] + " = " + username);
                        result = true;
                        break;
                    }
                }
            }
            return result;
        };

        vm.verificarEmail = function (email) {
            var result = false;
            var correoElectronico = "";
            var listado = $scope.listadoUsuarios.length;
//            console.log($scope.searchEmail);
            if (null !== email || email !== "") {
//                console.log($scope.listadoUsuarios);
                for (var i = 0; i < listado; i++) {
//                    console.log($scope.listadoUsuarios[i].username);
//                    console.log(username);
                    correoElectronico = $scope.searchEmail[i];
//                    console.log("EMAIL es= " + correoElectronico);
                    if (correoElectronico === email) {
                        console.log($scope.searchEmail[i] + " = " + email);
                        result = true;
                        break;
                    }
                }
            }
            return result;
        };

        $scope.crearUsuario = function () {
            $scope.riskUser.userState = $scope.userStateTemp.toString()[0];
            var verificarNombreUsuario = vm.verificarUsername($scope.riskUser.username);
            var verificarEmail = vm.verificarEmail($scope.riskUser.email);
            var v = $scope.validarCrearUsuario($scope.riskUser);
            $scope.riskUserCreate = [];
            $scope.validacion = v;
            
//            console.log("RESULTADO DE VERIFICAR USERNAME = " + verificarNombreUsuario);
//            console.log("RESULTADO DE VERIFICAR EMAIL = " + verificarEmail);
            if (verificarNombreUsuario) {
                toastr.error('Username Registrado', 'Intente con otro username');  
                $scope.validacion.content = "Username ya existe en el sistema, por favor ingrese otro diferente";
            }else if(verificarEmail){
               toastr.error('Email Registrado', 'Intente con otro email');                          
               $scope.errorEmail = "Email ya existe en el sistema, por favor ingrese otro diferente";
           }else if (!v.show) {
                // CONSUMIMOS NUESTRO SERVICIO DE CREAR USUARIO.
                PerfilesFactory.crearUsuarioRolPerfil($scope.riskUser)
                        .then(function (res) {
                            console.log(res);
                            // $scope.riskUser = [];
                            console.log('se creo con exito');
                            $scope.mensajeExito = "Se creo el usuario exitosamente y se envio un correo de confirmación.";
                            $scope.ejecutarListadoUsuariosRoles();
                            $scope.habilitarBotones('guardar');
                            $scope.editActive = false;
                            toastr.success($scope.mensajeExito);
                            // $scope.resetearFormulario();
//                            return res;
                        })
                        .catch(function (e) {
                            console.log("ERRORES EN EL PerfilesFactory.crearUsuario");
                            $scope.mensajeServicio = "Problemas al crear el usuario.";
                            if(e.msg){
                                switch (e.msg) {
                                    case 'Email Repeated':
                                        toastr.error('Email Registrado', 'Intente con otro email');  
                                        break;
                                    case 'Username Repeated':
                                        toastr.error('Username Registrado', 'Intente con otro username');  
                                        break;
                                
                                    default:
                                        toastr.error('Error al crear usuario', 'Intente con otro momento');
                                        console.log(e.msg);  
                                    
                                        break;
                                }
                            }
                            $scope.$apply();
                        });

            }

        };
        

        $scope.resetearFormulario = function () {
            $scope.riskUser = [];
            $scope.mensajeServicio = "";
            $scope.errorEmail = "";
            $scope.errorUsername = "";
            $scope.mensajeEliminarUsuario = "";
            $scope.mensajeError = "";
            $scope.mensajeExito = "";
            // $scope.listadoPerfiles = [];
            // $scope.perfilesActivos = [];
            $scope.content = "";
            $scope.userStateTemp  = false;
            $scope.habilitarBotones('eliminar');
        };

        //  Example.
        $scope.data = [{activo: true, profileId: 'PERFIL ADMINISTRADOR', name: 'PERFIL ADMINISTRADOR'}, {activo: true, profileId: 'CODIGO PERFIL OLIVARES', name: 'CODIGO PERFIL OLIVARES'}, {activo: true, profileId: 'PERCOMPLIANCE', name: 'PERFIL PERCOMPLIANCE'}];
        $scope.selectEntireObject = [];
//        $scope.data = [{name: 'one', id: 1}, {name: 'two', id: 2},{name: 'three', id: 3}];

//        $scope.selectEntireObject = $scope.data[2];

//        $scope.selectJustId = $scope.datas[1].id;

        $scope.buscar = [];
        $scope.selectUser = [];
        $scope.idUser = "";
        $scope.seleccionado = {};



        $scope.busqueda = function () {
            $scope.seleccionado = $scope.listadoUsuarios;
            console.log($scope.seleccionado);
            $scope.mensajeServicio = "";
            if (null == $scope.buscar.username) {
                $scope.riskUser = {};
                $scope.idUser = "";
                console.log('cai en el error');
            } else {
                $scope.ejecutarListadoUsuariosRoles();
                // CONSUMO DE SERVICIO DE BÚSQUEDA
                console.log("SELECCIONADO");
                console.log($scope.buscar);
                console.log($scope.riskUser);
                $scope.riskUser = $scope.buscar;
                $scope.noBusqueda = false;
                $scope.editActive = $scope.riskUser.userType !== 'SA';
                if($scope.editActive){
                    $scope.habilitarBotones('busqueda');
                }else{
                    $scope.habilitarBotones('eliminar');
                }
                $scope.idUser = $scope.buscar.userId;
                $scope.usernameHidden = $scope.buscar.username;
                $scope.emailHidden = $scope.buscar.email;
//                console.log("ESTA ES LA 2DA OPCIÓN");
//                console.log($scope.buscar.usroProfileId);

                //  Llenado del combo select por servicio
                if (null !== $scope.buscar.riskRole.roleId) {
                    $scope.codigoRolHidden = $scope.buscar.riskRole.roleId;
                    console.log("ESTE ES EL CODIGO ROL SELECCIONADO");
                    console.log($scope.codigoRolHidden);
                    console.log("ESTA ES LA 2DA OPCIÓN");
                    console.log($scope.buscar.usroProfileId);
                    $scope.userStateTemp =  $scope.riskUser.userState === 't' || $scope.riskUser.userState;
                    $scope.codigoPerfilHidden = $scope.buscar.usroProfileId.profileId;
//                    console.log($scope.buscar.usroProfileId);
//                    $scope.riskUser.usroProfileId = $scope.buscar.usroProfileId;
//                    console.log($scope.riskUser.usroProfileId);
//                    $scope.listadoPerfiles = $scope.buscar.usroProfileId;
//                    $scope.riskUser.profileId = $scope.buscar.usroProfileId;
                    PerfilesFactory.listadoPerfilesPorRol($scope.buscar.riskRole.roleId)
                            .then(function (res) {
                                $scope.listadoPerfiles = res.filter(function (perfil){
                                    return perfil.profileId.activo;
                                })
//                                console.log("LISTADO DEL SERVICIO");
//                                console.log($scope.listadoPerfiles);
                                for (var i = 0; i < $scope.listadoPerfiles.length; i++) {
                                    console.log($scope.listadoPerfiles[i].profileId.profileId);
                                    if ($scope.listadoPerfiles[i].profileId.profileId == $scope.buscar.usroProfileId.profileId) {
//                                        console.log("ESTE VALOR DEBE SER MARCADO EN EL SELECT");
//                                        console.log($scope.listadoPerfiles[i].profileId);
//                                        $scope.selectEntireObject = $scope.listadoPerfiles[i].profileId;
                                        $scope.riskUser.usroProfileId = $scope.listadoPerfiles[i].profileId;
                                    }
                                }
                                $scope.orderOptionGrid();
                                $scope.$apply();
                                return res;
                            })
                            .catch(function (e) {
                                console.log("ERRORES EN EL PerfilesFactory.listadoPerfilesPorRol");
                                console.log(e);
                            });

                } else {
                    $scope.riskUser = {};
                    $scope.idUser = "";
                    $scope.resetarFormulario;
                }


            }
        };

        $scope.modificarUsuario = function () {
            var verificarNombreUsuario = vm.verificarUsername($scope.riskUser.username);
            var verificarEmail = vm.verificarEmail($scope.riskUser.email);
            var v = $scope.validarCrearUsuario($scope.riskUser);
            $scope.validacion = v;
            if (!v.show) {
                if ($scope.idUser !== "") {
                    //  CONSUMO DE SERVICIO DE MODIFICACIÓN DE USUARIO.
                    //  Verificamos si nuestro usuario son iguales si es asi entonces esta bien.
                    if ($scope.usernameHidden === $scope.riskUser.username && $scope.emailHidden === $scope.riskUser.email) {
                        $scope.errorUsername = "";
                        $scope.errorEmail = "";
                        console.log("ROL ORIGINAL");
                        console.log($scope.codigoRolHidden);
                        console.log("PERFIL ORIGINAL");
                        console.log($scope.codigoPerfilHidden);
                        $scope.riskUser.userState = $scope.userStateTemp.toString()[0];
                        console.log($scope.riskUser);

                        //  CONSUMIMOS NUESTRO SERVICIO
                        PerfilesFactory.editarUsuario($scope.riskUser)
                                .then(function (res) {
                                    // $scope.riskUser = [];
                                    $scope.mensajeExito = "Se modificó el usuario exitosamente";
                                    $scope.ejecutarListadoUsuariosRoles();
                                    $scope.habilitarBotones('editar');
                                    toastr.success($scope.mensajeExito);
                                    $scope.editActive = false;
                                    $scope.campoEditable = true;
                                    return res;
                                }).catch(function (e) {
                                    console.log("ERROR EN EL REST WEB");
                                    if(e.msg){
                                        switch (e.msg) {
                                            case 'Super Admin Cannot Update':
                                                toastr.error('Los usuarios super administradores no pueden editarse')
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                    $scope.mensajeError = "Problemas al modificar";
                                    toast.error($scope.mensajeError);

                                    $scope.$apply();
                                });

                    } else {
                        console.log("Buscamos si existe el usuario");
                        if (verificarNombreUsuario) {
                            $scope.mensajeError = "Username ya existe en el sistema, por favor ingrese otro diferente";
//                    } else 
//                    
//                    console.log(verificarEmail);
//                        if (verificarEmail) {
//                        $scope.errorEmail = "Email ya existe en el sistema, por favor ingrese otro diferente";
                        } else if (!verificarNombreUsuario) {
                            $scope.errorUsername = "";
                            $scope.errorEmail = "";

                            PerfilesFactory.editarUsuario($scope.riskUser)
                                    .then(function (res) {
                                        $scope.riskUserEdit = res;
                                        console.log("MODIFICAMOS NUESTROS USUARIO otra vez");
                                        $scope.ejecutarListadoUsuariosRoles();
                                        $scope.mensajeExito = "Se modifico el uduario exitosamente";
                                        return res;
                                    }).catch(function (e) {
                                console.log("ERROR EN EL REST WEB");
                                console.log(e);
                            });

                        }

                    }

                }

            }

        };

        //  Validación para eliminar un usuario.
        $scope.validarEliminarUsuario = function (idUser) {
            var validacion = {content: '', show: false};
            if (!idUser) {
                validacion.content = 'Debe seleccionar un usuario para eliminarlo.';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            }
            return validacion;
        };

        //  Modal para eliminar el usuario.
        var URL_ELIMINAR_USUARIO = 'app/usuarios/confirmarEliminarUsuario.html';
        var modalEliminarUsuario;
        $scope.eliminarUsuario = function () {
            modalEliminarUsuario = $modal({
                templateUrl: URL_ELIMINAR_USUARIO,
                backdrop: 'static',
                size: 'md',
                scope: $scope,
                keyboard: false
            });
            modalEliminarUsuario.$promise.then(modalEliminarUsuario.show);    //  Abrimos nuestra modal.
        };

        $scope.deleteUser = function () {
            var v = $scope.validarEliminarUsuario($scope.idUser);
            $scope.validacion = v;
            if (!v.show) {
                //  Consumimos nuestro servicio de eliminar usuario.
                PerfilesFactory.eliminarUsuario($scope.idUser)
                        .then(function (res) {
                            console.log(res);
                            $scope.riskUser = [];
                            $scope.mensajeExito = "Se elimino el usuario exitosamente.";
                            $scope.habilitarBotones('eliminar');
                            toastr.success($scope.mensajeExito);
                            $scope.editActive = false;
                            $scope.campoEditable = true;
                            $scope.resetearFormulario();
                            console.log($scope.buscar.username);
                            $scope.buscar = [];
                            $timeout(function(){
                                $scope.ejecutarListadoUsuariosRoles();
                            }, 500)
                            modalEliminarUsuario.$promise.then(modalEliminarUsuario.hide);    //  Cerramos nuestra modal.
                        }).catch(function (e) {
                            console.log("ERROR EN EL REST WEB");
                            $scope.mensajeExito = "Problemas al eliminar el usuario.";
                            $scope.riskUser = [];
                            console.log(e);
                        });
            }
        };

        $scope.cerrarModalEliminarUsuario = function () {
            modalEliminarUsuario.$promise.then(modalEliminarUsuario.hide);    //  Cerramos nuestra modal.
        };

        $scope.id = '';

        //  Comienzo de los métodos y el uso para el cambio de password usando modal y el mismo controlador.
        var URL_CAMBIAR_PASSWORD = 'app/usuarios/cambiarPassword.html';
        var modalPassword;

        $scope.showModalPassword = function () {
            modalPassword = $modal({
                templateUrl: URL_CAMBIAR_PASSWORD,
                scope: $scope
            });
            //  Aperturamos nuestra ventana modal.
            modalPassword.$promise.then(modalPassword.show);
        };

        //  Cerrar modal de cambio password.        
        $scope.closeModalPassword = function () {
//            console.log("CERRAMOS NUESTRA MODAL.");
            modalPassword.$promise.then(modalPassword.hide);    //  Cerramos nuestra modal. 
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
                PerfilesFactory.cambiarPassword($scope.idUser, $scope.riskUserPassword)
                        .then(function (res) {
                            console.log(res);
                            $scope.riskUserPassword = [];
                            $scope.mensajeExito = "Se modifico el password exitosamente";
                            toastr.success($scope.mensajeExito);
                            modalPassword.$promise.then(modalPassword.hide);    //  Cerramos nuestra modal.
                            return res;
                        }).catch(function (e) {
                            console.log("ERROR EN EL REST WEB");
                            $scope.mensajeError = "Clave actual incorrecta";
                            toastr.error($scope.mensajeError);
                            console.log(e);
                        });
            }

        };

        var URL_LISTADO_USUARIOS = 'app/usuarios/listadoUsuarios.html';
        $scope.modalListadoUsuarios;
        $scope.showModalListadoUsuarios = function () {
            console.log($modal);
            $scope.modalListadoUsuarios = $modal({
                templateUrl: URL_LISTADO_USUARIOS,
                backdrop: 'static',
                size: 'md',
                controller: 'ListadoUsuariosController',
                keyboard: false,
                resolve:{
                    listaUsuarios:  function(){
                        return $scope.listadoUsuariosRoles;
                    }
                }
            });
            //  Aperturamos nuestra modal.
            $scope.modalListadoUsuarios.$promise.then($scope.modalListadoUsuarios.show);
        };


        $scope.$on('close-modal', function(evt, arg){
            $scope.modalListadoUsuarios.$promise.then($scope.modalListadoUsuarios.hide);
        });

        $scope.$on('select-user', function(evt, arg){
            $scope.buscar = arg[0].riskUser;
            $scope.modalListadoUsuarios.$promise.then($scope.modalListadoUsuarios.hide);
            $scope.busqueda();
        });

        $scope.habilitarOpcionRoles = false;

        $scope.riskUser = {};               //  Donde definimos nuestro modelo a usar en el formulario para crear.
        $scope.riskUser.riskRole = {};
        $scope.riskUser.userState = true;
        $scope.riskUserEdit = {};           //  Donde definimos nuestro modelo a usar en el formulario para crear.
        $scope.usuarioEditar = [];

        $scope.riskProfile = {};            //  Donde definimos nuestro modelo de Perfiles para el CRUD.
        $scope.riskListadoRoles = {};
        $scope.riskListadoOpcionesMenu = {};

        $scope.cerrarVentanaPerfilRol = function () {
            $scope.habilitarOpcionRoles = false;
            $scope.listadoRol = [];
        };

        $scope.mensajeErrorValidacion = "";

        $scope.habilitarEditarUsuario = function () {
            $scope.habilitarEditarUsuario = true;
        };

        $scope.listarPerfiles = function () {
            console.log("SERVICIO DE LISTADO DE PERFILES.");
        };

        $scope.listadoRolesSeleccionados = [];

        $scope.seleccionarRoles = function (item) {
            var idx = $scope.listadoRolesSeleccionados.indexOf(item);
            if (idx > -1) {
                $scope.listadoRolesSeleccionados.splice(idx, 1);
                console.log($scope.listadoRolesSeleccionados);
            } else {
                $scope.listadoRolesSeleccionados.push(item);
                console.log($scope.listadoRolesSeleccionados);
            }
        };

        $scope.listadoOpcionesSeleccionados = [];

        //  Cambiar el estado del listado.
        $scope.seleccionarOpciones = function (item) {
            var idx = $scope.listadoOpcionesSeleccionados.indexOf(item);
            if (idx > -1) {
                $scope.listadoOpcionesSeleccionados.splice(idx, 1);
                console.log($scope.listadoOpcionesSeleccionados);
            } else {
                $scope.listadoOpcionesSeleccionados.push(item);
                console.log($scope.listadoOpcionesSeleccionados);
            }
            var longitud = $scope.listadoOpcionesSeleccionados.length;
            console.log(longitud);

        };

        //ngModel value
        $scope.selected = undefined;

        $scope.select = [];

        $scope.exist = function (item) {
            return $scope.select.indexOf(item);
        };

        $scope.toggleSelection = function (item) {
            var idx = $scope.select.indexOf(item);
            if (idx > -1) {
                $scope.select.splice(idx, 1);
                console.log($scope.select);
            } else {
                $scope.select.push(item);
                console.log($scope.select);
            }
        };

        //  Validaciones para crearUsuario.
        $scope.show = false;
        $scope.content = '';
        $scope.mensajeErrorValidacion = '';

        //  Validación para crear usuarios.
        $scope.validarCrearUsuario = function (riskUser) {
            var numero = /^([0-9])*$/;
            var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/;
            var validacion = {content: '', show: false};
            if (!riskUser.username) {
                validacion.content = 'Es requerido llenar el campo username';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!riskUser.userName) {
                validacion.content = 'Es requerido llenar el campo Nombre';
                $scope.content = validacion.content;
                validacion.show = true;
                $scope.show = validacion.show;
            } else if (!riskUser.userLastname) {
                validacion.content = 'Es requerido llenar el campo Apellido';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!riskUser.email) {
                validacion.content = 'Es requerido llenar el campo Email';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
//            } else if (riskUser.email.$invalid) {
//                validacion.content = 'Valor incorrecto para el email';
//                $scope.content = validacion.content;
//                console.log($scope.content);
//                validacion.show = true;
//                console.log(validacion.show);
//                $scope.show = validacion.show;
            } else if (!riskUser.userPhone) {
                validacion.content = 'Es requerido llenar el campo Telefono';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!riskUser.riskRole) {
                validacion.content = 'Debe seleccionar un rol';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            } else if (!riskUser.usroProfileId) {
                validacion.content = 'Debe seleccionar un perfil';
                $scope.content = validacion.content;
                console.log($scope.content);
                validacion.show = true;
                console.log(validacion.show);
                $scope.show = validacion.show;
            }

            return validacion;
        };

        $scope.habilitarCrear = function() {
            $scope.editActive = true;
            console.log("ENTRE EN HABILITARCREAR");
            $scope.habilitarBotones('crear');
        }

        $scope.habilitarBotones = function(tipo) {

            if($scope.validacion){            
                $scope.validacion.content = '';
                $scope.validacion.show = false;
            }
            switch (tipo) {
                case 'crear':
                    $scope.resetearFormulario();
                    $scope.userStateTemp = false;
                    $scope.botonesDeAccion.guardar = true
                    $scope.botonesDeAccion.crear = false;
                    $scope.botonesDeAccion.editar = false;
                    $scope.botonesDeAccion.eliminar = false;
                    $scope.campoEditable = true;
                    break;
                case 'editar':
                case 'guardar':
                case 'eliminar':
                    $scope.botonesDeAccion.crear = true;
                    $scope.botonesDeAccion.guardar = false;
                    $scope.botonesDeAccion.editar = false;
                    $scope.botonesDeAccion.eliminar = false;
                    $scope.botonesDeAccion.cancelar = false;
                    break
                case 'busqueda':
                    $scope.botonesDeAccion.editar = true;
                    $scope.botonesDeAccion.cancelar = true;
                    $scope.botonesDeAccion.eliminar = true;
                    $scope.botonesDeAccion.crear = false;
                    $scope.botonesDeAccion.guardar = false;
                    $scope.campoEditable = false;
                    break;
                default:
                    break;
            }
        }

        $scope.showPerfiles = function(){
            $rootScope.$broadcast('profileState', $scope.riskUser.usroProfileId);
        }


    }
})();