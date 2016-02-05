	angular.module('app')
	.controller('CtrlGroups', ['$scope', '$http', 'uiGridConstants', '$stateParams'
	                             , function ($scope, $http, uiGridConstants, $stateParams) {

		$http.get('/customer/get/group')
		.success(function(response) {
			// console.log("CtrlGroups response: " + angular.toJson(response));
			$scope.options = response;
			var item = response.find(function(element, index){
				return element.depthorder == group;
			});
			
			if (typeof(item) == 'undefined') {
				$scope.modeloption = "";
				// console.log("response[0] : " + response[0]);
			} else {
				$scope.modeloption = item;
				// console.log("item : " + item.depthorder);
			}
		});
	}]);