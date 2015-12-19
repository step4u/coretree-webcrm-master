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
	<!--
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-touch.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.js"></script>
    -->
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-touch.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-animate.js"></script>

    <script src="http://ui-grid.info/docs/grunt-scripts/csv.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/pdfmake.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/vfs_fonts.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/3.0.7/ui-grid.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/3.0.7/ui-grid.min.css" rel="stylesheet" />
    <style>
		.grid {
			width: 100%;
			height: 30px;
		}
		
		.grid .ui-grid-header-cell {
 			height: 35px !important;
		}
		
		// .white { color: white; background-color:black !important; text-align: center; }
		.white { text-align: center }
		
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
		$(function(){
			$('[data-toggle="tooltip"]').tooltip();
		});
		
		$(function () {
		    $('#leftsidemenu .navbar-toggle').click(function () {
	        	$('#leftsidemenu .navbar-nav').toggleClass('slide-in');
		        $('.side-body').toggleClass('body-slide-in');
		        // $('#search').removeClass('in').addClass('collapse').slideUp(200);

		        /// uncomment code for absolute positioning tweek see top comment in css
		        //$('.absolute-wrapper').toggleClass('slide-in');
		        
		    });
		   
		   // Remove menu for searching
		   /*
		   $('#search-trigger').click(function () {
		        $('.navbar-nav').removeClass('slide-in');
		        $('.side-body').removeClass('body-slide-in');

		        /// uncomment code for absolute positioning tweek see top comment in css
		        //$('.absolute-wrapper').removeClass('slide-in');

		    });
		   */
		});
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
                    <li class="active"><a href="#">주소록</a></li>
                    <li class="divider-vertical"></li>
                    <li><a href="/call">통화내역</a></li>
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
		<div class="row">
		    <!-- uncomment code for absolute positioning tweek see top comment in css -->
		    <!-- <div class="absolute-wrapper"> </div> -->
		    <!-- Menu -->
		    <div id="leftsidemenu" class="side-menu">
		    
			    <nav class="navbar navbar-default">
				    <!-- Brand and toggle get grouped for better mobile display -->
			    
			    	<div class="navbar-header">
			        	<div class="brand-wrapper">
			            	<!-- Hamburger -->

			            	<button type="button" class="navbar-toggle">
			                	<span class="sr-only"></span>
			                	<span class="icon-bar"></span>
			                	<span class="icon-bar"></span>
			                	<span class="icon-bar"></span>
			            	</button>
			
			            	<!-- Brand -->
			            	<div class="brand-name-wrapper">
				                <a class="navbar-brand" href="#">Address Book</a>
			            	</div>
			
			            	<!-- Search -->
			            	<!-- 
			            	<a data-toggle="collapse" href="#search" class="btn btn-default" id="search-trigger">
			                	<span class="glyphicon glyphicon-search"></span>
			            	</a>
			             	-->
			
				            <!-- Search body -->
				            <!-- 
				            <div id="search" class="panel-collapse collapse">
				                <div class="panel-body">
				                    <form class="navbar-form" role="search">
				                        <div class="form-group">
				                            <input type="text" class="form-control" placeholder="Search">
				                        </div>
				                        <button type="submit" class="btn btn-default "><span class="glyphicon glyphicon-ok"></span></button>
				                    </form>
				                </div>
				            </div>
				             -->
				        </div>
			    	</div>
			    
				    <!-- Main Menu -->
				    <div class="side-menu-container">
				        <ul class="nav navbar-nav">
				 			<li class="tools">
				 				<span class="glyphicon glyphicon-plus" data-toggle="tooltip" data-placement="bottom" title="Add"></span>
				 				<span class="glyphicon glyphicon-pencil" data-toggle="tooltip" data-placement="bottom" title="Edit"></span>
				 				<span class="glyphicon glyphicon-minus" data-toggle="tooltip" data-placement="bottom" title="Delete"></span>
				 			</li>
			
				            <!-- Dropdown-->
				            <li class="panel panel-default" id="dropdown">
				                <a href="#dropdown-lv1-1">
				                    <span class="glyphicon glyphicon-user"></span> 공용주소록<span class="caret"></span>
				                </a>
				
				                <div id="dropdown-lvl-1" class="panel-collapse collapse">
				                    <div class="panel-body">
				                        <ul class="nav navbar-nav">
				                            <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span> 거래처</a></li>
				                            <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span> 협력업체</a></li>
				                            <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span> 고객</a></li>
				                        </ul>
				                    </div>
				                </div>
				                
				                <a href="#dropdown-lvl-2">
				                    <span class="glyphicon glyphicon-user"></span> 개인주소록<span class="caret"></span>
				                </a>
				                
				                <div id="dropdown-lvl-2" class="panel-collapse collapse in">
				                    <div class="panel-body">
				                        <ul class="nav navbar-nav">
				                            <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span> 거래처</a></li>
				                            <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span> 협력업체</a></li>
				                            <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span> 고객</a></li>
				                        </ul>
				                    </div>
				                </div>
				            </li>
				
				            <li class="tools">
				            	<span class="glyphicon glyphicon-plus" data-toggle="tooltip" data-placement="bottom" title="Add"></span>
				 				<span class="glyphicon glyphicon-pencil" data-toggle="tooltip" data-placement="bottom" title="Edit"></span>
				 				<span class="glyphicon glyphicon-minus" data-toggle="tooltip" data-placement="bottom" title="Delete"></span>
				            </li>
				
				        </ul>
				    </div><!-- /.navbar-collapse -->
				</nav>
		    
	    	</div>
		
		<!-- Main Content -->
	        <div class="side-body" ng-controller="MainCtrl">
	           <h1>주소록</h1>
	           <div style="width: 100%; text-align: right; padding-right: 30px; padding-bottom: 10px;">
	           		<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalAdd">추가</button>
	           </div>
				<div>
				      <div id="grid1" ui-grid="gridOptions" ui-grid-pagination class="grid"></div>
				</div>
	        </div>
	        <div>dasdsdfsdfsdasdsdfsdfsdasdsdfsdfsdasdsdfsdfsdasdsdfsdfs</div>
	    
		</div>
    </div>

    <footer class="footer">
      <div class="container">
        <p class="text-muted">© Copyright 2015 Coretree Corp. All Rights Reserved.</p>
      </div>
    </footer>
    
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
  
	<script src="<%= cp %>/resources/apps/app_call.js"></script>
	<script src="<%= cp %>/resources/apps/controller.js"></script>

</body>
</html>
