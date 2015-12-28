	// 고객리스트
	var paginationOptionsCustomer = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	
	angular.module('app')
	.controller('CtrlCustomer', ['$scope', '$http', 'i18nService', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, i18nService, $log, $timeout, uiGridConstants) {
		// i18nService.setCurrentLang('ko');
		/*
		$scope.$on('$routeChangeSuccess', function($event, current) {
			$(document).ready(function(){
				$('.side-nav').css('display', 'none');
			});
		});
		*/
		
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
			    		      { displayName: '고객이름', field: 'name', headerCellClass: 'white' , cellClass: 'grid-cell' },
			    		      { displayName: '회사', field: 'company', headerCellClass:'white', cellClass: 'grid-cell' },
			    		      { displayName: '전화번호', field: 'tel', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell' },
			    		      { displayName: '휴대전화', field: 'cellular', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell' },
			    		      { displayName: '기타',
			    		    	  field: 'etc',
			    		    	  enableFiltering: false,
			    		    	  cellClass: 'grid-cell-align',
			    		    	  headerCellClass: 'white',
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs">전화걸기</button> <button class="btn btn-primary btn-xs">수정</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
							  }
			    		    ],
			    groupHeaders: false,
			    enableRowSelection: true,
			    multiSelect: true,
				enableFiltering: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 2,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;
			    	
			    	$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
			            if (sortColumns.length == 0) {
			            	paginationOptionsCustomer.sort = null;
			            } else {
			            	paginationOptionsCustomer.sort = sortColumns[0].sort.direction;
			            }
			            getPage();
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptionsCustomer.pageNumber = newPage;
			    		paginationOptionsCustomer.pageSize = pageSize;
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
			switch(paginationOptionsCustomer.sort) {
				case uiGridConstants.ASC:
					url = '/resources/apps/app_data_customer.json';
					break;
				case uiGridConstants.DESC:
					url = '/resources/apps/app_data_customer.json';
					break;
				default:
					url = '/resources/apps/app_data_customer.json';
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
				var firstRow = (paginationOptionsCustomer.pageNumber - 1) * paginationOptionsCustomer.pageSize;
				$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptionsCustomer.pageSize);
			});
		}
		
		getPage();
		
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
			
			$scope.gridOptions.totalItems--;
			var firstRow = (paginationOptionsCustomer.pageNumber - 1) * paginationOptionsCustomer.pageSize;
			$scope.gridOptions.data = $scope.gridOptions.data.slice(firstRow, firstRow + paginationOptionsCustomer.pageSize);
			
			alert($scope.gridOptions.data.length);
			// getPage();
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);