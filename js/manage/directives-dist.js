"use strict";angular.module("manage.directives",["ngAnimate","ngSanitize"]).directive("appVersion",function(e){return function(t,r){r.text(e)}}).directive("manageMenu",function(){return{restrict:"AEC",templateUrl:"manage/directive/manage_menu.html"}}).directive("formRoomBooking",function(){return{restrict:"AEC",templateUrl:"manage/directive/form_room_booking.html"}}).directive("formReceiptRoomBooking",function(){return{restrict:"AEC",templateUrl:"manage/directive/form_receipt_booking.html"}}).directive("manageStatusBar",function(){return{restrict:"AEC",templateUrl:"manage/directive/manage_statusbar.html"}});