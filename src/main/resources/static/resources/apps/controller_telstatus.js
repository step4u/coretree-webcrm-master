	/* 내선 상태 */
	angular.module('app')
	.controller('CtrlTelStatus', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {

		$scope.menuOptions = function (item) {
			var itm = item.entity;
		    return [
	            ['내선번호  [ ' + itm.innertel + ' ]', function(){return;}]
	            ,null
		        ,['전화 하기', function () {
		        	console.log("전화하기: " + angular.toJson(item.entity));
		        }]
		        ,['당겨 받기', function () {
		        	console.log("당겨받기: " + angular.toJson(item.entity));
		        }]
	            ,['돌려 주기', function () {
		        	console.log("돌려주기: " + angular.toJson(item.entity));
		        }]
	            ,['청취', function () {
		        	console.log("청취: " + angular.toJson(item.entity));
		        }]
		    ];
		};

		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
		};
		
		$scope.updateExtStatus = function(jsonData) {
			var data = angular.fromJson(jsonData);
//			var item = $.grep($scope.gridOptions.data, function(element, index){
//				// console.log("element.innertel : " + element.innertel);
//				return element.innertel == data.extension;
//			}); 
//			//console.log("updateExtStatus item : " + item.innertel + ", data.extension : " + data.extension);
//			var idx = $scope.gridOptions.data.indexOf(item.entity);
//			item.status = data.status;
//			//$scope.gridOptions.data.splice(idx, 1);
//			//$scope.gridOptions.data.splice(idx, 0, item);
			
			var item = $scope.gridOptions.data.find(function(element, index){
				return element.innertel === data.extension;
			});
			
			console.log("controller_telstatus 1 -> item : " + item);
			
			if (item) {
				// console.log("controller_telstatus 2 -> item : " + item);
				item.status = data.status;
			}
			
			//console.log("item.status : " + item.status);
			//var idx = $scope.gridOptions.data.indexOf(item);
			//item.status = data.status;
			//console.log("item.status : " + item.status);
			//$scope.gridOptions.data.splice(idx, 1);
			//$scope.gridOptions.data.splice(idx, 0, item);
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
		        enableVerticalScrollbar: 1,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;
			    	$scope.gridApi.core.on.sortChanged( $scope, function( grid, sort ) {
			    		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
			    	})
			    }
		};
		
		$scope.gridOptions.rowTemplate = '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell context-menu="grid.appScope.menuOptions(row)"></div>';
	
		$http.get('/resources/apps/app_data_tel_status.json')
			.success(function(data) {
				$scope.gridOptions.data = data;
			}
		);
	}]);
