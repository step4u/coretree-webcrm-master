	var bhv = {
		none: 0,
		add: 1,
		modi: 2,
		del: 3
	}
	
	var custbhv = bhv.none;
	
	
	$(function(){
	    /*** script for address book ***/
		$("#btnSave").click(function(){
			SaveCust();
		});
		/*** script for address book ***/
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