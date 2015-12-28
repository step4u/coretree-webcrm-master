	/*  상태 */
	angular.module('app')
	.controller('CtrlCallStatus', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
		};
		
		$scope.gridOptions = {
				enableSorting: false,
				showGridFooter: false,
				showHeader: false,
				columnDefs: [
				 		      { field: 'title', cellClass: 'grid-cell' },
				 		      { field: 'count', cellClass: 'grid-cell' }
				 		    ],
			    groupHeaders: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 0,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;
			    	$scope.gridApi.core.on.sortChanged( $scope, function( grid, sort ) {
			    		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
			    	})
			    }
		};
	
		$http.get('/resources/apps/app_data_call_status.json')
			.success(function(data) {
				$scope.gridOptions.data = data;
			}
		);
	}]);
