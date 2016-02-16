'use strict';

angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination', 'ui.bootstrap.contextMenu'])
  .controller('HomeCtrl', ['$scope', '$state', function($scope, $state) {

      $scope.signout = function() {
        // principal.authenticate(null);
        disconnect();
        // $state.go('signin');
      };
    }
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/calls');

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
        parent: 'site',
        url: '/addr/:param',
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
        parent: 'site',
        url: '/calls',
        data: {
          roles: ['User', 'Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/calls.html',
              controller: 'CtrlCall'
          }
        }
      })
      .state('smses', {
        parent: 'site',
        url: '/smses',
        data: {
          roles: ['User', 'Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/smses.html',
              controller: 'CtrlSms'
          }
        }
      })
      .state('records', {
        parent: 'site',
        url: '/records',
        data: {
          roles: ['Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/records.html',
              controller: 'CtrlRecords'
          }
        }
      })
      .state('extensions', {
        parent: 'site',
        url: '/exts',
        data: {
          roles: ['Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/exts.html',
              controller: 'CtrlExts'
          }
        }
      })
      .state('counsellors', {
        parent: 'site',
        url: '/counsellors',
        data: {
          roles: ['Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/counsellors.html',
              controller: 'CtrlCounsellors'
          }
        }
      })
      // 개별 상담원 시간별 통화 내역
      .state('statistics0', {
        parent: 'site',
        url: '/statis0',
        data: {
          roles: ['Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/statistics0.html',
              controller: 'CtrlStatistics0'
          }
        }
      })
      .state('statistics1', {
        parent: 'site',
        url: '/statis1',
        data: {
          roles: ['Admin']
        },
        views: {
          'content@': {
              templateUrl: 'view/statistics1.html',
              controller: 'CtrlStatistics1'
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