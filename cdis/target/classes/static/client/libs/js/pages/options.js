var optionsSection="personalinfo";
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
	}else{
		logoutUser(sid);
	}
}


function loadOptionsDashboard(){
	$(".mainpage .main .page").empty();
	$(".mainpage .main .page").load("/ncdis/client/templates/options.personalinfo.html", function(){
		optionsSection = "personalinfo";
		initPage();
	});
}



function loadOptionsSection(section){
	optionsSection = section;
	$(".cdisbody_patient_alerts").hide();
	if(section == "personalinfo"){
		loadOptionsDashboard();
	}
}
