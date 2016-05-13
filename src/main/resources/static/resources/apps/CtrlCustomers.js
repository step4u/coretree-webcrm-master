	// 고객리스트
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
		
		// 컨텍스트 메뉴
		$scope.menuOptions = function (item) {
			var itm = item.entity;
			
			var popupcontents = '';
			var selectedRows = $scope.gridApi.selection.getSelectedRows();
			
			// console.log("selectedRows.length : " + selectedRows.length);
			
			if (selectedRows.length > 1) {
				popupcontents = [
				 	            ['고객  [ ' + itm.uname + ' ]', function(){return;}]
					            ,null
						        ,['전화하기 : ' + itm.tel, function () {
									trade = {
						                cmd: UC_MAKE_CALL_REQ,
						                extension: crmidentity.ext,
						                caller: crmidentity.ext,
						                callee: itm.tel,
						                unconditional: '',
						                status: -1
						              };
							     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
						        }]
					            ,['전화하기 : ' + itm.cellular, function () {
									trade = {
						                cmd: UC_MAKE_CALL_REQ,
						                extension: crmidentity.ext,
						                caller: crmidentity.ext,
						                callee: itm.cellular,
						                unconditional: '',
						                status: -1
									};
							     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
						        }]
					            ,['SMS 한번에 보내기', function () {
					            	var receivephones = '';
					    			$.each(selectedRows, function (index, item){
					    				if (receivephones === '') 
					    					receivephones = item.cellular;
					    				else
					    					receivephones += ',' + item.cellular;
					    			});
					    			$("#receivephones").val(receivephones);
					            	$("#ModalSms").modal("show");
						        }]
						    ];
			} else {
				popupcontents = [
					 	            ['고객  [ ' + itm.uname + ' ]', function(){return;}]
						            ,null
							        ,['전화하기 : ' + itm.tel, function () {
										trade = {
								                cmd: UC_MAKE_CALL_REQ,
								                extension: crmidentity.ext,
								                caller: crmidentity.ext,
								                callee: itm.tel,
								                unconditional: '',
								                status: -1
								              };
								     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
							        }]
						            ,['전화하기 : ' + itm.cellular, function () {
										trade = {
							                cmd: UC_MAKE_CALL_REQ,
							                extension: crmidentity.ext,
							                caller: crmidentity.ext,
							                callee: itm.cellular,
							                unconditional: '',
							                status: -1
										};
								     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
							        }]
						            ,['SMS 보내기 : ' + itm.cellular, function () {
						            	$("#receivephones").val(itm.cellular);
						            	$("#ModalSms").modal("show");
							        }]
							    ];
			}
			
		    return popupcontents;
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
				rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell context-menu="grid.appScope.menuOptions(row)"></div>',
				columnDefs: [
			    		      { displayName: '고객이름', field: 'uname', headerCellClass: 'white' , cellClass: 'grid-cell', width: 150 },
			    		      { displayName: '회사', field: 'firm', headerCellClass:'white', cellClass: 'grid-cell' },
			    		      { displayName: '직책', field: 'posi', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell', width: 150 },
			    		      { displayName: '전화번호', field: 'tel', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '휴대전화', field: 'cellular', headerCellClass: $scope.highlightFilteredHeader, cellClass: 'grid-cell', width: 120 },
			    		      { displayName: '기타',
			    		    	  field: 'etc',
			    		    	  enableFiltering: false,
			    		    	  cellClass: 'grid-cell-align',
			    		    	  headerCellClass: 'white',
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.modiRow(row)">수정</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>',
			    		    	  width: 100
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
	    		sdate: $("#sdate").val(),
	    		edate: $("#edate").val(),
	    		group0: $stateParams.maingroup,
	    		group1: $stateParams.subgroup,
    			txt: txt,
    			curpage: paginationOptions.pageNumber,
    			rowsperpage: paginationOptions.pageSize
			};

			$http({
				method: "POST",
				url: "/customer/get/count",
				data: condition
			}).then(function(response){
				var data = response.data;
				
				alert(data);
				
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
				$http({
					method: "POST",
					url: "/customer/get/all",
					data: condition
				}).then(function(response){
					$scope.gridOptions.data = response.data;
				}, function(response){
					
				});
			}, function(){
				
			});
		}
		
		$scope.getPage();
		
		$scope.bindSubGroup = function(){
			$http.get('/customer/get/group/' + $stateParams.maingroup)
			.success(function(response) {
				$scope.options = response;
				var item = response.find(function(element, index){
					return element.subgroup == $stateParams.subgroup;
				});
				
				if (typeof(item) == 'undefined') {
					$scope.modeloption = "0";
				} else {
					$scope.modeloption = item.subgroup;
				}
			});
		};
		$scope.bindSubGroup();
		
		$scope.makeCall = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			trade = {
                cmd: UC_MAKE_CALL_REQ,
                extension: crmidentity.ext,
                caller: crmidentity.ext,
                callee: item.cellular,
                unconditional: '',
                status: -1
			};
			
			stompClient.send("/app/traders", {}, JSON.stringify(trade));
		};
		
		$scope.deleteRow = function(row) {
			custbhv = bhv.del;
			var item = row.entity;
			
			$http.get('/customer/del/' + item.idx)
			.then(function(response) {
				$scope.getPage();
				custbhv = bhv.none;
			}, function(response){
				console.log("/customer/del/ : " + angular.toJson(response));
				custbhv = bhv.none;
			});
		};
		
		$scope.deleteAllRow = function() {
			custbhv = bhv.del;

			$http({
				method: "POST",
				url: "/customer/del/all",
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
			$("#addCustomer .modal-title").html("고객 수정");
			
			var item = row.entity;

			$("#addCustomer #idx").val(item.idx);
			$("#addCustomer #maingroup").val(item.maingroup);

			$("#addCustomer #uname").val(item.uname);
			$("#addCustomer #company").val(item.firm);
			$("#addCustomer #posi").val(item.posi);
			$("#addCustomer #tel").val(item.tel);
			$("#addCustomer #cellular").val(item.cellular);
			$("#addCustomer #extension").val(item.extension);
			$("#addCustomer #email").val(item.email);
			
			$("#addCustomer #btnMemoTake").css("display", "none");
			$("#addCustomer #btnMemoRedirect").css("display", "none");
			$("#addCustomer #btnMemoHold").css("display", "none");
			$("#addCustomer #btnMemoHangup").css("display", "none");
			
			$("#addCustomer").modal({backdrop: false});
			
			SetSubgroups(item.maingroup, item.subgroup);
			
			// console.log(item.idx + '//' + item.maingroup + '//' + item.subgroup);
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  // $log.log(currentSelection);
		};
	}]);