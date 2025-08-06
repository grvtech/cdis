import * as userlib from './../../../../js/userlib.js';
import * as applib from './../../../../js/applib.js';
import sectionconfig from './config.json' with { type: 'json' };
/*
 * All functions internal for page index
 * */

/**
 * PUBLIC FUNCTIONS
 *  */	

export function initPage(){
	userlib.getFrontPageMessage();
	$(".cdisSubscribeButton").on("click",openSubscribePopup);
}







export function validatePasswordSubscription() {
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

export function validatePasswordConfirmSubscription() {
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

export function resetFormStyles(formName){
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

export function validatePasswordReset() {
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

export function validatePasswordConfirmReset() {
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

export function forgotPasswordUser() {
	
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



export function updateTips( t ) {
    $(".cdisValidateTips")
      .text( t )
      .addClass( "ui-state-highlight" );
    setTimeout(function() {
      tips.removeClass( "ui-state-highlight", 1500 );
    }, 500 );
  }

export function checkLength( o, n ) {
    if ( o.val().length == 0 || o.val() == '0') {
      o.addClass( "ui-state-error" );
      updateTips( "Field " + n + " cannot be empty." );
      return false;
    } else {
      return true;
    }
}

export function checkRegexp( o, regexp, n ) {
    if ( !( regexp.test( o.val() ) ) ) {
      o.addClass( "ui-state-error" );
      updateTips( n );
      return false;
    } else {
      return true;
    }
}



export function loginUser() {
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




export function resetPasswordUser(){
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


/**
 * PRIVATE FUNCTIONS
 * 
 */

function subscribeUser() {
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


function showGRVPopup(title,text,buttons,config){
	const id = Math.floor(Date.now() / 1000);
	$("body").css("overflow-y","hidden").css("overflow-x","hidden");
	
	var modal = $('<div>',{id:"fullscreen_"+id,class:"grvpopup-fullscreen-modal"}).appendTo($("#"+config.container));
	var sett = $('<div>',{class:"grvpopup-window"}).appendTo(modal);
	if(typeof(config.width) != "undefined")sett.css("width",config.width+"px");
	if(typeof(config.height) != "undefined")sett.css("height",config.height+"px");
	var settH = $('<div>',{class:"grvpopup-window-header"}).appendTo(sett);
	var settB = $('<div>',{class:"grvpopup-window-body"}).appendTo(sett);
	var settBB = $('<div>',{class:"grvpopup-window-body-body"}).appendTo(settB);
	var settBF = $('<div>',{class:"grvpopup-window-body-footer"}).appendTo(settB);
	var autos = "";
	$.each(buttons,function(x,y){autos = "auto "+autos;});
	$(settBF).css("grid-template-columns",autos);
	
	$.each(buttons, function(i,button){
		var cb = $('<button>',{class:"cisbutton"}).text(button.text).appendTo(settBF);
		cb.on("click",{"buttonAction":button.action},function (event){
			var flag = eval(event.data.buttonAction+"()");
			if(flag)setTimeout(closeGRVPopup,300);
		});	
		
		
	});
	
	settBB.html(text);
	$('<div>',{class:"grvpopup-window-header-title"}).text(title).appendTo(settH);
	var settHC = $('<div>',{class:"grvpopup-window-header-close"}).html("&#128473;").appendTo(settH);
	settHC.click(function(){
		closeGRVPopup(); 
	});
	
	function closeGRVPopup(){
		$(".grvpopup-fullscreen-modal").remove();
		$("body").css("overflow-y","auto").css("overflow-x","auto");
	}
}


function openSubscribePopup(){
	let p = applib.getTemplatePath("subscribe",sectionconfig);
	var bconfig = {"width":"600","height":"500", container:"grvWraper"};
	var bbut = [{"text":"Close","action":"closeGRVPopup"},{"text":"Subscribe","action":"subscribeUser"}];
	var txt = applib.getTemplateContent(p);
	showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
}
