var adminSection = "users";

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
		}else{
			loadAdminDashboard();
		}
	}else{
		logoutUser(sid);
	}
}

function clearSections(){
	$(".mainpage .main .page").empty();
}


function loadAdminSection(section){
	adminSection = section;
	clearSections();
	if(section == "users"){
		$(".mainpage .main .page").load("/ncdis/client/templates/admin."+section+".html", function(){


		});
	}else if(section == "frontpage"){
		$(".mainpage .main .page").load("/ncdis/client/templates/admin."+section+".html", function(patientObjArr){
		
		});
	}else if(section == "audit"){
		$(".mainpage .main .page").load("/ncdis/client/templates/admin."+section+".html", function(patientObjArr){

		});
	}
	initPage();
}

