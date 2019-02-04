(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$state', 'Alertas', '$rootScope', 'moment', '$interval', 'Casos', 'AlertasConfig', 'LoginFactory', '$localStorage', '$stateParams', '$modal', 'env' ];
  function MainController($scope, $state, Alertas, $rootScope, moment, $interval, Casos, AlertasConfig, LoginFactory, $localStorage, $stateParams, $modal, env) {
    var vm = this;
    var dateFormat = "YYYY-MM-DD";

    vm.user = $localStorage.currentUser;
    vm.desdeMinimo="2000-01-01";

    //  Declaramos variables para el obtener el estado de las opciones.
    vm.opcionMenuHabilitado = false;
    //        vm.opcionesMenu = ["MNCASO", "MNCONF", "MNDASH", "MNINC", "MNAUDITORIA", "MNDATA", "MNREPORTES", "MNSEGURIDAD"];        
    vm.opcionDasboardHabilitada = false;
    vm.opcionIncidenciasHabilitada = false;
    vm.opcionCasosHabilitada = false;
    vm.opcionConfiguracionHabilitada = false;
    vm.opcionCredencialesHabilitada = false;
    vm.opcionAuditoriaHabilitada = false;
    vm.opcionBovedaHabilitada = false;
    vm.opcionReportesHabilitada = false;
    vm.opcionSeguridadHabilitada = false;
    vm.opcionSeguridadUsuarioHabilitada = false;
    vm.opcionSeguridadPerfilHabilitada = false;
    vm.habilitarSubMenu = false;
    vm.habilitarSubMenuConf = false;

    vm.opcionesHabilitadas = [];

    for (var i = 0; i < vm.user.opcionesMenu.length; i++) {
        //  DASHBOARD
        if (vm.user.opcionesMenu[i].idFuncion === "MNDASH") {
            console.log("HABILITADO PARA DASHBOARD");
            vm.opcionDasboardHabilitada = true;
        }

        //  INCIDENCIAS
        if (vm.user.opcionesMenu[i].idFuncion === "MNINC") {
            console.log("HABILITADO PARA INCIDENCIAS");
            vm.opcionIncidenciasHabilitada = true;
        }

        //  CONFIGURACION
        if (vm.user.opcionesMenu[i].idFuncion === "MNCONF") {
            console.log("HABILITADO PARA CONFIGURACIÓN");
            vm.opcionConfiguracionHabilitada = true;
        }

        //  CREDENCIALES
        if (vm.user.opcionesMenu[i].idFuncion === "MNCRED") {
            console.log("HABILITADO PARA CREDENCIALES");
            vm.opcionCredencialesHabilitada = true;
        }
        
        //  CASOS
        if (vm.user.opcionesMenu[i].idFuncion === "MNCASO") {
            console.log("HABILITADO PARA CASOS");
            vm.opcionCasosHabilitada = true;
        }

        //  AUDITORIA
        if (vm.user.opcionesMenu[i].idFuncion === "MNAUDITORIA") {
            console.log("HABILITADO PARA AUDITORIA");
            vm.opcionAuditoriaHabilitada = true;
        }

        //  BOVEDA DE DATOS
        if (vm.user.opcionesMenu[i].idFuncion === "MNDATA") {
            console.log("HABILITADO PARA BOVEDA DE DATOS");
            vm.opcionBovedaHabilitada = true;
        }

        //  REPORTES
        if (vm.user.opcionesMenu[i].idFuncion === "MNREPORTES") {
            console.log("HABILITADO PARA REPORTES");
            vm.opcionReportesHabilitada = true;
        }

        //  SEGURIDAD USUARIOS
        if (vm.user.opcionesMenu[i].idFuncion === "MNUSUARIOS") {
            console.log("HABILITADO PARA SEGURIDAD DE USUARIOS");
            vm.opcionSeguridadUsuarioHabilitada = true;
        }

        //  SEGURIDAD PERFILES
        if (vm.user.opcionesMenu[i].idFuncion === "MNPERFILES") {
            console.log("HABILITADO PARA PERFILES");
            vm.opcionSeguridadPerfilHabilitada = true;
        }        

        //  SEGURIDAD PERFILES
        if (vm.user.opcionesMenu[i].idFuncion === "MNPERFILES" && vm.user.opcionesMenu[i].habilitado === true) {
            console.log("HABILITADO PARA SEGURIDAD DE PERFILES");
            vm.opcionSeguridadPerfilHabilitada = true;
        }

    };

    //rangos de fechas para header
    vm.desde = moment().hour(0).minute(0).second(0).subtract(3, 'months');
    vm.hasta = moment().hour(23).minute(59).second(59);
    vm.desdeMinimo="2000-01-01";
    
    
    
    /*WEBSOCKET CONFIG*/
    var config = {
          datasource:{
                      //origin: "GET", //REST Methods, ARRAY, WS(WebSocket)
                      //url: "/risk-backend/rest/events/summary", //solo para rest y ws
                      origin: env.ssl ? "WSS" : "WS", //REST Methods, ARRAY, WS o WSS(WebSocket).Desde localhost usar WS, con seguridad WSS
                      url: env.domain + (env.port ? ":" + env.port : "") + "/risk-backend/websockets/events",//"localhost:30249/risk-backend/websockets/events"//reemplazar localhost por ubicacion backend,solo para rest y ws
                      //optional values
                      //autoLoad: false,
                      paramsDefault: {},
                      paramsOut:{
                          data : "events",
                          pagination: "pagination"
                      }
                  }
        }
    
    $scope.close=false;
    
    $scope.start = function() {
        var url = config.datasource.url;
        var ws = "";
        if(config.datasource.origin==='WS')
            ws = "ws://"+url;
        else
            ws= "wss://"+url;
    
        var webSocket = new WebSocket(ws);
        config.datasource.params = config.datasource.paramsDefault;
        config.datasource.params.token = $localStorage.currentUser.tokenInfo.token;
    
        //Al abrir enviar KEY
        webSocket.onopen = function(message){
            console.log("Websocket: Comunicacion iniciada");
            //se utiliza para esperar la construccion de los filtros asociados a la grilla
            // if(scope.config.datasource.autoLoad===true) {
                // console.log("Websocket: Comunicacion iniciada");
                // webSocket.send(JSON.stringify(scope.config.datasource.params));
            // }
        };
    
        webSocket.onerror = function(err){
            console.log("Websocket error:");
            console.log(err);
        };
    
        //Mensaje Recibido
        webSocket.onmessage = function(message){
            var data={};
            try { data=JSON.parse(message.data); }
            catch(err) {}
            if (data!== undefined) {
                console.log(data)
            }
        };
        
        //renovar la conexion cada 60 segundos
        $scope.interval = $interval(function(){
            webSocket.send(JSON.stringify(config.datasource.params));
        }, 1000 * 60);
    
        //Conexion cerrada
        webSocket.onclose = function(message){
            console.log("Conexión perdida");
            $interval.cancel(scope.interval);
            if ($scope.close==false) {
                $timeout(function() {
                    console.log("Reanudando conexión");
                    $scope.websocket = scope.start();
                }, 5000);
            }
        };
        return webSocket;
    };
    
    // -- Inicia el Websocket
    //$scope.websocket = $scope.start();

    vm.bDate = function() {
      $rootScope.$broadcast('dateChange', {
        desde: vm.desde,
        hasta: vm.hasta
      });
    };

    $rootScope.filters = {
        sortBy: 'id',//'criticality',
        filterBy : {
            criticality : {
                alta : false,
                media : false,
                baja : false,
                desconocida: false
            }, status : {
                auditoria : false,
                'en curso' : false,
                asignada : false,
                desconocido: false
            }, checked:{
                "no visto": false,
                visto: false
            }
        }
    };

    vm.bDate();

    //Lista de alertas para el home con los dashboards
    var jusShowQty = 10;
    vm.alertas = [];
    vm.alertasSrc = [];
    //Datos para los graficos del home
    vm.labelsEventos = [];
    vm.dataEventos = [];
    vm.labelsCriticidad = [];
    vm.dataEventosCriticidad = [];
    //Datos para la seccion de alertas
    vm.alertasDetalle = [];
    vm.alertasDetalleSrc = [];
    $rootScope.tabs = [{id: "index", name: "ALERTAS"}];
    //Datos para la seccion de casos
    vm.casosDetalle = [];
    vm.casosDetalleSrc = [];
    $rootScope.tabsCasos = [{id: "index", name: "CASOS"}];
    //Datos para la seccion de configuracion
    vm.alertasConfig = [];
    vm.alertasConfigSrc = [];

    function processAlertas(arrayAlertas) {
      //Se reciben las alertas filtradas por los rangos de fecha
      var mapEvents = {};
      var mapCriticidad = {};
      vm.alertas = [];
      vm.alertasSrc = [];
      vm.alertasDetalle = [];
      vm.alertasDetalleSrc = [];
      vm.dataEventos = [];
      vm.labelsEventos = [];
      for(var i=0; i<arrayAlertas.length; i++) {
        //Se muestran las primeras N alertas pero se procesan todas para calcular la info de los graficos
        if(i<jusShowQty) {
          vm.alertasSrc.push(arrayAlertas[i]);
        }
        vm.alertasDetalleSrc.push(arrayAlertas[i]);
        var countEvents = mapEvents[arrayAlertas[i].tipo];
        if(!countEvents) {
          countEvents = 0;
        }
        countEvents++;
        mapEvents[arrayAlertas[i].tipo] = countEvents;
        var countCriticidad = mapCriticidad[arrayAlertas[i].criticidad];
        if(!countCriticidad) {
          countCriticidad = 0;
        }
        countCriticidad++;
        mapCriticidad[arrayAlertas[i].criticidad] = countCriticidad;
      }
      //Se obtienen datos para grafico de eventos
      //Se utiliza interval para evitar bug con la animacion de los graficos
      $interval(function() {
        vm.labelsEventos = [].concat(Object.keys(mapEvents));
        vm.dataEventos = [].concat(vm.labelsEventos.map(function(v) { return mapEvents[v]; }));
        //Se obtienen datos para grafico de criticidad
        $interval(function() {
          vm.labelsCriticidad = [].concat(Object.keys(mapCriticidad));
          vm.dataCriticidad = [].concat(vm.labelsCriticidad.map(function(v) { return mapCriticidad[v]; }));
        }, 1000, 1);
      }, 500, 1);
      //Se obtienen datos para actualizar la tabla
      vm.alertas = [].concat(vm.alertasSrc);
      vm.alertasDetalle = [].concat(vm.alertasDetalleSrc);
    }

    function buscarAlertas() {
      //Se buscan todas las alertas que cumplan con el filtro
      Alertas.searchAlerts(moment(vm.desde).format(dateFormat), moment(vm.hasta).format(dateFormat), function(response) {
        if(response.header.code==0 && response.body!=null) {
          processAlertas(response.body);
        }
      });
    }

    function processCasos(arrayCasos) {
      //Se reciben los casos filtrados por los rangos de fecha
      vm.casosDetalle = [];
      vm.casosDetalleSrc = [];
      for(var i=0; i<arrayCasos.length; i++) {
        vm.casosDetalleSrc.push(arrayCasos[i]);
      }
      vm.casosDetalle = [].concat(vm.casosDetalleSrc);
    }

    function buscarCasos() {
      //Se buscan todos los casos que cumplan con el filtro
      Casos.searchCasos(moment(vm.desde).format(dateFormat), moment(vm.hasta).format(dateFormat), function(response) {
        if(response.header.code==0 && response.body!=null) {
          processCasos(response.body);
        }
      });
    }

    vm.existeFiltro = function() {
      return (vm.desde && vm.hasta && vm.desde!='' && vm.hasta!='');
    };

    vm.search = function() {
      $rootScope.$broadcast('dateChange', {
        desde: vm.desde,
        hasta: vm.hasta
      });
    };

    vm.clickMenu = function(state, goEvent) {
      (goEvent) ? false : resetFilters();
      //app.alarma
      if(state=='app.configuracion') {
        AlertasConfig.obtenerAlertas(function(response){
          if(response.header.code==0) {
            vm.alertasConfigSrc = response.body;
            vm.alertasConfig = [].concat(vm.alertasConfigSrc);
          }
          $state.go(state, {},{reload: false});
        });
      }
      else {
        $state.go(state, {desde: moment(vm.desde), hasta:moment(vm.hasta)},{reload: false});
      }

      if(state === 'app.perfiles' || state === 'app.usuarios'){
        vm.habilitarSubMenu = true;
      }else{
        vm.habilitarSubMenu = false;
      }
      
      if(state === 'app.configuracion' || state === 'app.credenciales'){
        vm.habilitarSubMenuConf = true;
      }else{
        vm.habilitarSubMenuConf = false;
      }
    };

    vm.clickEvents= function(event,n) {
      if(n>0){
        $rootScope.filters.filterBy.event = event;
        $rootScope.filters.filterBy.seen = false;
        vm.clickMenu('app.alarmas', true);
      }
    };

    function resetFilters(){
        $rootScope.filters.filterBy.event = undefined;
        $rootScope.filters.filterBy.seen = undefined;
    }

    vm.logout = function () {
      $interval.cancel(tokenTimer);
      LoginFactory.Logout();
    };

    $rootScope.getAlertaById = function(idAlerta) {
      for(var i=0; i<vm.alertasDetalle.length; i++) {
        var alerta = vm.alertasDetalle[i];
        if(alerta.id == idAlerta) {
          return alerta;
        }
      }
      return null;
    };

    $rootScope.getCasoById = function(idCaso) {
      for(var i=0; i<vm.casosDetalle.length; i++) {
        var caso = vm.casosDetalle[i];
        if(caso.id == idCaso) {
          return caso;
        }
      }
      return null;
    };

    $rootScope.crearCaso = function(casoData, idAlerta, callback) {
      Casos.crearCaso(casoData, idAlerta, function(response) {
        if(response.header.code==0) {
          //Se agrega el nuevo caso a la lista
          vm.casosDetalleSrc.push(response.body);
          vm.casosDetalle = [].concat(vm.casosDetalleSrc);
          callback(response);
        }
      });
    };

    $rootScope.validarCaso = function(casoData) {
      var validacion = {content: '', show: false};
      if(!casoData.nombre) {
        validacion.content = 'Es requerido especificar el nombre del caso';
        validacion.show = true;
      }
      else if(!casoData.criticidad) {
        validacion.content = 'Es requerido especificar la criticidad del caso';
        validacion.show = true;
      }
      return validacion;
    };

    $rootScope.sortcriticidad = function(value) {
      var cri = value.criticidad;
      if (cri) {
        if (cri.toLowerCase() === 'alta') {
          return 3;
        }
        else if (cri.toLowerCase() === 'media') {
          return 2;
        }
        else if (cri.toLowerCase() === 'baja') {
          return 1;
        }
      }
      return 0;
    };

    var URL_CAMBIAR_PASSWORD = 'app/usuarios/cambiarPassword.html';
    var modalPassword;


  $scope.$on('profileState', function(evt, perfil){
      $state.go('app.perfiles', {perfil: perfil}, {reload: false})
  })

  $scope.$on('closeModalUserPassword', function(){
      modalPassword.$promise.then(modalPassword.hide);
  });

    vm.showModalPassword = function(){
        modalPassword = $modal({
            templateUrl: URL_CAMBIAR_PASSWORD,
            controller: 'UsuarioPasswordController',
            keyboard: false
        });
        //  Aperturamos nuestra ventana modal.
        modalPassword.$promise.then(modalPassword.show);
    }

    function checkToken(){
      if  ( (new Date($localStorage.currentUser.tokenInfo.expiration).getTime() - (new Date).getTime()) <   ( 10 * 60000) ){
        LoginFactory.refreshToken();
      }
    }
    checkToken();
    var tokenTimer = $interval(checkToken, 50000);
    $scope.$on("checkToken", function(){
      if ($localStorage.currentUser){
        checkToken();
      }
    })


    vm.search();
    
    }
})();