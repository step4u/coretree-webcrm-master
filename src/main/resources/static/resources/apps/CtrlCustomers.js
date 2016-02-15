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
		
		// 컨텍스트 메뉴
		$scope.menuOptions = function (item) {
			var itm = item.entity;
		    return [
	            ['고객  [ ' + itm.uname + ' ]', function(){return;}]
	            ,null
		        ,['전화하기 : ' + itm.tel, function () {
					trade = {
			                cmd: 74,
			                extension: crmidentity.ext,
			                caller: crmidentity.ext,
			                callee: itm.tel,
			                unconditional: '',
			                status: -1
			              };
			     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		        	console.log("전화하기: " + angular.toJson(item.entity));
		        }]
	            ,['전화하기 : ' + itm.cellular, function () {
					trade = {
			                cmd: 74,
			                extension: crmidentity.ext,
			                caller: crmidentity.ext,
			                callee: itm.cellular,
			                unconditional: '',
			                status: -1
			              };
			     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		        	console.log("전화하기: " + angular.toJson(item.entity));
		        }]
		    ];
		};
		
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
				rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell context-menu="grid.appScope.menuOptions(row)"></div>',
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
			    		    	  cellTemplate: '<button class="btn btn-primary btn-xs" ng-click="grid.appScope.modiRow(row)">수정</button> <button class="btn btn-warning btn-xs" ng-click="grid.appScope.deleteRow(row)">삭제</button>'
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
		
		$scope.getPage = function(searchtxt) {
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

			$http.get(counturl)
			.success(function(data) {
				if ($scope.gridOptions.totalItems != data) {
					paginationOptions.pageNumber = 1;
				}
				
				$scope.gridOptions.totalItems = data;
				
				$http.get(url)
				.success(function(data) {
					$scope.gridOptions.data = data;
				});
			});
		}
		$scope.getPage();
		
		$scope.bindSubGroup = function(){
			//console.log("$stateParams.param.substring(0,1) : " + $stateParams.param.substring(0,1));
			$http.get('/customer/get/group/' + $stateParams.param.substring(0,1))
			.success(function(response) {
				$scope.options = response;
				var item = response.find(function(element, index){
					//console.log("$stateParams.param.substring(1,2) : " + $stateParams.param.substring(1,2));
					//console.log("element.subgroup : " + element.subgroup);
					return element.subgroup == $stateParams.param.substring(1,2);
				});
				
				// console.log("item : " + angular.toJson(item));
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
	                cmd: 74,
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
			
			$("#addCustomer").modal({backdrop: false});
			
			SetSubgroups(item.maingroup, item.subgroup);
			
			console.log(item.idx + '//' + item.maingroup + '//' + item.subgroup);
		};
		
		$scope.getCurrentSelection = function() {
			  var currentSelection = $scope.gridApi.selection.getSelectedRows();
			  $log.log(currentSelection);
		};
	}]);