'use strict';

/* Directives */

angular.module('world.salesdirectives', ['ngAnimate', 'ngSanitize']).
directive('appVersion', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
  .directive('myLogin', [function() {
    return {
      restrict: 'E',
      templateUrl: 'template/login.html',
      controller: "Login"
    }
  }])
  .directive('myHeaderfix', ['$location', function($location) {
    return {
      restrict: 'AEC',
      templateUrl: 'template/header_fix.html'

    }
  }]).
directive('apartmentMobile', ['$location', 'CreateProperty', 'Duplicate', '$cookies', 'Filtermain', 'Check', function($location, CreateProperty, Duplicate, $cookies, Filtermain, Check) {
    return {
      restrict: 'AEC',
      templateUrl: 'template/form/form_create_apartment_mobile.html',
      controller: ['$rootScope', '$scope', '$routeParams', '$cookies', function($rootScope, $scope, $routeParams, $cookies) {


        var markerarray = [];
        var infoarray = [];
        var image = 'image/icon/map_pin.png';
        $rootScope.customershow = false;
        var test = new FormData();

        $scope.previewdraganddrop = function(evt) {
          console.log(evt);
          for (var i in test) {
            console.log(test[i])
          }
          for (var i = 0, f; f = evt.files[i]; i++) {
            if (!f.type.match('image.*')) {
              continue;
            }
            test.append("photogal", evt.files[i]);
            var reader = new FileReader();
            reader.onload = (function(theFile) {
              return function(e) {
                var img = new Image(200, 200);
                img.src = e.target.result;
                img.class = 'gallery';
                document.getElementById('Previewzone').appendChild(img);
              };
            })(f);
            reader.readAsDataURL(f);
          }
        }


        $scope.logopreview = function(evt) {
          var file = evt;
          try {
            for (var i = 0, f; f = file.files[i]; i++) {
              if (!f.type.match('image.*')) {
                continue;
              }

              test.append("logo", evt.files[i]);
              var reader = new FileReader();
              reader.onload = (function(theFile) {
                return function(e) {
                  var img = new Image(300, 0);
                  img.src = e.target.result;
                  img.className = 'logo';
                  try {
                    document.getElementById('Previewlogozone').appendChild(img);
                  } catch (e) {

                  }


                };
              })(f);
              reader.readAsDataURL(f);
            }
          } catch (e) {
            console.log(e)
          }
        };


        $scope.headerpreview = function(evt) {
          var file = evt;
          for (var i = 0, f; f = file.files[i]; i++) {
            if (!f.type.match('image.*')) {
              continue;
            }
            test.append("header", evt.files[i]);
            var reader = new FileReader();
            reader.onload = (function(theFile) {
              return function(e) {
                var img = new Image(300, 0);
                img.src = e.target.result;
                img.class = 'header';
                document.getElementById('Previewcoverzone').appendChild(img);

              };
            })(f);
            reader.readAsDataURL(f);
          }
        };


        $scope.upgrade = function() {
          $scope.up.location = [$cookies.lng, $cookies.lat];
          if (!$cookies) {
            $scope.up.user_id = $cookies.UID;
          }

          $scope.up.edit_state = '4';
          CreateProperty.post({
            property: $scope.up
          }, function(response) {
            $scope.statUp = response;
            console.log(response);
            if (response._id !== undefined) {
              try {
                test.append('user_id', $cookies.UID);
                test.append("id", response._id);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/uploadpic");
                xhr.send(test)
              } catch (e) {
                console.log(e);
              } finally {
                // $rootScope.setCC("man/age");
                //$rootScope.setCC("manage");
              }
              Filtermain.query({
                all: $cookies.UID
              }, function(res) {
                $scope.list = res;
                $scope.up = {};
              });
            }
          });
        };


        $scope.isDuplicate = function() {
          console.log($scope.up.namespace)
          Duplicate.query({
            namespace: $scope.up.namespace
          }, function(res) {
            console.log(res)
            try {
              if (res.data && (res.data[0]._id !== $scope.up._id.toString())) {
                $scope.register.namespace.$error.pattern = true;
                $scope.duplicatestatus = false;
              } else {
                $scope.duplicatestatus = true;
              }

            } catch (e) {

            }

            console.log($scope.register)

          });
        };


        $scope.initlist = function() {
          if ($cookies.UID) {
            Filtermain.query({
              all: $cookies.UID
            }, function(res) {
              $scope.list = res;
            });
          }else{
            alert('กรุณา login ก่อน');
          }

        };


        $scope.streetinit = function() {
          $rootScope.$broadcast('streetMap', true);
        };


        $scope.nonstreetinit = function() {
          $rootScope.$broadcast('nonstreetmapReady', true);


        };
        $scope.zoomin = function() {
          var zoomlv = $scope.map.getZoom();
          zoomlv++;
          $scope.map.setZoom(zoomlv);
        };

        $scope.zoomout = function() {
          var zoomlv = $scope.map.getZoom();
          zoomlv--;
          $scope.map.setZoom(zoomlv);
        };

        $scope.resetpin = function() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              console.log(pos)
              $scope.map.setCenter(pos);
            });
          } else {
            alert('กรุณาเปิด GPS ด้วยนะ');
          }

        };


        $scope.$on('streetMap', function(event) {
          $scope.distances = [];
          var mapOptions = {
            zoom: 16,
            scrollwheel: false,
            disableDoubleClickZoom: true
          };
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
              var panoramaOptions = {
                position: pos,
                pov: {
                  heading: 270,
                  pitch: 0,
                },
                scrollwheel: false,
                zoom: 1
              };
              $scope.map = new google.maps.StreetViewPanorama(document.getElementById('map-canvas'), panoramaOptions);
              $scope.map.setVisible(true);
              google.maps.event.addListener($scope.map, 'pov_changed', function() {
                $scope.up.heading = $scope.map.getPov().heading;
                $scope.up.pitch = $scope.map.getPov().pitch;
              });
              if ($cookies.lat == null) {} else {
                // position.coords.latitude = $cookies.get('lat');
                // position.coords.longitude =$cookies.get('lng');
              }
            }, function() {
              $scope.handleNoGeolocation(true);
            });
          } else {
            $scope.handleNoGeolocation(false);
          }
        });


        $scope.$on('nonstreetmapReady', function(event) {
          var mapOptions = {
            zoom: 14,
            scrollwheel: false,
            disableDoubleClickZoom: true
          };
          $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                if ($cookies.lat == undefined) {
                  var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                } else {
                  var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
                }
                $scope.marker = new google.maps.Marker({
                  position: pos,
                  title: "Your Location",
                  draggable: true,
                  icon: image
                });




                google.maps.event.addListener($scope.map, 'center_changed', function() {
                  var latlng = new google.maps.LatLng($scope.map.center.lat(), $scope.map.center.lng());
                  $cookies.lat = $scope.map.center.lat();
                  $cookies.lng = $scope.map.center.lng();
                  $scope.marker.setPosition(latlng);
                });
                google.maps.event.addListener($scope.marker, 'dragend', function(evt) {
                  for (var i = 0; i < markerarray.length; i++) {
                    markerarray[i].setMap(null);
                  }
                  // position.coords.latitude = evt.latLng.lat();
                  // position.coords.longitude = evt.latLng.lng();        
                  $cookies.lat = evt.latLng.lat();
                  $cookies.lng = evt.latLng.lng();
                  var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
                  $scope.map.setCenter(pos);
                });

                $scope.marker.setMap($scope.map);
                $scope.map.setCenter(pos);
                if ($cookies.lat == null) {} else {
                  // position.coords.latitude = $cookies.get('lat');
                  // position.coords.longitude =$cookies.get('lng');
                }
              },
              function() {
                $scope.handleNoGeolocation(true);
              });
          } else {
            $scope.handleNoGeolocation(false);
          }
        });


        $scope.handleNoGeolocation = function(errorFlag) {
          if (errorFlag) {
            var content = 'Error: The Geolocation service failed. Please click on the map to change location.';
          } else {
            var content = 'Error: Your browser doesn\'t support geolocation. Please click on the map to change location.';
          }
          var options = {
            map: $scope.map,
            position: new google.maps.LatLng(13.883661700000001, 100.5698831),
            content: content
          };
          var infowindow = new google.maps.InfoWindow(options);
          $scope.map.setCenter(options.position);
          $scope.showMeTheCondo(options.position);
        };


      }]
    }
  }])
  .directive('myFooter', ['$location', function($location) {
    return {
      restrict: 'E',
      templateUrl: 'template/footer.html',
      controller: ['$rootScope', function($rootScope) {
        if ($location.path() === '/info') {
          $rootScope.myfooterbar = false;
        } else if ($location.path() === '/my_page' || $location.path() === '/web_member' || $location.path() === '/my_page2') {
          $rootScope.myfooterbar = true;
        } else if ($location.path() === '/controlpanel') {
          $rootScope.myfooterbar = false;
        } else if ($location.path() === '/profile_member' || $location.path() === '/security_member' || $location.path() === '/apartment_member' || $location.path() === '/edit_property' || $location.path() === '/ads_member' || $location.path() === '/report_member' || $location.path() === '/view_ads' || $location.path() === '/permisson_ad' || $location.path() === '/ads_admin' || $location.path() === '/customers_admin' || $location.path() === '/assign_customers_admin' || $location.path() === '/stage_customers_admin' || $location.path() === '/sale_dashboard' || $location.path() === '/customers_billing' || $location.path() === '/customers_appointment' || $location.path() === '/customers_checkin' || $location.path() === '/customers_detail' || $location.path() === '/apartment_admin') {
          $rootScope.myfooterbar = false;
        } else {
          $rootScope.myfooterbar = false;
        }

      }]
    }
  }])


.directive('controlpanelNotich', ['User', '$cookies', function(User, $cookies) {
    return {
      restrict: 'E',
      templateUrl: 'template/form/controlpanel_notich.html',
      link: ['$scope', 'elem', 'attributes', 'ngModel', function($scope, elem, attributes, ngModel) {
        $scope.choose = {};
        $scope.choose.email_favoriteap = false;
        $scope.choose.favoriteap = false;
        $scope.mailnotice = false;
        $scope.notice = false;
        if ($cookies.Favoriteap === "true") {
          User.query({
            email: $cookies.Email
          }, function(res) {
            console.log(res.email_favoriteap)
            if (res.email_favoriteap === "true") {
              $scope.mailnotice = true;
            }
            if (res.favoriteap === "true") {
              $scope.notice = true;
            }


          });
        }

      }],
      controller: ["$scope", function($scope) {

        $scope.checkbox = function() {
          console.log($scope.choose.email_favoriteap)
          console.log($scope.choose.favoriteap)
        }
      }]
    }
  }])
  .directive('controlpanelMenu', function() {
    return {
      restrict: 'E',
      templateUrl: 'template/form/controlpanel_manu.html'
    }
  })
  .directive('previewWebpagetwo', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'template/template_user/template_preview2.html'
    }
  })
  .directive('previewWebpagethree', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'template/template_user/template_preview3.html'
    }
  })


.directive('formAddcustomers', function() {
    return {
      restrict: 'E',
      templateUrl: 'template/form/form_add_customers.html'
    }
  })
  .directive('formCreateapartment', function() {
    return {
      restrict: 'E',
      templateUrl: 'template/form/form_create_apartment.html'
    }
  })

.directive('formEditapartment', function() {
  return {
    restrict: 'E',
    templateUrl: 'template/form/form_create_apartment.html'
  }
})

.directive('validFile', function() {
    return {
      require: 'ngModel',
      link: ['scope', 'el', 'attrs', 'ngModel', function(scope, el, attrs, ngModel) {
        el.bind('change', function() {
          scope.$apply(function() {
            ngModel.$setViewValue(el.val());
            ngModel.$render();
          });
        });
      }]
    }
  })
  .directive('helloHtml', [function() {
    return {
      restrict: 'E',
      templateUrl: 'template/hello.html',
      controller: ['$scope', function($scope) {
        $scope.user = {
          name: 'awesome user'
        };
      }]
    }
  }])
  .directive('webFooter', [function() {
    return {
      restrict: 'E',
      templateUrl: 'template/footer.html'
    }
  }]);