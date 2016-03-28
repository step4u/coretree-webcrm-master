	
	function SetCallState(data) {
		// Right top current state
		var scope0 = angular.element($("#ctrlcallstatus")).scope();
    	if (data.cmd == UC_REPORT_WAITING_COUNT) {
    		scope0.gridOptions.data[5].count = data.responseCode;
    		return;
    	}
	
		var scope1 = angular.element($("#ctrlextstatus")).scope();
		scope1.$apply(function () {
	    	var values = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '온라인';
	    	});
	    	scope0.gridOptions.data[0].count = values.length;
	    	
	    	values = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '연결중';
	    	});
	    	scope0.gridOptions.data[1].count = values.length;
	    	
	    	values = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '통화중';
	    	});
	    	scope0.gridOptions.data[2].count = values.length;
	    	
	    	values = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '자리비움';
	    	});
	    	scope0.gridOptions.data[3].count = values.length;
	    	
	    	values = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '착신전환';
	    	});
	    	scope0.gridOptions.data[4].count = values.length;
	    });
	}
	
	function TreatMySelf(item) {
		console.log("TreatMySelf: " + item.cmd + " // " + item.direct + " // " + item.status);
		
		switch (item.cmd) {
			case UC_MAKE_CALL_RES:
				if (item.status == UC_STATUS_SUCCESS) {
					if ($("#btnCall").hasClass("btn-primary")) {
						$("#btnCall").removeClass("btn-primary");
						$("#btnCall").addClass("btn-danger");
						$("#btnCall").html("종료");
					}
				}
				break;
			case UC_DROP_CALL_RES:
				if (item.status == UC_STATUS_SUCCESS) {
					if ($("#btnCall").hasClass("btn-danger")) {
						$("#btnCall").removeClass("btn-danger");
						$("#btnCall").addClass("btn-primary");
						$("#btnCall").html("통화");
					}
				}
				break;
			case UC_PICKUP_CALL_REQ:
				break;
			case UC_HOLD_CALL_RES:
				if (item.status == UC_STATUS_SUCCESS){
					$("#btnHold").html("활성");
					$("#btnMemoHold").html("활성");
					if (!$("#btnMemoRedirect").hasClass("disabled")) $("#btnMemoRedirect").addClass("disabled");
				}
				break;
			case UC_ACTIVE_CALL_RES:
				if (item.status == UC_STATUS_SUCCESS){
					$("#btnHold").html("보류");
					$("#btnMemoHold").html("보류");
					if ($("#btnMemoRedirect").hasClass("disabled")) $("#btnMemoRedirect").removeClass("disabled");
				}
				break;
			case UC_SMS_SEND_RES:
/*				
			    var smsinfo = {
					idx: -1,
					custs_idx: '',
					custs_tel: $("#receivephones").val(),
					contents: $("#smstxt").val(),
					result: item.status,
					regdate: '',
					sdate: '',
					edate: '',
					curpage: '',
					rowsperpage: ''
			    };

			    //$("#ModalSms").modal("hide");
			    
			    $.ajax({
			    	type: "POST",
			    	url: "/sms/add/msg",
			    	data: smsinfo,
			    	dataType: "json",
			    	success: function(data){
						$("#ModalSms").modal("hide");
						
						if ($("#ctrlsms").length) {
					    	var scope = angular.element($("#ctrlsms")).scope();
						    scope.$apply(function () {
						        scope.getPage();
						    });
						}
			    	},
			    	error: function(data){
			    		
			    	}
			    });
*/
/*			    $.post("/sms/add/msg", smsinfo, function(response){
					$("#ModalSms").modal("hide");
					
					if ($("#ctrlsms").length) {
				    	var scope = angular.element($("#ctrlsms")).scope();
					    scope.$apply(function () {
					        scope.getPage();
					    });
					}
			    });*/
				break;
			case WS_RES_EXTENSION_STATE:
				update_ext_status(item);
				SetCallState(item);
				break;
			case UC_REPORT_EXT_STATE:
				if (currentCallInfo.cmd == 0) {
					currentCallInfo = item;
					$("#call_idx").val(currentCallInfo.call_idx);
				}
				
				//console.log("item.direct: " + item.direct + ", item.status: " + item.status + ", item.callername: " + item.callername);
				//console.log("currentCallInfo.direct: " + currentCallInfo.direct + ", currentCallInfo.status: " + currentCallInfo.status + ", currentCallInfo.callername: " + currentCallInfo.callername);
				
				// telephone button of main page top
				if (item.status == UC_CALL_STATE_IDLE) {
					if ($("#btnCall").hasClass("btn-danger")) {
						$("#btnCall").removeClass("btn-danger");
						$("#btnCall").addClass("btn-primary");
						$("#btnCall").html("통화");
					}
					if ($("#btnCall").hasClass("disabled")) $("#btnCall").removeClass("disabled");
					if (!$("#btnTransfer").hasClass("disabled")) $("#btnTransfer").addClass("disabled");
					if ($("#btnPickup").hasClass("disabled")) $("#btnPickup").removeClass("disabled");
					if (!$("#btnHold").hasClass("disabled")) $("#btnHold").addClass("disabled");
					
					if (!$("#btnMemoTake").hasClass("disabled")) $("#btnMemoTake").addClass("disabled");
					if (!$("#btnMemoRedirect").hasClass("disabled")) $("#btnMemoRedirect").addClass("disabled");
					if (!$("#btnMemoHold").hasClass("disabled")) $("#btnMemoHold").addClass("disabled");
					if (!$("#btnMemoHangup").hasClass("disabled")) $("#btnMemoHangup").addClass("disabled");
				}
				if (item.status == UC_CALL_STATE_INVITING) {
					if (!$("#btnPickup").hasClass("disabled")) $("#btnPickup").addClass("disabled");
				}
				if (item.status == UC_CALL_STATE_BUSY) {
					if (!$("#btnCall").hasClass("disabled")) $("#btnCall").addClass("disabled");
					if (!$("#btnMemoTake").hasClass("disabled")) $("#btnMemoTake").addClass("disabled");
					if ($("#btnTransfer").hasClass("disabled")) $("#btnTransfer").removeClass("disabled");
					if ($("#btnHold").hasClass("disabled")) $("#btnHold").removeClass("disabled");
					
					if ($("#btnMemoRedirect").hasClass("disabled")) $("#btnMemoRedirect").removeClass("disabled");
					if ($("#btnMemoHold").hasClass("disabled")) $("#btnMemoHold").removeClass("disabled");
				}
				// telephone button of main page top
	
				var msg = "";
				
				switch (item.direct) {
					case UC_DIRECT_INCOMING:
						
						switch (item.status) {
							case UC_CALL_STATE_IDLE:
								if (currentCallInfo.status == UC_CALL_STATE_RINGING || currentCallInfo.status == UC_CALL_STATE_BUSY) {
									msg = "온라인...";
									$("#mainalert").html(msg);
									
									currentCallInfo.status = UC_CALL_STATE_IDLE;
									currentCallInfo.cmd = 0;
									currentCallInfo.call_idx = 0;
								}
								break;
							case UC_CALL_STATE_RINGING:
								if ($("#btnMemoTake").hasClass("disabled")) $("#btnMemoTake").removeClass("disabled");
								if ($("#btnMemoHangup").hasClass("disabled")) $("#btnMemoHangup").removeClass("disabled");
								$("#phonebtns").css("display","inline");

								if (item.callername == '' || typeof(item.callername) == 'undefined' || item.callername == null) {
									custbhv = bhv.add;
									msg = "전화가 왔습니다. ( " + item.caller + " )";
									$("#mainalert").html(msg);
									
									$("#addCustomer .modal-title").html("고객  등록");
									$("#addCustomer #btnMemo").css("display", "inline");
									$("#tel").val(item.caller);
								} else {
									custbhv = bhv.modi;
									msg = "전화가 왔습니다. " + item.callername + " ( " + item.caller + " )";
									$("#mainalert").html(msg);
									$.get("/customer/get/idx/" + item.cust_idx, function(response){
										$("#addCustomer .modal-title").html("고객 정보");
										$("#addCustomer #btnMemo").css("display", "inline");
										
										var itm = response;
	
										$("#addCustomer #idx").val(itm.idx);
										$("#addCustomer #maingroup").val(itm.maingroup);
										$("#addCustomer #uname").val(itm.uname);
										$("#addCustomer #firm").val(itm.firm);
										$("#addCustomer #posi").val(itm.posi);
										$("#addCustomer #tel").val(itm.tel);
										$("#addCustomer #cellular").val(itm.cellular);
										$("#addCustomer #extension").val(itm.extension);
										$("#addCustomer #email").val(itm.email);
										
										SetSubgroups(itm.maingroup, itm.subgroup);
									});
								}
								
								$("#addCustomer").modal({backdrop: false});
								
								if ($("#ctrlcalls").length) {
							    	var scope = angular.element($("#ctrlcalls")).scope();
								    scope.$apply(function () {
								        scope.getPage();
								    });
								}
								
								currentCallInfo.status = UC_CALL_STATE_RINGING;
								break;
							case UC_CALL_STATE_BUSY:
								msg = "통화중... " + item.callername + " (" + item.caller + ")";
								$("#mainalert").html(msg);
								currentCallInfo.status = UC_CALL_STATE_BUSY;
								break;
						}
						break;
					case UC_DIRECT_OUTGOING:
						switch (item.status) {
						case UC_CALL_STATE_IDLE:
							if (currentCallInfo.status == UC_CALL_STATE_RINGING || currentCallInfo.status == UC_CALL_STATE_BUSY) {
								msg = "온라인...";
								$("#mainalert").html(msg);
								
								currentCallInfo.status = UC_CALL_STATE_IDLE;
								currentCallInfo.cmd = 0;
								currentCallInfo.call_idx = 0;
							}
							break;
						case UC_CALL_STATE_INVITING:
							if (item.calleename == '' || typeof(item.calleename) == 'undefined' || item.calleename == null) {
								msg = "전화를 거는 중... ( " + item.callee + " )";
							} else {
								msg = "전화가 거는 중... " + item.calleename + " ( " + item.callee + " )";
							}
							$("#mainalert").html(msg);
							break;
						case UC_CALL_STATE_BUSY:
							if ($("#btnMemoTake").hasClass("disabled")) $("#btnMemoTake").removeClass("disabled");
							if ($("#btnMemoHangup").hasClass("disabled")) $("#btnMemoHangup").removeClass("disabled");
							$("#phonebtns").css("display","inline");
							
							if (item.calleename == '' || typeof(item.calleename) == 'undefined' || item.calleename == null) {
								custbhv = bhv.add;
								
								msg = "통화중... (" + item.callee + ")";
								$("#mainalert").html(msg);
								
								$("#addCustomer .modal-title").html("고객  등록");
								$("#addCustomer #btnMemo").css("display", "inline");
								$("#tel").val(item.caller);
							} else {
								custbhv = bhv.modi;
								
								msg = "통화중... " + item.calleename + " (" + item.callee + ")";
								$("#mainalert").html(msg);
								
								$.get("/customer/get/idx/" + item.cust_idx, function(response){
									$("#addCustomer .modal-title").html("고객 정보");
									$("#addCustomer #btnMemo").css("display", "inline");
									
									var itm = response;
	
									$("#addCustomer #idx").val(itm.idx);
									$("#addCustomer #maingroup").val(itm.maingroup);
									$("#addCustomer #uname").val(itm.uname);
									$("#addCustomer #firm").val(itm.firm);
									$("#addCustomer #posi").val(itm.posi);
									$("#addCustomer #tel").val(itm.tel);
									$("#addCustomer #cellular").val(itm.cellular);
									$("#addCustomer #extension").val(itm.extension);
									$("#addCustomer #email").val(itm.email);
									
									SetSubgroups(itm.maingroup, itm.subgroup);
								});
							}
							
							$("#addCustomer").modal({backdrop: false});
							
							if ($("#ctrlcalls").length) {
						    	var scope = angular.element($("#ctrlcalls")).scope();
							    scope.$apply(function () {
							        scope.getPage();
							    });
							}
							
							currentCallInfo.status = UC_CALL_STATE_RINGING;
							break;
					}
						break;
					default:
						break;
				}
				break;
		}
	}
	
	// 내선 상태 초기화 최초 한번
	function InitializeExts() {
	    trade = {
            cmd: UC_BUSY_EXT_REQ,
            extension: '',
            caller: '',
            callee: '',
            unconditional: '',
            status: -1
          };
	    
	 	stompClient.send("/app/traders", {}, JSON.stringify(trade));
	}
	
	function RequestExtState() {
		trade = {
	            cmd: WS_REQ_EXTENSION_STATE,
	            extension: '',
	            caller: '',
	            callee: '',
	            unconditional: '',
	            status: -1
	          };
	    
	 	stompClient.send("/app/traders", {}, JSON.stringify(trade));
	}
	
	
	function TelePhoneFunction() {
		switch (btnbehavoir) {
			case btnbhv.call:
				trade = {
	                cmd: UC_MAKE_CALL_REQ,
	                extension: crmidentity.ext,
	                caller: crmidentity.ext,
	                callee: $("#ModalTransfer #txtnumber").val(),
	                unconditional: '',
            	status: -1
				};
				break;
			case btnbhv.redirect:
		        trade = {
	                cmd: UC_TRANSFER_CALL_REQ,
	                extension: crmidentity.ext,
	                caller: currentCallInfo.caller,
	                callee: currentCallInfo.callee,
	                unconditional: $("#ModalTransfer #txtnumber").val(),
	                status: -1
		        };
				break;
			case btnbhv.pickup:
				var numval = $("#ModalTransfer #txtnumber").val();
				if (numval == '') {
			        trade = {
			            cmd: UC_PICKUP_CALL_REQ,
			            extension: crmidentity.ext,
			            caller: '',
			            callee: '*98',
			            unconditional: '',
			            status: -1
			        };
				} else {
			        trade = {
			            cmd: UC_PICKUP_CALL_REQ,
			            extension: crmidentity.ext,
			            caller: '',
			            callee: numval,
			            unconditional: '',
			            status: -1
			        };
				}
				break;
			case btnbhv.redirected:
				trade.unconditional = $("#ModalTransfer #txtnumber").val();
				break;
			case btnbhv.none:
			default:
		        trade = {
	                cmd : UC_TRANSFER_CALL_REQ,
	                extension : currentCallInfo.extension,
	                caller : currentCallInfo.caller,
	                callee : currentCallInfo.callee,
	                unconditional : $("#ModalTransfer #txtnumber").val(),
	                status: -1
	        	};
				break;
		}
		
	 	stompClient.send("/app/traders", {}, JSON.stringify(trade));
	 	$("#ModalTransfer").modal("hide");
	}
