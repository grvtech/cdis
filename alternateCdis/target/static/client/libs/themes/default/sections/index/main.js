import * as ilib from './lib.js'; //ilib = index lib
import * as ailib from './apilib.js'; //ailib = index apilib
import * as router from './../../../../js/router.js';
import * as applib from './../../../../js/applib.js';
import * as userlib from './../../../../js/userlib.js';
import {grvpopup} from './../../modules/grvpopup.js';
import sectionconfig from './config.json' with { type: 'json' };
import {shareData} from './define.js'; //define global variables
/*
 * GLOBAL varaibles
 * 
 * */

var resetParam = router.getParameterByName("rst");
var confirmParam = router.getParameterByName("confirm");


/**
 * init part
 * load ressources
 * load ui
 */

/*
 * MAIN SECTION
 * */
applib.loadRessources(sectionconfig,ilib.initPage);
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
	var iu = router.getParameterByName("iduser");
	var u = userlib.getUser(iu);
	console.log(u)
	if(u.confirmmail == "1"){
		if(ailib.confirmUserEmail(iu)){
		let txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Email confirmed with succes.</b></center></p>";	
		let config = {
					width:300,
					height:320,
					container:sectionconfig.container,
					buttons:[{"text":"Close","action":"gti","alias":"router"}],
					content:txt,
					title:"CDIS Email Confirm"
			};
			shareData.pagepopup = new grvpopup(config);
		}
	}else{
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>The user has already confirmed email.</b></center></p>";
		let config = {
							width:300,
							height:320,
							container:sectionconfig.container,
							buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"}],
							content:txt,
							title:"CDIS Email Confirm"
					};
		shareData.pagepopup = new grvpopup(config);

	}
}


