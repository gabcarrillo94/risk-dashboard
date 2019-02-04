(function() {
'use strict';

    angular
        .module('dashboard')
        .controller('AlarmasController', AlarmasController)
        .controller('AlarmasCrearCasoController', AlarmasCrearCasoController);


    function AlarmasCrearCasoController($scope, alerta, CaseFactory, $localStorage) {
      $scope.alertaId = alerta.id;
      $scope.casoCreado = false;

      $scope.caseProcessing = false;

      $scope.criticidad = 'Alta';
      $scope.ejecutivo = $localStorage.currentUser.name;

      $scope.inputChange = function(type, value) {
        $scope[type] = value;
      };

      $scope.createCase = function() {
        $scope.caseProcessing = true;
        CaseFactory.createCase({
          title: $scope.nombre,
          criticality: $scope.criticidad,
          state: 'abierto',
          description: $scope.descripcion
        }).then(function(res){
          var ev = []
          ev[alerta.id] = true;
          CaseFactory.upsertEvents(res.caseId, ev, function(responses){
            $scope.casoCreado = true;
            $scope.$apply();
            setInterval(function(){
              $scope.$hide();
              $scope.$apply()
            }, 2000);
          });
        });
      };


    };


    AlarmasController.$inject = ['$rootScope','$modal', 'FileUploader', 'DetalleAlerta', 'EventosAlerta', '$stateParams', '$scope', '$state', 'Casos', 'EventsFactory', 'Paginator', 'env'];
    function AlarmasController($rootScope, $modal, FileUploader, DetalleAlerta, EventosAlerta, $stateParams, $scope, $state, Casos, EventsFactory, Paginator, env) {
        var vm = this;


        vm.events = [];
        vm.pagination = {
            rule: [1]
        };
        vm.filters = {
            page: 1,
            itemsPerPage: 10,
            sortBy: 'id',//'criticality',
            sort: 'desc',
            startDate : moment($stateParams.desde || (moment().hour(0).minute(0).second(0).subtract(3, 'months'))),
            endDate : moment($stateParams.hasta || (moment().hour(23).minute(59).second(59)))
        };

        vm.api = {};

        vm.filtros = $rootScope.filters.filterBy;


        vm.configAlarmas = {
            datasource:{
                //origin: "GET", //REST Methods, ARRAY, WS(WebSocket)
                //url: "/risk-backend/rest/events/summary", //solo para rest y ws
                origin: env.ssl ? "WSS" : "WS", //REST Methods, ARRAY, WS o WSS(WebSocket).Desde localhost usar WS, con seguridad WSS
                url: env.domain + (env.port ? ":" + env.port : "") + "/risk-backend/websockets/events",//"localhost:30249/risk-backend/websockets/events"//reemplazar localhost por ubicacion backend,solo para rest y ws
                //optional values
                //autoLoad: false,
                paramsDefault: {
                    query : vm.filters.query || '',
                    sortBy :  vm.filters.sortBy,
                    sort : vm.filters.sort || 'desc',
                    startDate : vm.filters.startDate.local().format(),
                    endDate : vm.filters.endDate.format(),
                    page: 1,
                    itemsPerPage: 10
                },
                paramsOut:{
                    data : "events",
                    pagination: "pagination"
                }
            },
            filterDatasource:{
                //servicio utilizado para construir solamente los checkbox de los filtros
                url:"/risk-backend/rest/events/filters",
                paramsDefault:{
                    checked : $rootScope.filters.filterBy.event
                }
            },
            style:{
                trStyle : function(item){
                    if(item.checked.toUpperCase()==="NO VISTO"){
                        switch(item.criticality.toUpperCase()){
                          case "ALTA": return "alta";
                          case "MEDIA": return "media";
                          case "BAJA": return "baja";
                          default: return "";
                        }
                     
                        //return "bold"; //css class
                    }else{
                        switch(item.criticality.toUpperCase()){
                          case "ALTA": return "alta-checked";
                          case "MEDIA": return "media-checked";
                          case "BAJA": return "baja-checked";
                          default: return "";
                        }
                        return "";
                    }
                },
                trTooltip: function(item){
                    var tooltip = '#'+item.ruleCode+' : '+ item.ruleDescription + " // ";//generate tooltips
                    if(item && item.eventBody){
                        if(!item.eventBody.entry){
                            var entrys = [];
                            var keys = Object.keys(item.eventBody);
                            for(var i = 0; i < keys.length; i++){
                                entrys.push({"key" : keys[i], "value": item.eventBody[keys[i]]});
                            }
                            item.eventBody.entry = entrys;
                        }
                        for(var j=0; j < item.eventBody.entry.length; j++){
                            tooltip += item.eventBody.entry[j].key +" : "+ item.eventBody.entry[j].value +" // "
                        }
                    }
                        return tooltip;
                    }
            },
            columns:[//columnas de la tabla, tipo de datos, header, visible/no visible.
                {name:"id", title:"Id", type:"number", hidden:false, sortable: true, filterable: {"type": "number"} },
                {name:"timestamp", title:"Fecha/Hora", type:"date", hidden:false, sortable: true},
                {name:"ruleDescription", title:"Descripción", type:"string", hidden:false, sortable: true, filterable: {"type": "string"}},
                {name:"labels", title:"Tipo", type:"array", hidden:false, sortable: true},
                {name:"criticality", title:"Criticidad", type:"string", hidden:false, sortable: true, filterable: {"type": "checkbox"}},
                {name:"caseStatus", title:"Estado Caso", type:"string", hidden:true},
                {name:"parameters", title:"eventBody", type:"string", hidden:true},
                {name:"status", title:"Estado", type:"string", hidden:false, sortable: true, filterable: {"type": "checkbox"}},
                {name:"checked", title:"Estado Atencion", type:"string", hidden:true, filterable: {"type": "checkbox"}},
                {name:"ruleDescription", title:"descripcionRegla", type:"string", hidden:true},
                {name:"ruleCode", title:"descripcionReglaTooltip", type:"string", hidden:true},
                {name:"ruleName", title:"nombreRegla", type:"string", hidden:true}
            ]
        }

        vm.getSummary = function(){
          var f = vm.filters || {};
          f.query = f.query || '';
          f.sortBy =  f.sortBy || 'id',//'criticality',
          f.sort = f.sort || 'desc',
          f.startDate = f.startDate || moment().format(),
          f.endDate = f.endDate || moment().format();

          moment().local();
          f.startDate = moment(f.startDate).format();
          f.endDate = moment(f.endDate).format();
          vm.api.filter(f);
        };

        vm.getSummaryExcel=function(){
          var f = vm.filters || {};
          f.query = f.query || '';
          f.sortBy =  f.sortBy || 'id',//'criticality',
          f.sort = f.sort || 'desc',
          f.startDate = f.startDate || moment().format(),
          f.endDate = f.endDate || moment().format();

          moment().local();
          f.startDate = moment(f.startDate).format();
          f.endDate = moment(f.endDate).format();
          vm.api.filterExcel(f);

        }


        vm.prepareExcel = function() {
            vm.getSummaryExcel();
            
            var filters = angular.copy(vm.filters);
            filters.itemsPerPage = undefined;

            EventsFactory.getSummary(filters).then(function(res){

                var excel = {//mandatory return
                    filename : "Incidencias",
                    data : []
                };
                var events = res.events;
                if(events && events.length>0){
                    var cols = [
                        {title: "Id", field: "id"},
                        {title: "Fecha", field: "fecha"},
                        //{title: "Hora", field: "hora"},
                        {title: "Nombre", field: "descripcionRegla"},
                        {title: "Tipo", field: "tipo"},
                        {title: "Criticidad", field: "criticidad"},
                        {title: "Estado", field: "estado"}
                    ];

                    var detCols = [
                        {title: "CAUSE", field: "CAUSE"},
                        {title: "SYMBOL", field: "SYMBOL"},
                        {title: "CLIENTE", field: "CLIENTE"}
                    ];

                    var filname = "Incidencias";
                    var exportData = [];
                    exportData.push(["Id","Fecha","Nombre","Tipo","Criticidad","Estado", "CAUSE", "SYMBOL", "CLIENTE"]);//"Symbol", "Window", "Cause"]);
                    for(var i=0;i < events.length; i++){
                        var row = [];
                        var event = events[i];

                        for(var c=0; c < cols.length; c++){
                            row.push(events[i][cols[c].field]);
                        }
                        var col=["","",""];
                        
                        if(events[i].parameters && events[i].parameters.length>0){
                               
                                for(var k=0; k < events[i].parameters.length; k++){
                                  
                                  if((/CAUSE/).test((events[i].parameters[k].key).toUpperCase()))
                                    col[0]=events[i].parameters[k].value;

                                  if((/SYMBOL/).test((events[i].parameters[k].key).toUpperCase()))
                                    col[1]=events[i].parameters[k].value;

                                  if((/CLIENTE/).test((events[i].parameters[k].key).toUpperCase()))
                                    col[2]=events[i].parameters[k].value;
                                                      

                                  }
                               
                                row.push(col[0]);
                                row.push(col[1]);
                                row.push(col[2]);
                                                           
                        }
                        exportData.push(row);
                    }

                    excel.data = exportData;
                    vm.api.downloadExcel(excel.filename, excel.data);
                }else{
                    console.log("sin eventos");
                    return {};
                }
            });
        };

        vm.crearCaso = function(alerta) {
            var alertaCrearCasoModal = $modal({
                templateUrl: 'app/alarmas/modal.alarmas-crear-caso.html',
                show: true ,
                size: 'md',
                animation: true,
                controller: 'AlarmasCrearCasoController',
                scope: alertaCrearCasoModal,
                resolve: {
                    alerta: function() {
                        return alerta;
                    }
                }
            });
        };

    $scope.$on('dateChange', function(e, dates){
        vm.filters.startDate = moment(dates.desde).hour(0).minute(0).second(0);
        vm.filters.endDate = moment(dates.hasta).hour(23).minute(59).second(59);
        vm.getSummary();
    });

      vm.search = function() {
        vm.filters.query = vm.searchAlerta;
        vm.filters.page = 1;
        vm.getSummary();
      };

      vm.searchOnChange = function() {
        if(vm.searchAlerta.length == 0) {
          vm.search();
        }
      };

      vm.selectedTab = 'index';

      vm.setTab = function(newTab){
        vm.selectedTab = newTab;
      };

      vm.isSet = function(tabNum) {
        return vm.selectedTab === tabNum;
      };

      vm.isActive = function(id) {
        return vm.isSet(id) && id != 'index';
      };

      vm.eliminarTabAlerta = function(tabId) {
        var indexTab = -2;
        for(var i=0; i<$rootScope.tabs.length; i++) {
          var actualTab = $rootScope.tabs[i];
          if(actualTab.id === tabId) {
            indexTab = i;
            break;
          }
        }
        if(indexTab>0) {
          $rootScope.tabs.splice(indexTab, 1);
          vm.setTab('index');
        }
      };

      vm.crearTabDetalleAlerta = function(rowAlerta) {
        //Se recorren los tabs existentes
        var existeTab = false;
        for(var i=0; i<$rootScope.tabs.length; i++) {
          var actualTab = $rootScope.tabs[i];
          if(actualTab.id === rowAlerta.id) {
            existeTab = true;
            break;
          }
        }
        if(existeTab) {
          vm.setTab(actualTab.id);
        }
        else {
          //Se crea el nuevo tab con el detalle de la alerta
          var newTab = {id: rowAlerta.id, name: 'Detalle ' + rowAlerta.labels + ' - ' + rowAlerta.id};
          //Se agrega el tab a la lista
          $rootScope.tabs.push(newTab);
          newTab.alert = rowAlerta;
          newTab.alert.moment = moment(newTab.alert.timestamp, "DD/MM/YYYY hh:mm:ss");
          newTab.alert.files = [];
          newTab.alert.events = [];
          newTab.uploader = new FileUploader();
          newTab.uploader.onCompleteAll(function(){
            obtenerArchivosTab(newTab);
          });
          //Se obtienen los casos asociados a la alerta
          obtenerCasosAsociadosAlerta(newTab);
          //Se obtienen los parametros de la alerta
          //Se obtienen los archivos de la alerta
          obtenerArchivosTab(newTab);
          //Se obtienen los eventos de la alerta
          obtenerEventosTab(newTab);
          //Se hace visible el nuevo tab
          vm.setTab(newTab.id);
        }
          
      };

      vm.checkEvent = function(rowAlerta){
        EventsFactory.checkEvent(rowAlerta).then(function(res){
             if(res){
                 vm.api.query();
                 for(var i=0; i < vm.events.length; i++){
                     if(vm.events[i].id === res.id){
                         vm.events[i].visto = res.visto;
                     }
                 }
                 $scope.$apply();
             }
          });
      }

       
      function obtenerCasosAsociadosAlerta(newTab) {
        Casos.obtenerCasosAlerta(newTab.id, function(response){
          newTab.alert.casosLink = [];
          if(response.header.code==0 && response.body!=null) {
            for(var  i=0 ; i<response.body.length ; i++) {
              newTab.alert.casosLink.push(response.body[i]);
            }
          }
        });
      }

      function obtenerArchivosTab(newTab) {
        //Se van a buscar los archivos relacionados a la alerta
        DetalleAlerta.obtenerArchivos(newTab.id, function(response){
          newTab.alert.files = [];
          //Se obtienen los archivos de la alerta
          if(response.header.code==0 && response.body!=null) {
            for(var  i=0 ; i<response.body.length ; i++) {
              newTab.alert.files.push(response.body[i]);
            }
          }
        });
      }

      function obtenerEventosTab(newTab) {
        EventsFactory.getRelatedEvents(newTab.id)
          .then(function(res){
            //console.log(res);
            newTab.alert.events = res;
            $scope.$apply();
          })
          .catch(function(err){
            console.log("Error@obtenerEventosTab");
            console.log(err);
          });
      }

      //Este codigo sirve para poder abrir/cargar automaticamente la pestaña de una alerta especifica
      if($stateParams.idAlerta) {
        var alerta = $rootScope.getAlertaById($stateParams.idAlerta);
        if(alerta) {
          vm.crearTabDetalleAlerta(alerta);
        }
      }

      //modal crear caso
      CrearCasoController.$inject = ['$scope', '$state'];
      var crearCaso = $modal({ templateUrl: 'app/casos/modal.crear-caso.html', show: false, controller: CrearCasoController});
      vm.showModal = function(alerta) {
        crearCaso.$scope.alerta = alerta;
        crearCaso.$promise.then(crearCaso.show);
      };
      vm.hideModal = function() {
        crearCaso.$promise.then(crearCaso.hide);
      };

      function CrearCasoController($scope, $state) {
        $scope.validacion = {};
        $scope.hasAlert = $scope.alerta != null;
        if(!$scope.hasAlert) {
          $scope.alerta = {};
        }
        $scope.inputs = {};
        //TODO obtener el id del ejecutivo logeado
        $scope.inputs.ejecutivo = 'Jon Snow';

        $scope.crearCasoController = function() {
          var v = $rootScope.validarCaso($scope.inputs);
          $scope.validacion = v;
          if(!v.show) {
            //La validacion del caso esta OK asi que se puede crear
            $rootScope.crearCaso($scope.inputs, $scope.alerta.id,
              function(response){
                if(response.header.code==0) {
                  console.log('id caso: ' + response.body.id);
                  $state.go('app.casos', {idCaso: response.body.id});
                  vm.hideModal();
                }
                else {
                  $scope.validacion = response.header.message;
                }
              }
            );
          }
        };
      };
    }
})();
