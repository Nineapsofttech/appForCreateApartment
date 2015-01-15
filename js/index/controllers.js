'use strict';

angular.module('index.controllers', ['ngCookies', 'angular-carousel', 'ngTouch', 'pickadate', 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap', 'checklist-model']).
controller('MockupCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$log', '$location', '$cookies', '$window',
  function($scope, $rootScope, $anchorScroll, $routeParams, $log, $location, $cookies, $window) {

  }
]).controller('ControlpaneFollowCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$log', '$location', '$cookies', '$window',
  function($scope, $rootScope, $anchorScroll, $routeParams, $log, $location, $cookies, $window) {

  }
]).controller('ControlpaneNotiCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$log', '$location', '$cookies', '$window',
  function($scope, $rootScope, $anchorScroll, $routeParams, $log, $location, $cookies, $window) {

  }
]).controller('ControlpanelValidateCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$log', '$location', '$cookies', '$window',
  function($scope, $rootScope, $anchorScroll, $routeParams, $log, $location, $cookies, $window) {

  }
]).controller('ControlpaneProfileCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$log', '$location', '$cookies', '$window', 'User', 'Member',
  function($scope, $rootScope, $anchorScroll, $routeParams, $log, $location, $cookies, $window, User, Member) {
    $scope.changepasswordstatus = 2;
    $scope.editprofilestatus = 2;
    Member.get({
      get_profile: 1
    }, function OngetUser(result) {
      if (result.$resolved) {
        $scope.changepasswordstatus = 1;
        $scope.editprofilestatus = 1;
        $scope.post = result;
      }
    });
    $scope.changepassword = function() {
      $scope.changepasswordstatus = 2;
      Member.post({
        change_password: $scope.pass
      }, function OnChangePassword(result) {
        if (result.$resolved && result.status === "ok") {
          $scope.changepasswordstatus = 3;
        } else if (result.$resolved && result.status === "err") {
          $scope.changepasswordstatus = 4;
        } else {
          $scope.changepasswordstatus = 4;
        }
      });
    }
    $scope.save = function() {
      $scope.editprofilestatus = 2;
      Member.post({
        update_profile: $scope.post
      }, function OnChangePassword(result) {
        if (result.$resolved && result.status === "ok") {
          $scope.editprofilestatus = 3;
        } else if (result.$resolved && result.status === "err") {
          $scope.editprofilestatus = 4;
        } else {
          $scope.changepasswordstatus = 4;
        }
      });
    }
  }
]).controller('ControlpanelCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$log', '$location', '$cookies', '$window',
  function($scope, $rootScope, $anchorScroll, $routeParams, $log, $location, $cookies, $window) {

  }
]).controller('TemplateUserCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$log', 'Info', 'Property', '$cookies', '$window',
  function($scope, $rootScope, $anchorScroll, $routeParams, $log, Info, Property, $cookies, $window) {
    Property.query({
      get_room: $routeParams.apartment_id
    }, function(building_list) {
      $scope.building_list = building_list;
      $log.log("building_list");
      $log.log($scope.building_list);
    });
    Info.query({
      _id: $routeParams.apartment_id
    }, function(result) {
      $scope.apartment_detail = result;

      if ($rootScope.isMobile) {

      } else {
        var mapOptions = {
          zoom: 15,
          scrollwheel: true,
          zoomControl: true

        };
        $scope.mapfocus = function(controlDiv, map) {

          // Set CSS styles for the DIV containing the control
          // Setting padding to 5 px will offset the control
          // from the edge of the map
          controlDiv.style.padding = '5px';

          // Set CSS for the control border
          var controlUI = document.createElement('div');
          controlUI.style.backgroundColor = '#23b4f4';
          controlUI.style.borderStyle = 'solid';
          controlUI.style.borderWidth = '2px';
          controlUI.style.cursor = 'pointer';
          controlUI.style.textAlign = 'center';
          controlUI.title = 'Click to set the map to Home';
          controlDiv.appendChild(controlUI);

          // Set CSS for the control interior
          var controlText = document.createElement('div');
          controlText.style.fontFamily = 'Arial,sans-serif';
          controlText.style.color = 'white';
          controlText.style.fontSize = '12px';
          controlText.style.paddingLeft = '4px';
          controlText.style.paddingRight = '4px';
          controlText.innerHTML = '<b>' + $scope.apartment_detail.title + '</b>';
          controlUI.appendChild(controlText);

          // Setup the click event listeners: simply set the map to
          // Chicago
          google.maps.event.addDomListener(controlUI, 'click', function() {
            $scope.map.setCenter(new google.maps.LatLng($scope.apartment_detail.location[1], $scope.apartment_detail.location[0]));
          });


        }
        $scope.map = new google.maps.Map(document.getElementById('callmap'), mapOptions);
        $scope.marker = new google.maps.Marker({
          position: new google.maps.LatLng($scope.apartment_detail.location[1], $scope.apartment_detail.location[0])
        });
        $scope.marker.setMap($scope.map);
        $scope.map.setCenter(new google.maps.LatLng($scope.apartment_detail.location[1], $scope.apartment_detail.location[0]));
        var homeControlDiv = document.createElement('div');
        var homeControl = new $scope.mapfocus(homeControlDiv, $scope.map);

        homeControlDiv.index = 1;
        $scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
      }
      Property.query({
        location: $scope.apartment_detail.location
      }, function(apartment_list) {
        $scope.apartment_list = apartment_list;
        $log.log($scope.apartment_list);
      })
      Property.query({
        get_room: $routeParams.apartment_id
      }, function(building_list) {
        $scope.building_list = building_list;
        $log.log("building_list");
        $log.log($scope.building_list);
      });
      $log.log($scope.apartment_detail.location);
    });
  }
]).controller('ResultCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$cookies', '$log', 'Property', 'SponsorApartment', 'Search',
  function($scope, $rootScope, $anchorScroll, $routeParams, $cookies, $log, Property, SponsorApartment, Search) {
    Search.query({
      search: $routeParams.key
    }, function(result) {
      $scope.apartment_list = result;

    });
    SponsorApartment.get({}, function(result) {
      $scope.sponsor_list = result;
    });
  }
]).controller('MainController', ['$scope', '$rootScope', '$location', '$log', '$cookies', '$anchorScroll', '$window', 'SponsorApartment', 'Property', 'User', 'Check',
  function($scope, $rootScope, $location, $log, $cookies, $anchorScroll, $window, SponsorApartment, Property, User, Check) {
    angular.element(document).ready(function() {
      $scope.check_valid = "";
      $scope.check_invalid = '';
      $scope.check_valid = '';
      $scope.check_invalid = '';
      $scope.reg = {};
      //$rootScope.checkpermission();
      Property.query({}, function(result) {
        $scope.apartment_list = result;
        SponsorApartment.get({}, function(result) {
          for (var i = result.length - 1; i >= 0; i--) {

            $scope.apartment_list.unshift(result[i]);
          };
          $log.log($scope.apartment_list);
        });
      });
      $scope.search = function OnSearch() {
        console.log($scope.search_apartment);
        $location.path('/result').search('key=' + $scope.search_apartment);
        $location.replace();
      }
      if (document.getElementById('map-canvas')) {
        var mapOptions = {
          zoom: 11
        };
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        for (var i = 0; i < 35; i++) {
          for (var j = 0; j < 45; j++) {
            $scope.populationOptions = {
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              center: new google.maps.LatLng($scope.lat, $scope.lng),
              radius: 800
            };
            // Add the circle for this city to the map.
            $scope.traget = new google.maps.Circle($scope.populationOptions);

            $scope.lat = 13.593661700000001 + (i / 100);
            $scope.lng = 100.369883100000001 + (j / 100);
            $log.log($scope.lat);
            $scope.marker = new google.maps.Marker({
              position: new google.maps.LatLng($scope.lat, $scope.lng)
            });
            $scope.traget.setMap($scope.map);
            $scope.marker.setMap($scope.map);
          };
        };
        $scope.map.setCenter(new google.maps.LatLng(13.883661700000001, 100.5698831));
      }
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
                    $scope.reg.username = $scope.register.username;
                    $scope.reg.tel = $scope.register.username;
                    $scope.reg.password = $scope.register.password;
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
                  $scope.reg.username = $scope.register.username;
                  $scope.reg.email = $scope.register.username;
                  $scope.reg.password = $scope.register.password;
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
    });
  }
]).controller('InfoCtrl', ['$scope', '$rootScope', '$anchorScroll', '$log', '$routeParams', 'Info', 'Property',
  function($scope, $rootScope, $anchorScroll, $log, $routeParams, Info, Property) {

    angular.element(document).ready(function() {
      //$rootScope.checkpermission();



      Info.query({
        _id: $routeParams.apartment_id
      }, function(result) {
        $scope.apartment_detail = result;

        if ($rootScope.isMobile) {

        } else {
          var mapOptions = {
            zoom: 15,
            scrollwheel: true,
            zoomControl: true

          };
          $scope.mapfocus = function(controlDiv, map) {

            // Set CSS styles for the DIV containing the control
            // Setting padding to 5 px will offset the control
            // from the edge of the map
            controlDiv.style.padding = '5px';

            // Set CSS for the control border
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#23b4f4';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '0px';
            controlUI.style.borderRadius = '5px';
            controlUI.style.padding = '5px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to set the map to Home';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior
            var controlText = document.createElement('div');
            controlText.style.fontFamily = 'Arial,sans-serif';
            controlText.style.color = 'white';
            controlText.style.fontSize = '12px';
            controlText.style.paddingLeft = '4px';
            controlText.style.paddingRight = '4px';
            controlText.innerHTML = '<b><i class="fa fa-map-marker"></i>&nbsp;' + $scope.apartment_detail.title + '</b>';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to
            // Chicago
            google.maps.event.addDomListener(controlUI, 'click', function() {
              $scope.map.setCenter(new google.maps.LatLng($scope.apartment_detail.location[1], $scope.apartment_detail.location[0]));
            });


          }
          if ($scope.apartment_detail.location !== undefined && $scope.apartment_detail.location[1]) {
            $scope.map = new google.maps.Map(document.getElementById('callmap'), mapOptions);
            $scope.marker = new google.maps.Marker({
              position: new google.maps.LatLng($scope.apartment_detail.location[1], $scope.apartment_detail.location[0])
            });
            $scope.marker.setMap($scope.map);
            $scope.map.setCenter(new google.maps.LatLng($scope.apartment_detail.location[1], $scope.apartment_detail.location[0]));
            var homeControlDiv = document.createElement('div');
            var homeControl = new $scope.mapfocus(homeControlDiv, $scope.map);

            homeControlDiv.index = 1;
            $scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
          }

        }
        Property.query({
          location: $scope.apartment_detail.location
        }, function(apartment_list) {
          $scope.apartment_list = apartment_list;
          $log.log($scope.apartment_list);
        })
        $log.log($scope.apartment_detail.location);
      });

    });
  }
]);