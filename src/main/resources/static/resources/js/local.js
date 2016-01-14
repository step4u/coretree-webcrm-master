	var currentCallInfo = {
		cmd: 0,
		ext: '',
		caller: '',
		callee: '',
		unconditional: '',
		status: -1
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
	
	var custbhv = bhv.none;
	var MyState = crmstate.idle; 
	
	$(function(){
	    /*** script for address book ***/
		$("#btnSave").click(function(){
			SaveCust();
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
				company: $("#company").val(),
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
		$("#company").val('');
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
		}
	}
