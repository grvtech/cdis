import sectionconfig from './config.json' with { type: 'json' };
import * as router from './../../../../js/router.js';
import * as userlib from './../../../../js/userlib.js';
import {shareData} from './define.js'; //define global variables
import {appDefine} from './../../../../js/define.js';
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
    				val.updateTips(json.message)
					$(".cdisValidateTips").css("font-size","1.2vw");
    				$("#grvDialogSubscribe").find("fieldset").hide();
					let bc=[{"text":"Return to CDIS Login Page","action":"closeGRVPopup","alias":"this"}];
					shareData.pagepopup.changeButtons(bc);
					valid=false;
    			}else{
    				//tips.html(json.message);
					val.updateTips(json.message);
					$(".cdisValidateTips").css("font-size","1.2vw");
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
 	var username = $("#grvUsernameReset");
 	var password = $("#grvPasswordrReset");
 	var passwordc = $("#grvConfirmPasswordrReset");
 	var iduser = $("#grvIdUserReset").val();
	
	const val = new grvvalidation();
	let valid = true;
 	var validUser = val.checkEmpty(username,"Username must not be empty");
 	var validPass = val.checkPassword(password, 8);
 	var validPassC = val.checkPasswordConfirm(passwordc, password.val());
 	if(validUser && validPass && validPassC){
 		var data = "username="+username.val()+"&passwordr="+btoa(password.val())+"&iduser="+iduser+"&language="+appDefine.appLanguage;
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
			  $(".cdisValidateTips").css("font-size","1.2vw");
 		  }else{
 			  $(".cdisValidateTips").html(json.message);
			  $(".cdisValidateTips").css("font-size","1.2vw");
 			  $("#grvDialogReset").find("fieldset").hide();
 		  }
		  let bc=[{"text":"Return to CDIS Login Page","action":"closeGRVPopup","alias":"this"}];
		  shareData.pagepopup.changeButtons(bc);
		  valid = false;
 		});
 		request.fail(function( jqXHR, textStatus ) {
 			$(".cdisValidateTips").html("Wrong Username or Password");
 		});
 		
 	}else{
 		$(".cdisValidateTips").html("Wrong Username or Password");
 		
 	}
	return valid;	
 }
 
 

 export function loginUser() {
	const val = new grvvalidation();
 	var user = $("#grvUser");
 	var pass = $("#grvPass");
 	var validUser = val.checkEmpty(user,appDefine.errorCodes.E03);
 	var validPass = val.checkEmpty(pass, appDefine.errorCodes.E04);
 	if(validUser && validPass){
 		var request = $.ajax({
 		  url: "/ncdis/service/action/loginSession?username="+user.val()+"&password="+btoa(pass.val())+"&language="+appDefine.appLanguage+"&reswidth="+$(window).width()+"&resheight="+$(window).height(),
 		  type: "GET",
 		  dataType: "json"
 		});
 		request.done(function( json ) {
 		  if(json.status == "0"){
 			  $(".cdisValidateTips").text(appDefine.errorCodes.E02);
 		  }else{
			appDefine.userObject = json.objs[0];
			appDefine.sid = userlib.getSession(appDefine.userObject.iduser);
 			router.gts(appDefine.sid,"en");
 		  }
 		});
 		request.fail(function( jqXHR, textStatus ) {
 			$(".cdisValidateTips").text(appDefine.errorCodes.E01);
 		});
 		
 	}else{
 		$(".cdisValidateTips").text(appDefine.errorCodes.E02);
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
					$(".cdisValidateTips").css("font-size","1.2vw");
     				$("#grvDialogForgot form").hide();
     			}else{
     				$(".cdisValidateTips").html(json.message);
					$(".cdisValidateTips").css("font-size","1.2vw");
     			}
				let bc=[{"text":"Return to CDIS Login Page","action":"closeGRVPopup","alias":"this"}];
     			shareData.pagepopup.changeButtons(bc);
				valid = false;
				//$( "#grvDialogForgot" ).dialog( "option", "buttons", { "Return to CDIS Login Page": function() { gti(); } } );
     		});
     		mes.fail(function( jqXHR, textStatus ) {
     		  alert( "Error sending message : " + textStatus );
     		  formForgot[ 0 ].reset();
			  valid = false;
     		});	

     } 
     return valid;
 }
 
 
 export function confirmUserEmail(iduser){
	let  result = false;
	let data = "language="+appDefine.appLanguage+"&iduser="+iduser;
	$.ajax({
	  url: "/ncdis/service/action/confirmUserEmail",
	  type: "POST",
	  async : false,
	  cache : false,
	  data : data,
	  dataType: "json"
	}).done(function( json ) {
		if(json.status == "1"){
			result = true;
		}
	}).fail(function( jqXHR, textStatus ) {
	  alert( "Error sending message : " + textStatus );
	  result = false;
	});
	return result;
 }