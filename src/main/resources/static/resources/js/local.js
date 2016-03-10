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
		direct: 10,
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
	
	var btnbhv = {
		none: 0,
		call: 1,
		redirect: 2,
		pickup: 3,
		hold: 4,
		drop: 5
	}
	var btnbehavoir = btnbhv.none;
	
	var crmstate = {
		unreg: 0,
		idle: 1,
		invite: 2,
		ring: 3,
		busy: 4,
		hold: 5
	}
	
	var state = {
		online: 1,
		left: 2,
		directed: 3,
		dnd: 4
	}
	// var mystate = state.online;
	
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
		
		$("#ModalTransfer").on('shown.bs.modal', function () {
			$("#ModalTransfer #txtnumber").focus();
			$("#ModalTransfer #txtnumber").select();
    	});
		
		$("#ModalTransfer").on('hidden.bs.modal', function () {
			btnbehavoir = btnbhv.none;
    	});
		
		$("#ModalTransfer #btnTransferClose").click(function(){
			$("#ModalTransfer").modal("hide");
		});
		
		$("#ModalTransfer #btnTransferSend").click(function(){
			TelePhoneFunction();
		});
		
		$("#ModalTransfer #txtnumber").keyup(function(event){
			if (event.keyCode != 13) return;
			
			TelePhoneFunction();
		});
		
		$("#btnMemoHold").click(function(){
			var tmptxt = $(this).html();
			
			if (tmptxt == '보류') {
		        trade = {
	                cmd : UC_HOLD_CALL_REQ,
	                extension : currentCallInfo.extension,
	                caller : currentCallInfo.caller,
	                callee : currentCallInfo.callee,
	                unconditional : '',
	                status: -1
		        };
			} else {
		        trade = {
	                cmd : UC_ACTIVE_CALL_REQ,
	                extension : currentCallInfo.extension,
	                caller : currentCallInfo.caller,
	                callee : currentCallInfo.callee,
	                unconditional : '',
	                status: -1
	        	};
			}
			
	        stompClient.send("/app/traders", {}, JSON.stringify(trade));
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
		
		$("#btnMemoTake").click(function(){
	        trade = {
                cmd: UC_ANWSER_CALL_REQ,
                direct: 0,
                call_idx: 0,
                extension: currentCallInfo.extension,
                cust_idx: 0,
                caller: '',
                callername: '',
                callee: '',
                calleename: '',
                responseCode: '',
                unconditional: '',
                status: 0
	        };
	        
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		});
		
		$("#btnMemoRedirect").click(function(){
			$("#ModalTransfer").modal("show");
		});
		
		$("#btnMemoHangup").click(function(){
	        trade = {
                cmd : UC_DROP_CALL_REQ,
                extension : currentCallInfo.extension,
                caller : currentCallInfo.caller,
                callee : currentCallInfo.callee,
                unconditional : '',
                status: -1
	        };
	        
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
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
		$("#btnCall").click(function() {
			if ($(this).html() == '통화') {
				btnbehavoir = btnbhv.call;
				$("#ModalTransfer").modal("show");
			} else {
		        trade = {
	                cmd : UC_DROP_CALL_REQ,
	                extension : currentCallInfo.extension,
	                caller : currentCallInfo.caller,
	                callee : currentCallInfo.callee,
	                unconditional : '',
	                status: -1
		        };
			        
	        	stompClient.send("/app/traders", {}, JSON.stringify(trade));
			}
		});
		
		$("#btnTransfer").click(function(){
			btnbehavoir = btnbhv.redirect;
			$("#ModalTransfer").modal("show");
		});
		
		$("#btnPickup").click(function(){
			btnbehavoir = btnbhv.pickup;
			$("#ModalTransfer").modal("show");
		});
		
		$("#btnHold").click(function(){
			if ($(this).html() == '보류') {
		        trade = {
	                cmd : UC_HOLD_CALL_REQ,
	                extension : currentCallInfo.extension,
	                caller : currentCallInfo.caller,
	                callee : currentCallInfo.callee,
	                unconditional : '',
	                status: -1
		        };
			} else {
		        trade = {
	                cmd : UC_ACTIVE_CALL_REQ,
	                extension : currentCallInfo.extension,
	                caller : currentCallInfo.caller,
	                callee : currentCallInfo.callee,
	                unconditional : '',
	                status: -1
		        };
			}
	        
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		});

		// isn't used
		$("#callnumber").keyup(function(event){
			if (event.keyCode != 13) return;
			
	        trade = {
                cmd: UC_TRANSFER_CALL_REQ,
                extension: crmidentity.ext,
                caller: currentCallInfo.caller,
                callee: currentCallInfo.callee,
                unconditional: $("#callnumber").val(),
                status: -1
	        };
		        
	     	stompClient.send("/app/traders", {}, JSON.stringify(trade));
		});
		
		// isn't used
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
			obj.idx = $("#addCustomer #idx").val();
		}
		
		$.post(url, obj, function(response){
			$('#addCustomer').modal("hide");
			
			if ($("#ctrlcustomers").length) {
		    	var scope = angular.element($("#ctrlcustomers")).scope();
			    scope.$apply(function () {
			        scope.getPage('');
			    });				
			}
			
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
		$("#addCustomer #btnMemo").css("display", "none");
		
		$("#addCustomer #btnMemoTake").css("display", "inline");
		$("#addCustomer #btnMemoRedirect").css("display", "inline");
		$("#addCustomer #btnMemoHold").css("display", "inline");
		$("#addCustomer #btnMemoHangup").css("display", "inline");
		
		if ($("#btnMemoHangup").hasClass("disabled")) $("#btnMemoHangup").removeClass("disabled");
		$("#phonebtns").css("display","none");
		
		// $('#addCustomer #subgroup').find('option:not(:first)').remove();
		// $('#addCustomer #subgroup').empty().append('<option value="0">:: 서브그룹 ::</option>');
		// $('#addCustomer #subgroup').find('option:not(:first)').remove();
	}
	
	function SetSubgroups(maingroup, subgroup) {
		$.get("/customer/get/group/" + maingroup, function(response){
			$('#addCustomer #subgroup').find('option:not(:first)').remove();
			
			var itm = response;
			$(itm).each(function(i, v){ 
				$("#addCustomer #subgroup").append($("<option>", { value: v.subgroup, html: v.txt }));
			});
			
			if (subgroup) {
				$("#addCustomer #subgroup").val(subgroup);				
			}
		});
	}
	/*** script for address book ***/
	
	/*** script for set main message ***/
	function SetMessage(msg) {
		
	}
	/*** script for set main message ***/
	
	function SetMyState(extitem, statecount) {
		console.log("set my state: " + extitem.status + ", statecount.ring: " + statecount.ring);
		
		switch (extitem.state) {
			case UC_CALL_STATE_UNREG:
				MyState = crmstate.unreg;
				
				if (!$("#btnCall").hasClass("disabled")) $("#btnCall").addClass("disabled");
				if (!$("#btnPickup").hasClass("disabled")) $("#btnPickup").addClass("disabled");
				if (!$("#btnTransfer").hasClass("disabled")) $("#btnTransfer").addClass("disabled");
				if (!$("#btnHold").hasClass("disabled")) $("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_IDLE:
				MyState = crmstate.idle;
				
				if ($("#callnumber").val() == '') {
					if (!$("#btnCall").hasClass("disabled")) $("#btnCall").addClass("disabled");
				} else {
					if (!$("#btnCall").hasClass("disabled")) $("#btnCall").removeClass("disabled");
				}

				if (!$("#btnPickup").hasClass("disabled")) $("#btnPickup").removeClass("disabled");
				if (!$("#btnTransfer").hasClass("disabled")) $("#btnTransfer").addClass("disabled");
				if (!$("#btnHold").hasClass("disabled")) $("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_INVITING:
				MyState = crmstate.invite;
				
				if (!$("#btnCall").hasClass("disabled")) $("#btnCall").addClass("disabled");
				if (!$("#btnPickup").hasClass("disabled")) $("#btnPickup").addClass("disabled");
				if (!$("#btnTransfer").hasClass("disabled")) $("#btnTransfer").addClass("disabled");
				if (!$("#btnHold").hasClass("disabled")) $("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_RINGING:
				MyState = crmstate.ring;
				
				if (!$("#btnCall").hasClass("disabled")) $("#btnCall").addClass("disabled");
				if (!$("#btnPickup").hasClass("disabled")) $("#btnPickup").addClass("disabled");
				if (!$("#btnTransfer").hasClass("disabled")) $("#btnTransfer").addClass("disabled");
				if (!$("#btnHold").hasClass("disabled")) $("#btnHold").addClass("disabled");
				break;
			case UC_CALL_STATE_BUSY:
				MyState = crmstate.busy;
				
				if (!$("#btnCall").hasClass("disabled")) $("#btnCall").addClass("disabled");
				if (!$("#btnPickup").hasClass("disabled")) $("#btnPickup").addClass("disabled");
				if (!$("#btnTransfer").hasClass("disabled")) $("#btnTransfer").removeClass("disabled");
				if (!$("#btnHold").hasClass("disabled")) $("#btnHold").removeClass("disabled");
				break;
		}
	}
