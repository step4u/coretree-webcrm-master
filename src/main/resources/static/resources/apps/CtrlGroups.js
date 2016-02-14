	angular.module('app')
	.controller('CtrlGroups', ['$scope', '$http', 'uiGridConstants', '$stateParams'
	                             , function ($scope, $http, uiGridConstants, $stateParams) {
/*
		$http.get('/customer/get/group')
		.success(function(response) {
			$scope.options = response;
			var item = response.find(function(element, index){
				return element.depthorder == group;
			});
			
			if (typeof(item) == 'undefined') {
				$scope.modeloption = "";
			} else {
				$scope.modeloption = item;
			}
		});
*/
		
		$scope.bindSubGroup = function(){
			//console.log("$stateParams.param.substring(0,1) : " + $stateParams.param.substring(0,1));
			$http.get('/customer/get/group/' + $("#addCustomer #maingroup").val())
			.success(function(response) {
				$scope.options = response;
				var item = response.find(function(element, index){
					return element.subgroup == $stateParams.param.substring(1,2);
				});
				
				// console.log("item : " + angular.toJson(item));
				if (typeof(item) == 'undefined') {
					$scope.modeloption = "0";
				} else {
					$scope.modeloption = item.subgroup;
				}
			});
		};
		// $scope.bindSubGroup();
	}]);