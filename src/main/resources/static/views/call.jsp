<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<% String cp = request.getContextPath(); %>
<html ng-app="app">
<head>
	<title>CRM with IPCC - Coretree</title>
  	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="<%= cp %>/resources/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link href="<%= cp %>/resources/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="<%= cp %>/resources/css/leftsidebar.css" rel="stylesheet" />
	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="<%= cp %>/resources/bootstrap/js/bootstrap.min.js"></script>

	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-touch.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.js"></script>

    <!-- 
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-touch.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-animate.js"></script>
     -->

    <script src="http://ui-grid.info/docs/grunt-scripts/csv.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/pdfmake.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/vfs_fonts.js"></script>
    
    <script src="http://ui-grid.info/release/ui-grid.js"></script>
    <link rel="stylesheet" href="http://ui-grid.info/release/ui-grid.css" type="text/css">
    
    <style>
		.grid {
			width: 100%;
			height: 30px;
		}

		.grid .ui-grid-header-cell {
 			height: 35px;
		}
	
		// .white { color: white; background-color:black !important; text-align: center; }
		.white {
			text-align: center;
		}
		
		/* Sticky footer styles
		-------------------------------------------------- */
		html {
		  position: relative;
		  min-height: 100%;
		}
		body {
		  /* Margin bottom by footer height */
		  margin-bottom: 60px;
		}
		.footer {
		  position: absolute;
		  bottom: 0;
		  width: 100%;
		  /* Set the fixed height of the footer here */
		  height: 60px;
		  background-color: #f5f5f5;
		}
		
		
		/* Custom page CSS
		-------------------------------------------------- */
		/* Not required for template or sticky footer method. */
		
		body > .container {
		  padding: 60px 15px 0;
		}
		.container .text-muted {
		  margin: 20px 0;
		}
		
		.footer > .container {
		  padding-right: 15px;
		  padding-left: 15px;
		}
		
		code {
		  font-size: 80%;
		}
	
		.modal label {
			margin-left: 10px;
		}
		
		.grid-cell-align {
			text-align: center;
			vertical-align: middle !important;
			padding-top: 2px;
		}
		.grid-cell {
			text-align: center;
		}
    </style>
	<script>

	</script>
</head>
<body>
	<nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Coretree</a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li><a href="/addressbook">주소록</a></li>
                    <li class="divider-vertical"></li>
                    <li class="active" ><a href="#">통화내역</a></li>
                    <li class="divider-vertical"></li>
                    <li><a href="#">SMS내역</a></li>
                    <li class="divider-vertical"></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#">로그아웃</a></li>
                </ul>
            </div>
        </div>
    </nav>
    
    <div class="container body-content">
		<!-- Main Content -->
	    <div class="container">
			<div>
	           <h1>통화내역</h1>
				<div ng-controller="MainCtrl">
				      <div ui-grid="gridOptions" class="grid"></div>
				</div>
	        </div>
	    </div>
    </div>

    <footer class="footer">
      <div class="container">
        <p class="text-muted">© Copyright 2015 Coretree Corp. All Rights Reserved.</p>
      </div>
    </footer>
    
    <!-- Modal -->
  <div class="modal fade" id="modalView" role="dialog">
    <div class="modal-dialog">
    
	<!-- Modal content-->
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">&times;</button>
			<h4 class="modal-title">알림</h4>
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
          <button type="button" class="btn btn-primary" data-dismiss="modal">닫기</button>
        </div>
      </div>
      
    </div>
  </div>

	<script src="<%= cp %>/resources/apps/app_call.js"></script>
	<script src="<%= cp %>/resources/apps/controller.js"></script>
</body>
</html>
