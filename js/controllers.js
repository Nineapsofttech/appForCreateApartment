'use strict';

/* Controllers */

angular.module('world.controllers', ['ngCookies', 'angular-carousel', 'ngTouch', "xeditable", 'textAngular', 'pickadate', 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap', 'checklist-model']).
controller('MainController', ['$scope', '$rootScope',
  function($scope, $rootScope) {


  }
]).
controller('paypalSuccess', ['$scope', 'socket', '$filter', '$routeParams',
  function($scope, socket, $filter, $routeParams) {
    $scope.payer = $routeParams.payer;
    $scope.packages = $routeParams.transactions;
    $scope.amount = $routeParams.amount;
    $scope.state = $routeParams.status;


  }
]).
controller('reporttrackerCtrl', ['$scope', 'socket', '$filter', '$routeParams', 'salelist',
  function($scope, socket, $filter, $routeParams, salelist) {
    $scope.search = function() {

      salelist.get({
        from: new Date($scope.check1).getTime(),
        to: new Date($scope.check2).getTime()
      }, function(result) {
        $scope.salelist = result;
        console.log(result);
      });
    }

  }
]).
controller('Adsmanage', ['$scope', '$rootScope', '$window', '$cookies', '$route', '$routeParams', '$location', 'Adsservice', 'Adscreation', 'socket', 'Adsstatus',
  function($scope, $rootScope, $window, $cookies, $route, $routeParams, $location, Adsservice, Adscreation, socket, Adsstatus) {
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
    }
  }
]).
controller('Testunit', ['$scope', 'socket', 'Permission', 'Userlist', '$filter',
  function($scope, socket, Permission, Userlist, $filter) {

    $scope.perobj = {};
    $scope.user = {};
    $scope.newpermission = {};

    Permission.query({
      permission: {}
    }, function(response) {
      if (response) {
        $scope.perobj = response;
      }

    });
    Userlist.query({}, function(response) {
      if (response) {
        $scope.user = response;
      }
    });
    $scope.addPermission = function(data) {
      $scope.inserted = {
        detail: ''

      };
      $scope.perobj.push($scope.inserted);

    };
    $scope.savePermission = function(data, rawdata) {
      data.detail = rawdata;
      if (data.id === undefined) {
        Permission.post({
          permis: data
        }, function() {

        });
      } else {

        Permission.post({
          permis: data
        }, function() {

        });
      }
    };
    $scope.showStatus = function(user) {
      var selected = [];

      if (user.permission) {
        selected = $filter('filter')($scope.perobj, {
          permission: user.permission
        });
      }
      return selected.length ? selected[0].detail : 'Standard User';
    };
    $scope.loadGroups = function() {
      return $scope.perobj.length ? null : Permission.query({
        permission: {}
      }, function(response) {
        if (response) {
          $scope.perobj = response;
        }

      });
    };

    $scope.saveUser = function(data, id) {
      data._id = id;
      Permission.post({
        permis: data
      }, function() {});
    };
    $scope.removeUser = function(index) {
      $scope.user.splice(index, 1);
    };
  }
]).
controller('ChatController', ['$scope', 'socket',
  function($scope, socket) {
    socket.emit('hello', 'hello world!');
  }
]).
controller('CreateBuildingCtrl', ['$scope', '$routeParams', 'Building',
  function($scope, $routeParams, Building) {
    $scope.building = {};
    $scope.lists = Building.query(function(response) {});
    $scope.create = function() {
      Building.post({
        building: $scope.building
      }, function(response) {});
    };
  }
]).
controller('templateCtrl', ['$window', '$rootScope',
  function($window, $rootScope) {

  }
]).controller('commentCtrl', ['$window', '$rootScope', '$scope', '$location', '$cookies', '$routeParams', 'Board', 'socket',
  function($window, $rootScope, $scope, $location, $cookies, $routeParams, Board, socket) {
    $scope.error_alert = function(title, msg) {

      $rootScope.closed = false;

      document.getElementById('error_containner').className = 'modal__upload';
      document.getElementById("errtitle").innerHTML = title;
      document.getElementById('errmessage').innerHTML = msg;

    }

    $scope.firstime = -1;
    $scope.feedback = {};
    $scope.comment = {};
    $scope.detail_comment = {};
    var temppath = $location.path();
    Board.feed({
      board_id: $routeParams._id
    }, function(response) {
      $scope.detail_comment = response.comment;
      $scope.title = response.board[0].title;
      $scope.detail = response.board[0].detail;
      console.log(response)
      $window.prerenderReady = true;
    });
    //$scope.path = temppath;
    $scope.current_comment = 1;
    console.log($routeParams)
      //$scope.title = $routeParams.title;
      //$scope.detail = $routeParams.detail;
    $scope._id = $routeParams._id;


    $scope.reloadpage = function() {
      $window.location.reload();
    };

    $scope.post_feedback_send = function() {
      console.log($scope.feedback);
      $scope.feedback.user_id = $cookiesUID;
      $scope.feedback.category = "feedback";
      if ($scope.feedback.user_id === undefined) {
        alert("กรุณา Login ก่อนครับ");
      } else {
        Board.create({
          feedback: $scope.feedback
        }, function(response) {
          alert(response.status);
          socket.emit('Boardupdate', $cookies.UID);
        });
      }

    };






    $scope.feedclose = function(index) {
      var element = document.getElementById("feedbackcommentbox" + index);
      var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
      var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
      $window.scrollTo(xPosition, yPosition - 150);
      element.focus();
      element.style.height = "50px";
      $scope.current_comment = -1;
    };

    $scope.post_comment_send = function(id, index) {
      console.log("post");
      $scope.comment.board_id = $scope._id;
      $scope.comment.user_id = $cookies.UID;
      $scope.comment.category = "feedback";
      Board.comment({
        comments: $scope.comment
      }, function(replies) {
        Board.feed({
          board_id: $routeParams._id
        }, function(response) {
          $scope.detail_comment = response;
          console.log(response)
          document.getElementById("commentbox").value = "";
        });
      });

    }
  }
]).
controller('feedbackCtrl', ['$window', '$rootScope', '$scope', '$location', '$cookies', 'Board', 'socket',
  function($window, $rootScope, $scope, $location, $cookies, Board, socket) {
    $scope.error_alert = function(title, msg) {

      $rootScope.closed = false;

      document.getElementById('error_containner').className = 'modal__upload';
      document.getElementById("errtitle").innerHTML = title;
      document.getElementById('errmessage').innerHTML = msg;

    }
    $scope.firstime = -1;
    $scope.feedback = {};
    $scope.comment = {};
    $scope.detail_comment = {};
    var temppath = $location.path();
    Board.feed({
      feedback_feed: "feedback"
    }, function(response) {
      $scope.feedbackfeed = response.data;
    });
    $scope.path = temppath;
    $scope.current_comment = 1;


    $scope.reloadpage = function() {
      $window.location.reload();
    };

    $scope.post_feedback_send = function() {
      console.log($scope.feedback);
      $scope.feedback.user_id = $cookies.UID;
      $scope.feedback.category = "feedback";
      if ($scope.feedback.user_id === undefined) {
        alert("กรุณา Login ก่อนครับ");
      } else {
        Board.create({
          feedback: $scope.feedback
        }, function(response) {
          alert(response.status);
          socket.emit('Boardupdate', $cookies.UID);
        });
      }

    };

    $scope.feedcomment = function(id, index) {
      console.log('---------------------');
      console.log(index)
      console.log(id)
      $scope.container = document.getElementsByClassName('feedback--comment--container');

      $scope.detail_comment = Board.feed({
        comment_feed: "1",
        board_id: id
      }, function(response) {
        var element;
        if (index !== undefined) {
          $scope.current_comment = index;
          element = document.getElementById("feedbackcommentbox" + $scope.current_comment);
        } else {
          element = document.getElementById("feedbackcommentbox" + $scope.current_comment);
        }


        console.log(element)
        if ($cookies.UID === undefined) {
          element.style.display = 'none';
          if ($scope.firstime) {
            $scope.error_alert('เอ๊ะคันไม้คันมือแล้วสิ', "ถ้าหากอยาก Comment <a onclick='document.getElementById(\"close_modal\").click();document.getElementById(\"login-form\").className=\"modal__upload\"'" +
              " >Login ก่อนนะ </a>ถ้ายังไม่มีสมาชิก  <a onclick='document.getElementById(\"close_modal\").click();' href='/#!/register'>สมัครที่นี่เลย</a>");
            $scope.firstime = 0;
          } else {

          }


        } else {
          element.style.display = '';
          var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
          var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
          $window.scrollTo(xPosition, yPosition - 150);
          element.focus();
          element.style.height = "300px";


        }
      });
    };

    $scope.feedclose = function(index) {
      var element = document.getElementById("feedbackcommentbox" + index);
      var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
      var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
      $window.scrollTo(xPosition, yPosition - 150);
      element.focus();
      element.style.height = "50px";
      $scope.current_comment = -1;
    };

    $scope.post_comment_send = function(id, index) {

      $scope.comment.board_id = id;
      $scope.comment.user_id = $cookies.UID;
      $scope.comment.category = "feedback";
      Board.comment({
        comments: $scope.comment
      }, function(replies) {
        $scope.feedcomment($scope.comment.board_id);
      });

    }
  }
]).
controller('webboardCtrl', ['$window', '$rootScope', '$scope', '$location', '$cookies', '$route', 'Board',
  function($window, $rootScope, $scope, $location, $cookies, $route, Board) {}
]).
controller('boardCtrl', ['$window', '$rootScope', '$scope', '$location', '$cookies', 'Board', 'socket',
  function($window, $rootScope, $scope, $location, $cookies, Board, socket) {
    $scope.feedback = {};
    $scope.comment = {};
    $scope.detail_comment = {};
    $scope.select_board = '/webboard';
    Board.feed({
      feedback_feed: "board"
    }, function(res) {
      $scope.boardfeed = res.data;
    });

    $scope.reloadpage = function() {
      $window.location.reload();
    };

    $scope.post_feedback_send = function() {
      $scope.feedback.user_id = $cookies.UID;
      $scope.feedback.category = "board";
      if ($scope.feedback.user_id === undefined) {
        alert("กรุณา Login ก่อนครับ");
      } else {
        Board.create({
          feedback: $scope.feedback
        }, function(response) {
          alert(response.status);
          $scope.feedback = "";
          socket.emit('Boardupdate', $cookies.UID);
        });
      }
    };

    $scope.feedcomment = function(id, index) {
      $scope.detail_comment = Board.feed({
        comment_feed: 1,
        board_id: id
      }, function(response) {
        var element = document.getElementById("commentbox" + index);
        var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
        var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
        $window.scrollTo(xPosition, yPosition - 150);
        element.focus();
        element.style.height = "300px";
      });
    };

    $scope.feedclose = function(index) {
      var element = document.getElementById("commentbox" + index);
      var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
      var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
      $window.scrollTo(xPosition, yPosition - 150);
      element.focus();
      element.style.height = "50px";
    };

    $scope.post_comment_send = function(id) {
      if ($cookies.UID === undefined) {
        alert("กรุณา Login ก่อนครับ");
      } else {
        $scope.comment.board_id = id;
        $scope.comment.user_id = $cookies.UID;
        $scope.comment.category = "feedback";
        Board.comment({
          comments: $scope.comment
        }, function(replies) {
          $scope.feedcomment($scope.comment.board_id);
        });
      }
    }
  }
]).
controller('boardadsCtrl', ['$window', '$rootScope', '$scope', '$location', '$cookies', 'Board', 'socket',
    function($window, $rootScope, $scope, $location, $cookies, Board, socket) {
      $scope.feedback = {};
      $scope.comment = {};
      $scope.detail_comment = {};
      var temppath = $location.path();
      $scope.adsfeed = Board.feed({
        feedback_feed: "ads"
      });
      $scope.path = temppath;

      socket.on('BoardUpdated', function(data) {
        console.log(data)
        if (data === $cookies.UID) {
          $window.location.reload();
        }
      });

      $scope.reloadpage = function() {
        $window.location.reload();
      };

      $scope.post_feedback_send = function() {
        $scope.feedback.user_id = $cookies.UID;
        $scope.feedback.category = "ads";
        if ($scope.feedback.user_id === undefined) {
          alert("กรุณา Login ก่อนครับ");
        } else {
          Board.create({
            feedback: $scope.feedback
          }, function(response) {
            alert(response.status);
            socket.emit('Boardupdate', $cookies.UID);
          });
        }

      };

      $scope.feedcomment = function(id, index) {
        $scope.detail_comment = Board.feed({
          comment_feed: "1",
          board_id: id
        }, function(response) {
          var element = document.getElementById("commentbox" + index);
          console.log(element)
          var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
          var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
          $window.scrollTo(xPosition, yPosition - 150);
          element.focus();
          element.style.height = "300px";
        });
      };

      $scope.feedclose = function(index) {
        var element = document.getElementById("commentbox" + index);
        var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
        var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
        $window.scrollTo(xPosition, yPosition - 150);
        element.focus();
        element.style.height = "50px";
      };

      $scope.post_comment_send = function(id) {
        if ($cookies.UID === undefined) {
          alert("กรุณา Login ก่อนครับ");
        } else {
          $scope.comment.board_id = id;
          $scope.comment.user_id = $cookies.UID;
          $scope.comment.category = "feedback";
          Board.comment({
            comments: $scope.comment
          }, function(replies) {
            $scope.feedcomment($scope.comment.board_id);
          });
        }
      }
    }
  ])
  .controller('boardfaqCtrl', ['$window', '$rootScope', '$scope', '$location', '$cookies', 'Board', 'socket',
    function($window, $rootScope, $scope, $location, $cookies, Board, socket) {
      $scope.feedback = {};
      $scope.comment = {};
      $scope.detail_comment = {};
      var temppath = $location.path();
      $scope.faqfeed = Board.feed({
        feedback_feed: "faq"
      });
      $scope.path = temppath;

      $scope.reloadpage = function() {
        $window.location.reload();
      };

      $scope.post_feedback_send = function() {
        console.log($scope.feedback);
        $scope.feedback.user_id = $cookies.UID;
        $scope.feedback.category = "faq";
        if ($scope.feedback.user_id === undefined) {
          alert("กรุณา Login ก่อนครับ");
        } else {
          Board.create({
            feedback: $scope.feedback
          }, function(response) {
            alert(response.status);
            socket.emit('Boardupdate', $cookies.UID);

          });
        }
      };

      $scope.feedcomment = function(id, index) {
        $scope.detail_comment = Board.feed({
          comment_feed: "1",
          board_id: id
        }, function(response) {
          var element = document.getElementById("commentbox" + index);
          console.log(element)
          console.log(index)
          console.log(id)
          var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
          var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
          $window.scrollTo(xPosition, yPosition - 150);
          element.focus();
          element.style.height = "300px";
        });
      };

      $scope.feedclose = function(index) {
        var element = document.getElementById("commentbox" + index);
        var xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
        var yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
        $window.scrollTo(xPosition, yPosition - 150);
        element.focus();
        element.style.height = "50px";
      };

      $scope.post_comment_send = function(id) {
        if ($cookies.UID === undefined) {
          alert("กรุณา Login ก่อนครับ");
        } else {
          $scope.comment.board_id = id;
          $scope.comment.user_id = $cookies.UID;
          $scope.comment.category = "feedback";
          Board.comment({
            comments: $scope.comment
          }, function(replies) {

            $scope.feedcomment($scope.comment.board_id);
          });
        }
      }
    }
  ])
  .controller('loginCtrl', ['$window', '$rootScope',
    function($window, $rootScope) {

    }
  ])
  .controller('memberCtrl', ['$scope', '$rootScope', '$window', '$cookies', '$route', '$routeParams', '$location', 'Uploadprofilepic',
    'Filtermain', 'Member', 'CreateProperty', 'Notificationowner', 'Paypal', 'Userpayment', 'Favoritboard', 'PasswordChange',
    'User', 'socket', 'Myads', 'Info', 'Duplicate',
    function($scope, $rootScope, $window, $cookies, $route, $routeParams, $location, Uploadprofilepic,
      Filtermain, Member, CreateProperty, Notificationowner, Paypal, Userpayment, Favoritboard, PasswordChange, User,
      socket, Myads, Info, Duplicate) {

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
      $scope.favoritboard = Favoritboard.get({});
      $scope.notificationowner = Notificationowner.get({});
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

      Myads.query({
        id: $cookies.UID
      }, function(results) {
        $scope.adslist = results;
      });

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

      Userpayment.query({
        user_id: $cookies.UID
      }, function(response) {
        $scope.userpayment = response;
      });

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

      socket.on('Adsclicked', function(data) {
        var test = $window.setInterval(function() {
          Myads.query({
            id: $cookies.UID
          }, function(results) {
            $scope.adslist = results;
          });
          clearTimeout(test);
        }, 1500)
      });

      socket.on('Notice', function(data) {
        if (data === "admin") {
          var test = $window.setInterval(function() {
            if ($cookies.Permission == 5) {
              Notificationowner.get({
                owner_id: "admin"
              }, function(response) {
                $scope.noticficationCounter = response.notice;
              });
            } else {
              Notificationowner.get({
                owner_id: $cookies.UID
              }, function(response) {
                $scope.noticficationCounter = response.notice;
              });
            }
            clearTimeout(test);
          }, 1000)
        } else {
          if (data === $cookies.UID) {}
        }
      });

      $scope.changePassword = function() {
        if ($cookies.Email !== '' && $cookies.Tel !== '') {

          $scope.reset_pas.key = $cookies.Email;
          PasswordChange.post({
            reset: $scope.reset_pas
          }, function(response) {
            console.log(response);
            if (response.status === '1') {
              $scope.error_alert("เย้", "Password ถูกเปลี่ยนเรียบร้อยแล้ว<br>");
            } else {
              $scope.error_alert("แย่จัง", "ไม่สามารถเปลี่ยน Password ได้ Password เดิมที่ให้มาถูกหรือเปล่า?<br>");
            }
          });
        } else if ($cookies.Email === '' && $cookies.Tel !== '') {
          $scope.reset_pas.key = $cookies.Tel;
          PasswordChange.post({
            reset: $scope.reset_pas
          }, function(response) {
            if (response.status === '1') {
              $scope.error_alert("เย้", "Password ถูกเปลี่ยนเรียบร้อยแล้ว<br>");
            } else {
              $scope.error_alert("แย่จัง", "ไม่สามารถเปลี่ยน Password ได้ Password เดิมที่ให้มาถูกหรือเปล่า?<br>");
            }
          });
        } else if ($cookies.Email !== '' && $cookies.Tel === '') {
          $scope.reset_pas.key = $cookies.Email;
          PasswordChange.post({
            reset: $scope.reset_pas
          }, function(response) {
            if (response.status === '1') {
              $scope.error_alert("เย้", "Password ถูกเปลี่ยนเรียบร้อยแล้ว<br>");
            } else {
              $scope.error_alert("แย่จัง", "ไม่สามารถเปลี่ยน Password ได้ Password เดิมที่ให้มาถูกหรือเปล่า?<br>");
            }
          });
        } else {

        }

      };

      $scope.save_notification = function() {
        $scope.txt = {};
        $scope.txt._id = $cookies.UID;
        if ($scope.choose !== undefined) {
          $scope.txt.element = $scope.choose;
          Member.post({
            text: $scope.txt
          }, function(res) {
            if (res) {
              alert("บันทึกข้อมูลสำเร็จ");
              $rootScope.checkPermission();
            }
          });
        }
      };

      $scope.paymenttransaction = function(price) {
        $window.open('/paypal?price=' + price + "&user_id=" + $cookies.UID, "_blank");
      };

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

      if ($routeParams.id !== undefined) {
        $scope.edit_apartment_detail($routeParams.id);
      }

      $scope.isDuplicate = function() {
        Duplicate.query({
          namespace: $scope.up.namespace
        }, function(res) {
          if (res.status) {
            $scope.duplicatestatus = false;
          } else {
           try {
              if (res.data && res.data._id !== $scope.up._id.toString()) {
                $scope.register.namespace.$error.pattern = true;
                $scope.duplicatestatus = true;
              } else {
                $scope.duplicatestatus = false;
              }
            } catch (e) {
              $scope.duplicatestatus = true;
              console.log($scope.duplicatestatus);
              console.log(e);
            }
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

      $rootScope.setCC = function(value) {
        $cookies.Choosemenu = value;
        $rootScope.ctrl = value;
        $location.path("/controlpanel");
        $location.replace();
        $route.reload();
      };

      $rootScope.setCC = function(value, id) {
        console.log("----------------")
        $rootScope.ctrl = value;
        $location.search('_id', id);
        if (value === "ads") {
          var test = $window.setInterval(function() {
            Myads.query({
              id: $cookies.UID
            }, function(results) {
              $scope.adslist = results;
            });
            clearTimeout(test);
          }, 1000);
        };
        if ($cookies.Choosemenu !== value) {
          $cookies.Choosemenu = value;
          $location.path("/controlpanel");
          $location.replace();
          $route.reload();
        } else {

        }

      }

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
            socket.emit('PropertyUpdate', rawdata);
          }
        });
      };

      $scope.back_page = function() {
        $scope.profile_edit = true;
        $scope.profile_myprofile = false;
        $scope.cre_ads = false;
        $route.reload();
      };

      $scope.add_ads = function() {
        $scope.cre_ads = true;
        var timepoll = $window.setInterval(function() {
          if ($scope.map) {} else {
            $rootScope.$broadcast('adsmapReady', true);
          }
          clearTimeout(timepoll);
        }, 2000)
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
        //$scope.up.location = [$rootScope.location[0], $rootScope.location[1]];

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
                $scope.up.location = [];
                $scope.up.location[1] = $scope.map.center.lat();
                $scope.up.location[0] = $scope.map.center.lng();
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
                $scope.up.location = [];
                $rootScope.location = [];
                $scope.up.location[1] = evt.latLng.lat();
                $scope.up.location[0] = evt.latLng.lng();
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
  ])
  .controller('infoCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$sce', '$route', '$cookies', 'Info', 'CustomerPropertyOwner', 'Property',
    function($rootScope, $scope, $routeParams, $window, $sce, $route, $cookies, Info, CustomerPropertyOwner, Property) {
      $scope.$on('$routeChangeSuccess', function() {
        $scope.initlist = new Array();
        document.getElementById('map-canvas').innerHTML = "";
        for (var i = 15000; i >= 0; i--) {
          if (i == 0) {
            var propertyId;
            propertyId = $routeParams._id;
            Info.query({
              _id: propertyId
            }, function(res) {
              $scope.property = res;
              $scope.property.detail = $sce.trustAsHtml(res.detail);
              $scope.property.about = $sce.trustAsHtml(res.about);
              $scope.property.room_detail = $sce.trustAsHtml(res.room_detail);
              console.log(res);
              Property.query({
                location: $scope.property.location
              }, function(res) {
                $scope.nearby = res;
                console.log("nearby");
                console.log($scope.nearby);
              });
              $rootScope.$broadcast('StreatviewReady', true);
            });

          }
        };
      });
      var typearray = [];
      $scope.currentIndex = 0;
      $scope._Index = 0;

      $scope.addType = function() {
        typearray = [];
        var index = 0;
        angular.forEach($scope.choose, function(type) {
          index++;
          if (type === false) {

          } else {
            typearray.push(type);
          }


        });
        $rootScope.$broadcast('infoMapReady', true);
      };


      $scope.setCurrentSlideIndex = function(index) {
        $scope.currentIndex = index;
      };

      $scope.isCurrentSlideIndex = function(index) {
        return $scope.currentIndex === index;
      };

      $scope.prevSlide = function() {
        $scope.currentIndex = ($scope.currentIndex < $scope.property.images.length - 1) ? ++$scope.currentIndex : 0;
      };

      $scope.nextSlide = function() {
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.property.images.length - 1;
      };

      $scope.onClickTab = function(tab) {
        $scope.currentTab = tab.url;
      }

      $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
      }

      $scope.isActive = function(index) {
        return $scope._Index === index;
      };
      // show prev image
      $scope.showPrev = function() {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.property.images.length - 1;
      };

      // show next image
      $scope.showNext = function() {
        console.log('next');
        $scope._Index = ($scope._Index < $scope.property.images.length - 1) ? ++$scope._Index : 0;
      };


      // show a certain image
      $scope.showPhoto = function(index) {
        $scope._Index = index;
      };

      // end new gallery
      var infoarray = [];
      var markerarray = [];
      var image = 'image/icon/map_pin.png';
      $scope.customerowner = CustomerPropertyOwner.get({
        customerId: '0001'
      });
      $window.initMap = function() {
        $scope.initlist = new Array();
        $rootScope.$broadcast('StreatviewReady', true);
      };

      $scope.infoinitNMAP = function() {
        $scope.initlist = new Array();
        $rootScope.$broadcast('infoMapReady', true);
      };

      $scope.infoinitPMAP = function() {
        $scope.initlist = new Array();
        document.getElementById('map-canvas').innerHTML = "";
        $rootScope.$broadcast('StreatviewReady', true);
      };


      $scope.condos = [];
      $scope.$on('StreatviewReady', function(event) {
        console.log('info map called')
        $scope.distances = [];
        console.log($scope.property.heading);
        var mapOptions = {
          zoom: 16,
          scrollwheel: false,
          disableDoubleClickZoom: true
        };
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng($scope.property.location[1], $scope.property.location[0]);
            var panoramaOptions = {
              position: pos,
              pov: {
                heading: parseFloat($scope.property.heading),
                pitch: parseFloat($scope.property.pitch),
              },
              scrollwheel: false,
              zoom: 1
            };
            console.log($scope.property.heading)
            console.log($scope.property.pitch)
            console.log(panoramaOptions)
            var request = {
              location: pos,
              radius: '1500',
              types: typearray
            };
            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), {
              center: pos,
              zoom: 12,
              scrollwheel: false
            });
            var lat = $scope.map.center.lat();
            var lng = $scope.map.center.lng();
            $scope.service = new google.maps.places.PlacesService($scope.map);
            $scope.service.nearbySearch(request, function(results, status) {
              $scope.$apply();
              for (var i = results.length - 1; i >= 0; i--) {
                results[i].distances = $rootScope.distance(results[i].geometry.location.k, results[i].geometry.location.B, lat, lng, '');

              };
              $scope.nearbyPlaces = results;
              $scope.$apply();
            });
            $scope.map = new google.maps.StreetViewPanorama(document.getElementById('map-canvas'), panoramaOptions);
            $scope.map.setVisible(true);
            if ($cookies.lat == null) {} else {

            }

          }, function() {
            $scope.handleNoGeolocation(true);
          });
        } else {
          $scope.handleNoGeolocation(false);
        }
      });

      $scope.$on('infoMapReady', function(event) {
        console.log('info map called')
        var mapOptions = {
          zoom: 13,
          scrollwheel: false,
          disableDoubleClickZoom: true
        };
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng($scope.property.location[1], $scope.property.location[0]);
            var marker = new google.maps.Marker({
              position: pos,
              title: "Your Location",
              draggable: false,
              icon: image
            });
            marker.setMap($scope.map);
            $scope.map.setCenter(pos);
            var request = {
              location: pos,
              radius: '1500',
              types: typearray
            };
            var lat = $scope.map.center.lat();
            var lng = $scope.map.center.lng();
            $scope.service = new google.maps.places.PlacesService($scope.map);
            $scope.service.nearbySearch(request, function(results, status) {
              $scope.$apply();
              console.log(results)
              for (var i = results.length - 1; i >= 0; i--) {
                var image;
                if (results[i].types[0] === "pharmacy") {
                  image = {
                    url: "/css/image/icon/pin/p4.png"
                  };
                } else if (results[i].types[0] === "subway_station") {
                  image = {
                    url: "/css/image/icon/pin/p10.png"
                  };
                } else if (results[i].types[0] === "bank") {
                  image = {
                    url: "/css/image/icon/pin/p5.png"
                  };
                } else if (results[i].types[0] === "department_store") {
                  image = {
                    url: "/css/image/icon/pin/p6.png"
                  };
                } else if (results[i].types[0] === "movie_theater") {
                  image = {
                    url: "/css/image/icon/pin/p6.png"
                  };
                } else if (results[i].types[0] === "restaurant") {
                  image = {
                    url: "/css/image/icon/pin/p1.png"
                  };
                } else if (results[i].types[0] === "food") {
                  image = {
                    url: "/css/image/icon/pin/p1.png"
                  };
                } else if (results[i].types[0] === "school") {
                  image = {
                    url: "/css/image/icon/pin/p8.png"
                  };
                } else {
                  image = {
                    url: "/css/image/icon/pin/p3.png"
                  };
                }
                results[i].distances = $rootScope.distance(results[i].geometry.location.k, results[i].geometry.location.B, lat, lng, '');
                var tempArray = [];
                var latLng = new google.maps.LatLng(results[i].geometry.location.k, results[i].geometry.location.B);
                var marker = new google.maps.Marker({
                  position: latLng,
                  title: results[i].name,
                  icon: image
                });
                markerarray.push(marker);
                marker.setMap($scope.map);
                var contentString = results[i].name;
                $scope.attachInfo(marker, contentString);
              };
            });
            if ($cookies.lat == null) {
              $scope.showMeTheCondo(position);
            } else {}
          }, function() {
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

      $scope.attachInfo = function(marker, content) {
        var infowindow = new google.maps.InfoWindow({
          content: content
        });
        infoarray.push(infowindow);
        google.maps.event.addListener(marker, 'click', function() {
          for (var i = 0; i < infoarray.length; i++) {
            infoarray[i].close();
          }
          infowindow.open(marker.get('map'), marker);
        });
      };

    }
  ])
  .controller('fmCtrl', ['$scope', 'Filtermain', '$window', '$rootScope',
    function($scope, Filtermain, $window, $rootScope) {

    }
  ])
  .controller('searchresultCtrl', ['$scope', '$window', '$http', '$rootScope', '$route', '$location', '$cookies', 'Search', 'socket', 'Property',
    function($scope, $window, $http, $rootScope, $route, $location, $cookies, Search, socket, Property) {
      $scope.temp = {};
      $rootScope.customershow = true;
      $scope.pagination = 1;
      $scope.currentPage = 1;
      $scope.pageSize = 10;
      $scope.gotoPage = 1;
      $scope.maptype = 0;
      $scope.searchoption = 1;
      var dict = {};
      $scope.markerarray = [];
      $scope.infoarray = [];

      $scope.reads = function(data) {
        $scope.foundApartment(data, $scope.maptype);
      };

      $scope.settxt = function() {
        console.log($scope.currentPage)
        $rootScope.searchtxt = $scope.search;
        console.log($rootScope.searchtxt)
        console.log($location.path())
        if ($location.path() === '/homes') {
          $rootScope.customershow = true;
          if ($rootScope.searchtxt === '') {
            $rootScope.managesearch = false;
            document.getElementById("searchnotfix").focus();
          } else {
            $rootScope.managesearch = true;

            //document.getElementById("searchfix").prompt();
            document.getElementById("searchfix").focus();
            document.getElementById("searchfix").click();
          }
        } else if ($location.path() === "/result") {
          $rootScope.customershow = true;
          var address = $rootScope.searchtxt;
          $scope.txtsearch();

        } else if ($location.path() === "/my_page") {
          $rootScope.customershow = false;
        } else {
          $rootScope.customershow = true;
        }

      };

      $window.initMap = function() {
        if ($location.path() === "result") {
          if (!$scope.map) {
            $rootScope.$broadcast('searchMapReady', true);
          }
        } else {
          $rootScope.$broadcast('mapReady', true);
        }
      };

      $scope.$on('$routeChangeSuccess', function() {
        if ($location.path() === '/homes') {
          $rootScope.managesearch = false;
        } else if ($location.path() === "/result") {
          $scope.timercount = 0;
          $scope.timersection = 0;
          $scope.loadigtimer = $window.setInterval(function() {
            console.log($scope.timercount)
            if ($scope.timercount >= 0 && $scope.timersection == 1) {
              if ($scope.timercount == 0) {
                $scope.timercount++;
                $scope.timersection = 0;
              } else {
                $scope.timercount--;
              }

            } else if ($scope.timercount <= 100 && $scope.timersection == 0) {
              if ($scope.timercount == 100) {
                $scope.timercount--;
                $scope.timersection = 1;
              } else {
                $scope.timercount++;
              }
            } else {

            }
            document.getElementById('process_bar').style.width = $scope.timercount + "%";
          }, 10);
          document.getElementById("process_bar_containner").className = 'modal__upload';

          var test = $window.setInterval(function() {
            if ($scope.map) {
              $scope.foundApartment();
            } else {
              console.log("gen map")
              $rootScope.$broadcast('searchMapReady', true);
            }
            $scope.settxt();
            $scope.txtsearch();

            clearTimeout(test);
          }, 2000)
          $rootScope.managesearch = true;
        } else {
          $rootScope.managesearch = true;
        }
      });

      $scope.selectedAddress = '';

      $scope.geocode = function() {

      };

      $scope.getId = function(obj) {
        // some cool hashing
        return obj._id; // just an example
      };

      $scope.$watch('temp', function(data, old) {
        dict = {};
        angular.forEach(data, function(type, indata) {
          dict[$scope.getId(type)] = type;
        });
        $scope.temp = [];
        var i = 0;
        angular.forEach(dict, function(type, indata) {
          $scope.temp[i] = type;
          i++;
        });

        $scope.pagination = Math.ceil(data.length / 10);
        $scope.numberOfPages = function() {
          return Math.ceil(data.length / $scope.pageSize);
        };
        clearTimeout($scope.loadigtimer);
        document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
      }, true);

      $scope.initNMAP = function() {
        $scope.searchoption = 0;
        $rootScope.$broadcast('pinMapReady', true);
      };

      $scope.initPMAP = function() {
        $scope.searchoption = 1;
        $rootScope.$broadcast('searchMapReady', true);
      };

      $scope.txtsearch = function() {
        $rootScope.searchtxt = $scope.search;
        if ($scope.search !== "") {
          if ($scope.searchoption == 1) {
            Search.query({
              search: $scope.search
            }, function(data) {
              $rootScope.$broadcast('searchMapReady', true);
              $scope.temp = [];
              angular.forEach(data, function(type) {
                $scope.temp.push(type);
              });
            });
          } else {
            $scope.geocoder.geocode({
              'address': $scope.search
            }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {

                $scope.map.setCenter(results[0].geometry.location);
                $scope.marker.setPosition(results[0].geometry.location);
                for (var i = 0; i < $scope.markerarray.length; i++) {
                  if ($scope.markerarray[i] != null) {
                    $scope.markerarray[i].setMap(null);
                  }
                }
                $scope.temp = [];
                $scope.foundApartment(1, 1);

              } else {

              }
            });

          }



        }
      };

      $scope.push = function() {
        document.getElementById('map-canvas').innerHTML = "";
      };

      $scope.$on('pinMapReady', function(event) {
        try {
          document.getElementById('map-canvas').innerHTML = "";
          try {
            $scope.map.$destroy();
          } catch (e) {

          } finally {
            $scope.maptype = 1;
            var image = 'image/icon/map_pin.png';
            var pos;
            var mapOptions = {
              zoom: 10,
              scrollwheel: false,
              disableDoubleClickZoom: true
            };
            $scope.geocoder = new google.maps.Geocoder();
            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                if ($cookies.lat === undefined) {
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
                google.maps.event.addListener($scope.marker, 'dragend', function(evt) {
                  for (var i = 0; i < $scope.markerarray.length; i++) {
                    if ($scope.markerarray[i] != null) {
                      $scope.markerarray[i].setMap(null);
                    }
                  }
                  $cookies.lat = evt.latLng.lat();
                  $cookies.lng = evt.latLng.lng();
                  var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
                  $scope.map.setCenter(pos);
                  $scope.temp = [];
                  $scope.foundApartment(1, 1);
                });
                $scope.marker.setMap($scope.map);
                $scope.currentPage = 1;
                $scope.map.setCenter(pos);
                $scope.foundApartment(1, 1);
                if ($cookies.lat == null) {} else {}
              }, function() {
                $scope.handleNoGeolocation(true);
              });
            } else {
              $scope.handleNoGeolocation(false);
            }
          }
        } catch (e) {}
      });

      $scope.$on('searchMapReady', function(event) {
        try {
          document.getElementById('map-canvas').innerHTML = "";
          try {
            $scope.map.$destroy();
          } catch (e) {

          } finally {
            $scope.maptype = 0;
            var image = 'image/icon/map_pin.png';
            var mapOptions = {
              zoom: 5,
              scrollwheel: false,
              disableDoubleClickZoom: true
            };
            $scope.geocoder = new google.maps.Geocoder();
            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                if ($cookies.lat == undefined) {
                  var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                } else {
                  var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
                }
                $scope.currentPage = 1;
                $scope.map.setCenter(pos);
                $scope.foundApartment(1, $scope.maptype);
                $scope.$apply();
                if ($cookies.lat == null) {

                } else {

                }
              }, function() {
                $scope.handleNoGeolocation(true);
              });
            } else {
              $scope.handleNoGeolocation(false);
            }
          }
        } catch (e) {

        }
      });

      $scope.foundApartment = function(page, method) {
        try {
          for (var i = 0; i < $scope.markerarray.length; i++) {
            if ($scope.markerarray[i] != null) {
              if ($scope.markerarray[i] != null) {
                $scope.markerarray[i].setMap(null);
              }
            }
          }
        } catch (e) {

        } finally {
          $scope.markerarray = [];
          $scope.infoarray = [];
          var marker;
          var pinimage = [];
          for (var i = 9; i >= 0; i--) {
            pinimage[i] = '/css/image/icon/pin/pin' + (i + 1) + '.png';
          };
          var i = 1;
          if (method == 0) {
            angular.forEach($scope.temp, function(type) {
              try {
                var latLng = new google.maps.LatLng(type.location[1], type.location[0]);
                if (i <= page * 10 && i > (page - 1) * 10) {
                  marker = new google.maps.Marker({
                    position: latLng,
                    title: type.title,
                    icon: pinimage[(i - (page - 1) * 10) - 1],
                    zIndex: 999
                  });
                  google.maps.event.addListener(marker, "mouseover", function() {
                    var d = document.getElementsByClassName('pincontent');
                    for (var i = d.length - 1; i >= 0; i--) {
                      if (d[i].id == type._id) {

                      } else {
                        d[i].style.display = 'none';
                      }
                    };
                  });
                  google.maps.event.addListener(marker, "mouseout", function() {
                    var d = document.getElementsByClassName('pincontent');
                    for (var i = d.length - 1; i >= 0; i--) {
                      d[i].style.display = '';
                    };
                  });
                  i++;
                } else {
                  i++;
                }
                $scope.markerarray.push(marker);
                marker.setMap($scope.map);
                var contentString = '<a href="#!/info?_id=' + type._id + '"  style="font-size:1em;" target="_blank">' + type.title + '</a> ' +
                  '<p class="profile--p">ค่าเช่า' + type.price + ' บาท</p><br> <img style="width:100px;" src="' + type.images[0] + '"/>';
                $scope.attachInfo(marker, contentString);
              } catch (e) {
                console.log(e);
              }
            });
          } else {
            Property.query({
              location: [$cookies.lng, $cookies.lat]
            }, function(res) {
              angular.forEach(res, function(type) {
                $scope.temp.push(type.obj);
              });
              var pinimage = [];
              for (var i = 9; i >= 0; i--) {
                pinimage[i] = '/css/image/icon/pin/pin' + (i + 1) + '.png';
              };
              for (var i = 0; i < res.length; i++) {
                var tempArray = [];
                var marker;
                var latLng = new google.maps.LatLng(res[i].obj.location[1], res[i].obj.location[0]);
                if (i <= 10) {
                  marker = new google.maps.Marker({
                    position: latLng,
                    title: res[i].obj.title,
                    icon: pinimage[i]
                  });
                  google.maps.event.addListener(marker, "mouseover", function() {

                    var d = document.getElementsByClassName('pincontent');
                    for (var i = d.length - 1; i >= 0; i--) {
                      if (d[i].id == $scope.temp[i]._id) {

                      } else {
                        d[i].style.display = 'none';
                      }
                    };

                  });

                  google.maps.event.addListener(marker, "mouseout", function() {
                    var d = document.getElementsByClassName('pincontent');
                    for (var i = d.length - 1; i >= 0; i--) {
                      d[i].style.display = '';
                    };
                  });
                } else {
                  marker = new google.maps.Marker({
                    position: latLng,
                    title: res[i].obj.title
                  });
                }

                $scope.markerarray.push(marker);
                marker.setMap($scope.map);
                var contentString = '<a href="#!/info?_id=' + res[i].obj._id + '"  style="font-size:1em;" target="_blank">' + res[i].obj.title + '</a> ' +
                  '<p class="profile--p">ค่าเช่า' + res[i].obj.price + ' บาท</p><br> <img style="width:100px;" src="' + res[i].obj.images[0] + '"/>';
                $scope.attachInfo(marker, contentString);
              };
            });
          }
        }
      };

      $scope.attachInfo = function(marker, content) {
        var infowindow = new google.maps.InfoWindow({
          content: content
        });
        $scope.infoarray.push(infowindow);
        google.maps.event.addListener(marker, 'click', function() {
          for (var i = 0; i < $scope.infoarray.length; i++) {
            $scope.infoarray[i].close();
          }
          infowindow.open(marker.get('map'), marker);
        });
      };

      socket.on('PropertyUpdate', function(data) {
        for (var i = $scope.temp.length - 1; i >= 0; i--) {
          if ($scope.temp[i]._id.toString() === data._id.toString()) {
            $scope.temp[i].title = data.element.title;
          }
        };
      });
    }
  ])
  .controller('sponsorCtrl', ['$scope', 'Myads', '$location', '$http', '$rootScope', '$window', '$cookies', 'socket', 'GotoInfo',
    function($scope, Myads, $location, $http, $rootScope, $window, $cookies, socket, GotoInfo) {
      Myads.query({
        lat: $cookies.lat,
        lng: $cookies.lng
      }, function(res) {
        $scope.sort = [];
        $scope.sponsor = res;
        for (var i in $scope.sponsor) {
          if ($scope.sponsor[i].dis !== undefined) {
            $scope.sponsor[i].dis = $scope.sponsor[i].dis / $scope.sponsor[i].obj.cpc;
          }
        }
        for (var i in $scope.sponsor) {
          try {
            if ($scope.sponsor[i].obj.ads_status === 0) {
              $scope.sort.push($scope.sponsor[i]);
            }
          } catch (e) {}
        }
        $scope.sponsor = $scope.sort;
      });
      $scope.clicked = function(id, p_id) {
        socket.emit('Adsclick', id);
        $window.location = "#!/info?_id=" + p_id;
        GotoInfo.post({
          _id: id
        }, function(res) {});
      }
    }
  ])
  .controller('customerPageCtrl', ['$q', '$scope', '$window', '$sce', '$rootScope', 'Propertys', '$routeParams',
    '$filter', '$cookies', '$location', 'Filter', 'socket',
    function($q, $scope, $window, $sce, $rootScope, Propertys, $routeParams, $filter, $cookies, $location, Filter, socket) {
      var image = 'image/icon/map_pin.png';
      var typearray = [];
      if ($location.path() == '/page') {
        $rootScope.customershow = false;
      } else {
        $rootScope.customershow = true;
      }
      $scope.list = {};
      $scope.filter = [];
      $scope.tempList = {};
      var data = $routeParams._id;

      Filter.query({
        _id: data
      }, function(res) {
        $scope.list = res;
        console.log('list');
        console.log($scope.list);
        $scope.list.about = $sce.trustAsHtml(res.about);
        $scope.list.detail = $sce.trustAsHtml(res.detail);
        $scope.list.room_detail = $sce.trustAsHtml(res.room_detail);
        $scope.statusList = $scope.showStatus();
        $scope.statusSellList = $scope.showStatussl();
      });
      $scope.showStatus = function() {
        var selected = [];
        for (var i = $scope.list.apartment.length - 1; i >= 0; i--) {
          for (var j = $scope.type_txt.length - 1; j >= 0; j--) {
            if ($scope.type_txt[j].value == $scope.list.apartment[i]) {
              selected.push($scope.type_txt[j].text);
            };
          };

        };
        return selected.length ? selected.join(', ') : 'Not set';
      };

      $scope.showStatussl = function() {
        var selected = [];
        angular.forEach($scope.type_sl1, function(s) {
          if ($scope.list.type_sell.indexOf(s.value) >= 0) {
            selected.push(s.text);
          }
        });
        return selected.length ? selected.join(', ') : 'Not set';
      };




      $scope.isActive = function(index) {
        return $scope._Index === index;
      };
      // show prev image
      $scope.showPrev = function() {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.list.images.length - 1;
      };

      // show next image
      $scope.showNext = function() {
        console.log('next');
        $scope._Index = ($scope._Index < $scope.list.images.length - 1) ? ++$scope._Index : 0;
      };




      $scope.loadGroups = function() {
        return $scope.type_txt.length
      };

      var count = 0;

      $scope.update = function(text, data) {
        var rawdata = {};
        var prop = text;
        rawdata.element = {};
        rawdata.element[prop] = data;
        rawdata.uid = $cookies.UID;
        rawdata._id = $routeParams._id;
        socket.emit('PropertyUpdate', rawdata);
        Propertys.post({
          text: rawdata
        }, function(response) {});
      };


      $window.initMap = function() {
        $scope.initlist = new Array();
        $rootScope.$broadcast('customerStreatviewReady', true);
      };

      $scope.customerinitmap = function() {
        $scope.initlist = new Array();
        $rootScope.$broadcast('customerMapReady', true);
      };

      $scope.customerinitstreetview = function() {
        $scope.initlist = new Array();
        document.getElementById('map-canvas').innerHTML = "";
        $rootScope.$broadcast('customerStreatviewReady', true);
      };


      $scope.condos = [];
      $scope.$on('customerStreatviewReady', function(event) {
        console.log('info map called')
        $scope.distances = [];
        console.log($scope.list.heading);
        var mapOptions = {
          zoom: 16,
          scrollwheel: false,
          disableDoubleClickZoom: true
        };
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng($scope.list.location[1], $scope.list.location[0]);
            var panoramaOptions = {
              position: pos,
              pov: {
                heading: parseFloat($scope.list.heading),
                pitch: parseFloat($scope.list.pitch),
              },
              scrollwheel: false,
              zoom: 1
            };
            console.log($scope.list.heading)
            console.log($scope.list.pitch)
            console.log(panoramaOptions)
            var request = {
              location: pos,
              radius: '1500',
              types: typearray
            };
            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), {
              center: pos,
              zoom: 12,
              scrollwheel: false
            });
            var lat = $scope.map.center.lat();
            var lng = $scope.map.center.lng();
            $scope.service = new google.maps.places.PlacesService($scope.map);
            $scope.service.nearbySearch(request, function(results, status) {
              $scope.$apply();
              for (var i = results.length - 1; i >= 0; i--) {
                results[i].distances = $rootScope.distance(results[i].geometry.location.k, results[i].geometry.location.B, lat, lng, '');

              };
              $scope.nearbyPlaces = results;
              $scope.$apply();
            });
            $scope.map = new google.maps.StreetViewPanorama(document.getElementById('map-canvas'), panoramaOptions);
            $scope.map.setVisible(true);
            if ($cookies.lat == null) {} else {

            }

          }, function() {
            $scope.handleNoGeolocation(true);
          });
        } else {
          $scope.handleNoGeolocation(false);
        }
      });

      $scope.$on('customerMapReady', function(event) {
        var mapOptions = {
          zoom: 13,
          scrollwheel: false,
          disableDoubleClickZoom: true
        };
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng($scope.list.location[1], $scope.list.location[0]);
            var marker = new google.maps.Marker({
              position: pos,
              title: "Your Location",
              draggable: false,
              icon: image
            });
            marker.setMap($scope.map);
            $scope.map.setCenter(pos);
            var request = {
              location: pos,
              radius: '1500',
              types: typearray
            };
            var lat = $scope.map.center.lat();
            var lng = $scope.map.center.lng();
            $scope.service = new google.maps.places.PlacesService($scope.map);
            $scope.service.nearbySearch(request, function(results, status) {
              $scope.$apply();
              console.log(results)
              for (var i = results.length - 1; i >= 0; i--) {
                var image;
                if (results[i].types[0] === "pharmacy") {
                  image = {
                    url: "/css/image/icon/pin/p4.png"
                  };
                } else if (results[i].types[0] === "subway_station") {
                  image = {
                    url: "/css/image/icon/pin/p10.png"
                  };
                } else if (results[i].types[0] === "bank") {
                  image = {
                    url: "/css/image/icon/pin/p5.png"
                  };
                } else if (results[i].types[0] === "department_store") {
                  image = {
                    url: "/css/image/icon/pin/p6.png"
                  };
                } else if (results[i].types[0] === "movie_theater") {
                  image = {
                    url: "/css/image/icon/pin/p6.png"
                  };
                } else if (results[i].types[0] === "restaurant") {
                  image = {
                    url: "/css/image/icon/pin/p1.png"
                  };
                } else if (results[i].types[0] === "food") {
                  image = {
                    url: "/css/image/icon/pin/p1.png"
                  };
                } else if (results[i].types[0] === "school") {
                  image = {
                    url: "/css/image/icon/pin/p8.png"
                  };
                } else {
                  image = {
                    url: "/css/image/icon/pin/p3.png"
                  };
                }
                results[i].distances = $rootScope.distance(results[i].geometry.location.k, results[i].geometry.location.B, lat, lng, '');
                var tempArray = [];
                var latLng = new google.maps.LatLng(results[i].geometry.location.k, results[i].geometry.location.B);
                var marker = new google.maps.Marker({
                  position: latLng,
                  title: results[i].name,
                  icon: image
                });
                markerarray.push(marker);
                marker.setMap($scope.map);
                var contentString = results[i].name;
                $scope.attachInfo(marker, contentString);
              };
            });
            if ($cookies.lat == null) {
              $scope.showMeTheCondo(position);
            } else {}
          }, function() {
            $scope.handleNoGeolocation(true);
          });
        } else {
          $scope.handleNoGeolocation(false);
        }
      });







    }
  ])
  .controller('Login', ['$scope', '$cookies', '$rootScope', '$location', '$route', '$window', 'Check', 'User',
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
  ])

.controller('customerdetailCtrl', ['$scope', '$cookies', '$rootScope', 'Customer', 'CustomerProperty',
    function($scope, $cookies, $rootScope, Customer, CustomerProperty) {
      $scope.customer = Customer.get({
        customerId: '0000'
      });
      $scope.customerProperties = CustomerProperty.get({
        customerId: '00001'
      });
    }
  ])
  .controller('adminCtrl', ['$scope', '$cookies', '$rootScope', 'Check', 'dateFilter', 'Userlist',
    function($scope, $cookies, $rootScope, Check, dateFilter, Userlist) {
      $scope.date_visit = dateFilter(new Date(), 'yyyy-MM-dd');
      $scope.date_appointment = dateFilter(new Date(), 'yyyy-MM-dd');
      $scope.minDate = '2014-01-01';
      $scope.maxDate = '2020-12-30';
      $scope.time_visit = '';
      $scope.time_appointment = '';
      Userlist.query({
        saleman: "1"
      }, function(results) {
        $scope.salelist = results;
      });

    }
  ])
  .controller('resetpassCtrl', ['$scope', '$cookies', '$rootScope', '$routeParams', '$location', 'PasswordChange',
    function($scope, $cookies, $rootScope, $routeParams, $location, PasswordChange) {
      $scope.forget_email;
      $scope.reset = true;
      try {
        document.getElementById("overlay").style.visibility = "hidden";
      } catch (e) {
        console.log(e);
      } finally {
        if ($routeParams.token !== undefined) {
          $scope.reset = false;
        } else {
          $scope.reset = true;
        }
      }
      $scope.send_mail = function() {
        try {
          document.getElementById("overlay").style.visibility = "visible";
        } catch (e) {} finally {
          PasswordChange.query({
            email: $scope.forget_email
          }, function(response) {
            if (response[0] == 1) {
              try {
                document.getElementById("overlay").style.visibility = "hidden";
              } catch (e) {
                console.log(e);
              } finally {
                alert("กรุณาตรวจสอบ Email เพื่อทำการเปลี่ยนรหัสผ่าน ");
              }
            } else if (response[0] === undefined) {
              try {
                document.getElementById("overlay").style.visibility = "hidden";
              } catch (e) {
                console.log(e);
              } finally {
                alert("ไม่มี Email นี้ในระบบ");
              }
            }
          });
        }
      };

      $scope.changePassword = function() {
        $scope.reset_pas.token = $routeParams.token;
        $scope.reset_pas.email = $routeParams.email;
        PasswordChange.post({
          reset: $scope.reset_pas
        }, function(response) {
          if (response != null) {
            alert("Password ถูกเปลี่ยนเรียบร้อยแล้ว");
          } else {
            alert("ไม่สามารถเปลี่ยน Password ได้ กรุณาใช้ Link ที่ระบบส่งให้!");
          }

        });
      };
    }
  ])
  .controller('controlpanelCtrl', ['$scope', '$cookies', '$rootScope', '$window', 'Check',
    function($scope, $cookies, $rootScope, $window, Check) {

    }
  ])
  .controller('regisCtrl', ['$scope', '$http', '$window', '$cookies', '$rootScope', '$location', 'User', 'Check',
    function($scope, $http, $window, $cookies, $rootScope, $location, User, Check) {
      $scope.reg = {};
      $scope.passupdate = function(txt) {
        $scope.password = $scope.reg.password;
      };

      $scope.patternupdate = function() {
        var re = new RegExp("^" + $scope.password + "$", "");
        return re;
      };

      $scope.smsCheck = function() {
        if ($scope.reg.tel.length > 8) {
          if (!$scope.reg.tel.search(/^[0-9]*$/)) {
            $scope.isValid = true;
            console.log('yeah')
          } else {
            $scope.isValid = false;
          }
        } else {
          $scope.isValid = false;
        }
      };

      $scope.userCheck = function() {
        $scope.check_valid = "";

        $scope.reg.tel = '';
        $scope.reg.email = '';
        $scope.check_invalid = '';
        $scope.check_valid = '';
        $scope.check_invalid = '';
        try {
          $scope.isValid = true;
          if (!$scope.reg.mailortel.search(/^[0-9]*$/)) {
            if ($scope.reg.mailortel.length == 10) {
              $scope.reg.tel = $scope.reg.mailortel;
              User.query({
                tel: $scope.reg.tel
              }, function(res) {
                if (res.permission !== undefined) {
                  $scope.check_invalid = "มีผู้ใช้ " + $scope.reg.mailortel + " ในระบบแล้วนะ ลองเบอร์อื่นใหม";
                  $scope.isValid = false;
                } else {
                  $scope.check_valid = 'เอ๊ะ คุณแน่ใจแล้วหรือที่จะใช้ ' + $scope.reg.mailortel + ' ในการสมัคร เบอร์นี้อาจจะจำเป็นต้องใช้ในการยืนยันสมาชิกทาง SMS นะ';
                }
              });
            } else {
              $scope.isValid = false;
              $scope.check_invalid = 'กรุณาเช็ค Email หรือเบอร์โทรศัพท์ด้วยนะว่าถูกต้องหรือไม่?';
            }

          } else if (!$scope.reg.mailortel.search(/[\S]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {

            $scope.reg.email = $scope.reg.mailortel;

            User.query({
              email: $scope.reg.email
            }, function(res) {

              if (res.permission !== undefined) {

                $scope.check_invalid = "มีผู้ใช้ " + $scope.reg.mailortel + " ในระบบแล้วนะ ลอง email อื่นใหม";
                $scope.isValid = false;

              } else {

                $scope.check_valid = 'คุณสามารถใช้ ' + $scope.reg.email + ' ในการสมัคร email นี้จะจำเป็นหากต้องการยืนยันสมาชิกนะ';

              }
            });


          }
          // else if($scope.reg.mailortel.search(/[\S]+@[a-zA-Z_]+?\.[a-zA-Z]{2}+\.[a-zA-Z]{2,3}$/)){

          //   $scope.reg.email = $scope.reg.mailortel;

          //   User.query({email:$scope.reg.email},function(res){

          //     if(res.permission!==undefined){

          //       $scope.check_invalid = "มีผู้ใช้ "+$scope.reg.mailortel+" ในระบบแล้วนะ ลอง email อื่นใหม";
          //       $scope.isValid = false;

          //     }else{

          //       $scope.check_valid = 'คุณสามารถใช้ '+$scope.reg.email+' ในการสมัคร email นี้จะจำเป็นหากต้องการยืนยันสมาชิกนะ';

          //     }
          //   });


          // }
          else {

            $scope.isValid = false;
            $scope.check_invalid = 'กรุณาเช็ค Email หรือเบอร์โทรศัพท์ด้วยนะว่าถูกต้องหรือไม่?';

          }
        } catch (e) {


        }




      };

      $scope.isValid = false;

      $scope.next = function(req) {

      };

      $scope.update = function(params) {
        var tel = "";
        var fax = "";
        var mobile = "";
        User.post({
          reg: $scope.reg
        }, function(response) {
          if (response[0] === "1") {
            Check.query({
              username: $scope.reg.mailortel,
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
                $rootScope.setCC = setCC("setting");
                $location.path('/controlpanel');
                $location.replace();
              } else {
                console.log('2430 ctrljs');
                console.log(res);
                alert('Please Check your username and password');
              }
            });
          }
        });
      };
    }
  ])
  .controller('mapCtrl', ['$scope', '$rootScope', 'Property', '$window', '$location', '$cookies', '$http', '$templateCache', 'SponsorApartment',
    function($scope, $rootScope, Property, $window, $location, $cookies, $http, $templateCache, SponsorApartment) {
      $scope.$on('$routeChangeSuccess', function() {
        if ($location.path() === '/homes') {
          $rootScope.$broadcast('mapReady', true);
        }
      });
      var markerarray = [];
      var infoarray = [];
      var image = 'image/icon/map_pin.png';
      // $window.initMap = function() {
      //   $scope.initlist = new Array();
      //   $rootScope.$broadcast('mapReady', true);
      // };
      Property.query({}, function(result) {
        $scope.initlist = result;
        SponsorApartment.get({}, function(result) {
          for (var i = result.length - 1; i >= 0; i--) {

            $scope.initlist.unshift(result[i]);
          };

        })
      });
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
              if ($cookies.lat == undefined) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              } else {
                var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
              }
              var marker = new google.maps.Marker({
                position: pos,
                title: "Your Location",
                draggable: true,
                icon: image
              });

              google.maps.event.addListener(marker, 'dragend', function(evt) {
                for (var i = 0; i < markerarray.length; i++) {
                  markerarray[i].setMap(null);
                }
                $cookies.lat = evt.latLng.lat();
                $cookies.lng = evt.latLng.lng();
                var pos = new google.maps.LatLng($cookies.lat, $cookies.lng);
                $scope.showMeTheCondo(position);
                $scope.map.setCenter(pos);
              });

              marker.setMap($scope.map);
              $scope.map.setCenter(pos);
              if ($cookies.lat == null) {
                $scope.showMeTheCondo(position);
              } else {
                $scope.showMeTheCondo(position);
              }
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
      $scope.showMeTheCondo = function(position) {
        var rnd_box = rand();
        var condos = [];
        Property.query({
          location: [$cookies.lng, $cookies.lat]
        }, function(res) {
          $scope.initlist = res;
          for (var i = 0; i < res.length; i++) {
            var tempArray = [];
            var latLng = new google.maps.LatLng(res[i].obj.location[1], res[i].obj.location[0]);
            var marker = new google.maps.Marker({
              position: latLng,
              title: res[i].obj.title
            });
            markerarray.push(marker);
            marker.setMap($scope.map);
            var contentString = '<h2> <a href="#!/info?_id=' + res[i].obj._id + '" target="_blank">' + res[i].obj.title + '</a></h2> ' +
              '<p>ค่าเช่า' + res[i].obj.price + ' บาท</p><br>';
            $scope.attachInfo(marker, contentString);
          };
          SponsorApartment.get({}, function(result) {
            for (var i = result.length - 1; i >= 0; i--) {

              $scope.initlist.unshift(result[i]);
            };

          })
        });
      };
      $scope.attachInfo = function(marker, content) {
        var infowindow = new google.maps.InfoWindow({
          content: content
        });
        infoarray.push(infowindow);
        google.maps.event.addListener(marker, 'click', function() {
          for (var i = 0; i < infoarray.length; i++) {
            infoarray[i].close();
          }
          infowindow.open(marker.get('map'), marker);
        });
      };
    }
  ])
  .controller('Usertemp', function($scope, $routeParams) {
    $scope.actionUrl = './public/' + $cookies.UID;
  })
  .controller('activeCtrl', ['$scope', '$routeParams', 'Active',
    function($scope, $routeParams, Active) {
      Active.query({
        email: $routeParams.email,
        token: $routeParams.token
      }, function(res) {});
    }
  ])
  .controller('InvoiceCtrl', ['$scope', 'Paysbuy', 'CreateTransaction',
    function($scope, Paysbuy, CreateTransaction) {
      $scope.payment = {};
      $scope.invoicestat = false;
      $scope.send_payment = function() {
        console.log($scope.amount)
        CreateTransaction.post({
          amt: $scope.amount
        }, function(result) {
          if (result.invoice) {
            console.log(result.invoice);
            $scope.invoicenumber = result.invoice;
            $scope.invoicestat = true;
          }


        });
      }

    }
  ])
  .controller('controlpanelCtrl', function($scope) {})
  .controller('firstStepCtrl', function($scope) {
    $scope.isNotSearch = true;
  })
  .controller("listcontroller", function($scope, $window, $http, $cookies) {
    $scope.items1 = [];
    $scope.items2 = [];
    $scope.items3 = [];
    $scope.password = "";

    $scope.del_tel = function(txt) {
      var index = $scope.items1.indexOf(txt);
      if (index > -1) {
        $scope.items1.splice(index, 1);
      }
    };

    $scope.del_mobile = function(txt) {
      var index = $scope.items2.indexOf(txt);
      if (index > -1) {
        $scope.items2.splice(index, 1);
      }
    };

    $scope.del_fax = function(txt) {
      var index = $scope.items3.indexOf(txt);
      if (index > -1) {
        $scope.items3.splice(index, 1);
      }
    };

    $scope.actionUrl = '/logosave?_id=' + $cookies.UID;
    $scope.fine = function(params) {
      var data = "fine_date=" + params.date_no + "&fine_cost=" + params.fine_cost + "&_id=" + $cookies.building_id;
      $http.post('/fineupdate?' + data).success(function(data, status, headers, config) {
        if (status == 200) {
          alert("building updated" + $cookies.building_id);
        } else {
          alert("please check your information");
        }
      });
    };

    $scope.docupdate = function(params, logo) {
      var file = document.getElementsByTagName('input')[9].files[0].name;
      var data = "company_address=" + params.comp_address + "&amphures=" + params.comp_aumphures + "&district=" + params.comp_district + "&province=" + params.comp_province + "&postcode=" + params.comp_postcode + "&tel_doc=" + params.comp_tel + "&mobile_doc=" + params.comp_mobile + "&fax_doc=" + params.comp_fax + "&web_site=" + params.comp_site + "&company_name=" + params.comp_name + "&_id=" + $cookies.building_id + "&logo=" + file;
      $http.post('/docupdate?' + data).success(function(data, status, headers, config) {
        if (status == 200) {
          alert("building updated" + $cookies.building_id);
        } else {
          alert("please check your information");
        }
      });
    };

    $scope.create = function(params) {
      var data = "userid=" + $cookies.UID + "&building=" + params.building_name + "&address=" + params.building_address + "&tel=" + params.building_tel + "&fax=" + params.building_fax + "&detail=" + params.building_detail;
      $http.post('/createbuilding?' + data).success(function(data, status, headers, config) {
        if (status == 200) {
          $cookies.building_id = data._id;
          alert("building created" + $cookies.building_id);
        } else {
          alert("please check your information");
        }
      });
    };
    this.room = [{
      "roomno": "1",
      "stat": "yes"
    }, {
      "roomno": "2",
      "stat": "no"
    }, {
      "roomno": "3",
      "stat": "yes"
    }, {
      "roomno": "4",
      "stat": "no"
    }, {
      "roomno": "5",
      "stat": "yes"
    }, {
      "roomno": "6",
      "stat": "yes"
    }, {
      "roomno": "7",
      "stat": "no"
    }, {
      "roomno": "8",
      "stat": "no"
    }, {
      "roomno": "9",
      "stat": "yes"
    }, {
      "roomno": "10",
      "stat": "yes"
    }, {
      "roomno": "11",
      "stat": "no"
    }, {
      "roomno": "12",
      "stat": "no"
    }];
    this.myDropDown = 'zero';
    $scope.date_val2 = new Date();
    $scope.date_val1 = new Date();
    $scope.total_sum = function(s1, s2, s3, s4, s5) {
      if (s1 === undefined) {
        s1 = 0;
      }
      if (s2 === undefined) {
        s2 = 0;
      }
      if (s3 === undefined) {
        s3 = 0;
      }
      if (s4 === undefined) {
        s4 = 0;
      }
      if (s5 === undefined) {
        s5 = 0;
      }
      return (parseInt(s1) + parseInt(s2) + parseInt(s3) + parseInt(s4) + parseInt(s5));
    };

    $scope.adds1 = function(txt) {
      if (!$scope.items1.contains(txt) && txt != "")
        $scope.items1.push(txt);
      this.tel = "";
    };

    $scope.adds2 = function(txt) {
      if (!$scope.items2.contains(txt) && txt != "")
        $scope.items2.push(txt);
      this.mobile = "";
    };

    $scope.adds3 = function(txt) {
      if (!$scope.items3.contains(txt) && txt != "")
        $scope.items3.push(txt);
      this.fax = "";
    };

  });

function rand() {
  var array = [];
  for (; array.length < 5;) {
    var tempval = Math.floor((Math.random() * 5) + 1);
    if (!contains(array, tempval))
      array.push(tempval);
  }
  return array;
}

function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}