import * as clib from './lib.js'; //ilib = index lib
import * as applib from './../../../../js/applib.js';
import * as router from './../../../../js/router.js';
import * as userlib from './../../../../js/userlib.js';
import * as patientlib from './../../../../js/patientlib.js';
import sectionconfig from './config.json' with { type: 'json' };
import {appDefine} from './../../../../js/define.js';

/*
 * MAIN SECTION
 * */

if (!userlib.isUserLoged(appDefine.sid)){
	userlib.logoutUser(appDefine.sid);
}else{
	appDefine.userObject = userlib.getUserBySession(appDefine.sid);
	appDefine.users = userlib.getUsers();
	if(router.getParameterByName("ramq") != 'undefined')patientlib.getPatientRecord("ramq",router.getParameterByName("ramq"));
	applib.loadRessources(sectionconfig,clib.initPage);
}



