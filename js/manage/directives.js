'use strict';

/* Directives */

angular.module('manage.directives', ['ngAnimate', 'ngSanitize']).
directive('appVersion', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
  .directive('flowControl', ['$http', '$cookies', function($http, $cookies) {
    return {
      restrict: 'AEC',
      scope: {
        routeId: '=routeid'
      },
      templateUrl: 'manage/flow_detail.html',
      link: function(scope, element) {
        var flowId = $cookies.flowId;
        //console.log(flowId);
        $http.get('/flow/' + flowId).success(function(data) {
          scope.flow = data;
          //console.log(data);
          scope.next = data.pages[0].next + scope.routeId;
          scope.back = data.pages[0].back;
        });
      }
    };
  }])
  .directive('manageMenu', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/manage_menu.html'
    }
  }).directive('formRoomBooking', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_room_booking.html'
    }
  }).directive('formRoomBookingb', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_room_booking2.html'
    }
  }).directive('formAddEditChecklist', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_edit_checklist.html'
    }
  }).directive('formAddEditCoverage', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_edit_coverage.html'
    }
  }).directive('formReceiptMonthly', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_receipt_monthly.html'
    }
  }).directive('formAddEditAccountChartItem', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_edit_account_chart_item.html'
    }
  }).directive('formAddEditAccountChart', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_edit_account_chart.html'
    }
  }).directive('customerStep', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/customer_step.html'
    }
  }).directive('formAddPerson', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_person.html'
    }
  }).directive('formAddEmployee', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_employee.html'
    }
  }).directive('formAddEditDurable', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_edit_durable.html'
    }
  }).directive('formAddEditUtility', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_add_edit_utility.html'
    }
  }).directive('formReceiptRoomBooking', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_receipt_booking.html'
    }
  }).directive('formReceiptAgreemant', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_receipt_agreemant.html'
    }
  }).directive('adminChart', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/adminchart.html'
    }
  }).directive('formMakeAgreement', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_make_agreemane.html'
    }
  }).directive('formMakeAgreementb', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_make_agreemane2.html'
    }
  }).directive('roomColorIndex', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/room_color_index.html'
    }
  }).directive('menuIndex', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/menu_index.html'
    }
  }).directive('formMakeAgreementbEng', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/form_make_agreemane2_eng.html'
    }
  }).directive('manageStatusBar', function() {
    return {
      restrict: 'AEC',
      templateUrl: 'manage/directive/manage_statusbar.html'
    }

  }).directive('autoFocus', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(_scope, _element) {
        $timeout(function() {
          _element[0].focus();
        }, 0);
      }
    };
  }]);