
if (!isUserLoged(sid)){
	logoutUser(sid);
}else{
	loadTemplate(page,loadSearchTemplate);
}	
	
function loadSearchTemplate(){
	if(isUserLoged(sid)){
		initPage();
	}else{
		logoutUser(sid);
	}
}



