angular.module('ngRouteExample', ['ngRoute', 'ngAnimate', 'ngCookies', 'btford.socket-io', 'index.controllers', 'world.directives', 'manage.services', 'world.filters'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider

    .when('/index', {
      templateUrl: '/index/index.html',
      controller: 'MainController'
    })
    .when('/maptester', {
      templateUrl: '/index/maptester.html',
      controller: 'MainController'
    })
    .when('/controlpanel', {
      templateUrl: '/index/controlpanel.html',
      controller: 'ControlpanelCtrl'
    })
    .when('/controlpanel_validate', {
      templateUrl: '/index/controlpanel_validate.html',
      controller: 'ControlpanelValidateCtrl'
    })
    .when('/controlpanel_profile', {
      templateUrl: '/index/controlpanel_profile.html',
      controller: 'ControlpaneProfileCtrl'
    })
    .when('/controlpanel_noti', {
      templateUrl: '/index/controlpanel_noti.html',
      controller: 'ControlpaneNotiCtrl'
    })
    .when('/controlpanel_follow', {
      templateUrl: '/index/controlpanel_follow.html',
      controller: 'ControlpaneFollowCtrl'
    })
    .when('/result', {
      templateUrl: '/index/result.html',
      controller: 'ResultCtrl'
    })
    .when('/page_a', {
      templateUrl: '/index/template_1.html',
      controller: 'TemplateUserCtrl'
    })
    .when('/info', {
      templateUrl: '/index/info.html',
      controller: 'InfoCtrl'
    })
    .otherwise({
      redirectTo: '/index'
    });

  $locationProvider.html5Mode(false).hashPrefix('!');
}).run(['$rootScope', '$window', '$cookies', '$location', '$routeParams', '$log', 'Check',
  function($rootScope, $window, $cookies, $location, $routeParams, $log, Check) {
    $rootScope.modal_login = false;
    $rootScope.search_apartment = "";
    $rootScope.startTime = function startTime() {
      var today = new Date();
      $rootScope.hh = today.getHours();
      $rootScope.mm = today.getMinutes();
      $rootScope.ss = today.getSeconds();
      $rootScope.mm = $rootScope.checkTime($rootScope.mm);
      $rootScope.ss = $rootScope.checkTime($rootScope.ss);
      try {
        document.getElementById('hh').innerHTML = $rootScope.hh + " : ";
        document.getElementById('mm').innerHTML = $rootScope.mm + " : ";
        document.getElementById('ss').innerHTML = $rootScope.ss;
      } catch (e) {

      }
      //console.log($rootScope.ss);
      //$rootScope.$apply();
      var t = setTimeout(function() {
        startTime()
      }, 500);
    };
    $rootScope.login = {};
    $rootScope.checkTime = function checkTime(i) {
      if (i < 10) {
        i = "0" + i
      }; // add zero in front of numbers < 10
      return i;
    };
    $rootScope.startTime();
    $rootScope.toggle = false;
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $rootScope.isMobile = true;
      $rootScope.isTablet = false;
    } else if (/iPad/i.test(navigator.userAgent)) {
      $rootScope.isMobile = false;
      $rootScope.isTablet = true;
    } else {
      $rootScope.isMobile = false;
      $rootScope.isTablet = false;
    }
    $rootScope.initwaiting = 0;
    if ($cookies.Name) {
      $rootScope.username = $cookies.Name;

    } else {

    }
    $rootScope.login_send = function(user, key) {
      console.log($rootScope.login.username);
      console.log($rootScope.login.password);
      Check.query({
        username: $rootScope.login.username,
        password: $rootScope.login.password
      }, function(res) {
        $log.log(res);
        if (res.permission !== undefined) {
          $cookies.Tel = res.tel;
          $cookies.Name = res.name;
          $cookies.UID = res._id;
          $cookies.Hash = res.password;
          $cookies.Permission = res.permission;
          $cookies.Email = res.email;
          $cookies.Favoriteap = res.favoriteap;
          $rootScope.permissionGlobal = $cookies.Permission;
          $rootScope.username = $cookies.Name;
          $rootScope.idme = $cookies.UID;
          $window.location.reload();

        } else {
          alert('Please Check your username and password');
        }
      });

    }
    $rootScope.$watch('search_apartment', function function_name(newValue,oldvalue) {
      console.log(newValue);
      console.log(oldvalue);
    })
    
   
    $rootScope.callreportindex = function(newValue) {
      $location.path('print_report_booking').search("transaction_id=" + newValue);
    };
    


    angular.element(document).ready(function() {
      //$rootScope.checkpermission();
      if ($cookies.UID && $cookies.Permission && $cookies.Name) {
        $rootScope.permissionGlobal = $cookies.Permission;
        $rootScope.username = $cookies.Name;
        $rootScope.idme = $cookies.UID;
      }

    });
    $rootScope.logout = function LogOut() {
      delete $cookies.Tel;
      delete $cookies.Name;
      delete $cookies.UID;
      delete $cookies.Hash;
      delete $cookies.Permission;
      delete $cookies.Email;
      delete $cookies.Favoriteap;
      delete $rootScope.idme;
      delete $rootScope.permissionGlobal;
      delete $rootScope.username;
      $location.path('/login');
      $location.replace();
      $window.location.reload();
    };

  }
]);