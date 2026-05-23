import * as applib from './../../../../js/applib.js';
import * as router from './../../../../js/router.js';
import * as userlib from './../../../../js/userlib.js';
import * as genericlib from './../../../../js/genericlib.js';
import * as patientlib from './../../../../js/patientlib.js';
import * as aslib from './apilib.js';
import * as locallist from './locallist.js';
import {grvpopup} from './../../modules/grvpopup.js';
import {grvautocomplete} from './../../modules/grvautocomplete.js';
import {grvlist} from './../../modules/grvlist.js';
import {grvvalidation} from './../../modules/grvvalidation.js';
import sectionconfig from './config.json' with { type: 'json' };
import {shareData} from './define.js'; //define global variables
import {appDefine} from './../../../../js/define.js'; //define global variables


/**
 * PUBLIC FUNCTIONS
 *  */	

export function initPage(){
	
	console.log(appDefine.userObject)
	let configlist = {direction:'v',
						open:0,
						container:"grvList1", 
						elements:[
							{label:'CHART',value:'chart',active:1},
							{label:'RAMQ',value:'ramq',active:0},
							{label:'NAME',value:'fnamelname',active:0},
							{label:'IPM',value:'giu',active:0}
						]
					}
	
	const l = new grvlist(configlist);
	appDefine.criteriaSearchPatientObject = l;
	
	let gacconfig = {container:"grvAutocomplete",
		delay:200,
		highlight:true,
		minLenght:1,
		maxHeight:300,
		source:patientlib.searchPatient,
		select:selectPatient,
		render:patientlib.renderSearchPatientResult
	}
	
	const ac = new grvautocomplete(gacconfig);
	appDefine.autocomleteSearchPatientObject = ac;
	let fll = router.getParameterByName("fll");
	userlib.refreshUserNotes(appDefine.sid);
	drawUserDashboard(userlib.getUserDashboard());
	console.log("user notes in lib"+appDefine.userNotes)
	
	if(appDefine.userNotes.length > 0){
		//$(".cdisNotesAlert").attr("display","block");
		
		$.each(appDefine.userNotes, function(i,not){
			var uzer = userlib.getUser(not.iduser);
			var patient = patientlib.getPatientInfo(not.idpatient);
			$("<div>",{class:"cdisNoteMessage"})
				.append($("<span>").html("New message from <b>"+uzer.firstname+" "+uzer.lastname+ "</b> for the patient <b>"+patient.ramq+"</b>"))
				.append($("<div>",{class:"cdisNoteMessageButton"}).text("See Message").click(function(){
					router.gtc(appDefine.sid,appDefine.appLanguage,patient.ramq,"notes");
				}))
			.appendTo($(".cdisNotesAlert"));
		});
		/**/
	}else{
		$(".cdisNotesAlert").attr("display","none");
	}


	if(typeof(appDefine.userObject.idprofesion) != "undefined"){
		var hcpcat = appDefine.profession_index[appDefine.userObject.idprofesion];
		var iduser = appDefine.userObject.iduser;
		$("#grvPersonalPatientsUserFullname").text(genericlib.capitalizeFirstLetter(appDefine.userObject.firstname)+" "+genericlib.capitalizeFirstLetter(appDefine.userObject.lastname));
		userlib.getUserPatients(iduser,hcpcat);	
	}else{
		$(".cdisPersonalPatients").hide();
	}
	
	/*INIT navigation buttons */
	$("#grvLinkedPatientsButton").on("click",openLinkPatientsList);
	$(".cdisFooterRight").hover(function(){$(".cdisExpandMenu").toggle();},function(){$(".cdisExpandMenu").toggle();});
	$(".cdisFreports").click(function() {router.gtr(appDefine.sid,appDefine.appLanguage,null);});
	$(".cdisFlogout").click(function() {userlib.logoutUser(appDefine.sid);});
	$(".cdisFnew").click(function() {
		var plus = "&frompage="+appDefine.page;
		if(appDefine.page == "cdis")plus = plus+"&fr="+appDefine.userObject.ramq;
		router.gtc(appDefine.sid,appDefine.appLanguage,null,"addpatient",plus);
	});
	
	$('#grvLocallistButton').click(function(){
		setTimeout(userlib.setUserEvent,100,"LLIST");
		var f = null;
		if(fll=='1') {
			var fllstr = "&fll=1&fll_ramq="+router.getParameterByName("fll_ramq")
			+"&fll_age="+router.getParameterByName("fll_age")
			+"&fll_dp="+router.getParameterByName("fll_dp")
			+"&fll_dtype="+router.getParameterByName("fll_dtype")
			+"&fll_hba1c="+router.getParameterByName("fll_hba1c")
			+"&fll_idcommunity="+router.getParameterByName("fll_idcommunity")
			+"&fll_list="+router.getParameterByName("fll_list")
			+"&fll_sex="+router.getParameterByName("fll_sex")
			+"&fll_users="+router.getParameterByName("fll_users");
			f = getFilterFromString(fllstr);
		}
		locallist.openList(f);
	});
	if(fll == '1'){$('#grvLocallistButton').trigger("click");}
	
	$("#grvFrontpageButton").click(function() {router.gta(appDefine.sid,appDefine.appLanguage,"frontpage");});
	$("#grvReportsButton").click(function() {router.gtr(appDefine.sid,appDefine.appLanguage,null);});
	$("#grvAddPatientButton").click(function() {router.gtc(appDefine.sid,appDefine.appLanguage,null,"addpatient");});
	
}

export function printLLContainer(){
	$(".cdisLLListContainer").printCDISLocalList();
	return true;
};

/**
 * PRIVATE functions
 * 
 */




function selectPatient(item){
	router.gtc(appDefine.sid,appDefine.appLanguage,$(item).attr("value"),"patient");
}

	
function drawUserDashboard(udb){
	var container = $(".cdisDashboardUser");
	var actions = $("<div>",{class:"cdisDashboardUserPanel5"}).appendTo(container);
	$.each(udb.actions,function(key,value){
		$("<div>",{class:"cdisDashboardUserSingleValue","data-toggle":"tooltip",title:"Number of "+value[1]+" in the last 30 days"})
			.append($("<div>",{class:"cdisDashboardUserSingleValueHeader"}).text(value[0]))
			.append($("<div>",{class:"cdisDashboardUserSingleValueValue"}).text(value[1]))
			.appendTo(actions);
	});
		
	var uh = udb.history.sort(genericlib.compareDateAsc);
	var p2 = $("<div>",{class:"cdisDashboardUserPanel2"}).appendTo(container);
	var history = $("<div>",{class:"cdisDashboardUserTableValue"}).appendTo(p2);
	$("<div>",{class:"cdisDashboardUserTableValueHeader"}).text("Last view patients (click to view details)").appendTo(history);
	$.each(uh,function(key,value){
		$("<div>",{class:"cdisDashboardUserTableValueLine",data:value[1]})
			.append($("<div>",{class:"cdisDashboardUserTableValueLabel"}).text(value[1]))
			.append($("<div>",{class:"cdisDashboardUserTableValueValue"}).text(value[0]))
			.appendTo(history)
			.click(function(){
					if(appDefine.isDemo){
						router.gtc(appDefine.sid,appDefine.appLanguage,value[2],"patient");
					}else{
						router.gtc(appDefine.sid,appDefine.appLanguage,value[1],"patient");
					}
			});
		});
		let gcont = $("<div>",{class:"cdisActivityGraph"}).appendTo(p2);
		$("<canvas>",{id:"grvActivityGraph"}).appendTo(gcont);
		const ctx = document.getElementById('grvActivityGraph').getContext('2d');
		console.log(udb.activity);
		var uact = udb.activity;
		const labels = [];
		const serie = [];
		uact.sort(genericlib.compareDateAsc);
		$.each(uact,function(key,value){
			serie.push(value[1]);
			labels.push(value[0]);
		});
		
		const data = {
		  labels: labels,
		  datasets: [
		    {
		      label: 'Activity Events',
		      data: serie,
		      borderColor: "rgba(255, 99, 132, 0.2)",
		      backgroundColor: "rgba(255, 99, 132, 1)",
		    }
		  ]
		};
		
		const config = {
		  type: 'bar',
		  data: data,
		  options: {
		    responsive: true,
			maintainAspectRatio: false,
		    plugins: { legend: { position: 'top'}, title: { display: false, text: 'User Activity'}},
			scales: {y: { beginAtZero: true } } // Ensure the y-axis starts at zero
		  },
		};
		new Chart(ctx,config);
		
}


function openLinkPatientsList(){
	$(".cdisPersonalPatients table").toggle();
	if($(".cdisPersonalPatients table").is(":visible")){
		$("#grvLinkedPatientsButton").text("Close Patient List");
	}else{
		$("#grvLinkedPatientsButton").text("Open Patient List");
	}
}	


function getFilterFromString(str){
	var result = {};
	var parts = str.split("&");
	$.each(parts, function(i,v){
		var ps = v.split("=");
		if(ps[0].indexOf("ramq") < 0 && ps[0] != "" && ps[0]!="fll"){
			result[ps[0].replace("fll_","")] = ps[1];
		}
	});
	return result;
}