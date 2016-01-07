'use strict';

// angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination', 'ui.bootstrap.contextMenu'])
angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination'])
//  .controller('SigninCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
//
//    }
//  ])
  .controller('HomeCtrl', ['$scope', '$state',
    function($scope, $state) {
      $scope.signout = function() {
        // principal.authenticate(null);
        disconnect();
        // $state.go('signin');
      };
    }
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/home');

      $stateProvider.state('site', {
        'abstract': true,
      })
      .state('home', {
        parent: 'site',
        url: '/home',
        data: {
          roles: ['User', 'Admin']
        },
        views: {
          'content@': {
            templateUrl: 'view/addr.html',
            controller: 'CtrlCustomer'
          }/*,
          'maincontent@home': {
              templateUrl: 'view/addr.html',
              controller: 'CtrlCustomer'
          }*/
        }
      })
      .state('addr', {
        parent: 'home',
        url: '/addr',
        data: {
          roles: ['User', 'Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/addr.html',
              controller: 'CtrlCustomer'
          }
        }
      })
      .state('calls', {
        parent: 'home',
        url: '/calls',
        data: {
          roles: ['User', 'Admin']
        },
        views: {
          'maincontent@home': {
              templateUrl: 'view/calls.html',
              controller: 'CtrlCall'
          }
        }
      })
//      .state('login', {
//        parent: 'site',
//        url: '/login',
//        data: {
//          roles: []
//        },
//        views: {
//          'content@': {
//            templateUrl: 'view/login.html',
//            controller: 'SigninCtrl'
//          }
//        }
//      })
//      .state('restricted', {
//        parent: 'site',
//        url: '/restricted',
//        data: {
//          roles: ['Admin']
//        },
//        views: {
//          'content@': {
//            templateUrl: 'restricted.html'
//          }
//        }
//      })
      .state('accessdenied', {
        parent: 'site',
        url: '/denied',
        data: {
          roles: []
        },
        views: {
          'content@': {
            templateUrl: 'denied.html'
          }
        }
      });
    }
  ])
  .run(['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    	  //console.log("$rootScope.$on.toState : " + angular.toJson(toState));
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
      });
    }
  ]);