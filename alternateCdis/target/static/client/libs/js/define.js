import * as router from './router.js';
export const appDefine = {
	_t:Date.now(),
	page:router.getPage(),
	appLanguage:"en",
	userObject : null,
	userProfileObject:null,
	sid:router.getParameterByName("sid"),
	isDemo:false,
	errorCodes:{
		"E01":"ERRAPP-01 Communication error",
		"E02":"ERRAPP-02 Wrong username or password",
		"E03":"ERRAPP-03 Username empty",
		"E04":"ERRAPP-04 Password empty"
	}
}; 




 