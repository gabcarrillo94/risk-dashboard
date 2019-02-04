(function() {
'use strict';

  angular
    .module('dashboard')
    .controller('ConfiguracionController', ConfiguracionController)
    .controller('AlertaConfiguracionController', AlertaConfiguracionController);




  function AlertaConfiguracionController($scope, $rootScope, rule) {

    $scope.saveRule = function() {
      $rootScope.saveRule(true, rule);
      $scope.$hide()
    };

    $scope.notSaveRule = function() {
      $rootScope.saveRule(false, rule);
      $scope.$hide();
    };
  }


  ConfiguracionController.$inject = ['$scope', '$rootScope', 'Alarmas', '$modal', 'AlertasConfig', 'ConfigFactory'];
  function ConfiguracionController($scope, $rootScope, Alarmas, $modal, AlertasConfig, ConfigFactory) {
    var vm = this;
    vm.selectedAlert;
    vm.status = false;
    vm.paramsConfAlerta = [];

    vm.config = [];


    ConfigFactory.getConfig().then(function(cfg){
      cfg.forEach(function(c){
        c.origintalAttr = JSON.parse(JSON.stringify(c.attributes));
        c.originalActive = c.active;
        c.attributes.forEach(function(at){
          if(at.type == 'boolean') {
            if(at.value == 'true') {
              at.value = true;
            }
            else {
              at.value = false;
            }
          }
        });
      });
      vm.config = cfg;
      $scope.$apply()
    });

    vm.cancelar = function() {
      vm.selectedAlert = null;
    }
    vm.seleccionarConfig = function(selectedRow) {
      vm.selectedAlert = selectedRow;
      vm.paramsConfAlerta = [];
      vm.status = vm.selectedAlert.estado;
      AlertasConfig.obtenerParametrosAlerta(vm.selectedAlert.id, function(response){
        if(response.header.code==0) {
          vm.paramsConfAlerta = response.body;
        }
      });
    };

    vm.valType = function(t) {
      if(t == 'boolean'){
        return 'boolean';
      }
      return 'string';
    }

    vm.addChange = function(rule) {
      vm.config.forEach(function(r){
        if(r.id == rule.id){
          if(r.changes) {
            r.changes++;
          }
          else {
            r.changes = 1;
          }
        }
      });
    };

    vm.buttonGuardando = {};

    vm.cancelChanges = function(rule) {
      vm.config.forEach(function(r){
        if(r.id == rule.id) {
          r.changes = 0;
          r.attributes = JSON.parse(JSON.stringify(r.origintalAttr));
          r.active = r.originalActive;
        }
      });
    };

    vm.saveRule = function(rule) {
      vm.config.forEach(function(r){
        if(r.id == rule.id) {
          vm.buttonGuardando[rule.id] = true;
          ConfigFactory.upsertConfig([rule]).then(function(){
            r.changes = 0;
            vm.buttonGuardando[rule.id] = false;
            //cancer: no hay otra forma de hacer deepcopy razonable
            r.origintalAttr = JSON.parse(JSON.stringify(r.attributes));
            r.originalActive = r.active;
            $scope.$apply();
          })
        }
      });
    };

    $rootScope.saveRule = function(action, rule) {
      if(action){
        vm.saveRule(rule);
      }
      else {
        vm.cancelChanges(rule);
      }
    }

    vm.preSaveRule = function(rule) {
      var modalConfigAlert = $modal({
        templateUrl: 'app/configuracion/modal.configuracion.html',
        show: true ,
        size: 'lg',
        animation: true,
        controller: 'AlertaConfiguracionController',
        scope: modalConfigAlert,
        resolve: {
          rule: function() {
            return rule;
          }
        }
      });
    };

    vm.cambiarEstado = function() {
      vm.selectedAlert.estado = vm.status;
    }

    var myModal = $modal({ templateUrl: 'app/configuracion/modal.configuracion.html', show: false});
    vm.showModal = function() {
      myModal.$promise.then(myModal.show);
    };
    vm.hideModal = function() {
      myModal.$promise.then(myModal.hide);
    };

    activate();

    ////////////////

    function activate() { }
  }
})();
