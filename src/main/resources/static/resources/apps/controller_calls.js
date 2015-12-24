	/* 통화내역 */
	var paginationOptionsCall = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	
	angular.module('app')
	.controller('CtrlCall', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {
		
		$log.log("CtrlCall entered");
		// i18nService.setCurrentLang('ko');
		
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
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" data-toggle="modal" data-target="#modalView">보기</button>'
							  }
			    		    ],
			    groupHeaders: false,
			    enableRowSelection: true,
			    multiSelect: true,
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
			            getPage();
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptionsCall.pageNumber = newPage;
			    		paginationOptionsCall.pageSize = pageSize;
			            getPage();
			    	});
			    	
			    	gridApi.selection.on.rowSelectionChanged($scope,function(row){
			            var msg = 'row selected ' + row.isSelected;
			            $log.log(msg);
			    	});
	
					gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
						var msg = 'rows changed ' + rows.length;
						$log.log(msg);
					});
			    }
		};
		
		var getPage = function() {
			var url;
			switch(paginationOptionsCall.sort) {
				case uiGridConstants.ASC:
					url = '/resources/apps/app_data_call.json';
					break;
				case uiGridConstants.DESC:
					url = '/resources/apps/app_data_call.json';
					break;
				default:
					url = '/resources/apps/app_data_call.json';
				break;
			}
			
			$http.get(url)
			.success(function(data) {
				// $scope.gridOptions.data = data;
				/*
				$timeout(function() {
			        if($scope.gridApi.selection.selectRow){
			          $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
			        }
				});
				*/
				
				$scope.gridOptions.totalItems = data.length;
				var firstRow = (paginationOptionsCall.pageNumber - 1) * paginationOptionsCall.pageSize;
				$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptionsCall.pageSize);
			});
		}
		
		getPage();
		
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
			
			$scope.gridOptions.totalItems--;
			var firstRow = (paginationOptionsCall.pageNumber - 1) * paginationOptionsCall.pageSize;
			$scope.gridOptions.data = $scope.gridOptions.data.slice(firstRow, firstRow + paginationOptionsCall.pageSize);
			
			alert($scope.gridOptions.data.length);
			// getPage();
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);