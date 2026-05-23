import { shareData } from "../themes/default/sections/cdis/define.js";
import { appDefine } from "./define.js";
import * as genericlib from './genericlib.js';
import * as router from './router.js';

export function getPatientInfo(idpatient){
	var pObj = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getPatientInfo?idpatient="+idpatient+"&language="+appDefine.appLanguage,
		  type: "GET",
		  async: false,
		  dataType: "json"
		});
		request.done(function( json ) {
			pObj = json.objs[0];
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return pObj;
}


export function getPatientRecord(key,value){
	let result = null;
	/* key may be ramq or idpatient	 */
	var patient = $.ajax({
		  url: "/ncdis/service/data/getPatientRecord?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&"+key+"="+value,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		patient.done(function( json ) {
			appDefine.patientObjectArray = json.objs;
			console.log(appDefine.patientObjectArray);
			if(appDefine.isDemo){appDefine.patientObjectArray = demoData(appDefine.patientObjectArray,"patient");}
			result = appDefine.patientObjectArray[0];
		});
		patient.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;	
}


export function demoData(dataObject, context){
	if(context == "search"){
		var obArr = dataObject.objs;
		var term = $("#search").text();
		$.each(obArr, function(i,ob){
			ob.lastname = "Patient "+i;
			ob.firstname = "Full name";
			ob["realramq"] = ob.ramq; 
			//ob.ramq = makelid(4)+makenid(8);
			ob.ramq = "XXXX12345678";
			//ob.chart = makenid(4);
			ob.chart = "0000";
			//ob.giu = makenid(5);
			ob.giu = "1111";
		});
		dataObject["objs"] = obArr;
	}else if(context == "userdashboard"){
		$.each(dataObject.history, function(i,ob){
			ob[2] = ob[1];
			ob[1] = "XXXX12345678";
		});
	} else if(context == "userpatients"){
		$.each(dataObject, function(i,ob){
			ob.fullname = "Full name" + " Patient "+i ;
			ob["realramq"] = ob.ramq;
			//ob.ramq = makelid(4)+makenid(8);
			ob.ramq = "XXXX12345678";
			//ob.chart = makenid(4);
			ob.chart = "0000";
		});
	}else if(context == "patient"){
		dataObject[0].fname = "First name";
		dataObject[0].lname = "Last name";
		//dataObject[0].chart = makenid(4);
		dataObject[0].chart = "0000";
		//dataObject[0].ramq = makelid(4)+makenid(8);
		dataObject[0].ramq = "XXXX12345678";
		//dataObject[0].dob = moment(new Date(+(new Date()) - Math.floor(Math.random()*10000000000))).format('MM/DD/YYYY');
		dataObject[0].dob = "01-01-2022";
		//dataObject[0].jbnqa = makenid(5);
		dataObject[0].jbnqa = "99999";
		//dataObject[0].giu = makenid(5);
		dataObject[0].giu = "1111";
	}
	
	return dataObject;
}

export function getPatientObjectData(dataName){
	let result = {};
	if(dataName == "mdvisits"){
		result = appDefine.patientObjectArray[3];
	}else if(dataName == "lab"){
		result = appDefine.patientObjectArray[6];
	}else if(dataName == "lipid"){
		result = appDefine.patientObjectArray[5];
	}else if(dataName == "renal"){
		result = appDefine.patientObjectArray[4];
	}else if(dataName == "complications"){
		result = appDefine.patientObjectArray[7];
	}else if(dataName == "meds"){
		result = appDefine.patientObjectArray[9];
	}else if(dataName == "miscellaneous"){
		result = appDefine.patientObjectArray[8];
	}else if(dataName == "depression"){
		result = appDefine.patientObjectArray[10];
	}else if(dataName == "diabet"){
		result = appDefine.patientObjectArray[2];
	}else if(dataName == "hcp"){
		result = appDefine.patientObjectArray[1];
	}else if(dataName == "record"){
		result = appDefine.patientObjectArray[0];
	}
	return result;
}


export function getValueSectionArray(section, value){
	let result = [];
	let objSection = getPatientObjectData(section);
	let objValue = eval("objSection."+value);
	if(typeof(objValue) != 'undefined'){
		result = objValue.values;
	}
	return result;
}


export function getValueLimits(valueName){
	let result = null;
	
	if(typeof(appDefine['limits_'+valueName]) != 'undefined'){
		result = appDefine['limits_'+valueName];
	} 
	return result;
}

//ideal ar trebuii sa avem un callback la functie ca sa facem ceva dupa ce stergem  
export function deleteValue(idvalue){
	let result = false
	var idPatient = appDefine.patientObjectArray[0].idpatient;
	
	var value = $.ajax({
		  url: "/ncdis/service/data/deleteValue?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&idvalue="+idvalue+"&idpatient="+idPatient,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
	});
	value.done(function( json ) {
		appDefine.patientObjectArray = json.objs;
		result = true;
	});
	value.fail(function( jqXHR, textStatus ) {
		 alert( "Request failed: " + textStatus );
	});
	return result;	
}

export function saveValue(idvalue,valueName,dValue,vValue){
	let result = false;
	
	console.log(idvalue,valueName,dValue,vValue)
	
	var idPatient = appDefine.patientObjectArray[0].idpatient;
	if(valueName == "hba1c"){
		if(vValue >= 1){
			vValue = (vValue / 100).toFixed(3);
		}
	}
	if(vValue.indexOf(",") >= 0 ){
		vValue = vValue.replace(",",".");
	}
	
	var valueResult = $.ajax({
		  url: "/ncdis/service/data/saveValue?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&valueName="+valueName+"&value="+vValue+"&date="+dValue+"&idpatient="+idPatient+"&idvalue="+idvalue,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	valueResult.done(function( json ) {
			appDefine.patientObjectArray = json.objs;
			result = true;
		});
	valueResult.fail(function( jqXHR, textStatus ) {
	  alert( "Request failed: " + textStatus );
	});	
	return result;
}


export function searchPatient(query, callback) {
	let criteria = appDefine.criteriaSearchPatientObject.getValue();
	let term = query;
		$.ajax({
			url: "/ncdis/service/data/searchPatient",
			dataType: "json",
			data: {
				criteria: criteria,
				term: term,
				language: appDefine.appLanguage,
				sid: appDefine.sid
			},
			success: function( data ) {
				//callback(data.objs);
				/**/
				if(appDefine.isDemo){data = demoData(data,"search");}
				callback($.map( data.objs, function( item ) {
					return {
						idpatient : item.idpatient,
						lastname : item.lastname,
						firstname : item.firstname,
						chart : item.chart,
						ramq : item.ramq,
						realramq : (appDefine.isDemo)?item.realramq:item.ramq,
						community: item.community,
						giu: item.giu,
						criteria : criteria,
						term : term
					};
				}));
			}
	});
}

export function renderSearchPatientResult(results,query){
	const container = $('<div>',{class:"grvautocomplete-dropdown-container"});
	const $header = $('<div>',{class:"autocomplete-item-header"}).css("display","grid").css("grid-template-columns","100px auto 150px 150px 100px").appendTo(container);
	$header.append($("<label>").text("Chart")).append($("<label>").text("Full name")).append($("<label>").text("RAMQ")).append($("<label>").text("Community")).append($("<label>").text("IPM"));
	const $body = $('<div>',{class:"autocomplete-item-body"}).appendTo(container);
	results.forEach((item, index) => {
		const $item = $('<div>',{class:"autocomplete-item",id:item.idpatient, criteria:item.criteria, value:item.ramq})
		.css("display","grid").css("grid-template-columns","100px auto 150px 150px 100px");
	    const fullname = item.lastname+" "+item.firstname;
		$("<div>").appendTo($item).html((item.criteria == "chart")?genericlib.highlightMatch(item.chart, query):item.chart);
		$("<div>").appendTo($item).html((item.criteria == "fnamelname")?genericlib.highlightMatch(fullname, query):fullname);
		$("<div>").appendTo($item).html((item.criteria == "ramq")?genericlib.highlightMatch(item.ramq, query):item.ramq);
		$("<div>").appendTo($item).html(item.community);
		$("<div>").appendTo($item).html((item.criteria == "giu")?genericlib.highlightMatch(item.giu, query):item.giu);
		$body.append($item);
	});
	console.log(container)
	return container;	
}


export function getPatientNotes(){
	let result = null;
	var mes = $.ajax({
	  url: "/ncdis/service/data/getPatientNotes?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&ramq="+appDefine.patientObjectArray[0].ramq,
	  type: "GET",
	  async : false,
	  cache : false,
	  dataType: "json"
	});
	mes.done(function( json ) {
		result = json.objs[0];
	});
	mes.fail(function( jqXHR, textStatus ) {});
	return result;	
}


export function deletePatient(){
	let result = false;
	let data = "sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&idpatient="+appDefine.patientObjectArray[0].idpatient; 
	$.ajax({
	  url: "/ncdis/service/data/deletePatientRecord",
	  type: "POST",
	  data:data,
	  async : false,
	  cache : false,
	  dataType: "json"
	}).done(function( json ) {
		let msg = json.message;
		if(msg == "error"){
			alert("Error deleteing the patient.");
		}else{
			result = true;
			router.gts(appDefine.sid,appDefine.appLanguage);
		}
	}).fail(function( jqXHR, textStatus ) {
	  alert( "Request failed: " + textStatus );
	});
	return result;	
}





export function editPatient(formName) {
	let result = false;
	let idpatient = appDefine.patientObjectArray[0].idpatient;
	let ramqpatient = appDefine.patientObjectArray[0].ramq;
	let formObject = $("#"+formName);
	var data = "sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&idpatient="+idpatient;
	$.each($(formObject).find("div.value"),function(i,item){
		data+="&"+$(item).attr("id")+"="+$(item).attr("value");
	});
	$.ajax({
	  url: "/ncdis/service/data/savePatientRecord",
	  type: "POST",
	  async : false,
	  data: data,
	  dataType: "json"
	}).done(function( json ) {
		router.gtc(appDefine.sid,appDefine.appLanguage,ramqpatient,"patient");
		result = true;
	}).fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
	});

	return result;
}

export function addPatient(formName){
	let result = false;
	var data = "sid="+appDefine.sid+"&language="+appDefine.appLanguage;
	let formObject = $("#"+formName);
	$.each($(formObject).find("div.value"),function(i,item){
		data+="&"+$(item).attr("id")+"="+$(item).attr("value");
	});
	console.log(data)
	
	
	$.ajax({
	  url: "/ncdis/service/data/addPatientRecord",
	  type: "POST",
	  async : false,
	  data: data,
	  dataType: "json"
	}).done(function( json ) {
		router.gtc(appDefine.sid,appDefine.appLanguage,$("#ramq-value").val(),"patient");
		result = true;
	}).fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
	});
	return result;
}



export function getScheduleVisit(idp,idprofession){
	var result = null;
	if(idp !=null &&idp!="" && idprofession!=null && idprofession!=""){
		var request = $.ajax({
			  url: "/ncdis/service/action/getScheduleVisit?language="+appDefine.appLanguage+"&sid="+appDefine.sid+"&idpatient="+idp+"&idprofession="+idprofession,
			  type: "GET",
			  async : false,
			  cache : false,
			  dataType: "json"
			});
			request.done(function( json ) {
				result = json.objs[0];
			});
			request.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
	}
	return result;
}

export function setScheduleVisit(scheduleid,iduser,idpatient,scheduledate,idprofesion,frequency,zone){
	var mes = $.ajax({
		  url: "/ncdis/service/action/setScheduleVisit?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&idschedule="+scheduleid+"&iduser="+iduser+"&idpatient="+idpatient+"&scheduledate="+scheduledate+"&idprofesion="+idprofesion+"&frequency="+frequency+"&zone="+zone,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	mes.done(function( json ) {
		getPatientRecord("ramq",appDefine.patientObjectArray[0].ramq);	
	});
	mes.fail(function( jqXHR, textStatus ) {
	});	
}

export function deleteScheduleVisit(idpatient,idprofesion, hcptype, action){
	let data = "sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&idpatient="+idpatient+"&idprofesion="+idprofesion+"&hcpcode="+hcptype+"&action="+action;
	console.log(data)
	var mes = $.ajax({
		  url: "/ncdis/service/action/deleteScheduleVisit",
		  type: "POST",
		  data:data,
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	mes.done(function( json ) {
		//refresh patient object
		getPatientRecord("ramq",appDefine.patientObjectArray[0].ramq);
	});
	mes.fail(function( jqXHR, textStatus ) {});	
}


export function readPatientNote(noteid){
	var mes = $.ajax({
		  url: "/ncdis/service/action/readPatientNote?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&noteid="+noteid,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	mes.done(function( json ) {});
	mes.fail(function( jqXHR, textStatus ) {});	
}

export function deletePatientNote(noteid){
	var mes = $.ajax({
		  url: "/ncdis/service/action/deletePatientNote?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&noteid="+noteid,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	mes.done(function( json ) {});
	mes.fail(function( jqXHR, textStatus ) {});	
}

export function savePatientNote(option,message,idtouser,callback) {
	console.log(option,message,idtouser);
	if(option == "self") idtouser = appDefine.userObject.iduser;
	let data ="&sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&ramq="+appDefine.patientObjectArray[0].ramq+"&iduserto="+idtouser+"&note="+encodeURIComponent(message);
	$.ajax({
		  url: "/ncdis/service/data/setPatientNotes",
		  method: 'POST',
		  async : false,
		  data: data,
		  cache : false,
		  dataType: "json"
	})
	.done(function( json ) {callback()})
	.fail(function( jqXHR, textStatus ) {});
}

