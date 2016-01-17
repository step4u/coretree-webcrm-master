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
			var extitem = angular.fromJson(jsonData);
			
			var item = $scope.gridOptions.data.find(function(element, index){
				
				if (crmidentity.ext != element.innertel) {
					switch (element.status) {
						case '미등록':
							extstatecount.unreg++;
							break;
						case '대기중':
							extstatecount.idle++;
							break;
						case '통화시도':
							extstatecount.invite++;
							break;
						case '전화울림':
							extstatecount.ring++;
							break;
						case '통화중':
							extstatecount.busy++;
							break;
					}					
				}
				
				return element.innertel === extitem.extension;
			});
			
			if (item) {
				switch (extitem.status) {
					case UC_CALL_STATE_UNREG:
						item.status = '미등록';
						break;
					case UC_CALL_STATE_IDLE:
						item.status = '대기중';
						break;
					case UC_CALL_STATE_INVITING:
						item.status = '통화시도';
						break;
					case UC_CALL_STATE_RINGING:
						item.status = '전화울림';
						break;
					case UC_CALL_STATE_BUSY:
						item.status = '통화중';
						break;
				}
			}
			
			if (crmidentity.ext == extitem.extension) {
				// console.log("extstatecount->extitem.extension: " + extitem.extension + ", invite: " + extstatecount.invite + ", ring: " + extstatecount.ring);
				SetMyState(extitem, extstatecount);
			}
		};
		
		$scope.gridOptions = {
				enableSorting: false,
				showGridFooter: false,
				columnDefs: [
				 		      { displayName: '내선번호', field: 'extension', headerCellClass: 'white', cellClass: 'grid-cell' },
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
	
		$http.get('/extension/get/all/0/0')
			.success(function(data) {
				console.log(JSON.stringify(data));
				$scope.gridOptions.data = data;
			}
		);
	}]);
