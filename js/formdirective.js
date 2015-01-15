'use strict';

angular.module('world.formdirective', [])
  .directive('formCreateads', ['$rootScope', '$cookies', '$route', '$routeParams', '$location', 'Adsservice', 'Adscreation', 'socket', 'Adsstatus',
    function($rootScope, $cookies, $route, $routeParams, $location, Adsservice, Adscreation, socket, Adsstatus) {
      return {
        restrict: 'E',
        templateUrl: 'template/form/form_create_ads.html',
        controller: function($scope, $window) {
          var test = new FormData();
          var image = 'image/icon/map_pin.png';
          $scope.markerarray = [];
          $scope.properties = {};
          $scope.ads = {};
          $scope.properties = Adsservice.query({
            user_id: $cookies.UID
          });
          $rootScope.$broadcast('adsmapReady', true);
          $scope.ads.sale_id = $cookies.UID;
          if ($routeParams._id !== undefined) {
            Adsstatus.query({
              adsid: $routeParams._id
            }, function(res) {
              $scope.ads = res;
            })
          } else {}

          $scope.upgrade = function() {
            $scope.ads.location = [];
            $scope.ads.location[1] = $cookies.lat;
            $scope.ads.location[0] = $cookies.lng;
            Adscreation.post({
              cus_regis: $scope.ads
            }, function(response) {
              if (response._id !== undefined) {
                try {
                  test.append('user_id', $cookies.UID);
                  test.append("id", response.property_id);
                  test.append("_id", response._id);
                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/uploadads");
                  xhr.send(test)
                } catch (e) {
                  console.log(e);
                } finally {
                  $rootScope.setCC("manage");
                }
              }
            });
            $rootScope.setCC("ads");
            // $route.reload();
          };


          $scope.edit_ads = function() {
            $rootScope.setCC("ads");
          };


          $scope.delete_ads = function() {
            alert("delete ads " + $routeParams._id);
            Adsservice.post({
              _id: $routeParams._id
            });
            $rootScope.setCC("ads");
            //$route.reload();
          };


          $scope.adspreview = function(evt) {
            test = new FormData();
            var file = evt;
            try {
              for (var i = 0, f; f = file.files[i]; i++) {
                if (!f.type.match('image.*')) {
                  continue;
                }
                test.append("ads", evt.files[i]);
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                  return function(e) {
                    try {
                      document.getElementById('adspv').style.backgroundImage = "url('" + e.target.result + "')";
                    } catch (e) {}
                  };
                })(f);
                reader.readAsDataURL(f);
              }
            } catch (e) {
              console.log(e)
            }
          };

          $scope.$on('adsmapReady', function(event) {
            var mapOptions = {
              zoom: 14,
              scrollwheel: false,
              disableDoubleClickZoom: true
            };
            try {
              $scope.map = new google.maps.Map(document.getElementById('map-canvas-ads'), mapOptions);

            } catch (e) {

            } finally {
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
                    $cookies.lat = evt.latLng.lat();
                    $cookies.put("lng", evt.latLng.lng());
                    var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
                    $scope.map.setCenter(pos);
                  });
                  $scope.marker.setMap($scope.map);
                  $scope.map.setCenter(pos);
                  if ($cookies.lat == null) {} else {

                  }
                }, function() {
                  $scope.handleNoGeolocation(true);
                });
              } else {
                $scope.handleNoGeolocation(false);
              }

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


        }
      }
    }
  ]).
directive('formZipcode', ['Zipcode', function(Zipcode) {
  return {
    restrict: 'AEC',
    templateUrl: 'template/form/form_zipcode.html',
    controller: function($scope) {
      $scope.province = [];
      $scope.amphur = [];
      $scope.district = [];
      $scope.zipcode = [];

      $scope.districtfind = function() {
        if ($scope.up.zipcode.length == 5) {
          Zipcode.get({
            district: $scope.up.district,
            zipcode: $scope.up.zipcode
          }, function(response) {
            $scope.zipcode = [];
            $scope.province = [];
            $scope.amphur = [];
            $scope.zipcodereturn = response.data;
            console.log(response.data)
            for (var i = 0; i < response.data.length; i++) {
              if (!$scope.province.contains(response.data[i].province_name)) {
                $scope.province.push(response.data[i].province_name);
              }
            };
            for (var i = 0; i < response.data.length; i++) {
              if (!$scope.amphur.contains(response.data[i].amphur_name)) {
                $scope.amphur.push(response.data[i].amphur_name);
              }
            };

            for (var i = 0; i < response.data.length; i++) {
              if (!$scope.zipcode.contains(response.data[i].zipcode)) {
                $scope.zipcode.push(response.data[i].zipcode);
              }
            };
            try {

              if ($scope.province.length > 0) {
                $scope.up.province = $scope.province[0];
              }
              if ($scope.amphur.length > 0) {
                $scope.up.amphur = $scope.amphur[0];
              }

            } catch (e) {

            }
          });
        }

      };

      $scope.amphurfind = function() {
        if ($scope.up.zipcode.length == 5) {
          Zipcode.get({
            amphur: $scope.up.amphur,
            zipcode: $scope.up.zipcode
          }, function(response) {
            $scope.zipcode = [];
            $scope.province = [];
            $scope.district = [];
            $scope.zipcodereturn = response.data;
            for (var i = 0; i < response.data.length; i++) {
              if (!$scope.province.contains(response.data[i].province_name)) {
                $scope.province.push(response.data[i].province_name);
              }
            };

            for (var i = 0; i < response.data.length; i++) {
              if (!$scope.district.contains(response.data[i].district_name)) {
                $scope.district.push(response.data[i].district_name);
              }
            };
            for (var i = 0; i < response.data.length; i++) {
              if (!$scope.zipcode.contains(response.data[i].zipcode)) {
                $scope.zipcode.push(response.data[i].zipcode);
              }
            };
            try {
              if ($scope.district.length > 0) {
                $scope.up.district = $scope.district[0];
              }
              if ($scope.province.length > 0) {
                $scope.up.province = $scope.province[0];
              }


            } catch (e) {

            }
          });
        }

      };

      $scope.findzip = function() {

        Zipcode.get({
          zipcode: $scope.up.zipcode
        }, function(response) {
          $scope.zipcode = [];
          $scope.province = [];
          $scope.amphur = [];
          $scope.district = [];
          $scope.zipcodereturn = response.data;
          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.province.contains(response.data[i].province_name)) {
              $scope.province.push(response.data[i].province_name);
            }
          };
          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.amphur.contains(response.data[i].amphur_name)) {
              $scope.amphur.push(response.data[i].amphur_name);
            }
          };
          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.district.contains(response.data[i].district_name)) {
              $scope.district.push(response.data[i].district_name);
            }
          };
          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.zipcode.contains(response.data[i].zipcode)) {
              $scope.zipcode.push(response.data[i].zipcode);
            }
          };
          try {
            if ($scope.district.length > 0) {
              $scope.up.district = $scope.district[0];
            }
            if ($scope.province.length > 0) {
              $scope.up.province = $scope.province[0];
            }
            if ($scope.amphur.length > 0) {
              $scope.up.amphur = $scope.amphur[0];
            }

          } catch (e) {

          }
        });

      };

      $scope.setzipcodeform = function(district, amphur) {
        Zipcode.get({
          zipcode: $scope.up.zipcode
        }, function(response) {
          $scope.zipcode = [];
          $scope.province = [];
          $scope.amphur = [];
          $scope.district = [];
          $scope.zipcodereturn = response.data;

          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.province.contains(response.data[i].province_name)) {
              $scope.province.push(response.data[i].province_name);
            }
          };
          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.amphur.contains(response.data[i].amphur_name)) {
              $scope.amphur.push(response.data[i].amphur_name);
            }
          };
          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.district.contains(response.data[i].district_name)) {
              $scope.district.push(response.data[i].district_name);
            }
          };
          for (var i = 0; i < response.data.length; i++) {
            if (!$scope.zipcode.contains(response.data[i].zipcode)) {
              $scope.zipcode.push(response.data[i].zipcode);
            }
          };

          for (var i = 0; i < $scope.amphur.length; i++) {
            console.log(amphur + "-----------------")
            console.log($scope.amphur[i])
            if (amphur === $scope.amphur[i]) {

              $scope.up.amphur = $scope.amphur[i];
            }
          };
          for (var i = 0; i < $scope.district.length; i++) {
            if ($scope.district[i] === district) {
              $scope.up.district = $scope.district[i];
            }
          };
        });
      };
    }
  }
}]).
directive('formZipcodemobile', ['Zipcode', function(Zipcode) {
  return {
    restrict: 'AEC',
    templateUrl: 'template/form/form_zipcode_mobile.html',
    controller: function($scope) {
      $scope.province = [];
      $scope.amphur = [];
      $scope.district = [];
      $scope.zipcode = [];
      $scope.findzip = function() {
        Zipcode.get({
          zipcode: $scope.up.zipcode
        }, function(response) {
          $scope.zipcode = [];
          $scope.province = [];
          $scope.amphur = [];
          $scope.district = [];
          $scope.zipcodereturn = response;
          for (var i = 0; i < response.length; i++) {
            if (!$scope.province.contains(response[i].province_name)) {
              $scope.province.push(response[i].province_name);
            }
          };
          for (var i = 0; i < response.length; i++) {
            if (!$scope.amphur.contains(response[i].amphur_name)) {
              $scope.amphur.push(response[i].amphur_name);
            }
          };
          for (var i = 0; i < response.length; i++) {
            if (!$scope.district.contains(response[i].district_name)) {
              $scope.district.push(response[i].district_name);
            }
          };
          for (var i = 0; i < response.length; i++) {
            if (!$scope.zipcode.contains(response[i].zipcode)) {
              $scope.zipcode.push(response[i].zipcode);
            }
          };
          try {
            if ($scope.district.length > 0) {
              $scope.up.district = $scope.district[0];
            }
            if ($scope.province.length > 0) {
              $scope.up.province = $scope.province[0];
            }
            if ($scope.amphur.length > 0) {
              $scope.up.amphur = $scope.amphur[0];
            }

          } catch (e) {

          }
        });
      };
    }
  }
}]).
directive('apartmentMobile', ['$location', 'CreateProperty', 'Duplicate', '$cookies', 'Filtermain', 'Check', function($location, CreateProperty, Duplicate, $cookies, Filtermain, Check) {
  return {
    restrict: 'AEC',
    templateUrl: 'template/form/form_create_apartment_mobile.html',
    link: function(scope, element, attrs) {

    },
    controller: function($rootScope, $scope, $routeParams) {

      Check.query({
        username: 'agent1',
        password: '123456'
      }, function(res) {
        console.log(res);
      });
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
        $scope.up.user_id = '53d7741da2b722d84996a047';
        $scope.up.edit_state = '0';
        CreateProperty.post({
          property: $scope.up
        }, function(response) {
          $scope.statUp = response;
          console.log(response);
          if (response._id !== undefined) {
            try {
              test.append('user_id', '53d7741da2b722d84996a047');
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
              all: '53d7741da2b722d84996a047'
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
        Filtermain.query({
          all: '53d7741da2b722d84996a047'
        }, function(res) {
          $scope.list = res;
        });
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


    }
  }
}]).
directive('loginForm', ['Check', 'User', '$cookies',
  function(Check, User, $cookies) {
    return {
      restrict: 'AEC',
      templateUrl: 'template/form/login_form.html',
      controller: function($scope, $rootScope, $cookies) {
        $scope.loginsend = function() {
          Check.query({
            username: $scope.login.username,
            password: $scope.login.password
          }, function(res) {

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
              $scope.displayCheckBox = false;
              $rootScope.checkPermission();
              document.getElementById("login-form").className = "modal__upload hidden__div";
            } else {
              alert('Please Check your username and password');
            }
          });
        };
      }
    }
  }
]).
directive('contactOwnerform', ['Propertys', function(Propertys) {
  return {
    restrict: 'AEC',
    templateUrl: 'template/form/form_contact_owner.html',
    link: function($scope, elem, attributes, ngModel) {

      Propertys.query({
        _id: $scope.propertyId
      }, function(response) {
        $scope.contacts = response;
      });

    },

    scope: {
      propertyId: '@propertyId',
      modalIndex: '@modalIndex'
    },
    controller: function($scope, $cookies, Contactmail) {
      $scope.sendmail = function() {
        $scope.register = !$scope.register;
        Contactmail.post({
          contact: $scope.contact
        }, function(res) {
          if (res) {
            $scope.register = !$scope.register;
            alert('ระบบได้ทำการส่ง Email เรียบร้อยแล้ว');
            document.getElementById('close' + $scope.modalIndex).click();
          }
        });
      };
    }
  }
}]).
directive('contactOwnerformwindow', function() {
  return {
    restrict: 'AEC',
    link: function($scope, elem, attributes, ngModel) {
      elem.on('mousedown', function(event) {

      })
    },
    scope: {
      eventHandler: '&ngClick'
    },
    controller: function($scope, $cookies) {}
  }
});