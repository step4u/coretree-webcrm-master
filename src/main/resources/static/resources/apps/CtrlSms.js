	/* 통화내역 */
	angular.module('app')
	.controller('CtrlSms', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', function ($scope, $http, $log, $timeout, uiGridConstants) {
		
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
			    		      { displayName: '전화번호', field: 'custs_tel', headerCellClass:'white', cellClass: 'grid-cell', width: 230 },
			    		      { displayName: '날짜', field: 'regdate', headerCellClass: 'white', cellClass: 'grid-cell', width: 100
			    		    	  , type: 'date', cellFilter: 'date:\'yyyy-MM-dd\'' },
			    		      { displayName: '시각', field: 'regdate', headerCellClass: 'white', cellClass: 'grid-cell', width: 80
			    		    		  , type: 'date', cellFilter: 'date:\'HH:mm:ss\''},
			    		      { displayName: '내용', field: 'contents', headerCellClass: 'white', cellClass: 'grid-cell' },
			    		      { displayName: '상태', field: 'resultTxt', headerCellClass: 'white', cellClass: 'grid-cell', width: 80 },
			    		      { displayName: '기타', field: 'etc',
			    		    	  headerCellClass: 'white',
			    		    	  cellClass: 'grid-cell-align',
			    		    	  width: 100,
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.viewRow(row)">보기</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
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
			            // $log.log(row);
			            
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

//			            $log.log("$scope.gridOptions.selectedItems.length : " + $scope.gridOptions.selectedItems.length);
//			            $log.log("$scope.gridOptions.selectedItems : " + $scope.gridOptions.selectedItems);
			    	});
	
					gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
						// $log.log(rows);
						
						if (rows[0].isSelected) {
							for (var i = 0 ; i < rows.length ; i++) {
								$scope.gridOptions.selectedItems[i] = rows[i].entity;
							}
							// $scope.gridOptions.selectedItems = rows.entity;
						} else {
							$scope.gridOptions.selectedItems = [];
						}
						
//						$log.log("$scope.gridOptions.selectedItems.length : " + $scope.gridOptions.selectedItems.length);
//						$log.log("$scope.gridOptions.selectedItems : " + $scope.gridOptions.selectedItems);
//						$log.log("$scope.gridOptions.selectedItems : " + angular.toJson($scope.gridOptions.selectedItems));
					});
			    }
		};
		
		$scope.getPage = function(txt) {
			var condition = {
		    		idx: 0,
		    		sdate: $("#sdate").val(),
		    		edate: $("#edate").val(),
	    			txt: txt,
	    			curpage: paginationOptions.pageNumber,
	    			rowsperpage: paginationOptions.pageSize
    			};

			$http({
				method: "POST",
				url: "/sms/get/count",
				data: condition
			}).then(function(response){
				var data = response.data;
				
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
				$http({
					method: "POST",
					url: "/sms/get/all",
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
			
			$("#receivephones").val(item.custs_tel);
			$("#smstxt").val(item.contents);
			$("#btnSmsSend").css("display","none");
			$("#ModalSms").modal("show");
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			var condition = {
	    		idx: item.idx,
	    		sdate: '',
	    		edate: '',
    			txt: '',
    			curpage: 0,
    			rowsperpage: 0
			};
			 
			$http({
				method: "POST",
				url: "/sms/del",
				data: condition
			}).then(function(response){
				$scope.getPage();
				custbhv = bhv.none;
			}, function(response){
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteAllRow = function() {
			custbhv = bhv.del;

			$http({
				method: "POST",
				url: "/sms/del/all",
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