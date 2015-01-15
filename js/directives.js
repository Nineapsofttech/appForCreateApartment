
'use strict';

/* Directives */

angular.module('world.directives', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        ctrl.$setValidity("repasswordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        ctrl.$setValidity("repasswordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
}).directive('match', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      match: '='
    },
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(function() {
        return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('match', currentValue);
      });
    }
  };
})
.directive('adsStatus',['Adsstatus',function ( Adsstatus){
  return{
    restrict : 'AEC',
    template : ' <div  class="content__span--1" style="margin-right:5px;">'+
      '<div ng-click="suspendAds();" ng-class="myVar"  title="online">'+
      '</div>'+
    '</div>', 
    scope: {
            adsId : "@adsId"         
          },
    link : function($scope, element, attrs ){

      
    },
   
    controller:function($scope){
    Adsstatus.query({adsid:$scope.adsId},function (response){
            console.log($scope.adsId)
            console.log(response);
            $scope.ads_status = response.ads_status;
            if(response.ads_status==0){
              $scope.myVar = 'sign--green';
            }else if(response.ads_status==1){
              $scope.myVar = 'sign--red';
            }else {
              $scope.myVar = 'sign--red';
            }
          });

        $scope.suspendAds = function(){
          console.log($scope.adsId)
          $scope.set={};
          $scope.set._id = $scope.adsId;
          if($scope.ads_status===undefined){
            $scope.ads_status=1;
          }else if($scope.ads_status==0){
            $scope.ads_status=1;
          }else {
            $scope.ads_status = 0;
          }
           $scope.set.ads_status=$scope.ads_status;
     Adsstatus.post({set:$scope.set},function (response){
        if(response.status === "changed"){
          $scope.myVar = $scope.myVar==='sign--red' ? 'sign--green' : 'sign--red'
        }

     });
      
     }
    }
  }
}])
  .directive('myLogin', [function () {
      return {
          restrict: 'E',
          templateUrl: 'template/login.html',
          controller:"Login"
      }
  }]).directive('myAds', function() {
    return {
        restrict: 'E',
        templateUrl: 'template/ads.html',
        controller: function(){
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
    };
})
  .directive('repeatClick', function ($window,$rootScope) {
     return{
        restrict: 'AEC',
        link: function(scope , element){
            scope.clickcout = 0;
            var test = $window.setInterval( function() {
                if(scope.clickcout>0){
                  scope.clickcout--;
                }
              }, 1000);
           element.bind("click", function(e){
              scope.clickcout++;
              

              if(scope.clickcout>=6){
                $rootScope.closed = false;
                document.getElementById('error_containner').className = 'modal__upload';
                document.getElementById("errtitle").innerHTML = "ใจเย็นๆนะ";
                if(scope.tagName){
                  document.getElementById('errmessage').innerHTML = scope.tagName;
                }else{
                  document.getElementById('errmessage').innerHTML = "ถ้าข้อมูลโหลดช้าไปใจเย็นนิดนึงนะ";
                }
                
                scope.clickcout=0;
              }
              
              
           });
        },
        scope: {
         tagName:"@tagName"
        },
        controller : function($scope){
          
        }
    } 
  })
  .directive('myAdss', function() {
    return {
        restrict: 'E',
        templateUrl: 'template/ads2.html',
        controller: function(){
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
    };
})
  .directive('myHeaderfix', ['$location', function($location) {
    return {
        restrict: 'AEC',
        templateUrl: 'template/header_fix.html',
        controller: function ($rootScope) {
            
          }
    }
}]).directive('topicFeedcomment', ['$location', function($location) {
    return {
        restrict: 'AEC',
        templateUrl: 'template/form/topic_comment_feed.html',
        controller: function ($scope) {
            
        }
    }
}]).directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      
        var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {

            element[0].focus(); 
            element[0].click();

            element[0].setSelectionRange(1, 1);
          });
        }
      });
    }
  };
})
  .directive('mySearchbox', ['$location', function ($location) {
      return {
          restrict: 'E',
          templateUrl: 'template/search_box.html',
          controller: function ($rootScope) {
            
          }
      }
  }]).directive("scrollTo", ["$window", function($window){
    return {
      restrict : "AC",
      compile : function(){

        var document = $window.document;
        
        function scrollInto(idOrName) {//find element with the give id of name and scroll to the first element it finds
          if(!idOrName)
            $window.scrollTo(0, 0);
          //check if an element can be found with id attribute
          var el = document.getElementById(idOrName);
          if(!el) {//check if an element can be found with name attribute if there is no such id
            el = document.getElementsByName(idOrName);

            if(el && el.length)
              el = el[0];
            else
              el = null;
          }

          if(el) //if an element is found, scroll to the element
            el.scrollIntoView();
          //otherwise, ignore
        }

        return function(scope, element, attr) {
          element.bind("click", function(event){
            scrollInto(attr.scrollTo);
          });
        };
      }
    };
}]).directive('ngEnter', function ($window) {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            if(scope.search.length>0){
              $window.location = "#!/result";
            }
          });
          event.preventDefault();
        }
      });
    };
}).directive('myFooter', ['$location',function ($location) {
      return {
          restrict: 'E',
          templateUrl: 'template/footer.html',
          controller: function ($rootScope) {
            if ($location.path() === '/info') {
              $rootScope.myfooterbar = false;
            } else if($location.path() === '/my_page'||$location.path() === '/web_member'
              ||$location.path() === '/my_page2'){
              $rootScope.myfooterbar = true;
            } else if($location.path() === '/controlpanel'){
              $rootScope.myfooterbar = false;
            } else if($location.path() === '/profile_member'||$location.path() === '/security_member'
              ||$location.path() === '/apartment_member'||$location.path() === '/edit_property'
              ||$location.path() === '/ads_member'||$location.path() === '/report_member'
              ||$location.path() === '/view_ads'||$location.path() === '/permisson_ad'
              ||$location.path() === '/ads_admin'||$location.path() === '/customers_admin'
              ||$location.path() === '/assign_customers_admin'||$location.path() === '/stage_customers_admin'
              ||$location.path() === '/sale_dashboard'||$location.path() === '/customers_billing'
              ||$location.path() === '/customers_appointment'||$location.path() === '/customers_checkin'
              ||$location.path() === '/customers_detail'||$location.path() === '/apartment_admin'
              ){
              $rootScope.myfooterbar = false;
            }  else {
              $rootScope.myfooterbar = false;
            }

          }
      }
  }]).directive('myLoading', function () {
      return {
          restrict: 'E',
          compile: function(element, attrs)
          {
           
            var htmlText ='<div class="overlay" id="overlay" ng-show="loading">'+
                            '<div class="spinner circles" ng-show="loading">'+
                              '<div></div>'+
                              '<div></div>'+
                              '<div></div>'+
                              '<div></div>'+
                              '<div></div>'+
                              '<div></div>'+
                              '<div></div>'+
                              '<div></div>'+
                            '</div>'+
                          '</div>';
            element.replaceWith(htmlText);
          },
          controller : function ($rootScope){
            $rootScope.loading = false;
          }
      }
  })
  .directive('previewWebpage', function () {
      return {
          restrict: 'E',
          templateUrl: 'template/template_user/template_preview.html'
      }
  })
  .directive('previewWebpageone', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/template_stadard_preview.html'
      }
  })
  .directive('topicBoard', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/topic_board.html',
          controller:"feedbackCtrl"

      }
  })
  .directive('topicFaq', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/topic_faq.html',
          controller:""

      }
  })
  .directive('topicAddvertisement', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/topic_addvertisement.html',
          controller:"boardadsCtrl"

      }
  })
  .directive('topicWebboard', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/topic_webboard.html',
          controller:"boardCtrl"


      }
  })
  .directive('myPagea', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/template_standard.html'
      }
  })
  .directive('serviceModul', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/service_modul.html'
      }
  })
  .directive('galleryModul', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/gallery_modul.html'
      }
  })
  .directive('loginModul', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/login_modul.html'
      }
  })
  .directive('myPageb', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/template_standard2.html'
      }
  })
  .directive('myPagec', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/template_standard3.html'
      }
  })
  .directive('controlpanelIndex', function () {
      return {
          restrict: 'E',
          templateUrl: 'template/form/controlpanel_index.html'
      }
  })
  .directive('controlpanelProfile', function () {
      return {
          restrict: 'E',
          templateUrl: 'template/form/controlpanel_profile.html'
      }
  })
  .directive('controlpanelPassword', function () { 
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_password.html'
      }
  })
  .directive('orengePin', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/orenge_pin.html'
      }
  })
  .directive('otherPin', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/other_pin.html'
      }
  })
  .directive('bluePin', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/blue_pin.html'
      }
  })
  .directive('controlpanelPayment', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_payment.html'
      }
  })
  .directive('controlpanelTopup', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_topup.html',
          controller:"InvoiceCtrl"
      }
  })
  .directive('controlpanelActive',['Active','$rootScope','$cookies','$route' ,function (Active,$rootScope,$cookies,$route) {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_active.html',
          controller : function($scope,$rootScope,$route){
            $scope.actives={};          
            $scope.active = function(){
              console.log('---------370 active')
              if($cookies.Tel!==undefined){
                Active.active({activecode:$scope.actives.otp,username:$cookies.Tel},function(response){
                  if(response.status==="0"){
                    alert('รหัสยืนยันผิดพลาด ลองใหม่อีกครั้งนะ');
                  }else{
                    alert('ยืนยันผู้ใช้เรียบร้อย!');
                    //$rootScope.checkPermission();
                  }
                });
              }else if($cookies.Email!=undefined){
                Active.active({activecode:$scope.actives.otp,username:$cookies.Email},function(response){
                  if(response.status==="0"){
                    alert('รหัสยืนยันผิดพลาด ลองใหม่อีกครั้งนะ');
                  }else{
                    alert('ยืนยันผู้ใช้เรียบร้อย!');
                    $rootScope.checkPermission();
                    $route.reload()
                  }
                });
              }
              
            };
          }
      }
  }])
  .directive('controlpanelRooms', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_rooms.html'
      }
  })
  .directive('controlpanelCustomers', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_customers.html'
      }
  })
  .directive('controlpanelReport', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_report.html'
      }
  })
  .directive('controlpanelCctv', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_cctv.html'
      }
  })
  .directive('controlpanelEmployee', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_employee.html'
      }
  })
  .directive('controlpanelFavorit', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_favorit.html',
          controller: function($scope,$cookies,Favorite){
            if($cookies.UID!==undefined){
              Favorite.get({user_id:$cookies.UID}, function (response) {
                  $scope.favoriteproperty = response;

                
              });
            }
          }
      }
  })
  .directive('propertyDetail', function (Propertys, Favorite) {
      return {
          restrict: 'AEC',
          template:'<td><p class="profile--p"><div title="Delete" ng-click="btnremove()"  class="icon--png__16px icon--false"></div></p></td>',
          link: function ($scope, elem, attributes, ngModel) {
            Propertys.query({_id:$scope.propertyId},function (res){
              var room_no = res.no_room === undefined ? "-" : res.no_room;
              var no_customers = res.no_customers === undefined ? "-" : res.no_customers;
              var no_room_ava = res.no_room_ava === undefined ? "-" : res.no_room_ava;
              var no_room_book = res.no_room_book === undefined ? "-" : res.no_room_book;
              var no_room_close = res.no_room_close === undefined ? "-" : res.no_room_close;
              var updated = res.updated === undefined ? "-" : res.updated;

                elem.prepend($scope.favoriteIndex+'<td><p class="profile--p"><a target="_blank" href="#!/info?_id='+res._id+'">'+res.title+'</a></p></td>'+
              '<td><p class="profile--p">'+room_no+'</p></td>'+
              '<td><p class="profile--p">'+no_customers+'</p></td>'+
              '<td><p class="profile--p">'+no_room_ava+'</p></td>'+
              '<td><p class="profile--p">'+no_room_book+'</p></td>'+
              '<td><p class="profile--p">'+no_room_close+'</p></td>'+
              '<td><p class="profile--p">'+updated+'</p></td>');});
           
          },
          scope: {
            favoriteIndex : "@favoriteIndex",
            propertyId: "@propertyId",
            ownerId : "@ownerId",
            eventHandler: '&ngClick'
          },
          controller: function ($scope, $cookies) {
           $scope.btnremove=function(){
                $scope.uid = $cookies.UID;
                Favorite.kill({user_id:$scope.uid, property_id: $scope.propertyId , owner_id:$scope.ownerId}, function (response){
                  console.log(response);
                
                });
                document.getElementById($scope.propertyId).remove();
              };
          }
      }
  })
  
  .directive('alertMassage', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/modal_alert.html'
      }
  })
  .directive('showSponsor', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/sponsor_ads.html',
          controller:'sponsorCtrl'
      }
  })
  
  .directive('controlpanelAds', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_ads.html'
      }
  })
  .directive('formcontactAdmin', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/form_contact_admin.html'
      }
  })
  .directive('controlpanelAdsdetail', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_ads_detail.html'
      }
  })
  .directive('controlpanelIndexmanage', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_index_manage.html'
      }
  })
  .directive('controlpanelIndexmanageregister', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_manage_register.html'
      }
  })
  .directive('controlpanelSite', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_site.html'
      }
  })
  .directive('controlpanelApartment', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_apartment.html'
      }
  })
  .directive('controlpanelNotichalert', function (socket) {
      return {
          restrict: 'AEC',
          templateUrl: 'template/form/controlpanel_notich_alert.html',
          controller: function($scope,$cookies,Favorite){
            var id ={};
            if($cookies.UID!==undefined){
              if($cookies.Permission!==5){
                
                Favorite.get({owner_id:$cookies.UID}, function (response) {
                  $scope.wasfavoritedproperty = response;                
                });
              }else{
                socket.emit('Noticesend', "admin");
                 Favorite.get({owner_id:"admin"}, function (response) {
                  
                  for (var i = response.length - 1; i >= 0; i--) {
                    
                    var text = response[i].propertyId.split(":")[0];
                    if(id[text]===undefined){
                      id[text]=response[i];
                      id[text].count = 1;
                    }else {
                      id[text].count =id[text].count+1 ;
                    }
                    
                    
                  };
                  $scope.wasfavoritedproperty = [];
                  var i =0;
                  angular.forEach(id, function (type,indata) {
                    $scope.wasfavoritedproperty[i]= type;
                    i++;
                  });
                                
                });
              }
              
            }
          }
      }
  })
  
  .directive('controlpanelNotich', function (User,$cookies) {
      return {
          restrict: 'E',
          templateUrl: 'template/form/controlpanel_notich.html',
           link: function ($scope, elem, attributes, ngModel) {
            $scope.choose={};
            $scope.choose.email_favoriteap = false;
            $scope.choose.favoriteap = false;
            $scope.mailnotice = false;
            $scope.notice = false;
            if($cookies.Favoriteap==="true"){
              User.query({email:$cookies.Email},function(res){
               console.log(res.email_favoriteap)
                if( res.email_favoriteap==="true"){
                  $scope.mailnotice =true;
                }
                if(res.favoriteap==="true"){
                  $scope.notice = true;
                }
                  
              
            });
            }
             
          },
          controller : function($scope){

            $scope.checkbox = function(){
              console.log($scope.choose.email_favoriteap)
              console.log($scope.choose.favoriteap)
            }
          }
      }
  })
  .directive('controlpanelMenu', function () {
      return {
          restrict: 'E',
          templateUrl: 'template/form/controlpanel_manu.html'
      }
  })
  .directive('previewWebpagetwo', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/template_preview2.html'
      }
  })
  .directive('previewWebpagethree', function () {
      return {
          restrict: 'AEC',
          templateUrl: 'template/template_user/template_preview3.html'
      }
  })

  
  .directive('formAddcustomers', function () {
      return {
          restrict: 'E',
          templateUrl: 'template/form/form_add_customers.html'
      }
  })
  .directive('formCreateapartment', function () {
      return {
          restrict: 'E',
          templateUrl: 'template/form/form_create_apartment.html',
          controller: function ($scope) {
            // body...
          }
      }
  })
  
  .directive('formEditapartment', function () {
      return {
          restrict: 'E',
          templateUrl: 'template/form/form_create_apartment.html',
          controller: function ($scope) {
            // body...
            //$scope.up.contact_name = "test";
            
          }
      }
  })
  .directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
      iElement.autocomplete({
        source: scope[iAttrs.uiItems],
        select: function() {
          $timeout(function() {
            iElement.trigger('input');
          }, 0);
        }
      });
    };
  })
  .directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ngModel){
      el.bind('change',function(){
        scope.$apply(function(){
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  }
  })
  .directive('helloHtml', [function () {
      return {
          restrict: 'E',
          templateUrl: 'template/hello.html',
          controller: function ($scope) {
            $scope.user = {
              name: 'awesome user'
            }; 
          }
      }
  }])
  .directive('webFooter', [function () {
      return {
          restrict: 'E',
          templateUrl: 'template/footer.html'
      }
  }]);
