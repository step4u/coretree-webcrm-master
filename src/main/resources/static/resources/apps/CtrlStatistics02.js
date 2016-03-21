	/* 통화내역 */
	angular.module('app')
	.controller('CtrlStatistics02', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
		
		$scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
		    if( col.filters[0].term ){
		    	return 'white header-filtered';
		    } else {
		    	return 'white';
		    }
		};
		
		$scope.gridOptions = {
			    useExternalPagination: false,
			    useExternalSorting: false,
				enableSorting: false,
				showGridFooter: false,
				columnDefs: [
			    		      { displayName: '일', field: 'timerange', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '전체통화', field: 'totalnum', headerCellClass:'white', cellClass: 'grid-cell' },
			    		      { displayName: '30초 이내', field: 'col30', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '1분 이내', field: 'col60', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '3분 이내', field: 'col180', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '5분 이내', field: 'col300', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '10분 이내', field: 'col600', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '30분 이내', field: 'col1800', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '60분 이내', field: 'col3600', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '60분 이상', field: 'colall', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '평균통화시간', field: 'colavg', headerCellClass: 'white', cellClass: 'grid-cell' }
			    		    ],
			    groupHeaders: false,
			    enableRowSelection: true,
			    multiSelect: false,
			    selectedItems: [],
				enableFiltering: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 0,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;

/*			    	
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
			    	});
	
					gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
						var msg = 'rows changed ' + rows.length;
						$scope.gridOptions.selectedItems = rows;
					});
*/
			    }
		};
		
		$scope.getPage = function() {
	    	var scondition = {
	    		sdate: $("#sdate").val(),
	    		edate: $("#edate").val(),
    			username: $("#txtsearch").val()
			}
			
			$http({
				method: "POST",
				url: "/statistics01/get/bydays",
				data: scondition
			}).then(function(response){
				$scope.gridOptions.data = response.data;
			}, function(){
				
			});
		}
		
		$scope.getPage();
		
		$scope.getCurrentSelection = function() {
			var currentSelection = $scope.gridApi.selection.getSelectedRows();
		};
	}]);