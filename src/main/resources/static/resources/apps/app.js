(function () {
    'use strict';

	var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination', 'ngRoute']);
	 
    //[!] Angular 라우트 설정
    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.
            when('/mgmt/addr', {
                templateUrl: '/template/management/MgmtAddr.html',
                controller: 'BaseController'
            }).
            when('/mgmt/call', {
            	templateUrl: '/template/management/MgmtCall.html',
                controller: 'BaseController'
            }).
            when('/mgmt/sms', {
                templateUrl: '/template/management/MgmtSms.html',
                controller: 'BaseController'
            }).
            when('/mgmt/record', {
                templateUrl: '/template/management/MgmtRecord.html',
                controller: 'BaseController'
            }).
            when('/mgmt/counsellor', {
                templateUrl: '/template/management/MgmtCounsellor.html',
                controller: 'BaseController'
            }).
            when('/mgmt/counsellors', {
                templateUrl: '/template/management/MgmtCounsellors.html',
            }).
            when('/counsellor/addr', {
            	css: 'counsellor_menu.css',
                templateUrl: '/template/counsellor/CounsellorAddr.html',
                controller: 'BaseController'
            }).
            when('/counsellor/call', {
            	templateUrl: '/template/counsellor/CounsellorCall.html',
                controller: 'BaseController'
            }).
            when('/counsellor/sms', {
                templateUrl: '/template/counsellor/CounsellorSms.html',
                controller: 'BaseController'
            }).
            otherwise({
                redirectTo: '/mgmt/addr'
            });
    }]);

})();
