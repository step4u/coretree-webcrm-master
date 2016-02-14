	/* 통화내역 */
	angular.module('app')
	.controller('CtrlCounsellors', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {

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
			             	  { displayName: '아이디', field: 'username', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '이름', field: 'uname', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '직급', field: 'posi', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '내선번호', field: 'extension', headerCellClass:'white', cellClass: 'grid-cell', width: 150 },
			    		      { displayName: '휴대전화', field: 'cellular', headerCellClass: 'white', cellClass: 'grid-cell', width: 150 },
			    		      { displayName: '기타', field: 'etc',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 150,
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.modiRow(row)">수정</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
							  },
			    		      { displayName: '', field: 'etc2',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align'
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
			            $console.log(msg);
			    	});
	
					gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
						var msg = 'rows changed ' + rows.length;
						$console.log(msg);
						
						$scope.gridOptions.selectedItems = rows;
					});
			    }
		};
		
		$scope.getPage = function(txt) {
			var url;
			
			if (txt == ''){
				url = '/member/get/all/' + paginationOptions.pageNumber + '/' + paginationOptions.pageSize;
			} else {
				url = '/member/get/search/' + txt;
			}
			
			if (typeof(txt) == 'undefined'){
				url = '/member/get/all/' + paginationOptions.pageNumber + '/' + paginationOptions.pageSize;
			}
			
			var counturl = '/member/get/count';
			$http.get(counturl)
			.success(function(data) {
				
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				// console.log("count:" + data);
				
				$scope.gridOptions.totalItems = data;
				
				$http.get(url)
				.success(function(data) {
					// console.log("calls list:" + data);
					$scope.gridOptions.data = data;
				});
			});
		}
		
		$scope.getPage();
		
		$scope.viewRow = function(row) {
			var item = row.entity;
			
			$http.get('/member/get/' + item.idx)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			$http.get('/member/del/' + item.username)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
		};
		
		$scope.modiRow = function(row) {
			custbhv = bhv.modi;
			$("#modaluser .modal-title").html("사용자(상담원) 수정");
			
			var item = row.entity;

			$("#modaluser #username").val(item.username);
			$("#modaluser #username").attr("readonly", "readonly");
			$("#modaluser #btn_Chk1").css("display", "none");
			$("#modaluser #uname").val(item.uname);
			$("#modaluser #posi").val(item.posi);
			$("#modaluser #tel").val(item.tel);
			$("#modaluser #cellular").val(item.cellular);
			$("#modaluser #ext").val(item.extension);
			
			$("#modaluser").modal("show");
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  console.log(currentSelection);
		};
	}]);