'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);

angular.module('BasicHttpAuth', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies'
])

.config(['$stateProvider', '$routeProvider', function ($stateProvider, $routeProvider) {
    $stateProvider
        .state('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
        .state('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .otherwise({
    	    $routeProvider
    			.when('/counsellor/sms', {
    				templateUrl: '/template/counsellor/CounsellorSms.html',
    				controller: 'BaseController'
    			})
    			.otherwise({
    				redirectTo: '/login'
    			});
		});
}])
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);
