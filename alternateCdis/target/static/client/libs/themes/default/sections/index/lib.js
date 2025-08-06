import * as applib from './../../../../js/applib.js';
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
	$("#grvSubscribeButton").on("click",openSubscribePopup);
	$("#grvForgotButton").on("click",openForgotPopup);
	
	//submit on enter when focus on password field
	$("#grvPass").on("keyup",function(e){if(e.keyCode == 13){$("#grvLoginButton").click();}});
	//submit on enter when focus on login button
	$('#grvLoginButton').on('keypress', function(e) {if(e.keyCode==13){$(this).click();}});
	$("#grvLoginButton").on("click",ailib.login);
	

	$("#grvPasswordrReset").on("focus",function() {$("#grvPasswordrMessage").css("display","block");});
	$("#grvPasswordrReset").on("blur",function() {$("#grvPasswordrMessage").css("display","none");});
	$("#grvPasswordrReset").on("keyup",validatePasswordReset);
	$("#grvConfirmPasswordrReset").on("focus",function() {$("#grvConfirmPasswordrMessage").css("display","block");});
	$("#grvConfirmPasswordrReset").on("blur",function() {$("#grvConfirmPasswordrMessage").css("display","none");})
	$("#grvConfirmPasswordrReset").on("keyup",validatePasswordConfirmReset);
	


	
	
	
}


export function validatePasswordSubscription() {
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

export function validatePasswordConfirmSubscription() {
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
	//grvpopup.grvpopup(config);
	
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
