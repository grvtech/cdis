

/*
 * GLOBAL varaibles
 * 
 * */

var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
name = $( "#nameUser" );
email = $( "#emailUser" );
message = $( "#messageUser" );
admin = $("#adminUser");
tips = $( ".validateTips" );
var imsg = "All form fields are required.";
var validPassword = false;
var validCPassword = false;
var validPasswordr = false;
var validCPasswordr = false;
var resetParam = getParameterByName("rst");
var confirmParam = getParameterByName("confirm");


/*
 * EVENT definitions
 * 
 * */
//submit on enter when focus on password field
$("#pass").on("keyup",function(e){if(e.keyCode == 13){$("#loginbutton").click();}});
//submit on enter when focus on login button
$('#loginbutton').on('keypress', function(e) {if(e.keyCode==13){$(this).click();}});
$("#loginbutton").on("click",login);
$("#passwordSub").on("focus",function() {$("#passwordmessage").css("display","block");});
$("#passwordSub").on("blur",function() {$("#passwordmessage").css("display","none");});
$("#cpasswordSub").on("focus",function() {$("#cpasswordmessage").css("display","block");});
$("#cpasswordSub").on("blur",function() {$("#cpasswordmessage").css("display","none");});
$("#passwordSub").on("keyup",validatePasswordSubscription);
$("#cpasswordSub").on("keyup",validatePasswordConfirmSubscription);
$("#passwordrRes").on("focus",function() {$("#passwordrmessage").css("display","block");});
$("#passwordrRes").on("blur",function() {$("#passwordrmessage").css("display","none");});
$("#cpasswordrRes").on("focus",function() {$("#cpasswordrmessage").css("display","block");});
$("#cpasswordrRes").on("blur",function() {$("#cpasswordrmessage").css("display","none");})
$("#passwordrRes").on("keyup",validatePasswordReset);
$("#cpasswordrRes").on("keyup",validatePasswordConfirmReset);
$(".forgotButton").on("click",function (){$("#dialog-forgot").dialog("open");});
$(".subscribeButton").on("click",function (){$("#dialog-subscribe").dialog("open");});


/*
 * MAIN SECTION
 * */
getFrontPageMessage();
$("#user").focus();

/*
 * Define forgot dialog
 * */
$("#dialog-forgot").dialog({autoOpen: false,resizable: false,height: 320,width: 500,modal: true,
    buttons: {
    	Cancel: function() {$( this ).dialog( "close" );},
    	"Reset Password": function() {forgotPassword(formForgot[0]);}
    },
    close: function() {formForgot[ 0 ].reset();$(".mf").removeClass( "ui-state-error" );tips.text(imsg);}
});
var formForgot = $("#dialog-forgot").find( "form" ).on( "submit", function( event ) {event.preventDefault();forgotPassword();});

/*
 * Define subscribe dialog
 * */
$("#dialog-subscribe").dialog({autoOpen: false,resizable: false,height: 850,width: 420,modal: true,
	  buttons: {
	    Cancel: function() {$( this ).dialog( "close" );},
	    "Subscribe to CDIS": function() {subscribe();}
	  },
	  close: function() {$("#dialog-subscribe").find( "form" ).trigger("reset");resetFormStyles("subscribe");$(".mf").removeClass( "ui-state-error" );}
});
var formSubscribe = $("#dialog-subscribe").find( "form" ).on( "submit", function( event ) {event.preventDefault();subscribe();});

/*
 * Define reset password dialog
 * */
$("#dialog-reset").dialog({autoOpen: false,resizable: false,height: 650,width: 420,modal: true,
	buttons: [{id:"resetButtonDialog",text:"Reset Password",click: function() {resetPassword();}}],
	close: function() {$("#dialog-reset").find( "form" ).trigger("reset");resetFormStyles("reset");$(".mf").removeClass( "ui-state-error" );}
});
var formReset = $("#dialog-reset").find( "form" ).on( "submit", function( event ) {event.preventDefault();resetPassword();});


if(resetParam == "1"){
	var iu = getParameterByName("iduser");
	var u = getUser(iu);
	
	if(u.reset == "1"){
		$("#dialog-reset").dialog("open");
		$("#usernameRes").val(u.username);
		$("#iduserRes").val(u.iduser);
		
	}else{
		var bconfig = {"width":"300","height":"250"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>The user did not initiated password reset.</b><br>Please contact CDIS administrator or send an email to support@grvtech.ca to initiate the reset of the password!</center></p>";
		showGRVPopup("CDIS Reset Password",txt,bbut,bconfig);

	}
	
}

if(confirmParam == "1"){
	var iu = getParameterByName("iduser");
	var u = getUser(iu);
	if(u.confirmmail == "1"){
		var data = "language=en&iduser="+iu;
		$.ajax({
  		  url: "/ncdis/service/action/confirmUserEmail?language=en&iduser="+iu,
  		  type: "POST",
  		  async : false,
  		  cache : false,
  		  data : data,
  		  dataType: "json"
  		}).done(function( json ) {
  			if(json.status == "1"){
  				var bconfig = {"width":"300","height":"250"};
  				var bbut = [{"text":"Close","action":"gti"}];
  				var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Email confirmed with succes.</b></center></p>";
  				showGRVPopup("CDIS Email Confirm",txt,bbut,bconfig);
  			}
  		}).fail(function( jqXHR, textStatus ) {
  		  alert( "Error sending message : " + textStatus );
  		});
	}else{
		var bconfig = {"width":"300","height":"250"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>The user has already confirmed email.</b></center></p>";
		showGRVPopup("CDIS Email Confirm",txt,bbut,bconfig);

	}
}



/*
 * FUNCTIONS
 * */

function validatePasswordSubscription() {
	  // Validate lowercase letters
	  var vL = vC = vN = vLen = false;
	  var lcLetters = new RegExp(/[a-z]/g);
	  if(lcLetters.test($(this).val())){
		  $("#passletter").removeClass("invalid");
		  $("#passletter").addClass("valid");
		  vL = true;
	  }else{
		  $("#passletter").removeClass("valid");
		  $("#passletter").addClass("invalid");
	  }
	  
	  // Validate capital letters
	  var upperCaseLetters = new RegExp(/[A-Z]/g);
	  if(upperCaseLetters.test($(this).val())) {
		  $("#passcapital").removeClass("invalid");
		  $("#passcapital").addClass("valid");
		  vC = true;
	  }else{
		  $("#passcapital").removeClass("valid");
		  $("#passcapital").addClass("invalid");
	  }

	  // Validate numbers
	  var numbers = new RegExp(/[0-9]/g);
	  if(numbers.test($(this).val())) {
		  $("#passnumber").removeClass("invalid");
		  $("#passnumber").addClass("valid");
		  vN = true;
	  }else{
		  $("#passnumber").removeClass("valid");
		  $("#passnumber").addClass("invalid");
	  }

	  // Validate length
	  if($(this).val().length >= 8) {
		  $("#passlength").removeClass("invalid");
		  $("#passlength").addClass("valid");
		  vLen = true;
	  }else{
		  $("#passlength").removeClass("valid");
		  $("#passlength").addClass("invalid");
	  }
	  
	  if(vL && vC && vN && vLen) validPassword = true;
}

function validatePasswordConfirmSubscription() {
	if($(this).val() === $("#passwordSub").val() && $(this).val().length > 0){
		$("#passconfirm").removeClass("invalid");
		$("#passconfirm").addClass("valid");
		validCPassword = true;
	}else{
		$("#passconfirm").removeClass("valid");
		$("#passconfirm").addClass("invalid");
		validCPassword = false;
	}
}

function resetFormStyles(formName){
	if(formName == "subscribe"){
		$("#passletter").removeClass("valid");
		$("#passletter").addClass("invalid");
		$("#passcapital").removeClass("valid");
		$("#passcapital").addClass("invalid");
		$("#passnumber").removeClass("valid");
		$("#passnumber").addClass("invalid");
		$("#passlength").removeClass("valid");
		$("#passlength").addClass("invalid");
		$("#passconfirm").removeClass("valid");
		$("#passconfirm").addClass("invalid");
	}else if(formName == "reset"){
		$("#passrletter").removeClass("valid");
		$("#passrletter").addClass("invalid");
		$("#passrcapital").removeClass("valid");
		$("#passrcapital").addClass("invalid");
		$("#passrnumber").removeClass("valid");
		$("#passrnumber").addClass("invalid");
		$("#passrlength").removeClass("valid");
		$("#passrlength").addClass("invalid");
		$("#passrconfirm").removeClass("valid");
		$("#passrconfirm").addClass("invalid");
	}
}

function validatePasswordReset() {
	  // Validate lowercase letters
	  var vL = vC = vN = vLen = false;
	  var lcLetters = new RegExp(/[a-z]/g);
	  if(lcLetters.test($(this).val())){
		  $("#passrletter").removeClass("invalid");
		  $("#passrletter").addClass("valid");
		  vL = true;
	  }else{
		  $("#passrletter").removeClass("valid");
		  $("#passrletter").addClass("invalid");
	  }
	  
	  
	  // Validate capital letters
	  var upperCaseLetters = new RegExp(/[A-Z]/g);
	  if(upperCaseLetters.test($(this).val())) {
		  $("#passrcapital").removeClass("invalid");
		  $("#passrcapital").addClass("valid");
		  vC = true;
	  }else{
		  $("#passrcapital").removeClass("valid");
		  $("#passrcapital").addClass("invalid");
	  }

	  // Validate numbers
	  var numbers = new RegExp(/[0-9]/g);
	  if(numbers.test($(this).val())) {
		  $("#passrnumber").removeClass("invalid");
		  $("#passrnumber").addClass("valid");
		  vN = true;
	  }else{
		  $("#passrnumber").removeClass("valid");
		  $("#passrnumber").addClass("invalid");
	  }

	  // Validate length
	  if($(this).val().length >= 8) {
		  $("#passrlength").removeClass("invalid");
		  $("#passrlength").addClass("valid");
		  vLen = true;
	  }else{
		  $("#passrlength").removeClass("valid");
		  $("#passrlength").addClass("invalid");
	  }
	  
	  if(vL && vC && vN && vLen) validPasswordr = true;
}

function validatePasswordConfirmReset() {
	  if($(this).val() === $("#passwordrRes").val() && $(this).val().length > 0){
		  $("#passrconfirm").removeClass("invalid");
		  $("#passrconfirm").addClass("valid");
		  validCPasswordr = true;
	  }else{
		  $("#passrconfirm").removeClass("valid");
		  $("#passrconfirm").addClass("invalid");
		  validCPasswordr = false;
	  }
}

function forgotPassword() {
    var valid = true;
    $(".mf").removeClass( "ui-state-error" );
    
    if(!$("#fusername").prop("checked")){
		valid = valid && checkLength(  $( "#usernameUser" ), "Username" );
	}
    valid = valid && checkLength(  $( "#emailUser" ), "Email" );
    valid = valid && checkRegexp(  $( "#emailUser" ), emailRegex, "eg. name@domain.com" );


    if ( valid ) {
    	var data = "language=en"+"&usernameUser="+$("#usernameUser").val()+"&emailUser="+$("#emailUser").val()+"&fusername="+$("#fusername").prop("checked");
    	var mes = $.ajax({
    		  url: "/ncdis/service/action/forgotPassword",
    		  type: "POST",
    		  async : false,
    		  cache : false,
    		  data:data,
    		  dataType: "json"
    		});
    		mes.done(function( json ) {
    			if(json.status == "1"){
    				tips.html(json.message);
    				$("#subform").hide();
    			}else{
    				tips.html(json.message);
    			}
    			$( "#dialog-forgot" ).dialog( "option", "buttons", { "Return to CDIS Login Page": function() { gti(); } } );
    		});
    		mes.fail(function( jqXHR, textStatus ) {
    		  alert( "Error sending message : " + textStatus );
    		  formForgot[ 0 ].reset();
  			  $("#dialog-forgot").dialog( "close" );
    		});	

    } 
    return valid;
}

function subscribe() {
    var valid = true;
    $(".mf").removeClass( "ui-state-error" );
    valid = valid && checkLength(  $( "#firstnameSub" ), "First name" );
    valid = valid && checkLength(  $( "#lastnameSub" ), "Last name" );
    valid = valid && checkLength(  $( "#emailSub" ), "Email" );
    valid = valid && checkLength(  $( "#idcommunitySub" ), "User Community" );
    valid = valid && checkLength(  $( "#idprofesionSub" ), "Profession" );
    valid = valid && checkRegexp(  $( "#emailSub" ), emailRegex, "Email format should be : eg. name@domain.com" );


    if ( valid && validPassword && validCPassword) {
    	var mes = $.ajax({
    		  url: "/ncdis/service/action/subscribe?language=en&firstnameSub="+$("#firstnameSub").val()+"&lastnameSub="+$("#lastnameSub").val()+"&idcommunitySub="+$("#idcommunitySub").val()+"&emailSub="+$("#emailSub").val()+"&idprofesionSub="+$("#idprofesionSub").val()+"&passwordSub="+btoa($("#passwordSub").val()),
    		  type: "GET",
    		  async : false,
    		  cache : false,
    		  dataType: "json"
    		});
    		mes.done(function( json ) {
    			if(json.status == "1"){
    				tips.html(json.message);
    				$("#dialog-subscribe").find("fieldset").hide();
    				$( "#dialog-subscribe" ).dialog( "option", "buttons", { "Return to CDIS Login Page": function() { gti(); } } );
    			}else{
    				tips.html(json.message);
    			}
    		});
    		mes.fail(function( jqXHR, textStatus ) {
    		  alert( "Error sending message : " + textStatus );
    		  formSubscribe[ 0 ].reset();
  			  $("#dialog-subscribe").dialog( "close" );
    		});	

    }
    return valid;
 }

function updateTips( t ) {
    tips
      .text( t )
      .addClass( "ui-state-highlight" );
    setTimeout(function() {
      tips.removeClass( "ui-state-highlight", 1500 );
    }, 500 );
  }

function checkLength( o, n ) {
    if ( o.val().length == 0 || o.val() == '0') {
      o.addClass( "ui-state-error" );
      updateTips( "Field " + n + " cannot be empty." );
      return false;
    } else {
      return true;
    }
}

function checkRegexp( o, regexp, n ) {
    if ( !( regexp.test( o.val() ) ) ) {
      o.addClass( "ui-state-error" );
      updateTips( n );
      return false;
    } else {
      return true;
    }
}

function getFrontPageMessage(){
	var mes = $.ajax({
		  url: "/ncdis/service/action/getFrontPageMessage?language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		mes.done(function( json ) {
			message = json.objs[0].message;
			if(message != ""){
				$("#frontpage").html(message); 
				var contents = $("#frontpage").wrapInner('<div>').children(); // wrap a div around the contents
				var height = contents.outerHeight();
				$("#frontpage").animate({ scrollTop: height }, 8000);
				setTimeout(function() {$("#frontpage").animate({scrollTop:0}, 8000);},8000);
				setInterval(function(){
		     		$("#frontpage").animate({ scrollTop: height }, 8000);
					setTimeout(function() {
		   						$("#frontpage").animate({scrollTop:0}, 8000); 
								},8000);
				},16000);
			}else{
				$("#frontpage").hide();
			}
					
		});
		mes.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});	
}

function login() {
	var user = $("#user").val();
	var pass = $("#pass").val();
	var validUser = Validate.now(Validate.Presence, $("#user").val());
	var validPass = Validate.now(Validate.Presence, $("#pass").val());
	if(validUser && validPass){
		var request = $.ajax({
		  url: "/ncdis/service/action/loginSession?username="+user+"&password="+btoa(pass)+"&language=en&reswidth="+$(window).width()+"&resheight="+$(window).height(),
		  type: "GET",
		  dataType: "json"
		});
		request.done(function( json ) {
			
		  if(json.status == "0"){
			  $("#errortext").text(json.message);
		  }else{
			 userObj = json.objs[0];
			 sid = getSession(userObj.iduser);
			 //var ramq = $.cookie('ramq');
			 var ramq = null;
			 if((ramq != null) && (ramq != "")){
				 gtc(sid,"en",ramq,"patient");
			 }else{
				 gts(sid,"en");
			 }
			 /**/
		  }
		});
		request.fail(function( jqXHR, textStatus ) {
			$("#errortext").text("Wrong Username or Password");
		});
		
	}else{
		$("#errortext").text("Wrong Username or Password");
		
	}
}