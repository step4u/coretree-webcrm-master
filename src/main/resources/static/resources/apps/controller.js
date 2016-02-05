(function () {
    'use strict';

//    angular
//        .module('app')
//        .controller('controller', controller);
//    
//    controller.$inject = ['$scope'];
//    
//    function controller($scope) {
//        $scope.title = 'TechDays 2014 개발자 컨퍼런스';
//
//        activate();
//
//        function activate() { }
//    }

    var app = angular.module('app');

	/*  상태 */
	app.controller('CtrlCallStatus', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
		};
		
		$scope.gridOptions = {
				enableSorting: false,
				showGridFooter: false,
				showHeader: false,
				columnDefs: [
				 		      { field: 'title', cellClass: 'grid-cell' },
				 		      { field: 'count', cellClass: 'grid-cell' }
				 		    ],
			    groupHeaders: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 0,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;
			    	$scope.gridApi.core.on.sortChanged( $scope, function( grid, sort ) {
			    		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
			    	})
			    }
		};
	
		$http.get('/resources/apps/app_data_call_status.json')
			.success(function(data) {
				$scope.gridOptions.data = data;
			}
		);
	}]);
    
	/* 내선 상태 */
	app.controller('CtrlTelStatus', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
		};
		
		$scope.gridOptions = {
				enableSorting: false,
				showGridFooter: false,
				columnDefs: [
				 		      { displayName: '내선번호', field: 'innertel', headerCellClass: 'white', cellClass: 'grid-cell' },
				 		      { displayName: '상태', field: 'status', headerCellClass:'white', cellClass: 'grid-cell' },
				 		      { displayName: '기타', field: 'etc', headerCellClass:'white', cellClass: 'grid-cell-align',
				 		    	  cellTemplate: '<button class="btn btn-primary btn-xs">청취</button>' }
				 		    ],
			    groupHeaders: false,
		        enableColResize: false,
		        enableHorizontalScrollbar: 0,
		        enableVerticalScrollbar: 2,
			    onRegisterApi: function( gridApi ) {
			    	$scope.gridApi = gridApi;
			    	$scope.gridApi.core.on.sortChanged( $scope, function( grid, sort ) {
			    		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
			    	})
			    }
		};
	
		$http.get('/resources/apps/app_data_tel_status.json')
			.success(function(data) {
				$scope.gridOptions.data = data;
			}
		);
	}]);
	
	// 고객리스트
	var paginationOptionsCustomer = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	app.controller('CtrlCustomer', ['$scope', '$http', 'i18nService', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, i18nService, $log, $timeout, uiGridConstants) {
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
	
	/* 통화내역 */
	var paginationOptionsCall = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	app.controller('CtrlCall', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {
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
	
	/* SMS내역 */
	var paginationOptionsSms = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	app.controller('CtrlSms', ['$scope', '$http', 'i18nService', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, i18nService, $log, $timeout, uiGridConstants) {
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
			    		      { displayName: '회사', field: 'tel', headerCellClass:'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '전화번호', field: 'date', headerCellClass: 'white', cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '시각', field: 'time', headerCellClass: 'white', cellClass: 'grid-cell', width: 100 },
			    		      { displayName: '메시지', field: 'memo', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '기타', field: 'etc',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 120,
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" data-toggle="modal" data-target="#modalView">보기</button>  <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
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
			            	paginationOptionsSms.sort = null;
			            } else {
			            	paginationOptionsSms.sort = sortColumns[0].sort.direction;
			            }
			            getPage();
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptionsSms.pageNumber = newPage;
			    		paginationOptionsSms.pageSize = pageSize;
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
			switch(paginationOptionsSms.sort) {
				case uiGridConstants.ASC:
					url = '/resources/apps/app_data_sms.json';
					break;
				case uiGridConstants.DESC:
					url = '/resources/apps/app_data_sms.json';
					break;
				default:
					url = '/resources/apps/app_data_sms.json';
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
				var firstRow = (paginationOptionsSms.pageNumber - 1) * paginationOptionsSms.pageSize;
				$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptionsSms.pageSize);
			});
		}
		
		getPage();
		
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
			
			$scope.gridOptions.totalItems--;
			var firstRow = (paginationOptionsSms.pageNumber - 1) * paginationOptionsSms.pageSize;
			$scope.gridOptions.data = $scope.gridOptions.data.slice(firstRow, firstRow + paginationOptionsSms.pageSize);
			
			alert($scope.gridOptions.data.length);
			// getPage();
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);
	
	/* 녹취내역 */
	var paginationOptionsRecord = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	app.controller('CtrlRecord', ['$scope', '$http', 'i18nService', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, i18nService, $log, $timeout, uiGridConstants) {
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
			    		      { displayName: '고객이름', field: 'name', headerCellClass: 'white' , cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '회사', field: 'company', headerCellClass:'white', cellClass: 'grid-cell', width: 150 },
			    		      { displayName: '전화번호', field: 'tel', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '날짜', field: 'date', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '시각', field: 'time', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell', width: 100 },
			    		      { displayName: '통화시간', field: 'during', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '파일명', field: 'fn', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell' },
			    		      { displayName: '기타',
			    		    	  field: 'etc',
			    		    	  enableFiltering: false,
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 180,
			    		    	  headerCellClass: 'white',
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs">녹취듣기</button> <button class="btn btn-primary btn-xs">다운로드</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
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
			            	paginationOptionsRecord.sort = null;
			            } else {
			            	paginationOptionsRecord.sort = sortColumns[0].sort.direction;
			            }
			            getPage();
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptionsRecord.pageNumber = newPage;
			    		paginationOptionsRecord.pageSize = pageSize;
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
			switch(paginationOptionsRecord.sort) {
				case uiGridConstants.ASC:
					url = '/resources/apps/app_data_record.json';
					break;
				case uiGridConstants.DESC:
					url = '/resources/apps/app_data_record.json';
					break;
				default:
					url = '/resources/apps/app_data_record.json';
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
				var firstRow = (paginationOptionsRecord.pageNumber - 1) * paginationOptionsRecord.pageSize;
				$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptionsRecord.pageSize);
			});
		}
		
		getPage();
		
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
			
			$scope.gridOptions.totalItems--;
			var firstRow = (paginationOptionsRecord.pageNumber - 1) * paginationOptionsRecord.pageSize;
			$scope.gridOptions.data = $scope.gridOptions.data.slice(firstRow, firstRow + paginationOptionsRecord.pageSize);
			
			alert($scope.gridOptions.data.length);
			// getPage();
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);
	
	/* 상담원 통화내역 */
	var paginationOptionsCounsellor = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	app.controller('CtrlCounsellor', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {
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
			    		      { displayName: '상담원명(내선)', field: 'teller', headerCellClass: 'white' , cellClass: 'grid-cell' },
			    		      { displayName: '통화시간', field: 'during', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '총통화수', field: 'total', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '성공건수', field: 'success', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '부재중건수', field: 'absent', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '실패건수', field: 'fail', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '평균통화시간', field: 'average', headerCellClass: 'white', cellClass: 'grid-cell' }
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
			            	paginationOptionsCounsellor.sort = null;
			            } else {
			            	paginationOptionsCounsellor.sort = sortColumns[0].sort.direction;
			            }
			            $scope.getPage($scope.url);
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptionsCounsellor.pageNumber = newPage;
			    		paginationOptionsCounsellor.pageSize = pageSize;
			    		$log.log('paginationChanged : ' + $scope.url);
			    		$scope.getPage($scope.url);
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
		
		$scope.getPage = function(url) {
			$log.log('getPage txtsearch value : ' + $('#txtsearch').val());
			
			$scope.url = url;
			
			var url;
			switch(paginationOptionsCounsellor.sort) {
				case uiGridConstants.ASC:
					url = '/resources/apps/' + url;
					break;
				case uiGridConstants.DESC:
					url = '/resources/apps/' + url;
					break;
				default:
					url = '/resources/apps/' + url;
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
				var firstRow = (paginationOptionsCounsellor.pageNumber - 1) * paginationOptionsCounsellor.pageSize;
				$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptionsCounsellor.pageSize);
			});
		}
		
		$scope.getPage('app_data_counsellor.json');
		
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
			
			$scope.gridOptions.totalItems--;
			var firstRow = (paginationOptionsCounsellor.pageNumber - 1) * paginationOptionsCounsellor.pageSize;
			$scope.gridOptions.data = $scope.gridOptions.data.slice(firstRow, firstRow + paginationOptionsCounsellor.pageSize);
			
			alert($scope.gridOptions.data.length);
			// getPage();
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);
	

	/* 상담원관리 */
	var paginationOptionsCounsellors = {
		    pageNumber: 1,
		    pageSize: 20,
		    sort: null
		  };
	app.controller('CtrlCounsellors', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {
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
			    		      { displayName: '상담원명(내선)', field: 'teller', headerCellClass: 'white' , cellClass: 'grid-cell' },
			    		      { displayName: '통화시간', field: 'during', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '총통화수', field: 'total', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '성공건수', field: 'success', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '부재중건수', field: 'absent', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '실패건수', field: 'fail', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '평균통화시간', field: 'average', headerCellClass: 'white', cellClass: 'grid-cell' }
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
			            	paginationOptionsCounsellors.sort = null;
			            } else {
			            	paginationOptionsCounsellors.sort = sortColumns[0].sort.direction;
			            }
			            $scope.getPage($scope.url);
			    	});
			    	
			    	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    		paginationOptionsCounsellors.pageNumber = newPage;
			    		paginationOptionsCounsellors.pageSize = pageSize;
			    		$log.log('paginationChanged : ' + $scope.url);
			    		$scope.getPage($scope.url);
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
		
		$scope.getPage = function(url) {
			$log.log('getPage txtsearch value : ' + $('#txtsearch').val());
			
			$scope.url = url;
			
			var url;
			switch(paginationOptionsCounsellors.sort) {
				case uiGridConstants.ASC:
					url = '/resources/apps/' + url;
					break;
				case uiGridConstants.DESC:
					url = '/resources/apps/' + url;
					break;
				default:
					url = '/resources/apps/' + url;
				break;
			}
			
			$http.get(url)
			.success(function(data) {
				$scope.gridOptions.totalItems = data.length;
				var firstRow = (paginationOptionsCounsellors.pageNumber - 1) * paginationOptionsCounsellors.pageSize;
				$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptionsCounsellor.pageSize);
			});
		}
		
		$scope.getPage('app_data_counsellor.json');
		
		$scope.deleteRow = function(row) {
			var index = $scope.gridOptions.data.indexOf(row.entity);
			$scope.gridOptions.data.splice(index, 1);
			
			$scope.gridOptions.totalItems--;
			var firstRow = (paginationOptionsCounsellors.pageNumber - 1) * paginationOptionsCounsellors.pageSize;
			$scope.gridOptions.data = $scope.gridOptions.data.slice(firstRow, firstRow + paginationOptionsCounsellors.pageSize);
			
			alert($scope.gridOptions.data.length);
			// getPage();
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);
	

	/* Base Controller */
	app.controller('BaseController', ['$scope', '$http', '$log', 'uiGridConstants', function ($scope, $http, $log, uiGridConstants) {
//		$scope.css = "local.css";
//		$scope.$on('$routeChangeSuccess', function($event, current) {
//			if (!typeof(current.css))
//			{
//				$scope.css = "local.css";
//			}
//			else
//			{
//				$scope.css = current.css;
//			}
//
//			$log.log('BaseController css : ' + current.css);
//		});
	}]);

})();
