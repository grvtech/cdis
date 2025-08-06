import * as ilib from './lib.js'; //ilib = index lib  
import * as alib from './apilib.js'; //alib = api index lib
import * as router from './../../../../js/router.js';
import * as applib from './../../../../js/applib.js';
import sectionconfig from './config.json' with { type: 'json' };

/*
 * GLOBAL varaibles
 * 
 * */

var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
let tips = $(".cdisValidateTips");
var imsg = "All form fields are required.";
var validPassword = false;
var validCPassword = false;
var validPasswordr = false;
var validCPasswordr = false;
var resetParam = router.getParameterByName("rst");
var confirmParam = router.getParameterByName("confirm");


/**
 * init part
 * load ressources
 * load ui
 */
applib.loadRessources(sectionconfig,ilib.initPage);


/*
 * EVENT definitions
 * 
 * */
//submit on enter when focus on password field
$("#grvPass").on("keyup",function(e){if(e.keyCode == 13){$("#grvLoginButton").click();}});
//submit on enter when focus on login button
$('#grvLoginButton').on('keypress', function(e) {if(e.keyCode==13){$(this).click();}});
$("#grvLoginButton").on("click",ilib.login);
$("#grvPasswordSubscribe").on("focus",function() {$("#grvPasswordMessage").css("display","block");});
$("#grvPasswordSubscribe").on("blur",function() {$("#grvPasswordMessage").css("display","none");});
$("#grvPasswordSubscribe").on("keyup",ilib.validatePasswordSubscription);

$("#grvPasswordSubscribeConfirm").on("focus",function() {$("#grvConfirmPasswordMessage").css("display","block");});
$("#grvPasswordSubscribeConfirm").on("blur",function() {$("#grvConfirmPasswordMessage").css("display","none");});
$("#grvPasswordSubscribeConfirm").on("keyup",ilib.validatePasswordConfirmSubscription);

$("#grvPasswordrReset").on("focus",function() {$("#grvPasswordrMessage").css("display","block");});
$("#grvPasswordrReset").on("blur",function() {$("#grvPasswordrMessage").css("display","none");});
$("#grvPasswordrReset").on("keyup",ilib.validatePasswordReset);
$("#grvConfirmPasswordrReset").on("focus",function() {$("#grvConfirmPasswordrMessage").css("display","block");});
$("#grvConfirmPasswordrReset").on("blur",function() {$("#grvConfirmPasswordrMessage").css("display","none");})
$("#grvConfirmPasswordrReset").on("keyup",ilib.validatePasswordConfirmReset);
$(".cdisForgotButton").on("click",function (){$("#grvDialogForgot").dialog("open");});




/*
 * MAIN SECTION
 * */
//userlib.getFrontPageMessage();
$("#user").focus();



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


