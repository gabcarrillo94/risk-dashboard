(function() {
  'use strict';

  angular
    .module('dashboard')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login',
        {
          url: '/login',
          templateUrl: 'app/login/login.html',
          controller: 'LoginController',
          controllerAs: 'login',
          params: {
            id: 0,
            message: null
          },
          resolve: {
            NotAuthenticated: function ($q, $localStorage) {
              if ($localStorage.currentUser) {
                return $q.reject('Authenticated');
              }
            }
          }
        })
        .state('recoveryPassword',
        {
          url: '/reset/:username/:token',
          templateUrl: 'app/login/recuperar_password/recuperar_password.html',
          controller: 'RecuperarPasswordController',
          resolve: {
            NotAuthenticated: function ($q, $localStorage) {
              if ($localStorage.currentUser) {
                return $q.reject('Authenticated');
              }
            }
          }
        })
      .state('app',
        {
          url: '/',
          abstract: true,
          templateUrl: 'app/main/main.html',
          controller: 'MainController',
          controllerAs: 'main',
          resolve: {
            isAuthenticated: function ($q, $localStorage) {
              if (!($localStorage.currentUser)) {
                return $q.reject('NotAuthorized');
              }
            }
          }
        })
        .state('app.home',
        {
          url: 'home',
          views: {
            'layoutContent':{
              templateUrl: 'app/home/home.html',
              controller: 'HomeController',
              controllerAs: 'home'
            }
          },
          params:{
              desde: null,
              hasta: null
          },
          reloadOnSearch: false
        })
        .state('app.alarmas',
        {
          url: 'alarmas',
          views: {
            'layoutContent':{
              templateUrl: 'app/alarmas/alarmas.html',
              controller: 'AlarmasController',
              controllerAs: 'alarmas'
            },
          },
          params:{
              desde: null,
              hasta: null
          },
          reloadOnSearch: false,
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNINC');
            }
          }
        })
        .state('app.casos',
        {
          url: 'casos/:idCaso',
          views: {
            'layoutContent':{
              templateUrl: 'app/casos/casos.html',
              controller: 'CasosController',
              controllerAs: 'casos'
            }
          },
          reloadOnSearch: false,
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNCASO');
            }
          }
        })
        .state('app.configuracion',
        {
          url: 'configuracion',
          views: {
            'layoutContent':{
              templateUrl: 'app/configuracion/configuracion.html',
              controller: 'ConfiguracionController',
              controllerAs: 'configuracion'
            }
          },
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNCONF');
            }
          }
        })
        .state('app.perfiles',
        {
          url: 'perfiles',
          views: {
            'layoutContent':{
              templateUrl: 'app/perfiles/perfiles.html',
              controller: 'PerfilesController',
              controllerAs: 'perfiles'
            }
          },
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNPERFILES');
            }
          },
          params:{
            perfil: ''
          }
        })
        .state('app.credenciales',
        {
          url: 'credenciales',
          views: {
            'layoutContent':{
              templateUrl: 'app/credenciales/credenciales.html',
              controller: 'CredencialesController',
              controllerAs: 'credenciales'
            }
          },
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNCRED');
            }
          },
          params:{
            perfil: ''
          }
        })
        .state('app.usuarios',
        {
          url: 'usuarios',
          views: {
            'layoutContent':{
              templateUrl: 'app/usuarios/usuarios.html',
              controller: 'UsuariosController',
              controllerAs: 'usuarios'
            }
          },
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNUSUARIOS');
            },
            listadoUsuariosRoles: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNUSUARIOS');            
            }
          }
        })
        .state('app.auditoria',
        {
          url: 'auditoria',
          views: {
            'layoutContent':{
              templateUrl: 'app/auditoria/auditoria.html',
              controller: 'AuditoriaController',
              controllerAs: 'auditoria'
            }
          },
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNAUDITORIA');
            }
          }
        })
        .state('app.boveda',
        {
          url: 'boveda',
          views: {
            'layoutContent':{
              templateUrl: 'app/boveda/boveda.html',
              controller: 'BovedaDatosController',
              controllerAs: 'bovedaDatos'
            }
          },
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNDATA');
            }
          }
        })
        .state('app.reportes',
        {
          url: 'reportes',
          views: {
            'layoutContent':{
              templateUrl: 'app/reportes/reportes.html',
              controller: 'ReportesController',
              controllerAs: 'reportes'
            }
          },
          reloadOnSearch: false,
          resolve:{
            profileAuthorized: function($injector){
              return $injector.get('RouteService').profileAuthorized('MNREPORTES');
            }
          }

        })
        
      ;

    $urlRouterProvider.otherwise('/login');
  }

})();
