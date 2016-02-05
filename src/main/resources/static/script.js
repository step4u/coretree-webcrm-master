'use strict';

// angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination', 'ui.bootstrap.contextMenu'])
angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination'])
// principal is a service that tracks the user's identity. 
// calling identity() returns a promise while it does what you need it to do
// to look up the signed-in user's identity info. for example, it could make an 
// HTTP request to a rest endpoint which returns the user's name, roles, etc.
// after validating an auth token in a cookie. it will only do this identity lookup
// once, when the application first runs. you can force re-request it by calling identity(true)
.factory('principal', ['$q', '$http', '$timeout',
  function($q, $http, $timeout) {
    var _identity = undefined,
      _authenticated = false;

    return {
      isIdentityResolved: function() {
        return angular.isDefined(_identity);
      },
      isAuthenticated: function() {
        return _authenticated;
      },
      isInRole: function(role) {
        if (!_authenticated || !_identity.roles) return false;

        return _identity.roles.indexOf(role) != -1;
      },
      isInAnyRole: function(roles) {
        if (!_authenticated || !_identity.roles) return false;

        for (var i = 0; i < roles.length; i++) {
          if (this.isInRole(roles[i])) return true;
        }

        return false;
      },
      authenticate: function(identity) {
          _identity = identity;
          _authenticated = identity != null;
          
          // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
          if (identity) localStorage.setItem("app.identity", angular.toJson(identity));
          else localStorage.removeItem("app.identity");
      },
      identity: function(force) {
        var deferred = $q.defer();

        if (force === true) _identity = undefined;

        // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
        if (angular.isDefined(_identity)) {
          deferred.resolve(_identity);

          return deferred.promise;
        }

        // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
        //                   $http.get('/svc/account/identity', { ignoreErrors: true })
        //                        .success(function(data) {
        //                            _identity = data;
        //                            _authenticated = true;
        //                            deferred.resolve(_identity);
        //                        })
        //                        .error(function () {
        //                            _identity = null;
        //                            _authenticated = false;
        //                            deferred.resolve(_identity);
        //                        });

        // for the sake of the demo, we'll attempt to read the identity from localStorage. the example above might be a way if you use cookies or need to retrieve the latest identity from an api
        // i put it in a timeout to illustrate deferred resolution
        var self = this;
        $timeout(function() {
          _identity = angular.fromJson(localStorage.getItem("app.identity"));
          self.authenticate(_identity);
          deferred.resolve(_identity);
        }, 500);

        return deferred.promise;
      }
    };
  }
])
// authorization service's purpose is to wrap up authorize functionality
// it basically just checks to see if the principal is authenticated and checks the root state 
// to see if there is a state that needs to be authorized. if so, it does a role check.
// this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
// route, the app resolves your identity before it does an authorize check. after that,
// authorize is called from $stateChangeStart to make sure the principal is allowed to change to
// the desired state
.factory('authorization', ['$rootScope', '$state', 'principal',
  function($rootScope, $state, principal) {
    return {
      authorize: function() {
        return principal.identity()
          .then(function() {
            var isAuthenticated = principal.isAuthenticated();
            
//            console.log("factory authorization -> isAuthenticated :" + isAuthenticated);
//            console.log("factory authorization -> $rootScope.toState.data.roles :" + $rootScope.toState.data.roles);
//            console.log("factory authorization -> $rootScope.toState.data.roles.length :" + $rootScope.toState.data.roles.length);
//            console.log("factory authorization -> !principal.isInAnyRole($rootScope.toState.data.roles) :" + !principal.isInAnyRole($rootScope.toState.data.roles));

            if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
              if (isAuthenticated) $state.go('accessdenied'); // user is signed in but not authorized for desired state
              else {
                // user is not authenticated. stow the state they wanted before you
                // send them to the signin state, so you can return them when you're done
                $rootScope.returnToState = $rootScope.toState;
                $rootScope.returnToStateParams = $rootScope.toStateParams;

                // now, send them to the signin state so they can log in
                $state.go('signin');
              }
            }
          });
      }
    };
  }
])
  .controller('SigninCtrl', ['$scope', '$http', '$state', 'principal', function($scope, $http, $state, principal) {
      $scope.signin = function() {
      
    	  var user = {
    			  id:$('#userid').val(),
    			  name:"",
    			  roles:[]
    	  };
    	  
          $http.post("/member/login/" + user.id + "/" + $('#userpwd').val())
  			.then(function successCallback(response) {
  				var data = response.data;
  				console.log("authenticate response.data : " + angular.toJson(data));
  				if (data.result) {
  					user.name = data.name;
  					user.roles = [ data.roles ];
  					
  			        // here, we fake authenticating and give a fake user
  			        principal.authenticate(user);
 			        connect();
  			        
  			        if ($scope.returnToState) $state.go($scope.returnToState.name, $scope.returnToStateParams);
  			        else $state.go('home');
  				} else {
  					return;
  				}
  			}
  			, function errorCallback(response) {
  				console.log("SigninCtrl login err : " + angular.toJson(response.data));
  				return;
  			});
      };
    }
  ])
  .controller('HomeCtrl', ['$scope', '$state', 'principal',
    function($scope, $state, principal) {
	  $scope.css = "resources/css/main.css";
      $scope.signout = function() {
        principal.authenticate(null);
        disconnect();
        $state.go('signin');
      };
    }
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider.state('site', {
        'abstract': true,
        resolve: {
          authorize: ['authorization',
            function(authorization) {
              return authorization.authorize();
            }
          ]
        }
      })
      .state('home', {
        parent: 'site',
        url: '/',
        data: {
          roles: ['User', 'Admin']
        },
        views: {
          'content@': {
            templateUrl: 'view/home.html',
            controller: 'HomeCtrl'
          },
          'maincontent@home': {
              templateUrl: 'view/addr.html',
              controller: 'CtrlCustomer'
          }
        }
      })
      .state('addr', {
        parent: 'home',
        url: 'addr',
        data: {
          roles: ['User', 'Admin']
        },
        views: {
          'maincontent@home': {
              templateUrl: 'view/addr.html',
              controller: 'CtrlCustomer'
          }
        }
      })
      .state('calls', {
        parent: 'home',
        url: 'calls',
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
      .state('signin', {
        parent: 'site',
        url: '/signin',
        data: {
          roles: []
        },
        views: {
          'content@': {
            templateUrl: 'view/login.html',
            controller: 'SigninCtrl'
          }
        }
      }).state('restricted', {
        parent: 'site',
        url: '/restricted',
        data: {
          roles: ['Admin']
        },
        views: {
          'content@': {
            templateUrl: 'restricted.html'
          }
        }
      }).state('accessdenied', {
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
  .run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal',
    function($rootScope, $state, $stateParams, authorization, principal) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    	  //console.log("$rootScope.$on.toState : " + angular.toJson(toState));
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (principal.isIdentityResolved()) authorization.authorize();
      });
    }
  ]);