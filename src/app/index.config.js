(function() {
  'use strict';

  angular
    .module('dashboard')
    .config(config);


    /** @ngInject */
  function config($logProvider, toastrConfig, ChartJsProvider, $httpProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // $httpProvider config

    $httpProvider.interceptors.push('SessionInterceptor');

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;

    // Configure all charts
    ChartJsProvider.setOptions({
      colors: ['#00bcd4', '#ff9800', '#8bc34a'],
      legendTemplate: " ",
      bezierCurve : false,
      pointDot : true,
      pointDotRadius : 5,
      pointDotStrokeWidth :1,
      showScale: false,
      scaleShowGridLines : false,
      scaleLineColor: "#99a7b6",
      maintainAspectRatio: false,
      // elements: {
      //   line: {
      //     tension: 0
      //   },
      //   point: {
      //     radius: 0,
      //     borderWidth: 0
      //   }
      // }
    });
  }

})();
