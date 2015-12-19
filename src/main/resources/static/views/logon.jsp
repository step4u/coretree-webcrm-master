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
			height: 660;
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
		<div id="page-wrapper">
			<div class="row">
				<form method=post action="/CRM" role="form" class="form-vertical">
					<div class="form-group">
		       			<label for="userid">아이디 : </label>
		       			<input type="text" id="userid" name="userid" class="form-control" />
		       			<label for="userpwd">비밀번호 : </label>
		       			<input type="password" id="userpwd" name="userpwd" class="form-control" />
						<input type="submit" class="btn btn-info" value="로그인">
		    		</div>
				</form>
			</div>
		</div>
	</div>

</body>
</html>
