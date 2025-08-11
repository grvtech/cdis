

/*
 * GLOBAL varaibles
 * 
 * */

var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
tips = $(".cdisValidateTips");
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
$("#grvPass").on("keyup",function(e){if(e.keyCode == 13){$("#grvLoginButton").click();}});
//submit on enter when focus on login button
$('#grvLoginButton').on('keypress', function(e) {if(e.keyCode==13){$(this).click();}});
$("#grvLoginButton").on("click",login);
$("#grvPasswordSubscribe").on("focus",function() {$("#grvPasswordMessage").css("display","block");});
$("#grvPasswordSubscribe").on("blur",function() {$("#grvPasswordMessage").css("display","none");});
$("#grvPasswordSubscribe").on("keyup",validatePasswordSubscription);

$("#grvPasswordSubscribeConfirm").on("focus",function() {$("#grvConfirmPasswordMessage").css("display","block");});
$("#grvPasswordSubscribeConfirm").on("blur",function() {$("#grvConfirmPasswordMessage").css("display","none");});
$("#grvPasswordSubscribeConfirm").on("keyup",validatePasswordConfirmSubscription);

$("#grvPasswordrReset").on("focus",function() {$("#grvPasswordrMessage").css("display","block");});
$("#grvPasswordrReset").on("blur",function() {$("#grvPasswordrMessage").css("display","none");});
$("#grvPasswordrReset").on("keyup",validatePasswordReset);
$("#grvConfirmPasswordrReset").on("focus",function() {$("#grvConfirmPasswordrMessage").css("display","block");});
$("#grvConfirmPasswordrReset").on("blur",function() {$("#grvConfirmPasswordrMessage").css("display","none");})
$("#grvConfirmPasswordrReset").on("keyup",validatePasswordConfirmReset);
$(".cdisForgotButton").on("click",function (){$("#grvDialogForgot").dialog("open");});
$(".cdisSubscribeButton").on("click",function (){$("#grvDialogSubscribe").dialog("open");});


/*
 * MAIN SECTION
 * */
getFrontPageMessage();
$("#user").focus();

/*
 * Define forgot dialog
 * */
$("#grvDialogForgot").dialog({autoOpen: false,resizable: false,height: 420,width: 500,modal: true,
    buttons: {
    	Cancel: function() {$( this ).dialog( "close" );},
    	"Reset Password": function() {forgotPassword(formForgot[0]);}
    },
    close: function() {formForgot[ 0 ].reset();tips.text(imsg);}
});
var formForgot = $("#grvDialogForgot").find( "form" ).on( "submit", function( event ) {event.preventDefault();forgotPassword();});

/*
 * Define subscribe dialog
 * */
$("#grvDialogSubscribe").dialog({autoOpen: false,resizable: false,height: 900,width: 420,modal: true,
	  buttons: {
	    Cancel: function() {$( this ).dialog( "close" );},
	    "Subscribe to CDIS": function() {subscribe();}
	  },
	  close: function() {$("#grvDialogSubscribe").find( "form" ).trigger("reset");resetFormStyles("subscribe");}
});
var formSubscribe = $("#grvDialogSubscribe").find( "form" ).on( "submit", function( event ) {event.preventDefault();subscribe();});

/*
 * Define reset password dialog
 * */
$("#grvDialogReset").dialog({autoOpen: false,resizable: false,height: 650,width: 420,modal: true,
	buttons: [{id:"resetButtonDialog",text:"Reset Password",click: function() {resetPassword();}}],
	close: function() {$("#grvDialogReset").find( "form" ).trigger("reset");resetFormStyles("reset");}
});
var formReset = $("#grvDialogReset").find( "form" ).on( "submit", function( event ) {event.preventDefault();resetPassword();});


if(resetParam == "1"){
	var iu = getParameterByName("iduser");
	var u = getUser(iu);
	
	if(u.reset == "1"){
		$("#grvDialogReset").dialog("open");
		$("#grvUsernameReset").val(u.username);
		$("#grvIdUserReset").val(u.iduser);
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
		  $("#grvPassLetter").removeClass("invalid");
		  $("#grvPassLetter").addClass("valid");
		  vL = true;
	  }else{
		  $("#grvPassLetter").removeClass("valid");
		  $("#grvPassLetter").addClass("invalid");
	  }
	  
	  // Validate capital letters
	  var upperCaseLetters = new RegExp(/[A-Z]/g);
	  if(upperCaseLetters.test($(this).val())) {
		  $("#grvPassCapital").removeClass("invalid");
		  $("#grvPassCapital").addClass("valid");
		  vC = true;
	  }else{
		  $("#grvPassCapital").removeClass("valid");
		  $("#grvPassCapital").addClass("invalid");
	  }

	  // Validate numbers
	  var numbers = new RegExp(/[0-9]/g);
	  if(numbers.test($(this).val())) {
		  $("#grvPassNumber").removeClass("invalid");
		  $("#grvPassNumber").addClass("valid");
		  vN = true;
	  }else{
		  $("#grvPassNumber").removeClass("valid");
		  $("#grvPassNumber").addClass("invalid");
	  }

	  // Validate length
	  if($(this).val().length >= 8) {
		  $("#grvPassLength").removeClass("invalid");
		  $("#grvPassLength").addClass("valid");
		  vLen = true;
	  }else{
		  $("#grvPassLength").removeClass("valid");
		  $("#grvPassLength").addClass("invalid");
	  }
	  
	  if(vL && vC && vN && vLen) validPassword = true;
}

function validatePasswordConfirmSubscription() {
	if($(this).val() === $("#grvPasswordSubscribe").val() && $(this).val().length > 0){
		$("#grvPassConfirm").removeClass("invalid");
		$("#grvPassConfirm").addClass("valid");
		validCPassword = true;
	}else{
		$("#grvPassConfirm").removeClass("valid");
		$("#grvPassConfirm").addClass("invalid");
		validCPassword = false;
	}
}

function resetFormStyles(formName){
	if(formName == "subscribe"){
		$("#grvPassLetter").removeClass("valid");
		$("#grvPassLetter").addClass("invalid");
		$("#grvPassCapital").removeClass("valid");
		$("#grvPassCapital").addClass("invalid");
		$("#grvPassNumber").removeClass("valid");
		$("#grvPassNumber").addClass("invalid");
		$("#grvPassLength").removeClass("valid");
		$("#grvPassLength").addClass("invalid");
		$("#grvPassConfirm").removeClass("valid");
		$("#grvPassConfirm").addClass("invalid");
	}else if(formName == "reset"){
		$("#grvPassrLetter").removeClass("valid");
		$("#grvPassrLetter").addClass("invalid");
		$("#grvPassrCapital").removeClass("valid");
		$("#grvPassrCapital").addClass("invalid");
		$("#grvPassrNumber").removeClass("valid");
		$("#grvPassrNumber").addClass("invalid");
		$("#grvPassrLength").removeClass("valid");
		$("#grvPassrLength").addClass("invalid");
		$("#grvPassrConfirm").removeClass("valid");
		$("#grvPassrConfirm").addClass("invalid");
	}
}

function validatePasswordReset() {
	  // Validate lowercase letters
	  var vL = vC = vN = vLen = false;
	  var lcLetters = new RegExp(/[a-z]/g);
	  if(lcLetters.test($(this).val())){
		  $("#grvPassrLetter").removeClass("invalid");
		  $("#grvPassrLetter").addClass("valid");
		  vL = true;
	  }else{
		  $("#grvPassrLetter").removeClass("valid");
		  $("#grvPassrLetter").addClass("invalid");
	  }
	  
	  
	  // Validate capital letters
	  var upperCaseLetters = new RegExp(/[A-Z]/g);
	  if(upperCaseLetters.test($(this).val())) {
		  $("#grvPassrCapital").removeClass("invalid");
		  $("#grvPassrCapital").addClass("valid");
		  vC = true;
	  }else{
		  $("#grvPassrCapital").removeClass("valid");
		  $("#grvPassrCapital").addClass("invalid");
	  }

	  // Validate numbers
	  var numbers = new RegExp(/[0-9]/g);
	  if(numbers.test($(this).val())) {
		  $("#grvPassrNumber").removeClass("invalid");
		  $("#grvPassrNumber").addClass("valid");
		  vN = true;
	  }else{
		  $("#grvPassrNumber").removeClass("valid");
		  $("#grvPassrNumber").addClass("invalid");
	  }

	  // Validate length
	  if($(this).val().length >= 8) {
		  $("#grvPassrLength").removeClass("invalid");
		  $("#grvPassrLength").addClass("valid");
		  vLen = true;
	  }else{
		  $("#grvPassrLength").removeClass("valid");
		  $("#grvPassrLength").addClass("invalid");
	  }
	  
	  if(vL && vC && vN && vLen) validPasswordr = true;
}

function validatePasswordConfirmReset() {
	  if($(this).val() === $("#grvPasswordrReset").val() && $(this).val().length > 0){
		  $("#grvPassrConfirm").removeClass("invalid");
		  $("#grvPassrConfirm").addClass("valid");
		  validCPasswordr = true;
	  }else{
		  $("#grvPassrConfirm").removeClass("valid");
		  $("#grvPassrConfirm").addClass("invalid");
		  validCPasswordr = false;
	  }
}

function forgotPassword() {
	
    var valid = true;
    
    if(!$("#grvForgotUsername").prop("checked")){
		valid = valid && checkLength(  $( "#grvUsernameUser" ), "Username" );
	}
    valid = valid && checkLength(  $( "#grvEmailUser" ), "Email" );
    valid = valid && checkRegexp(  $( "#grvEmailUser" ), emailRegex, "eg. name@domain.com" );

	
    if ( valid ) {
    	var data = "language=en"+"&usernameUser="+$("#grvUsernameUser").val()+"&emailUser="+$("#grvEmailUser").val()+"&fusername="+$("#grvForgotUsername").prop("checked");
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
    				$("#grvSubscribeForm").hide();
    			}else{
    				tips.html(json.message);
    			}
    			$( "#grvDialogForgot" ).dialog( "option", "buttons", { "Return to CDIS Login Page": function() { gti(); } } );
    		});
    		mes.fail(function( jqXHR, textStatus ) {
    		  alert( "Error sending message : " + textStatus );
    		  formForgot[ 0 ].reset();
  			  $("#grvDialogForgot").dialog( "close" );
    		});	

    } 
    return valid;
}

function subscribe() {
    var valid = true;

    valid = valid && checkLength(  $( "#grvFirstnameSubscribe" ), "First name" );
    valid = valid && checkLength(  $( "#grvLastnameSubscribe" ), "Last name" );
    valid = valid && checkLength(  $( "#grvEmailSubscribe" ), "Email" );
    valid = valid && checkLength(  $( "#grvIdcommunitySubscribe" ), "User Community" );
    valid = valid && checkLength(  $( "#grvIdprofesionSubscribe" ), "Profession" );
    valid = valid && checkRegexp(  $( "#grvEmailSubscribe" ), emailRegex, "Email format should be : eg. name@domain.com" );


    if ( valid && validPassword && validCPassword) {
    	var mes = $.ajax({
    		  url: "/ncdis/service/action/subscribe?language=en&firstnameSub="+$("#grvFirstnameSubscribe").val()+"&lastnameSub="+$("#grvLastnameSubscribe").val()+"&idcommunitySub="+$("#grvIdcommunitySubscribe").val()+"&emailSub="+$("#grvEmailSubscribe").val()+"&idprofesionSub="+$("#grvIdprofesionSubscribe").val()+"&passwordSub="+btoa($("#grvPasswordSubscribe").val()),
    		  type: "GET",
    		  async : false,
    		  cache : false,
    		  dataType: "json"
    		});
    		mes.done(function( json ) {
    			if(json.status == "1"){
    				tips.html(json.message);
    				$("#grvDialogSubscribe").find("fieldset").hide();
    				$( "#grvDialogSubscribe" ).dialog( "option", "buttons", { "Return to CDIS Login Page": function() { gti(); } } );
    			}else{
    				tips.html(json.message);
    			}
    		});
    		mes.fail(function( jqXHR, textStatus ) {
    		  alert( "Error sending message : " + textStatus );
    		  formSubscribe[ 0 ].reset();
  			  $("#grvDialogSubscribe").dialog( "close" );
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
			const container = $("#grvFrontpage");
			if(message != ""){
				container.html(message); 
				var contents = container.wrapInner('<div>').children(); // wrap a div around the contents
				var height = contents.outerHeight();
				container.animate({ scrollTop: height }, 8000);
				setTimeout(function() {container.animate({scrollTop:0}, 8000);},8000);
				setInterval(function(){
		     		container.animate({ scrollTop: height }, 8000);
					setTimeout(function() {container.animate({scrollTop:0}, 8000);},8000);
				},16000);
			}else{
				container.hide();
			}
					
		});
		mes.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});	
}

function login() {
	var user = $("#grvUser").val();
	var pass = $("#grvPass").val();
	var validUser = Validate.now(Validate.Presence, user);
	var validPass = Validate.now(Validate.Presence, pass);
	if(validUser && validPass){
		var request = $.ajax({
		  url: "/ncdis/service/action/loginSession?username="+user+"&password="+btoa(pass)+"&language=en&reswidth="+$(window).width()+"&resheight="+$(window).height(),
		  type: "GET",
		  dataType: "json"
		});
		request.done(function( json ) {
			
		  if(json.status == "0"){
			  $("#grvErrorText").text("Wrong Username or Password");
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
			$("#grvErrorText").text("Wrong Username or Password");
		});
		
	}else{
		$("#grvErrorText").text("Wrong Username or Password");
		
	}
}




function resetPassword(){
	var username = $("#grvUsernameReset").val();
	var password = $("#grvPasswordrReset").val();
	var passwordc = $("#grvConfirmPasswordrReset").val();
	var iduser = $("#grvIdUserReset").val();
	var validUser = Validate.now(Validate.Presence, username);
	var validPass = Validate.now(Validate.Presence, password);
	var validPassC = Validate.now(Validate.Presence, passwordc);
	if(validUser && validPass && validPassC){
		var data = "username="+username+"&passwordr="+btoa(password)+"&iduser="+iduser+"&language=en";
		var request = $.ajax({
		  url: "/ncdis/service/action/resetUserPassword",
		  type: "POST",
		  data: data,
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
		  if(json.status == "0"){
			  $(".cdisValidateTips").html(json.message);
		  }else{
			
			  $(".cdisValidateTips").html(json.message);
			  $("#grvDialogReset").find("fieldset").hide();
			  //$("#resetButtonDialog").text("Go to login page");
			
			  $("#grvDialogReset").dialog( "option", "buttons", 
			    [
			      {
			        text: "Go to login page",
			        click: function() {
			          gti();
			        }
			      }
			    ]
			  );
		  }
		});
		request.fail(function( jqXHR, textStatus ) {
			$("#errortext").text("Wrong Username or Password");
		});
		
	}else{
		$("#errortext").text("Wrong Username or Password");
		
	}	
}