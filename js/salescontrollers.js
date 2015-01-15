angular.module('world.salescontrollers', ['ngCookies', 'ngTouch', 'ngAnimate', 'ngSanitize']).
controller('MainController', ['$scope', '$rootScope',
  function($scope, $rootScope) {


  }
]).controller('Login', ['$scope', '$cookies', '$rootScope', '$location', '$route', '$window', 'Check', 'User',
  function($scope, $cookies, $rootScope, $location, $window, $route, Check, User) {
    $rootScope.permissionGlobal = -1;
    $rootScope.loading = false;
    $rootScope.checkPermission = function() {
      var checkuserstatus = 0;
      if ($cookies.Email !== '' && $cookies.Tel === "") {
        User.query({
          email: $cookies.Email
        }, function(res) {
          console.log("2034 controller.js")
          console.log(res)

          if (res.email) {
            $cookies.Name = res.name;
            $cookies.Email = res.email;
            $cookies.Permission = res.permission;
            $cookies.Hash = res.password;
            $cookies.UID = res._id;
            $cookies.Favoriteap = res.favoriteap;
            $cookies.Balance = res.balance;
          } else {

          }
          //try{
          if ($cookies.Name !== undefined) {
            $rootScope.username = $cookies.Name;
            $rootScope.permissionGlobal = $cookies.Permission;
            $location.replace();
          } else {
            $rootScope.user_logout = true;
            if ($location.path() === '/homes') {

            } else {
              if ($location.path() === '/info') {

              } else {
                if ($location.path() === '/result') {

                } else {

                }
              }
            }
          }
        });

      } else if ($cookies.Tel !== "" && $cookies.Email === "") {
        User.query({
          tel: $cookies.Tel
        }, function(res) {
          console.log("2074 controller.js")
          console.log(res)

          if (res.email) {
            $cookies.Name = res.name;
            $cookies.Email = res.email;
            $cookies.Permission = res.permission;
            $cookies.Hash = res.password;
            $cookies.UID = res._id;
            $cookies.Favoriteap = res.favoriteap;
            $cookies.Balance = res.balance;
          } else {

          }
          //try{
          if ($cookies.Name !== undefined) {
            $rootScope.username = $cookies.Name;
            $rootScope.permissionGlobal = $cookies.Permission;
            $location.replace();
          } else {
            $rootScope.user_logout = true;
            if ($location.path() === '/homes') {

            } else {
              if ($location.path() === '/info') {

              } else {
                if ($location.path() === '/result') {

                } else {

                }
              }
            }
          }
        });

      } else if ($cookies.Tel !== "" && $cookies.Email !== "") {
        User.query({
          tel: $cookies.Tel
        }, function(res) {
          console.log("2114 controller.js")
          console.log(res)

          if (res.email) {
            $cookies.Name = res.name;
            $cookies.Email = res.email;
            $cookies.Permission = res.permission;
            $cookies.Hash = res.password;
            $cookies.UID = res._id;
            $cookies.Favoriteap = res.favoriteap;
            $cookies.Balance = res.balance;
          } else {

          }
          //try{
          if ($cookies.Name !== undefined) {
            $rootScope.username = $cookies.Name;
            $rootScope.permissionGlobal = $cookies.Permission;
            $location.replace();
          } else {
            $rootScope.user_logout = true;
            if ($location.path() === '/homes') {

            } else {
              if ($location.path() === '/info') {

              } else {
                if ($location.path() === '/result') {

                } else {

                }
              }
            }
          }
        });

      } else {
        delete $cookies.UID;
        delete $cookies.Hash;
        delete $cookies.Name;
        delete $cookies.Permission;
        delete $cookies.Email;
        delete $cookies.Favoriteap;
        delete $cookies.Choosemenu;
        delete $cookies.Balance;
        $rootScope.permissionGlobal = -1;
        $location.path('/homes');
        $location.replace();

      }

    };

    if ($cookies && typeof($cookies) !== 'undefined') {
      try {
        var email = $cookies.Email;
        if (email !== undefined && typeof(email) !== 'undefined') {
          $rootScope.user_email = $cookies.Email;
        }
        if ($cookies.Permission == 0) {
          $rootScope.user_stat = "Standard User";
        } else if ($cookies.Permissio == 1) {
          $rootScope.user_stat = "Administrator";
        } else if ($cookies.Permission == 2) {
          $rootScope.user_stat = "VIP User";
        }
        if ($cookies.Name !== $cookies.Email) {
          $rootScope.user_name = $cookies.Name;
        } else {
          $rootScope.user_name = "ยังไม่ได้ทำการตั้งชื่อ";
        }
      } catch (e) {}
    }

    $scope.$on('$routeChangeSuccess', function() {
      if ($cookies.Permission === undefined) {
        if ($location.path() === "/controlpanel") {}
      } else {
        if ($location.path() === "/controlpanel") {}
      }
    });

    $rootScope.checkPermission();

    $rootScope.distance = function(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var radlon1 = Math.PI * lon1 / 180;
      var radlon2 = Math.PI * lon2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "M") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }

    $scope.logoutsend = function() {
      delete $cookies.UID;
      delete $cookies.Hash;
      delete $cookies.Name;
      delete $cookies.Permission;
      delete $cookies.Email;
      delete $cookies.Favoriteap;
      delete $cookies.Choosemenu;
      delete $cookies.Balance;
      delete $cookies.Tel;
      $rootScope.permissionGlobal = -1;
      $location.path('/homes');
      $location.replace();
    };

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
          $location.path('/homes');
          $location.replace();
        } else {
          alert('Please Check your username and password');
        }
      });
    };
  }
]).controller('memberCtrl', ['$scope', '$rootScope', '$window', '$cookies', '$route', '$location', 'Uploadprofilepic',
  'Filtermain', 'Member', 'CreateProperty', 'Paypal', 'Favoritboard', 'PasswordChange',
  'User', 'Info', 'Duplicate',
  function($scope, $rootScope, $window, $cookies, $route, $location, Uploadprofilepic,
    Filtermain, Member, CreateProperty, Paypal, Favoritboard, PasswordChange, User, Info, Duplicate) {

    $rootScope.heading;
    $rootScope.pitch;

    $scope.error_alert = function(title, msg) {

      $rootScope.closed = false;

      document.getElementById('error_containner').className = 'modal__upload';
      document.getElementById("errtitle").innerHTML = title;
      document.getElementById('errmessage').innerHTML = msg;

    }
    $rootScope.close_error_modal = function() {
      document.getElementById('error_containner').className = 'modal__upload hidden__div';
    }

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


    try {
      if ($cookies.Email !== undefined) {} else {
        if ($location.path() === '/homes') {

        } else {

        }

      }
    } catch (e) {
      console.log(e)
      if ($location.path() === '/homes') {

      } else {
        //   $location.path('/login_page');
        // $location.replace();
      }
    }
    $scope.duplicatestatus = false;
    $scope.ctrl = "index";
    $scope.noticficationCounter = 0;

    $scope.show_aprt = true;
    var pool = 0;
    $scope.up = {};
    $scope.profile_edit = true;
    $scope.profile_myprofile = false;
    $scope.preview_on_upgrade = false;
    $scope.cre_ads = false;
    $scope.show_customers = true;
    $scope.reset_pas = {};
    $scope.user = {};
    $scope.balance = $cookies.Balance;
    $scope.disObj = [];
    var markerarray = [];
    var infoarray = [];
    var image = 'image/icon/map_pin.png';
    $scope.distances = [];



    if ($rootScope.permissionGlobal == 5) {
      Filtermain.query({
        permission: $cookies.UID
      }, function(res) {
        $scope.list = res;
      });
    } else {
      Filtermain.query({
        all: $cookies.UID
      }, function(res) {
        $scope.list = res;
      });
    }
    if ($cookies.Tel === undefined && $cookies.Email === undefined) {

    } else if ($cookies.Tel !== '' && $cookies.Email === '') {
      User.query({
        tel: $cookies.Tel
      }, function(response) {
        if (response !== null) {
          $scope.user = response;
        }
      });
    } else if ($cookies.Tel === '' && $cookies.Email !== '') {
      User.query({
        email: $cookies.Email
      }, function(response) {
        if (response !== null) {
          $scope.user = response;
        }
      });
    } else {
      User.query({
        tel: $cookies.Tel
      }, function(response) {
        if (response !== null) {
          $scope.user = response;
        }
      });
    }


    var test = new FormData();


    $scope.$on('$routeChangeSuccess', function() {
      if ($location.path() === '/controlpanel') {
        try {
          $scope.ctrl = $cookies.Choosemenu;
          //$scope.resetpass.$valid = false ; 
        } catch (e) {
          $scope.ctrl = "index";
          console.log(e);
        }
      }
    });





    $scope.edit_apartment_detail = function(id) {
      Info.query({
        _id: id
      }, function(res) {
        $scope.add_aprt = 'add';

        $scope.up = res;
        console.log(res)
        $scope.isDuplicate();
        //$scope.up.zipcode =  parseInt($scope.up.zipcode);
        $scope.findzip();
        delete $cookies.lat;
        delete $cookies.lng;
        $scope.up.district = res.district;
        $rootScope.location = res.location;
        $rootScope.heading = res.heading;
        $rootScope.pitch = res.pitch;
        $scope.up.amphur = res.amphur;
        $scope.up.province = res.province;
        $scope.setzipcodeform($scope.up.district, $scope.up.amphur);
        //$scope.up.contact_mobile = parseInt($scope.up.contact_mobile);
        $scope.up.electric_bill = parseInt($scope.up.electric_bill);
        //$scope.up.contact_fax = parseInt($scope.up.contact_fax);
        //$scope.up.contact_tel = parseInt($scope.up.contact_tel);
        $scope.up.heading = parseInt($scope.up.heading);
        $scope.up.no_building = parseInt($scope.up.no_building);
        $scope.up.no_room = parseInt($scope.up.no_room);
        $scope.up.heading = parseInt($scope.up.heading);
        $scope.up.pitch = parseInt($scope.up.pitch);
        $scope.up.price_min = parseInt($scope.up.price_min);
        $scope.up.price_max = parseInt($scope.up.price_max);
        $scope.up.utility = parseInt($scope.up.utility);
        $scope.up.water_bill = parseInt($scope.up.water_bill);
        $scope.add_apart_init();
      });
    };

    $scope.isDuplicate = function() {
      Duplicate.query({
        namespace: $scope.up.namespace
      }, function(res) {
        try {
          if (res.data && res.data._id !== $scope.up._id.toString()) {
            $scope.register.namespace.$error.pattern = true;
            $scope.duplicatestatus = false;
          } else {
            $scope.duplicatestatus = true;
          }
        } catch (e) {
          console.log(e);
        }
      });
    };

    $scope.removeproperty = function(id) {
      if (confirm('Are you sure?')) {
        Info.kill({
          _id: id
        }, function(res) {

          Filtermain.query({
            all: $cookies.UID
          }, function(res) {
            $scope.list = res;
            //$rootScope.setCC("manage");
          });
        });
      };
    };


    $scope.displaypreview = function(evt) {
      test = new FormData();
      console.log('----------------')
      document.getElementById('displaypreviews').innerHTML = "";
      for (var i = 0, f; f = evt.files[i]; i++) {
        if (!f.type.match('image.*')) {
          $scope.error_alert("อัพโหลดผิดพลาด", "นามสกุลไฟล์ไม่ถูกนะ");
          continue;
        }

        if (evt.files[0].size / 1000 < 250) {
          console.log(evt.files[0].name.split('.').pop().toLowerCase());
          if (evt.files[0].name.split('.').pop().toLowerCase() === "jpg" || evt.files[0].name.split('.').pop().toLowerCase() === "jpeg" || evt.files[0].name.split('.').pop().toLowerCase() === "png" || evt.files[0].name.split('.').pop().toLowerCase() === "gif") {
            test.append("profilepic", evt.files[i]);
            test.append('user_id', $cookies.UID);
            var reader = new FileReader();
            reader.onload = (function(theFile) {
              return function(e) {

                document.getElementById('displaypreviews').src = e.target.result;
                var xhr = new XMLHttpRequest();
                xhr.upload.onprogress = function(e) {
                  document.getElementById("process_bar_containner").className = 'modal__upload';
                  var percentComplete = (e.loaded / e.total) * 100;
                  document.getElementById('process_bar').style.width = percentComplete + "%";
                  console.log(percentComplete)
                };

                xhr.onload = function() {
                  if (xhr.status == 200) {
                    document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                  } else {
                    alert("Error! Upload failed");
                  }
                };
                xhr.onerror = function() {
                  alert("Error! Upload failed. Can not connect to server.");
                };
                xhr.open("POST", "/uploadprofilepic");
                xhr.send(test)
                  //console.log(e.target.result);

              };
            })(f);
            reader.readAsDataURL(f);
          } else {
            $scope.error_alert("อัพโหลดผิดพลาด", "นามสกุลไฟล์ไม่ถูกนะ : " + evt.files[0].name);

          }

        } else {
          $scope.error_alert("อัพโหลดผิดพลาด", "ไฟล์ขนาดเกิน 250kb นะ ดูสิ  " + evt.files[0].name + ":" + evt.files[0].size / 1000 + "KB");

        }

      }
    }


    $scope.previewdraganddrop = function(evt) {
      document.getElementById('Previewzone').innerHTML = "";
      for (var i = 0, f; f = evt.files[i]; i++) {
        if (!f.type.match('image.*')) {

          continue;
        }
        test.append("photogal", evt.files[i]);
        var reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            var img = new Image(200, 0);
            img.src = e.target.result;


            document.getElementById('Previewzone').appendChild(img);
            //console.log(e.target.result);

          };
        })(f);
        reader.readAsDataURL(f);
      }
    }

    $scope.add_apart_init = function() {
      var test = $window.setInterval(function() {
        if ($scope.map) {

        } else {

          $rootScope.$broadcast('capstreetMap', true);
        }

        clearTimeout(test);
      }, 700);
    };

    $scope.initNMAP = function() {
      $rootScope.$broadcast('mapReady', true);
    };
    $scope.initPMAP = function() {
      $rootScope.$broadcast('capstreetMap', true);
    };

    $scope.$on('capstreetMap', function(event) {
      $scope.distances = [];
      var mapOptions = {
        zoom: 16,
        scrollwheel: false,
        disableDoubleClickZoom: true
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos;
          if ($rootScope.location) {
            pos = new google.maps.LatLng($rootScope.location[1], $rootScope.location[0]);
          } else if ($cookies.lat === undefined) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $rootScope.location = [];
            $rootScope.location[0] = position.coords.longitude;
            $rootScope.location[1] = position.coords.latitude;
          } else {
            pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
          }
          var panoramaOptions;
          console.log($rootScope.heading);
          console.log($rootScope.pitch);
          if ($rootScope.heading !== undefined) {

            panoramaOptions = {
              position: pos,
              pov: {
                heading: parseInt($rootScope.heading),
                pitch: parseInt($rootScope.pitch),
              },
              scrollwheel: false,
              zoom: 1
            };
          } else {
            panoramaOptions = {
              position: pos,
              pov: {
                heading: 270,
                pitch: 0,
              },
              scrollwheel: false,
              zoom: 1
            };
          }


          $scope.map = new google.maps.StreetViewPanorama(document.getElementById('map-canvas'), panoramaOptions);
          $scope.map.setVisible(true);
          google.maps.event.addListener($scope.map, 'pov_changed', function() {
            $scope.up.heading = parseInt($scope.map.getPov().heading);
            $scope.up.pitch = parseInt($scope.map.getPov().pitch);
            $rootScope.heading = parseInt($scope.map.getPov().heading);
            $rootScope.pitch = parseInt($scope.map.getPov().pitch);
            console.log($scope.up.heading + "      :      " + $scope.up.pitch)

          });
          if ($cookies.lat == null) {} else {

          }
        }, function() {
          $scope.handleNoGeolocation(true);
        });
      } else {
        $scope.handleNoGeolocation(false);
      }
    });

    $scope.add_customers = function() {
      $scope.show_customers = false;
    };
    try {
      document.getElementById("overlay").style.visibility = "hidden";
    } catch (e) {

    } finally {
      $scope.profile_myprofile = false;
      $scope.profile_upgrade = true;
    }

    $scope.send_mail = function() {
      $scope.reset_pas.email = $cookies.Email;
      PasswordChange.post({
        reset: $scope.reset_pas
      }, function(response) {
        console.log(response);
        if (response[0] == 0) {
          alert("password ถูกเปลี่ยนเรียบร้อยแล้ว");
        } else {
          alert("เกิดข้อผิดพลาดกรุณาลองใหม่ภายหลัง")
        }

      });
    };

    $scope.add_aprt = function() {
      $scope.show_aprt = false;
      $rootScope.$broadcast('mapReady', true);
    };

    $scope.back_page_aprt = function() {
      $scope.show_aprt = true;
      $route.reload();
    };

    $scope.resend = function() {
      try {
        document.getElementById("overlay").style.visibility = "visible";
      } catch (e) {
        console.log(e);
      } finally {
        pool++;
        $rootScope.loading = true;
        if (pool == 1) {
          Member.query({
            email: $cookies.Email,
            hash: $cookies.Hash
          }, function(res) {
            if (res[0] == 1) {
              try {
                document.getElementById("overlay").style.visibility = "hidden";
              } catch (e) {} finally {
                $rootScope.loading = false;
                pool--;
                alert("กรุณายืนยันผู้ใช้ทาง Email \nหากยังไม่ได้รับ Email ยืนยัน \nกรุณาตรวจสอบในถังขยะ(junk mail)");
              }
            } else {
              try {
                document.getElementById("overlay").style.visibility = "hidden";
              } catch (e) {} finally {
                pool--;
                alert("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
              }
            }
          });
        }
      }
    };

    $scope.show_profile = function(scope) {
      $scope.profile_myprofile = false;
      $scope.profile_upgrade = true;
      $scope.profile_edit = true;
    };

    $scope.show_upgrade = function(scope) {
      $scope.initlist = new Array();
      $rootScope.$broadcast('mapReady', true);
      if ($cookies.Permission == 0) {
        alert("กรุณายืนยันผู้ใช้ทาง Email ก่อนใช้งาน\nหากยังไม่ได้รับ Email ยืนยัน \nกรุณาตรวจสอบในถังขยะ(junk mail) \nหรือกด re active เพื่อนทำการส่ง Email ยืนยันใหม่")
      } else {

      }
    };

    $scope.show_edit_profile = function() {
      $scope.profile_edit = false;
      $scope.profile_myprofile = true;
    };

    $scope.update = function(text, data) {
      var rawdata = {};
      var prop = text;
      rawdata.element = {};
      rawdata.element[prop] = data;
      rawdata._id = $cookies.UID;
      Member.post({
        text: rawdata
      }, function(response) {
        if (response[0] == 1) {
          if (prop === "name") {
            delete $cookies.Name;
            $cookies.Name = data;
            $rootScope.user_name = $cookies.Name;
            $window.location.reload();
          }

        }
      });
    };

    $scope.back_page = function() {
      $scope.profile_edit = true;
      $scope.profile_myprofile = false;
      $scope.cre_ads = false;
      $route.reload();
    };



    $scope.logopreview = function(evt) {
      var file = evt;
      try {
        for (var i = 0, f; f = file.files[i]; i++) {
          if (!f.type.match('image.*')) {
            alert("นามสกุลไฟล์ไม่ถูกนะ : " + evt.files[0].name);
            continue;
          }
          test.append("logo", evt.files[i]);
          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {
              try {
                document.getElementById('adspv').style.backgroundImage = "url('" + e.target.result + "')";
              } catch (e) {}
              try {
                document.getElementById('logopreviewoncreateapartment').src = e.target.result;
                document.getElementById('logopreviewoncreateapartment2').src = e.target.result;
              } catch (e) {}
            };
          })(f);
          reader.readAsDataURL(f);
        }
      } catch (e) {}
    };

    $scope.headerpreview = function(evt) {
      var file = evt;
      for (var i = 0, f; f = file.files[i]; i++) {
        if (!f.type.match('image.*')) {
          alert("นามสกุลไฟล์ไม่ถูกนะ : " + evt.files[0].name);
          continue;
        }
        test.append("header", evt.files[i]);
        var reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            document.getElementById('headerpreviewoncreateapartment').style.backgroundImage = "url('" + e.target.result + "')";
            document.getElementById('headerpreviewoncreateapartment2').src = e.target.result;
          };
        })(f);
        reader.readAsDataURL(f);
      }
    };

    $scope.upgrade = function() {
      // Mongo kept longitude, latitude format.
      $scope.up.location = [$rootScope.location[0], $rootScope.location[1]];

      $scope.up.user_id = $cookies.UID;
      console.log($scope.up.heading + "    :    " + $scope.up.pitch);
      console.log($rootScope.heading + "    :    " + $rootScope.pitch);
      CreateProperty.post({
        property: $scope.up
      }, function(response) {
        $scope.statUp = response;
        if (response._id !== undefined && test) {
          try {
            test.append('user_id', $cookies.UID);
            test.append("id", response._id);
            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function(e) {
              document.getElementById("process_bar_containner").className = 'modal__upload';
              var percentComplete = (e.loaded / e.total) * 100;
              document.getElementById('process_bar').style.width = percentComplete + "%";
              if (percentComplete == 100) {
                document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                $scope.add_aprt = "show";
              }
              console.log(percentComplete)
            };

            xhr.onload = function() {
              if (xhr.status == 200) {
                document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
              } else {
                document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                alert("Error! Upload failed");
              }
            };
            xhr.onerror = function() {
              alert("Error! Upload failed. Can not connect to server.");
            };
            xhr.open("POST", "/uploadpic");
            xhr.send(test)
          } catch (e) {

          } finally {
            $scope.up = {};
            $rootScope.setCC("manage");
          }
          Filtermain.query({
            all: $cookies.UID
          }, function(res) {
            $scope.list = res;
          });
        } else {
          $rootScope.setCC("manage");
        }
      });
    };

    $window.initMap = function() {
      $scope.initlist = new Array();
    };


    $scope.nearbysearch = function() {
      var typearray = [];
      $scope.disObj = [];

      angular.forEach($scope.choose, function(type) {
        if (type != false) {
          typearray.push(type);
        }
      });

      var pos = new google.maps.LatLng($scope.map.center.lat(), $scope.map.center.lng());
      var request = {
        location: pos,
        radius: $scope.chooses.radius * 1000,
        types: typearray
      };
      $scope.service = new google.maps.places.PlacesService($scope.map);
      $scope.service.nearbySearch(request, function(results, status) {
        $scope.nearbyPlaces = results;
        typearray = [];
        for (var i = $scope.nearbyPlaces.length - 1; i >= 0; i--) {
          $scope.disObj.push($rootScope.distance($scope.nearbyPlaces[i].geometry.location.k, $scope.nearbyPlaces[i].geometry.location.B, $scope.map.center.lat(), $scope.map.center.lng(), ''));
        };
        $scope.$apply();
      });
    };

    $scope.condos = [];
    $scope.$on('mapReady', function(event) {
      try {
        var mapOptions = {
          zoom: 14,
          scrollwheel: false,
          disableDoubleClickZoom: true
        };
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos;
            if ($rootScope.location) {
              pos = new google.maps.LatLng($rootScope.location[1], $rootScope.location[0]);
            } else if ($cookies.lat === undefined) {
              pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            } else {
              pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
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
              $rootScope.location = [];
              $rootScope.location[1] = $scope.map.center.lat();
              $rootScope.location[0] = $scope.map.center.lng();
              $scope.marker.setPosition(latlng);
            });
            google.maps.event.addListener($scope.marker, 'dragend', function(evt) {
              for (var i = 0; i < markerarray.length; i++) {
                markerarray[i].setMap(null);
              }
              $cookies.lat = evt.latLng.lat();
              $cookies.lng = evt.latLng.lng();
              $rootScope.location[1] = evt.latLng.lat();
              $rootScope.location[0] = evt.latLng.lng();
              var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
              $scope.map.setCenter(pos);
            });
            $scope.marker.setMap($scope.map);
            $scope.map.setCenter(pos);
            if ($cookies.lat == null) {} else {}
          }, function() {
            $scope.handleNoGeolocation(true);
          });
        } else {
          $scope.handleNoGeolocation(false);
        }
      } catch (e) {

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
]);