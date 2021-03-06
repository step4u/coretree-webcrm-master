<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<% String cp = request.getContextPath(); %>
<html ng-app="app" ng-controller="BaseController">
<head>
	<title>CRM with IPCC - Coretree</title>
  	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1">
  	
 	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <link rel="stylesheet" href="<%= cp %>/resources/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="<%= cp %>/resources/bootstrap/css/bootstrap-theme.min.css" />
	<script src="<%= cp %>/resources/bootstrap/js/bootstrap.min.js"></script>

	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-touch.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-route.min.js"></script>

    <script src="<%= cp %>/resources/angularjs/grid-ui/grunt-scripts/csv.js"></script>
    <script src="<%= cp %>/resources/angularjs/grid-ui/grunt-scripts/pdfmake.js"></script>
    <script src="<%= cp %>/resources/angularjs/grid-ui/grunt-scripts/vfs_fonts.js"></script>

	<script src="<%= cp %>/resources/angularjs/grid-ui/3.0.7/ui-grid.min.js"></script>
    <link rel="stylesheet" href="<%= cp %>/resources/angularjs/grid-ui/3.0.7/ui-grid.min.css" />

	<script src="<%= cp %>/resources/apps/app.js"></script>
	<script src="<%= cp %>/resources/apps/controller.js"></script>
	
    <link rel="stylesheet" href="<%= cp %>/resources/css/simple-sidebar.css" />
	<!-- <link rel="stylesheet" ng-href="<%= cp %>/resources/css/{{css}}" /> -->
	
    <style>
		.grid {
			width: 100%;
			height: 670;
		}
		.grid_teller_status {
			width: 100%;
			height: 90;
		}
		.grid_tels {
			width: 100%;
			height: 700;
		}
		.grid_teller_status .ui-grid-contents-wrapper,
		.grid_tels .ui-grid-contents-wrapper,
		.grid .ui-grid-contents-wrapper {
 			height: 35px !important;
		}
		
		// .white { color: white; background-color:black !important; text-align: center; }
		.white { text-align: center; }
		.grid-cell { text-align: center; }
		.grid-cell-align { text-align: center; padding-top: 3px; }
		
		.subgroup {
			padding-left: 20px;
		}
		.alert {
			text-align: center;
			font-size: 17px;
		}
		.header-filtered {
			color: blue;
		}
		
		#page-wrapper {
			width: 100%;
			padding: 75px 30px 50px 30px;
		}
		
		@media (min-width:768px) {
			#page-wrapper {
				padding: 75px 30px 50px 30px;
			}
			
			.navbar-nav {
				float: left;
				margin: 0;
			}
			.navbar-nav > li {
				float: left;
			}
			.navbar-nav > li > a {
				padding-top: 15px;
				padding-bottom: 15px;
			}
			.navbar-nav .navbar-right:last-child {
				margin-right: -15px;
			}
			.navbar-left {
				float: left !important;
			}
			.navbar-right {
				float: right !important;
			}
		}
    </style>
	<script>
		$(document).ready(function(){
			$('[data-toggle="tooltip"]').tooltip();
			
			$('a').click(function(event){
				var str = this.toString();
				str = str.split('/#/');
				// alert(str.length);
				if (str.length < 2)
					event.preventDefault();
			});
			
		    $("#menu-toggle").click(function(e) {
		        e.preventDefault();
		        $("#wrapper").toggleClass("toggled");
		    });
		    
		    $("#publicaddr").click(function(e){
		    	e.preventDefault();
		    	console.log('publicaddr clicked');
		    	location.href="#/mgmt/addr";
		    });
		    $("#personaladdr").click(function(e){
		    	e.preventDefault();
		    	console.log('personaladdr clicked');
		    	location.href="#/mgmt/addr";
		    });
		});
	</script>
</head>
<body>
    <div id="wrapper">
		<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div class="navbar-header">
			    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
			        <span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			    </button>
			    <a class="navbar-brand" href="/">Coretree</a>
			    <button type="button" class="navbar-toggle" id="menu-toggle">
			        <span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			    </button>
			    <!-- <a href="#menu-toggle" class="btn btn-default">Toggle Menu</a> -->
			</div>
			<div class="collapse navbar-collapse navbar-ex1-collapse">
				<!-- 
			    <ul id="active" class="nav navbar-nav side-nav">
			        <li class="selected"><a href="#"> 공용주소록</a></li>
			        <li class="subgroup"><a href="#"> 협력업체</a></li>
			        <li class="subgroup"><a href="#"> 거래처</a></li>
			        <li class="subgroup"><a href="#"> 고객</a></li>
			    </ul>
			    <ul class="nav navbar-nav navbar-left navbar-user">
                    <li class="dropdown user-dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"> 주소록</a>
                        <ul class="dropdown-menu">
                            <li><a href="#/mgmt/addr1"> 공용 주소록</a></li>
                            <li class="divider"></li>
                            <li><a href="#/mgmt/addr2"> 개인 주소록</a></li>
                        </ul>
                    </li>
                    <li>
                    	<a href="#/mgmt/call"> 통화내역</a>
                    </li>
                    <li>
                    	<a href="#/mgmt/sms"> SMS내역</a>
                    </li>
                    <li id="li_record">
                    	<a href="#/mgmt/record"> 녹취내역</a>
                    </li>
                    <li id="li_counsellor">
                    	<a href="#/mgmt/counsellor"> 상담원관리</a>
                    </li>
		        </ul>
		         -->
			    <ul class="nav navbar-nav navbar-right">
			    	<li class="dropdown" id="currentstatus">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-plus-sign"></span> 대기중</a>
                        <ul class="dropdown-menu">
                        	<li class="dropdown-header">현재상태 설정</li>
                            <li class="divider"></li>
                            <li><a href="#"><span class="glyphicon glyphicon-plus-sign"></span> 대기중</a></li>
                            <li><a href="#"><span class="glyphicon glyphicon-ok-sign"></span> 통화중</a></li>
                            <li><a href="#"><span class="glyphicon glyphicon-minus-sign"></span> 자리비움</a></li>
                            <li><a href="#"><span class="glyphicon glyphicon-remove-sign"></span> 수신거부</a></li>
                        </ul>
                    </li>
			    	<li class="dropdown" id="systeminfo">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown"> 시스템 정상 (8001)</a>
                        <ul class="dropdown-menu">
                        	<li class="dropdown-header">시스템 정보</li>
                            <li class="divider"></li>
                            <li><a href="#"> 디스크용량 : 565GB</a></li>
                            <li><a href="#"> 금일 통화 : 476건</a></li>
                            <li><a href="#"> 주간 통화 : 2223건</a></li>
                            <li><a href="#"> 전체 통화  : 5655789건</a></li>
                        </ul>
		        	</li>
			    	<li class="dropdown">
						<a href="#"> 로그아웃</a>
		        	</li>
					<!-- <li class="divider-vertical"></li> -->
			    </ul>
			</div>
		</nav>
		
		<!-- Sidebar -->
        <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
            	<!-- 
                <li class="sidebar-brand">
                    <a href="#">
                        Start Bootstrap
                    </a>
                </li>
                 -->
                <li>
                    <a href="#">주소록</a>
                </li>
                <li>
                	<ul style="list-style: none; margin: 0; padding-left: 15px;">
                		<li>
                			<a href="#collapse1" data-toggle="collapse" id="publicaddr">공용 주소록 </a>
                		</li>
                		<li id="collapse1" class="panel-collapse collapse">
                			<ul style="list-style: none; margin: 0; padding-left: 25px;">
                				<li><a href="#">협력업체</a></li>
                				<li><a href="#">거래처</a></li>
                				<li><a href="#">고객</a></li>
                			</ul>
                		</li>
            		<li>
                			<a href="#collapse2" data-toggle="collapse" id="personaladdr">개인 주소록</a>
                		</li>
                		<li id="collapse2" class="panel-collapse collapse">
                			<ul style="list-style: none; margin: 0; padding-left: 25px;">
                				<li><a href="#">협력업체</a></li>
                				<li><a href="#">거래처</a></li>
                				<li><a href="#">고객</a></li>
                			</ul>
                		</li>
                	</ul>
                </li>
                <li>
                    <a href="#/mgmt/call">통화내역</a>
                </li>
                <li>
                    <a href="#/mgmt/sms">SMS내역</a>
                </li>
                <li>
                    <a href="#/mgmt/record">녹취내역</a>
                </li>
                <li>
                    <a href="#/mgmt/counsellor">상담원관리</a>
                </li>
            </ul>
        </div>
        <!-- /#sidebar-wrapper -->

		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-9" style="margin-bottom: 50px;">
                    <div class="alert alert-dismissable alert-info">
                        <!-- <button data-dismiss="alert" class="close" type="button">&times;</button> -->
                        Welcome to the CRM for ThinkBox Cloud.
                        <br />
                        You can see a information of Telephony in this box.
                    </div>
					<div ng-view></div>
	        	</div>
		        <div class="col-lg-3">
		        	<div ng-controller="CtrlCallStatus" id="ctrlcallstat">
		        		<div ui-grid="gridOptions" class="grid_teller_status"></div>
		        		<!-- <button type="button" class="btn btn-primary btn-sm" id='scopetest'>테스트</button> -->
		        	</div>
					<div ng-controller="CtrlTelStatus" style="margin-top: 15px;">
						<div ui-grid="gridOptions" class="grid_tels"></div>
					</div>
		        </div>
			</div>
		</div>
    </div>

<!-- 
    <footer class="footer">
      <div class="container">
        <p class="text-muted">© Copyright 2015 Coretree Corp. All Rights Reserved.</p>
      </div>
    </footer>
 -->
 
</body>
</html>
