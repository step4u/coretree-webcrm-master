	/* 내선 상태 */
	angular.module('app')
	.controller('CtrlTelStatus', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {

		$scope.menuOptions = function (item) {
			var itm = item.entity;
		    return [
	            ['내선번호  [ ' + itm.extension + ' ]', function(){return;}]
	            ,null
		        ,['전화 하기', function () {
					trade = {
			                cmd: 74,
			                extension: crmidentity.ext,
			                caller: crmidentity.ext,
			                callee: itm.extension,
			                unconditional: '',
			                status: -1
			              };
			     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		        	// console.log("전화하기: " + angular.toJson(item.entity));
		        }]
		        ,['당겨 받기', function () {
					trade = {
			                cmd: 80,
			                extension: crmidentity.ext,
			                caller: '',
			                callee: itm.extension,
			                unconditional: '',
			                status: -1
			              };
			     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		        	// console.log("당겨받기: " + angular.toJson(item.entity));
		        }]
	            ,['돌려 주기', function () {
	    	        trade = {
	    	                cmd: 86,
	    	                extension: crmidentity.ext,
	    	                caller: currentCallInfo.caller,
	    	                callee: currentCallInfo.callee,
	    	                unconditional: itm.extension,
	    	                status: -1
	    	              };
			     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		        	console.log("돌려주기: " + angular.toJson(item.entity));
		        }]
/*	            ,['청취', function () {
		        	console.log("청취: " + angular.toJson(item.entity));
		        }]*/
		    ];
		};

		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
		};
		
		$scope.updateExtStatus = function(jsonData) {
			var extitem = angular.fromJson(jsonData);
			
			var item = $scope.gridOptions.data.find(function(element, index){
/*				
				if (crmidentity.ext != element.innertel) {
					switch (element.status) {
						case '미등록':
							extstatecount.unreg++;
							break;
						case '온라인':
							extstatecount.idle++;
							break;
						case '연결중':
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
*/
				return element.extension == extitem.extension;
			});
			
			console.log(">>>>>>>>>>>>>>>>> log : " + extitem.status);
			
			if (item) {
				switch (extitem.status) {
					case UC_CALL_STATE_UNREG:
						item.state = '미등록';
						break;
					case UC_CALL_STATE_IDLE:
						item.state = '온라인';
						break;
					case UC_CALL_STATE_INVITING:
						item.state = '연결중';
						break;
					case UC_CALL_STATE_RINGING:
						item.state = '전화울림';
						break;
					case UC_CALL_STATE_BUSY:
						item.state = '통화중';
						break;
					case WS_VALUE_EXTENSION_STATE_ONLINE:
						item.state = '온라인';
						break;
					case WS_VALUE_EXTENSION_STATE_LEFT:
						item.state = '자리비움';
						break;
					case WS_VALUE_EXTENSION_STATE_REDIRECTED:
						item.state = '착신전환';
						break;
					case WS_VALUE_EXTENSION_STATE_DND:
						item.state = '수신거부';
						break;
					default:
						switch (extitem.cmd) {
							case UC_SET_SRV_RES:
								// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> UC_SET_SRV_RES");
								switch (extitem.responseCode) {
									case UC_SRV_UNCONDITIONAL:
										item.state = '착신전환';
										break;
									case UC_SRV_DND:
										item.state = '수신거부';
										break;
								}
								break;
							case UC_CLEAR_SRV_RES:
								// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> UC_CLEAR_SRV_RES");
								switch (extitem.responseCode) {
									case UC_SRV_UNCONDITIONAL:
										item.state = '온라인';
										break;
									case UC_SRV_DND:
										item.state = '온라인';
										break;
								}
								break;
						}
						break;
				}
			}

			if (crmidentity.ext == extitem.extension) {
				SetMyState(extitem, extstatecount);
			}
		};
		
		$scope.gridOptions = {
				enableSorting: false,
				showGridFooter: false,
				rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell context-menu="grid.appScope.menuOptions(row)"></div>', 
				columnDefs: [
				 		      { displayName: '내선번호', field: 'extension', headerCellClass: 'white', cellClass: 'grid-cell' },
				 		      { displayName: '상태', field: 'state', headerCellClass:'white', cellClass: 'grid-cell' }
				 		      // { displayName: '기타', field: 'etc', headerCellClass:'white', cellClass: 'grid-cell-align', cellTemplate: '<button class="btn btn-primary btn-xs">청취</button>' }
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
		
		$http.get('/extstate/get/all')
			.success(function(data) {
				// console.log('/extstate/get/all/ : ' + angular.toJson(data));
				$scope.gridOptions.data = data;
			}
		);
	}]);
