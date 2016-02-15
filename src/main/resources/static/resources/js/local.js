	var crmidentity;

	// for websocket
    var trade = {
        cmd : 0,
        extension : '3001',
        caller : '',
        callee : '',
        unconditional : '',
        status: -1
	};
	
	var currentCallInfo = {
		cmd: 0,
		call_idx: 0,
		extension: '',
		cust_idx: 0,
		caller: '',
		callername: '',
		callee: '',
		calleename: '',
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
	
	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();
		
		$('a').click(function(event){
			var str = this.toString();
			str = str.split('/#/');

			if (str.length < 2)
				event.preventDefault();
		});
		
	    $("#menu-toggle").click(function(e) {
	        e.preventDefault();
	        $("#wrapper").toggleClass("toggled");
	    });
	    
	    var tmpidentity = $.cookie("crm.identity");
	    crmidentity = JSON.parse(tmpidentity);
	    
	    
	    
	    
	    
		/*** set systeminfo ***/
		$("#systeminfo").html("시스템 정상 (" + crmidentity.ext + ")");
		
		$("#addCustomer").draggable({
		      handle: ".modal-header"
		});
		
		$("#addCustomer").on('shown.bs.modal', function () {
			
    	});
		
		$("#addCustomer").on('hidden.bs.modal', function () {
			ClearForm();
    	});
		
		$("#Memo").draggable({
		      handle: ".modal-header"
		});
		
	    /*** script for address book ***/
		$("#addCustomer #maingroup").change(function(){
			SetSubgroups($(this).val());
		});
		
		$("#btnSave").click(function(){
			SaveCust();
		});
		
		$("#btnClose").click(function(){
			var custbhv = bhv.none;
			$("#addCustomer").modal("hide");
		});
		
		$("#btnMemo").click(function(){
			var memotitle;
			if (currentCallInfo.callername == '') {
				memotitle = "메모 (" + currentCallInfo.caller + ")";
			} else {
				memotitle = "메모 (" + currentCallInfo.callername + ")";
			}
			
			// $("#call_idx").val(currentCallInfo.call_idx);
			
			$("#Memo .modal-title").html(memotitle);
			$("#Memo").modal({backdrop: false});
		});
		
		$("#btnMemoSave").click(function(){
			var callcontent = {
				idx: $("#call_idx").val(),
				memo: $("#memotxt").val()
			}
			$.post("/call/memo", callcontent, function(response){
				$("#memotxt").val("");
				$("#call_idx").val("");
				$("#Memo").modal("hide");
				
				if ($("#ctrlcalls").length) {
			    	var scope = angular.element($("#ctrlcalls")).scope();
				    scope.$apply(function () {
				        scope.getPage();
				    });
				}
			});
		});
		
		$("#btnMemoClose").click(function(){
			$("#memotxt").val("");
			$("#call_idx").val("");
			$("#Memo").modal("hide");
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
	        
			// console.log("makecall: " + JSON.stringify(trade));
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
	     	
			makecall = true;
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
		
	    if (crmidentity.role === "ROLE_ADMIN") {
	    	$(".ADMIN").css("display", "inline");
	    }
	    
	    $("#logout").click(function(){
	    	disconnect();
	    	location.href = "/logout.html";
	    });
	});
	
	/*** script for address book ***/
	function SaveCust() {
		var obj = {
			idx: $("#addCustomer #idx").val(),
			depthorder: $("#addCustomer #maingroup").val() + $("#addCustomer #subgroup").val(),
			username: crmidentity.username,
			uname: $("#addCustomer #uname").val(),
			firm: $("#addCustomer #firm").val(),
			posi: $("#addCustomer #posi").val(),
			tel: $("#addCustomer #tel").val(),
			cellular: $("#addCustomer #cellular").val(),
			extension: $("#addCustomer #extension").val(),
			email: $("#addCustomer #email").val()
		};
			
/*		if (obj.depthorder == "") {
			$("#alertcust").html("<strong>필수입력</strong> 그룹을 선택하세요.").css('display', 'block');
			$("#depthorder").focus();
			return;
		}*/
		if ($("#addCustomer #maingroup").val() === "0") {
			$("#addCustomer #alertcust").html("<strong>필수입력</strong> 메인그룹을 선택하세요.").css('display', 'block');
			$("#addCustomer #maingroup").focus();
			return;
		}
		if ($("#addCustomer #subgroup").val() === "0") {
			$("#addCustomer #alertcust").html("<strong>필수입력</strong> 서브그룹을 선택하세요.").css('display', 'block');
			$("#addCustomer #subgroup").focus();
			return;
		}
		if (obj.uname == "") {
			$("#addCustomer #alertcust").html("<strong>필수입력</strong> 이름을 입력하세요.").css('display', 'block');
			$("#addCustomer #uname").focus();
			return;
		}
		if (!(obj.tel != "" || obj.cellular != "")) {
			$("#addCustomer #alertcust").html("<strong>필수입력</strong> 전화번호와 휴대전화 하나는 입력해야합니다.").css('display', 'block');
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
		
		console.log(JSON.stringify(obj));
		
		$.post(url, obj, function(response){
			// console.log("cust bhv: " + bhv + ", response: " + response + ", response.data: " + response.data);
			$('#addCustomer').modal("hide");
			
	    	var scope = angular.element($("#ctrlcustomers")).scope();
		    scope.$apply(function () {
		        scope.getPage('');
		    });
			
			custbhv = bhv.none;
		});
	}
	
	function ClearForm() {
		$("#addCustomer #idx").val('-1');
		$("#addCustomer #uname").val('');
		$("#addCustomer #firm").val('');
		$("#addCustomer #posi").val('');
		$("#addCustomer #tel").val('');
		$("#addCustomer #cellular").val('');
		$("#addCustomer #extension").val('');
		$("#addCustomer #email").val('');
		
		// $('#addCustomer #subgroup').find('option:not(:first)').remove();
		// $('#addCustomer #subgroup').empty().append('<option value="0">:: 서브그룹 ::</option>');
		// $('#addCustomer #subgroup').find('option:not(:first)').remove();
	}
	
	function SetSubgroups(maingroup, subgroup) {
		$('#addCustomer #subgroup').find('option:not(:first)').remove();
		
		$.get("/customer/get/group/" + maingroup, function(response){
			var itm = response;
			$(itm).each(function(i, v){ 
				$("#addCustomer #subgroup").append($("<option>", { value: v.subgroup, html: v.txt }));
			});
			
			if (subgroup) {
				$("#addCustomer #subgroup").val(subgroup);				
			}
			// console.log("SetSubgroups : entered");
		});
	}
	/*** script for address book ***/
	
	/*** script for set main message ***/
	function SetMessage(msg) {
		
	}
	/*** script for set main message ***/
	
	function SetMyState(extitem, statecount) {
		// console.log("set my state: " + extitem.status + ", statecount.ring: " + statecount.ring);
		
		switch (extitem.state) {
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
/*		
		extstatecount.unreg = 0;
		extstatecount.idle = 0;
		extstatecount.invite = 0;
		extstatecount.ring = 0;
		extstatecount.busy = 0;*/
	}
	
	function SetCallState() {
    	var scope0 = angular.element($("#ctrlcallstatus")).scope();

		var scope1 = angular.element($("#ctrlextstatus")).scope();
		scope1.$apply(function () {
	    	var data = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '온라인';
	    	});
	    	scope0.gridOptions.data[0].count = data.length;
	    	
	    	data = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '연결중';
	    	});
	    	scope0.gridOptions.data[1].count = data.length;
	    	
	    	data = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '통화중';
	    	});
	    	scope0.gridOptions.data[2].count = data.length;
	    	
	    	data = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '자리비움';
	    	});
	    	scope0.gridOptions.data[3].count = data.length;
	    	
	    	data = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '착신전환';
	    	});
	    	scope0.gridOptions.data[4].count = data.length;
	    	
	    	data = scope1.gridOptions.data.filter(function(element, index){
	    		return element.state == '대기중';
	    	});
	    	scope0.gridOptions.data[5].count = data.length;
	    });
	}
	
	var makecall = false;
	function TreatMySelf(item) {
		// Button Call 요청에 대한 결과
		console.log("TreatMySelf: " + item.cmd + " // " + item.direct + " // " + item.status);
		
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
					currentCallInfo = item;
					$("#call_idx").val(currentCallInfo.call_idx);
				}
				
				switch (item.direct) {
					case UC_DIRECT_INCOMING:
						
						switch (item.status) {
							case UC_CALL_STATE_IDLE:
								if (currentCallInfo.status == UC_CALL_STATE_RINGING || currentCallInfo.status == UC_CALL_STATE_BUSY) {
									var msg = "온라인...";
									$("#mainalert").html(msg);
									
									currentCallInfo.status = UC_CALL_STATE_IDLE;
									currentCallInfo.cmd = 0;
									currentCallInfo.call_idx = 0;
								}
								break;
							case UC_CALL_STATE_RINGING:
								var msg = "전화가 왔습니다. " + item.callername + " (" + item.caller + ")";
								$("#mainalert").html(msg);
								if (item.callername == '') {
									custbhv = bhv.add;
									$("#addCustomer .modal-title").html("고객 등록");
									$("#tel").val(item.caller);
								} else {
									$.get("/customer/get/idx/" + item.cust_idx, function(response){
										
										custbhv = bhv.modi;
										$("#addCustomer .modal-title").html("고객 정보");
										
										var itm = response;
	
										$("#addCustomer #idx").val(itm.idx);
										$("#addCustomer #maingroup").val(itm.maingroup);
										// $("#addCustomer #subgroup").val(itm.subgroup);
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
								var msg = "통화중..." + item.callername + " (" + item.caller + ")";
								$("#mainalert").html(msg);
								
								currentCallInfo.status = UC_CALL_STATE_BUSY;
								break;
						}
						break;
					case UC_DIRECT_OUTGOING:
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
                cmd: 64,
                extension: '',
                caller: '',
                callee: '',
                unconditional: '',
                status: -1
              };
        
     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
	}