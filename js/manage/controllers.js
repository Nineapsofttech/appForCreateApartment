 'use strict';

 /* Controllers */
 angular.module('manage.controllers', ['ngCookies', 'datePicker', 'ngTouch', 'ngAnimate', 'googlechart', 'ngSanitize', 'ui.calendar'])
   .controller('FlowCtrl', ['$scope', '$http', function($scope, $http) {
     $http.get('/page').success(function(data, status, headers, config) {
       $scope.pages = data;
     });
     $http.get('/flow').success(function(data, status, headers, config) {
       $scope.currentFlows = data;
     });
     $scope.flows = [];
     $scope.addPage = function(page) {
       for (var i = 0; i < $scope.flows.length; i++) {
         if ($scope.flows[i].title === page.title) {
           return;
         };
       };
       $scope.flows.push(page);
     };
     $scope.delete = function(page) {
       $http.post('/deletepage', {
         pageId: page._id
       }).success(function(data, status) {

       });
     };
     $scope.saveFlow = function() {
       $http.post('/flow', {
         flows: $scope.flows
       }).success(function(data, status) {
         //
       });
     };
   }])
   .controller('FlowDetailCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', function($scope, $http, $routeParams, $location, $cookies) {
     $scope.currentIndex = 0;
     $http.get('/flow/' + $routeParams.flowId).success(function(data, status, headers, config) {
       $scope.flow = data;
       $scope.next = $scope.flow.pages[$scope.currentIndex].next;
       $scope.back = $scope.flow.pages[$scope.currentIndex].back;
       $cookies.flowId = $routeParams.flowId;
       window.location = data.pages[0].url;
     });
   }]).controller('noteCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', 'Note', 'CompanyApi', function($scope, $http, $routeParams, $location, $cookies, Note, CompanyApi) {
     $scope.post = {};
     CompanyApi.get('', function(company) {
       $scope.post.company_ref = company._id;
       Note.get({
         company_ref: company._id
       }, function(result) {
         if (result.$resolved && result._id) {
           $scope.post = result;
         }
       });
     });
     $scope.save_note = function() {
       Note.post($scope.post, function(result) {
         if (result.$resolved) {
           $scope.post = result;
         };
       })
     }

   }]).controller('PrintReportAccountChartCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', 'Accounts',
     function($scope, $http, $routeParams, $location, $cookies, Accounts) {
       if ($routeParams.apartment_id) {
         Accounts.query({
           apartment_id: $routeParams.apartment_id
         }, function(result) {
           $scope.account_chart_list = result;
         });
       }

     }
   ])
   .controller('FlowAddPageCtrl', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
     $scope.page = {};
     if ($routeParams.pageId && $routeParams.pageId !== '') {
       $http.get('/page/' + $routeParams.pageId).success(function(data, status, headers, config) {
         $scope.page = data;
       });
     };
     $scope.save = function() {
       $http.post('/page', {
         page: $scope.page
       }).success(function(data, status, headers, config) {
         $location.path('/flow');
       });
     };
   }]).controller('CloseAccountantCtrl', ['$scope', '$http', '$routeParams', '$location', 'CompanyApi', 'Room', 'TransactionApi',
     function($scope, $http, $routeParams, $location, CompanyApi, Room, TransactionApi) {
       $scope.cash = 0;
       $scope.water = 0;
       $scope.elect = 0;
       $scope.room_rate = 0;
       $scope.furniture_rate = 0;
       $scope.telephone_fee = 0;
       $scope.credit = 0;
       $scope.debit = 0;
       $scope.credits = 0;
       TransactionApi.query({
         month: 0,
         property_id: $routeParams.apartment_id,
         year: 2015,
         transaction_type: 2
       }, function(result) {
         if (result.$resolved) {
           $scope.report_list = result;
           $scope.toDay = new Date();
           $scope.checkDate = new Date($scope.toDay.getFullYear(), $scope.toDay.getMonth(), $scope.toDay.getDate());

           for (var i = 0; i < $scope.report_list.length; i++) {
             $scope.report_date = new Date($scope.report_list[i].date);
             if ($scope.report_date >= $scope.checkDate) {
               console.log($scope.report_list[i])
               $scope.report_list[i].water_total = (($scope.report_list[i].water_meter[0].water_meter - $scope.report_list[i].water_meter[1].water_meter) * $scope.report_list[i].room_ref.room_water_extra);
               $scope.report_list[i].elect_total = (($scope.report_list[i].elect_meter[0].elect_meter - $scope.report_list[i].elect_meter[1].elect_meter) * $scope.report_list[i].room_ref.room_energy_extra);
               $scope.report_list[i].telephone = $scope.report_list[i].telephone_fee === undefined ? 0 : parseFloat($scope.report_list[i].telephone_fee);
               $scope.report_list[i].total_sum = parseFloat($scope.report_list[i].water_total) + parseFloat($scope.report_list[i].elect_total) + parseFloat($scope.report_list[i].room_ref.room_rate) + parseFloat($scope.report_list[i].room_ref.room_furniture) + parseFloat($scope.report_list[i].telephone);
               if ($scope.report_list[i].transfer_bank === "50" && $scope.report_list[i].transfer_price) {
                 $scope.cash += $scope.report_list[i].transfer_price;
               } else if ($scope.report_list[i].transfer_bank === "50" && $scope.report_list[i].transfer_price === undefined) {
                 $scope.cash += $scope.report_list[i].total_sum;
               } else if ($scope.report_list[i].transfer_bank && $scope.report_list[i].transfer_bank !== "50" && $scope.report_list[i].transfer_price) {
                 $scope.credit += $scope.report_list[i].transfer_price;
               } else {
                 $scope.credit += $scope.report_list[i].total_sum;
               }
               if ($scope.report_list[i].transfer_bank_extra === "50" && $scope.report_list[i].transfer_price_extra) {
                 $scope.cash += $scope.report_list[i].transfer_price_extra;
               } else if ($scope.report_list[i].transfer_bank_extra === "50" && $scope.report_list[i].transfer_price_extra === undefined) {
                 $scope.cash += $scope.report_list[i].total_sum;
               } else if ($scope.report_list[i].transfer_price_extra && $scope.report_list[i].transfer_bank_extra !== "50") {
                 $scope.credit += $scope.report_list[i].transfer_price_extra;
               } else {

               }
               $scope.water += $scope.report_list[i].water_total;
               $scope.elect += $scope.report_list[i].elect_total;
               $scope.telephone_fee += $scope.report_list[i].telephone;
               $scope.room_rate += $scope.report_list[i].room_ref.room_rate;
               $scope.furniture_rate += $scope.report_list[i].room_ref.room_furniture;
             }

           };
           $scope.debit = $scope.water + $scope.elect + $scope.telephone_fee + $scope.room_rate + $scope.furniture_rate;
           $scope.credits = $scope.cash + $scope.credit;
           console.log($scope.report_list);
           $scope.account_report = [{
             name: "รายได้ค่าน้ำประปา",
             value: $scope.water,
             account_code: '42011'
           }, {
             name: "รายได้ค่าไฟฟ้า",
             value: $scope.elect,
             account_code: '42012'
           }, {
             name: "รายได้ค่าโทรศัพท์",
             value: $scope.telephone_fee,
             account_code: '42013'
           }, {
             name: "รายได้จากการให้เช่าห้องพัก",
             value: $scope.room_rate,
             account_code: '42008'
           }, {
             name: "รายได้ค่าเช่าเฟอร์นิเจอร์",
             value: $scope.furniture_rate,
             account_code: '43007'
           }, {
             name: "เงินสด",
             value: $scope.cash,
             account_code: '11101'
           }, {
             name: "เงินผ่านธนาคาร",
             value: $scope.credit,
             account_code: '1110401'
           }];
           console.log($scope.account_report);
         }
       });

     }
   ])
   .controller('ManageCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'ResetDemo',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, ResetDemo) {
       angular.element(document).ready(function() {
         // call from app.js
         $rootScope.checkpermission();
         TransactionApi.query({
           stat_type: 1
         }, function OnGetStat(result) {
           //$log.log(result);
         });
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.resetdemo = function OnReset() {
           var r = confirm("คุณต้องการลบ ข้อมูล Demo ออกจากระบบ?");
           if (r == true) {
             ResetDemo.post({
               confirm_reset: 1
             }, function(result) {
               //$log.warn(result);
               $rootScope.checkpermission();
             });
           } else {

           }
         }
       });
     }
   ]).controller('ExpensesCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'ExpendApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, ExpendApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.select_properties = {};
         // if ($routeParams.building_id) {
         //   $scope.building_id = $routeParams.building_id;
         //   ExpendApi.query({
         //     building_id: $scope.building_id
         //   }, function(result) {
         //     if (result.$resolved) {
         //       $scope.expend_list = result;
         //       //console.log($scope.expend_list);
         //     }
         //   });
         // }
         $scope.select_building = function(newValue) {
           $location.path('manage_expenses').search('building_id=' + newValue);
           $location.replace();
         };
         CompanyApi.query({
           property_request: 1
         }, function(result) {
           if (result.$resolved) {
             $scope.property_list = result;
             if ($routeParams.apartment_id)
               for (var i = 0; i < $scope.property_list.length; i++) {
                 if ($routeParams.apartment_id === $scope.property_list[i]._id) {
                   $scope.select_properties = $scope.property_list[i];
                 }
               };
           }
         });

       });
       $scope.remove_expenses = function(id) {

         var r = confirm("คุณต้องการลบ ข้อมูลหรือไม่? ");
         if (r == true) {
           ExpendApi.remove({
             _id: id
           }, function(result) {
             if (result.$resolved) {
               ExpendApi.query({
                 building_id: $scope.building_id
               }, function(result) {
                 if (result.$resolved) {
                   $scope.expend_list = result;
                 }
               })
             } else {

             }
           })
         } else {

         }
       }
       $scope.select_property = function(newValue) {
         $location.path('manage_expenses').search('apartment_id=' + newValue);
         $location.replace();
       };
     }
   ]).controller('AddExpensesCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'ExpendApi', 'CompanyApi', 'Room', 'Accounts',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, ExpendApi, CompanyApi, Room, Accounts) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.room_list = [];
         $scope.post = {};
         if ($routeParams.building_id) {
           $scope.building_id = $routeParams.building_id;
           Room.query({
             building_ref: $scope.building_id
           }, function QueryBuilding(result) {
             if (result.$resolved) {
               for (var i = 0; i < result.length; i++) {
                 $scope.room_list.push({
                   _id: result[i]._id,
                   room_no: result[i].room_no
                 });
               };
               //console.log($scope.room_list);
             }
           });
         }
         Accounts.query({
           apartment_id: $routeParams.apartment_id,
           type: 5
         }, function(result) {
           $scope.expenses_list = result;
         })
       });
       $scope.insert = function() {
         //console.log("test");
         $scope.post.building_ref = $routeParams.building_id;
         //console.log($scope.post);
         ExpendApi.post($scope.post, function(result) {
           if (result.$resolved) {
             $location.path("manage_expenses").search("building_id=" + $routeParams.building_id);
             $location.replace();
           } else {

           }
         })
       };
       $scope.select_room = function(newValue) {
         $scope.post.room_ref = $scope.room_select._id;

       };
     }
   ]).controller('ManageDownloadCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         if ($routeParams.building_id) {
           $scope.building_id = $routeParams.building_id;
         }
       });
     }
   ]).controller('AccountChartDetailItemCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi', 'TransactionItem',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi, TransactionItem) {
       angular.element(document).ready(function() {

         $rootScope.checkpermission();
         if ($routeParams.account_id) {
           $scope.account_id = $routeParams.account_id;
           TransactionItem.query({
             account_id: $routeParams.account_id
           }, function(result) {
             if (result) {
               $scope.transaction_item = result;
             }
           });
         }
       });
     }
   ]).controller('PrintReportCompletePaidBillingCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi', 'InvoiceApi', 'ServerTime',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi, InvoiceApi, ServerTime) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.inv = [];
         $scope.water_total = 0;
         $scope.elect_total = 0;
         $scope.income_total = 0;
         $scope.telephone_total = 0
         $scope.room_total = 0;
         $scope.furniture_total = 0;
         $scope.movein_total = 0;
         $scope.movein_room_rate = 0;
         $scope.movein_furniture = 0;
         if ($routeParams.year && $routeParams.month) {
           $scope.reportdate = new Date($routeParams.year, $routeParams.month, 1);
         }
         if ($routeParams.apartment_id !== undefined) {
           TransactionApi.query({
             transaction_type: 2,
             property_id: $routeParams.apartment_id,
             year: $routeParams.year,
             month: $routeParams.month
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.report_list = result;
               for (var i = 0; i < $scope.report_list.length; i++) {
                 if ($scope.report_list[i] && $scope.report_list[i].transaction_type == 2) {
                   $scope.report_list[i].total_sum = 0;
                   if ($scope.report_list[i].water_meter && $scope.report_list[i].water_meter[0]) {
                     $scope.report_list[i].water_total = (($scope.report_list[i].water_meter[0].water_meter - $scope.report_list[i].water_meter[1].water_meter) * $scope.report_list[i].room_ref.room_water_extra);
                     $scope.report_list[i].total_sum += (($scope.report_list[i].water_meter[0].water_meter - $scope.report_list[i].water_meter[1].water_meter) * $scope.report_list[i].room_ref.room_water_extra);
                     $scope.water_total += $scope.report_list[i].water_total === undefined ? 0 : $scope.report_list[i].water_total;
                   }
                   if ($scope.report_list[i].elect_meter && $scope.report_list[i].elect_meter[0]) {
                     $scope.report_list[i].elect_total = (($scope.report_list[i].elect_meter[0].elect_meter - $scope.report_list[i].elect_meter[1].elect_meter) * $scope.report_list[i].room_ref.room_energy_extra);
                     $scope.report_list[i].total_sum += (($scope.report_list[i].elect_meter[0].elect_meter - $scope.report_list[i].elect_meter[1].elect_meter) * $scope.report_list[i].room_ref.room_energy_extra);
                     $scope.elect_total += $scope.report_list[i].elect_total === undefined ? 0 : $scope.report_list[i].elect_total;
                   }
                   if ($scope.report_list[i].room_ref && $scope.report_list[i].room_ref.room_rate) {
                     $scope.room_total += parseFloat($scope.report_list[i].room_ref.room_rate);
                     $scope.report_list[i].total_sum += parseFloat($scope.report_list[i].room_ref.room_rate);
                   }
                   if ($scope.report_list[i].room_ref && $scope.report_list[i].room_ref.room_furniture) {
                     $scope.furniture_total += parseFloat($scope.report_list[i].room_ref.room_furniture);
                     $scope.report_list[i].total_sum += parseFloat($scope.report_list[i].room_ref.room_furniture)
                   }
                   if ($scope.report_list[i] && $scope.report_list[i].telephone) {
                     $scope.telephone_total += parseFloat($scope.report_list[i].telephone.telephone_fee);
                     $scope.report_list[i].total_sum += parseFloat($scope.report_list[i].telephone.telephone_fee);
                   }
                   if ($scope.report_list[i].customer_ref)
                     $scope.report_list[i].name = $scope.report_list[i].customer_ref.name;
                 } else if ($scope.report_list[i] && $scope.report_list[i].transaction_type == 3 && $scope.report_list[i].status == 1) {
                   if ($scope.report_list[i].room_ref && $scope.report_list[i].room_ref.room_rate) {
                     $scope.movein_room_rate += parseFloat($scope.report_list[i].room_ref.room_rate);
                     $scope.report_list[i].total_sum += parseFloat($scope.report_list[i].room_ref.room_rate);
                   }
                   if ($scope.report_list[i].room_ref && $scope.report_list[i].room_ref.room_furniture) {
                     $scope.movein_furniture += parseFloat($scope.report_list[i].room_ref.room_furniture);
                     $scope.report_list[i].total_sum += parseFloat($scope.report_list[i].room_ref.room_furniture)
                   }
                   if ($scope.report_list[i].customer_ref)
                     $scope.report_list[i].name = $scope.report_list[i].customer_ref.name;
                 }
               }
               $scope.income_total = $scope.water_total + $scope.elect_total + $scope.telephone_total + $scope.room_total + $scope.furniture_total;
               $scope.movein_total = $scope.movein_furniture + $scope.movein_room_rate;
               console.log($scope.furniture_total);
               console.log($scope.income_total);
               TransactionApi.query({
                 property_id: $routeParams.apartment_id,
                 year: $routeParams.year,
                 month: $routeParams.month,
                 remain: 1
               }, function(result) {
                 for (var i = 0; i < result.length; i++) {
                   $scope.report_list.push(result[i]);
                 };
               })
             }
           });
         } else if ($routeParams.transaction_id) {
           TransactionApi.get({
             transaction_id: $routeParams.transaction_id
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.$watch('report_list', function(a, b) {
                 //console.log(a);
                 //console.log(b);
               });
               $scope.report_list = [result];

             }
             //$log.log(result);
           });
         }
         $scope.$watch('report_list', function(a, b) {
           if (a) {


             $scope._invoice = function(result) {
               //console.log(result);

               for (var i = 0; i < $scope.report_list.length; i++) {
                 for (var j = 0; j < result.length; j++) {
                   if ($scope.report_list[i]._id === result[j].transaction_ref && $scope.report_list[i].transaction_type == 2) {
                     try {
                       $scope.report_list[i]._inv = result[j];
                       $scope.report_list[i]._invorder = result[j].running;
                       $scope.report_list[i]._inv = result[j];
                       $scope.report_list[i]._invorder = result[j].running;
                     } catch (e) {
                       //$scope.report_list.splice(i, 1);
                       console.log(e);
                     }
                   }
                 };
               }
               console.log($scope.furniture_total);
               console.log($scope.income_total);

             };
             for (var i = 0; i < $scope.report_list.length; i++) {
               $scope.inv.push($scope.report_list[i]._id);
             };
             InvoiceApi.post_query({
               invoice: $scope.inv
             }, $scope._invoice);
           }


         })

       });
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
         //console.log($scope.server_time);
       });
     }
   ]).controller('ManageAccountChart', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi', 'Accounts',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi, Accounts) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         if ($routeParams.building_id) {
           $scope.building_id = $routeParams.building_id;
         }
       });
       //       $scope.select_properties = {};

       $scope.selected = function(a) {
         $location.path('/manage_account_chart').search("apartment_id=" + a);
         $location.replace();
       }
       Accounts.query({
         apartment_id: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           $scope.account_chart = result;
         }
       });

       CompanyApi.query({
         property_request: 1
       }, function(result) {
         if (result.$resolved) {
           $scope.property_list = result;
           if ($routeParams.apartment_id) {
             for (var i = 0; i < $scope.property_list.length; i++) {
               if ($routeParams.apartment_id === $scope.property_list[i]._id) {
                 $scope.select_properties = $scope.property_list[i];
               }
             };
           }
         }
       });
     }
   ]).controller('AddAccountChart', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi', 'Accounts',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi, Accounts) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.post = {};
         if ($routeParams.apartment_id && $routeParams.account_type) {
           $scope.post.type = $routeParams.account_type;
           $scope.post.property_id = $routeParams.apartment_id;
           $scope.building_id = $routeParams.building_id;
         }
         $scope.insert = function() {
           $scope.post.account_code = $scope.post.type + '' + $scope.post.prependcode;
           console.log($scope.post);
         };
         $scope.$watch('post.prependcode', function(a, b) {
           //Accounts.get()
           $scope.post.account_code = $scope.post.type + '' + a;
           console.log(a);
         });

       });
     }
   ]).controller('EditAccountChart', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.post = {};
         if ($routeParams.building_id) {
           $scope.building_id = $routeParams.building_id;
         }
       });
     }
   ]).controller('AccountChartDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi', 'Accounts',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi, Accounts) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.post = {};
         if ($routeParams.apartment_id && $routeParams.account_type) {
           $scope.apartment_id = $routeParams.apartment_id;
           $scope.account_type = $routeParams.account_type;
           Accounts.query({
             apartment_id: $routeParams.apartment_id,
             type: $routeParams.account_type
           }, function(result) {
             if (result.$resolved) {
               $scope.account_list = result;
             }
           })
         } else {

         }
       });
     }
   ]).controller('EditAccountChartItem', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.post = {};
         if ($routeParams.building_id) {
           $scope.building_id = $routeParams.building_id;
         }
       });
     }
   ]).controller('PrintBankBillPaymentCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.post = {};
         if ($routeParams.building_id) {
           $scope.building_id = $routeParams.building_id;
         }
       });
     }
   ]).controller('AddAccountChartDetailItemCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi', 'TransactionItem',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi, TransactionItem) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.select_properties = {};
         $scope.post = {};
         if ($routeParams.account_id) {
           $scope.post.account_chart_ref = $routeParams.account_id;
         }
         $scope.insert = function() {
           if ($scope.post.account_chart_ref === undefined) {
             alert('ทำรายการไม่สำเร็จ กรุณาทำรายการใหม่ตั้งแต่ต้น');
           } else {
             TransactionItem.post($scope.post, function(result) {
               if (result.$resolved) {
                 if (result.err) {
                   alert(result.err);
                 } else {
                   alert("เพิ่ม " + result.name + " สำเร็จ");
                 }
               }
             })
           }

         }

         CompanyApi.query({
           property_request: 1
         }, function(result) {
           if (result.$resolved) {
             $scope.property_list = result;
             if ($routeParams.property_id)
               for (var i = 0; i < $scope.property_list.length; i++) {
                 if ($routeParams.property_id === $scope.property_list[i]._id) {
                   $scope.select_properties = $scope.property_list[i];

                 }
               };
           }
         });

       });
     }
   ]).controller('AddEmployeeCompanyCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         if ($routeParams.building_id) {
           $scope.building_id = $routeParams.building_id;
         }
       });
       $scope.post = {};

       $scope.search_user = function() {
         CompanyApi.query({
           search_user: $scope.search_name
         }, function(result) {
           if (result.$resolved) {
             $scope.user_list = result;
           }
         });
       }
       $scope.insert = function() {
         CompanyApi.put({
           company_id: $routeParams.company_id,
           user_ref: $scope.post.owner
         }, function(result) {
           if (result.$resolved) {
             $location.path('company_detail').search("company_id=" + $routeParams.company_id);
             $location.replace();
           }
         });
       }
     }
   ]).controller('ManageCompanyCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
       });
       CompanyApi.query('', function(results) {
         if (results.$resolved) {
           $scope.company_list = results;
         }
       });
       $scope.del = function DeleteInventory(id, name) {
         var r = confirm("คุณต้องการลบ " + name + " ออกจากระบบ");
         if (r == true) {
           CompanyApi.remove({
             _id: id
           }, function(result) {
             if (result.$resolved) {
               CompanyApi.query('', function(results) {
                 if (results.$resolved) {
                   $scope.company_list = results;
                 }
               });
             } else {

             }
           });
         } else {

         }

       }
     }
   ]).controller('CompanyDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
       });
       CompanyApi.get({
         company_id: $routeParams.company_id
       }, function(results) {
         if (results.$resolved) {
           $scope.company = results;
         }
       });
     }
   ]).controller('AddCompanyOwnerCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
       });
       $scope.post = {};

       $scope.search_user = function() {
         CompanyApi.query({
           search_user: $scope.search_name
         }, function(result) {
           if (result.$resolved) {
             $scope.user_list = result;
           }
         });
       }
       $scope.insert = function() {
         CompanyApi.put({
           company_id: $routeParams.company_id,
           owner: $scope.post.owner
         }, function(result) {
           if (result.$resolved) {
             $location.path('company_detail').search("company_id=" + $routeParams.company_id);
             $location.replace();
           }
         });
       }

     }
   ]).controller('EditCompanyCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
       });
       $scope.insert = function() {
         CompanyApi.put({
           company_id: $routeParams.company_id,
           company_name: $scope.post.owner
         }, function(result) {
           if (result.$resolved) {
             $location.path('company_detail').search("company_id=" + $routeParams.company_id);
             $location.replace();
           }
         });
       }
     }
   ]).controller('EditCompanyOwnerCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
       });
     }
   ]).controller('AddCompanyCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
       });
       $scope.insert = function() {
         //console.log("posted");
         if ($scope.post.company_name !== undefined) {
           CompanyApi.post($scope.post, function(result) {
             if (result.$resolved && result.err === undefined) {
               $location.path('manage_company');
               $location.replace();
             } else {
               alert(result.err);
               $location.path('manage_company');
               $location.replace();
             }
           })
         }
       }
     }
   ]).controller('ManagePhoneCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'PhoneApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, PhoneApi, CompanyApi) {
       $scope.list = {};
       $scope.list.post = {};
       $scope.csv_array = {};
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.compare = function Oncompare() {
         for (var i = 0; i < $scope.room_list.length; i++) {
           $scope.room_list[i].post.elect_meter = parseFloat($scope.csv_array[$scope.room_list[i].room_name]);
         };
         $scope.$apply();
         //console.log($scope.room_list);
       };
       $scope.save_all_csv = function() {
         var r = confirm("คุณต้องการบันทึกค่าน้ำค่าไฟต่าโทรศัพท์ทุกห้องหรือไม่");
         if (r == true) {
           for (var i = 0; i < $scope.room_list.length; i++) {
             $scope.insert($scope.room_list[i]._id);
           };

         } else {

         }

       };
       $scope.$watch('csv_array', function(a, b) {
         //console.log(a);
         //console.log(b);
       })
       $scope.upload_csv = function process_csv(evt) {
         var f = evt.files[0];
         //console.log(f)
         if (f.type === "text/csv") {
           var r = new FileReader();
           r.onload = function(e) {
               //console.log(e);
               var contents = e.target.result;
               for (var i = 0; i < contents.split(/\n/g).length; i++) {
                 if (contents.split(/\n/g)[i].split(',')[6] !== undefined) {
                   $scope.csv_array[contents.split(/\n/g)[i].split(',')[0]] = contents.split(/\n/g)[i].split(',')[6];
                 } else if (contents.split(/\n/g)[i].split(',').length == 2 && contents.split(/\n/g)[i].split(',')[1] !== undefined) {
                   $scope.csv_array[contents.split(/\n/g)[i].split(',')[0]] = contents.split(/\n/g)[i].split(',')[1];
                 } else {

                 }
               };
               $scope.compare();
             }
             //console.log($scope.csv_array);

           r.readAsText(f);
         } else {
           alert("Failed to load file");
         }


       };
       $scope.select = {
         person: {}
       };
       Room.query({
         building_ref: $routeParams.building_id
       }, function QueryBuilding(result) {
         CompanyApi.query({
           building_request: 1
         }, function(result) {
           for (var i = 0; i < result.length; i++) {
             if (result[i]._id.toString() === $routeParams.building_id.toString()) {
               $scope.building = result[i];
             }
           };
         });
         $scope.room_list = result;


         for (var i = 0; i < $scope.room_list.length; i++) {
           $scope.room_list[i].post = {};
           PhoneApi.query({
             room_ref: $scope.room_list[i]._id,
             limit: 2
           }, function(telephone_fee) {
             for (var j = $scope.room_list.length - 1; j >= 0; j--) {
               try {
                 if ($scope.room_list[j]._id === telephone_fee[0].room_ref._id) {
                   $scope.room_list[j].before_telephone_fee = telephone_fee[1];
                   $scope.room_list[j].after_telephone_fee = telephone_fee[0];
                   $scope.toDay = new Date();
                   $scope.room_date = new Date(telephone_fee[0].date);
                   if ($scope.toDay.getDate() == $scope.room_date.getDate() && $scope.toDay.getDate() == $scope.room_date.getDate()) {
                     $scope.room_list[j].post.isUptodate = true;
                   } else {
                     $scope.room_list[j].post.isUptodate = false;
                   }
                 }
               } catch (e) {

               }

             };
           });
         };

       });
       $scope.insert = function(id, j) {
         $scope.telephone_fee = {};
         $scope.telephone_fee.room_ref = id;

         for (var i = $scope.room_list.length - 1; i >= 0; i--) {
           if ($scope.room_list[i]._id === id) {
             $scope.telephone_fee.telephone_fee = $scope.room_list[i].post.telephone_fee;
           }
         };
         PhoneApi.post($scope.telephone_fee, function(result) {
           if (result.$resolved) {
             PhoneApi.query({
               room_ref: id,
               limit: 2
             }, function(telephone_fee) {
               for (var j = $scope.room_list.length - 1; j >= 0; j--) {
                 try {
                   if ($scope.room_list[j]._id === telephone_fee[0].room_ref._id) {
                     $scope.room_list[j].before_telephone_fee = telephone_fee[1];
                     $scope.room_list[j].after_telephone_fee = telephone_fee[0];
                     $scope.toDay = new Date();
                     $scope.room_date = new Date(telephone_fee[0].date);
                     if ($scope.toDay.getDate() == $scope.room_date.getDate() && $scope.toDay.getDate() == $scope.room_date.getDate()) {
                       $scope.room_list[j].post.isUptodate = true;
                     } else {
                       $scope.room_list[j].post.isUptodate = false;
                     }
                   }
                 } catch (e) {

                 }

               };
             });
           }
         });
       };

       $scope.edit_meter = function OneditPhoneBill(id) {
         for (var i = $scope.room_list.length - 1; i >= 0; i--) {
           if ($scope.room_list[i]._id === id) {
             $scope.edit_meter_value = {};
             $scope.edit_meter_value.telephone_fee = $scope.room_list[i].edit.after_telephone_fee.telephone_fee;
             $scope.edit_meter_value._id = $scope.room_list[i].after_telephone_fee._id;
             PhoneApi.post($scope.edit_meter_value, function(telephone_fee) {
               if (telephone_fee.$resolved) {
                 for (var i = $scope.room_list.length - 1; i >= 0; i--) {
                   if ($scope.room_list[i]._id === id) {
                     $scope.room_list[i].after_telephone_fee.telephone_fee = telephone_fee.telephone_fee;
                   }
                 }
               }
             });
           }
         };

       };

       $scope.select_building = function(newValue) {
         $location.path('manage_phone').search('building_id=' + newValue);
         $location.replace();
       };
     }
   ]).controller('CashierInvoiceCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'ReceiptApi',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, ReceiptApi) {
       angular.element(document).ready(function() {
         // call from app.js
         $rootScope.checkpermission();
         $scope.customer_ref = {};
         $scope.event = 0;
         $scope.pay_status = 0;
         // $location.hash("goTop");
         // $anchorScroll();

         $scope.save_payment = function(key) {
           //console.log(key);
           if (key.keyCode == 13 && $scope.pay_status == 0) {
             $scope.pay_status = 1
             ReceiptApi.post({
               invoice: $scope.transaction._id
             }, function(result) {
               if (result.$resolved && result._id) {
                 window.open("/manager#!/print_report_vat?transaction_id=" + result._id, "_blank");
               } else {
                 alert("ทำรายการไม่สำเร็จ");
               }

             });

           }
         }
         if ($routeParams.pay_id !== undefined) {
           TransactionApi.get({
             receipt: $routeParams.pay_id
           }, function(result) {
             if (result.$resolved) {
               //console.log(result);
               $scope.transaction = result;
               $scope.amount = result.room_ref.room_rate + result.room_ref.room_furniture + ((result.water_meter[0].water_meter - result.water_meter[1].water_meter) * result.room_ref.room_water_extra);
               $scope.amount += (result.elect_meter[0].elect_meter - result.elect_meter[1].elect_meter) * result.room_ref.room_energy_extra;
               $scope.customer_ref = result.customer_ref;
               $scope.room_no = result.room_ref.room_no;
             }
           });
         } else {

         }

       });
     }
   ]).controller('ReportAdminCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'ResetDemo',
     function($scope, $rootScope, $routeParams, $log, $anchorScroll, $location, TransactionApi, ResetDemo) {
       angular.element(document).ready(function() {
         // call from app.js

         TransactionApi.query({
           stat_type: 1
         }, function OnGetStat(result) {
           //$log.log(result);
         });
         $scope.chart_txt = "รายรับ";
         $scope.chart_type = "ColumnChart";
         $scope.chart_type_text = "กราฟ";
         $scope.chart_params = "building_income";

         $scope.change_params = function(params) {
           if (params == 1) {
             $scope.chart_params = "building_income";
             $scope.chart_txt = "รายรับ";
           } else if (params == 2) {
             $scope.chart_params = "predict_building_income";
             $scope.chart_txt = "ประมาณการณ์รายรับ";
           }
           $scope.initchart();
         };
         $scope.change_chart = function() {

           if ($scope.chart_type === "ColumnChart") {
             $scope.chart_type = "Table";
             $scope.chart_type_text = "กราฟ";
           } else {
             $scope.chart_type = "ColumnChart"
             $scope.chart_type_text = "ตาราง";
           }
           $scope.initchart();
         };
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.resetdemo = function OnReset() {
           var r = confirm("คุณต้องการลบ ข้อมูล Demo ออกจากระบบ?");
           if (r == true) {

             ResetDemo.post({
               confirm_reset: 1
             }, function(result) {
               //$log.warn(result);
               $rootScope.checkpermission();
             });
           } else {

           }
         }

         var dataObj = {},
           dataObj2 = {};
         dataObj.cols = [{
           "id": "รายการ",
           "label": "รายการ",
           "type": "string"
         }];
         dataObj.rows = [{
           c: [{
             v: "ค่าน้ำ"
           }]
         }, {
           c: [{
             v: "ค่าไฟ"
           }]
         }, {
           c: [{
             v: "ค่าโทรศัพท์"
           }]
         }, {
           c: [{
             v: "ค่าห้อง"
           }]
         }, {
           c: [{
             v: "ค่าเฟอร์นิเจอร์"
           }]
         }, {
           c: [{
             v: "รวม"
           }]
         }];



         $scope.initchart = function() {
           var total = 0;
           var water_total = 0;
           var elect_total = 0;
           var telephone_total = 0;
           var room_total = 0;
           var furniture_total = 0;
           dataObj = {};
           dataObj.cols = [{
             "id": "รายการ",
             "label": "รายการ",
             "type": "string"
           }];
           dataObj.rows = [{
             c: [{
               v: "ค่าน้ำ"
             }]
           }, {
             c: [{
               v: "ค่าไฟ"
             }]
           }, {
             c: [{
               v: "ค่าโทรศัพท์"
             }]
           }, {
             c: [{
               v: "ค่าห้อง"
             }]
           }, {
             c: [{
               v: "ค่าเฟอร์นิเจอร์"
             }]
           }, {
             c: [{
               v: "รวม"
             }]
           }];
           for (var i = 0; i < $rootScope.building_list.length; i++) {
             dataObj.cols.push({
               "id": $rootScope.building_list[i].building,
               "label": $rootScope.building_list[i].building,
               "type": "number"
             });
             var building_inst = $rootScope.building_list[i];
             (function(building_inst) {
               dataObj.rows[0].c.push({
                 v: building_inst[$scope.chart_params].water
               });
               dataObj.rows[1].c.push({
                 v: building_inst[$scope.chart_params].elect
               });
               dataObj.rows[2].c.push({
                 v: building_inst[$scope.chart_params].telephone
               });
               dataObj.rows[3].c.push({
                 v: building_inst[$scope.chart_params].room_rate
               });
               dataObj.rows[4].c.push({
                 v: building_inst[$scope.chart_params].furniture
               });
               dataObj.rows[5].c.push({
                 v: building_inst[$scope.chart_params].income
               });
               water_total += building_inst[$scope.chart_params].water;
               elect_total += building_inst[$scope.chart_params].elect;
               telephone_total += building_inst[$scope.chart_params].telephone;
               room_total += building_inst[$scope.chart_params].room_rate;
               furniture_total += building_inst[$scope.chart_params].furniture;
               total += building_inst[$scope.chart_params]
                 .income;
             }(building_inst));

           };

           dataObj.cols.push({
             "id": "รวม",
             "label": "รวม",
             "type": "number"
           });
           dataObj.rows[0].c.push({
             v: water_total
           });
           dataObj.rows[1].c.push({
             v: elect_total
           });
           dataObj.rows[2].c.push({
             v: telephone_total
           });
           dataObj.rows[3].c.push({
             v: room_total
           });
           dataObj.rows[4].c.push({
             v: furniture_total
           });
           dataObj.rows[5].c.push({
             v: total
           });

           var chart1 = {};
           chart1.type = $scope.chart_type;
           chart1.cssStyle = "height:500px; width:100%;";
           chart1.data = dataObj;

           chart1.options = {
             "title": $scope.chart_txt + "ประจำเดือน",
             "isStacked": "false",
             "fill": 50,
             "displayExactValues": true,
             "vAxis": {
               "title": $scope.chart_txt,
               "gridlines": {
                 "count": 6
               }
             },
             "hAxis": {
               "title": "ประเภท"
             }
           };

           chart1.formatters = {};

           $scope.chart = chart1;


         };




         setTimeout(function() {
           $scope.initchart();
         }, 3000)
       });
     }
   ])
   .controller('editBuildingCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Adsservice',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Adsservice) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.building = {};
       Building.get({
         building_id: $routeParams.building_id
       }, function OnGetDetail(result) {
         $scope.building = result;
       });
       $scope.editbuilding = function OnEditBuilding() {
         if ($scope.building.user_ref) {
           Building.post({
             building: $scope.building
           }, function AddBuildingCallback(result) {
             //$log.warn(result);
             Building.query({
               user_ref: $cookies.UID
             }, function(result) {
               $rootScope.building_list = result;
               $rootScope.initwaiting = 1;
               $location.path('manage_building');
               $location.replace();

             });
           });
         } else {
           alert("กรุณา login หรือ หรือเปิดใช้งาน Cookies หากขัดข้องกรุณาติดต่อเจ้าหน้าที่");
         }

       };
     }
   ]).controller('editRoomCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'InventoryApi', 'UtilityApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, InventoryApi, UtilityApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.inventory_list = [];
       $scope.inventory_room_list = [];
       $scope.utility_room_list = [];
       $scope.utility_list = [];
       $scope.room = {};
       $scope.room.images = [];
       $scope.services = [];

       Room.get({
         _id: $routeParams.room_id
       }, function OnGetDetail(result) {
         $scope.room = result;
         if (!$scope.room.images) {
           $scope.room.images = [];
         }

         if ($scope.room.utility_list) {
           for (var i = 0; i < $scope.room.utility_list.length; i++) {
             $scope.utility_room_list.push({
               utility_name: $scope.room.utility_list[i]
             });
           };
         }
         if ($scope.room.inventory_list) {
           for (var i = 0; i < $scope.room.inventory_list.length; i++) {
             $scope.inventory_room_list.push({
               inventory_name: $scope.room.inventory_list[i]
             });
           };
         }

         $scope.services = $scope.room.service;
       });
       $scope.imagesupload = function(evt) {
         ////console.log("uploading");
         var test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };
           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.room.images.push(xhr.responseText);
               $scope.$apply();
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/resizeimage");
           xhr.send(test);
         }
       };
       InventoryApi.query({
         building_ref: $routeParams.building_id
       }, function(result) {

         if (result.$resolved) {
           $scope.inventory_list = result
             //$log.log("test inventory List");
             //$log.log($scope.inventory_list);
         } else {

         }
       });
       UtilityApi.query({
         building_ref: $routeParams.building_id
       }, function(result) {

         if (result.$resolved) {
           $scope.utility_list = result
             //$log.log("test utility_list List");
             //$log.log($scope.utility_list);
         } else {

         }
       });

       $scope.editroom = function OnEditBuilding() {
         if ($cookies.UID) {
           $scope.room.inventory_list = [];
           for (var i = 0; i < $scope.inventory_room_list.length; i++) {
             $scope.room.inventory_list.push($scope.inventory_room_list[i].inventory_name._id);
           };
           $scope.room.utility_list = [];
           for (var i = 0; i < $scope.utility_room_list.length; i++) {
             $scope.room.utility_list.push($scope.utility_room_list[i].utility_name._id);
           };
           //$log.warn($scope.services);
           //$log.log($scope.room);
           $scope.room.room_rate_daily = parseInt($scope.room.room_rate_daily);
           $scope.room.service = $scope.services;
           Room.post({
             room: $scope.room
           }, function AddBuildingCallback(result) {
             //$log.warn(result);
             $location.path('/manage_room').search("building_id=" + result.building_ref);
             $location.replace();
           });
         } else {
           alert("กรุณา login หรือ หรือเปิดใช้งาน Cookies หากขัดข้องกรุณาติดต่อเจ้าหน้าที่");
         }
       };
     }
   ])
   .controller('EditPropertyCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Adsservice', 'PropertyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Adsservice, PropertyApi) {
       $scope.bank_details = [];

       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       PropertyApi.get({
         _id: $routeParams.property_id
       }, function(result) {
         $scope.post = result;
         if (result.location[0] === undefined) {
           $scope.post.location[0] = 0;
         };
         if (result.location[1] === undefined) {
           $scope.post.location[1] = 0;
         };
         if ($scope.post.bank_detail) {
           $scope.bank_details = $scope.post.bank_detail;
         } else {
           $scope.post.bank_detail = [];
         }
         //$log.log('post');
         //$log.log($scope.post);
       });
       $scope.getlocation = function() {
         if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
             $scope.post.location[1] = position.coords.latitude;
             $scope.post.location[0] = position.coords.longitude;

           });
         } else {
           alert('กรุณาเปิด GPS ด้วยนะ');
         }
       }
       $scope.isDuplicate = function() {
         Duplicate.query({
           namespace: $scope.post.namespace
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
             }
           }

         });
       };
       $scope.logoupload = function(evt) {
         ////console.log("uploading");
         var logo = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           logo.append("image", evt.files[0]);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.logo = xhr.responseText;
               $scope.$apply();
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/resizeimage");
           xhr.send(logo);
         }
       };

       $scope.imageheaderupload = function(evt) {
         ////console.log("uploading");
         var header = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           header.append("image", evt.files[0]);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.image_header = xhr.responseText;
               $scope.$apply();
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/resizeimage");
           xhr.send(header);
         }
       };


       $scope.imagesupload = function(evt) {
         ////console.log("uploading");
         var test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.images.push(xhr.responseText);
               $scope.$apply();
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/resizeimage");
           xhr.send(test);
         }
       };


       $scope.editproperty = function function_name(name, method) {
         $scope.post.bank_detail = $scope.bank_details;
         PropertyApi.post($scope.post, function(result) {
           //$log.warn(result);
           $location.path('manage_property');
           $location.replace();
         });
       };

     }
   ]).controller('ConfirmRentCtrl', ['$window', '$filter', '$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'PropertyApi', 'CustomerApi', 'TransactionApi',
     function($window, $filter, $scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, PropertyApi, CustomerApi, TransactionApi) {

       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         var upper = "example1234";
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($rootScope.transaction.customer_ref.toUpperCase(), "code39");
         $('#bar_key2').barcode($scope.codetoupper, "code39");
         //console.log('dghkjfblafnblkNSBlkSNFBLwfljbSLFB;SDMBLjNSFLBkS:FNV,SADC;nsFbjlnszlkvlksDNV')
         //console.log($rootScope.transaction);
       });

       $scope.roomid = $routeParams.room_id;
       $scope.select = {
         person: {}
       };
       //$scope.pricetostring = $filter('thbToString')($rootScope.post.reserve_price);
       $scope.confirmwaiting = 0;
       $scope.confirm_submit = function Onsubmit() {
         $scope.confirmwaiting = 1;
         delete $rootScope.post._id;
         for (var i = $rootScope.building_list.length - 1; i >= 0; i--) {
           if ($rootScope.building_list[i]._id === $rootScope.post.building_ref) {
             $rootScope.post.property_ref = $rootScope.building_list[i].property_ref;
           }
         };
         $rootScope.transaction.transaction_type = 1;
         $rootScope.transaction.transaction_step = 2;
         TransactionApi.post($rootScope.transaction, function save(result) {
           //console.log(result);
           if (result && result._id) {
             Room.post({
               confirm: result.room_ref,
               room_status: 1
             }, function OnUpdateRoom(argument) {
               // body...
               //$log.log(argument);
             });
             $scope.confirmwaiting = 0;
             $location.path('print_report_booking').search("transaction_id=" + result._id);
             $location.replace();
           } else {
             alert("error");
           }
         });
       };



       $scope.customerquerylist = [];
       if ($rootScope.select) {
         if ($rootScope.select.person) {
           for (var key in $rootScope.select.person) {
             if ($rootScope.select.person[key]) {
               $scope.customerquerylist.push(key);
             }
           }
           if ($scope.customerquerylist.length === 0) {
             $location.path('select_customer');
             $location.replace();
           } else if ($scope.customerquerylist.length === 1) {
             CustomerApi.get({
               _id: $scope.customerquerylist[0]
             }, function(result) {
               $scope.customer_list = [];
               $scope.customer_list.push(result);
               //$log.warn($scope.customer_list);
             });
           } else {
             CustomerApi.query({
               person_list: $scope.customerquerylist
             }, function(result) {
               $scope.customer_list = result;
               //$log.warn($scope.customer_list);
             });
           }
         } else {
           $location.path('select_customer');
           $location.replace();
         }

       } else {
         $location.path('select_customer');
         $location.replace();
       }
     }
   ]).controller('ManageBillingCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'TransactionApi', 'ReceiptApi', 'CompanyApi', 'ServerTime',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, TransactionApi, ReceiptApi, CompanyApi, ServerTime) {
       $rootScope.checkpermission();
       $scope.searchinvoice = '';
       $scope.select = {
         person: {}
       };
       $scope.pay = 0;
       $scope.bank_post = {};
       $scope.bank_post.transfer_bank_extra = {};
       $scope.bank_post.pay_extra = 0;
       $scope.select_properties = {};
       $scope.select_properties.title='เลือก';
       $scope.customer_ref = {};
       $scope.event = 0;
       $scope.pay_status = 0;
       $scope.$watch('searchinvoice',function function_name (a,b) {
         console.log(a +'  :  '+b);
       })
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
       });
       CompanyApi.query({
         property_request: 1
       }, function(result) {
         if (result.$resolved) {
           $scope.property_list = result;
           console.log(result.length)
           if (result.length == 1) {
             $scope.select_properties = result[0];
           } else if(result.length>1) {
             if ($routeParams.property_id) {
               for (var i = 0; i < $scope.property_list.length; i++) {
                 if ($routeParams.property_id === $scope.property_list[i]._id) {
                   $scope.select_properties = $scope.property_list[i];
                 }
               };
             }else{
              $scope.select_properties = result[0];
             }
           }

         }
       });
       $scope.pay_change = function(key) {
         try {
           $scope.pay = parseInt(key);
           $scope.pay_status = 0;
         } catch (e) {
           $scope.pay = 0;
         }
       };
       $scope.save_payment = function() {
         console.log($scope.pay + " : " + $scope.amount);
         if ($scope.pay_status == 0 && ((($scope.pay + $scope.bank_post.pay_extra) - $scope.amount) >= 0)) {
           $scope.pay_status = 1;
           ReceiptApi.post({
             invoice: $scope.transaction._id,
             transfer_bank: $scope.bank_post.transfer_bank.bank_name,
             transfer_date: $scope.bank_post.transfer_date,
             transfer_ref: $scope.bank_post.transfer_ref,
             transfer_price_extra: $scope.bank_post.pay_extra,
             transfer_bank_extra: $scope.bank_post.transfer_bank_extra.bank_name,
             transfer_ref_extra: $scope.bank_post.transfer_ref_extra,
             transfer_date_extra: $scope.bank_post.transfer_date_extra,
             transfer_price: $scope.pay,
           }, function(result) {
             if (result.$resolved && result._id) {
               window.open("/manager#!/print_report_vat?transaction_id=" + result._id, "_self");
               $scope.pay_status = 0;
             } else {
               alert("ทำรายการไม่สำเร็จ");
             }
           });
         } else if ($scope.pay_status == 0 && ((($scope.pay + $scope.bank_post.pay_extra) - $scope.amount) <= 0)) {
           alert("กรุณาใส่ยอดเงินให้ถูกต้อง ยังขาดอยู่ " + (-1 * (($scope.pay + $scope.bank_post.pay_extra) - $scope.amount)) + " บาท");
           $scope.pay_status = 0;
         } else {
           console.log((($scope.pay + $scope.bank_post.pay_extra) - $scope.amount));

         }
       }
       if ($routeParams.pay_id !== undefined) {
         TransactionApi.get({
           receipt: $routeParams.pay_id
         }, function(result) {
           if (result.$resolved) {
             //console.log(result);
             $scope.transaction = result;
             $scope.ST = new Date($scope.server_time);
             $scope.PT = new Date($scope.transaction.date_death_line);
             $scope.amount = result.room_ref.room_rate + result.room_ref.room_furniture + ((result.water_meter[0].water_meter - result.water_meter[1].water_meter) * result.room_ref.room_water_extra);
             $scope.amount += (result.elect_meter[0].elect_meter - result.elect_meter[1].elect_meter) * result.room_ref.room_energy_extra;
             $scope.amount += result.telephone.telephone_fee;
             $scope.customer_ref = result.customer_ref;
             $scope.room_no = result.room_ref.room_no;
             if ($scope.ST > $scope.PT) {
               $scope.penalty = ($scope.ST.getDate() - $scope.PT.getDate()) * $scope.transaction.property_ref.penalty;
             } else {
               $scope.penalty = 0;
             }
             if ($scope.transaction.status == 1) {
               $scope.paid = true
             } else {
               $scope.paid = false;
             }

           }
         });
       } else if ($routeParams.tel) {
         TransactionApi.get({
           tel: $routeParams.tel
         }, function OnGetTransaction(result) {
           if (result.$resolved) {
             //console.log(result);
             $scope.transaction = result;
             $scope.ST = new Date($scope.server_time);
             $scope.PT = new Date($scope.transaction.date_death_line);
             $scope.amount = result.room_ref.room_rate + result.room_ref.room_furniture + ((result.water_meter[0].water_meter - result.water_meter[1].water_meter) * result.room_ref.room_water_extra);
             $scope.amount += (result.elect_meter[0].elect_meter - result.elect_meter[1].elect_meter) * result.room_ref.room_energy_extra;
             $scope.amount += result.telephone.telephone_fee;
             $scope.customer_ref = result.customer_ref;
             $scope.room_no = result.room_ref.room_no;
             if ($scope.ST > $scope.PT) {
               $scope.penalty = ($scope.ST.getDate() - $scope.PT.getDate()) * $scope.transaction.property_ref.penalty;
             } else {
               $scope.penalty = 0;
             }
             if ($scope.transaction.status == 1) {
               $scope.paid = true
             } else {
               $scope.paid = false;
             }

           }
         });
       } else if ($routeParams.room && $routeParams.property_id) {
         TransactionApi.get({
           room_no: $routeParams.room,
           apartment_id: $routeParams.property_id
         }, function OnGetTransaction(result) {
           if (result.$resolved) {
             //console.log(result);

             $scope.transaction = result;
             $scope.ST = new Date($scope.server_time);
             $scope.PT = new Date($scope.transaction.date_death_line);
             $scope.amount = result.room_ref.room_rate + result.room_ref.room_furniture + ((result.water_meter[0].water_meter - result.water_meter[1].water_meter) * result.room_ref.room_water_extra);
             $scope.amount += (result.elect_meter[0].elect_meter - result.elect_meter[1].elect_meter) * result.room_ref.room_energy_extra;
             $scope.amount += result.telephone.telephone_fee;
             $scope.customer_ref = result.customer_ref;
             $scope.room_no = result.room_ref.room_no;
             if ($scope.ST > $scope.PT) {
               $scope.penalty = ($scope.ST.getDate() - $scope.PT.getDate()) * $scope.transaction.property_ref.penalty;
             } else {
               $scope.penalty = 0;
             }
             if ($scope.transaction.status == 1) {
               $scope.paid = true
             } else {
               $scope.paid = false;
             }

           }
         });
       }
       $scope.search_invoice_by_key = function function_name(key, clicked) {
         console.log($scope.searchinvoice)
         console.log($scope.select_properties);
         if ((key.keyCode == 13 && $scope.searchinvoice.length > 18)) {
           $location.path("/manage_billing").search('pay_id=' + $scope.searchinvoice + "&property_id=" + $scope.select_properties._id);
           $location.replace();
         } else if ((key.keyCode == 13 && !isNaN($scope.searchinvoice) && $scope.searchinvoice.length <= 4) || clicked) {
           $location.path("/manage_billing").search('room=' + $scope.searchinvoice + "&property_id=" + $scope.select_properties._id);
           $location.replace();
         } else if ((key.keyCode == 13 && !isNaN($scope.searchinvoice)) || clicked) {
           $location.path("/manage_billing").search('tel=' + $scope.searchinvoice + "&property_id=" + $scope.select_properties._id);
           $location.replace();
         }
       }
       $scope.search_receipt_by_key = function function_name(key) {
         //console.log(key.keyCode);
         if (key.keyCode == 13 && $scope.searchreceipt.length > 18) {
           $location.path("/manage_billing").search('pay_id=' + $scope.searchreceipt + "&property_id=" + $scope.select_properties._id);
           $location.replace();
         } else if (key.keyCode == 13 && !isNaN($scope.searchinvoice) && $scope.searchreceipt.length <= 4) {
           $location.path("/manage_billing").search('room=' + $scope.searchreceipt + "&property_id=" + $scope.select_properties._id);
           $location.replace();
         } else if (key.keyCode == 13 && !isNaN($scope.searchreceipt)) {
           $location.path("/manage_billing").search('tel=' + $scope.searchreceipt + "&property_id=" + $scope.select_properties._id);
           $location.replace();
         }
       }
       $scope.search_invoice = function(id) {
         //console.log($scope.searchinvoice);
         if ($scope.searchinvoice) {
           $location.path("/print_report").search('pay_id=' + $scope.searchinvoice);
           $location.replace();
         }
       }
       $scope.callreport = function(newValue) {
         $location.path('print_report_booking').search("transaction_id=" + newValue);
       };

     }
   ]).controller('ManageDurableCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'InventoryApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, InventoryApi, CompanyApi) {
       $scope.buildingid = $routeParams.building_id;
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.select_building = function(newValue) {
           $location.path('manage_durable').search('building_id=' + newValue);
           $location.replace();
         };
         $scope.del = function DeleteInventory(id, name, index) {
           var r = confirm("คุณต้องการลบ " + name + " ออกจากระบบ");
           if (r == true) {
             InventoryApi.remove({
               _id: id
             }, function(result) {
               if (result.$resolved) {
                 for (var i = 0; i < $scope.inventory_list.length; i++) {
                   if ($scope.inventory_list[i]._id === id) {
                     $scope.inventory_list.splice(i, 1);
                   }
                 };

               } else {

               }
             });
           } else {

           }

         }

         CompanyApi.query({
           building_request: 1
         }, function(result) {
           for (var i = 0; i < result.length; i++) {
             if (result[i]._id.toString() === $routeParams.building_id.toString()) {
               $scope.building = result[i];
             }
           };
         });
         InventoryApi.query({
           building_ref: $scope.buildingid
         }, function(result) {

           if (result.$resolved) {
             $scope.inventory_list = result
               //$log.log($scope.inventory_list);
           } else {

           }

         })
       });

     }
   ]).controller('AddDurableCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'InventoryApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, InventoryApi) {
       $scope.buildingid = $routeParams.building_id;
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         if ($routeParams.durable_id) {
           InventoryApi.get({
             _id: $routeParams.durable_id
           }, function(result) {
             $scope.post = result;
           });
         } else {

         }
         $scope.building_id = $routeParams.building_id;
         $scope.insert = function OnAddInventory() {
           $scope.post.building_ref = $scope.building_id;
           InventoryApi.post($scope.post, function AddinInventory(result) {
             if (result.$resolved) {
               $location.path('/manage_durable').search('building_id=' + $scope.building_id);
             }
           });
         }
       });
     }
   ]).controller('ManageEmployeeCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'EmployeeApi', 'TransactionApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, EmployeeApi, TransactionApi) {
       $scope.employee_list = [];
       EmployeeApi.get(function function_name(result) {
         if (result.$resolved) {
           $scope.employee_list = result.user_ref;
         }
       });
       $scope.del = function(id, option) {
         EmployeeApi.delete({
           _id: id
         }, function(result) {
           if (result.$resolved) {
             EmployeeApi.get(function function_name(result) {
               if (result.$resolved) {
                 $scope.employee_list = result.user_ref;
               }
             });
           }
         })
       }

     }
   ]).controller('EditDurableCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'InventoryApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, InventoryApi) {
       $scope.buildingid = $routeParams.building_id;
       angular.element(document).ready(function() {

         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         if ($routeParams.durable_id) {
           InventoryApi.get({
             _id: $routeParams.durable_id
           }, function(result) {
             $scope.post = result;

           });
         } else {

         }

         $scope.building_id = $routeParams.building_id;
         $scope.update = function OnAddInventory() {
           InventoryApi.post($scope.post, function AddinInventory(result) {
             if (result.$resolved) {
               $location.path('/manage_durable').search('building_id=' + $scope.building_id);
             }
           });
         }
       });

     }
   ]).controller('ManageUtilityCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'UtilityApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, UtilityApi, CompanyApi) {
       $scope.buildingid = $routeParams.building_id;
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.select_building = function(newValue) {
           $location.path('manage_utility').search('building_id=' + newValue);
           $location.replace();
         };
         $scope.del = function DeleteUtility(id, name, index) {
           var r = confirm("คุณต้องการลบ " + name + " ออกจากระบบ");
           if (r == true) {
             UtilityApi.remove({
               _id: id
             }, function(result) {
               if (result.$resolved) {
                 for (var i = 0; i < $scope.utility_list.length; i++) {
                   if ($scope.utility_list[i]._id === id) {
                     $scope.utility_list.splice(i, 1);
                   }
                 };
               } else {

               }
             });
           } else {

           }

         }
         CompanyApi.query({
           building_request: 1
         }, function(result) {
           for (var i = 0; i < result.length; i++) {
             if (result[i]._id.toString() === $routeParams.building_id.toString()) {
               $scope.building = result[i];
             }
           };
         });
         UtilityApi.query({
           building_ref: $scope.buildingid
         }, function(result) {

           if (result.$resolved) {
             $scope.utility_list = result
               //$log.log($scope.utility_list);
           } else {

           }

         })

       });

     }
   ]).controller('ManageStatementCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'TransactionApi', 'CustomerApi', 'CreateTransaction',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, TransactionApi, CustomerApi, CreateTransaction) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       CreateTransaction.query({
         list: ''
       }, function(result) {
         //console.log(result);
         $scope.userpayment = result;
       });
       CreateTransaction.get({
         balance: ''
       }, function(result) {
         //console.log(result);
         $scope.balance = result;
       });

     }
   ]).controller('PrintReportElectWaterCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction', 'ServerTime',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction, ServerTime) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.water_total = 0;
       $scope.elect_total = 0;
       $scope.water_total_unit = 0;
       $scope.elect_total_unit = 0;
       $scope.water_total_vat = 0;
       $scope.elect_total_vat = 0;
       $scope.water
       Room.query({
         utillity_report: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           $scope.report_list = result;
           for (var i = 0; i < $scope.report_list.length; i++) {
             $scope.temp_water = $scope.report_list[i].water_meter;
             $scope.temp_elect = $scope.report_list[i].elect_meter;
             $scope.report_list[i].water_total_exclude = ((($scope.temp_water[0].water_meter - $scope.temp_water[1].water_meter) * $scope.report_list[i].room_water_extra) / 1.07);
             $scope.report_list[i].elect_total_exclude = ((($scope.temp_elect[0].elect_meter - $scope.temp_elect[1].elect_meter) * $scope.report_list[i].room_energy_extra) / 1.07)
             $scope.water_total += ($scope.temp_water[0].water_meter - $scope.temp_water[1].water_meter) * $scope.report_list[i].room_water_extra;
             $scope.elect_total += ($scope.temp_elect[0].elect_meter - $scope.temp_elect[1].elect_meter) * $scope.report_list[i].room_energy_extra;
             $scope.water_total_unit += ($scope.temp_water[0].water_meter - $scope.temp_water[1].water_meter);
             $scope.elect_total_unit += ($scope.temp_elect[0].elect_meter - $scope.temp_elect[1].elect_meter);
             $scope.water_total_vat += (($scope.temp_water[0].water_meter - $scope.temp_water[1].water_meter) * $scope.report_list[i].room_water_extra) - ((($scope.temp_water[0].water_meter - $scope.temp_water[1].water_meter) * $scope.report_list[i].room_water_extra) / 1.07);
             $scope.elect_total_vat += (($scope.temp_elect[0].elect_meter - $scope.temp_elect[1].elect_meter) * $scope.report_list[i].room_energy_extra) - ((($scope.temp_elect[0].elect_meter - $scope.temp_elect[1].elect_meter) * $scope.report_list[i].room_energy_extra) / 1.07);

           };

           //console.log($scope.water_total + " " + $scope.elect_total);
           //console.log($scope.water_total_vat + " " + $scope.elect_total_vat);
         }
       });
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
       });
       $scope.post = {};

     }
   ]).controller('ManageOrderPaymenyCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction', 'ServerTime',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction, ServerTime) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       Room.query({
         remain: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           //console.log(result);
           $scope.report_list = result;
         }
       });
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
       });
       $scope.post = {};

     }
   ]).controller('PrintReportInvoiceCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.post = {};

     }
   ]).controller('PrintReportIncomeCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.post = {};

     }
   ]).controller('PrintReportRentedCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction', 'ServerTime',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction, ServerTime) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.total_coverage = 0;
       Room.query({
         rented_report: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           //console.log(result);
           $scope.report_list = result;
           for (var i = 0; i < $scope.report_list.length; i++) {
             $scope.report_list[i].customer_ref = $scope.report_list[i].customer_ref === undefined ? {
               name: "ห้องว่าง",
               id_card: "ห้องว่าง"
             } : $scope.report_list[i].customer_ref;

             if ($scope.report_list[i].coverage && $scope.report_list[i].coverage_status == 1 && $scope.report_list[i].transaction_type!==1) {

               $scope.total_coverage += $scope.report_list[i].coverage;
             }
           };
         }
       });
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
       });
       $scope.post = {};

     }
   ]).controller('PrintReportMoveOutCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction', 'ServerTime',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction, ServerTime) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       Room.query({
         moving_out: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           //console.log(result);
           $scope.report_list = result;
         }
       })
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
       });
       $scope.post = {};

     }
   ]).controller('ThankYouCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.post = {};

     }
   ]).controller('AddEventCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CreateTransaction',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CreateTransaction) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.post = {};

     }
   ]).controller('ManageCalendarCtrl', ['$scope', '$rootScope', '$log', '$compile', '$routeParams', '$cookies', '$location', '$anchorScroll', 'CalendarApi', 'uiCalendarConfig',
     function($scope, $rootScope, $log, $compile, $routeParams, $cookies, $location, $anchorScroll, CalendarApi, uiCalendarConfig) {

       var date = new Date();
       var d = date.getDate();
       var m = date.getMonth();
       var y = date.getFullYear();
       /* event source that pulls from google.com */
       // $scope.eventSource = {
       //   url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
       //   className: 'gcal-event', // an option!
       //   currentTimezone: 'America/Chicago' // an option!
       // };
       /* event source that contains custom events on the scope */
       $scope.events = [];


       $scope.eventSources = [];


       /* alert on eventClick */
       $scope.alertOnEventClick = function(date, jsEvent, view) {
         $scope.alertMessage = alert(date.title + ' was clicked ');
       };
       /* alert on Drop */
       $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
         $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
       };
       /* alert on Resize */
       $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
         $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
       };
       /* add and removes an event source of choice */
       $scope.addRemoveEventSource = function(sources, source) {
         var canAdd = 0;
         angular.forEach(sources, function(value, key) {
           if (sources[key] === source) {
             sources.splice(key, 1);
             canAdd = 1;
           }
         });
         if (canAdd === 0) {
           sources.push(source);
         }
       };
       /* add custom event*/
       $scope.addEvent = function() {
         $scope.calendar_object = {
           title: $scope.title,
           textColor: $scope.color,
           backgroundColor: $scope.bgcolor,
           start: $scope.startDate,
           end: $scope.endDate,
           user_ref: $cookies.UID
         };
         //console.log($scope.events);
         CalendarApi.post($scope.calendar_object, function(result) {
           if (result.$resolved) {

             $scope.events.push($scope.calendar_object);
           }
         })
       };
       /* remove event */
       $scope.remove = function(index) {
         $scope.events.splice(index, 1);
       };
       /* Change View */
       $scope.changeView = function(view, calendar) {
         uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
       };
       /* Change View */
       $scope.renderCalender = function(calendar) {
         if (uiCalendarConfig.calendars[calendar]) {
           uiCalendarConfig.calendars[calendar].fullCalendar('render');
         }
       };
       /* Render Tooltip */
       $scope.eventRender = function(event, element, view) {
         element.attr({
           'tooltip': event.title,
           'tooltip-append-to-body': true
         });
         $compile(element)($scope);
       };
       /* config object */
       if ($rootScope.isMobile) {
         $scope.uiConfig = {
           calendar: {
             height: 450,
             editable: false,
             header: {
               left: 'today',
               center: '',
               right: 'prev,next'
             },
             eventLimit: {
               'month': 6, // adjust to 6 only for agendaWeek/agendaDay
               'default': true // give the default value to other views
             },
             defaultView: "basicDay",
             eventClick: $scope.alertOnEventClick,
             eventDrop: $scope.alertOnDrop,
             eventResize: $scope.alertOnResize,
             eventRender: $scope.eventRender
           }
         };
       } else {
         $scope.uiConfig = {
           calendar: {
             height: 450,
             editable: false,
             header: {
               left: 'title',
               center: 'month,basicWeek,basicDay',
               right: 'today prev,next'
             },
             eventLimit: {
               'month': 6, // adjust to 6 only for agendaWeek/agendaDay
               'default': true // give the default value to other views
             },
             monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
             monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
             dayNames: ['อาทิตย์', 'จักนทร์', 'อังคาร', 'พุธร์', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
             dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
             eventClick: $scope.alertOnEventClick,
             eventDrop: $scope.alertOnDrop,
             eventResize: $scope.alertOnResize,
             eventRender: $scope.eventRender
           }
         };
       }


       /* event sources array*/
       // $scope.eventSources = [$scope.events];
       // $scope.eventSources2 = [$scope.events];
       angular.element(document).ready(function() {

         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         CalendarApi.query('', function(result) {
           if (result.$resolved) {
             for (var i = 0; i < result.length; i++) {
               result[i].start = new Date(result[i].start);
               $scope.events.push(result[i]);
             };
             //console.log(result);
           };
         });

       });
       $scope.eventSources = [$scope.events];
       $scope.post = {};

     }
   ]).controller('TopupCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', '$window', '$http', 'CustomerApi', 'TransactionApi', 'CreateTransaction',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, $window, $http, CustomerApi, TransactionApi, CreateTransaction) {

       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.payment = {};
       $scope.amount = 0;
       $scope.invoicestat = false;
       $scope.setamount = function(amount) {
         $scope.amount = amount;
       };
       $scope.send_payment = function() {

         //console.log($scope.payment.amount);
         CreateTransaction.post({
           amt: $scope.amount
         }, function(result) {
           if (result.invoice) {
             //console.log(result.invoice);
             $scope.payment.inv = result.invoice;
             //console.log($scope.payment);
             $scope.invoicenumber = result.invoice;
             $scope.invoicestat = true;
           }
         });
       }
     }
   ]).controller('AddUtilityCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'UtilityApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, UtilityApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.building_id = $routeParams.building_id;
         $scope.insert = function OnAddInventory() {
           $scope.post.building_ref = $scope.building_id;
           UtilityApi.post($scope.post, function AddinInventory(result) {
             $location.path('manage_utility').search('building_id=' + $scope.building_id);
           });
         }
       });


     }
   ]).controller('PrintReceiptMonthlyCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'TransactionApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, TransactionApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.buildingid = $routeParams.building_id;
       $scope.select_building = function(newValue) {
         $location.path('manage_utility').search('building_id=' + newValue);
         $location.replace();
       };
       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $scope.buildingid = result.building_ref._id;
         $scope.post = result;
         $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });
     }
   ]).controller('EditUtilityCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'UtilityApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, UtilityApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         if ($routeParams.utility_id) {
           UtilityApi.get({
             _id: $routeParams.utility_id
           }, function(result) {
             $scope.post = result;

           });
         } else {

         }

         $scope.building_id = $routeParams.building_id;
         $scope.update = function OnAddInventory() {
           UtilityApi.post($scope.post, function AddinInventory(result) {
             if (result.$resolved) {
               $location.path('manage_utility').search('building_id=' + $scope.building_id);
             }
           });
         }
       });

     }
   ]).controller('MakeRoomCoverageCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'TransactionApi',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, TransactionApi) {

       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.buildingid = $routeParams.building_id;
       $scope.select_building = function(newValue) {
         $location.path('manage_utility').search('building_id=' + newValue);
         $location.replace();
       };
       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $scope.buildingid = result.building_ref._id;
         $scope.post = result;
         $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });
     }
   ]).controller('PrintRoomCoverageCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'TransactionApi',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, TransactionApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.buildingid = $routeParams.building_id;
       $scope.select_building = function(newValue) {
         $location.path('manage_utility').search('building_id=' + newValue);
         $location.replace();
       };
       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $scope.buildingid = result.building_ref._id;
         $scope.post = result;
         $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });
     }
   ]).controller('MakeRoomChecklist', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'TransactionApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, TransactionApi) {
       $scope.post = [];
       $scope.payment_list = [];
       $scope.item = [{
         name: 'ค่ามัดจำ',
         price: 500
       }, {
         name: 'ค่าประกัน',
         price: 10000
       }, {
         name: 'คาคีย์การ์ด',
         price: 100
       }, {
         name: 'อินเตอร์เน็ต',
         price: 300
       }, {
         name: 'ทีวี 21"',
         price: 100
       }, ];
       $scope.post.payment_this = [];
       $scope.post.date = new Date();
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });

       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $scope.buildingid = result.building_ref._id;
         $scope.post = result;
         $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });

     }
   ]).controller('PrintRoomChecklist', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'TransactionApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, TransactionApi) {
       $scope.post = [];
       $scope.payment_list = [];
       $scope.item = [{
         name: 'ค่ามัดจำ',
         price: 500
       }, {
         name: 'ค่าประกัน',
         price: 10000
       }, {
         name: 'คาคีย์การ์ด',
         price: 100
       }, {
         name: 'อินเตอร์เน็ต',
         price: 300
       }, {
         name: 'ทีวี 21"',
         price: 100
       }, ];
       $scope.post.payment_this = [];
       $scope.post.date = new Date();
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });

       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $scope.buildingid = result.building_ref._id;
         $scope.post = result;
         $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });

     }
   ]).controller('RoomDetailCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CalendarApi', 'ElectApi', 'WaterApi', 'TransactionApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CalendarApi, ElectApi, WaterApi, TransactionApi, CompanyApi) {
       $rootScope.checkpermission();
       // $location.hash("goTop");
       // $anchorScroll();
       $scope.room_id = $routeParams.room_id;
       $scope.select = {
         person: {}
       };
       for (var i = 0; i < 13; i++) {
         $scope["water_meter" + i] = {};
         $scope["elect_meter" + i] = {};
       };
       TransactionApi.query({
         room_id: $routeParams.room_id
       }, function(result) {
         if (result.$resolved) {
           $scope.room_transaction = result;
         }
       });
       $scope.water_query = function(month) {
         month = month - 1;
         WaterApi.query({
           meter_room_ref: $routeParams.room_id,
           limit: 100,
           year: 2014,
           month: month
         }, function(result) {
           if (result.$resolved) {
             //$log.log("water Api");
             //$log.log(result);
             $scope["water_meter" + (month + 1)] = result;
           }
         });
       };
       $scope.elect_query = function(month) {
         month = month - 1;
         ElectApi.query({
           meter_room_ref: $routeParams.room_id,
           limit: 100,
           year: 2014,
           month: month
         }, function(result) {
           if (result.$resolved) {
             //$log.log("elect Api");
             //$log.log(result);
             $scope["elect_meter" + (month + 1)] = result;
           }
         });
       };
       $scope.events = [];
       WaterApi.query({
         meter_room_ref: $routeParams.room_id,
         limit: 100,
         year: 2014,
         month: 1
       }, function(result) {
         if (result.$resolved) {
           //$log.log("water Api");
           //$log.log(result);
           $scope.water_meter = result;
         }

       });
       ElectApi.query({
         meter_room_ref: $routeParams.room_id,
         limit: 100,
         year: 2014,
         month: 1
       }, function(result) {
         if (result.$resolved) {
           //$log.log("Elect Api");
           //$log.log(result);
           $scope.elect_meter = result;
         }
       });

       $scope.eventSources = [];




       $scope.changeView = function(view, calendar) {
         uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
       };
       /* Change View */
       $scope.renderCalender = function(calendar) {
         if (uiCalendarConfig.calendars[calendar]) {
           uiCalendarConfig.calendars[calendar].fullCalendar('render');
         }
       };
       /* Render Tooltip */
       $scope.eventRender = function(event, element, view) {
         element.attr({
           'tooltip': event.title,
           'tooltip-append-to-body': true
         });
         $compile(element)($scope);
       };
       /* config object */
       if ($rootScope.isMobile) {
         $scope.uiConfig = {
           calendar: {
             height: 450,
             editable: false,
             header: {
               left: 'today',
               center: '',
               right: 'prev,next'
             },
             eventLimit: {
               'month': 6, // adjust to 6 only for agendaWeek/agendaDay
               'default': true // give the default value to other views
             },
             defaultView: "basicDay",
             eventClick: $scope.alertOnEventClick,
             eventDrop: $scope.alertOnDrop,
             eventResize: $scope.alertOnResize,
             eventRender: $scope.eventRender
           }
         };
       } else {
         $scope.uiConfig = {
           calendar: {
             height: 450,
             editable: false,
             header: {
               left: 'title',
               center: 'month,basicWeek,basicDay',
               right: 'today prev,next'
             },
             eventLimit: {
               'month': 6, // adjust to 6 only for agendaWeek/agendaDay
               'default': true // give the default value to other views
             },
             monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
             monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
             dayNames: ['อาทิตย์', 'จักนทร์', 'อังคาร', 'พุธร์', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
             dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
             eventClick: $scope.alertOnEventClick,
             eventDrop: $scope.alertOnDrop,
             eventResize: $scope.alertOnResize,
             eventRender: $scope.eventRender
           }
         };
       }

       $scope.eventSources = [$scope.events];
       TransactionApi.get({
         room_renter: $routeParams.room_id
       }, function OnGetDetail(result) {
         $scope.renter = result.customer_ref;

       });
       Room.get({
         _id: $routeParams.room_id
       }, function OnGetDetail(result) {
         $scope.room = result;
         if (!$scope.room.images) {
           $scope.room.images = [];
         }

         if ($scope.room.utility_list) {
           for (var i = 0; i < $scope.room.utility_list.length; i++) {
             $scope.utility_room_list.push({
               utility_name: $scope.room.utility_list[i]
             });
           };
         }
         if ($scope.room.inventory_list) {
           for (var i = 0; i < $scope.room.inventory_list.length; i++) {
             $scope.inventory_room_list.push({
               inventory_name: $scope.room.inventory_list[i]
             });
           };
         }

         $scope.services = $scope.room.service;
       });


     }
   ]).controller('UpdatePaymentCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, CompanyApi) {
       $rootScope.checkpermission();
       // $location.hash("goTop");
       // $anchorScroll();
       $scope.select = {
         person: {}
       };
       Room.query({
         building_ref: $routeParams.building_id
       }, function QueryBuilding(result) {
         $scope.room_list = result;
         $scope.waiting = 1;
       });

       // CompanyApi.get('', function(company) {
       //   CustomerApi.query({
       //     company_id: company._id
       //   }, function(result) {
       //     $scope.customerlist = result;
       //     //$log.warn($scope.customer_list);
       //   });
       // });
     }
   ]).controller('ManageWaterCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'WaterApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, WaterApi, CompanyApi) {
       $rootScope.checkpermission();
       $scope.csv_array = {};
       // $location.hash("goTop");
       // $anchorScroll();
       // $scope.list = {};
       // $scope.list.post = {};
       // $scope.list.post.water_meter = 0;
       $scope.compare = function Oncompare() {
         for (var i = 0; i < $scope.room_list.length; i++) {
           $scope.room_list[i].post.water_meter = parseFloat($scope.csv_array[$scope.room_list[i].room_name]);
           //console.log($scope.csv_array[$scope.room_list[i].room_name]);
         };
         //console.log($scope.room_list);
       }
       $scope.$watch('csv_array', function(a, b) {
         //console.log(a);
         //console.log(b);
       })
       $scope.save_all_csv = function() {
         var r = confirm("คุณต้องการบันทึกค่าน้ำค่าไฟต่าโทรศัพท์ทุกห้องหรือไม่");
         if (r == true) {
           for (var i = 0; i < $scope.room_list.length; i++) {
             $scope.insert($scope.room_list[i]._id);
           };

         } else {

         }

       };
       $scope.upload_csv = function process_csv(evt) {
         var f = evt.files[0];
         //console.log(f)
         if (f.type === "text/csv") {
           var r = new FileReader();
           r.onload = function(e) {
             //console.log(e);
             var contents = e.target.result;
             for (var i = 0; i < contents.split(/\n/g).length; i++) {
               if (contents.split(/\n/g)[i].split(',')[6] !== undefined) {
                 $scope.csv_array[contents.split(/\n/g)[i].split(',')[0]] = contents.split(/\n/g)[i].split(',')[6];
               } else if (contents.split(/\n/g)[i].split(',').length == 2 && contents.split(/\n/g)[i].split(',')[1] !== undefined) {
                 $scope.csv_array[contents.split(/\n/g)[i].split(',')[0]] = contents.split(/\n/g)[i].split(',')[1];
               } else {

               }
             };
             $scope.compare();
           }
           r.readAsText(f);

           //console.log($scope.csv_array);
         } else {
           alert("Failed to load file");
         }
       };
       $scope.select = {
         person: {}
       };
       if ($routeParams.building_id) {


         CompanyApi.query({
           building_request: 1
         }, function(result) {
           for (var i = 0; i < result.length; i++) {
             if (result[i]._id.toString() === $routeParams.building_id.toString()) {
               $scope.building = result[i];
             }
           };
         });
         Room.query({
           building_ref: $routeParams.building_id
         }, function QueryBuilding(result) {
           $scope.room_list = result;
           //$log.log($scope.room_list);
           for (var i = 0; i < $scope.room_list.length; i++) {
             $scope.room_list[i].post = {
               water_meter: 0
             };
             //$log.log($scope.room_list[i]);
             WaterApi.query({
               room_ref: $scope.room_list[i]._id,
               limit: 2
             }, function(water) {
               for (var j = $scope.room_list.length - 1; j >= 0; j--) {
                 try {
                   if ($scope.room_list[j]._id === water[0].room_ref._id) {
                     $scope.room_list[j].before_water_bill = water[1];
                     $scope.room_list[j].after_water_bill = water[0];
                     $scope.room_list[j].post.water_meter = water[0].water_meter;
                     $scope.toDay = new Date();
                     $scope.room_date = new Date(water[0].date);
                     if ($scope.toDay.getDate() == $scope.room_date.getDate() && $scope.toDay.getDate() == $scope.room_date.getDate()) {
                       $scope.room_list[j].post.isUptodate = true;
                     } else {
                       $scope.room_list[j].post.isUptodate = false;
                     }
                   }
                 } catch (e) {

                 }

               };
             });
           };
         });
       }
       $scope.insert = function(id, j) {
         $scope.water = {};
         $scope.water.room_ref = id;

         for (var i = $scope.room_list.length - 1; i >= 0; i--) {
           if ($scope.room_list[i]._id === id) {
             $scope.water.water_meter = $scope.room_list[i].post.water_meter;
           }
         };
         WaterApi.post($scope.water, function(result) {
           if (result.$resolved) {
             WaterApi.query({
               room_ref: id,
               limit: 2
             }, function(water) {
               $scope.room_list[j].before_water_bill = water[1];
               $scope.room_list[j].after_water_bill = water[0];
               $scope.room_list[j].post.water_meter = water[0].water_meter;
               $scope.toDay = new Date();
               $scope.room_date = new Date(water[0].date);
               if ($scope.toDay.getDate() == $scope.room_date.getDate() && $scope.toDay.getDate() == $scope.room_date.getDate()) {
                 $scope.room_list[j].post.isUptodate = true;
               } else {
                 $scope.room_list[j].post.isUptodate = false;
               }

             });
           }
         });
       };
       $scope.edit_meter = function OneditWaterBill(id) {
         for (var i = $scope.room_list.length - 1; i >= 0; i--) {
           if ($scope.room_list[i]._id === id) {
             $scope.edit_meter_value = {};
             $scope.edit_meter_value.water_meter = $scope.room_list[i].edit.after_water_bill.water_meter;
             $scope.edit_meter_value._id = $scope.room_list[i].after_water_bill._id;
             WaterApi.post($scope.edit_meter_value, function(result) {
               if (result.$resolved) {
                 for (var i = $scope.room_list.length - 1; i >= 0; i--) {
                   if ($scope.room_list[i]._id === id) {
                     $scope.room_list[i].after_water_bill.water_meter = result.water_meter;
                   }
                 }
               }
             });
           }
         };
       };



       $scope.select_building = function(newValue) {
         $location.path('manage_water').search('building_id=' + newValue);
         $location.replace();
       };
     }
   ]).controller('ManageElecCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'ElectApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, ElectApi, CompanyApi) {
       $scope.list = {};
       $scope.list.post = {};
       $scope.csv_array = {};
       $scope.building_ids = $routeParams.building_id;
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();

       });
       $scope.compare = function Oncompare() {
         for (var i = 0; i < $scope.room_list.length; i++) {
           $scope.room_list[i].post.elect_meter = parseFloat($scope.csv_array[$scope.room_list[i].room_name]);
         };
         $scope.$apply();
         //console.log($scope.room_list);
       };
       $scope.save_all_csv = function() {
         var r = confirm("คุณต้องการบันทึกค่าน้ำค่าไฟต่าโทรศัพท์ทุกห้องหรือไม่");
         if (r == true) {
           for (var i = 0; i < $scope.room_list.length; i++) {
             $scope.insert($scope.room_list[i]._id);
           };

         } else {

         }

       };
       $scope.$watch('csv_array', function(a, b) {
         //console.log(a);
         //console.log(b);
       })
       $scope.upload_csv = function process_csv(evt) {
         var f = evt.files[0];
         //console.log(f)
         if (f.type === "text/csv") {
           var r = new FileReader();
           r.onload = function(e) {
               //console.log(e);
               var contents = e.target.result;
               for (var i = 0; i < contents.split(/\n/g).length; i++) {
                 if (contents.split(/\n/g)[i].split(',')[6] !== undefined) {
                   $scope.csv_array[contents.split(/\n/g)[i].split(',')[0]] = contents.split(/\n/g)[i].split(',')[6];
                 } else if (contents.split(/\n/g)[i].split(',').length == 2 && contents.split(/\n/g)[i].split(',')[1] !== undefined) {
                   $scope.csv_array[contents.split(/\n/g)[i].split(',')[0]] = contents.split(/\n/g)[i].split(',')[1];
                 } else {

                 }
               };
               $scope.compare();
             }
             //console.log($scope.csv_array);

           r.readAsText(f);
         } else {
           alert("Failed to load file");
         }


       };
       if ($routeParams.building_id) {
         CompanyApi.query({
           building_request: 1
         }, function(result) {
           for (var i = 0; i < result.length; i++) {
             if (result[i]._id.toString() === $routeParams.building_id.toString()) {
               $scope.building = result[i];
             }
           };
         });

         Room.query({
           building_ref: $routeParams.building_id
         }, function QueryBuilding(result) {
           $scope.room_list = result;
           for (var i = 0; i < $scope.room_list.length; i++) {
             $scope.room_list[i].post = {};
             ElectApi.query({
               room_ref: $scope.room_list[i]._id,
               limit: 2
             }, function(elect) {
               for (var j = $scope.room_list.length - 1; j >= 0; j--) {
                 try {
                   if ($scope.room_list[j]._id === elect[0].room_ref._id) {
                     $scope.room_list[j].before_elect_bill = elect[1];
                     $scope.room_list[j].after_elect_bill = elect[0];
                     $scope.room_list[j].post.elect_meter = elect[0].elect_meter;
                     $scope.toDay = new Date();
                     $scope.room_date = new Date(elect[0].date);
                     if ($scope.toDay.getDate() == $scope.room_date.getDate() && $scope.toDay.getDate() == $scope.room_date.getDate()) {
                       $scope.room_list[j].post.isUptodate = true;
                     } else {
                       $scope.room_list[j].post.isUptodate = false;
                     }
                   }
                 } catch (e) {

                 }

               };
             });
           };

         });
       } else {

       }

       $scope.insert = function(id, j) {
         $scope.elect = {};
         $scope.elect.room_ref = id;

         for (var i = $scope.room_list.length - 1; i >= 0; i--) {
           if ($scope.room_list[i]._id === id) {
             $scope.elect.elect_meter = $scope.room_list[i].post.elect_meter;
           }
         };
         ElectApi.post($scope.elect, function(result) {
           if (result.$resolved) {
             ElectApi.query({
               room_ref: id,
               limit: 2
             }, function(elect) {
               $scope.room_list[j].before_elect_bill = elect[1];
               $scope.room_list[j].after_elect_bill = elect[0];
               $scope.room_list[j].post.elect_meter = elect[0].elect_meter;
               $scope.toDay = new Date();
               $scope.room_date = new Date(elect[0].date);
               if ($scope.toDay.getDate() == $scope.room_date.getDate() && $scope.toDay.getDate() == $scope.room_date.getDate()) {
                 $scope.room_list[j].post.isUptodate = true;
               } else {
                 $scope.room_list[j].post.isUptodate = false;
               }
             });
           }
         });

       };

       $scope.edit_meter = function OneditElectBill(id) {
         for (var i = $scope.room_list.length - 1; i >= 0; i--) {
           if ($scope.room_list[i]._id === id) {
             $scope.edit_meter_value = {};
             $scope.edit_meter_value.elect_meter = $scope.room_list[i].edit.after_elect_bill.elect_meter;
             $scope.edit_meter_value._id = $scope.room_list[i].after_elect_bill._id;
             ElectApi.post($scope.edit_meter_value, function(elect) {
               if (elect.$resolved) {
                 for (var i = $scope.room_list.length - 1; i >= 0; i--) {
                   if ($scope.room_list[i]._id === id) {
                     $scope.room_list[i].after_elect_bill.elect_meter = elect.elect_meter;
                   }
                 }
               }
             });
           }
         };

       };


       $scope.select_building = function(newValue) {
         $location.path('manage_elec').search('building_id=' + newValue);
         $location.replace();
       };
     }
   ]).controller('CustomerBillingCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'CustomerApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, CustomerApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });

       $scope.select = {
         person: {}
       };

       if ($routeParams.room_id !== undefined) {
         TransactionApi.query({
           room_id: $routeParams.room_id
         }, function(result) {

           if (result && result.length) {
             TransactionApi.query({
               ref_id: result[0]._id
             }, function(results) {
               if (results && results.length) {

                 $scope.transaction_list = results;
               } else {
                 $scope.transaction_list = result;
               }

             });
           } else {
             $scope.transaction_list = result;
           }

         });
       } else if ($routeParams.customer_id !== undefined) {
         TransactionApi.query({
           customer_id: $routeParams.customer_id
         }, function(result) {

           if (result && result.length) {
             TransactionApi.query({
               ref_id: result[0]._id
             }, function(results) {
               if (results && results.length) {

                 $scope.transaction_list = results;
               } else {
                 $scope.transaction_list = result;
               }

             });
           } else {
             $scope.transaction_list = result;
           }

         });
         CustomerApi.get({
           _id: $routeParams.customer_id
         }, function(result) {
           $scope.customer_detail = result;
           //$log.log(result);
         });
       }

       TransactionApi.query({
         customer_id: $routeParams.customer_id
       }, function(result) {

         if (result && result.length) {
           TransactionApi.query({
             ref_id: result[0]._id
           }, function(results) {
             if (results && results.length) {

               $scope.transaction_list = results;
             } else {
               $scope.transaction_list = result;
             }

           });
         } else {
           $scope.transaction_list = result;
         }

       });
       // Room.query({
       //   building_ref: $routeParams.building_id
       // }, function QueryBuilding(result) {
       //   $scope.room_list = result;
       //   $scope.waiting = 1;
       // });


     }
   ]).controller('AddPropertyCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Adsservice', 'PropertyApi', 'Duplicate',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Adsservice, PropertyApi, Duplicate) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });



       if ($cookies.Permission == 11) {
         //console.log('test');
         $scope.post = {
           "images": [],
           "location": [],
           "title": "Demo Apartment",
           "address": "12/345 มีนบุรี กรุงเทพมหานคร 10230",
           "contact_email": "demouser@email.com",
           "contact_name": "พนักงาน",
           "contact_mobile": "0860000000",
           "contact_tel": "020000000",
           "contact_fax": "020000000",
           "no_room": "30",
           "price_min": "5000",
           "dailyprice": "400",
           demo: true
         };
       } else {
         $scope.post = {};
         $scope.post.images = [];
         $scope.post.location = [];
       };
       $scope.getlocation = function() {
         if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
             $scope.post.location[1] = position.coords.latitude;
             $scope.post.location[0] = position.coords.longitude;
           });
         } else {
           alert('กรุณาเปิด GPS ด้วยนะ');
         }
       }
       $scope.isDuplicate = function() {
         Duplicate.query({
           namespace: $scope.post.namespace
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
               //$log.log($scope.duplicatestatus);
               //$log.log(e);
             }
           }

         });
       };
       $scope.logoupload = function(evt) {
         ////console.log("uploading");
         var logo = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           logo.append("image", evt.files[0]);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.logo = xhr.responseText;
               ////console.log($scope.post);
               $scope.$apply();
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/resizeimage");
           xhr.send(logo);
         }
       };

       $scope.imageheaderupload = function(evt) {
         ////console.log("uploading");
         var header = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           header.append("image", evt.files[0]);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.image_header = xhr.responseText;
               ////console.log($scope.post);
               $scope.$apply();
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/resizeimage");
           xhr.send(header);
         }
       };


       $scope.imagesupload = function(evt) {
         var test = new FormData();
         if (evt.type.match('image.*')) {} else {
           test.append("image", evt.files[0]);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.images.push(xhr.responseText);
               $scope.$apply();
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/resizeimage");
           xhr.send(test);
         }
       };

       $scope.insert = function function_name(name, method) {
         PropertyApi.post($scope.post, function(result) {
           if (result.$resolved) {
             if (result.err) {
               alert("บันทึกไม่สำเร็จ \n" + result.err);
             } else {
               //$log.warn(result);
               $location.path('manage_property');
               $location.replace();
             }
           }

         });
       };

     }
   ]).controller('ReportCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'CompanyApi', 'InvoiceApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, CompanyApi, InvoiceApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.select_properties = {};
         $scope.select_properties._id = $routeParams.apartemnt_id;
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.make_invoice = function function_name(id) {
           var r = confirm("คุณต้องการออกรายงานประจำเดือนหรือไม่ \n ******** คำเตือน กรุณาใส่ค่าน้ำค่าไฟค่าโทรศัพท์ให้ครบทุกห้องก่อนทำการออกรายงาน มิเช่นนั้นข้อมูลอาจผิดพลาดได้ ********");
           if (r == true) {
             $scope.newDate = new Date();
             InvoiceApi.post_array({
               make_invoice: id
             }, function(result) {
               if (result.$resolved) {
                 $location.path('print_report').search('property_id=' + id + "&year=" + $scope.newDate.getFullYear() + "&month=" + $scope.newDate.getMonth());
                 $location.replace();
               }
             });

           } else {

           }


         };
         $scope.select_building = function(newValue) {
           $location.path('manage_report').search('building_id=' + newValue);
           $location.replace();
         };
         $scope.status_list = [];
         CompanyApi.query({
           property_request: 1
         }, function(result) {
           $scope.property_list = result;
           for (var i = 0; i < $scope.property_list.length; i++) {
             TransactionApi.get({
               check_status: $scope.property_list[i]._id
             }, function function_name(result) {
               if (result.$resolved) {
                 $scope.status_list.push(result);
               }
             })
           };
           //console.log(result);
         });

         setTimeout(function() {
           for (var i = 0; i < $scope.property_list.length; i++) {
             for (var j = 0; j < $scope.status_list.length; j++) {
               //console.log($scope.property_list[i]);
               //console.log($scope.status_list[j]);
               if ($scope.property_list[i]._id === $scope.status_list[j]._id) {
                 $scope.property_list[i].check_status = $scope.status_list[j].status;
               }

             };

           };
           $scope.$apply();
           //console.log($scope.property_list)
         }, 2000);
       });

     }
   ]).controller('SelectCustomerCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'TransactionApi', 'Room', 'CustomerApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, TransactionApi, Room, CustomerApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.post_body = {};
       $scope.post_body.accompany = [];
       if ($routeParams.building_id) {
         $scope.post_body.building_ref = $routeParams.building_id;
       }
       if ($routeParams.reserve_room_id !== undefined) {
         $scope.roomid = $routeParams.reserve_room_id;
       } else if ($routeParams.agreement_room_id !== undefined) {
         $scope.roomid = $routeParams.agreement_room_id;
       }


       $rootScope.select = {
         person: {}
       };
       $scope.next_page = function() {
         if ($routeParams.reserve_room_id !== undefined) {
           $location.path('select_rent_type').search('reserve_room_id=' + $routeParams.reserve_room_id);
         } else if ($routeParams.agreement_room_id !== undefined) {
           if ($rootScope.select.person) {
             $scope.i = 0;
             for (var key in $rootScope.select.person) {
               if ($rootScope.select.person[key]) {
                 if ($scope.i == 0) {
                   $scope.post_body.customer_ref = key;
                   $scope.post_body.accompany.push(key);
                   $scope.i++;
                 } else {
                   $scope.post_body.accompany.push(key);
                 }


               }
             }
             $scope.post_body.transaction_type = 3;
             TransactionApi.post($scope.post_body, function(result) {
               if (result.$resolved && result.err === undefined) {
                 $location.path('make_agreement').search("transaction_id=" + result._id);
               }
             })

           }

         } else {

         }
         $location.replace();
       }
       Room.get({
         get_property: $scope.roomid
       }, function(result) {
         if (result) {
           $scope.post_body.room_ref = $scope.roomid;
           $scope.post_body.property_ref = result._id;
         } else {

         }

       });

       CompanyApi.get('', function(company) {
         CustomerApi.query({
           company_id: company._id
         }, function(result) {
           $scope.customer_list = result;
           //$log.warn($scope.customer_list);
         });
       });
     }
   ]).controller('SelectRentTypeCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'CustomerApi', 'ElectApi', 'WaterApi', 'TransactionApi', 'SendNotification', 'CalendarApi',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, CustomerApi, ElectApi, WaterApi, TransactionApi, SendNotification, CalendarApi) {
       angular.element(document).ready(function() {

         $scope.customerquerylist = [];
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         if ($routeParams.building_id) {
           $scope.post_body.building_ref = $routeParams.building_id;
         }
         if ($routeParams.reserve_room_id !== undefined) {
           $scope.roomid = $routeParams.reserve_room_id;
         } else if ($routeParams.agreement_room_id !== undefined) {
           $scope.roomid = $routeParams.agreement_room_id;
         }
         $rootScope.customer = {};
         $rootScope.building = {};
         $rootScope.property = {};
         $rootScope.transaction = {};
         $rootScope.room = {};
         $rootScope.post = {};
         $rootScope.transaction.reserve_price = '0';
         $scope.smsconfirm = 0;
         var upper = "example1234";
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         $('#bar_key2').barcode($scope.codetoupper, "code39");
         $rootScope.$watch('post.customer_ref', function() {
           try {
             for (var i = $scope.customer_list.length - 1; i >= 0; i--) {
               if ($scope.customer_list[i]._id.toString() === $scope.post.customer_ref.toString()) {
                 $('#bar_key').barcode($scope.customer_list[i]._id, "code39");
                 $rootScope.transaction.customer_ref = $scope.customer_list[i]._id;
                 $rootScope.customer = $scope.customer_list[i];
                 $rootScope.customer.birth_date = new Date($rootScope.customer.birth_date);
               }
             }
           } catch (e) {

           }
         });


         $scope.makebooking = function Booking_shortcut() {
           $rootScope.transaction.accompany = [];
           for (var i = $scope.customer_list.length - 1; i >= 0; i--) {
             $rootScope.transaction.accompany.push($scope.customer_list[i]._id);
           };
           $rootScope.transaction.reserve_price = $rootScope.force_reserve_price;
           $rootScope.transaction.room_ref = $scope.roomid;
           $rootScope.transaction.user_ref = $cookies.UID;
           TransactionApi.post($scope.transaction, function OnGetTransaction(result) {
             if (result) {

               // Room.post({_id:result.room_ref._id,room_status:3},function  (room) {
               //   //console.log(room)
               // });
               $scope.smsbody = {};
               $scope.smsbody.email = $rootScope.property.contact_email;
               $scope.smsbody.tel = $rootScope.property.contact_mobile;
               $scope.smsbody.message = $rootScope.property.title + " ห้อง " + $rootScope.room.room_no + " ถูกจองโดย " + $scope.customer_list[0].name + " " + $scope.customer_list[0].last_name;
               //console.log($scope.smsbody);
               if ($scope.smsconfirm == 0) {
                 $scope.smsconfirm++;

                 SendNotification.post($scope.smsbody, function(argument) {
                   //console.log(argument);
                 });
                 $scope.calendar_object = {
                   title: " ห้อง " + $rootScope.room.room_no + " ถูกจอง",
                   textColor: "white",
                   backgroundColor: "#4b98ed",
                   start: Date.now(),
                   user_ref: $cookies.UID
                 };
                 CalendarApi.post($scope.calendar_object, function(result) {

                 });

                 $scope.calendar_object = {
                   title: " ห้อง " + $rootScope.room.room_no + " นัดย้ายเข้า",
                   textColor: "white",
                   backgroundColor: "#d86a9b",
                   start: $rootScope.transaction.move_in_date,
                   user_ref: $cookies.UID
                 };
                 CalendarApi.post($scope.calendar_object, function(result) {

                 });

               }

               $rootScope.transaction = result;
               $rootScope.customer = result.customer_ref;
               $rootScope.building = result.building_ref;
               $rootScope.room = result.room_ref;
               $rootScope.property = result.property_ref;
               //console.log(result);
               Room.post({
                 confirm: result.room_ref,
                 room_status: 1
               }, function OnUpdateRoom(argument) {
                 // body...
                 //$log.log(argument);
               });
               $location.path("print_receipt_booking").search('transaction_id=' + result._id);
               $location.replace();
             }
             //$log.log(result);


           });
         };
         //$rootScope.transaction.reserve_price = 0;
         $rootScope.$watch('transaction.reserve_price', function(a, b) {
           try {
             //console.log(a + "--------------" + b);
             $rootScope.pricetostring = $filter('thbToString')($rootScope.transaction.reserve_price);
             //console.log($rootScope.transaction)
             $rootScope.force_reserve_price = a;
             //$rootScope.transaction.reserve_price = parseInt(a);

           } catch (e) {

           }
         });

         Room.get({
           get_property: $scope.roomid
         }, function(result) {
           if (result) {
             //console.log(result);

             $rootScope.property.coverage = ((isNaN(result.deposit)) ? 0 : parseInt(result.deposit));
             $rootScope.property.common_fee_charge = ((isNaN(result.utility)) ? 0 : parseInt(result.utility));
             $rootScope.property.furniture = ((isNaN(result.room_furniture)) ? 0 : parseInt(result.room_furniture));
             $rootScope.property.car_park_fee = ((isNaN(result.parking)) ? 0 : parseInt(result.parking));
             $rootScope.property.internet_fee = ((isNaN(result.net_bill)) ? 0 : parseInt(result.net_bill));
             $rootScope.property.title = result.title;
             $rootScope.property.contact_mobile = result.contact_mobile;
             $rootScope.property.contact_tel = result.contact_tel;
             $rootScope.property.contact_email = result.contact_email;
             $rootScope.property.contact_fax = result.contact_fax;
             $rootScope.property.address = result.address;
             $rootScope.property.property_ref = result._id;
             $rootScope.property.deposit = ((isNaN(result.deposit) || result.deposit === '') ? 0 : parseInt(result.deposit));
             $rootScope.property.price_min = ((isNaN(result.price_min) || result.price_min === '') ? 0 : parseInt(result.price_min));

           } else {

           }

         });
         Room.get({
           _id: $routeParams.reserve_room_id
         }, function QueryBuilding(result) {

           $rootScope.room.room_no = result.room_no;
           $rootScope.room.room_rate = ((isNaN(result.room_rate)) ? 0 : parseInt(result.room_rate));
           for (var i = $rootScope.building_list.length - 1; i >= 0; i--) {

             if ($rootScope.building_list[i]._id === result.building_ref._id) {
               $rootScope.transaction.building_ref = $rootScope.building_list[i]._id;
               $rootScope.transaction.property_ref = $rootScope.building_list[i].property_ref._id === undefined ? $rootScope.building_list[i].property_ref : $rootScope.building_list[i].property_ref._id;
               $rootScope.building.building = $rootScope.building_list[i].building;
               $rootScope.building.building_no = $rootScope.building_list[i].building_no;
               $rootScope.building.building_ref = $rootScope.building_list[i]._id;
               $rootScope.building.property_ref = $rootScope.building_list[i].property_ref._id === undefined ? $rootScope.building_list[i].property_ref : $rootScope.building_list[i].property_ref._id;
             } else {

             }
           };
         });
         $scope.setpost = function OnSetPost() {
           $rootScope.transaction.accompany = [];
           for (var i = $scope.customer_list.length - 1; i >= 0; i--) {
             $rootScope.transaction.accompany.push($scope.customer_list[i]._id);
           };
           $rootScope.transaction.reserve_price = $rootScope.force_reserve_price;
           $rootScope.transaction.room_ref = $scope.roomid;
           $rootScope.transaction.user_ref = $cookies.UID;
         };
         if ($rootScope.select) {
           if ($rootScope.select.person) {
             for (var key in $rootScope.select.person) {
               if ($rootScope.select.person[key]) {
                 $scope.customerquerylist.push(key);
               }
             }
             if ($scope.customerquerylist.length === 0) {
               $location.path('select_customer');
               $location.replace();
             } else if ($scope.customerquerylist.length === 1) {
               CustomerApi.get({
                 _id: $scope.customerquerylist[0]
               }, function(result) {
                 $scope.customer_list = [];
                 $scope.customer_list.push(result);
                 $rootScope.transaction.customer_ref = $scope.customer_list[0]._id;
                 $rootScope.customer = $scope.customer_list[0];
                 $rootScope.customer.birth_date = new Date($rootScope.customer.birth_date);
                 //$log.warn($scope.customer_list);
               });
             } else {
               CustomerApi.query({
                 person_list: $scope.customerquerylist
               }, function(result) {
                 $scope.customer_list = result;
                 $rootScope.transaction.customer_ref = $scope.customer_list[0]._id;
                 $rootScope.customer = $scope.customer_list[0];
                 $rootScope.customer.birth_date = new Date($rootScope.customer.birth_date);
                 //$log.warn($scope.customer_list);
               });
             }
           } else {
             $location.path('select_customer');
             $location.replace();
           }

         } else {
           $location.path('select_customer');
           $location.replace();
         }

         $rootScope.transaction.date = new Date();
         $rootScope.transaction.move_in_date = new Date();
       });
     }
   ]).controller('FormPersonCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$http', '$location', '$anchorScroll', 'CustomerApi', 'Room',
     function($scope, $rootScope, $log, $routeParams, $cookies, $http, $location, $anchorScroll, CustomerApi, Room) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.post = {};
       $scope.getcontent = function() {
         $scope.array_person = $scope.person_area.split('!');
         $scope.post.id_card = parseInt($scope.array_person[0]);
         $scope.post.birth_date = new Date($scope.array_person[1].split('/')[2] - 543, $scope.array_person[1].split('/')[1] - 1, $scope.array_person[1].split('/')[0]);
         $scope.post.prefix = $scope.array_person[3];
         $scope.post.name = $scope.array_person[4];
         $scope.post.last_name = $scope.array_person[5];
         $scope.post.id_card_create = new Date($scope.array_person[6].split('/')[2] - 543, $scope.array_person[6].split('/')[1] - 1, $scope.array_person[6].split('/')[0]);
         $scope.post.id_card_expiry = new Date($scope.array_person[7].split('/')[2] - 543, $scope.array_person[7].split('/')[1] - 1, $scope.array_person[7].split('/')[0]);
         $scope.post.address_no = $scope.array_person[8];
         $scope.post.address_moo = ($scope.array_person[9] === " " ? '-' : $scope.array_person[9]);
         $scope.post.address_road = $scope.array_person[11];
         $scope.post.address_tumbol = $scope.array_person[12];
         $scope.post.address_aumphur = $scope.array_person[13];
         $scope.post.address_province = $scope.array_person[14];

         //$log.log($scope.array_person);
       };

       $scope.insert = function() {
         CompanyApi.get('', function(argument) {
           if (argument && argument.err) {
             alert(argument.err);
           } else {
             $scope.post.parent = $cookies.UID;
             $scope.post.company_ref = argument._id;
             CustomerApi.post($scope.post, function(result) {
               //$log.warn(result);
               $location.path('select_customer').search("room_id=" + $routeParams.room_id);
               $location.replace();
             });
           }
         });
       };
       var test = new FormData();
       $scope.idcarduploadfront = function(evt) {
         ////console.log("yoyo");
         //document.getElementById('Previewzone').innerHTML = "";
         test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);

           // test.append('user_id', $cookies.UID);
           // test.append("id", response._id);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.id_card_pic_front = xhr.responseText;
               ////console.log($scope.post);
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/idcard");
           xhr.send(test);
         }

       };
       $scope.idcarduploadback = function(evt) {
         ////console.log("yoyo");
         //document.getElementById('Previewzone').innerHTML = "";
         test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);

           // test.append('user_id', $cookies.UID);
           // test.append("id", response._id);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.id_card_pic_back = xhr.responseText;
               ////console.log($scope.post);
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/idcard");
           xhr.send(test);
         }

       };


     }
   ]).controller('PersonCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$http', '$location', '$anchorScroll', 'CustomerApi', 'Room', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $http, $location, $anchorScroll, CustomerApi, Room, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.post = {};
       $scope.getcontent = function() {
         $scope.array_person = $scope.person_area.split('!');
         $scope.post.id_card = parseInt($scope.array_person[0]);
         $scope.post.birth_date = new Date($scope.array_person[1].split('/')[2] - 543, $scope.array_person[1].split('/')[1] - 1, $scope.array_person[1].split('/')[0]);
         $scope.post.prefix = $scope.array_person[3];
         $scope.post.name = $scope.array_person[4];
         $scope.post.last_name = $scope.array_person[5];
         $scope.post.id_card_create = new Date($scope.array_person[6].split('/')[2] - 543, $scope.array_person[6].split('/')[1] - 1, $scope.array_person[6].split('/')[0]);
         $scope.post.id_card_expiry = new Date($scope.array_person[7].split('/')[2] - 543, $scope.array_person[7].split('/')[1] - 1, $scope.array_person[7].split('/')[0]);
         $scope.post.address_no = $scope.array_person[8];
         $scope.post.address_moo = ($scope.array_person[9] === " " ? '-' : $scope.array_person[9]);
         $scope.post.address_road = $scope.array_person[11];
         $scope.post.address_tumbol = $scope.array_person[12];
         $scope.post.address_aumphur = $scope.array_person[13];
         $scope.post.address_province = $scope.array_person[14];
         //$log.log($scope.array_person);
       };
       // Grab elements, create settings, etc.
       // Put event listeners into place

       // Grab elements, create settings, etc.
       function dataURItoBlob(dataURI) {
         // convert base64/URLEncoded data component to raw binary data held in a string
         var byteString;
         if (dataURI.split(',')[0].indexOf('base64') >= 0)
           byteString = atob(dataURI.split(',')[1]);
         else
           byteString = unescape(dataURI.split(',')[1]);

         // separate out the mime component
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

         // write the bytes of the string to a typed array
         var ia = new Uint8Array(byteString.length);
         for (var i = 0; i < byteString.length; i++) {
           ia[i] = byteString.charCodeAt(i);
         }

         return new Blob([ia], {
           type: mimeString
         });
       }

       $scope.callcamera = function function_name() {

           if (!$rootScope.isMobile) {
             var canvas = document.getElementById("canvas"),
               context = canvas.getContext("2d"),
               video = document.getElementById("video"),
               videoObj = {
                 "video": true
               },
               errBack = function(error) {
                 ////console.log("Video capture error: ", error.code);
               };
             if (navigator.getUserMedia) { // Standard
               navigator.getUserMedia(videoObj, function(stream) {
                 video.src = stream;
                 video.play();
               }, errBack);
             } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
               navigator.webkitGetUserMedia(videoObj, function(stream) {
                 video.src = window.webkitURL.createObjectURL(stream);
                 video.play();
               }, errBack);
             } else if (navigator.mozGetUserMedia) { // Firefox-prefixed
               navigator.mozGetUserMedia(videoObj, function(stream) {
                 video.src = window.URL.createObjectURL(stream);
                 video.play();
               }, errBack);
             }



             document.getElementById("snap").addEventListener("click", function() {
               context.drawImage(video, 0, 0, 640, 480);
               var img = canvas.toDataURL("image/png");

               var blob = dataURItoBlob(img);
               var fd = new FormData();
               fd.append("image", blob);
               var xhr = new XMLHttpRequest();
               xhr.upload.onprogress = function(e) {
                 //document.getElementById("process_bar_containner").className = 'modal__upload';
                 var percentComplete = (e.loaded / e.total) * 100;
                 //document.getElementById('process_bar').style.width = percentComplete + "%";
                 if (percentComplete == 100) {
                   //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                   //$scope.add_aprt = "show";
                 }
                 ////console.log(percentComplete);
               };

               xhr.onload = function() {
                 if (xhr.status == 200) {
                   //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                   $scope.post.id_card_pic_front = xhr.responseText;
                   ////console.log($scope.post);
                 } else {
                   //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                   alert("Error! Upload failed");
                 }
               };
               xhr.onerror = function() {
                 alert("Error! Upload failed. Can not connect to server.");
               };
               xhr.open("POST", "/idcard");
               xhr.send(fd);

             });
           }
         }
         // Put video listeners into place

       $scope.insert = function() {
         CompanyApi.get('', function(argument) {
           if (argument && argument.err) {
             alert(argument.err);
           } else {
             $scope.post.parent = $cookies.UID;
             $scope.post.company_ref = argument._id;
             CustomerApi.post($scope.post, function(result) {
               //$log.warn(result);
               $location.path('manage_customer');
               $location.replace();
             });
           }
         })

       };
       var test = new FormData();
       $scope.idcarduploadfront = function(evt) {
         ////console.log("yoyo");
         //document.getElementById('Previewzone').innerHTML = "";
         test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);

           // test.append('user_id', $cookies.UID);
           // test.append("id", response._id);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.id_card_pic_front = xhr.responseText;
               ////console.log($scope.post);
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/idcard");
           xhr.send(test);
         }

       };
       $scope.idcarduploadback = function(evt) {
         ////console.log("yoyo");
         //document.getElementById('Previewzone').innerHTML = "";
         test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);

           // test.append('user_id', $cookies.UID);
           // test.append("id", response._id);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.id_card_pic_back = xhr.responseText;
               ////console.log($scope.post);
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/idcard");
           xhr.send(test);
         }

       };


     }
   ]).controller('AddEmployeeCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$http', '$location', '$anchorScroll', 'EmployeeApi', 'Room', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $http, $location, $anchorScroll, EmployeeApi, Room, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();

       });
       $scope.post = {};
       $scope.getcontent = function() {
         $scope.array_person = $scope.person_area.split('!');
         $scope.post.employee_id_card = parseInt($scope.array_person[0]);
         $scope.post.employee_birth_date = new Date($scope.array_person[1].split('/')[2] - 543, $scope.array_person[1].split('/')[1] - 1, $scope.array_person[1].split('/')[0]);
         $scope.post.employee_prefix = $scope.array_person[3];
         $scope.post.employee_name = $scope.array_person[4];
         $scope.post.employee_last_name = $scope.array_person[5];
         $scope.post.employee_id_card_create = new Date($scope.array_person[6].split('/')[2] - 543, $scope.array_person[6].split('/')[1] - 1, $scope.array_person[6].split('/')[0]);
         $scope.post.employee_id_card_expiry = new Date($scope.array_person[7].split('/')[2] - 543, $scope.array_person[7].split('/')[1] - 1, $scope.array_person[7].split('/')[0]);
         $scope.post.employee_address_no = $scope.array_person[8];
         $scope.post.employee_address_moo = ($scope.array_person[9] === " " ? '-' : $scope.array_person[9]);
         $scope.post.employee_address_road = $scope.array_person[11];
         $scope.post.employee_address_tumbol = $scope.array_person[12];
         $scope.post.employee_address_aumphur = $scope.array_person[13];
         $scope.post.employee_address_province = $scope.array_person[14];
         //$log.log($scope.array_person);
       };
       // Grab elements, create settings, etc.
       // Put event listeners into place

       // Grab elements, create settings, etc.
       function dataURItoBlob(dataURI) {
         // convert base64/URLEncoded data component to raw binary data held in a string
         var byteString;
         if (dataURI.split(',')[0].indexOf('base64') >= 0)
           byteString = atob(dataURI.split(',')[1]);
         else
           byteString = unescape(dataURI.split(',')[1]);

         // separate out the mime component
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

         // write the bytes of the string to a typed array
         var ia = new Uint8Array(byteString.length);
         for (var i = 0; i < byteString.length; i++) {
           ia[i] = byteString.charCodeAt(i);
         }

         return new Blob([ia], {
           type: mimeString
         });
       }

       $scope.callcamera = function function_name() {

           if (!$rootScope.isMobile) {
             var canvas = document.getElementById("canvas"),
               context = canvas.getContext("2d"),
               video = document.getElementById("video"),
               videoObj = {
                 "video": true
               },
               errBack = function(error) {
                 ////console.log("Video capture error: ", error.code);
               };
             if (navigator.getUserMedia) { // Standard
               navigator.getUserMedia(videoObj, function(stream) {
                 video.src = stream;
                 video.play();
               }, errBack);
             } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
               navigator.webkitGetUserMedia(videoObj, function(stream) {
                 video.src = window.webkitURL.createObjectURL(stream);
                 video.play();
               }, errBack);
             } else if (navigator.mozGetUserMedia) { // Firefox-prefixed
               navigator.mozGetUserMedia(videoObj, function(stream) {
                 video.src = window.URL.createObjectURL(stream);
                 video.play();
               }, errBack);
             }



             document.getElementById("snap").addEventListener("click", function() {
               context.drawImage(video, 0, 0, 640, 480);
               var img = canvas.toDataURL("image/png");

               var blob = dataURItoBlob(img);
               var fd = new FormData();
               fd.append("image", blob);
               var xhr = new XMLHttpRequest();
               xhr.upload.onprogress = function(e) {
                 //document.getElementById("process_bar_containner").className = 'modal__upload';
                 var percentComplete = (e.loaded / e.total) * 100;
                 //document.getElementById('process_bar').style.width = percentComplete + "%";
                 if (percentComplete == 100) {
                   //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                   //$scope.add_aprt = "show";
                 }
                 ////console.log(percentComplete);
               };

               xhr.onload = function() {
                 if (xhr.status == 200) {
                   //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                   $scope.post.id_card_pic_front = xhr.responseText;
                   ////console.log($scope.post);
                 } else {
                   //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
                   alert("Error! Upload failed");
                 }
               };
               xhr.onerror = function() {
                 alert("Error! Upload failed. Can not connect to server.");
               };
               xhr.open("POST", "/idcard");
               xhr.send(fd);

             });
           }
         }
         // Put video listeners into place

       $scope.insert = function() {
         $scope.post.parent = $cookies.UID;
         $scope.post.permission = 8;
         CompanyApi.get('', function function_name(_id) {
           if (_id.$resolved) {
             $scope.post.company_ref = _id._id;
             EmployeeApi.post($scope.post, function(result) {
               //$log.warn(result);
               $location.path('manage_employee');
               $location.replace();
             });
           }

         })

       };
       var test = new FormData();
       $scope.idcarduploadfront = function(evt) {
         ////console.log("yoyo");
         //document.getElementById('Previewzone').innerHTML = "";
         test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);

           // test.append('user_id', $cookies.UID);
           // test.append("id", response._id);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };

           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.id_card_pic_front = xhr.responseText;
               ////console.log($scope.post);
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/idcard");
           xhr.send(test);
         }

       };
       $scope.idcarduploadback = function(evt) {
         ////console.log("yoyo");
         //document.getElementById('Previewzone').innerHTML = "";
         test = new FormData();
         if (evt.type.match('image.*')) {
           ////console.log("Error");
         } else {
           test.append("image", evt.files[0]);

           // test.append('user_id', $cookies.UID);
           // test.append("id", response._id);
           var xhr = new XMLHttpRequest();
           xhr.upload.onprogress = function(e) {
             //document.getElementById("process_bar_containner").className = 'modal__upload';
             var percentComplete = (e.loaded / e.total) * 100;
             //document.getElementById('process_bar').style.width = percentComplete + "%";
             if (percentComplete == 100) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               //$scope.add_aprt = "show";
             }
             ////console.log(percentComplete);
           };
           xhr.onload = function() {
             if (xhr.status == 200) {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               $scope.post.id_card_pic_back = xhr.responseText;
               ////console.log($scope.post);
             } else {
               //document.getElementById("process_bar_containner").className = 'modal__upload hidden__div';
               alert("Error! Upload failed");
             }
           };
           xhr.onerror = function() {
             alert("Error! Upload failed. Can not connect to server.");
           };
           xhr.open("POST", "/idcard");
           xhr.send(test);
         }
       };
     }
   ])
   .controller('EditPersonCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'CustomerApi', 'Room',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, CustomerApi, Room) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       CustomerApi.get({
         _id: $routeParams.person_id
       }, function(result) {

         $scope.post = result;
         $scope.post.birth_date = new Date(result.birth_date);
         $scope.post.id_card_create = new Date(result.id_card_create);
         $scope.post.id_card_expiry = new Date(result.id_card_expiry);
       });
       $scope.update = function() {
         CustomerApi.post($scope.post, function(result) {
           //$log.warn(result);
           $location.path('manage_customer');
           $location.replace();
         });
       };

     }
   ])
   .controller('EditEmployeeCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'EmployeeApi', 'CompanyApi', 'Menu',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, EmployeeApi, CompanyApi, Menu) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.apartment_list = [];
       $scope.select_property = function(id) {
         if ($scope.post.employee_property_ref.indexOf(id) == -1) {
           $scope.post.employee_property_ref.push(id.toString());
         } else {
           $scope.post.employee_property_ref.splice($scope.post.employee_property_ref.indexOf(id), 1);
         }
         //console.log($scope.post.employee_property_ref);
       }
       CompanyApi.query({
         property_request: 1
       }, function(result) {
         if (result.$resolved) {
           $scope.property_list = result;

           for (var i = $scope.property_list.length - 1; i >= 0; i--) {
             $scope.temp = {};
             $scope.temp._id = $scope.property_list[i]._id;
             $scope.temp.title = $scope.property_list[i].title;
             $scope.temp.select = true;
             $scope.apartment_list.push($scope.temp);
           };
           EmployeeApi.get({
             employee_id: $routeParams.employee_id
           }, function(result) {
             for (var i = $scope.apartment_list.length - 1; i >= 0; i--) {
               if (result.employee_property_ref.indexOf($scope.apartment_list[i]._id) != -1) {
                 $scope.apartment_list[i].select = true;
               } else {
                 $scope.apartment_list[i].select = false;
               }
             };
             $scope.post = result;
             $scope.post.employee_birth_date = new Date(result.employee_birth_date);
             $scope.post.employee_id_card_create = new Date(result.employee_id_card_create);
             $scope.post.employee_id_card_expiry = new Date(result.employee_id_card_expiry);
           });
           //console.log($scope.apartment_list);

         }

       });
       Menu.get('', function(result) {
         if (result.$resolved) {
           $scope.menu_list = result.menu;
         }
       })

       $scope.insert = function() {
         EmployeeApi.post($scope.post, function(result) {
           //$log.warn(result);
           $location.path('manage_employee');
           $location.replace();
         });
       };

     }
   ])
   .controller('PrintReportNoVatCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'InvoiceApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, InvoiceApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.inv = [];
         if ($routeParams.property_id !== undefined) {
           TransactionApi.query({
             property_id: $routeParams.property_id,
             year: $routeParams.year,
             month: $routeParams.month
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.report_list = result;
             }
           });
         } else if ($routeParams.transaction_id) {
           TransactionApi.get({
             transaction_id: $routeParams.transaction_id
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.$watch('report_list', function(a, b) {
                 //console.log(a);
                 //console.log(b);
               });
               $scope.report_list = [result];
             }
             //$log.log(result);
           });
         }
         $scope.$watch('report_list', function(a, b) {
           if (a) {


             $scope._invoice = function(result) {
               //console.log(result);
               for (var i = 0; i < $scope.report_list.length; i++) {
                 for (var j = 0; j < result.length; j++) {
                   if ($scope.report_list[i]._id === result[j].transaction_ref) {
                     $scope.report_list[i]._inv = result[j];
                     $scope.report_list[i]._invorder = result[j].running;
                   }
                 };
               }
             };
             for (var i = 0; i < $scope.report_list.length; i++) {
               $scope.inv.push($scope.report_list[i]._id);
             };
             InvoiceApi.post_query({
               invoice: $scope.inv
             }, $scope._invoice);
           }


         })

       });

     }
   ])
   .controller('PrintReportCompleteBillCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'ServerTime', 'InvoiceApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, ServerTime, InvoiceApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.water = 0;
       $scope.elect = 0;
       $scope.room_rate = 0;
       $scope.furniture_rate = 0;
       $scope.telephone_fee = 0;
       $scope.total = 0;
       $scope.inv = [];

       TransactionApi.query({
         transaction_type: 2,
         month: $routeParams.month,
         year: $routeParams.year,
         property_id: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           //console.log(result);
           $scope.report_list = result;
           $scope._invoice = function(result) {
             //console.log(result);
             for (var i = 0; i < $scope.report_list.length; i++) {
               for (var j = 0; j < result.length; j++) {
                 if ($scope.report_list[i]._id === result[j].transaction_ref) {
                   try {
                     $scope.report_list[i]._inv = result[j];
                     $scope.report_list[i]._invorder = result[j].running;
                     $scope.report_list[i]._inv = result[j];
                     $scope.report_list[i]._invorder = result[j].running;
                     $scope.report_list[i].water_total = (($scope.report_list[i].water_meter[0].water_meter - $scope.report_list[i].water_meter[1].water_meter) * $scope.report_list[i].room_ref.room_water_extra);
                     $scope.water += $scope.report_list[i].water_total;
                     $scope.report_list[i].elect_total = (($scope.report_list[i].elect_meter[0].elect_meter - $scope.report_list[i].elect_meter[1].elect_meter) * $scope.report_list[i].room_ref.room_energy_extra);
                     $scope.elect += $scope.report_list[i].elect_total;

                     $scope.room_rate += parseFloat($scope.report_list[i].room_ref.room_rate);
                     if ($scope.report_list[i].telephone) {
                       $scope.telephone_fee += parseFloat($scope.report_list[i].telephone.telephone_fee);
                       $scope.total += parseFloat($scope.report_list[i].telephone.telephone_fee);
                     }
                     if ($scope.report_list[i].room_ref.room_furniture) {
                       $scope.report_list[i].total_sum = parseFloat($scope.report_list[i].water_total) + parseFloat($scope.report_list[i].elect_total) + parseFloat($scope.report_list[i].room_ref.room_rate) + parseFloat($scope.report_list[i].room_ref.room_furniture);
                       $scope.furniture_rate += parseFloat($scope.report_list[i].room_ref.room_furniture);
                     } else {
                       $scope.report_list[i].total_sum = parseFloat($scope.report_list[i].water_total) + parseFloat($scope.report_list[i].elect_total) + parseFloat($scope.report_list[i].room_ref.room_rate);
                     }
                     $scope.total += $scope.report_list[i].total_sum;
                     $scope.report_list[i].name = $scope.report_list[i].customer_ref.name;
                   } catch (e) {
                     $scope.report_list.splice(i, 1);
                     //console.log(e);
                   }

                 }
               };
             }
           };
           for (var i = 0; i < $scope.report_list.length; i++) {
             $scope.inv.push($scope.report_list[i]._id);
           };
           InvoiceApi.post_query({
             invoice: $scope.inv
           }, $scope._invoice);
         }
       });
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
       });
     }
   ])
   .controller('PrintReportUnCompleteBillCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'InvoiceApi', 'ServerTime',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, InvoiceApi, ServerTime) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.inv = [];
       $scope.$watch('report_list', function(a, b) {
         if (a) {
           $scope._invoice = function(result) {
             for (var i = 0; i < $scope.report_list.length; i++) {
               for (var j = 0; j < result.length; j++) {
                 if ($scope.report_list[i]._id === result[j].transaction_ref) {
                   $scope.report_list[i]._inv = result[j];
                   $scope.report_list[i]._invorder = result[j].running;
                   $scope.report_list[i].water_total = (($scope.report_list[i].water_meter[0].water_meter - $scope.report_list[i].water_meter[1].water_meter) * $scope.report_list[i].room_ref.room_water_extra);
                   $scope.report_list[i].elect_total = (($scope.report_list[i].elect_meter[0].elect_meter - $scope.report_list[i].elect_meter[1].elect_meter) * $scope.report_list[i].room_ref.room_energy_extra);
                   $scope.report_list[i].total_sum = parseFloat($scope.report_list[i].water_total) + parseFloat($scope.report_list[i].elect_total) + parseFloat($scope.report_list[i].room_ref.room_rate) + parseFloat($scope.report_list[i].room_ref.room_furniture);
                   $scope.report_list[i].name = $scope.report_list[i].customer_ref.name;
                 }
               };
             };
             //console.log($scope.report_list);
           };

           for (var i = 0; i < $scope.report_list.length; i++) {
             $scope.inv.push($scope.report_list[i]._id);
           };

           InvoiceApi.post_query({
             invoice: $scope.inv
           }, $scope._invoice);
         };


       })
       Room.query({
         remain: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           //console.log(result);
           $scope.report_list = result;
         }
       });
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
       });
     }
   ])
   .controller('PrintReportVatCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'InvoiceApi', 'ServerTime',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, InvoiceApi, ServerTime) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         $scope.inv = [];
         if ($routeParams.property_id !== undefined) {
           TransactionApi.query({
             property_id: $routeParams.property_id,
             transaction_type: 4,
             year: $routeParams.year,
             month: $routeParams.month
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.report_list = result;
             }
           });
         } else if ($routeParams.transaction_id) {
           TransactionApi.get({
             transaction_id: $routeParams.transaction_id
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.$watch('report_list', function(a, b) {
                 //console.log(a);
                 //console.log(b);
               });
               $scope.report_list = [result];
             }
             //$log.log(result);
           });
         }
         $scope.$watch('report_list', function(a, b) {
           if (a) {


             $scope._invoice = function(result) {
               //console.log(result);
               for (var i = 0; i < $scope.report_list.length; i++) {
                 for (var j = 0; j < result.length; j++) {
                   if ($scope.report_list[i]._id === result[j].transaction_ref) {
                     $scope.report_list[i]._inv = result[j];
                     $scope.report_list[i]._invorder = result[j].running;
                   }
                 };
               }
             };
             for (var i = 0; i < $scope.report_list.length; i++) {
               $scope.inv.push($scope.report_list[i]._id);
             };
             InvoiceApi.post_query({
               invoice: $scope.inv
             }, $scope._invoice);
           }


         })

       });
       ServerTime.get('', function function_name(argument) {
         //console.log(argument);
         $scope.server_time = argument.time;
         //console.log($scope.server_time);
       });

     }
   ])
   .controller('PrintReportCustomVatCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi) {
       $scope.item_list = [];
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.items = [{
         name: 'ค่ามัดจำ',
         price: 500
       }, {
         name: 'ค่าประกัน',
         price: 10000
       }, {
         name: 'คาคีย์การ์ด',
         price: 100
       }, {
         name: 'อินเตอร์เน็ต',
         price: 300
       }, {
         name: 'ทีวี 21"',
         price: 100
       }];

     }
   ])
   .controller('PrintReportCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'InvoiceApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, InvoiceApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.inv = [];
         $scope.month = new Date().getMonth() + 1;

         if ($routeParams.property_id !== undefined) {
           TransactionApi.query({
             property_id: $routeParams.property_id,
             transaction_type: 4,
             year: $routeParams.year,
             month: $routeParams.month
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.billing_list = result;
             }
           });
         } else if ($routeParams.transaction_id) {
           TransactionApi.get({
             transaction_id: $routeParams.transaction_id
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.$watch('billing_list', function(a, b) {
                 //console.log(a);
                 //console.log(b);
               });
               $scope.billing_list = [result];
               setTimeout(function() {
                 var upper = $scope.billing_list[0]._id;
                 upper = upper.toUpperCase();
                 $scope.codetoupper = upper;
                 $scope.barid = "#bar_key";
                 $($scope.barid).barcode($scope.codetoupper, "code39");

               }, 300);

             }
             //$log.log(result);
           });
         } else if ($routeParams.tel) {
           TransactionApi.get({
             tel: $routeParams.tel
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.$watch('billing_list', function(a, b) {
                 //console.log(a);
                 //console.log(b);
               });
               $scope.billing_list = [result];

               setTimeout(function() {
                 if ($scope.billing_list && $scope.billing_list[0]._id) {
                   var upper = $scope.billing_list[0]._id;
                   upper = upper.toUpperCase();
                   $scope.codetoupper = upper;
                   $scope.barid = "#bar_key0";
                   $($scope.barid).barcode($scope.codetoupper, "code39");
                 }
               }, 200);

             }
             //$log.log(result);
           });
         } else if ($routeParams.room) {
           TransactionApi.get({
             room_no: $routeParams.transaction_id
           }, function OnGetTransaction(result) {
             if (result.$resolved) {
               $scope.$watch('billing_list', function(a, b) {
                 //console.log(a);
                 //console.log(b);
               });
               $scope.billing_list = [result];
               setTimeout(function() {
                 var upper = $scope.billing_list[0]._id;
                 upper = upper.toUpperCase();
                 $scope.codetoupper = upper;
                 $scope.barid = "#bar_key0";
                 $($scope.barid).barcode($scope.codetoupper, "code39");
               }, 200);

             }
             //$log.log(result);
           });
         }
         $scope.$watch('billing_list', function(a, b) {
           if (a) {
             setTimeout(function() {
               for (var i = 0; i < $scope.billing_list.length; i++) {
                 if ($scope.billing_list && $scope.billing_list[0]._id) {
                   var upper = $scope.billing_list[i]._id;
                   upper = upper.toUpperCase();
                   $scope.codetoupper = upper;
                   $scope.barid = "#bar_key" + $scope.billing_list[i].room_no;
                   $($scope.barid).barcode($scope.codetoupper, "code39");
                 }
               };
             }, 500);


             $scope._invoice = function(result) {
               //console.log(result);
               for (var i = 0; i < $scope.billing_list.length; i++) {
                 for (var j = 0; j < result.length; j++) {
                   if ($scope.billing_list[i]._id === result[j].transaction_ref) {
                     $scope.billing_list[i]._inv = result[j];
                     $scope.billing_list[i]._invorder = result[j].running;
                   }
                 };
               }
             };
             for (var i = 0; i < $scope.billing_list.length; i++) {
               $scope.inv.push($scope.billing_list[i]._id);
             };
             InvoiceApi.post_query({
               invoice: $scope.inv
             }, $scope._invoice);
           }


         })

       });



     }
   ])
   .controller('PrintReportCustomCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi) {
       $scope.item_list = [];
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.items = [{
         name: 'ค่ามัดจำ',
         price: 500
       }, {
         name: 'ค่าประกัน',
         price: 10000
       }, {
         name: 'คาคีย์การ์ด',
         price: 100
       }, {
         name: 'อินเตอร์เน็ต',
         price: 300
       }, {
         name: 'ทีวี 21"',
         price: 100
       }];

     }
   ]).controller('PrintReportBookingCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });

       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $scope.buildingid = result.building_ref._id;
         $rootScope.transaction = result;
         $rootScope.customer = result.customer_ref;
         $rootScope.building = result.building_ref;
         $rootScope.room = result.room_ref;
         $rootScope.property = result.property_ref;
         $scope.post = result;
         $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
         var upper = result.customer_ref._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key2').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });
     }
   ]).controller('PrintFurnitureListCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Adsservice',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Adsservice) {

       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       Adsservice.get({
         _id: $routeParams.apartment_id
       }, function(result) {
         if (result.$resolved) {
           $scope.property = result;
         }
       });

     }
   ]).controller('MakeAgreeMentCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'SendNotification',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, SendNotification) {
       $scope.post = [];
       $scope.post_body = {};
       $scope.post_body.date = new Date();
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.insert = function function_name(argument) {


         $scope.post_body.agreement_payment_status = $scope.transaction.agreement_payment_status;
         $scope.post_body._id = $scope.transaction._id;
         $scope.post_body.status = 0;
         TransactionApi.post($scope.post_body, function(result) {
           if (result) {
             // $scope.smsbody = {};
             // $scope.smsbody.email = $rootScope.property.contact_email;
             // $scope.smsbody.tel = $rootScope.property.contact_mobile;
             // $scope.smsbody.message = "ได้รับเงินจาก " + $rootScope.customer.name + " " + $rootScope.customer.last_name + " จำนวน : " + $scope.sum + " บาท";
             // //console.log($scope.smsbody);
             // if ($scope.smsconfirm == 0) {
             //   $scope.smsconfirm++;
             //   SendNotification.post($scope.smsbody, function(argument) {
             //     //console.log(argument);
             //   });
             // }
             // $scope.calendar_object = {
             //   title: "ได้รับเงินจาก " + $rootScope.customer.name,
             //   textColor: "black",
             //   backgroundColor: "#a7ed57",
             //   start: Date.now(),
             //   user_ref: $cookies.UID
             // };
             // CalendarApi.post($scope.calendar_object, function(result) {

             // });

             // TransactionApi.post($scope.post_body, function MakeAgreeMentCallback(result) {
             //   if (result) {
             //     //console.log(result);
             //     $location.path("print_agreement").search("transaction_id=" + result._id);
             //     $location.replace();
             //   }
             // });

             $location.path("print_agreement").search("transaction_id=" + result._id)
           }
         })

       };
       // $scope.insert = function MakeAgreeMent() {
       //   $scope.post_body = {};
       //   $scope.post_body._id = $rootScope.transaction._id;
       //   $scope.post_body.coverage = $rootScope.transaction.coverage;
       //   $scope.post_body.date_death_line = $rootScope.transaction.date_death_line;
       //   $scope.post_body.move_in_date = $rootScope.transaction.move_in_date;
       //   $scope.post_body.moveout_date = $rootScope.transaction.moveout_date;
       //   $scope.post_body.transaction_step = 3;


       // };
       if ($routeParams.transaction_id) {
         TransactionApi.get({
           transaction_id: $routeParams.transaction_id
         }, function OnGetTransaction(result) {
           $rootScope.transaction = result;
           $rootScope.accompany = result.accompany;
           $rootScope.customer = result.customer_ref;
           $rootScope.customer.birth_date = ($rootScope.customer.birth_date ? new Date($rootScope.customer.birth_date) : '');
           $rootScope.customer.id_card_create = ($rootScope.customer.id_card_create ? new Date($rootScope.customer.id_card_create) : '');
           $rootScope.customer.id_card_expiry = ($rootScope.customer.id_card_expiry ? new Date($rootScope.customer.id_card_expiry) : '');
           $rootScope.transaction.move_in_date = ($rootScope.transaction.move_in_date ? new Date($rootScope.transaction.move_in_date) : '');
           $rootScope.building = result.building_ref;
           $rootScope.transaction.moveout_date = new Date($rootScope.transaction.move_in_date);
           $rootScope.transaction.moveout_date.setYear($rootScope.transaction.moveout_date.getFullYear() + 1);
           $rootScope.transaction.moveout_date = new Date($rootScope.transaction.moveout_date);
           $rootScope.room = result.room_ref;
           $rootScope.property = result.property_ref;
           $scope.buildingid = result.building_ref._id;
           $scope.post = result;
           $scope.post_body.coverage = parseInt($rootScope.property.deposit);
           $scope.post_body.advance_paid = parseInt($rootScope.room.room_rate) + parseInt($rootScope.room.room_furniture);
           //console.log("post_body");
           //console.log($scope.post_body);
           $rootScope.transaction.coverage = parseInt($rootScope.property.deposit);
           $scope.pricetostring = $filter('thbToString')($scope.post_body.reserve_price.toString());
           var upper = result._id;
           upper = upper.toUpperCase();
           $scope.codetoupper = upper;
           $('#bar_key').barcode($scope.codetoupper, "code39");
           //$log.log(result);
         });
       } else if ($routeParams.room_id) {
         TransactionApi.get({
           reserve_id: $routeParams.room_id
         }, function OnGetTransaction(result) {
           $rootScope.transaction = result;
           $rootScope.accompany = result.accompany;
           $rootScope.customer = result.customer_ref;
           $rootScope.customer.birth_date = ($rootScope.customer.birth_date ? new Date($rootScope.customer.birth_date) : '');
           $rootScope.customer.id_card_create = ($rootScope.customer.id_card_create ? new Date($rootScope.customer.id_card_create) : '');
           $rootScope.customer.id_card_expiry = ($rootScope.customer.id_card_expiry ? new Date($rootScope.customer.id_card_expiry) : '');
           $rootScope.transaction.move_in_date = ($rootScope.transaction.move_in_date ? new Date($rootScope.transaction.move_in_date) : '');
           $rootScope.building = result.building_ref;
           $rootScope.transaction.moveout_date = new Date($rootScope.transaction.move_in_date);
           $rootScope.transaction.moveout_date.setYear($rootScope.transaction.moveout_date.getFullYear() + 1);
           $rootScope.transaction.moveout_date = new Date($rootScope.transaction.moveout_date);
           $rootScope.room = result.room_ref;
           $rootScope.property = result.property_ref;
           $scope.buildingid = result.building_ref._id;
           $scope.post = result;
           $scope.post_body.coverage = parseInt($rootScope.property.deposit);
           $scope.post_body.advance_paid = parseInt($rootScope.room.room_rate) + parseInt($rootScope.room.room_furniture);
           //console.log("post_body");
           //console.log($scope.post_body);
           $rootScope.transaction.coverage = parseInt($rootScope.property.deposit);
           $scope.pricetostring = $filter('thbToString')($scope.post_body.reserve_price.toString());
           var upper = result._id;
           upper = upper.toUpperCase();
           $scope.codetoupper = upper;
           $('#bar_key').barcode($scope.codetoupper, "code39");
           //$log.log(result);
         });
       }
     }
   ]).controller('MakeAgreeMentReceiptCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'SendNotification', 'CalendarApi',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, SendNotification, CalendarApi) {
       $scope.post = [];

       $scope.payment_list = [];
       $scope.item = [{
         name: 'ค่ามัดจำ',
         price: 500
       }, {
         name: 'ค่าประกัน',
         price: 10000
       }, {
         name: 'คาคีย์การ์ด',
         price: 100
       }, {
         name: 'อินเตอร์เน็ต',
         price: 300
       }, {
         name: 'ทีวี 21"',
         price: 100
       }];
       $scope.post.payment_this = [];
       $scope.post.date = new Date();
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.$watch('payment_list', function(a, b) {
         try {
           //console.log(a);
           $scope.sum = 0;
           //console.log("..........");
           for (var i = 0; i < a.length; i++) {
             $scope.sum += a[i].payment_this.price * a[i].amount;
           };
           //console.log($scope.sum);
         } catch (e) {}
       }, true);
       $scope.smsconfirm = 0;
       $scope.insert = function function_name(argument) {

         $scope.post_body = {};
         $scope.post_body.agreement_payment_status = $scope.transaction.agreement_payment_status;
         $scope.post_body._id = $scope.transaction._id;
         $scope.post_body.payment_list = $scope.payment_list;
         TransactionApi.post($scope.post_body, function(result) {
           if (result) {
             $scope.smsbody = {};
             $scope.smsbody.email = $rootScope.property.contact_email;
             $scope.smsbody.tel = $rootScope.property.contact_mobile;
             $scope.smsbody.message = "ได้รับเงินจาก " + $rootScope.customer.name + " " + $rootScope.customer.last_name + " จำนวน : " + $scope.sum + " บาท";
             //console.log($scope.smsbody);
             if ($scope.smsconfirm == 0) {
               $scope.smsconfirm++;
               SendNotification.post($scope.smsbody, function(argument) {
                 //console.log(argument);
               });
             }
             $scope.calendar_object = {
               title: "ได้รับเงินจาก " + $rootScope.customer.name,
               textColor: "black",
               backgroundColor: "#a7ed57",
               start: Date.now(),
               user_ref: $cookies.UID
             };
             CalendarApi.post($scope.calendar_object, function(result) {

             });

             TransactionApi.post($scope.post_body, function MakeAgreeMentCallback(result) {
               if (result) {
                 //console.log(result);
                 $location.path("print_agreement").search("transaction_id=" + result._id);
                 $location.replace();
               }
             });
             Room.post({
               confirm: result.room_ref._id,
               room_status: 2
             }, function OnUpdateRoom(argument) {
               // body...
               //$log.log(argument);
             });
             $location.path("print_agreement_receipt").search("transaction_id=" + result._id)
           }
         })

       };
       if ($routeParams.room_id !== undefined) {
         //console.log($routeParams.room_id + " **************");
         TransactionApi.get({
           room_ref: $routeParams.room_id
         }, function OnGetTransaction(result) {
           $rootScope.transaction = result;
           $rootScope.accompany = result.accompany;
           $rootScope.customer = result.customer_ref;
           $rootScope.customer.id_card_create = ($rootScope.customer.id_card_create ? new Date($rootScope.customer.id_card_create) : '');
           $rootScope.customer.id_card_expiry = ($rootScope.customer.id_card_expiry ? new Date($rootScope.customer.id_card_expiry) : '');
           $rootScope.transaction.move_in_date = ($rootScope.transaction.move_in_date ? new Date($rootScope.transaction.move_in_date) : '');
           $rootScope.building = result.building_ref;
           $rootScope.transaction.moveout_date = new Date($rootScope.transaction.moveout_date);
           $rootScope.transaction.move_in_date = new Date($rootScope.transaction.move_in_date);
           $rootScope.room = result.room_ref;
           $rootScope.property = result.property_ref;
           $scope.buildingid = result.building_ref._id;
           $scope.buildingid = result.building_ref._id;
           $scope.post = result;
           $scope.transaction.agreement_payment_status = 50;
           $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());

           $scope.payment_list = (result.payment_list ? result.payment_list : $scope.payment_list);
           $scope.roomrate = {

             payment_this: {
               "name": "ค่าห้อง",
               "price": result.room_ref.room_rate
             },
             amount: "1"
           };
           $scope.item.push({
             "name": "ค่าห้อง",
             "price": result.room_ref.room_rate
           });
           $scope.payment_list.unshift($scope.roomrate);
           var upper = result._id;
           upper = upper.toUpperCase();
           $scope.codetoupper = upper;
           $('#bar_key').barcode($scope.codetoupper, "code39");
           //$log.log(result);
         });
       } else if ($routeParams.transaction_id) {
         TransactionApi.get({
           transaction_id: $routeParams.transaction_id
         }, function OnGetTransaction(result) {
           $rootScope.transaction = result;
           $rootScope.accompany = result.accompany;
           $rootScope.customer = result.customer_ref;
           $rootScope.customer.id_card_create = ($rootScope.customer.id_card_create ? new Date($rootScope.customer.id_card_create) : '');
           $rootScope.customer.id_card_expiry = ($rootScope.customer.id_card_expiry ? new Date($rootScope.customer.id_card_expiry) : '');
           $rootScope.transaction.move_in_date = ($rootScope.transaction.move_in_date ? new Date($rootScope.transaction.move_in_date) : '');
           $rootScope.building = result.building_ref;
           $rootScope.transaction.moveout_date = new Date($rootScope.transaction.moveout_date);
           $rootScope.transaction.move_in_date = new Date($rootScope.transaction.move_in_date);
           $rootScope.room = result.room_ref;
           $rootScope.property = result.property_ref;
           $scope.buildingid = result.building_ref._id;
           $scope.buildingid = result.building_ref._id;
           $scope.post = result;
           $scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
           $scope.payment_list = (result.payment_list ? result.payment_list : $scope.payment_list);
           $scope.roomrate = {

             payment_this: {
               "name": "ค่าห้อง",
               "price": result.room_ref.room_rate
             },
             amount: "1"
           };
           $scope.item.push({
             "name": "ค่าห้อง",
             "price": result.room_ref.room_rate
           });
           $scope.payment_list.unshift($scope.roomrate);
           var upper = result._id;
           upper = upper.toUpperCase();
           $scope.codetoupper = upper;
           $('#bar_key').barcode($scope.codetoupper, "code39");
           //$log.log(result);
         });
       }

     }
   ]).controller('PrintAgreeMentCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi) {
       $scope.post = [];
       $scope.post_body = {};
       $scope.post_body.date = new Date();
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.insert = function() {
         TransactionApi.post({
           status: 1,
           _id: $rootScope.transaction._id
         }, function(result) {

         });


         Room.post({
           confirm: $rootScope.room._id,
           room_status: 2
         }, function OnUpdateRoom(argument) {
           // body...
           //$log.log(argument);
         });
       }
       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $rootScope.transaction = result;
         $rootScope.accompany = result.accompany;
         $rootScope.customer = result.customer_ref;
         $rootScope.customer.id_card_create = ($rootScope.customer.id_card_create ? new Date($rootScope.customer.id_card_create) : '');
         $rootScope.customer.id_card_expiry = ($rootScope.customer.id_card_expiry ? new Date($rootScope.customer.id_card_expiry) : '');
         $rootScope.transaction.move_in_date = ($rootScope.transaction.move_in_date ? new Date($rootScope.transaction.move_in_date) : '');
         $rootScope.building = result.building_ref;
         $rootScope.transaction.moveout_date = new Date($rootScope.transaction.moveout_date);
         $rootScope.transaction.move_in_date = new Date($rootScope.transaction.move_in_date);
         $rootScope.room = result.room_ref;
         $rootScope.property = result.property_ref;
         $scope.buildingid = result.building_ref._id;
         $rootScope.customer.birth_date = new Date($rootScope.customer.birth_date);
         $scope.post_body.coverage = result.coverage;
         $scope.post_body.advance_paid = result.advance_paid;
         $scope.post_body.move_in_date = result.move_in_date;
         $scope.post = result;
         //$scope.pricetostring = $filter('thbToString')($scope.post.reserve_price.toString());
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });
     }
   ]).controller('PrintAgreeMentReceiptCtrl', ['$scope', '$filter', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi',
     function($scope, $filter, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi) {
       $scope.post = [];
       $scope.post.date = new Date();
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         $scope.$watch('payment_list', function(a, b) {
           try {
             //console.log(a);
             $scope.sum = 0;
             //console.log("..........");
             for (var i = 0; i < a.length; i++) {
               $scope.sum += a[i].payment_this.price * a[i].amount;
             };
             //console.log($scope.sum);
           } catch (e) {}
         }, true);
       });

       TransactionApi.get({
         transaction_id: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         $rootScope.transaction = result;
         $rootScope.accompany = result.accompany;
         $rootScope.customer = result.customer_ref;
         $rootScope.customer.id_card_create = ($rootScope.customer.id_card_create ? new Date($rootScope.customer.id_card_create) : '');
         $rootScope.customer.id_card_expiry = ($rootScope.customer.id_card_expiry ? new Date($rootScope.customer.id_card_expiry) : '');
         $rootScope.transaction.move_in_date = ($rootScope.transaction.move_in_date ? new Date($rootScope.transaction.move_in_date) : '');
         $rootScope.building = result.building_ref;
         $rootScope.transaction.moveout_date = new Date($rootScope.transaction.moveout_date);
         $rootScope.transaction.move_in_date = new Date($rootScope.transaction.move_in_date);
         $rootScope.room = result.room_ref;
         $rootScope.property = result.property_ref;
         $scope.buildingid = result.building_ref._id;
         //$scope.pricetostring = $filter('thbToString')($scope.transaction.reserve_price.toString());

         $scope.payment_list = [];
         $scope.payment_list.push({
           payment_this: {
             name: "ค่าประกัน",
             price: parseInt(result.coverage)
           },
           amount: 1,
         });
         $scope.payment_list.push({
           payment_this: {
             name: "ค่าเช่าล่วงหน้า",
             price: parseInt(result.advance_paid)
           },
           amount: 1,
         });
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         //$log.log(result);
       });
     }
   ]).controller('PrintReceiptBookingCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       TransactionApi.get({
         receipt: $routeParams.transaction_id
       }, function OnGetTransaction(result) {
         //$log.log("result");
         //$log.log(result);
         //$log.log(result.receipt__id);
         $rootScope.customer = result.customer_ref;
         $rootScope.building = result.building_ref;
         $rootScope.room = result.room_ref;
         $rootScope.property = result.property_ref;

         var upper = result.customer_ref._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         var upper = result._id;
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key2').barcode($scope.codetoupper, "code39");
         $scope.transaction = result;
         $scope.transaction.date = new Date($scope.transaction.date);
         $scope.buildingid = result.building_ref._id;
         //$log.log("transaction");
         //$log.log($scope.transaction);
       });
     }
   ]).controller('ConfirmReceiptBookingCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Room', 'TransactionApi', 'SendNotification',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Room, TransactionApi, SendNotification) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
         var upper = "example1234";
         upper = upper.toUpperCase();
         $scope.codetoupper = upper;
         $('#bar_key').barcode($scope.codetoupper, "code39");
         $('#bar_key2').barcode($scope.codetoupper, "code39");
       });
       $scope.test = $scope.payment_status;
       if ($routeParams.transaction_id !== undefined) {
         TransactionApi.get({
           transaction_id: $routeParams.transaction_id
         }, function OnGetTransaction(result) {
           $rootScope.transaction = result;
           $rootScope.transaction = result;
           $rootScope.customer = result.customer_ref;
           $rootScope.building = result.building_ref;
           $rootScope.room = result.room_ref;
           $rootScope.property = result.property_ref;
           $scope.buildingid = result.building_ref._id;
           //$log.log(result);
         });
       } else {
         $location.path("index");
         $location.replace();
       }

       $scope.$watch('transaction.reserve_payment_status', function(a, b) {
         //$log.log(a);
         //$log.log("-------------------");
         //$log.log(b);
         $scope.reserve_payment_status = a;
         //$scope.$apply();
         //$rootScope.transaction.reserve_payment_status = $scope.reserve_payment_status;

       });
       $scope.savereceipt = function function_name() {
         //$log.log("pms");
         //$log.log($rootScope.transaction);
         $scope.post_body = $rootScope.transaction;
         delete $scope.post_body.accompany;
         $scope.post_body.property_ref = $scope.post_body.property_ref._id;
         $scope.post_body.customer_ref = $scope.post_body.customer_ref._id;
         $scope.post_body.building_ref = $scope.post_body.building_ref._id;
         $scope.post_body.room_ref = $scope.post_body.room_ref._id;
         $scope.post_body.reserve_payment_status = $scope.reserve_payment_status;
         // $scope.smsbody = {};
         // $scope.smsbody.tel = '0805994812';
         // $scope.smsbody.message = "Transfer "+": "+$rootScope.transaction.reserve_price;
         // SendNotification.post($scope.smsbody,function  (argument) {
         //   //console.log(argument);
         // })
         TransactionApi.post($scope.post_body, function OnGetTransaction(result) {
           if (result) {
             $rootScope.transaction = result;
             $rootScope.customer = result.customer_ref;
             $rootScope.building = result.building_ref;
             $rootScope.room = result.room_ref;
             // Room.post({_id:result.room_ref._id,room_status:3},function  (room) {
             //   //console.log(room)
             // });
             $rootScope.property = result.property_ref;
             //console.log(result);
             Room.post({
               confirm: result.room_ref._id,
               room_status: 1
             }, function OnUpdateRoom(argument) {
               // body...
               //$log.log(argument);
             });
             $location.path("print_receipt_booking").search('transaction_id=' + result._id);
             $location.replace();
           }
           //$log.log(result);


         });
       };

     }
   ])
   .controller('PropertyCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Adsservice', 'PropertyApi', 'CompanyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Adsservice, PropertyApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });

       $scope.property_list = [];
       CompanyApi.query({
         property_request: 1
       }, function(result) {
         $scope.property_list = result;
       });

       //$scope.property_list = [1,2,3];



       $scope.remove_property = function(id) {
         var r = confirm("คุณต้องการลบ " + name + " ออกจากระบบ");
         if (r == true) {

           PropertyApi.remove({
             _id: id
           }, function(result) {
             //$log.warn(result);
             Adsservice.query({
               user_id: $cookies.UID
             }, function(result) {
               $scope.property_list = result;
             });

           });
         } else {

         }

       };
     }
   ])
   .controller('BuildingCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Adsservice',

     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Adsservice) {

       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.building = {};
       Adsservice.query({
         user_id: $cookies.UID
       }, function(result) {
         $scope.property_list = result;
       });
       $scope.addbuilding = function OnAddBuilding() {
         $scope.building.property_ref = $scope.property._id;
         $scope.building.user_ref = $cookies.UID;
         if ($scope.building.user_ref) {
           Building.post({
             building: $scope.building
           }, function AddBuildingCallback(result) {
             //$log.warn(result);
             Building.query({
               user_ref: $cookies.UID
             }, function(result) {
               $rootScope.building_list = result;
               $rootScope.initwaiting = 1;
               $location.path('manage_building');
               $location.replace();

             });
           });
         } else {
           alert("กรุณา login หรือ หรือเปิดใช้งาน Cookies หากขัดข้องกรุณาติดต่อเจ้าหน้าที่");
         }

       };
     }
   ]).controller('ManageCustomerCtrl', ['$scope', '$rootScope', '$cookies', '$routeParams', '$location', '$anchorScroll', '$log', 'CustomerApi', 'CompanyApi',
     function($scope, $rootScope, $cookies, $routeParams, $location, $anchorScroll, $log, CustomerApi, CompanyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       CompanyApi.get('', function(company) {
         CustomerApi.query({
           company_id: company._id
         }, function(result) {
           $scope.customer_list = result;
           //$log.warn($scope.customer_list);
         });
       });

       $scope.del = function(id, name) {
         var r = confirm("คุณต้องการลบ " + name + " ออกจากระบบ");
         if (r == true) {
           CustomerApi.remove({
             _id: id
           }, function(result) {
             //$log.warn(result);
             CompanyApi.get('', function(company) {
               CustomerApi.query({
                 company_id: company._id
               }, function(result) {
                 $scope.customer_list = result;
                 //$log.warn($scope.customer_list);
               });
             });
           });
         } else {

         }

       };
     }
   ]).controller('RoomCtrl', ['$scope', '$rootScope', '$routeParams', '$log', '$location', '$anchorScroll', 'Room', 'PropertyApi', 'ElectApi', 'WaterApi',
     function($scope, $rootScope, $routeParams, $log, $location, $anchorScroll, Room, PropertyApi, ElectApi, WaterApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.room = {};
       $scope._id = $routeParams.building_id;
       for (var i = $rootScope.building_list.length - 1; i >= 0; i--) {
         if ($rootScope.building_list[i]._id.toString() === $scope._id.toString()) {
           PropertyApi.get({
             _id: $rootScope.building_list[i].property_ref
           }, function(result) {
             $scope.room.property_ref = result._id;
             $scope.room.room_rate_daily = result.dailyprice;
             $scope.room.room_rate = result.price_min;
             //$log.log(result);
           });
         }
       };

       //$log.log($rootScope.building_list);

       $scope.addroom = function OnAddBuilding() {
         $scope.room.building_ref = $routeParams.building_id;
         //$log.log($scope.room);
         Room.post({
           room: $scope.room
         }, function AddRoomCallback(result) {
           //$log.warn(result);
           if (!result._id) {
             alert('บันทึกไม่สำเร็จ หากต้องการให้ระบบดึงค่าห้องมาตรฐาน กรุณาเพิ่มค่าห้องไปที่ข้อมูลที่พักก่อน')
           } else {
             $location.path('/manage_room').search('building_id=' + $routeParams.building_id);
             $location.replace();
           }

         });
       };
     }
   ]).controller('ManageSiteCtrl', ['$scope', '$rootScope', '$log', '$routeParams', '$cookies', '$location', '$anchorScroll', 'Building', 'Adsservice', 'PropertyApi',
     function($scope, $rootScope, $log, $routeParams, $cookies, $location, $anchorScroll, Building, Adsservice, PropertyApi) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       Adsservice.query({
         user_id: $cookies.UID
       }, function(result) {
         $scope.property_list = result;
       });



       $scope.remove_building = function(id) {
         var r = confirm("คุณต้องการลบ " + name + " ออกจากระบบ");
         if (r == true) {

           PropertyApi.remove({
             _id: id
           }, function(result) {
             //$log.warn(result);
             Adsservice.query({
               user_id: $cookies.UID
             }, function(result) {
               $scope.property_list = result;
             });

           });
         } else {

         }

       };
     }
   ]).controller('ManagebuildingCtrl', ['$scope', '$routeParams', '$rootScope', '$log', '$cookies', '$location', '$anchorScroll', 'Building',
     function($scope, $routeParams, $rootScope, $log, $cookies, $location, $anchorScroll, Building) {
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       $scope.room = {};
       $scope.remove_building = function OnAddBuilding(id, name) {
         var r = confirm("คุณต้องการลบตึก " + name);
         if (r == true) {
           Building.remove({
             building_id: id
           }, function RemoveCallback(result) {
             //$log.warn(result);
             alert("ตึก " + result.building + " ถูกลบเรียบร้อยแล้ว");
             Building.query({
               user_ref: $cookies.UID
             }, function(result) {
               $rootScope.building_list = result;
               $rootScope.initwaiting = 1;
             });
           });
         } else {

         }

       };
     }
   ]).controller('ManageRoomCtrl', ['$scope', '$routeParams', '$rootScope', '$log', '$location', 'Room', 'Building', '$anchorScroll', 'MovingOut', 'ElectApi', 'WaterApi',
     function($scope, $routeParams, $rootScope, $log, $location, Room, Building, $anchorScroll, MovingOut, ElectApi, WaterApi) {
       $scope.post = {};
       $scope.routeId = 'test';
       $scope.building_id = $routeParams.building_id;
       $scope.moved_out_check = false;
       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         //$location.hash('goTop');
         // $anchorScroll();
       });

       Building.get({
         building_id: $routeParams.building_id
       }, function buildingCallback(result) {
         $scope.building_detail = result;
       });

       if ($routeParams.building_id) {
         $scope.buildingid = $routeParams.building_id;
         $scope.waiting = 0;
         Room.query({
           building_ref: $routeParams.building_id
         }, function QueryBuilding(result) {
           $scope.room_list = result;
           $scope.waiting = 1;
         });
       } else {

       }

       $scope.select_building = function(newValue) {
         $location.path('manage_room').search('building_id=' + newValue);
         $location.replace();
       };
       $scope.moved_out_toggle = function(id) {
         $scope.post.room_ref = id;
         ElectApi.query({
           room_ref: id,
           limit: 2
         }, function(elect) {
           $scope.before_elect = elect[0].elect_meter;
           $scope.post.elect_meter = elect[0].elect_meter;
         });
         WaterApi.query({
           room_ref: id,
           limit: 2
         }, function(water) {
           $scope.before_water = water[0].water_meter;
           $scope.post.water_meter = water[0].water_meter;
         });
         $scope.moved_out_check = !$scope.moved_out_check;
       };


       $scope.remove_room = function RemoveRoom(id, name) {
         var r = confirm("คุณต้องการลบห้อง " + name);
         if (r == true) {
           Room.remove({
             room_id: id
           }, function QueryBuilding(result) {

             Room.query({
               building_ref: $routeParams.building_id
             }, function QueryBuilding(result) {
               $scope.room_list = result;
               $scope.waiting = 1;
             });
           });
         } else {

         }

       };
       $scope.moved_out = function(id, room_no) {

         var r = confirm("คุณต้องการย้ายออก ห้อง" + $scope.post.room_ref.room_no + "ใช่หรือไม่");
         if (r == true) {
           MovingOut.post($scope.post, function(ready) {
             if (ready.$resolved && ready.status === "ok") {
               MovingOut.post({
                 moving_out: $scope.post.room_ref
               }, function(result) {
                 if (result && result.$resolved) {
                   //console.log(result);
                   MovingOut.get({
                     moved_out: result._id
                   }, function(receipt) {
                     if (receipt && receipt.$resolved)
                       $location.path("/print_report_vat").search("transaction_id=" + receipt._id);
                   });
                 }
               });
             }
           });
         };
       }
       $scope.moving_out = function MoveOut(id, room_no) {
         var r = confirm("คุณต้องการแจ้งย้ายออก ห้อง" + room_no + "ใช่หรือไม่");
         if (r == true) {
           Room.post({
             confirm: id,
             room_status: 4
           }, function OnUpdateRoom(argument) {
             // body...
             //$log.log(argument);
           });
         };
       };
     }
   ]).controller('loginCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$anchorScroll', '$log', '$cookies', 'Check', 'Building',
     function($scope, $rootScope, $routeParams, $location, $anchorScroll, $log, $cookies, Check, Building) {

       angular.element(document).ready(function() {
         $rootScope.checkpermission();
         // $location.hash("goTop");
         // $anchorScroll();
       });
       if ($cookies.UID) {
         $location.path('/index');
         $location.replace();
       } else {

       }
       $scope.login = function() {
         Check.query({
           username: $scope.login.username,
           password: $scope.login.pass
         }, function(res) {
           //$log.warn(res);
           if (res.permission !== undefined) {
             $rootScope.checkpermission();
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
             $scope.displayCheckBox = false;
             Building.query({
               user_ref: $cookies.UID
             }, function(result) {
               $rootScope.building_list = result;
               $rootScope.initwaiting = 1;
               //$log.log($rootScope.building_list);
             });
             $rootScope.checkpermission();
             window.open('/manager#!/index', "_self");
             // $location.path('/manager#!?/index');
             // $location.replace();
           } else {
             alert('กรุณาตรวจสอบ ชื่อผู้ใช้หรือรหัสผ่านอีกครั้ง!');
           }
         });
       };
     }
   ]);
 //@prepros-append directives.js
 //@prepros-append filters.js
 //@prepros-append services.js