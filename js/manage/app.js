angular.module('ngRouteExample', ['ngRoute', 'ngAnimate', 'ngCookies', 'btford.socket-io', 'manage.controllers', 'manage.directives', 'manage.services', 'manage.filters'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider

    .when('/index', {
      templateUrl: '/manage/index.html',
      controller: 'ManageCtrl'
    })
    .when('/addroom', {
      templateUrl: '/manage/add_room.html',
      controller: 'RoomCtrl'
    })
    // .when('/report_admin', {
    //   templateUrl: '/manage/report_admin.html',
    //   controller: 'ReportAdminCtrl'
    // })

  // Page
  .when('/flow', {
      templateUrl: '/manage/flow.html',
      controller: 'FlowCtrl'
    })
    .when('/flow/:flowId', {
      templateUrl: '/manage/flow_detail.html',
      controller: 'FlowDetailCtrl'
    })
    .when('/account_chart_detail_item', {
      templateUrl: '/manage/account_chart_detail_item.html',
      controller: 'AccountChartDetailItemCtrl'
    })
    .when('/close_accountant', {
      templateUrl: '/manage/close_accountant.html',
      controller: 'CloseAccountantCtrl'
    })
    .when('/print_report_complete_paid_billing', {
      templateUrl: '/manage/print_report_complete_paid_billing.html',
      controller: 'PrintReportCompletePaidBillingCtrl'
    })
    .when('/print_report_account_chart', {
      templateUrl: '/manage/print_report_account_chart.html',
      controller: 'PrintReportAccountChartCtrl'
    })
    .when('/addpage', {
      templateUrl: '/manage/add_page.html',
      controller: 'FlowAddPageCtrl'
    })
    .when('/addpage/:pageId', {
      templateUrl: '/manage/add_page.html',
      controller: 'FlowAddPageCtrl'
    })



  .when('/add_employee_company', {
      templateUrl: '/manage/add_employee_company.html',
      controller: 'AddEmployeeCompanyCtrl'
    })
    .when('/manage_account_chart', {
      templateUrl: '/manage/manage_account_chart.html',
      controller: 'ManageAccountChart'
    })
    .when('/add_account_chart', {
      templateUrl: '/manage/add_account_chart.html',
      controller: 'AddAccountChart'
    })
    .when('/edit_account_chart', {
      templateUrl: '/manage/edit_account_chart.html',
      controller: 'EditAccountChart'
    })
    .when('/edit_account_chart_item', {
      templateUrl: '/manage/edit_account_chart_item.html',
      controller: 'EditAccountChartItem'
    })
    .when('/print_bank_bill_payment', {
      templateUrl: '/manage/print_bank_bill_payment.html',
      controller: 'PrintBankBillPaymentCtrl'
    })
    .when('/account_chart_detail', {
      templateUrl: '/manage/account_chart_detail.html',
      controller: 'AccountChartDetailCtrl'
    })
    .when('/add_account_chart_item', {
      templateUrl: '/manage/add_account_chart_item.html',
      controller: 'AddAccountChartDetailItemCtrl'
    })
    .when('/edit_company', {
      templateUrl: '/manage/edit_company.html',
      controller: 'EditCompanyCtrl'
    })
    .when('/manage_download', {
      templateUrl: '/manage/manage_download.html',
      controller: 'ManageDownloadCtrl'
    })
    .when('/edit_company_owner', {
      templateUrl: '/manage/edit_company_owner.html',
      controller: 'EditCompanyOwnerCtrl'
    })
    .when('/add_company', {
      templateUrl: '/manage/add_company.html',
      controller: 'AddCompanyCtrl'
    })
    .when('/add_company_owner', {
      templateUrl: '/manage/add_company_owner.html',
      controller: 'AddCompanyOwnerCtrl'
    })
    .when('/print_report_tax', {
      templateUrl: '/manage/print_report_tax.html',
      controller: 'PrintReportCtrl'
    })
    .when('/manage_company', {
      templateUrl: '/manage/manage_company.html',
      controller: 'ManageCompanyCtrl'
    })
    .when('/company_detail', {
      templateUrl: '/manage/company_detail.html',
      controller: 'CompanyDetailCtrl'
    })
    .when('/print_report_elect_separate', {
      templateUrl: '/manage/print_report_elect_separate.html',
      controller: 'PrintReportElectWaterCtrl'
    })
    .when('/manage_expenses', {
      templateUrl: '/manage/manage_expenses.html',
      controller: 'ExpensesCtrl'
    })
    .when('/add_expenses', {
      templateUrl: '/manage/add_expenses.html',
      controller: 'AddExpensesCtrl'
    })
    .when('/print_report_water_separate', {
      templateUrl: '/manage/print_report_water_separate.html',
      controller: 'PrintReportElectWaterCtrl'
    })
    .when('/cashier_invoice', {
      templateUrl: '/manage/cashier_invoice.html',
      controller: 'CashierInvoiceCtrl'
    })
    .when('/addperson', {
      templateUrl: '/manage/add_person.html',
      controller: 'PersonCtrl'
    })
    .when('/addemployee', {
      templateUrl: '/manage/add_employee.html',
      controller: 'AddEmployeeCtrl'
    })
    .when('/editemployee', {
      templateUrl: '/manage/edit_employee.html',
      controller: 'EditEmployeeCtrl'
    })
    .when('/add_event', {
      templateUrl: '/manage/add_event.html',
      controller: 'AddEventCtrl'
    })
    .when('/manage_topup', {
      templateUrl: '/manage/manage_topup.html',
      controller: 'TopupCtrl'
    })
    .when('/manage_employee', {
      templateUrl: '/manage/manage_employee.html',
      controller: 'ManageEmployeeCtrl'
    })
    .when('/manage_order_payment', {
      templateUrl: '/manage/manage_order_payment.html',
      controller: 'ManageOrderPaymenyCtrl'
    })
    .when('/thank_you', {
      templateUrl: '/manage/thank_you.html',
      controller: 'ThankYouCtrl'
    })
    .when('/manage_statement', {
      templateUrl: '/manage/manage_statement.html',
      controller: 'ManageStatementCtrl'
    })
    .when('/update_payment', {
      templateUrl: '/manage/update_payment.html',
      controller: 'UpdatePaymentCtrl'
    })
    .when('/formaddperson', {
      templateUrl: '/manage/form_add_person.html',
      controller: 'FormPersonCtrl'
    })
    .when('/select_customer', {
      templateUrl: '/manage/select_customer.html',
      controller: 'SelectCustomerCtrl'
    })
    .when('/select_rent_type', {
      templateUrl: '/manage/select_rent_type.html',
      controller: 'SelectRentTypeCtrl'
    })
    .when('/confirm_rent', {
      templateUrl: '/manage/confirm_rent.html',
      controller: 'ConfirmRentCtrl'
    })
    .when('/addproperty', {
      templateUrl: '/manage/add_property.html',
      controller: 'AddPropertyCtrl'
    })
    .when('/room_detail', {
      templateUrl: '/manage/room_detail.html',
      controller: 'RoomDetailCtrl'
    })
    .when('/editperson', {
      templateUrl: '/manage/edit_person.html',
      controller: 'EditPersonCtrl'
    })
    .when('/manage_room', {
      templateUrl: '/manage/manage_room.html',
      controller: 'ManageRoomCtrl'
    })
    .when('/manage_water', {
      templateUrl: '/manage/manage_water.html',
      controller: 'ManageWaterCtrl'
    })
    .when('/manage_elec', {
      templateUrl: '/manage/manage_elec.html',
      controller: 'ManageElecCtrl'
    })
    .when('/manage_phone', {
      templateUrl: '/manage/manage_phone.html',
      controller: 'ManagePhoneCtrl'
    })
    .when('/manage_billing', {
      templateUrl: '/manage/manage_billing.html',
      controller: 'ManageBillingCtrl'
    })
    .when('/customer_billing', {
      templateUrl: '/manage/customer_billing.html',
      controller: 'CustomerBillingCtrl'
    })
    .when('/manage_property', {
      templateUrl: '/manage/manage_property.html',
      controller: 'PropertyCtrl'
    })
    .when('/manage_customer', {
      templateUrl: '/manage/manage_customer.html',
      controller: 'ManageCustomerCtrl'
    })
    .when('/manage_report', {
      templateUrl: '/manage/manage_report.html',
      controller: 'ReportCtrl'
    })
    .when('/login', {
      templateUrl: '/manage/login.html',
      controller: 'loginCtrl'
    })
    .when('/manage_building', {
      templateUrl: '/manage/manage_building.html',
      controller: 'ManagebuildingCtrl'
    })
    .when('/addbuilding', {
      templateUrl: '/manage/add_building.html',
      controller: 'BuildingCtrl'
    })
    .when('/editbuilding', {
      templateUrl: '/manage/edit_building.html',
      controller: 'editBuildingCtrl'
    })
    .when('/editroom', {
      templateUrl: '/manage/edit_room.html',
      controller: 'editRoomCtrl'
    })
    .when('/editproperty', {
      templateUrl: '/manage/edit_property.html',
      controller: 'EditPropertyCtrl'
    })
    .when('/print_report_elect_water', {
      templateUrl: '/manage/print_report_elect_water.html',
      controller: 'PrintReportElectWaterCtrl'
    })
    .when('/print_report', {
      templateUrl: '/manage/print_report.html',
      controller: 'PrintReportCtrl'
    })
    .when('/print_report_invoice', {
      templateUrl: '/manage/print_report_invoice.html',
      controller: 'PrintReportInvoiceCtrl'
    })
    .when('/print_report_uncomplete_billing', {
      templateUrl: '/manage/print_report_uncomplete_billing.html',
      controller: 'PrintReportUnCompleteBillCtrl'
    })
    .when('/print_report_complete_billing', {
      templateUrl: '/manage/print_report_complete_billing.html',
      controller: 'PrintReportCompleteBillCtrl'
    })
    .when('/print_report_custom', {
      templateUrl: '/manage/print_report_custom.html',
      controller: 'PrintReportCustomCtrl'
    })
    .when('/print_report_rented', {
      templateUrl: '/manage/print_report_rented.html',
      controller: 'PrintReportRentedCtrl'
    })
    .when('/print_report_monthly', {
      templateUrl: '/manage/print_report_monthly.html',
      controller: 'PrintReportRentedCtrl'
    })
    .when('/print_report_moveout', {
      templateUrl: '/manage/print_report_moveout.html',
      controller: 'PrintReportMoveOutCtrl'
    })
    .when('/print_report_vat', {
      templateUrl: '/manage/print_report_vat.html',
      controller: 'PrintReportVatCtrl'
    })
    .when('/print_report_novat', {
      templateUrl: '/manage/print_report_novat.html',
      controller: 'PrintReportNoVatCtrl'
    })
    .when('/print_report_income', {
      templateUrl: '/manage/print_report_income.html',
      controller: 'PrintReportIncomeCtrl'
    })
    .when('/print_report_custom_vat', {
      templateUrl: '/manage/print_report_custom_vat.html',
      controller: 'PrintReportCustomVatCtrl'
    })
    .when('/print_report_booking', {
      templateUrl: '/manage/print_report_booking.html',
      controller: 'PrintReportBookingCtrl'
    })
    .when('/print_furniture_list', {
      templateUrl: '/manage/print_furniture_list.html',
      controller: 'PrintFurnitureListCtrl'
    })
    .when('/confirm_receipt_booking', {
      templateUrl: '/manage/confirm_receipt_booking.html',
      controller: 'ConfirmReceiptBookingCtrl'
    })
    .when('/print_receipt_booking', {
      templateUrl: '/manage/print_receipt_booking.html',
      controller: 'PrintReceiptBookingCtrl'
    })
    .when('/make_agreement', {
      templateUrl: '/manage/make_agreement.html',
      controller: 'MakeAgreeMentCtrl'
    })
    .when('/make_agreement_eng', {
      templateUrl: '/manage/make_agreement_eng.html',
      controller: 'MakeAgreeMentCtrl'
    }).when('/print_agreement', {
      templateUrl: '/manage/print_agreement.html',
      controller: 'PrintAgreeMentCtrl'
    }).when('/print_agreement_eng', {
      templateUrl: '/manage/print_agreement_eng.html',
      controller: 'PrintAgreeMentCtrl'
    })
    .when('/make_coverage', {
      templateUrl: '/manage/make_room_coverage.html',
      controller: 'MakeRoomCoverageCtrl'
    }).when('/print_coverage', {
      templateUrl: '/manage/print_room_coverage.html',
      controller: 'PrintRoomCoverageCtrl'
    })
    .when('/make_agreement_receipt', {
      templateUrl: '/manage/make_agreement_receipt.html',
      controller: 'MakeAgreeMentReceiptCtrl'
    })
    .when('/make_room_checklist', {
      templateUrl: '/manage/make_room_checklist.html',
      controller: 'MakeRoomChecklist'
    })
    .when('/print_room_checklist', {
      templateUrl: '/manage/print_room_checklist.html',
      controller: 'PrintRoomChecklist'
    })
    .when('/print_receipt_monthly', {
      templateUrl: '/manage/print_receipt_monthly.html',
      controller: 'PrintReceiptMonthlyCtrl'
    })
    .when('/print_agreement_receipt', {
      templateUrl: '/manage/print_agreement_receipt.html',
      controller: 'PrintAgreeMentReceiptCtrl'
    })
    .when('/manage_durable', {
      templateUrl: '/manage/manage_durable.html',
      controller: 'ManageDurableCtrl'
    })
    .when('/add_durable', {
      templateUrl: '/manage/add_durable.html',
      controller: 'AddDurableCtrl'
    })
    .when('/edit_durable', {
      templateUrl: '/manage/edit_durable.html',
      controller: 'EditDurableCtrl'
    })
    .when('/manage_utility', {
      templateUrl: '/manage/manage_utility.html',
      controller: 'ManageUtilityCtrl'
    })
    .when('/manage_calendar', {
      templateUrl: '/manage/manage_calendar.html',
      controller: 'ManageCalendarCtrl'
    })
    .when('/manage_site', {
      templateUrl: '/manage/manage_site.html',
      controller: 'ManageSiteCtrl'
    })
    .when('/add_utility', {
      templateUrl: '/manage/add_utility.html',
      controller: 'AddUtilityCtrl'
    })
    .when('/edit_utility', {
      templateUrl: '/manage/edit_utility.html',
      controller: 'EditUtilityCtrl'
    })
    .when('/employee_detail', {
      templateUrl: '/manage/employee_detail.html',
      controller: 'EmployeeDetailCtrl'
    })
    .otherwise({
      redirectTo: '/login'
    });

  $locationProvider.html5Mode(false).hashPrefix('!');
}).run(['$rootScope', '$window', '$cookies', '$location', 'Building', '$routeParams', '$log', 'TransactionApi', 'Check', 'CompanyApi', "Room",
  function($rootScope, $window, $cookies, $location, Building, $routeParams, $log, TransactionApi, Check, CompanyApi, Room) {
    $rootScope.list_test = [];
    $rootScope.refresh_instance = true;
    for (var i = 0; i < 200; i++) {
      $rootScope.list_test.push(i);
    };

    $rootScope.startTime = function startTime() {
      var today = new Date();
      $rootScope.hh = today.getHours();
      $rootScope.mm = today.getMinutes();
      $rootScope.ss = today.getSeconds();
      $rootScope.mm = $rootScope.checkTime($rootScope.mm);
      $rootScope.ss = $rootScope.checkTime($rootScope.ss);
      try {
        document.getElementById('hh').innerHTML = $rootScope.hh + " : ";
        document.getElementById('mm').innerHTML = $rootScope.mm + " : ";
        document.getElementById('ss').innerHTML = $rootScope.ss;
      } catch (e) {

      }
      //console.log($rootScope.ss);
      //$rootScope.$apply();
      var t = setTimeout(function() {
        startTime()
      }, 500);
    };

    $rootScope.checkTime = function checkTime(i) {
      if (i < 10) {
        i = "0" + i
      }; // add zero in front of numbers < 10
      return i;
    };
    $rootScope.startTime();
    $rootScope.toggle = false;
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $rootScope.isMobile = true;
      $rootScope.isTablet = false;
    } else if (/iPad/i.test(navigator.userAgent)) {
      $rootScope.isMobile = true;
      $rootScope.isTablet = false;
    } else {
      $rootScope.isMobile = false;
      $rootScope.isTablet = false;
    }
    $rootScope.initwaiting = 0;

    $rootScope.callreportindex = function(newValue) {
      $location.path('print_report_booking').search("transaction_id=" + newValue);
    };


    $rootScope.checkpermission = function() {
      if ($routeParams.apartment_id) {
        Room.get({
          apartment_id: $routeParams.apartment_id
        }, function(result) {
          if (result.$resolved) {
            $rootScope.property_title = result.title;
          }
        });
      }
      if ($rootScope.initwaiting == 0) {
        $rootScope.building_list_id = [];
        $rootScope.initwaiting++;
        if (!$cookies.UID) {
          $location.path('/login');
          $location.replace();
        } else if ($rootScope.building_list) {
          if ($cookies.Permission >= 5 && $cookies.Permission <= 11) {} else {
            window.open('http://www.worldresident.net/#!/controlpanel', '_self');

          }
        } else {
          $rootScope.building_list = [];
          if ($cookies.Permission >= 5 && $cookies.Permission <= 11) {
            $rootScope.building_income_list = [];
            $rootScope.initwaiting = 0;
            if ($cookies.Name) {
              $rootScope.username = $cookies.Name;
              $rootScope.Permission = $cookies.Permission;
            } else {

            }
          } else {
            window.open('http://www.worldresident.net/#!/controlpanel', '_self');

          }
        }
        setTimeout(function function_name(argument) {

          if ($cookies.Name && $cookies.SUID) {
            Check.get('', function(res) {
              for (var key in res) {
                if (key.toString().search(/menu/) != -1) {
                  $rootScope[key] = res[key];
                }
              }
            });
            $rootScope.username = $cookies.Name;
            CompanyApi.query({
              building_request: 1
            }, function(result) {
              if (result && result.$resolved) {
                $rootScope.building_list = result;
                for (var i = 0; i < result.length; i++) {
                  $rootScope.building_list_id.push(result[i]._id);
                  var building_list = result[i]._id;
                  (function(building_list, i) {
                    TransactionApi.get({
                      building_income: building_list
                    }, function(result1) {
                      if (result1 && result1.$resolved) {

                        TransactionApi.get({
                          predict_building_income: building_list
                        }, function(result2) {
                          if (result2 && result2.$resolved) {
                            $rootScope.building_list[i].building_income = result1;
                            $rootScope.building_list[i].predict_building_income = result2;

                          }
                        });
                      }
                    });
                  })(building_list, i);
                };
                $rootScope.my_income = {
                  building_income: TransactionApi.get({
                    myincome: $rootScope.building_list_id
                  }, function(result) {
                    if (result.$resolved) {
                      return result
                    }
                  }),
                  predict_building_income: TransactionApi.get({
                    predict_myincome: $rootScope.building_list_id
                  }, function(result) {
                    if (result.$resolved) {
                      return result
                    }
                  }),
                  daily_building_income: TransactionApi.get({
                    daily_myincome: $rootScope.building_list_id
                  }, function(result) {
                    if (result.$resolved) {
                      console.log(result)
                      return result
                    }
                  })
                };
              }
            });

            CompanyApi.get({
              isOwner: 1
            }, function(result) {
              $rootScope.isOwner = result.isOwner;
              if (result.isOwner && $rootScope.refresh_instance) {
                $rootScope.refresh_instance = false;
                setInterval(function() {
                  CompanyApi.query({
                    property_request: 1
                  }, function(property_list) {
                    if (property_list.$resolved) {
                      $rootScope.property_list = property_list;
                      CompanyApi.query({
                        building_request: 1
                      }, function(result) {
                        if (result && result.$resolved) {
                          $rootScope.building_list = result;
                          for (var i = 0; i < result.length; i++) {
                            $rootScope.building_list_id.push(result[i]._id);
                            var building_list = result[i]._id;
                            (function(building_list, i) {
                              TransactionApi.get({
                                building_income: building_list
                              }, function(result1) {
                                if (result1 && result1.$resolved) {
                                  TransactionApi.get({
                                    predict_building_income: building_list
                                  }, function(result2) {
                                    if (result2 && result2.$resolved) {
                                      for (var j = 0; j < $rootScope.property_list.length; j++) {
                                        if ($rootScope.property_list[j]._id === $rootScope.building_list[i].property_ref._id) {
                                          if ($rootScope.property_list[j].building_income) {
                                            for (var key in result1) {
                                              $rootScope.property_list[j].building_income[key] += result1[key];
                                            }
                                          } else {
                                            $rootScope.property_list[j].building_income = result1;
                                          }
                                          if ($rootScope.property_list[j].predict_building_income) {
                                            for (var key in result2) {
                                              $rootScope.property_list[j].predict_building_income[key] += result2[key];
                                            }
                                          } else {
                                            $rootScope.property_list[j].predict_building_income = result2;
                                          }

                                        }
                                      };


                                    }
                                  });
                                }
                              });
                            })(building_list, i);
                          };
                          $rootScope.my_income = {
                            building_income: TransactionApi.get({
                              myincome: $rootScope.building_list_id
                            }, function(result) {
                              if (result.$resolved) {
                                return result
                              }
                            }),
                            predict_building_income: TransactionApi.get({
                              predict_myincome: $rootScope.building_list_id
                            }, function(result) {
                              if (result.$resolved) {
                                return result
                              }
                            }),
                            daily_building_income: TransactionApi.get({
                              daily_myincome: $rootScope.building_list_id
                            }, function(result) {
                              if (result.$resolved) {
                                return result
                              }
                            })
                          };
                        }
                      });
                    }
                  })
                }, 10000)
              }
            });
          } else {

          }
          try {
            $rootScope.$apply();
          } catch (e) {
            console.log(e);
          }
          $rootScope.initwaiting = 0;
        }, 500)
      } else {

      }
    };

    // angular.element(document).ready(function() {
    //   $rootScope.checkpermission();

    // });
    $rootScope.logout = function LogOut() {
      var r = confirm("คุณต้องการลบ " + name + " ออกจากระบบ");
      if (r == true) {
        for (var key in $cookies) {
          delete $cookies[key];
        }
        $location.path('/login');
        $location.replace();
      } else {

      }

    };

  }
]);