import sectionconfig from './config.json' with { type: 'json' };
import {shareData} from './define.js'; //define global variables
import {grvvalidation} from './../../modules/grvvalidation.js';
/**
 * All functions that communicates with backend - uses ajax
 */

/**
PUBLIC FUNCTIONS
*/

export function getFrontPageMessage(){
	var mes = $.ajax({
		  url: "/ncdis/service/action/getFrontPageMessage?language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		mes.done(function( json ) {
			let message = json.objs[0].message;
			if(message != ""){
				let container = $("#"+sectionconfig.frontpageContainer);
				container.html(message); 
			}else{
				container.hide();
			}
		});
		mes.fail(function( jqXHR, textStatus ) {console.log( "Request failed: " + textStatus );});	
}


export function subscribeUser() {
    var valid = true;
	const val = new grvvalidation();
	const validPassword = val.checkPassword($( "#grvPasswordSubscribe" ), 8);
	const validCPassword = val.checkPasswordConfirm($("#grvPasswordSubscribeConfirm"),$("#grvPasswordSubscribe").val());
    valid = valid && val.checkEmpty($( "#grvFirstnameSubscribe" ), "First name cannot be empty" );
    valid = valid && val.checkEmpty($( "#grvLastnameSubscribe" ), "Last name cannot be empty" );
    valid = valid && val.checkEmpty($( "#grvEmailSubscribe" ), "Email cannot be empty" );
    valid = valid && val.checkEmpty($( "#grvIdcommunitySubscribe" ), "User Community cannot be empty" );
    valid = valid && val.checkEmpty($( "#grvIdprofesionSubscribe" ), "Profession cannot be empty" );
    valid = valid && val.checkEmail($( "#grvEmailSubscribe" ), "Email format should be : eg. name@domain.com" );

	//valid = valid && validPassword && validCPassword;
	if(valid)val.updateTips("All form fields are required.");
	
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
    				val.updateTips(json.message);
    				$("#grvDialogSubscribe").find("fieldset").hide();
					let bc=[{"text":"Return to CDIS Login Page","action":"closeGRVPopup","alias":"this"}];
					shareData.pagepopup.changeButtons(bc);
					valid=false;
    			}else{
    				//tips.html(json.message);
					val.updateTips(json.message);
					$("#grvDialogSubscribe").find("fieldset").hide();
					valid = false;
    			}
    		});
    		mes.fail(function( jqXHR, textStatus ) {
    		  alert( "There was an unexpected error  " + textStatus );
  			  $(".grvpopup-fullscreen-modal").remove();
    		});	

    }else {
		alert("Please make sure all information is valid");
		valid = false;
	}
    return valid;
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
 
 export function forgotPasswordUser() {
     var valid = true;
	 const val = new grvvalidation();
	 
     if(!$("#grvForgotUsername").prop("checked")){
 		valid = valid && val.checkEmpty($( "#grvUsernameUser" ), "Username must not be empty" );
		
 	}
     valid = valid && val.checkEmpty($( "#grvEmailUser" ), "Email must not be empty" );
     valid = valid && val.checkEmail($( "#grvEmailUser" ), "Email must respect fotmat eg. name@domain.com" );
 	
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
     				$(".cdisValidateTips").html(json.message);
     				$("#grvDialogForgot form").hide();
     			}else{
     				$(".cdisValidateTips").html(json.message);
     			}
				let bc=[{"text":"Return to CDIS Login Page","action":"closeGRVPopup","alias":"this"}];
     			shareData.pagepopup.changeButtons(bc);
				//$( "#grvDialogForgot" ).dialog( "option", "buttons", { "Return to CDIS Login Page": function() { gti(); } } );
     		});
     		mes.fail(function( jqXHR, textStatus ) {
     		  alert( "Error sending message : " + textStatus );
     		  formForgot[ 0 ].reset();
   			  $("#grvDialogForgot").dialog( "close" );
     		});	

     } 
     return valid;
 }
 
 
 export function confirmUserEmail(iduser){
	let  result = false;
	$.ajax({
	  url: "/ncdis/service/action/confirmUserEmail?language=en&iduser="+iduser,
	  type: "POST",
	  async : false,
	  cache : false,
	  data : data,
	  dataType: "json"
	}).done(function( json ) {
		if(json.status == "1"){
			result = true;
			/*
			var bconfig = {"width":"300","height":"250"};
			var bbut = [{"text":"Close","action":"gti"}];
			var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Email confirmed with succes.</b></center></p>";
			showGRVPopup("CDIS Email Confirm",txt,bbut,bconfig);
			*/
		}
	}).fail(function( jqXHR, textStatus ) {
	  alert( "Error sending message : " + textStatus );
	  result = false;
	});
	return result;
 }