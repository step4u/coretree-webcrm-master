	/* 내선 상태 */
	angular.module('app')
	.controller('CtrlTelStatus', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
		$scope.menuOptions = [
		                      ['당겨받기', function ($itemScope) {
		                          console.log("menuOptions 당겨받기");
		                          console.log($itemScope);
		                      }],
		                      null,
		                      ['돌려주기', function ($itemScope) {
		                    	  console.log("menuOptions 돌려주기");
		                    	  console.log(row);
		                      }],
		                      null,
		                      ['청취', function ($itemScope) {
		                    	  console.log("menuOptions 청취");
		                    	  console.log($itemScope.row);
		                      }]
		                  ];
		
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
		};
		
		$scope.gridOptions = {
				enableSorting: false,
				showGridFooter: false,
				columnDefs: [
				 		      { displayName: '내선번호', field: 'innertel', headerCellClass: 'white', cellClass: 'grid-cell' },
				 		      { displayName: '상태', field: 'status', headerCellClass:'white', cellClass: 'grid-cell' },
				 		      { displayName: '기타', field: 'etc', headerCellClass:'white', cellClass: 'grid-cell-align',
				 		    	  cellTemplate: '<button class="btn btn-primary btn-xs">청취</button>' }
				 		    ],
			    groupHeaders: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 2,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;
			    	$scope.gridApi.core.on.sortChanged( $scope, function( grid, sort ) {
			    		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
			    	})
			    }
		};
	
		$http.get('/resources/apps/app_data_tel_status.json')
			.success(function(data) {
				$scope.gridOptions.data = data;
			}
		);
	}]);
