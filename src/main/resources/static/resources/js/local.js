	var currentCallInfo = {
		cmd: 0,
		ext: '',
		caller: '',
		callee: '',
		unconditional: '',
		status: UC_CALL_STATE_IDLE
	}

	var extstatecount = {
		unreg: 0,
		idle: 0,
		invite: 0,
		ring: 0,
		busy: 0
	}

	var bhv = {
		none: 0,
		add: 1,
		modi: 2,
		del: 3
	}
	
	var crmstate = {
			unreg: 0,
			idle: 1,
			invite: 2,
			ring: 3,
			busy: 4,
			hold: 5
		}
	
	// 고객 등록, 수정, 삭제 시 사용
	var custbhv = bhv.none;
	// crm 상태 구분할 때 사용
	var MyState = crmstate.idle; 
	
	$(function(){
		/*** call status renew ***/
		setInterval(SetCallState, 5000);
		
		$("#addCustomer").draggable({
		      handle: ".modal-header"
		  });
		
	    /*** script for address book ***/
		$("#btnSave").click(function(){
			SaveCust();
		});
		
		$("#btnClose").click(function(){
			var custbhv = bhv.none;
			$("#addCustomer").modal("hide");
		});
		
		$("#btnMemo").click(function(){
			
		});
		/*** script for address book ***/

		
        /*** script for my call button ***/
		
		$("#btnCall").click(function(){
			var btnval = $(this).val();
			trade = {
	                cmd: 74,
	                extension: crmidentity.ext,
	                caller: crmidentity.ext,
	                callee: $("#callnumber").val(),
	                unconditional: '',
	                status: -1
	              };
			
			switch (btnval) {
				case '전화하기':
					break;
				default:
					//trade.cmd = 76;
					break;
			}
	        
			console.log("makecall: " + JSON.stringify(trade));
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		});
		
		$("#btnPickup").click(function(){
			var numval = $("#callnumber").val();
			if (numval == '') {
		        trade = {
			            cmd: 80,
			            extension: crmidentity.ext,
			            caller: '',
			            callee: '*98',
			            unconditional: '',
			            status: -1
			          };
			} else {
		        trade = {
			            cmd: 80,
			            extension: crmidentity.ext,
			            caller: '',
			            callee: numval,
			            unconditional: '',
			            status: -1
			          };
			}
			
			stompClient.send("/app/traders", {}, JSON.stringify(trade));
		});
		
		$("#btnTransfer").click(function(){
	        trade = {
	                cmd: 86,
	                extension: crmidentity.ext,
	                caller: currentCallInfo.caller,
	                callee: currentCallInfo.callee,
	                unconditional: $("#callnumber").val(),
	                status: -1
	              };
	        
//	        console.log("Transfer0: " + JSON.stringify(currentCallInfo));
//	        console.log("Transfer1: " + JSON.stringify(trade));
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		});
		
		$("#btnHold").click(function(){
	        trade = {
	                cmd: 82,
	                extension: crmidentity.ext,
	                caller: currentCallInfo.caller,
	                callee: currentCallInfo.callee,
	                unconditional: '',
	                status: -1
	              };
	        
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		});

		$("#callnumber").on("keyup", function(e){
			// console.log("input ...." + e.type + '//' + e.which + ', MyState=' + MyState);
			if (MyState == crmstate.idle) {
				if (typeof(e.which) != 'undefined') {
					$("#btnCall").removeClass("disabled");
				}
				if ($(this).val() == '') {
					$("#btnCall").addClass("disabled");
				}
			}
		});
		
        /*** script for my call button ***/
	});
	
	/*** script for address book ***/
	function SaveCust() {
		var obj = {
				idx: $("#idx").val(),
				depthorder: $("#depthorder").val() == "" ? $("#depthorder").val() : $("#depthorder").val().replace("string:", ""),
				username: crmidentity.username,
				uname: $("#uname").val(),
				firm: $("#firm").val(),
				posi: $("#posi").val(),
				tel: $("#tel").val(),
				cellular: $("#cellular").val(),
				extension: $("#extension").val(),
				email: $("#email").val()
		};
			
		//console.log("obj.depthorder: " + obj.depthorder);
		
		if (obj.depthorder == "") {
			$("#alertcust").html("<strong>필수입력</strong> 그룹을 선택하세요.").css('display', 'block');
			$("#depthorder").focus();
			return;
		}
		if (obj.uname == "") {
			$("#alertcust").html("<strong>필수입력</strong> 이름을 입력하세요.").css('display', 'block');
			$("#uname").focus();
			return;
		}
		if (!(obj.tel != "" || obj.cellular != "")) {
			$("#alertcust").html("<strong>필수입력</strong> 전화번호와 휴대전화 하나는 입력해야합니다.").css('display', 'block');
			if (obj.tel == "") {
				$("#tel").focus();
				return;
			}
			if (obj.cellular == "") {
				$("#cellular").focus();
				return;
			}
		}
		
		var url;
		
		if (custbhv == bhv.add) {
			url = "/customer/add/";
		} else if (custbhv == bhv.modi) {
			url = "/customer/modi/";
		}
		
		$.post(url, obj, function(response){
			// console.log("cust bhv: " + bhv + ", response: " + response + ", response.data: " + response.data);
			$('#addCustomer').modal("hide");
			ClearForm();
			
	    	var scope = angular.element($("#ctrlcustomers")).scope();
		    scope.$apply(function () {
		        scope.getPage('');
		    });
			
			custbhv = bhv.none;
		});
	}
	
	function ClearForm() {
		// console.log("group.length: " + group.length + ", group: " + group);
		$("#idx").val('-1');
		group.length == 2 ? $("#depthorder").val('string:' + group) : $("#depthorder option:eq(0)").prop("selected", true);
		$("#uname").val('');
		$("#firm").val('');
		$("#posi").val('');
		$("#tel").val('');
		$("#cellular").val('');
		$("#extension").val('');
		$("#email").val('');
	}
	/*** script for address book ***/
	
	/*** script for set main message ***/
	function SetMessage(msg) {
		
	}
	/*** script for set main message ***/
	
	function SetMyState(extitem, statecount) {
		console.log("set my state: " + extitem.status + ", statecount.ring: " + statecount.ring);
		
		switch (extitem.status) {
			case UC_CALL_STATE_UNREG:
				MyState = crmstate.unreg;
				
				$("#btnCall").addClass("disabled");
				$("#btnPickup").addClass("disabled");
				$("#btnTransfer").addClass("disabled");
				$("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_IDLE:
				MyState = crmstate.idle;
				
				if ($("#callnumber").val() == '') {
					$("#btnCall").addClass("disabled");
				} else {
					$("#btnCall").removeClass("disabled");
				}
//				if (statecount.ring > 0){
//					$("#btnPickup").removeClass("disabled");
//				} else {
//					$("#btnPickup").addClass("disabled");
//				}
				$("#btnPickup").removeClass("disabled");
				$("#btnTransfer").addClass("disabled");
				$("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_INVITING:
				MyState = crmstate.invite;
				
				$("#btnCall").addClass("disabled");
				$("#btnPickup").addClass("disabled");
				$("#btnTransfer").addClass("disabled");
				$("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_RINGING:
				MyState = crmstate.ring;
				
				$("#btnCall").addClass("disabled");
				$("#btnPickup").addClass("disabled");
				$("#btnTransfer").addClass("disabled");
				$("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_BUSY:
				MyState = crmstate.busy;
				
				$("#btnCall").addClass("disabled");
				$("#btnPickup").addClass("disabled");
				$("#btnTransfer").removeClass("disabled");
				$("#btnHold").removeClass("disabled");
				break;
		}
		
		extstatecount.unreg = 0;
		extstatecount.idle = 0;
		extstatecount.invite = 0;
		extstatecount.ring = 0;
		extstatecount.busy = 0;
	}
	
	function SetCallState() {
    	var scope0 = angular.element($("#ctrlcallstatus")).scope();
    	//console.log("SetCallState scope1: " + JSON.stringify(scope0.gridOptions.data));

		var scope1 = angular.element($("#ctrlextstatus")).scope();
		scope1.$apply(function () {
	    	var data = scope1.gridOptions.data.filter(function(element, index){
	    		// console.log("SetCallState element.status: " + element.status);
	    		return element.status == '통화중';
	    	});
	    	scope0.gridOptions.data[0].count = data.length;
	    	// console.log("SetCallState data0length: " + data.length);
	    	
	    	data = scope1.gridOptions.data.filter(function(element, index){
	    		// console.log("SetCallState element.status: " + element.status);
	    		return element.status == '대기중';
	    	});
	    	scope0.gridOptions.data[1].count = data.length;
	    	// console.log("SetCallState data1.length: " + data.length);
	    	
	    	data = scope1.gridOptions.data.filter(function(element, index){
	    		// console.log("SetCallState element.status: " + element.status);
	    		return element.status == '연결중';
	    	});
	    	scope0.gridOptions.data[2].count = data.length;
	    	// console.log("SetCallState data2.length: " + data.length);
	    });
	}
	
	function TreatMySelf(item) {
		// Button Call 요청에 대한 결과
		switch (item.cmd) {
			case UC_MAKE_CALL_RES:
				if (item.status == UC_STATUS_SUCCESS) {
					$("#btnCall").val("전화끊기");
				} else {
					
				}
				break;
			case UC_DROP_CALL_RES:
				break;
			case UC_PICKUP_CALL_REQ:
				break;
			case UC_HOLD_CALL_RES:
				break;
			case UC_ACTIVE_CALL_RES:
				break;
			case UC_REPORT_EXT_STATE:
				if (currentCallInfo.cmd == 0) {
	                currentCallInfo.cmd = item.cmd;
	                currentCallInfo.ext = item.extension;
	                currentCallInfo.caller = item.caller;
	                currentCallInfo.callee = item.callee;
	                currentCallInfo.unconditional = item.unconditional;
	                currentCallInfo.status = item.status;
				} else {
					//console.log("UC_REPORT_EXT_STATE: " + item.status);
					switch (currentCallInfo.status) {
						case UC_CALL_STATE_IDLE:
						case UC_CALL_STATE_INVITING:
							if (item.status == UC_CALL_STATE_RINGING) {
								//console.log("/customer/get/idx/ ringing0: " + item.cust_idx + "//" + item.status);
								//console.log("/customer/get/idx/ ringing1: " + item.cust_idx);
								
								var msg = "전화 왔습니다.<br/>" + item.callername + " (" + item.caller + ")";
								$("#mainalert").html(msg);
								
								if (item.callername == '') {
									custbhv = bhv.add;
									$("#addCustomer .modal-title").html("고객 등록");
									$("#tel").val(item.caller);
								} else {
									// console.log("/customer/get/idx/0: " + item.cust_idx);
									$.get("/customer/get/idx/" + item.cust_idx, function(response){
										console.log("/customer/get/idx/: " + JSON.stringify(response));
										
										custbhv = bhv.modi;
										$("#addCustomer .modal-title").html("고객 정보");
										
										var item = response;

										$("#addCustomer #idx").val(item.idx);
										$("#addCustomer #depthorder").val('string:' + item.depthorder);
										$("#addCustomer #uname").val(item.uname);
										$("#addCustomer #firm").val(item.firm);
										$("#addCustomer #posi").val(item.posi);
										$("#addCustomer #tel").val(item.tel);
										$("#addCustomer #cellular").val(item.cellular);
										$("#addCustomer #extension").val(item.extension);
										$("#addCustomer #email").val(item.email);
									});
								}
								
								$("#addCustomer").modal({backdrop: false});
								
								if ($("#ctrlcalls").length) {
							    	var scope = angular.element($("#ctrlcalls")).scope();
								    scope.$apply(function () {
								        scope.getPage('');
								    });
								}
								
								currentCallInfo.status = UC_CALL_STATE_RINGING;
							}
							break;
						case UC_CALL_STATE_RINGING:
						case UC_CALL_STATE_BUSY:
							if (item.status == UC_CALL_STATE_BUSY) {
								var msg = "통화중...<br/>" + item.callername + " (" + item.caller + ")";
								$("#mainalert").html(msg);
								
								currentCallInfo.status = UC_CALL_STATE_BUSY;
							}
							
							if (item.status == UC_CALL_STATE_IDLE) {
								var msg = "대기중...<br/><br/>";
								$("#mainalert").html(msg);
								
								currentCallInfo.status = UC_CALL_STATE_IDLE;
							}
							break;
					}
				}
				break;
		}
	}
