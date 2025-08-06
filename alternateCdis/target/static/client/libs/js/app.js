import * as router from './router.js';

$(document).ready(function() {
	let ua = navigator.userAgent;
	console.log(ua)
	
	let section = router.getSection();
	let theme = router.getTheme();
	
	if(section == "" && theme==""){
		router.route();	
	}else{
		import("/ncdis/client/libs/themes/"+theme+"/sections/"+section+"/main.js")
			.then(module => {console.log("Script Module main loaded for section "+section+" in theme : "+theme);})
        	.catch(error => {console.error("Error loading Script Module main for section "+section+" in theme : "+theme+" with error : "+ error);
        });
	}
	
/*
    window.addEventListener("beforeunload", function (e) {
	logout(define.sid);
});
  */
});