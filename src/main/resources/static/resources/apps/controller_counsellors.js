	/* 통화내역 */
	angular.module('app')
	.controller('CtrlCall', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {
		console.log("calls entered");
		
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
				enableSorting: true,
				showGridFooter: false,
				columnDefs: [
			    		      { displayName: '이름', field: 'name', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '전화번호', field: 'tel', headerCellClass:'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '날짜', field: 'date', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '시각', field: 'time', headerCellClass: 'white', cellClass: 'grid-cell', width: 100 },
			    		      { displayName: '통화시간', field: 'duration', headerCellClass: 'white', cellClass: 'grid-cell', width: 100 },
			    		      { displayName: '상담내용', field: 'memo', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '기타', field: 'etc',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 120,
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.viewRow(row)">보기</button>'
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
			            	paginationOptionsCall.sort = null;
			            } else {
			            	paginationOptionsCall.sort = sortColumns[0].sort.direction;
			            }
			            $scope.getPage();
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptionsCall.pageNumber = newPage;
			    		paginationOptionsCall.pageSize = pageSize;
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
		
		$scope.getPage = function(txt) {
			console.log("calls getPage");
			
			var url;
			
			if (txt == ''){
				url = '/call/get/all/' + paginationOptions.pageNumber + '/' + paginationOptions.pageSize;
			} else {
				url = '/call/get/search/' + txt;
			}
			
			if (typeof(txt) == 'undefined'){
				url = '/call/get/all/' + paginationOptions.pageNumber + '/' + paginationOptions.pageSize;
			}
			
			var counturl = '/call/get/count';
			$http.get(counturl)
			.success(function(data) {
				
				console.log("calls count:" + data);
				console.log("calls paginationOptions.pageNumber:" + paginationOptions.pageNumber + ", paginationOptions.pageSize: " + paginationOptions.pageSize);
				
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
				$http.get(url)
				.success(function(data) {
					console.log("calls list:" + data);
					$scope.gridOptions.data = data;
				});
			});
		}
		
		$scope.getPage();
		
		$scope.viewRow = function(row) {
			var item = row.entity;
			
			$http.get('/call/get/' + item.idx)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			$http.get('/call/del/' + item.idx)
			.success(function(data) {
				$scope.getPage();
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
			$("#company").val(item.company);
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