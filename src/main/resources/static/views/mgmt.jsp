<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<% String cp = request.getContextPath(); %>
<html ng-app="app" ng-controller="RouteControll">
<head>
	<title>CRM with IPCC - Coretree</title>
  	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
		.grid {
			width: 100%;
			height: 670;
		}
		.grid_tels {
			width: 100%;
			height: 760;
		}
		
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
    </style>
    <script>
		$(function(){
			$('[data-toggle="tooltip"]').tooltip();
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
			</div>
			<div class="collapse navbar-collapse navbar-ex1-collapse">
			    <ul id="active" class="nav navbar-nav side-nav" style="visibility: collapse;">
			        <li class="selected"><a href="#"> 공용주소록</a></li>
			        <li class="subgroup"><a href="#"> 협력업체</a></li>
			        <li class="subgroup"><a href="#"> 거래처</a></li>
			        <li class="subgroup"><a href="#"> 고객</a></li>
			    </ul>
			    <ul class="nav navbar-nav navbar-left navbar-user">

                    <li class="dropdown user-dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"> 주소록</a>
                        <ul class="dropdown-menu">
                            <li><a href="#"> 공용 주소록</a></li>
                            <li class="divider"></li>
                            <li><a href="#"> 개인 주소록</a></li>
                        </ul>
                    </li>
                    <li>
                    	<a href="/call"> 통화내역</a>
                    </li>
                    <li>
                    	<a href="/sms"> SMS내역</a>
                    </li>
                    <li>
                    	<a href="#"> 녹취내역</a>
                    </li>
                    <li>
                    	<a href="#"> 상담원관리</a>
                    </li>
		        </ul>
			    <ul class="nav navbar-nav navbar-right navbar-user">
			    	<li class="dropdown user-dropdown">
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
			    	<li class="dropdown">
						<a href="#">시스템정상(8001)</a>
		        	</li>
			    	<li class="dropdown">
						<a href="#"> 로그아웃</a>
		        	</li>
					<!-- <li class="divider-vertical"></li> -->
			    </ul>
			</div>
		</nav>
		
	    <div id="page-wrapper">
			<div class="row">
				<div class="col-lg-9" style="margin-bottom: 50px;">
                    <div class="alert alert-dismissable alert-info">
                        <!-- <button data-dismiss="alert" class="close" type="button">&times;</button> -->
                        Welcome to the CRM for ThinkBox Cloud.
                        <br />
                        You can see a information of Telephony in this box.
                    </div>
					<div id="maincontents" ng-view></div>
					<!-- 
					<div ng-controller="CtrlRecord">
						<div ui-grid="gridOptions" ui-grid-selection ui-grid-pagination class="grid"></div>
					</div>
					 -->
					<!-- 
					<div style="text-align: right; margin: 10px 0 40px 0;">
		           		<button type="button" class="btn btn-warning btn-sm" data-toggle="modal">삭제</button>
		           	</div>
					<div ng-controller="CtrlStatistic">
						<div ui-grid="gridOptions" ui-grid-selection ui-grid-pagination class="grid"></div>
					</div>
		           	 -->
	        	</div>
		        <div class="col-lg-3">
		        	<div class="form-inline form-group" style="margin-bottom: 10px; text-align: right;">
						<input type="text" id="innertelnum" class="form-control" placeholder="전화번호 / 내선번호" style="width: 170px;" />
	        			<button type="button" for="innertelnum" class="btn btn-primary btn-sm">연결</button> 
		        	</div>
					<div ng-controller="CtrlTelStatus">
						<div ui-grid="gridOptions" class="grid_tels"></div>
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
	</div>
    
	<!-- Modal -->
	<div class="modal fade" id="modalAdd" role="dialog">
    	<div class="modal-dialog">
    
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">주소추가</h4>
				</div>
				<div class="modal-body">
					<form role="form" class="form-inline">
						<div class="form-group">
		          			<label for="group">그룹 : </label>
		          			<select id="group" class="form-control">
					    		<option>::선택::</option>
					    		<option>거래처</option>
					    		<option>협력업체</option>
					    		<option>고객</option>
					    	</select>
					    	<label for="firm">회사 : </label>
					    	<input type="text" class="form-control" id="firm" placeholder="회사명" />
			    		</div>
			    		<br/><br/>
			    		<div class="form-group">
				    		<label for="custname">이름 : </label>
				    		<input type="text" class="form-control" id="custname" placeholder="이름" />
							<label for="custtitle">직함 : </label>
				    		<input type="text" class="form-control" id="custtitle" placeholder="직함" />
			    		</div>
			    		<br/><br/>
			    		<div class="form-group">
			    			<label for="telnum">전화번호 : </label>
				    		<input type="text" class="form-control" id="telnum" placeholder="전화번호" />
				    		<label for="cellular">휴대전화 : </label>
				    		<input type="text" class="form-control" id="cellular" placeholder="휴대전화" />
			    		</div>
			    		<br/><br/>
			    		<div class="form-group">
			    			<label for="innertel">내선번호 : </label>
				    		<input type="text" class="form-control" id="innertel" placeholder="내선번호" />
				    		<label for="email">이메일 : </label>
				    		<input type="text" class="form-control" id="email" placeholder="이메일" />
			    		</div>
			    		<br/><br/>
			    		<div class="form-group">
			    			<label for="addr">주소 : </label>
				    		<input type="text" class="form-control" id="addr" placeholder="주소" />
			    		</div>
	          		</form>
	        	</div>
	        	<div class="modal-footer">
	          		<button type="button" class="btn btn-warning" data-dismiss="modal">저장</button>
	          		<button type="button" class="btn btn-primary" data-dismiss="modal">닫기</button>
	        	</div>
			</div>
		</div>
	</div>

	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <link href="<%= cp %>/resources/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link href="<%= cp %>/resources/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet" />
	<script src="<%= cp %>/resources/bootstrap/js/bootstrap.min.js"></script>

	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-touch.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-route.min.js"></script>

    <script src="<%= cp %>/resources/angularjs/grid-ui/grunt-scripts/csv.js"></script>
    <script src="<%= cp %>/resources/angularjs/grid-ui/grunt-scripts/pdfmake.js"></script>
    <script src="<%= cp %>/resources/angularjs/grid-ui/grunt-scripts/vfs_fonts.js"></script>

	<script src="<%= cp %>/resources/angularjs/grid-ui/3.0.7/ui-grid.min.js"></script>
    <link href="<%= cp %>/resources/angularjs/grid-ui/3.0.7/ui-grid.min.css" rel="stylesheet" />
	<link rel="stylesheet" ng-href="<%= cp %>/resources/css/{{css}}" />
		
	<script src="<%= cp %>/resources/apps/app.js"></script>
	<script src="<%= cp %>/resources/apps/controller.js"></script>

</body>
</html>
