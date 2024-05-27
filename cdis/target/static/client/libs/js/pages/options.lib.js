/*
 * GLOGAL variables
 * */
var optionsSection="personalinfo";
var ob = userObj[0];

console.log(ob)
/*
 * MAIN Section 
 * */
$(".cdisfooter-left").hover(function(){$(".leftfootermenu").toggle("fade");},function(){$(".leftfootermenu").toggle("fade");});

ob["community"] = report_idcommunity[ob.idcommunity];
ob["role"] = userProfileObj.role.idrole;
ob["role-hidden"] = userProfileObj.role.code;

if(ob.idprofesion == "1"){
	ob["idprofesion"] = "2";
	ob["profession"] = "2";
}else if(ob.idprofesion == "2"){
	ob["idprofesion"] = "3";
	ob["proffesion"] = "3";
}else if(ob.idprofesion == "3"){
	ob["idprofesion"] = "4";
	ob["profesion"] = "4";
}else if(ob.idprofesion == "4"){
	ob["idprofesion"] = "1";
	ob["profesion"] = "1";
}

	
/*
 * EVENT definitions
 * */



/*
 * FUNCTIONS
 * */

function initLocalPage(section){
	if(section == "personalinfo"){
		//populate specif local page
		$(report_profession).each(function(index, value) {
		    $("#profesion-id").append($("<option />").val(index).text(value));
		});
		populateForm($("#personalinfo-form"),ob);
		
		//define events for local template
		$("#profesion-id").on("change",function(){$("#id-profession").val($("#profesion-id").val());});
		$("#reset-password-button").on("click",resetPasswordFromPersonalInfo);
		$("#cancel-personalinfo-button").on("click",function(){gts(sid,"en");});
		$("#save-personalinfo-button").on("click",savePersonalInfo);
	}
}

function loadOptionsSection(section){
	optionsSection = section;
	$(".cdisbody_patient_alerts").hide();
	if(section == "personalinfo"){
		loadOptionsDashboard();
	}
}

function loadOptionsDashboard(){
	$(".mainpage .main .page").empty();
	$(".mainpage .main .page").load("/ncdis/client/templates/options.personalinfo.html", function(){
		optionsSection = "personalinfo";
		initPage();
		initLocalPage("personalinfo");
	});
}

function resetPasswordFromPersonalInfo(){
	var par = $(this).parent();
	$(this).hide();
	var pass = $("<div>",{class:"password-space"}).appendTo(par);
	
	var data = $('#personalinfo-form').serialize();
	data+="&sid="+sid+"&language=en";
	var resetpass = $.ajax({
		  url: "/ncdis/service/data/sendResetUserPassword",
		  type: "POST",
		  data : data,
		  dataType: "json",
		  beforeSend: function(xhr, opts){
		  }
		});
		resetpass.done(function( json ) {
			$(pass).text("An email was sent to "+ob.email+" to reset password");
			
		});
		resetpass.fail(function( jqXHR, textStatus ) {
			$(pass).text("Failed to send email for password reset");
		});	
}

function savePersonalInfo(){
	var data = $('#personalinfo-form').serialize();
	data+="&sid="+sid+"&language=en";
	
	var save = $.ajax({
		  url: "/ncdis/service/data/saveUser?sid="+sid+"&language=en",
		  type: "POST",
		  async : false,
		  data: data,
		  dataType: "json",
		  beforeSend: function(xhr, opts){
		  	
		  }
		});
		save.done(function( json ) {
			gts(sid,"en");
		});
		save.fail(function( jqXHR, textStatus ) {
			var t = $("#errortext-addpatient").html();
			$("#errortext-addpatient").html(t+"<p>Error saving the patient!</p>");
		});	
}
