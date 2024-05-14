

if (!isUserLoged(sid)){
	logoutUser(sid);
}else{
	loadTemplate(page,loadAdminTemplate);
}	
	
function loadAdminTemplate(){
	if(isUserLoged(sid)){
		var sec = getParameterByName("section");
		if(sec != ""){
				loadAdminSection(sec);
		}
		
	}else{
		logoutUser(sid);
	}
}

