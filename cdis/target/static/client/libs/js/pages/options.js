
if (!isUserLoged(sid)){
	logoutUser(sid);
}else{
	loadTemplate(page,loadOptionsTemplate);
}	
	
function loadOptionsTemplate(){
	if(isUserLoged(sid)){
		var sec = getParameterByName("section");
		if(sec != ""){
				loadOptionsSection(sec);
		}else{
			loadOptionsDashboard();
		}
		initPage();
	}else{
		logoutUser(sid);
	}
}
