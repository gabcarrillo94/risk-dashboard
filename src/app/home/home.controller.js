(function() {
'use strict';

    angular
        .module('dashboard')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state', '$scope', 'DashboardFactory', 'EventsFactory', '$stateParams'];

    function HomeController($state, $scope, DashboardFactory, EventsFactory, $stateParams){
      var vm = this;
      $scope.events = {};

      vm.verDetalleAlerta = function(alertaId) {
        $state.go('app.alarmas', {idAlerta: alertaId});
      }

      $scope.graph = 'circular';

      $scope.switchGraph = function(type) {
        $scope.graph = type;
      };

      $scope.startDate = $stateParams.desde || moment().hour(0).minute(0).second(0).subtract(3, 'months');
      $scope.endDate = $stateParams.hasta || moment().hour(23).minute(59).second(59);

      $scope.circular = {
        closed: 0,
        inAudit: 0,
        onProgress: 0,
        open: 0
      };

      $scope.$on('dateChange', function(e, dates){
        $scope.startDate = dates.desde;
        $scope.endDate = dates.hasta;
        $scope.getDashboard();
      });

      $scope.getCircularTotal = function() {
        return $scope.circular.closed + $scope.circular.inAudit + $scope.circular.onProgress + $scope.circular.open;
      }

      $scope.getDashboard = function() {
        DashboardFactory.getDashboard($scope.startDate, $scope.endDate)
        .then(function(res) {

          $scope.circular = res.cases.circular;
          $scope.formatPeaks(res.cases.peaks);
          $scope.events = res.events;

          $scope.$apply()
        });
      };

      $scope.formatPeaks = function(peaks) {
        var data = [];
        var labels = []
        Object.keys(peaks).forEach(function(k, i) {
          var serie = [];
          peaks[k].forEach(function(d){
            if(i == 0){
              labels.push(moment(d.day).format('DD/MM/YYYY'));
            }
            serie.push(d.createdCases);
          });
          data.push(serie);
        });

        $scope.data = data;
        $scope.labels = labels;
        $scope.series = ['Alta', 'Media', 'Baja']
      };

      $scope.getDashboard();

      $scope.labels = [];
      $scope.series = ['Alta', 'Media', 'Baja']
      $scope.data = [];
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
      $scope.chartColors = [ '#F7464A', '#FDB45C', '#8bc34a' ];
      $scope.options = {
        elements: {
          line: {
            tension: 0
          },
          point: {
            radius: 0,
            borderWidth: 0
          }
        },
        scales: {
          xAxes: [{
            ticks: {
                autoSkip: true,
                autoSkipPadding: 50
            },
            gridLines: {
                display: false
            }
          }
        ],
          yAxes: [
            {
              gridLines: {
                  display: false
              }
            }
          ]
        }
      };

      $scope.optionsOlas = {
        elements: {
          // line: {
          //   tension: 0
          // },
          point: {
            radius: 0,
            borderWidth: 0
          }
        },
        scales: {
          xAxes: [{
            ticks: {
                autoSkip: true,
                autoSkipPadding: 50
            },
            gridLines: {
                display: false
            }
          }
        ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                  display: false
              }
            }
          ]
        }
      };

    }
})();
