'use strict';

/* Directives */

angular.module('world.directives', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']).
directive('appVersion', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).directive('favoriteButton', ['$cookies', 'Favorite', 'socket', function($cookies, Favorite, socket) {
    return {
      restrict: 'EA',
      link: function($scope, elem, attributes, ngModel) {
        $scope.uid = $cookies.UID;
        $scope.isAdded = true;

        Favorite.get({
          user_id: $scope.uid
        }, function(response) {
          for (var i = response.length - 1; i >= 0; i--) {
            if ($scope.propertyId === response[i].propertyId) {
              $scope.isAdded = false;
              elem.html('<i class="fa fa-heart">&nbsp;ติดตามแล้ว</i>');
            }
          };
        });


        elem.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          $scope.uid = $cookies.UID;
          if ($cookies.UID !== undefined) {
            if ($scope.isAdded) {

              elem.html('<i class="fa fa-heart">&nbsp;ติดตามแล้ว</i>');
              if ($scope.uid !== undefined) {

                socket.emit('Noticesend', $scope.ownerId);
                Favorite.post({
                  user_id: $scope.uid,
                  property_id: $scope.propertyId,
                  owner_id: $scope.ownerId
                }, function(response) {
                  $scope.isAdded = !$scope.isAdded;
                });

              }

            } else {

              elem.html('Favorite');
              if ($scope.uid !== undefined) {

                Favorite.kill({
                  user_id: $scope.uid,
                  property_id: $scope.propertyId,
                  owner_id: $scope.ownerId
                }, function(response) {
                  $scope.isAdded = !$scope.isAdded;
                });

              }

            }
          } else {

            alert('กรุณา สมัครสมาชิก หรือ ทำการ login เพื่อ favorite');

          }
        });
      },
      scope: {
        propertyId: "@propertyId",
        ownerId: "@ownerId",
        eventHandler: '&ngClick'
      },
      controller: function($scope, $cookies) {}
    };
  }])
  .directive('headerFix', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'index/directives/header_fix.html'
    }
  })
  .directive('headerScroll', ['$location', '$routeParams', 'User', function($location, $routeParams, User) {
    return {
      restrict: 'AEC',
      templateUrl: 'index/directives/header_scroll.html',
      link: function function_name($scope) {
        $scope.search_apartment = $routeParams.key;
      },
      controller: function($scope) {
        $scope.search = function OnSubmitSearch(value) {

          if (value) {
            $location.path('result').search("key=" + value);
            $location.replace();
          }
        };
        $scope.register_send = function() {
          var tel = "";
          var fax = "";
          var mobile = "";
          $scope.reg.password = $scope.register.password;
          User.post({
            reg: $scope.reg
          }, function(response) {

            if (response[0] === "1" && response.$resolved) {
              Check.query({
                username: $scope.reg.username,
                password: $scope.reg.password
              }, function(res) {
                $cookies.Tel = res.tel;
                $cookies.UID = res._id;
                $cookies.Hash = res.password;
                $cookies.Permission = res.permission;
                $cookies.Email = res.email;
                $cookies.Name = res.email;
                $cookies.Favoriteap = res.favoriteap;
                $rootScope.controlpanel__apartment = true;
                $rootScope.controlpanel__profile = false;
                $rootScope.controlpanel__ads = true;
                $rootScope.controlpanel__blog = true;
                $rootScope.controlpanel__report = true;
                $rootScope.controlpanel__security = true;
                $scope.displayCheckBox = false;
                $window.location = "/#!/controlpanel";
                alert("Please activate your account in your mailbox");
                //$window.location.reload();
                console.log('2016 ctrljs');
                console.log(res);
                if (res.permission !== undefined) {
                  if (res.name === undefined) {
                    $cookies.Name = res.tel;
                  } else {
                    $cookies.Name = res.name;
                  }
                  $cookies.Tel = res.tel;
                  $cookies.UID = res._id;
                  $cookies.Hash = res.password;
                  $cookies.Permission = res.permission;
                  $cookies.Email = res.email;
                  $cookies.Name = res.email;
                  $cookies.Favoriteap = res.favoriteap;
                  $rootScope.permissionGlobal = $cookies.Permission;
                  $rootScope.username = $cookies.Name;
                  $window.location.reload();
                } else {
                  console.log('2430 ctrljs');
                  console.log(res);
                  alert('Please Check your username and password');
                }
              });
            }
          });
        };
        $scope.check_username = function() {
          $scope.check_valid = "";
          $scope.check_invalid = '';
          $scope.check_valid = '';
          $scope.check_invalid = '';
          if ($scope.register.username !== "") {
            try {
              $scope.isValid = true;
              if (!$scope.register.username.search(/^[0-9]*$/)) {
                if ($scope.register.username.length == 10) {
                  User.query({
                    tel: $scope.register.username
                  }, function(res) {
                    if (res.permission !== undefined) {
                      $scope.check_invalid = "มีผู้ใช้ " + $scope.register.username + " ในระบบแล้วนะ ลองเบอร์อื่นใหม";
                      $scope.isValid = false;
                    } else {
                      $scope.check_valid = 'คุณแน่ใจแล้วหรือที่จะใช้ ' + $scope.register.username + ' ในการสมัคร เบอร์นี้จำเป็นต้องใช้ในการยืนยันสมาชิกทาง SMS กับระบบ';


                    }
                  });
                } else {
                  $scope.isValid = false;
                  $scope.check_invalid = 'กรุณาเช็ค Email หรือเบอร์โทรศัพท์ด้วยนะว่าถูกต้องหรือไม่?';
                }

              } else if (!$scope.register.username.search(/[\S]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {


                User.query({
                  email: $scope.register.username
                }, function(res) {

                  if (res.permission !== undefined) {

                    $scope.check_invalid = "มีผู้ใช้ " + $scope.register.username + " ในระบบแล้วนะ ลอง email อื่นใหม";
                    $scope.isValid = false;

                  } else {

                    $scope.check_valid = 'คุณสามารถใช้ ' + $scope.register.username + ' ในการสมัคร email นี้จะจำเป็นหากต้องการยืนยันสมาชิกนะ';

                  }
                });


              } else {
                $scope.isValid = false;
                $scope.check_invalid = 'กรุณาเช็ค Email หรือเบอร์โทรศัพท์ด้วยนะว่าถูกต้องหรือไม่?';
              }
            } catch (e) {
              console.log(e);

            }
          } else {

          }

        };
      }
    }
  }])
  .directive('apartmentFeature', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'index/directives/info_apartmentfeature.html'
    }
  })
  .directive('controlpanelMenu', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'index/directives/controlpanel_menu.html'
    }
  })
  .directive('apartmentContact', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'index/directives/info_contact.html'
    }
  })
  .directive('nearbyPlaces', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'index/directives/info_nearbyplaces.html'
    }
  })
  .directive('fooTer', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'index/directives/footer.html'
    }
  });