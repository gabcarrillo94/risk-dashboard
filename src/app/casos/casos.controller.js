(function() {
'use strict';

  angular
    .module('dashboard')
    .controller('CasosController', CasosController);

  CasosController.$inject = ['$scope', '$localStorage', 'FileUploader','$modal', '$rootScope', 'Casos', 'Comentarios', '$stateParams', 'CaseCommentsFactory', 'CaseFactory', 'Paginator', '$timeout', 'env', 'PerfilesFactory', '$mdToast', 'EventsFactory'];
  function CasosController($scope, $localStorage, FileUploader, $modal, $rootScope, Casos, Comentarios, $stateParams, CaseCommentsFactory, CaseFactory, Paginator, $timeout, env, PerfilesFactory, $mdToast, EventsFactory) {

    var vm = this;
    
    vm.api = {};
    
    vm.currentUserId = $localStorage.currentUser.userId;
    
    vm.saveEdit = function(tab) {
      CaseFactory.upsertCase({
        id: tab.caso.id,
        title: tab.casoEdit.titulo,
        criticality: tab.casoEdit.criticidad,
        description: tab.casoEdit.descripcion,
        userId: tab.casoEdit.idUsuario,
        state: tab.caso.estado
      }).then(function(res){
        console.log(res)
        tab.caso.titulo = tab.casoEdit.titulo;
        tab.caso.criticidad = tab.casoEdit.criticidad;
        tab.caso.estado = tab.casoEdit.estado;
        tab.caso.descripcion = tab.casoEdit.descripcion;

        tab.caso.editando = false;
        $scope.$apply();
      }).catch(function(e){
        console.log(e);
      })
    };

    vm.closeCase = function(tab) {
      CaseFactory.upsertCase({
        id: tab.caso.id,
        title: tab.caso.titulo,
        criticality: tab.caso.criticidad,
        description: tab.caso.descripcion,
        state: 'cerrado'
      }).then(function(res){
        tab.caso.estado = 'cerrado';
        $scope.$apply();
      });
    };

    vm.reOpenCase = function(tab) {
      CaseFactory.upsertCase({
        id: tab.caso.id,
        title: tab.caso.titulo,
        criticality: tab.caso.criticidad,
        description: tab.caso.descripcion,
        state: 'abierto'
      }).then(function(res){
        tab.caso.estado = 'abierto';
        $scope.$apply();
      });
    };

    vm.caseEditable = function(tab){
      $('select').dropdown({ "autoinit" : ".select" });
      tab.casoEdit = {
        titulo: tab.caso.titulo,
        criticidad: tab.caso.criticidad,
        estado: tab.caso.estado,
        descripcion: tab.caso.descripcion
      };
      tab.caso.editando = true;
      $('select').dropdown({ "autoinit" : ".select" });
    };

    vm.cancelarEdicion = function(tab) {
      tab.caso.editando = false;
    }
    
    vm.eliminandoArchivo = function(file) {
      file.edit = {
        justificacion: ""
      };
      file.eliminando = true;
    };
    
    vm.descargarArchivo = function(file) {
      CaseFactory.downloadFile({
        id: file.fileCaseId,
        fileId: file.fileId,
        fileName: file.fileName
      }).then(function(res){
        console.log(res)
      });
    };
    
    vm.eliminarArchivo = function(file, tab) {
      CaseFactory.deleteFile({
        id: file.fileId,
        caseId: file.fileCaseId,
        justified: file.edit.justificacion
      }).then(function(res){
        obtenerArchivosTab(tab)
      });
    };
    
    vm.cancelarElimArchivo = function(file){
      file.eliminando = false;
    };
    
    // comments
    vm.commentEditable = function(comment){
      comment.edit = {
        comentario: comment.comment
      };
      comment.editando = true;
    };
    
    vm.commentEliminable = function(comment){
      comment.edit = {
        justificacion: ""
      };
      comment.eliminando = true;
    };
    
    vm.CancelarEdiElimComentario = function(comment){
      comment.eliminando = false;
      comment.editando = false;
    };
    
    vm.publicarComentario = function(tab) {
      CaseFactory.createComment({
        id: tab.caso.id,
        comment: tab.caso.comment
      }).then(function(res){
        if (res) {
          res.timestamp = moment(res.timestamp).fromNow()
          res.editando = false
          res.eliminando = false
          
          tab.caso.comment = ""
          tab.caso.comments.push(res)
        }
      });
    };
    
    vm.editarComentario = function(comment, tab) {
      CaseFactory.uploadComment({
        id: comment.id,
        caseId: comment.commentCase.caseId,
        comment: comment.edit.comentario
      }).then(function(res){
        comment.editando = false
        comment.comment = comment.edit.comentario
        comment.status = 'MODIFIED'
        comment.timestamp = comment.timestamp + ' (Editado)'
      });
    };
    
    vm.eliminarComentario = function(comment, tab) {
      CaseFactory.deleteComment({
        id: comment.id,
        caseId: comment.commentCase.caseId,
        justified: comment.edit.justificacion
      }).then(function(res){
        obtenerComentariosTab(tab)
      });
    };
    
    vm.cancelarComentario = function(tab) {
      tab.caso.comment = ""
    };

    vm.usuarios = [];
    vm.cases = [];
    vm.pagination = {
      rule: [1]
    };
    vm.filters = {
      page: 1,
      itemsPerPage: 10,
      sortBy: 'criticality',
      sort: 'desc',
      startDate : moment($stateParams.desde || (moment().hour(0).minute(0).second(0).subtract(3, 'months'))),
      endDate : moment($stateParams.hasta || (moment().hour(23).minute(59).second(59)))
    };

    // vm.casosSocket = CaseCommentsFactory.socket;

    vm.selectedTab = 'index';


    vm.getSummary = function(t) {
      var tiempo = t || 0;
      CaseFactory.getSummary(vm.filters).then(function(res){
        vm.cases = [];
        $scope.$apply();
        setTimeout(function(){
          vm.pagination = res.pagination;
          
          //Se obtienen los archivos de la alerta
          if(res.cases!=null) {
            for(var  i=0;i<res.cases.length;i++) {
              if (res.cases[i].usuario.id === vm.currentUserId) {
                vm.cases.push(res.cases[i])
              }
            }
          }
          
          //vm.cases = res.cases;
          vm.setPaginationRule();
          $scope.$apply();
          
          $('#datatable-case').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
            },
            columnDefs: [{
              targets: [ 0, 1, 2 ],
              className: 'mdl-data-table__cell--non-numeric'
            }],
            retrieve: true
          });
        }, tiempo)
      });
    };

    $scope.$on('dateChange', function(e, dates){
      vm.filters.startDate = dates.desde;
      vm.filters.endDate = dates.hasta;
      vm.getSummary(500);
    });




    vm.getSummary();

    vm.setPaginationRule = function() {
      vm.pagination.rule = Paginator.getPagesWindow(vm.pagination.totalRecords, vm.filters.itemsPerPage, vm.filters.page);
    };

    vm.goToPage = function(destiny) {
      var totalPages = Math.ceil(vm.pagination.totalRecords/vm.filters.itemsPerPage);
      switch (destiny) {
        case 'start':
          vm.filters.page = 1;
          break;
        case 'end':
          vm.filters.page = totalPages;
          break;
        case '1more':
          vm.filters.page++;
          break;
        case '1less':
          vm.filters.page--;
          break;
        default:
          vm.filters.page = destiny;
      }
      vm.getSummary();
    };

    vm.showLessArrow = function() {
      return vm.pagination.rule.length > 1 && vm.pagination.rule[0] != 1;
    };

    vm.showMoreArrow = function() {
      return vm.pagination.rule.length > 1 && vm.pagination.rule[vm.pagination.rule.length-1] != Math.ceil(vm.pagination.totalRecords/vm.filters.itemsPerPage);
    };

    vm.sortBy = function(t) {
      if(t == vm.filters.sortBy){
        vm.filters.sort = vm.filters.sort == 'desc' ? 'asc' : 'desc';
      }
      else {
        vm.filters.sort = 'desc';
      }
      // else {
      //   vm.filters.sortBy = vm.filters.sortBy == 'criticidad' ? 'tipo' : 'criticidad';
      // }
      vm.filters.sortBy = t;
      vm.getSummary();
    };

    vm.search = function() {
      vm.filters.query = vm.searchCase;
      vm.filters.page = 1;
      vm.getSummary();
    };

    vm.searchOnChange = function() {
      if(vm.searchCase.length == 0) {
        vm.search();
      }
    };

    vm.setTab = function(newTab){
      vm.selectedTab = newTab;
    };

    vm.isSet = function(tabNum) {
      return vm.selectedTab === tabNum;
    };

    vm.isActive = function(id) {
      return vm.isSet(id) && id != 'index';
    };

    vm.eliminarTabCaso = function(tabId) {
      var indexTab = -2;
      for(var i=0; i < $rootScope.tabsCasos.length; i++) {
        var actualTab = $rootScope.tabsCasos[i];
        if(actualTab.id === tabId) {
          indexTab = i;
          break;
        }
      }
      if(indexTab>0) {
        $rootScope.tabsCasos.splice(indexTab, 1);
        vm.setTab('index');
      }
    };

    // vm.subCommentariosCaso = function(newTab) {

    //   newTab.socket = vm.casosSocket;
    //   newTab.socket.emit('sub', {
    //     caso: newTab.caso.id,
    //     token: $localStorage.currentUser.tokenInfo.token
    //   });

    //   newTab.socket.on('startingComments', function(comments){
    //     if(newTab.caso.id == comments.case) {
    //       comments.comments.forEach(function(c){
    //         c.date = moment(c.timestamp).format('DD/MM/YYYY');
    //         c.time = moment(c.timestamp).format('HH:mm:ss');
    //       });
    //       newTab.caso.comentarios.comArray = comments.comments;
    //       $scope.$apply();
    //       $('.discussion.comments-box').scrollTop($('.discussion.comments-box').prop("scrollHeight"));
    //     }
    //   });

    //   newTab.socket.on('newComment', function(comment){
    //     if(newTab.caso.id === comment.caseId) {
    //       newTab.caso.comentarios.comArray.push(comment);
    //       $scope.$apply();
    //       $('.discussion.comments-box').scrollTop($('.discussion.comments-box').prop("scrollHeight"));
    //     }
    //   });
    // };

    vm.crearTabDetalleCaso = function(rowCaso) {
      //Se recorren los tabs existentes
      var existeTab = false;
      for(var i=0; i<$rootScope.tabsCasos.length; i++) {
        var actualTab = $rootScope.tabsCasos[i];
        if(actualTab.id === rowCaso.id) {
          existeTab = true;
          break;
        }
      }
      if(existeTab) {
        vm.setTab(actualTab.id);
      }
      else {
        //Se crea el nuevo tab con el detalle del caso
        var newTab = {id: rowCaso.id, name: rowCaso.titulo + ' - ' + rowCaso.id};
        //Se agrega el tab a la lista
        $rootScope.tabsCasos.push(newTab);
        newTab.caso = rowCaso;
        newTab.caso.showMensajes = true;
        newTab.caso.showComments = true;
        newTab.caso.comentarios = {titulo: '', comArray: [], llaveComentario: '', texto: '', alerta: {}, evento: {}};
        newTab.caso.activePosition;
        newTab.caso.files = [];
        newTab.caso.comments = [];
        newTab.caso.alerts = [];
                     
        newTab.uploader = new FileUploader({
          url: '/risk-backend/rest/case/'+newTab.caso.id+'/file',
          headers: {token: $localStorage.currentUser.tokenInfo.token},
          removeAfterUpload: true
        });
        
        // FILTERS
        newTab.uploader.filters.push({
            name:'Extensions',
            fn: function(item, options){
                var allowedExtensions = ['jpg', 'png', 'jpeg', 'doc', 'docx', 'pdf', 'ppt', 'xls'];
                var ext  = item.name.split('.').pop();
                
                if (allowedExtensions.indexOf(ext) === -1) {
                    $scope.showSimpleToast('Extensión no permitida');
                }
                 
                return allowedExtensions.indexOf(ext) !== -1;
            }
        });
        
        newTab.uploader.filters.push({
            name:'Size',
            fn: function(item, options){
                var maxSize = 31457280;
                var size  = item.size;
                
                if (item.size >= 31457280) {
                    $scope.showSimpleToast('El archivo supera el límite de 30Mb');
                }
                
                return item.size < 31457280;
            }
        });
        
        newTab.uploader.onCompleteAll(function(){
          $scope.showSimpleToast('Archivos cargados exitosamente');
          obtenerArchivosTab(newTab)
        });
        
        //Se obtiene los comentarios asociados al caso
        obtenerComentariosTab(newTab);
        //Se obtienen las alertas asociadas al caso
        obtenerAlertasCaso(newTab);
        //Se obtienen los archivos de la alerta
        obtenerArchivosTab(newTab);
        //Se obtienen todos los usuarios del sistema
        obtenerUsuariosTab(newTab);
        //Se obtienen los eventos de la alerta
        //obtenerEventosTab(newTab);
        //Se hace visible el nuevo tab
        vm.setTab(newTab.id);
        // Subscribir el tab al feed de comentarios.
        // vm.subCommentariosCaso(newTab); (Comentarios en tiempo real)
      }
    };

    function obtenerAlertasCaso(newTab) {
      CaseFactory.getRelatedEvents(newTab.id)
      .then(function(res) {
        newTab.caso.alerts = res;
        $scope.$apply();
      })
      .catch(function(e) {
        console.log(e)
      })
    }

    vm.obtenerAlertasCaso = obtenerAlertasCaso;
    
    function obtenerUsuariosTab(newTab) {
        // Se buscan los usuarios del sistema para la edición.
      PerfilesFactory.listadoUsuarios({})
      .then(function(res){
        vm.usuarios = []
        
        if(res!=null) {
          for(var  i=0;i<res.length;i++) {
            vm.usuarios.push(res[i])
          }
        }
      }).catch(function(e){
        console.log(e);
      })
    }

    function obtenerArchivosTab(newTab) {
      // Se buscan los archivos relacionados con el caso.
      CaseFactory.getFiles({
        id: newTab.id
      }).then(function(res){
        // console.log(res)
        // console.log(env)
        newTab.caso.files = []
        
        //Se obtienen los archivos de la alerta
        if(res!=null) {
          for(var  i=0 ; i<res.length ; i++) {
            if (res[i].fileStatus!=='DELETE') {
              res[i].fileRepository = env.domain + ":" + env.port + res[i].fileRepository.substring(2) + res[i].fileName
              res[i].fileCreationDate = moment(res[i].fileCreationDate).fromNow()
              res[i].eliminando = false
              newTab.caso.files.push(res[i])
            }
          }
        }
        
      }).catch(function(e){
        console.log(e);
      })
    };
    
    function obtenerComentariosTab(newTab) {
        CaseFactory.getComments(newTab.id)
        .then(function(res) {
          // console.log(res)
          newTab.caso.comments = [];
          var ext = '';
          
          for(var i = 0; i < res.length ; i++) {
            if (res[i].status!=='DELETE') {
              if (res[i].status==='MODIFIED') {
                ext = ' (Editado)'
              } else {
                ext = ''
              }
              
              res[i].timestamp = moment(res[i].timestamp).fromNow() + ext
              res[i].editando = false
              res[i].eliminando = false
              newTab.caso.comments.push(res[i])
            }
          }
        })
        .catch(function(e) {
          console.log(e)
        })
      
      // Se buscan los comentarios relacionados con el caso.
      //Casos.obtenerComentarios(newTab.id, function(response) {
      //  newTab.caso.comments = [];
      //  console.log(response.body);
      //  
      //  if(response.header.code==0 && response.body!=null) {
      //    for(var i = 1; i < response.body.length ; i++) {
      //      newTab.caso.comments.push(response.body[i]);
      //    }
      //  }
      //})
    };
    
    // Casos.obtenerArchivos(newTab.id, function(response){
    //   newTab.caso.files = [];
    //   // Se obtienen los archivos de la alerta
    //   console.log(response.body);
    //   if(response.header.code==0 && response.body!=null) {
    //     for(var i = 0; i < response.body.length ; i++) {
    //       newTab.caso.files.push(response.body[i]);
    //     }
    //   }
    // });
    
    vm.desasignarAlerta = function(alerta, tab) {
      CaseFactory.deleteEvent({
        id: tab.id,
        eventId: alerta.id
      }).then(function(res) {
        obtenerAlertasCaso(tab);
      });
    };

    vm.toggleDetail = function(tabCaso, $index) {
      tabCaso.activePosition = tabCaso.activePosition == $index ? -1 : $index;
    };

    vm.toggleMensaje = function(tabCaso, openClose, alert, evento) {
      $timeout(function(){
        $('.discussion.comments-box').scrollTop($('.discussion.comments-box').prop("scrollHeight"));
      });
      if(!openClose) {
        if(!tabCaso.showMensajes) {
          tabCaso.showMensajes = true;
        }
      }
      else{
        tabCaso.showMensajes = !tabCaso.showMensajes;
      }
      if(alert && evento) {
        tabCaso.comentarios = {titulo: '', comArray: [], llaveComentario: '', texto: '', alerta: alert, evento: evento};
        Comentarios.comentariosCasoAlarmaEvento(tabCaso.id, alert.id, evento.id, function (response) {
          if (response.header.code == 0) {
            var llaveCom = Comentarios.obtenerLlaveComentarios(tabCaso.id, alert.id, evento.id);
            evento.comentariosQty = response.body.length;
            tabCaso.comentarios = {
              titulo: 'Comentarios Alerta ' + alert.id
              + ' Evento ' + evento.id, comArray: response.body, llaveComentario: llaveCom, alerta: alert, evento: evento
            };
          }
        });
      }
    };
    
    vm.toggleComments = function(tabCaso, openClose, alert, evento) {
      $timeout(function(){
        $('.discussion.comments-box').scrollTop($('.discussion.comments-box').prop("scrollHeight"));
      });
      if(!openClose) {
        if(!tabCaso.showComments) {
          tabCaso.showComments = true;
        }
      }
      else{
        tabCaso.showComments = !tabCaso.showComments;
      }
      if(alert && evento) {
        tabCaso.comentarios = {titulo: '', comArray: [], llaveComentario: '', texto: '', alerta: alert, evento: evento};
        Comentarios.comentariosCasoAlarmaEvento(tabCaso.id, alert.id, evento.id, function (response) {
          if (response.header.code == 0) {
            var llaveCom = Comentarios.obtenerLlaveComentarios(tabCaso.id, alert.id, evento.id);
            evento.comentariosQty = response.body.length;
            tabCaso.comentarios = {
              titulo: 'Comentarios Alerta ' + alert.id
              + ' Evento ' + evento.id, comArray: response.body, llaveComentario: llaveCom, alerta: alert, evento: evento
            };
          }
        });
      }
    };

    vm.comentar = function(tabCaso) {
      if(tabCaso.caso.comentarios.texto.length > 0) {
        tabCaso.socket.emit('sendComment', {
          case: tabCaso.caso.id,
          token: $localStorage.currentUser.tokenInfo.token,
          comment: tabCaso.caso.comentarios.texto
        });
        tabCaso.caso.comentarios.texto = '';
      }
    };
    
    vm.configCases = {
            datasource:{
                origin: "GET", //REST Methods, ARRAY, WS(WebSocket)
                url: "/risk-backend/rest/case/summary", //solo para rest y ws
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
                params: {
                    query: vm.filters.query || '',
                    page: 1,
                    itemsPerPage: 10,
                    sortBy: vm.filters.sortBy,
                    sort: vm.filters.sort || 'desc',
                    startDate: vm.filters.startDate.local().format(),
                    endDate: vm.filters.endDate.format()
                },
                paramsOut:{
                    data : "cases",
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
                    return "normal"
                },

                // trStyle : function(item){
                //     if(item.checked.toUpperCase()==="NO VISTO"){
                //         switch(item.criticality.toUpperCase()){
                //           case "ALTA": return "alta";
                //           case "MEDIA": return "media";
                //           case "BAJA": return "baja";
                //           default: return "";
                //         }
                     
                //         //return "bold"; //css class
                //     }else{
                //         switch(item.criticality.toUpperCase()){
                //           case "ALTA": return "alta-checked";
                //           case "MEDIA": return "media-checked";
                //           case "BAJA": return "baja-checked";
                //           default: return "";
                //         }
                //         return "";
                //     }
                // },
                // trTooltip: function(item){
                //     var tooltip = '#'+item.ruleCode+' : '+ item.ruleDescription + " // ";//generate tooltips
                //     if(item && item.eventBody){
                //         if(!item.eventBody.entry){
                //             var entrys = [];
                //             var keys = Object.keys(item.eventBody);
                //             for(var i = 0; i < keys.length; i++){
                //                 entrys.push({"key" : keys[i], "value": item.eventBody[keys[i]]});
                //             }
                //             item.eventBody.entry = entrys;
                //         }
                //         for(var j=0; j < item.eventBody.entry.length; j++){
                //             tooltip += item.eventBody.entry[j].key +" : "+ item.eventBody.entry[j].value +" // "
                //         }
                //     }
                //         return tooltip;
                //     }
            },
            columns:[//columnas de la tabla, tipo de datos, header, visible/no visible.
                {name:"id", title:"Id", type:"number", hidden:false, sortable: true},
                {name:"titulo", title:"Nombre", type:"string", hidden:false, sortable: true},
                {name:"fecha", title:"Fecha", type:"string", hidden:false, sortable: true},
                {name:"hora", title:"Hora", type:"string", hidden:false, sortable: true},
                {name:"estado", title:"Estado", type:"string", hidden:false, sortable: true},
                {name:"criticidad", title:"Criticidad", type:"string", hidden:true},
                {name:"usuario", title:"Ejecutivo", type:"string", hidden:true}
            ]
        }

    //Este codigo sirve para poder abrir/cargar automaticamente la pestaña de un caso especifico
    if($stateParams.idCaso) {
      var caso = $rootScope.getCasoById($stateParams.idCaso);
      if(caso) {
        
        

    
        
        
        vm.crearTabDetalleCaso(caso);
      }
    }

    //modal crear caso
    CrearCasoController.$inject = ['$scope', '$state', '$localStorage', 'CaseFactory'];
    var crearCaso = $modal({ templateUrl: 'app/casos/modal.crear-caso.html', show: false, controller: CrearCasoController});
    vm.showModal = function() {
      crearCaso.$promise.then(crearCaso.show);
    };
    vm.hideModal = function() {
      crearCaso.$promise.then(crearCaso.hide);
    };

    function CrearCasoController($scope, $state, $localStorage, CaseFactory) {
      $scope.validacion = {};
      $scope.hasAlert = $scope.alerta!=null;
      if(!$scope.hasAlert) {
        $scope.alerta = {};
      }
      $scope.inputs = {
        criticidad: 'high'
      };
      //TODO obtener el id del ejecutivo logeado
      $scope.inputs.ejecutivo = $localStorage.currentUser.name;

      $scope.crearCasoController = function() {
        var v = $rootScope.validarCaso($scope.inputs);
        $scope.validacion = v;
        if(!v.show) {
          CaseFactory.createCase({
            title: $scope.inputs.nombre,
            criticality: $scope.inputs.criticidad,
            state: 'abierto',
            description: $scope.inputs.descripcion
          }).then(function(res){
            vm.hideModal();
            $state.go('app.casos');
            vm.getSummary();
          });
        }
      };
    }

    //modal agregar alerta
    AgregarAlertaController.$inject = ['$scope', 'Alertas', 'EventsFactory', 'CaseFactory', 'Paginator', '$rootScope'];
    var agregarAlerta = $modal({ 
      templateUrl: 'app/casos/modal.agregar-alerta.html', 
      show: false, 
      controller: AgregarAlertaController
    });
    
    vm.showModalAddAlert = function(tabCaso) {
      agregarAlerta.$scope.tabCaso = tabCaso;
      agregarAlerta.$scope.obtenerAlertasCaso = vm.obtenerAlertasCaso;
      agregarAlerta.$scope.selectedEvents = tabCaso.caso.alerts.map(function(arr){ return arr.id; });
      agregarAlerta.$promise.then(agregarAlerta.show);
    };
    
    vm.hideModalAddAlert = function() {
      agregarAlerta.$promise.then(agregarAlerta.hide);
    };
    
    function AgregarAlertaController($scope, Alertas, EventsFactory, CaseFactory, Paginator, $rootScope) {
      $scope.alertasSummary = [];
      $scope.alertas = [];
      $scope.pagination = {
        rule: [1]
      };
      $scope.filters = {
        page: 1,
        itemsPerPage: 10,
        sortBy: 'criticidad',
        sort: 'desc',
      };

      $scope.tabCaso.caso.alerts.forEach(function(a){
        $scope.alertas[a.id] = true;
      });

      $scope.setPaginationRule = function() {
        $scope.pagination.rule = Paginator.getPagesWindow($scope.pagination.totalRecords, $scope.filters.itemsPerPage, $scope.filters.page);
      };

      $scope.getEventsSummary = function() {
        EventsFactory.getSummary($scope.filters).then(function(res){
          $scope.alertasSummary = res.events;
          $scope.pagination = res.pagination;
          $scope.setPaginationRule();
          $scope.$apply();
        });
      };

      $scope.getEventsSummary();

      $scope.goToPage = function(destiny) {
        var totalPages = Math.ceil($scope.pagination.totalRecords/$scope.filters.itemsPerPage);
        switch (destiny) {
          case 'start':
          $scope.filters.page = 1;
          break;
          case 'end':
          $scope.filters.page = totalPages;
          break;
          case '1more':
          $scope.filters.page++;
          break;
          case '1less':
          $scope.filters.page--;
          break;
          default:
          $scope.filters.page = destiny;
        }
        $scope.getEventsSummary();
      };

      $scope.showLessArrow = function() {
        return $scope.pagination.rule.length > 1 && $scope.pagination.rule[0] != 1;
      };

      $scope.showMoreArrow = function() {
        return $scope.pagination.rule.length > 1 && $scope.pagination.rule[$scope.pagination.rule.length-1] != Math.ceil($scope.pagination.totalRecords/$scope.filters.itemsPerPage);
      };

      $scope.search = function() {
        $scope.filters.query = $('#searchAlerta').val();
        $scope.getEventsSummary();
      };

      $scope.searchBarChange = function() {
        if($('#searchAlerta').val().length == 0) {
          $scope.filters.query = '';
          $scope.getEventsSummary();
        }
      };

      $scope.asignarAlertas = function() {
        var newAlertas = {};
        
        for (var i=0;i<$scope.selectedEvents.length;i++) {
          if($scope.selectedEvents[i]) {
            newAlertas[$scope.selectedEvents[i]] = true;
          }
        }
        
        CaseFactory.upsertEvents($scope.tabCaso.id, newAlertas, function(responses){
          // console.log(newAlertas)
          $scope.obtenerAlertasCaso($scope.tabCaso);
          $scope.$hide();
        });
      };
      
      $scope.configAlarmas = {
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
      };
    }

    //confirmar eliminar alerta
    EliminarAlertaCasoController.$inject = ['$scope', 'Casos'];
    var eliminarAlerta = $modal({ templateUrl: 'app/casos/modal.eliminar-alerta.html', show: false, controller: EliminarAlertaCasoController});
    vm.showModalDeleAlert = function(tabCaso, caso, alerta) {
      eliminarAlerta.$scope.tabCaso = tabCaso;
      eliminarAlerta.$scope.caso = caso;
      eliminarAlerta.$scope.alerta = alerta;
      eliminarAlerta.$promise.then(eliminarAlerta.show);
    };
    vm.hideModalDeleAlert = function() {
      eliminarAlerta.$promise.then(eliminarAlerta.hide);
    };
    function EliminarAlertaCasoController($scope, Casos) {
      $scope.desvincular = function() {
        Casos.desvincularAlertaCaso($scope.caso.id, $scope.alerta.id, function(response) {
          if(response.header.code==0) {

          }
          else {

          }
          obtenerAlertasCaso($scope.tabCaso);
          vm.hideModalDeleAlert();
        });
      }
    }
    
    //============== DRAG & DROP =============

    $scope.setFiles = function(element) {
      $scope.$apply(function($scope) {
        console.log('files:', element.files)
        // Turn the FileList object into an Array
        $scope.files = []
        var sizeAllFile = 0
        for (var i = 0; i < element.files.length; i++) {
          var fileName = element.files[i].name.toLowerCase()
          var fileType = element.files[i].type.toLowerCase()
          sizeAllFile = sizeAllFile + element.files[i].size
          
          if (!fileName.match(/(\.jpg|\.png|\.jpeg|\.doc|\.docx|\.pdf|\.ppt|\.xls)$/)
              && !(fileType==='image/jpeg' || fileType==='image/png' || fileType==='application/msword'
                    || fileType==='application/pdf' || fileType==='application/vnd.ms-powerpoint' || fileType==='application/vnd.ms-excel')) {
            $scope.errorExt = true
            $scope.files = []
            break
          }
          else if (sizeAllFile > 31457280) {
            $scope.errorSize = true
            $scope.files = []
            break
          }
          else {
            $scope.errorSize = false
            $scope.errorExt = false
            $scope.files.push(element.files[i])
          }
        }
        $scope.progressVisible = false
      });
    };

    $scope.uploadFile = function() {
        var fd = new FormData()
        
        for (var i in $scope.files) {
            fd.append("uploadedFile", $scope.files[i])
        }
        
        // Antigua función de subida con barra de progreso.
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "/fileupload")
        $scope.progressVisible = true
        
        // Función de subida del archivo
        CaseFactory.uploadFile({
          fis: "",
          fdcd: fd,
          id: $scope.$id
        }).then(function(res) {
            console.log("Archivo cargado!")
        }, function (err) {
            // There was an error, and we get the reason for error
        }, function (progress) {
            // We get notified of the upload's progress as it is executed
            console.log(progress)
        });
        
        console.log(fd)
        xhr.send(fd)
    }
    
    $scope.showSimpleToast = function(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position('bottom right' )
          .hideDelay(3000)
      );
    };
    
    $scope.checkEvent = function(rowAlerta){
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
      };

    function uploadProgress(evt) {
        $scope.$apply(function(){
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                $scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }
  }
})();
