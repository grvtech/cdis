import * as applib from './../../../../js/applib.js';
import * as router from './../../../../js/router.js';
import * as userlib from './../../../../js/userlib.js';
import * as ailib from './apilib.js';
import {grvpopup} from './../../modules/grvpopup.js';
import {grvvalidation} from './../../modules/grvvalidation.js';
import sectionconfig from './config.json' with { type: 'json' };
import {shareData} from './define.js'; //define global variables


/**
 * PUBLIC FUNCTIONS
 *  */	

export function initPage(){
	ailib.getFrontPageMessage();
	$("#user").focus();
	$("#grvSubscribeButton").on("click",openSubscribePopup);
	$("#grvForgotButton").on("click",openForgotPopup);
	
	//submit on enter when focus on password field
	$("#grvPass").on("keyup",function(e){if(e.keyCode == 13){$("#grvLoginButton").click();}});
	//submit on enter when focus on login button
	$('#grvLoginButton').on('keypress', function(e) {if(e.keyCode==13){$(this).click();}});
	$("#grvLoginButton").on("click",ailib.loginUser);

	treatConfirmMail(router.getParameterByName("confirm"));
	treatReset(router.getParameterByName("rst"));
	
	
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



/**
 * PRIVATE FUNCTIONS
 * 
 */

function openSubscribePopup(){
	let p = applib.getTemplatePath("subscribe",sectionconfig);
	var txt = applib.getTemplateContent(p);
	let config = {
			width:400,
			height:620,
			container:sectionconfig.container,
			buttons:[{
					"text":"Close",
					"action":"closeGRVPopup",
					"alias":"this"},
					{
						"text":"Subscribe",
						"action":"subscribeUser","alias":"ailib"}],
			content:txt,
			title:"CDIS Subscribe User"
	}
	shareData.pagepopup = new grvpopup(config);
	
	$("#grvPasswordSubscribe").on("focus",function() {$("#grvPasswordMessage").css("display","block");});
	$("#grvPasswordSubscribe").on("blur",function() {$("#grvPasswordMessage").css("display","none");});
	$("#grvPasswordSubscribe").on("keyup",validatePasswordSubscription);

	$("#grvPasswordSubscribeConfirm").on("focus",function() {$("#grvConfirmPasswordMessage").css("display","block");});
	$("#grvPasswordSubscribeConfirm").on("blur",function() {$("#grvConfirmPasswordMessage").css("display","none");});
	$("#grvPasswordSubscribeConfirm").on("keyup",validatePasswordConfirmSubscription);
}


function openForgotPopup(){
	let p = applib.getTemplatePath("forgot",sectionconfig);
	var txt = applib.getTemplateContent(p);
	let config = {
			width:300,
			height:320,
			container:sectionconfig.container,
			buttons:[{
					"text":"Close",
					"action":"closeGRVPopup",
					"alias":"this"},
					{
						"text":"Reset Password",
						"action":"forgotPasswordUser","alias":"ailib"}],
			content:txt,
			title:"CDIS Forgot Password"
	}
	shareData.pagepopup = new grvpopup(config);
	
	$("#grvForgotUsername").on("click",function(){
		if($(this).prop("checked")){
			$("#grvUsernameUser").parent().hide();
		}else{
			$("#grvUsernameUser").parent().show();	
		}
	});
		
}

function treatConfirmMail(confirmParam){
	if(confirmParam == "1"){
		console.log("confirm user 1")
		var iu = router.getParameterByName("iduser");
		console.log("user id "+iu)
		var u = userlib.getUser(iu);
		console.log("user")
		console.log(u)
		
		if(u.confirmmail == "1"){
			let flag = ailib.confirmUserEmail(iu);
			console.log(flag)
			if(ailib.confirmUserEmail(iu)){
			let txt = "<p><center><span style='color:var(--main-green);font-size:35px;'><i class='fas fa-thumbs-up'></i></span><br><b>Email confirmed with succes.</b></center></p>";	
			let config = {
						width:300,
						height:220,
						container:sectionconfig.container,
						buttons:[{"text":"Close","action":"gti","alias":"router"}],
						content:txt,
						title:"CDIS Email Confirm"
				};
				
			shareData.pagepopup = new grvpopup(config);
			}
		}else{
			var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fas fa-check-double'></i></span><br><b>The user has already confirmed email.</b></center></p>";
			let config = {
								width:300,
								height:220,
								container:sectionconfig.container,
								buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"}],
								content:txt,
								title:"CDIS Email Confirm"
						};
			shareData.pagepopup = new grvpopup(config);

		}
	}
}


function treatReset(resetParam){
	if(resetParam == "1"){
		var iu = router.getParameterByName("iduser");
		var u = userlib.getUser(iu);
		
		if(u.reset == "1"){
			
			let p = applib.getTemplatePath("reset",sectionconfig);
			var txt = applib.getTemplateContent(p);
			let config = {
					width:300,
					height:420,
					container:sectionconfig.container,
					buttons:[{
							"text":"Close",
							"action":"closeGRVPopup",
							"alias":"this"},
							{
								"text":"Reset Password",
								"action":"resetPasswordUser","alias":"ailib"}],
					content:txt,
					title:"CDIS Forgot Password"
			}
			shareData.pagepopup = new grvpopup(config);
			
			$("#grvPasswordrReset").on("focus",function() {$("#grvPasswordrMessage").css("display","block");});
			$("#grvPasswordrReset").on("blur",function() {$("#grvPasswordrMessage").css("display","none");});
			$("#grvPasswordrReset").on("keyup",validatePasswordReset);
			$("#grvConfirmPasswordrReset").on("focus",function() {$("#grvConfirmPasswordrMessage").css("display","block");});
			$("#grvConfirmPasswordrReset").on("blur",function() {$("#grvConfirmPasswordrMessage").css("display","none");})
			$("#grvConfirmPasswordrReset").on("keyup",validatePasswordConfirmReset);
		
			//$("#grvDialogReset").dialog("open");
			$("#grvUsernameReset").val(u.username);
			$("#grvIdUserReset").val(u.iduser);
		}else{
			var bconfig = {"width":"300","height":"250"};
			var bbut = [{"text":"Close","action":"closeGRVPopup"}];
			var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>The user did not initiated password reset.</b><br>Please contact CDIS administrator or send an email to support@grvtech.ca to initiate the reset of the password!</center></p>";
			showGRVPopup("CDIS Reset Password",txt,bbut,bconfig);

		}
		
	}
}


function validatePasswordSubscription() {
	const val = new grvvalidation();
	console.log(" fire validatePasswordSubscription")
	  // Validate lowercase letters
	  let vL = val.checkLowcase($(this), "Password must contain lowercase characters!");
	  if(vL){
		  $("#grvPassLetter").removeClass("invalid");
		  $("#grvPassLetter").addClass("valid");
	  }else{
		  $("#grvPassLetter").removeClass("valid");
		  $("#grvPassLetter").addClass("invalid");
	  }
	  
	  // Validate capital letters
	  let vC = val.checkUppercase($(this), "Password must contain UPPERCASE characters!");
  	  if(vC){
		$("#grvPassCapital").removeClass("invalid");
		$("#grvPassCapital").addClass("valid");
  	  }else{
		$("#grvPassCapital").removeClass("valid");
		$("#grvPassCapital").addClass("invalid");
  	  }
	  

	  // Validate numbers
	  let vN = val.checkNumbers($(this), "Password must contain numbers!");
	  if(vN) {
		  $("#grvPassNumber").removeClass("invalid");
		  $("#grvPassNumber").addClass("valid");
	  }else{
		  $("#grvPassNumber").removeClass("valid");
		  $("#grvPassNumber").addClass("invalid");
	  }

	  // Validate length
	  let vLen = val.checkLength($(this), 8, "Password must be at least 8 characters!");
	  if(vLen) {
		  $("#grvPassLength").removeClass("invalid");
		  $("#grvPassLength").addClass("valid");
	  }else{
		  $("#grvPassLength").removeClass("valid");
		  $("#grvPassLength").addClass("invalid");
	  }
	  
	  if(vL && vC && vN && vLen) {return true;} else { return false;}
}

function validatePasswordConfirmSubscription() {
	const val = new grvvalidation();
	let validCPassword = val.checkString($("#grvPasswordSubscribeConfirm"), $("#grvPasswordSubscribe").val());
	console.log(validCPassword)
	if(validCPassword){
		$("#grvPassConfirm").removeClass("invalid");
		$("#grvPassConfirm").addClass("valid");
		return true;
	}else{
		$("#grvPassConfirm").removeClass("valid");
		$("#grvPassConfirm").addClass("invalid");
		return false;
	}
}



function validatePasswordReset() {
	const val = new grvvalidation();
	  // Validate lowercase letters
	let vL = val.checkLowcase($(this), "Password must contain lowercase characters!");
    if(vL){
		$("#grvPassrLetter").removeClass("invalid");
		$("#grvPassrLetter").addClass("valid");
    }else{
		$("#grvPassrLetter").removeClass("valid");
		$("#grvPassrLetter").addClass("invalid");
    }
	  
	// Validate capital letters
	let vC = val.checkUppercase($(this), "Password must contain UPPERCASE characters!");
	if(vC){
		$("#grvPassrCapital").removeClass("invalid");
		$("#grvPassrCapital").addClass("valid");
	}else{
		$("#grvPassrCapital").removeClass("valid");
		$("#grvPassrCapital").addClass("invalid");
 	}
	  
	// Validate numbers
	let vN = val.checkNumbers($(this), "Password must contain numbers!");
	if(vN) {
		$("#grvPassrNumber").removeClass("invalid");
		$("#grvPassrNumber").addClass("valid");
	}else{
		$("#grvPassrNumber").removeClass("valid");
		$("#grvPassrNumber").addClass("invalid");
	}

	// Validate length
	let vLen = val.checkLength($(this), 8, "Password must be at least 8 characters!");
	if(vLen) {
		$("#grvPassrLength").removeClass("invalid");
		$("#grvPassrLength").addClass("valid");
	}else{
		$("#grvPassrLength").removeClass("valid");
		$("#grvPassrLength").addClass("invalid");
	}
	if(vL && vC && vN && vLen) {return true;} else { return false;}
}

function validatePasswordConfirmReset() {
	const val = new grvvalidation();
	let validCPasswordr = val.checkString($("#grvConfirmPasswordrReset"), $("#grvPasswordrReset").val());
	console.log(validCPasswordr)
	if(validCPasswordr){
		$("#grvPassrConfirm").removeClass("invalid");
		$("#grvPassrConfirm").addClass("valid");
		return true;
	}else{
		$("#grvPassrConfirm").removeClass("valid");
		$("#grvPassrConfirm").addClass("invalid");
		return false;
	}
}

