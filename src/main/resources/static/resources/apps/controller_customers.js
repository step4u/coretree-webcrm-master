/*	// 고객리스트
	var paginationOptionsCustomer = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };*/
	
	angular.module('app')
	.controller('CtrlCustomer', ['$scope', '$http', 'i18nService', '$log', '$timeout', 'uiGridConstants', '$stateParams'
	                             , function ($scope, $http, i18nService, $log, $timeout, uiGridConstants, $stateParams) {
		// i18nService.setCurrentLang('ko');
		/*
		$scope.$on('$routeChangeSuccess', function($event, current) {
			$(document).ready(function(){
				$('.side-nav').css('display', 'none');
			});
		});
		*/
		
		// 고객리스트
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
			    		      { displayName: '고객이름', field: 'uname', headerCellClass: 'white' , cellClass: 'grid-cell' },
			    		      { displayName: '회사', field: 'firm', headerCellClass:'white', cellClass: 'grid-cell' },
			    		      { displayName: '전화번호', field: 'tel', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell' },
			    		      { displayName: '휴대전화', field: 'cellular', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell' },
			    		      { displayName: '기타',
			    		    	  field: 'etc',
			    		    	  enableFiltering: false,
			    		    	  cellClass: 'grid-cell-align',
			    		    	  headerCellClass: 'white',
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.makeCall(row)">전화걸기</button> <button class="btn btn-primary btn-xs" ng-click="grid.appScope.modiRow(row)">수정</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
							  }
			    		    ],
			    groupHeaders: false,
			    enableRowSelection: true,
			    multiSelect: true,
			    selectedItems: [],
				enableFiltering: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 1,
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
/*						
						$.each($scope.gridOptions.selectedItems, function (index, value){
							console.log( index + ": " + value );
						});
*/
						// $scope.selectedItems = rows;
					});
			    }
		};
		
		group = $stateParams.param;
		
		$scope.getPage = function(searchtxt) {
			//console.log("getPage searchtxt: " + searchtxt);
			var url;
			
			if (searchtxt == ''){
				url = '/customer/get/page/' + $stateParams.param + '/' + paginationOptions.pageNumber + '/' + paginationOptions.pageSize;
			} else {
				url = '/customer/get/search/' + $stateParams.param + '/' + searchtxt;
			}
			
			if (typeof(searchtxt) == 'undefined'){
				url = '/customer/get/page/' + $stateParams.param + '/' + paginationOptions.pageNumber + '/' + paginationOptions.pageSize;
			}

			var counturl = '/customer/get/count/' + $stateParams.param;
			// console.log("getPage counturl: " + counturl);
			// console.log("getPage url: " + url);
			$http.get(counturl)
			.success(function(data) {
				// console.log("getPage totalItems: " + data);
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
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
					
					//var firstRow = (paginationOptionsCustomer.pageNumber - 1) * paginationOptionsCustomer.pageSize;
					//$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptionsCustomer.pageSize);
					$scope.gridOptions.data = data;
				});
			});
		}
		
		$scope.getPage();
		
		$scope.makeCall = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			$http.get('/customer/del/' + item.idx)
			.success(function(data) {
				$scope.getPage();
				custbhv = bhv.none;
			});
/*			
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
			
			$scope.gridOptions.totalItems--;
			var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
			$scope.gridOptions.data = $scope.gridOptions.data.slice(firstRow, firstRow + paginationOptions.pageSize);
*/
		};
		
		$scope.modiRow = function(row) {
			custbhv = bhv.modi;
			$("#addCustomer .modal-title").html("고객 수정");
			
			var item = row.entity;
			//console.log("modiRow row.entity:" + item);
			//console.log("modiRow row.entity:" + angular.toJson(item));

			$("#idx").val(item.idx);
			$("#depthorder").val('string:' + item.depthorder);
			$("#uname").val(item.uname);
			$("#company").val(item.firm);
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