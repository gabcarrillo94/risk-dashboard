(function () {
    'use strict';

    angular
            .module('dashboard')
            .controller('PerfilesController', PerfilesController);

    PerfilesController.$inject = ['$scope', '$state', '$rootScope', '$interval', 
                                  '$localStorage', '$stateParams', '$modal', 
                                  'PerfilesFactory', '$http', '$log', 'toastr', 
                                  '$timeout', '$mdDialog', 'LoginFactory', 'ReportsFactory'];
    
    function PerfilesController($scope, $state, $rootScope, $interval, 
                                $localStorage, $stateParams, $modal, 
                                PerfilesFactory, $http, $log, toastr, 
                                $timeout, $mdDialog, LoginFactory, ReportsFactory) {
        var vm = this;
        $scope.listadoOpcion = [];
        $scope.listadoOpcionRespaldo = [];
        $scope.listadoRol = [];
        $scope.listadoRolRespaldo = [];
        $scope.listadoUsuarios = [];
        $scope.listadoUsuariosRespaldo = [];
        $scope.listadoUsuariosEditar = [];
        $scope.listadoUsuariosRoles = [];
        $scope.listadoPerfilesRolesOpciones = [];
        $scope.mensajeServicio = "";
        $scope.editActive = false;
        $scope.settings = { filtroGrupos : true};
        $scope.botonesDeAccion = {
            crear : true,
            guardar: false,
            editar: false,
            eliminar: false,
            cancelar: false
        }

        $scope.codPerfil = true;


        /**
         * Variables hidden utilizadas para comporar los username y email ocultos para la validación edicicón.
         * 
         * **/
        $scope.codigoPerfilHidden = "";

        $scope.riskUserPassword = {};

        $scope.userStore = $localStorage.currentUser;
        console.log($scope.userStore);
        $scope.mensajeEliminarUsuario = "";

        $scope.searchUsername = {};     //  Listado de usernames del sistema.
        $scope.searchEmail = {};        //  Listado de email del sistema.
        $scope.searchCodigoPerfil = {}; //  Listado de codigo de perfiles del sistema.

        //  Método encargado de convertir un arreglo en un JSON.
        $scope.createArrayToJSON = function (array) {
            var result = JSON.stringify(array);
            return result;
        };

        //  Método encargado de eliminar una propiedad del objecto Javascript, solo sirve para un Objecto.
        $scope._objectWithoutProperties = function (obj, keys) {
            var target = {};
            for (var i in obj) {
                if (keys.indexOf(i) >= 0)
                    continue;
                if (!Object.prototype.hasOwnProperty.call(obj, i))
                    continue;
                target[i] = obj[i];
            }
            return target;
        };

        vm.verificarCodigoPerfil = function (codigoPerfil) {
            var result = false;
            var idPerfil = "";
            var listado = $scope.listadoPerfilesRolesOpciones.length;
            if (null !== codigoPerfil || codigoPerfil !== "") {
                for (var i = 0; i < listado; i++) {
                    idPerfil = $scope.searchCodigoPerfil[i];
                    if (idPerfil === codigoPerfil) {
                        console.log($scope.searchCodigoPerfil[i] + " = " + codigoPerfil);
                        result = true;
                        break;
                    }
                }
            }
            return result;
        };

        $scope.buscar = [];
        $scope.seleccionado = {};

        $scope.settings.cargarGruposPBI = function(){
            $scope.grupoSelect = '';
            $scope.loaderGroups = true;
            ReportsFactory.getGroups()
                .then(function(res){
                    console.log(res);
                    $scope.loaderGroups = false;
                    $scope.pbi = { groups: res };
                    $scope.$apply();
                    console.log('GRUPOS CARGADOS');
                })
                .catch(function(e) {
                    $scope.loaderGroups = false;
                    console.log("ERRORES EN EL ReportsFactory.getGroups");
                    console.log(e);
                });
        }
        //  Método donde inicializamos nuestros servicios al ingresar al módulo.
        vm.initPerfilesController = function () {
            // -- Lipiar le formulario
            $scope.resetearFormularioPerfil;

            // -- Listado de Roles
            PerfilesFactory.listadoRoles()
                .then(function (res) {
                    $scope.listadoRol = res;
                    for (var i = 0; i < $scope.listadoRol.length; i++) {
                        $scope.listadoRol[i].value = false;
                    };
                    console.log($scope.listadoRol);
                    $scope.listadoRolRespaldo = $scope.listadoRol;
                    return res;
                })
                .catch(function (e) {
                    console.log("ERRORES EN EL PerfilesFactory.listadoRoles");
                    console.log(e);
                    $scope.listadoRol = [];
                });

            // -- Listado de Opciones
            PerfilesFactory.listarOpciones()
                .then(function (res) {
                    $scope.listadoOpcion = res;
                    for (var i = 0; i < $scope.listadoOpcion.length; i++) {
                        $scope.listadoOpcion[i].habilitado = false;
                    }
                    console.log($scope.listadoOpcion);
                    $scope.listadoOpcionRespaldo = $scope.listadoOpcion;
                    $scope.$apply();
                    return res;
                })
                .catch(function (e) {
                    console.log("ERRORES EN EL PerfilesFactory.listadoOpciones");
                    console.log(e);
                });

            
            // -- Listado grupos de informes PBI
            if(!$scope.pbi){
                $scope.settings.cargarGruposPBI();
            }
            
            // -- Listado de perfiles con roles y opciones relacionadas (para el buscador)
            PerfilesFactory.listadoPerfilesRolesOpcionesActivos()
                .then(function (res) {
                    $scope.listadoPerfilesRolesOpciones = res;
                    console.log("ESTE ES EL RESULTADO DE PERFILES ROLES OPCIONES");
                    console.log($scope.listadoPerfilesRolesOpciones);
                    for (var i = 0; i < $scope.listadoPerfilesRolesOpciones.length; i++) {
                        $scope.searchCodigoPerfil[i] = $scope.listadoPerfilesRolesOpciones[i].profileId;
                    }

                    if($stateParams.perfil){
                        $scope.profile = $scope.listadoPerfilesRolesOpciones.find(function(profile){
                            return profile.profileId === $stateParams.perfil.profileId
                        })
                        $scope.busquedaPerfil();
                    }

                    $scope.$apply();
                    return res;
                }).catch(function (e) {
                    console.log("ERROR EN PerfilesFactory.listadoUsuariosRoles");
                    console.log(e);
                    $scope.listadoPerfilesRolesOpciones = [];
                });
        };

        
        vm.initPerfilesController(); // -- Inicializar el modulo

        $scope.riskProfile = {};            //-- Definición del modelo de perfiles para el CRUD.
        $scope.riskProfile.activo = true;
        $scope.riskListadoRoles = {};
        $scope.riskListadoOpcionesMenu = {};

        // -- Parece no estar en uso @Daniel
        $scope.isActivo = function () {
            if ($scope.riskProfile.activo) {
                $scope.riskProfile.activo = true;
                console.log("TRUE");
            } else {
                $scope.riskProfile.activo = false;
                console.log("FALSE");
            }
        };

        // -- Parece no estar en uso @Daniel
        $scope.isPersonalizado = function () {
            if ($scope.riskProfile.esPersonalizado) {
                $scope.riskProfile.esPersonalizado = true;
                console.log("TRUE");
            } else {
                $scope.riskProfile.esPersonalizado = false;
                console.log("FALSE");
            }
        };

        // -- Parece no estar en uso @Daniel
        $scope.isDefecto = function () {
            if ($scope.riskProfile.defecto) {
                $scope.riskProfile.defecto = true;
                console.log("TRUE");
            } else {
                $scope.riskProfile.defecto = false;
                console.log("FALSE");
            }
        };


        $scope.cerrarVentanaPerfilRol = function () {
            $scope.habilitarOpcionRoles = false;
        };

        $scope.mensajeErrorValidacion = "";

        $scope.habilitarEditarUsuario = function () {
            $scope.habilitarEditarUsuario = true;
        };

        $scope.irPerfilesRoles = function () {
            $scope.habilitarOpcionRoles = true;
        };

        $scope.listadoRolesSeleccionados = [];

        $scope.seleccionarRoles = function (item) {
            console.log(item);

            var idx = $scope.listadoRolesSeleccionados.findIndex(function(rol){
                return rol.roleId === item.roleId;
            })
            if (idx > -1) {
                $scope.listadoRolesSeleccionados.splice(idx, 1);
                console.log($scope.listadoRolesSeleccionados);
            } else {
                $scope.listadoRolesSeleccionados.push(item);
                console.log($scope.listadoRolesSeleccionados);
            }
        };

        $scope.listadoOpcionesSeleccionados = [];
        //  Cambiar el estado del listado de opciones.
        $scope.seleccionarOpciones = function (item) {
            var idx = $scope.listadoOpcionesSeleccionados.indexOf(item);
            if (idx > -1) {
                $scope.listadoOpcionesSeleccionados.splice(idx, 1);
            } else {
                $scope.listadoOpcionesSeleccionados.push(item);
            }
        };

        $scope.listadoGruposSeleccionados = [];
        //  Cambiar el estado del listado de grupos.
        $scope.seleccionarGruposPBI = function (item) {
            var idx = $scope.listadoGruposSeleccionados.indexOf(item);
            if (idx > -1) {
                $scope.listadoGruposSeleccionados.splice(idx, 1);
            } else {
                $scope.listadoGruposSeleccionados.push(item);
            }
            console.log($scope.listadoGruposSeleccionados);
        };

        $scope.listarReportes = function(grupo) {
            $scope.loaderReports = true;
            $scope.pbi.reports = {};
            $scope.grupoSelect = grupo.name;
            // -- Obtener los reportes
            ReportsFactory.getReports({ 
                groupId: grupo.workspaceId
            }).then(function(res) {
                $scope.loaderReports = false;
                $scope.pbi.reports = res;
                $scope.$apply();
                console.log('REPORTES CARGADOS');
            }).catch(function(e) {
                $scope.loaderReports = false;
                console.log("ERROR @ ReportsFactory.getReports")
            });
        }

        $scope.eliminarPerfil = function () {
            if (null == $scope.riskProfile.profileId) {
                $scope.mensajeServicio = "Debe seleccionar un perfil para eliminar.";
            } else {
                alert("PERFECTO COMENZAMOS A ELIMINAR EL PERFIL");
                PerfilesFactory.eliminarPerfil($scope.riskProfile.profileId)
                        .then(function (res) {
                            $scope.mensajeServicio = "Se elimino el perfil exitosamente";
                            $scope.resetearFormularioPerfil();
                            $scope.riskProfile = {};
                            toastr.success($scope.mensajeServicio);
                            $scope.habilitarBotones('eliminar');
                            $scope.editActive = false;
                            $scope.codPerfil = true;
                            $scope.profile = '';
                            vm.initPerfilesController();
                        })
                        .catch(function (e) {
                            $scope.mensajeServicio = "Error en la eliminación del perfil";
                            $scope.riskProfile = [];

                        });

//                vm.initPerfilesController;
                $scope.resetearFormularioPerfil;

                $scope.riskProfile = [];
                $scope.listadoOpcion = $scope.listadoOpcionRespaldo;
                $scope.listadoRol = $scope.listadoRolRespaldo;
            }
        };

        $scope.guardarPerfil = function () {
//            console.log($scope.listadoRol);
//            var listado;
//            for (var i = 0, listado = $scope.listadoRol.length; i < listado; i++) {
//                console.log("NUESTRO ROL ES ");
//                console.log($scope.listadoRol[i]);
//                console.log($scope.listadoRol[i].value);
//            }
//            console.log("NUESTROS ROLES FINALES SON = ");
//            console.log($scope.listadoRol);
            var v = $scope.validarCamposPerfiles($scope.listadoOpcionesSeleccionados, $scope.listadoRolesSeleccionados, $scope.riskProfile);
            var validarCodigoPerfil = vm.verificarCodigoPerfil($scope.riskProfile.profileId);
            $scope.validacion = v;
            var listadoRoles = $scope.listadoRol;
            var listadoOpciones = $scope.listadoOpcion;
            //  Eliminamos las propiedades innecesarias para el envio correcto como consumo de servicio.
            //  Listado de Roles
            for (var i = 0, len = $scope.listadoRolesSeleccionados.length; i < len; i++) {
                delete $scope.listadoRolesSeleccionados[i].$$hashKey;
            }

            //  Listado de Opciones.
            for (var i = 0, len = $scope.listadoOpcionesSeleccionados.length; i < len; i++) {
                delete $scope.listadoOpcionesSeleccionados[i].$$hashKey;
            }

            // Listado de GruposPBI
            $scope.listadoGruposSeleccionados = $scope.listadoGruposSeleccionados.filter(function(grupo) { return grupo.activo == true })
            for (var i = 0, len = $scope.listadoGruposSeleccionados.length; i < len; i++) {
                delete $scope.listadoGruposSeleccionados[i].$$hashKey;
                //delete $scope.listadoGruposSeleccionados[i].activo;
                delete $scope.listadoGruposSeleccionados[i].isReadOnly;
                delete $scope.listadoGruposSeleccionados[i].riskDomain;
            }
            

            //  Convertimos nuestro resultado en json para luego enviarlo a nuestro consumo de servicio.
            var listadoOpcionesSeleccionados = $scope.createArrayToJSON($scope.listadoOpcionesSeleccionados);
            var listadoRolesSeleccionados = $scope.createArrayToJSON($scope.listadoRolesSeleccionados);
            var listadoGruposSeleccionados = $scope.createArrayToJSON($scope.listadoGruposSeleccionados);

            $scope.data = [];
            if (validarCodigoPerfil) {
                $scope.mensajeServicio = "No puede crear un perfil con el mismo código, por favor ingrese otro diferente";
            } else if (!v.showPerfil) {
                console.log($scope.riskProfile);
                console.log("PERFECTO COMENZAMOS A CONSUMIR NUESTRO SERVICIO DE CREAR PERFILES.");
//                PerfilesFactory.crearPerfil($scope.idUser, $scope.riskProfile, listadoRolesSeleccionados, listadoOpcionesSeleccionados)
//                        .then(function (res) {
//                            $scope.$apply;
//                            return res;
//                        })
//                        .catch(function (e) {
//                            console.log("ERRORES EN EL PerfilesFactory.crearPerfil");
//                            console.log(e);
//                            $scope.riskProfile = [];
//                            $scope.$apply;
//                        });

                PerfilesFactory.crearPerfilRolOpcion($scope.riskProfile, $scope.listadoRolesSeleccionados, $scope.listadoOpcionesSeleccionados, $scope.listadoGruposSeleccionados)
                        .then(function (res) {
                            $scope.mensajeServicio = "Se creo el perfil exitosamente";
                            // $scope.riskProfile = {};
                            // vm.initPerfilesController();
                            $scope.$apply();
                            toastr.success($scope.mensajeServicio)
                            $scope.habilitarBotones('editar');
                            $scope.editActive = false;
                            $scope.codPerfil = true;
                            $scope.actualizarPerfiles();
                            // $scope.riskProfile = [];
                            // for (var i = 0; i < $scope.listadoRolesSeleccionados.length; i++) {
                            //     $scope.listadoRol[i].value = false;
                            //     $scope.listadoRolesSeleccionados[i].value = false;
                            //     console.log($scope.listadoRol);
                            // };

                            // $scope.listadoRolesSeleccionados = [];

                            // for (var i = 0; i < $scope.listadoOpcionesSeleccionados.length; i++) {
                            //     $scope.listadoRol[i].value = false;
                            //     $scope.listadoOpcion[i].value = false;
                            //     $scope.listadoOpcionesSeleccionados[i].value = false;
                            //     console.log($scope.listadoOpcion);
                            // };

                            // $scope.listadoOpcionesSeleccionados = [];
                            // console.log($scope.listadoOpcionesSeleccionados);
                            return res;
                        })
                        .catch(function (e) {
                            if(e.msg){
                                switch (e.msg) {
                                    case "Profile Repeated":
                                        $scope.mensajeServicio = "Código de perfil duplicado intente con otro";
                                        break;
                                    default:
                                        break;
                                }
                            }else{
                                $scope.mensajeServicio = "Error en la creación del perfil";
                            }
                            console.log(e)
                            toastr.error($scope.mensajeServicio)
                            // vm.initPerfilesController();
                        })
//                        .finally(function () {
//                            console.log("YA FINALIZAMOS NUESTRO CONSUMO DE SERVICIO");
//                            vm.initPerfilesController();
//                            $scope.riskProfile = {};
//                        })
                        ;

            }
        };


        $scope.chequearEditarPerfil = function(){

            // $scope.editarPerfil(false);

            // ARREGLAR LUEGO DE CAMBIAR EL HABILITADO
            if($scope.riskProfile.profileId === $scope.userStore.opcionesMenu[0].profileId) {
                var confirm = $mdDialog.confirm()
                $scope.modalPerfilRepetido = $modal({
                    templateUrl: 'app/perfiles/same-profile.html',
                    backdrop: 'static',
                    size: 'md',
                    scope: $scope,
                    keyboard: false,
                    show: true
                });
            }else{
                $scope.editarPerfil(false);
            }
        }


        //  Método para editar el perfil seleccionado.
        $scope.editarPerfil = function (mismoPerfil) {     
            var v = $scope.validarCamposPerfiles($scope.listadoOpcionesSeleccionados, $scope.listadoRolesSeleccionados, $scope.riskProfile);
            var validarCodigoPerfil = vm.verificarCodigoPerfil($scope.riskProfile.profileId);
            $scope.validacion = v;
            var listadoRoles = $scope.listadoRol;
            var listadoOpciones = $scope.listadoOpcion;


            //  Eliminamos las propiedades innecesarias para el envio correcto como consumo de servicio.
            //  Listado de Roles
            for (var i = 0, len = $scope.listadoRolesSeleccionados.length; i < len; i++) {
                delete $scope.listadoRolesSeleccionados[i].$$hashKey;
            }

            //  Listado de Opciones.
            for (var i = 0, len = $scope.listadoOpcionesSeleccionados.length; i < len; i++) {
                delete $scope.listadoOpcionesSeleccionados[i].$$hashKey;
            }

            // Listado de GruposPBI
            $scope.listadoGruposSeleccionados = $scope.listadoGruposSeleccionados.filter(function(grupo) { return grupo.activo == true })
            for (var i = 0, len = $scope.listadoGruposSeleccionados.length; i < len; i++) {
                delete $scope.listadoGruposSeleccionados[i].$$hashKey;
                //delete $scope.listadoGruposSeleccionados[i].activo;
                delete $scope.listadoGruposSeleccionados[i].isReadOnly;
                delete $scope.listadoGruposSeleccionados[i].riskDomain;
            }


            //  Convertimos nuestro resultado en json para luego enviarlo a nuestro consumo de servicio.
            var listadoOpcionesSeleccionados = $scope.createArrayToJSON($scope.listadoOpcionesSeleccionados);
            var listadoRolesSeleccionados = $scope.createArrayToJSON($scope.listadoRolesSeleccionados);
            var listadoGruposSeleccionados = $scope.createArrayToJSON($scope.listadoGruposSeleccionados);

            //VERIFICAMOS SI EXISTE EL MODAL Y LO CERRAMOS 
            //ANTES DE MODIFICAR
            if($scope.modalPerfilRepetido){
                $scope.modalPerfilRepetido.$promise.then($scope.modalPerfilRepetido.hide)
            }

            if (!v.showPerfil) {
                console.log($scope.riskProfile);
                console.log($scope.riskProfile.profileId);
                if ($scope.codigoPerfilHidden === $scope.riskProfile.profileId) {

                    //  Consumimos nuestro servicio de modificar o editar perfil.
                    PerfilesFactory.editarPerfilRolOpcion($scope.codigoPerfilHidden, $scope.riskProfile, $scope.listadoRolesSeleccionados, $scope.listadoOpcionesSeleccionados, $scope.listadoGruposSeleccionados)
                    .then(function (res) {
                        $scope.mensajeServicio = 'Se edito el perfil exitosamente.';
                        
                        // $scope.resetearFormularioPerfil();
                        toastr.success($scope.mensajeServicio);
                        $scope.habilitarBotones('editar');
                        $scope.editActive = false;
                        $scope.codPerfil = true;
                        //REFRESCAR LOS CAMBIOS QUE SE HAN HECHO EN LOS PERFILES
                        var indexToPop = $scope.listadoPerfilesRolesOpciones.findIndex(function(option){
                            return option.originalProfileId === $scope.riskProfile.originalProfileId
                        })
                        
                        // $scope.listadoOpcionesSeleccionados
                
                        $scope.actualizarPerfiles();


                        // var currentProfileId = $scope.profile.profileId
                        // $scope.profile = {profileId: currentProfileId};
                        // console.log($scope.profile);
                        

                        // $scope.riskProfile.riskOptionList = $scope.listadoOpcionesSeleccionados;
                        if(mismoPerfil){
                            LoginFactory.Logout();
                        }
                        return res;
            
                    })
                    .catch(function (e) {
                        $scope.mensajeServicio = 'Problemas al editar el perfil.';
                        toastr.error($scope.mensajeServicio);
                        $scope.resetearFormularioPerfil;
                        $scope.riskProfile = [];
                    }).finally(function () {
                        console.log("CULMINANOS NUESTRA EDICIÓN DEL PERFIL");
                        // vm.initPerfilesController();
                        // $scope.riskProfile = [];
    //                                  $scope.$apply();
                    });   
                    

                } else {

                    if (validarCodigoPerfil) {
                        $scope.mensajeServicio = "Ya existe el perfil en sistema, por favor ingrese otro diferente";
                    } else {
                        $scope.mensajeServicio = "El código del perfil es unico y no puede modificarse.";
                        //  Consumimos nuestro servicio de modificar o editar perfil.


                    }

                }

                $scope.resetearFormularioPerfil;

            }
        };

        $scope.resetearFormularioPerfil = function () {

            $scope.riskProfile = [];
            $scope.profile = [];
            $scope.listadoOpcionesSeleccionados = [];
            // for (var i = 0; i < $scope.listadoRolesSeleccionados.length; i++) {
            //     $scope.listadoRol[i].value = false;
            //     $scope.listadoRolesSeleccionados[i].value = false;
            //     console.log($scope.listadoRol);
            // }
            // ;

            $scope.listadoRol.map(function(elem){
                elem.value = false;
            });

            $scope.listadoOpcion.map(function(elem){
                elem.habilitado = false;
            });

            $scope.pbi.groups.map(function(elem){
                elem.habilitado = false;
            });
            

            $scope.listadoRolesSeleccionados = [];
            console.log($scope.listadoRolesSeleccionados);

            for (var i = 0; i < $scope.listadoOpcionesSeleccionados.length; i++) {
                $scope.listadoRol[i].value = false;
                $scope.listadoOpcion[i].habilitado = false;
                $scope.listadoOpcionesSeleccionados[i].habilitado = false;
                console.log($scope.listadoOpcion);
            };
        };

        $scope.profile = [];
        $scope.mensajePerfil = "";

        $scope.limpiarFormulario = function () {
            $scope.botonesDeAccion = {
                crear : true,
                guardar: false,
                editar: false,
                eliminar: false,
                cancelar: false
            }
            $scope.editActive = false;
            $scope.resetearFormularioPerfil();
        };

        $scope.busquedaPerfil = function () {
            $scope.profileEdit = [];
            $scope.riskOptionList = [];
            $scope.riskRoleList = [];
            if (null == $scope.profile.profileId) {
//                console.log("NO EXISTE EL PERFIL EN SISTEMA");
                $scope.riskProfile = [];
                $scope.listadoOpcion = $scope.listadoOpcionRespaldo;
                $scope.listadoRol = $scope.listadoRolRespaldo;
                $scope.codigoPerfilHidden = "";
            } else {
                //  Comenzamos con nuestra la búsqueda y realizamos las modificaciones correspondientes.
                console.log($scope.profile);
                $scope.editActive = true;
                $scope.habilitarBotones('busqueda');
                $scope.riskProfile = $scope.profile;
                $scope.riskOptionList  = [];
                $scope.riskOptionList = $scope.profile.riskOptionList;
                console.log($scope.riskOptionList);
                console.log($scope.listadoOpcion);
                $scope.riskWorkspaceList = $scope.profile.riskWorkspaceList;
                console.log($scope.riskWorkspaceList);
                
                if($scope.pbi){ // Si no hay datos de PoweBI salta esta sección
                    // -- Limpiar los grupos PBI previamente seleccionados
                    //if (Object.keys($scope.pbi.groups[0]).includes('habilitado')){
                        $scope.pbi.groups.map(function(opcion){
                            opcion.habilitado = false;
                        })
                    //}
                    // -- Cargar los grupos PBI seleccionados del usuario actual
                    $scope.listadoGruposSeleccionados = [];
                    if ($scope.riskWorkspaceList){
                        $scope.riskWorkspaceList.forEach(function(gruposUsuario){
                            var currentOption = $scope.pbi.groups.find(function(grupo){
                                return gruposUsuario.workspaceId === grupo.workspaceId;
                            })
                            if(currentOption){
                                currentOption.habilitado = true;
                                $scope.listadoGruposSeleccionados.push(currentOption);
                            } 
                        })
                    }
                }

                $scope.riskRoleList = $scope.profile.riskRoleList;
                $scope.listadoRolesSeleccionados = [];                
                $scope.riskRoleList.forEach(function(role){
                    role.value = true;
                    $scope.listadoRolesSeleccionados.push(role);
                })
                console.log($scope.riskRoleList);
                console.log($scope.riskOptionList);

                ///VERIFICAR SI SE HA BUSCADO ANTERIORMENTE
                // Y SETEAR LAS OPCIONES A FALSE
                if (Object.keys($scope.listadoOpcion[0]).includes('habilitado')){
                    $scope.listadoOpcion.map(function(opcion){
                        opcion.habilitado = false;
                    })
                }

                if ($scope.riskOptionList){
                    $scope.riskOptionList.forEach(function(opcionUsuario){
                        var currentOption = $scope.listadoOpcion.find(function(opcion){
                            return opcionUsuario.idFuncion === opcion.idFuncion;
                        })
                        if(currentOption) currentOption.habilitado = true;
                    })
                }
                // $scope.listadoOpcion = $scope.riskOptionList;
                $scope.listadoOpcionesSeleccionados = [];
                $scope.listadoOpcion.forEach(function(opcion) {
                    if(opcion.habilitado){
                        $scope.listadoOpcionesSeleccionados.push(opcion);
                    }
                })

                if (Object.keys($scope.listadoRol[0]).includes('value')){
                    $scope.listadoRol.map(function(rol){
                        rol.value = false;
                    })
                }
            
                // VERIFICAR LOS ROLES DEL SISTEMA CON LOS ROLES QUE TIENE EL PERFIL
                $scope.listadoRol.map(function(currentRol){
                    var rol = $scope.riskRoleList.find(function(role){
                        return role.roleId === currentRol.roleId;
                    })
                    if(rol) currentRol.value = rol.value;
                })
                $scope.codigoPerfilHidden = $scope.profile.profileId;
//                console.log("EL CODIGO PERFIL SELECCIONADO ES = ");
//                console.log($scope.codigoPerfilHidden);
            }

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

        //  Validar formulario Crear Perfil.
        $scope.validarCamposPerfiles = function (listadoOpcionesSeleccionados, listadoRolesSeleccionados, riskProfile) {
            var validacion = {contentPerfil: '', showPerfil: false};
            var cantidadOpcionesSeleccionadas = listadoOpcionesSeleccionados.length;
            var cantidadRolesSeleccionados = listadoRolesSeleccionados.length;
            $scope.resultadoPerfil = [];

            if (!riskProfile.profileName) {
                validacion.contentPerfil = 'Escriba el nombre de su perfil.';
                $scope.contentPerfil = validacion.contentPerfil;
                console.log($scope.contentPerfil);
                validacion.showPerfil = true;
                console.log(validacion.showPerfil);
                $scope.showPerfil = validacion.showPerfil;
            } else if (!riskProfile.profileId) {
                validacion.contentPerfil = 'Escriba el código de su perfil.';
                $scope.contentPerfil = validacion.contentPerfil;
                console.log($scope.contentPerfil);
                validacion.showPerfil = true;
                console.log(validacion.showPerfil);
                $scope.showPerfil = validacion.showPerfil;
            } else if (!riskProfile.originalProfileId) {
                validacion.contentPerfil = 'Escriba el origen de su perfil.';
                $scope.contentPerfil = validacion.contentPerfil;
                console.log($scope.contentPerfil);
                validacion.showPerfil = true;
                console.log(validacion.showPerfil);
                $scope.showPerfil = validacion.showPerfil;
            } else if (!riskProfile.descripcion) {
                validacion.contentPerfil = 'Escriba la descricpción de su perfil.';
                $scope.contentPerfil = validacion.contentPerfil;
                console.log($scope.contentPerfil);
                validacion.showPerfil = true;
                console.log(validacion.showPerfil);
                $scope.showPerfil = validacion.showPerfil;
            } else if (cantidadOpcionesSeleccionadas <= 0) {
                validacion.contentPerfil = 'Seleccione al menos una opción del ménu de opciones del sistema.';
                $scope.contentPerfil = validacion.contentPerfil;
                console.log($scope.contentPerfil);
                validacion.showPerfil = true;
                console.log(validacion.showPerfil);
                $scope.showPerfil = validacion.showPerfil;
            } else if (cantidadRolesSeleccionados <= 0) {
                validacion.contentPerfil = 'Seleccione al menos un rol para su perfil.';
                $scope.contentPerfil = validacion.contentPerfil;
                console.log($scope.contentPerfil);
                validacion.showPerfil = true;
                console.log(validacion.showPerfil);
                $scope.showPerfil = validacion.showPerfil;
            }

            if(validacion.showPerfil){
                $timeout(function(){
                    $('body').scrollTo(('#alert-msg'), 200);
                },100)
            }
            return validacion;
        };

        $scope.habilitarCrear = function() {
            $scope.resetearFormularioPerfil();
            vm.initPerfilesController();
            $scope.editActive = true;
            $scope.habilitarBotones('crear');
        }

        $scope.habilitarBotones = function(tipo) {

            $scope.contentPerfil = '';
            switch (tipo) {
                case 'crear':
                    $scope.botonesDeAccion.guardar = true
                    // $scope.botonesDeAccion.cancelar = true;
                    $scope.botonesDeAccion.crear = false;
                    $scope.botonesDeAccion.editar = false;
                    $scope.botonesDeAccion.eliminar = false;
                    $scope.codPerfil = true;
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
                    $scope.codPerfil = false;
                    break;
                default:
                    break;
            }
        }

        $scope.actualizarPerfiles = function(){
            $timeout(function(){
                PerfilesFactory.listadoPerfilesRolesOpcionesActivos()
                .then(function (res) {
                    $scope.listadoPerfilesRolesOpciones = res;
                    console.log("ESTE ES EL RESULTADO DE PERFILES ROLES OPCIONES");
                    console.log($scope.listadoPerfilesRolesOpciones);
                    for (var i = 0; i < $scope.listadoPerfilesRolesOpciones.length; i++) {
                        $scope.searchCodigoPerfil[i] = $scope.listadoPerfilesRolesOpciones[i].profileId;
                        if ($scope.profile.profileId === $scope.listadoPerfilesRolesOpciones[i].profileId){
                            $scope.profile = $scope.listadoPerfilesRolesOpciones[i];
                        }
                    }
                    console.log($scope.profile);
                    $scope.$apply();
                })
            }, 800)
        }

    }
})();