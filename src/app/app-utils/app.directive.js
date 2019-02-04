(function() {
  'use strict';

  angular
    .module('dashboard')
    .directive('inpuFile', inpuFile)
    .directive('onEnter', onEnter);
    
  inpuFile.$inject = [];
  function inpuFile() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
        restrict: 'A',
        link: link,
        scope: {
        }
    };
    return directive;

    function link(scope, element) {
      var inputs = element;

      Array.prototype.forEach.call( inputs, function( input )
        {
          var label	 = input.nextElementSibling,
            labelVal = label.innerHTML;

          input.addEventListener( 'change', function( e )
          {
            var fileName = '';
            if( this.files && this.files.length > 1 )
              fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
              fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
              label.querySelector( 'span' ).innerHTML = fileName;
            else
              label.innerHTML = labelVal;
          });
        });
    }
  }

  function onEnter() {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.onEnter);
          });
          event.preventDefault();
        }
      });
    };
  };

})();
