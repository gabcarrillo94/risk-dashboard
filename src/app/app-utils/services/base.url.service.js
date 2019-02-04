/* Servicio encargado de hacer setear los URL */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('BaseUrl', BaseUrl)
        
    BaseUrl.$inject = [];

    function BaseUrl () {

        this.path = {
            URL_LOGIN : '/risk-backend/rest/user/login',
            URL_REFRESH_TOKEN : '/risk-backend/rest/user/token',
            URL_CONFIG : '/risk-backend/rest/config/core',
            URL_EVENTS_SUMMARY : '/risk-backend/rest/events/summary',
            URL_CASES_SUMMARY : '/risk-backend/rest/case/summary',
            URL_CASES_CREATE : '/risk-backend/rest/case',
            URL_DASHBOARD : '/risk-backend/rest/dashboard',
            URL_PROFILE_ROLES : '/risk-backend/rest/perfilamiento/listarRoles',
            URL_CREAR_USUARIO : '/risk-backend/rest/perfilamiento/crearUsuario',
            URL_EDITAR_USUARIO : '/risk-backend/rest/perfilamiento/editarUsuario',
            URL_LISTADO_USUARIOS : '/risk-backend/rest/perfilamiento/listadoUsuarios',
            URL_LISTADO_USUARIOS_ROLES : '/risk-backend/rest/perfilamiento/listarUsuariosRoles',
            URL_ELIMINAR_USUARIO : '/risk-backend/rest/perfilamiento/eliminarUsuario',
            URL_CAMBIAR_PASSWORD_USUARIO : '/risk-backend/rest/perfilamiento/cambiarPassword',
            URL_BUSCAR_USUARIO : '/risk-backend/rest/perfilamiento/buscarUsuario',
            URL_BUSCAR_PERFIL_POR_ID : '/risk-backend/rest/perfilamiento/buscarPerfil',
            URL_PROFILE_PERFILES : '/risk-backend/rest/perfilamiento/listadoPerfiles',
            URL_PERFILES_ROLES_OPCIONES : '/risk-backend/rest//perfilamiento/listaPerfilesRolesOpciones',
            URL_PERFILES_ROLES_OPCIONES_ACTIVOS : '/risk-backend/rest//perfilamiento/listaPerfilesRolesOpcionesActivos',
            URL_CREAR_PERFIL_ROL_OPCION : '/risk-backend/rest//perfilamiento/crearPerfilRolOpcion',
            URL_EDITAR_PERFIL_ROL_OPCION : '/risk-backend/rest//perfilamiento/editarPerfilRolOpcion',
            URL_CREAR_PERFIL : '/risk-backend/rest/perfilamiento/crearPerfil',
            URL_EDITAR_PERFIL : '/risk-backend/rest/perfilamiento/editarPerfil',
            URL_PROFILE_OPTIONS : '/risk-backend/rest/perfilamiento/listarOpciones',
            URL_BUSCAR_PERFIL_POR_ROL : '/risk-backend/rest/perfilamiento/buscarPerfilPorRol',
            URL_PERFIL_ELIMINAR_POR_ID : '/risk-backend/rest/perfilamiento/eliminarPerfil',
            URL_LISTADO_USUARIO_ROL_PERFIL : '/risk-backend/rest/perfilamiento/listarUsuarioRolPerfil',
            URL_UP_FILE : '/risk-backend/rest/case',
            URL_COMMENT_LIST : '/risk-backend/rest/case',
            
            // -- PowerBI methods
            URL_PWBI: '/risk-backend/rest/report/powerbi',
            URL_LOGIN_PWBI : '/risk-backend/rest/report/powerbi/login',
            URL_GRUPOS_PWBI : '/risk-backend/rest/report/powerbi/groups',
        }        
        
        this.urlEventRelatedEvents = function (id) {
            var URL = '/risk-backend/rest/events/'
            return URL + id + '/related';
        };
            
        this.urlCheckEvents = function (id) {
            var URL = '/risk-backend/rest/events/'
            return URL + id + '/check';
        };
    
        this.urlCaseRelatedEvents = function (id) {
            var URL = '/risk-backend/rest/case/$id/events';
            return URL.replace('$id', id);
        };
    
        this.urlPasswordReset = function (username) {
            return '/risk-backend/rest/user/' + username.trim() + '/reset-password';
        };
    
        this.urlPasswordChange = function (username, token) {
            return '/risk-backend/rest/user/' + username + '/reset-password/' + token;
        };

        this.urlPowerBIReports = function(groupId){
            return '/risk-backend/rest/report/powerbi/' + groupId + '/reports';
        };

        this.urlPowerBIReportToken = function(groupId, reportId){
            return '/risk-backend/rest/report/powerbi/' + groupId + '/reports/' + reportId + '/embedToken';
        };
    }
})();
    