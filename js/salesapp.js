angular.module('ngRouteExample', ['ngRoute', 'world.salescontrollers', 'world.salesdirectives', 'world.salesservices', 'world.filters'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/apartment_mobile', {
      template: '<apartment-mobile></apartment-mobile>'

    })
    .otherwise({
      redirectTo: '/apartment_mobile'
    });



  // configure html5 to get links working on jsfiddle
  //$locationProvider.html5Mode(true);
  $locationProvider.html5Mode(false).hashPrefix('!');
}]).run(['$rootScope', '$window', function($rootScope, $window) {

  $window.prerenderReady = false;
  (function(d) {
    var script = d.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDnACcjGRPA_KhojEjtgHAzWBY9WsIW_rI&v=3.exp&sensor=true&' +
      'callback=initMap&libraries=places';
    d.body.appendChild(script);
  }(document));

}]);