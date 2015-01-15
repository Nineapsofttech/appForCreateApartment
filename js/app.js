angular.module('ngRouteExample', ['ngRoute', 'ngAnimate', 'ngCookies', 'xeditable', 'btford.socket-io', 'world.controllers', 'world.directives', 'world.services', 'world.filters', 'uiSlider', 'world.formdirective', 'world.buttondirective'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider

    .when('/1234', {
      templateUrl: '/template/first_step/create_building.html',
      controller: 'CreateBuildingCtrl'


    }).when('/map', {
      templateUrl: '/template/map9.html',
      controller: 'mapCtrl'

    })
    .when('/homes', {
      templateUrl: '/template/home.html',
      controller: 'mapCtrl'
    })
    .when('/report_tracker_ad', {
      templateUrl: '/template/report_tracker.html',
      controller: 'reporttrackerCtrl'
    })
    .when('/report_checker_ad', {
      templateUrl: '/template/report_checker.html',
      controller: 'memberCtrl'
    })
    .when('/webboard', {
      templateUrl: '/template/webboard.html',
      controller: 'boardCtrl'
    })
    .when('/view_topic', {
      templateUrl: '/template/form/topic_detail.html',
      controller: 'commentCtrl'
    })
    .when('/feedback', {
      templateUrl: '/template/webboard.html',
      controller: 'boardCtrl'
    })
    .when('/addvertisement', {
      templateUrl: '/template/webboard.html',
      controller: 'boardCtrl'
    })
    .when('/faq', {
      templateUrl: '/template/webboard.html',
      controller: 'boardCtrl'
    })
    .when('/aboutme', {
      templateUrl: '/template/aboutme.html',
      controller: 'listcontroller'
    })
    .when('/contactme', {
      templateUrl: '/template/contactme.html',
      controller: 'listcontroller'

    })
    .when('/faq', {
      templateUrl: '/template/faq.html',
      controller: 'listcontroller'


    })
    .when('/login', {
      templateUrl: '/template/login.html',
      controller: 'Login'

    })
    .when('/first_step_zero', {
      templateUrl: '/template/first_step/first_step_zero.html',
      controller: 'listcontroller'

    })
    .when('/first_step', {
      templateUrl: '/template/first_step/create_building.html',
      controller: 'CreateBuildingCtrl'

    })

  .when('/fine', {
      templateUrl: '/template/first_step/fine.html',
      controller: 'ChapterController'

    })
    .when('/create_building', {
      templateUrl: '/template/first_step/create_building.html',
      controller: 'ChapterController'

    })
    .when('/cost_of_utilities', {
      templateUrl: '/template/first_step/cost_of_utilities.html',
      controller: 'ChapterController'

    })
    .when('/service', {
      templateUrl: '/template/first_step/service.html',
      controller: 'ChapterController'

    })
    .when('/roomsmg', {
      templateUrl: '/template/manage/rooms/roomsmg.html',
      controller: 'ChapterController'

    })
    .when('/rooms_head_include', {
      templateUrl: '/template/manage/rooms/rooms_head_include.html',
      controller: 'ChapterController'

    })
    .when('/add_rooms', {
      templateUrl: '/template/manage/rooms/add_rooms.html',
      controller: 'ChapterController'

    })
    .when('/customers', {
      templateUrl: '/template/manage/customer/customers.html',
      controller: 'ChapterController'

    })
    .when('/customers_checkout', {
      templateUrl: '/template/manage/customer/checkout.html',
      controller: 'ChapterController'

    })
    .when('/documents', {
      templateUrl: '/template/first_step/documents.html',
      controller: 'ChapterController'

    })
    .when('/customers_vehicle_checkout', {
      templateUrl: '/template/manage/customer/customers_vehicle_checkout.html',
      controller: 'ChapterController'

    })
    .when('/customers_keycard', {
      templateUrl: '/template/manage/customer/customers_keycard.html',
      controller: 'ChapterController'

    })
    .when('/book_infomation', {
      templateUrl: '/template/manage/booking/book_infomation.html',
      controller: 'ChapterController'

    })
    .when('/booking', {
      templateUrl: '/template/manage/booking/booking.html',
      controller: 'ChapterController'

    })
    .when('/customers_vehicle', {
      templateUrl: '/template/manage/customer/customers_vehicle.html',
      controller: 'ChapterController'
    })
    .when('/charter_information', {
      templateUrl: '/template/manage/charter/charter_information.html',
      controller: 'ChapterController'
    })
    .when('/charter_booking', {
      templateUrl: '/template/manage/charter/charter_booking.html',
      controller: 'ChapterController'
    })
    .when('/charter_new_booking', {
      templateUrl: '/template/manage/charter/charter_new_booking.html',
      controller: 'ChapterController'
    })
    .when('/water_information', {
      templateUrl: '/template/manage/water/water_information.html',
      controller: 'ChapterController'
    })
    .when('/water_record', {
      templateUrl: '/template/manage/water/water_record.html',
      controller: 'ChapterController'
    })
    .when('/energy_information', {
      templateUrl: '/template/manage/energy/energy_information.html',
      controller: 'ChapterController'
    })
    .when('/energy_record', {
      templateUrl: '/template/manage/energy/energy_record.html',
      controller: 'ChapterController'
    })
    .when('/phone_information', {
      templateUrl: '/template/manage/phone/phone_information.html',
      controller: 'ChapterController'
    })

  .when('/phone_record', {
      templateUrl: '/template/manage/phone/phone_record.html',
      controller: 'ChapterController'
    })
    .when('/invoice_information', {
      templateUrl: '/template/manage/invoice/invoice_information.html',
      controller: 'ChapterController'
    })
    .when('/invoice_export', {
      templateUrl: '/template/manage/invoice/invoice_export.html',
      controller: 'ChapterController'
    })
    .when('/invoice_print', {
      templateUrl: '/template/manage/invoice/invoice_print.html',
      controller: 'ChapterController'
    })
    .when('/receipt_information', {
      templateUrl: '/template/manage/receipt/receipt_information.html',
      controller: 'ChapterController'
    })
    .when('/receipt_invoice', {
      templateUrl: '/template/manage/receipt/receipt_invoice.html',
      controller: 'ChapterController'
    })
    .when('/receipt_information_by_detail', {
      templateUrl: '/template/manage/receipt/receipt_information_by_detail.html',
      controller: 'ChapterController'
    })
    .when('/receipt_print', {
      templateUrl: '/template/manage/receipt/receipt_print.html',
      controller: 'ChapterController'
    })
    .when('/receipt_cancle', {
      templateUrl: '/template/manage/receipt/receipt_cancle.html',
      controller: 'ChapterController'
    })
    .when('/receipt_export_barcode', {
      templateUrl: '/template/manage/receipt/receipt_export_barcode.html',
      controller: 'ChapterController'
    })
    .when('/common_receipt_export', {
      templateUrl: '/template/manage/common_receipt/common_receipt_export.html',
      controller: 'ChapterController'
    })
    .when('/common_receipt_export_day', {
      templateUrl: '/template/manage/common_receipt/common_receipt_export_day.html',
      controller: 'ChapterController'
    })
    .when('/common_information', {
      templateUrl: '/template/manage/common_receipt/common_information.html',
      controller: 'ChapterController'
    })
    .when('/common_information_other', {
      templateUrl: '/template/manage/common_receipt/common_information_other.html',
      controller: 'ChapterController'
    })
    .when('/apartment_mobile', {
      template: '<apartment-mobile></apartment-mobile>'

    })
    .when('/check_out_report', {
      templateUrl: '/template/manage/check_out/check_out_report.html',
      controller: 'ChapterController'
    })
    .when('/check_out_report_information', {
      templateUrl: '/template/manage/check_out/check_out_report_information.html',
      controller: 'ChapterController'
    })
    .when('/check_out_report_other', {
      templateUrl: '/template/manage/check_out/check_out_report_other.html',
      controller: 'ChapterController'
    })
    .when('/report_income', {
      templateUrl: '/template/manage/report/report_income.html',
      controller: 'ChapterController'
    })
    .when('/report_book', {
      templateUrl: '/template/manage/report/report_book.html',
      controller: 'ChapterController'
    })
    .when('/report_confiscate', {
      templateUrl: '/template/manage/report/report_confiscate.html',
      controller: 'ChapterController'
    })
    .when('/report_charter', {
      templateUrl: '/template/manage/report/report_charter.html',
      controller: 'ChapterController'
    })
    .when('/report_income_booking', {
      templateUrl: '/template/manage/report/report_income_booking.html',
      controller: 'ChapterController'
    })
    .when('/report_other_receipt', {
      templateUrl: '/template/manage/report/report_other_receipt.html',
      controller: 'ChapterController'
    })
    .when('/report_unpaid_booking', {
      templateUrl: '/template/manage/report/report_unpaid_booking.html',
      controller: 'ChapterController'
    })
    .when('/report_charter_finish', {
      templateUrl: '/template/manage/report/report_charter_finish.html',
      controller: 'ChapterController'
    })
    .when('/report_room_adjust', {
      templateUrl: '/template/manage/report/report_room_adjust.html',
      controller: 'ChapterController'
    })
    .when('/sms_send', {
      templateUrl: '/template/manage/sms/sms_send.html',
      controller: 'ChapterController'
    })
    .when('/sms_send_report', {
      templateUrl: '/template/manage/sms/sms_send_report.html',
      controller: 'ChapterController'
    })
    .when('/sms_credit_history', {
      templateUrl: '/template/manage/sms/sms_credit_history.html',
      controller: 'ChapterController'
    })
    .when('/calendar', {
      templateUrl: '/template/manage/calendar/calendar.html',
      controller: 'ChapterController'
    })
    .when('/register', {
      templateUrl: '/template/register.html',
      controller: 'regisCtrl'
    })
    .when('/my_page', {
      templateUrl: '/template/template_user/template_standard.html',
      controller: 'filterCtrl'
    })
    .when('/my_page2', {
      templateUrl: '/template/template_user/template_standard2.html',
      controller: 'filterCtrl'
    })
    .when('/manage_profile', {
      templateUrl: '/template/manage/profile/manage_profile.html',
      controller: 'ChapterController'
    })
    .when('/public_information', {
      templateUrl: '/template/manage/public_information/public_information.html',
      controller: 'ChapterController'
    })
    .when('/public_informations', {
      templateUrl: '/template/first_step/public_information.html',
      controller: 'ChapterController'
    })
    .when('/building', {
      templateUrl: '/template/manage/building/building.html',
      controller: 'ChapterController'
    })
    .when('/cost_of_uti', {
      templateUrl: '/template/manage/cost_of_uti/cost_of_uti.html',
      controller: 'ChapterController'
    })
    .when('/information_service', {
      templateUrl: '/template/manage/service/information_service.html',
      controller: 'ChapterController'
    })
    .when('/add_service', {
      templateUrl: '/template/manage/service/add_service.html',
      controller: 'ChapterController'
    })
    .when('/edit_fine', {
      templateUrl: '/template/manage/fine/edit_fine.html',
      controller: 'ChapterController'
    })
    .when('/info', {
      templateUrl: '/template/info.html',
      controller: 'infoCtrl'
    })
    .when('/term_of_service', {
      templateUrl: '/template/term_of_service.html'
    })
    .when('/privacy_policy', {
      templateUrl: '/template/privacy_policy.html'
    })
    .when('/controlpanel', {
      templateUrl: '/template/user_control/controlpanel.html',
      controller: 'memberCtrl'
    })
    .when('/success', {
      templateUrl: '/template/success.html',
      controller: 'paypalSuccess'
    })
    .when('/edit_property', {
      templateUrl: '/template/user_control/apartment_filter.html',
      controller: 'filterCtrl'
    })
    .when('/filter_main', {
      templateUrl: '/template/apartment_filter_main.html',
      controller: 'fmCtrl'
    })
    .when('/profile_member', {
      templateUrl: '/template/user_control/profile.html',
      controller: 'memberCtrl'
    })
    .when('/apartment_member', {
      templateUrl: '/template/user_control/apartment.html',
      controller: 'memberCtrl'
    })
    .when('/apartment_admin', {
      templateUrl: '/template/user_control/apartment_admin.html',
      controller: 'memberCtrl'
    })
    .when('/customers_admin', {
      templateUrl: '/template/user_control/customers.html',
      controller: 'memberCtrl'
    })
    .when('/assign_customers_admin', {
      templateUrl: '/template/user_control/assign_customers.html',
      controller: 'adminCtrl'
    })
    .when('/stage_customers_admin', {
      templateUrl: '/template/user_control/assign_customers_stage.html',
      controller: 'adminCtrl'
    })
    .when('/sale_dashboard', {
      templateUrl: '/template/user_control/sale_dashboard.html',
      controller: 'adminCtrl'
    })
    .when('/customers_billing', {
      templateUrl: '/template/user_control/customers_billing.html',
      controller: 'customersCtrl'
    })
    .when('/customers_appointment', {
      templateUrl: '/template/user_control/customers_appointment.html',
      controller: 'adminCtrl'
    })
    .when('/customers_checkin', {
      templateUrl: '/template/user_control/customers_checkin.html',
      controller: 'adminCtrl'
    })
    .when('/ads_member', {
      templateUrl: '/template/user_control/ads.html',
      controller: 'memberCtrl'
    })
    .when('/ads_admin', {
      templateUrl: '/template/user_control/ads_admin.html',
      controller: 'adminCtrl'
    })
    .when('/web_member', {
      templateUrl: '/template/user_control/blog.html',
      controller: 'filterCtrl'
    })
    .when('/page', {
      templateUrl: '/template/template_user/page.html',
      controller: 'customerPageCtrl'
    })
    .when('/report_member', {
      templateUrl: '/template/user_control/report.html',
      controller: 'memberCtrl'
    })
    .when('/security_member', {
      templateUrl: '/template/user_control/security.html',
      controller: 'memberCtrl'
    })
    .when('/active_user', {
      templateUrl: '/template/user_control/active_user.html',
      controller: 'activeCtrl'
    })
    .when('/login_page', {
      templateUrl: '/template/login_page.html',
      controller: 'Login'
    })
    .when('/controlpanel_admin', {
      templateUrl: '/template/user_control/controlpanel_admin.html',
      controller: 'adminCtrl'
    })

  .when('/board_index', {
      templateUrl: '/template/board/board_index.html',
      controller: 'boardCtrl'
    })
    .when('/post_apartment', {
      templateUrl: '/template/board/board_index.html',
      controller: 'postCtrl'
    })
    .when('/result', {
      templateUrl: '/template/result.html',
      controller: ''
    })
    .when('/forget', {
      templateUrl: '/template/forget_pass.html',
      controller: 'resetpassCtrl'
    })
    .when('/view_ads', {
      templateUrl: '/template/user_control/view_ads.html',
      controller: 'Adsmanage'
    })
    .when('/permisson_ad', {
      templateUrl: '/template/user_control/permisson_ad.html',
      controller: 'memberCtrl'
    })
    .when('/customers_detail', {
      templateUrl: '/template/user_control/customers_detail.html',
      controller: 'customerdetailCtrl'
    })
    .otherwise({
      redirectTo: '/homes',
      controller: 'listcontroller'
    });



  // configure html5 to get links working on jsfiddle
  //$locationProvider.html5Mode(true);
  $locationProvider.html5Mode(false).hashPrefix('!');
}).run(['$rootScope', '$window', '$cookies', '$location', 'Building', '$routeParams', '$log','editableOptions',
  function($rootScope, $window, $cookies, $location, Building, $routeParams, $log ,editableOptions) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // some code..
    //console.log('mobile')
    $rootScope.isMobile = true;
  } else {
    //console.log("desktop")
    $rootScope.isMobile = false;
  }
  
  $window.prerenderReady = false;
  (function(d) {
    var script = d.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDnACcjGRPA_KhojEjtgHAzWBY9WsIW_rI&v=3.exp&sensor=true&' +
      'callback=initMap&libraries=places';
    d.body.appendChild(script);
  }(document));
  editableOptions.theme = 'default'; // bootstrap3 theme. Can be also 'bs2','default'
}]);



Array.prototype.contains = function(element) {
  return this.indexOf(element) > -1;
};
Array.prototype.getUnique = function() {
  var u = {},
    a = [];
  for (var i = 0, l = this.length; i < l; ++i) {
    if (u.hasOwnProperty(this[i])) {
      continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
  }
  return a;
}