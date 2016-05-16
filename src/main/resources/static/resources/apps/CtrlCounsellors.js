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
					url: "/counsellor/get/count",
					data: condition
				}).then(function(response){
					var data = response.data;
					
					if ($scope.gridOptions.totalItems != data) {
						paginationOptions.pageNumber = 1;
					}
					
					$scope.gridOptions.totalItems = data;
					
					$http({
						method: "POST",
						url: "/counsellor/get/all",
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
			
			$http.get('/counsellor/get/' + item.idx)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			$http.get('/counsellor/del/' + item.username)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteAllRow = function() {
			custbhv = bhv.del;

			$http({
				method: "POST",
				url: "/counsellor/del/all",
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