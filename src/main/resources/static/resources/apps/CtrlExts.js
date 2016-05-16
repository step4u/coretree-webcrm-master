	/* 통화내역 */
	angular.module('app')
	.controller('CtrlExts', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
		
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
			    		      { displayName: '내선번호', field: 'extension', headerCellClass:'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '사용자(상담원)', field: 'uname', headerCellClass: 'white', cellClass: 'grid-cell', width: 150 },
			    		      { displayName: '기타', field: 'etc',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 120,
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.modiRow(row)">수정</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
							  },
							  { displayName: '', field: 'blank', headerCellClass: 'white', cellClass: 'grid-cell' }
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
		    		sdate: '',
		    		edate: '',
	    			txt: txt,
	    			curpage: paginationOptions.pageNumber,
	    			rowsperpage: paginationOptions.pageSize
    			};

			$http({
				method: "POST",
				url: "/extension/get/count",
				data: condition
			}).then(function(response){
				var data = response.data;
				
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
				$http({
					method: "POST",
					url: "/extension/get/all",
					data: condition
				}).then(function(response){
					$scope.gridOptions.data = response.data;
				}, function(response){
					
				});
			}, function(){
				
			});
		}
		$scope.getPage();
		
		$scope.viewRow = function(row) {
			var item = row.entity;
			
			$http.get('/extension/get/' + item.idx)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			$http.get('/extension/del/' + item.extension)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteAllRow = function() {
			custbhv = bhv.del;

			$http({
				method: "POST",
				url: "/extension/del/all",
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
			$("#modalexts .modal-title").html("내선번호 수정");
			
			var item = row.entity;
			$("#modalexts #extension").val(item.extension);
			$("#modalexts #newext").val(item.extension);
			$("#modalexts").modal("show");
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);