	/* 통화내역 */
	angular.module('app')
	.controller('CtrlCall', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {

		var paginationOptions = {
			    pageNumber: 1,
			    pageSize: 20,
			    sort: null
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
				columnDefs: [
			    		      { displayName: '이름', field: 'cust_name', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '전화번호', field: 'cust_tel', headerCellClass:'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '날짜', field: 'regdate', headerCellClass: 'white', cellClass: 'grid-cell', width: 120
			    		    	, type: 'date', cellFilter: 'date:\'yyyy-MM-dd\'' },
			    		      { displayName: '시각', field: 'regdate', headerCellClass: 'white', cellClass: 'grid-cell', width: 100
			    		    	, type: 'date', cellFilter: 'date:\'HH:mm:ss\'' },
			    		      { displayName: '통화시간', field: 'diff', headerCellClass: 'white', cellClass: 'grid-cell', width: 100 },
			    		      { displayName: '상담내용', field: 'memo', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '상태', field: 'statustxt', headerCellClass: 'white', cellClass: 'grid-cell', width: 100 },
			    		      { displayName: '기타', field: 'etc',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 180,
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.callRow(row)">전화하기</button> <button class="btn btn-primary btn-xs" ng-click="grid.appScope.viewRow(row)">메모보기</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
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
			            var msg = 'row selected ' + row.isSelected;
			            $log.log(msg);
			    	});
	
					gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
						var msg = 'rows changed ' + rows.length;
						$log.log(msg);
						
						$scope.gridOptions.selectedItems = rows;
					});
			    }
		};
		
		$scope.getPage = function(val) {

			if (typeof(val) == 'undefined') {
		    	val = {
		    		idx: 0,
		    		sdate: '',
		    		edate: '',
	    			txt: '',
	    			curpage: paginationOptions.pageNumber,
	    			rowsperpage: paginationOptions.pageSize
	    		}
			} else {
		    	val.curpage = paginationOptions.pageNumber;
		    	val.rowsperpage = paginationOptions.pageSize;

		    	
			}

			$http({
				method: "POST",
				url: "/call/get/count",
				data: val
			}).then(function(response){
				var data = response.data;
				
				// console.log("calls count: " + data);
				
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
				val.curpage = paginationOptions.pageNumber;
				val.rowsperpage = paginationOptions.pageSize;
				
				// console.log("calls get all before: " + angular.toJson(val));
				
				$http({
					method: "POST",
					url: "/call/get/all",
					data: val
				}).then(function(response){
					// console.log("calls get all: " + angular.toJson(response.data));
					
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
	                cmd: 74,
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
			
			$http.get('/call/del/' + item.idx)
			.success(function(data) {
				$scope.getPage();
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