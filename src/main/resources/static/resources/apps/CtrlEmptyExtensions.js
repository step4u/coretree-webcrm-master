	angular.module('app')
	.controller('CtrlGroups', ['$scope', '$http', 'uiGridConstants', '$stateParams'
	                             , function ($scope, $http, uiGridConstants, $stateParams) {

		$http.get('/extension/get/emptyext')
		.success(function(response) {
			$scope.options = response;
//			var item = response.find(function(element, index){
//				return element.depthorder == group;
//			});
//			
//			if (typeof(item) == 'undefined') {
//				$scope.modeloption = "";
//			} else {
//				$scope.modeloption = item;
//			}
		});
	}]);