angular
.module('dashboard')
.factory('PerfilesFactory', PerfilesFactory)

PerfilesFactory.$inject = ['$http', '$q', 'BaseUrl'];

function PerfilesFactory($http, $q, BaseUrl) {
    var service = {};
    var deferred = $q.defer();

    service.listadoRoles = function() {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_PROFILE_ROLES'],
                method: 'POST'
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });
    };

    // -- Listado de todos los perfiles con sus roles y opciones.
    service.listadoPerfilesRolesOpciones = function() {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_PERFILES_ROLES_OPCIONES'],
                method: 'POST'
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });
    };
    
    //  Listado de todas los perfiles activos con sus roles y opciones
    service.listadoPerfilesRolesOpcionesActivos = function() {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_PERFILES_ROLES_OPCIONES_ACTIVOS'],
                method: 'POST'
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });
    };

    service.crearUsuario = function (c) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_CREAR_USUARIO'],
                method: 'POST',
                data: c,
                params: {
                    username: c.username,
                    name: c.userName,
                    lastName: c.userLastname,
                    estado: c.userState,
                    email: c.email,
                    telefono: c.userPhone,
                },
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        })

    };

    service.editarUsuario = function (c) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_EDITAR_USUARIO'],
                method: 'POST',
                data: c,
                params: {
                    id: c.userId,
                    username: c.username,
                    name: c.userName,
                    lastName: c.userLastname,
                    estado: c.userState,
                    email: c.email,
                    telefono: c.userPhone,
                    codigoRol: c.riskRole.roleId,
                    codigoPerfil: c.usroProfileId.profileId,
                    tipoUsuario: c.userType
                }
            })
            .success(function (response, status) {
                console.log(c.username);
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });
    };

    service.buscarUsuario = function (username) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_BUSCAR_USUARIO'],
                method: 'POST',
                data: username,
                params: {
                    username: username
                }
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });
    };
    
    service.pruebaCrearUsuario = function (c) {
        $http({
            url: BaseUrl.path['URL_CREAR_USUARIO'],
            method: 'POST',
            data: c,
            params: {
                username: c.username,
                name: c.userName,
                lastName: c.userLastname,
                estado: c.userState,
                email: c.email,
                telefono: c.userPhone
            },
        })
        .success(function (response, status) {
            deferred.resolve(response);
            return response;
        })
        .error(function (response, status) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    
    service.crearUsuarioRolPerfil = function (c) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_CREAR_USUARIO'],
                method: 'POST',
                data: c,
                params: {
                    username: c.username,
                    name: c.userName,
                    lastName: c.userLastname,
                    estado: c.userState,
                    email: c.email,
                    telefono: c.userPhone,
                    codigoRol: c.riskRole.roleId,
                    codigoPerfil: c.usroProfileId.profileId,
                    tipoUsuario: c.userType
                },
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });

    };
    
    service.modificarUsuarioRolPerfil = function (c, codigoPerfil) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_EDITAR_USUARIO'],
                method: 'POST',
                data: c,
                params: {
                    id: c.userId,
                    username: c.username,
                    name: c.userName,
                    lastName: c.userLastname,
                    estado: c.userState,
                    email: c.email,
                    telefono: c.userPhone,
                    codigoRol: c.riskRole.roleId,
                    codigoPerfil: c.usroProfileId.profileId
                }
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });

    };
    
    service.pruebaEditarUsuario = function (c) {
            $http({
                url: BaseUrl.path['URL_EDITAR_USUARIO'],
                method: 'POST',
                data: c,
                params: {
                    id: c.userId,
                    username: c.username,
                    name: c.userName,
                    lastName: c.userLastname,
                    estado: c.userState,
                    email: c.email,
                    telefono: c.userPhone
                },
            })
            .success(function (response, status) {
                deferred.resolve(response);
                return response;
            })
            .error(function (response, status) {
                deferred.reject(response);
            });

        return deferred.promise;
    };
    
    service.eliminarUsuario = function (id) {
        return new Promise(function (resolve, status) {
            $http({
                url: BaseUrl.path['URL_ELIMINAR_USUARIO'],
                method: 'POST',
                data: id,
                params: {
                    id: id
                }
            })
            .success(function (response, status) {
                console.log(id);
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                console.log(id);
                reject(response);
            });
        });

    };

    //  Resetear usuario.
    service.cambiarPassword = function (id, c) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_CAMBIAR_PASSWORD_USUARIO'],
                method: 'POST',
                params: {
                    id: id,
                    passwordAntiguo: c.passwordAntigua,
                    passwordNuevo: c.passwordNueva,
                    passwordConfirmarNuevo: c.passwordConfirmar
                },
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                console.log(response);
                reject(response);
            });
        });
    };

    service.listarOpciones = function() {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_PROFILE_OPTIONS'],
                method: 'POST'
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });
    };
    
    service.crearPerfilRolOpcion = function (c, listadoRoles, listadoOpciones, listadoGrupos){
         return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_CREAR_PERFIL_ROL_OPCION'],
                method: 'POST',
                data: {
                    profileId: c.profileId,
                    profileName: c.profileName,
                    originalProfileId: c.originalProfileId,
                    activo: c.activo,
                    esPersonalizado: c.esPersonalizado,
                    descripcion: c.descripcion,
                    riskRoleList: listadoRoles,
                    riskOptionList: listadoOpciones,
                    riskWorkspaceList: listadoGrupos
                },
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                console.log(response);
                reject(response);
            });                 
         });
        
    };
    
    service.editarPerfilRolOpcion = function (codigoPerfil, c, listadoRoles, listadoOpciones, listadoGrupos){
            $http({
                url: BaseUrl.path['URL_EDITAR_PERFIL_ROL_OPCION'],
                method: 'POST',
                data: {
                    profileId: codigoPerfil,
                    profileName: c.profileName,
                    originalProfileId: c.originalProfileId,
                    activo: c.activo,
                    esPersonalizado: c.esPersonalizado,
                    descripcion: c.descripcion,
                    riskRoleList: listadoRoles,
                    riskOptionList: listadoOpciones,
                    riskWorkspaceList: listadoGrupos
                },
            })
            .success(function (response, status) {
                deferred.resolve(response);
                return response;
            })
            .error(function (response, status) {
                console.log(response);
                deferred.reject(response);
            });        
            return deferred.promise;
    };

    service.crearPerfil = function (id, c, listadoRoles, listadoOpciones) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_CREAR_PERFIL'],
                method: 'POST',
                params: {
                    idUsuario: id,
                    codigoPerfil: c.profileId,
                    perfilOrigen: c.originalProfileId,
                    activo: c.activoPerfil,
                    personalizado: c.esPersonalizado,
                    defecto: c.defecto,
                    descripcion: c.descripcion,
                    listadoRoles: listadoRoles,
                    listadoOpciones: listadoOpciones
                },
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                console.log(response);
                reject(response);
            });

        });
    };
    
    //  Editar perfil con sus roles y opciones.
    service.editarPerfil = function (id, c, listadoRoles, listadoOpciones) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_EDITAR_PERFIL'],
                method: 'POST',
                params: {
                    idUsuario: id,
                    codigoPerfil: c.profileId,
                    perfilOrigen: c.originalProfileId,
                    activo: c.activoPerfil,
                    personalizado: c.esPersonalizado,
                    defecto: c.defecto,
                    descripcion: c.descripcion,
                    listadoRoles: listadoRoles,
                    listadoOpciones: listadoOpciones
                },
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                console.log(response);
                reject(response);
            });
        });
    };
    
    //  La eliminación es de manera lógica no física.
    service.eliminarPerfil = function (idPerfil) {
        console.log("EL CÓDGIO DEL PERFIL ES");
        console.log(idPerfil);
        return new Promise(function (resolve, status) {
            $http({
                url: BaseUrl.path['URL_PERFIL_ELIMINAR_POR_ID'],
                method: 'POST',
                data: idPerfil,
                params: {
                    idPerfil: idPerfil
                }
            })
                    .success(function (response, status) {
                        resolve(response);
                        return response;
                    })
                    .error(function (response, status) {
                        console.log(response);
                        reject(response);
                    });
        });

    };
    
    service.listadoUsuarios = function(){
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_LISTADO_USUARIOS'],
                method: 'POST',
            })
                    .success(function (response, status) {
                        resolve(response);
                        return response;
                    })
                    .error(function (response, status) {
                        reject(response);
                    });
        });
        
    };
    
    service.pruebaListadoUsuarios = function(){
            $http({
                url: BaseUrl.path['URL_LISTADO_USUARIOS'],
                method: 'POST',
            })
            .success(function (response, status) {
                deferred.resolve(response);
                return response;
            })
            .error(function (response, status) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    
    //  Listado de usuarios con roles.
    service.listadoUsuariosRoles = function(){
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_LISTADO_USUARIOS_ROLES'],
                method: 'POST'
            })
            .success(function (response, status) {
                resolve(response);
                return response;
            })
            .error(function (response, status) {
                reject(response);
            });
        });
    };
 
    //  Buscar perfil por codigo o id.
    service.buscarPerfil = function (id) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_BUSCAR_PERFIL_POR_ID'],
                method: 'POST',
                params: {
                    idPerfil: id
                },
            })
                    .success(function (response, status) {
                        resolve(response);
                        return response;
                    })
                    .error(function (response, status) {
                        reject(response);
                    });
        });
    };
    
    service.listadoPerfilesPorRol = function(roleId){
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_BUSCAR_PERFIL_POR_ROL'],
                method: 'POST',
                params: {
                    codigoRol: roleId
                }
            })
                    .success(function (response, status) {
                        resolve(response);
                        return response;
                    })
                    .error(function (response, status) {
                        reject(response);
                    });
        });
        
    };

    return service;
};