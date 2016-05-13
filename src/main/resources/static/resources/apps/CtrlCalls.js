	/* 통화내역 */
	angular.module('app')
	.controller('CtrlCall', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {

		var paginationOptions = {
			    pageNumber: 1,
			    pageSize: 20,
			    sort: null
		};
		
		// 컨텍스트 메뉴
		$scope.menuOptions = function (item) {
			var itm = item.entity;
		    return [
	            ['고객  [ ' + itm.cust_name + ' ]', function(){return;}]
	            ,null
		        ,['전화하기 : ' + itm.cust_tel, function () {
					trade = {
			                cmd: UC_MAKE_CALL_REQ,
			                extension: crmidentity.ext,
			                caller: crmidentity.ext,
			                callee: itm.cust_tel,
			                unconditional: '',
			                status: -1
			              };
			     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		        	console.log("전화하기: " + angular.toJson(item.entity));
		        }]
		    ];
		};
		
		$scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
		    if( col.filters[0].term ){
		      return 'white header-filtered';
		    } else {
		      return 'white';
		    }
		  };
		
		$scope.gridOptions = {
			    paginationPageSizes: [20, 50, 100],
			    paginationPageSize: 20,
			    useExternalPagination: true,
			    useExternalSorting: true,
				enableSorting: false,
				showGridFooter: false,
				rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell context-menu="grid.appScope.menuOptions(row)"></div>',
				columnDefs: [
			    		      { displayName: '이름', field: 'cust_name', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '전화번호', field: 'cust_tel', headerCellClass:'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '날짜', field: 'regdate', headerCellClass: 'white', cellClass: 'grid-cell', width: 100
			    		    	, type: 'date', cellFilter: 'date:\'yyyy-MM-dd\'' },
			    		      { displayName: '시각', field: 'regdate', headerCellClass: 'white', cellClass: 'grid-cell', width: 80
			    		    	, type: 'date', cellFilter: 'date:\'HH:mm:ss\'' },
			    		      { displayName: '통화시간', field: 'diff', headerCellClass: 'white', cellClass: 'grid-cell', width: 80 },
			    		      { displayName: '상담내용', field: 'memo', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '상태', field: 'statustxt', headerCellClass: 'white', cellClass: 'grid-cell', width: 80 },
			    		      { displayName: '기타', field: 'etc',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 120,
			    		    	  // cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.callRow(row)">전화하기</button> <button class="btn btn-primary btn-xs" ng-click="grid.appScope.viewRow(row)">메모보기</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.viewRow(row)">메모보기</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
							  }
			    		    ],
			    groupHeaders: false,
			    enableRowSelection: true,
			    multiSelect: true,
			    selectedItems: [],
				enableFiltering: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 0,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;
			    	
			    	$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
			            if (sortColumns.length == 0) {
			            	paginationOptions.sort = null;
			            } else {
			            	paginationOptions.sort = sortColumns[0].sort.direction;
			            }
			            $scope.getPage();
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptions.pageNumber = newPage;
			    		paginationOptions.pageSize = pageSize;
			    		$scope.getPage();
			    	});
			    	
			    	gridApi.selection.on.rowSelectionChanged($scope,function(row){
			    		if (row.isSelected) {
			    			if ($scope.gridOptions.selectedItems.length > 0) {
			    				var idx = $scope.gridOptions.selectedItems.indexOf(row);
			    				
			    				if (idx == -1) {
			    					$scope.gridOptions.selectedItems.splice($scope.gridOptions.selectedItems.length-1, 0, row.entity);
			    				}
			    			} else {
			    				$scope.gridOptions.selectedItems[0] = row.entity;
			    			}
			    		} else {
			    			if ($scope.gridOptions.selectedItems.length > 0) {
				    			var val = $scope.gridOptions.selectedItems.filter(function(element, index){
				    				return element.idx === row.idx;
				    	    	});
			    				var idx = $scope.gridOptions.selectedItems.indexOf(val);
			    				$scope.gridOptions.selectedItems.splice(idx, 1);
			    			}
			    		}
			    	});
	
					gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
						if (rows[0].isSelected) {
							for (var i = 0 ; i < rows.length ; i++) {
								$scope.gridOptions.selectedItems[i] = rows[i].entity;
							}
						} else {
							$scope.gridOptions.selectedItems = [];
						}
					});
			    }
		};
		
		$scope.getPage = function(txt) {
			var condition = {
		    		idx: 0,
		    		sdate: $("#sdate").val(),
		    		edate: $("#edate").val(),
	    			txt: txt,
	    			curpage: paginationOptions.pageNumber,
	    			rowsperpage: paginationOptions.pageSize
    			};

			$http({
				method: "POST",
				url: "/call/get/count",
				data: condition
			}).then(function(response){
				var data = response.data;
				
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
				$http({
					method: "POST",
					url: "/call/get/all",
					data: condition
				}).then(function(response){
					$scope.gridOptions.data = response.data;
				}, function(response){
					
				});
			}, function(){
				
			});
		}
		
		$scope.getPage();
		
		$scope.callRow = function(row) {
			var item = row.entity;

			trade = {
                cmd: UC_MAKE_CALL_REQ,
                extension: crmidentity.ext,
                caller: crmidentity.ext,
                callee: item.cust_tel,
                unconditional: '',
                status: -1
			};
			
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		};
		
		$scope.viewRow = function(row) {
			var item = row.entity;
			
			$("#call_idx").val(item.idx);
			$("#memotxt").val(item.memo);
			$("#Memo").modal({backdrop: false});
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			var condition = {
	    		idx: item.idx,
	    		sdate: '',
	    		edate: '',
    			txt: '',
    			curpage: 0,
    			rowsperpage: 0
			};
			
			$http({
				method: "POST",
				url: "/call/del",
				data: condition
			}).then(function(response){
				$scope.getPage();
				custbhv = bhv.none;
			}, function(response){
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteAllRow = function() {
			custbhv = bhv.del;

			$http({
				method: "POST",
				url: "/call/del/all",
				data: $scope.gridOptions.selectedItems
			}).then(function(response){
				$scope.getPage();
				custbhv = bhv.none;
			}, function(response){
				custbhv = bhv.none;
			});
		};
		
		$scope.modiRow = function(row) {
			custbhv = bhv.modi;
			$("#Modal .modal-title").html("고객 정보");
			
			var item = row.entity;

			$("#idx").val(item.idx);
			$("#depthorder").val('string:' + item.depthorder);
			$("#uname").val(item.uname);
			$("#firm").val(item.company);
			$("#posi").val(item.posi);
			$("#tel").val(item.tel);
			$("#cellular").val(item.cellular);
			$("#extension").val(item.extension);
			$("#email").val(item.email);
			
			$("#addCustomer").modal("show");
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);