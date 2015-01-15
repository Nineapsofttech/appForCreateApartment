'use strict';

describe('manage.controllers', function() {

  beforeEach(module('manage.controllers'));
  // 'ngCookies', 'datePicker', 'ngTouch', 'ngAnimate', 'ngSanitize', 'ui.calendar'
  beforeEach(module('ngCookies'));
  beforeEach(module('ngTouch'));
  beforeEach(module('ngAnimate'));
  beforeEach(module('ngRoute'));
  beforeEach(module('ngSanitize'));
  beforeEach(module('datePicker'));
  beforeEach(module('ui.calendar'));
  beforeEach(module('manage.services'));

  describe('ManageCtrl controller', function() {

    it('should do nothing', inject(function($controller, $routeParams, $location, $rootScope) {
      //spec body
      var scope = {},
        route = {},
        rootScope = {
          checkpermission: function() {}
        },
        log = {},
        anchorScroll = {},
        location = {},
        TransactionApi = {},
        ResetDemo = {};
      //'$rootScope', '$routeParams', '$log', '$anchorScroll', '$location', 'TransactionApi', 'ResetDemo'

      $rootScope.checkpermission = function() {};
      scope = $rootScope.$new();
      var ManageCtrl = $controller('ManageCtrl', {
        $scope: scope,
        // $rootScope: rootScope,
        $log: log,
        $TransactionApi: TransactionApi,
        $ResetDemo: ResetDemo,

      });
      expect(ManageCtrl).toBeDefined();
      
    }));


  });

  describe('PropertyCtrl controller', function () {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/myproperties').
          respond([{_id:'1'},{_id:'2'},{_id:'3'}]);
      $rootScope.checkpermission = function(){};
      scope = $rootScope.$new();
      ctrl = $controller('PropertyCtrl', {$scope: scope});
    }));

    it('should get property list from xhr', function() {
      $httpBackend.flush();
      expect(scope.property_list.length).toEqual(3);
    });
  });
});