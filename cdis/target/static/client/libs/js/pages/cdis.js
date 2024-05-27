if (!isUserLoged(sid)){
	logoutUser(sid);
}else{
	loadTemplate(page,loadCdisTemplate);
}	
	
function loadCdisTemplate(){
	if(isUserLoged(sid)){
		var pr = getParameterByName("ramq");
		var sec = getParameterByName("section");
		if(sec != ""){
			if(pr != ""){
				loadPatientObject("ramq",pr);
				loadSection(sec);
			}else{
				loadSection(sec);
			}
		}
		initPage();
	}else{
		logoutUser(sid);
	}
}

