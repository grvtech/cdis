import * as slib from './lib.js'; //ilib = index lib
import * as applib from './../../../../js/applib.js';
import * as userlib from './../../../../js/userlib.js';
import sectionconfig from './config.json' with { type: 'json' };
import {appDefine} from './../../../../js/define.js';

/*
 * MAIN SECTION
 * */

if (!userlib.isUserLoged(appDefine.sid)){
	userlib.logoutUser(appDefine.sid);
}else{
	applib.loadRessources(sectionconfig,slib.initPage);
	//loadTemplate(page,loadSearchTemplate);
}



