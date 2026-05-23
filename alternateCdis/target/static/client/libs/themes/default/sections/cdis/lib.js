import * as applib from './../../../../js/applib.js';
import * as router from './../../../../js/router.js';
import * as userlib from './../../../../js/userlib.js';
import * as patientlib from './../../../../js/patientlib.js';
import * as genericlib from './../../../../js/genericlib.js';
import * as graphlib from './../../../../js/graphlib.js';
import * as aclib from './apilib.js';
import {grvpopup} from './../../modules/grvpopup.js';
import {grvradio} from './../../modules/grvradio.js';
import {grvautocomplete} from './../../modules/grvautocomplete.js';
import {grvlist} from './../../modules/grvlist.js';
import {grvvalidation} from './../../modules/grvvalidation.js';
import {grvdatepicker} from './../../modules/grvdatepicker.js';
import {grvsurvey} from './../../modules/grvsurvey.js';
import {appDefine} from './../../../../js/define.js'; //define global variables
import {shareData} from './define.js'; //define global variables
import sectionconfig from './config.json' with { type: 'json' };
import { grvwidget } from '../../modules/grvwidget.js';
import { grvtabs } from '../../modules/grvtabs.js';

/**
 * PUBLIC FUNCTIONS
 *  */	

export function initPage(){
	console.log(appDefine.userObject)
	let configlist = {direction:'v',
						open:0,
						container:"grvList", 
						elements:[
							{label:'CHART',value:'chart',active:1},
							{label:'RAMQ',value:'ramq',active:0},
							{label:'NAME',value:'fnamelname',active:0},
							{label:'IPM',value:'giu',active:0}
						]
					};
		
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
		userlib.refreshUserNotes(appDefine.sid);
		
		if(appDefine.userNotes.length > 0){
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
		
		$(".cdisFooterRight").hover(function(){$(".cdisExpandMenu").toggle();},function(){$(".cdisExpandMenu").toggle();});
		$(".cdisFreports").click(function() {router.gtr(appDefine.sid,appDefine.appLanguage,null);});
		$(".cdisFlogout").click(function() {userlib.logoutUser(appDefine.sid);});
		$(".cdisFsearch").click(function() {router.gts(appDefine.sid,appDefine.appLanguage);});
		$(".cdisFnew").click(function() {
			var plus = "&frompage="+appDefine.page;
			if(appDefine.page == "cdis")plus = plus+"&fr="+appDefine.patientObjectArray[0].ramq;
			router.gtc(appDefine.sid,appDefine.appLanguage,null,"addpatient",plus);
		});
		shareData.section = router.getParameterByName("section");
		applib.loadRessourcesUi(sectionconfig,shareData.section,$(".cdisPage"),initSection);
}

export function deleteTableValues(ids){
	let result = false;
	let parts = ids.split(",");
	let radiovalue = "";
	$.each(shareData.radios, function(i,o){if(o.name == "deleteTableValues")radiovalue = o.object.getValue();});
	if(radiovalue != ""){
		if(radiovalue.indexOf(",") >= 0){
			//we have multiple data to delete
			let f = true;
			let rvparts = radiovalue.split(",");
			$.each(rvparts,function(i,rvpart){
				$.each(parts,(j,part)=>{
					if(part.indexOf(rvpart) >=0){
						let ps = part.split("_");
						if(ps[1] != "")f = f && patientlib.deleteValue(ps[1]);
					}
				});
			});
			result = f;
		}else{
			let b = true;
			$.each(parts,(j,part)=>{
				if(part.indexOf(radiovalue) >=0){
					let ps = part.split("_");
					if(ps[1] != "")b = b && patientlib.deleteValue(ps[1]);
				}
			});
			result = b;
		}
		console.log("result "+result);
		console.log(ids)
		if(result){
			let widgetName = "";
			let w =[];
			$.each(parts,(j,part)=>{
				if(part.indexOf("_") >=0){
					let ps = part.split("_");
					w.push(ps[0]);
				}
			});
			widgetName = w.join(",");
			$.each(shareData.widgets, function(i,o){
				if(o.name == widgetName){
					setTimeout(()=>{o.object.redraw()},500);
				}
			});
		}
		
		return result;	
	}else{
		//return rien because either you click on close or you choose a value
	}
}


export function deleteGraphValues(ids){
	let result = false;
	ids = ids.replace(",","");
	let b = true;
	let ps = ids.split("_");
	if(ps[1] != "")b = b && patientlib.deleteValue(ps[1]);
	result = b;
	if(result){
		let widgetName = ps[0];
		$.each(shareData.widgets, function(i,o){
			if(o.name == widgetName){
				setTimeout(()=>{o.object.redraw()},1000);
			}
		});
	} 
	return result;	
}



function selectPatient(item){
	router.gtc(appDefine.sid,appDefine.appLanguage,$(item).attr("value"),"patient");
}


function initSection(){
	appDefine.pageHeight = $(".cdisPage").height();
	if(shareData.section == "patient")initPatientSection();
	if(shareData.section == "editpatient")initEditPatientSection();
	if(shareData.section == "addpatient")initAddPatientSection();
	if(shareData.section == "mdvisits")initSectionCdis();
	if(shareData.section == "schedulevisits")initSectionCdis();
	if(shareData.section == "lab")initSectionCdis();
	if(shareData.section == "renal")initSectionCdis();
	if(shareData.section == "lipid")initSectionCdis();
	if(shareData.section == "miscellaneous")initSectionCdis();
	if(shareData.section == "meds")initSectionCdis();
	if(shareData.section == "complications")initSectionCdis();
	if(shareData.section == "notes")initSectionCdis();
	if(shareData.section == "depression")initSectionCdis();
}	




function initSectionCdis(){
	initMenu();
	if(shareData.section == "renal" || shareData.section == "lab" || shareData.section == "lipid"){
		let h = appDefine.pageHeight - 180;
		if(shareData.section == "renal") $("div [type='grvwidget']").css("height",(h/3)+"px")
		else $("div [type='grvwidget']").css("height",(h/2)+"px")
	}
	if(shareData.section == "schedulevisits" || shareData.section == "notes"){
		if(shareData.section == "schedulevisits"){drawPatientSchedule();}
		if(shareData.section == "notes"){drawPatientNotes();}
	}else if(shareData.section == "depression"){
		populateWidgets();
		drawPatientDepression();
	}else{
		populateWidgets();
	}
	populateRecord();
	populatePageside();
}





function initMdvisitsSection(){
	/*
	$("#survey").on("click",function(){
		const config = {container:"surveyTest",surveyid:"test1",iduser:appDefine.userObject.iduser,date:genericlib.formatDate(new Date(), "yyyy-mm-dd")};
		const s = new grvsurvey(config);
	});
	*/
}


function initMenu(){
	applib.loadRessourcesUi(sectionconfig,"menu",$("#grvMenu"),()=>{
		const menuContainer = $("#grvSectionsMenu");
		$.each(menuContainer.children(),(i,item)=>{
			if($(item).attr("section") == shareData.section)$(item).addClass("selected");
			const section = $(item).attr("section");
			$(item).on("click",()=>{router.gtc(appDefine.sid,appDefine.appLanguage,appDefine.patientObjectArray[0].ramq,section);}); 
		});	
	});
}


		
function initPatientSection(){
	drawPatientRecord();
	let h = appDefine.pageHeight - 80;
	$("div [type='grvwidget']").css("height",(h/2)+"px")
	drawABCGraphs();
	populatePageside();
	
}

function drawABCGraphs(){
	const containers = $("div [type='grvwidget']");
	console.log(containers)
	$.each(containers, function(index,container){
		let d = $(container).attr("data");
		if(d.indexOf("|") >= 0){
			const condition = $(container).attr("condition");
			d = validateCondition(d,"renal|renal",condition);
			$(container).attr("data",d);
		}
		const w = new grvwidget(d);
		shareData.widgets.push({name:d,object:w});
	});
}


function validateCondition(valueName, section, condition){
	var partsName  = valueName.split('|');
	var partsSection  = section.split('|');
	let result = "";
	if(condition == 'last'){
		var valArray1 = patientlib.getValueSectionArray(partsSection[0], partsName[0]);
		var valArray2 = patientlib.getValueSectionArray(partsSection[1], partsName[1]);
		var objVal1 = {date:'1900-01-01'};
		var objVal2 = {date:'1900-01-01'};
		
		if(valArray1.length > 0 && valArray2.length > 0){
			objVal1 = valArray1[0];
			objVal2 = valArray2[0];
		}else if(valArray1.length > 0 && valArray2.length < 0){
			objVal1 = valArray1[0];
		}else if(valArray1.length < 0 && valArray2.length > 0){
			objVal2 = valArray2[0];
		}
		
		var d1 = "";
		var d2 = "";
		if(objVal1.date != null && objVal1.date != 'NULL'){
			result =  partsName[0];
			d1 = new Date(objVal1.date);
			
		}
		
		if(objVal2.date != null && objVal2.date != 'NULL'){
			result =  partsName[1];
			d1 = new Date(objVal2.date);	
		}
		
		if(typeof d1 == "object" && typeof d2 == "object"){
			if(d1 > d2)result = partsName[0];
			else result = partsName[1];
		}
		if(result == "")result = partsName[0]; //if both empty return first value
		return result;
	}
}

function initEditPatientSection(){
	$(".cdisPanelSectionEditPatient").fadeIn(350);
	$(".cdisFnew").hide();
	$(".cdisFreports").hide();
	
	$(appDefine.communities).each(function(index, value) {
		if(index > 0){
			$("#idcommunity-value").append($("<option />").val(index).text(value));	
		}
	});
	$(appDefine.diabetes).each(function(index, value) {
		$("#dtype-value").append($("<option />").val(index).text(value));
	});
	
	
	let patientObj = patientlib.getPatientObjectData("record");
	let diabetObj = patientlib.getPatientObjectData("diabet");
	console.log(diabetObj)
	if(patientObj.deceased == 1){
		$("#deceased-section").show();
	}else{
		$("#deceased-section").hide();
	}
	
	initAutocompleteHcp("grvChr");
	initAutocompleteHcp("grvMd");
	initAutocompleteHcp("grvNur");
	initAutocompleteHcp("grvNut");
	
	const rsexconfig = {container:"radio-sex",elements:[{label:"Male",value:"1",default:1},{label:"Female",value:"2",default:0}]};
	let rsex = new grvradio(rsexconfig);
	shareData.radios.push({name:rsexconfig.container,object:rsex});
	const rcreeconfig = {container:"radio-cree",elements:[{label:"Cree",value:"1",default:1},{label:"Non Cree",value:"0",default:0}]};
	let rcree = new grvradio(rcreeconfig);
	shareData.radios.push({name:rcreeconfig.container,object:rcree});
	const rdeadconfig = {container:"radio-deceased",elements:[{label:"Yes",value:"1",default:1},{label:"No",value:"0",default:0}]};
	let rdead = new grvradio(rdeadconfig);
	shareData.radios.push({name:rdeadconfig.container,object:rdead});
	rdead.on("change",function(){
		if(rdead.getValue() == 1)$("#deceased-section").show();
		if(rdead.getValue() == 0)$("#deceased-section").hide();
	});
	
	//resetForm($("#grvEditPatientForm"));
	populateForm($("#grvEditPatientForm"), prepareData(patientObj));
	populateForm($("#grvEditPatientForm"), prepareData(diabetObj));
	
	
	const ddate= new grvdatepicker($("#ddate-value"),{defaultDate:$("#ddate-value").val()});
	shareData.datepickers.push({name:"ddate",object:ddate});
	const dobdate= new grvdatepicker($("#dob-value"),{defaultDate:$("#dob-value").val()});
	shareData.datepickers.push({name:"dob",object:dobdate});
	const doddate= new grvdatepicker($("#dod-value"),{defaultDate:$("#dod-value").val()});
	shareData.datepickers.push({name:"dod",object:doddate});
	
	
	var hcpObject = getHcpObject();
	populateForm($("#grvEditPatientForm"), hcpObject);
	
	//disable ramq so it cannot be modified
	$("#ramq-value").prop("disabled",true);
	
	$("#grvEditPatientCancelButton").on("click",function() {router.gtc(appDefine.sid,appDefine.appLanguage,patientObj.ramq,"patient");});
	$("#grvEditPatientSaveButton").on("click",{action:"edit"},showEditPatientConfirm);
	$("#grvEditPatientDeleteButton").on("click",deletePatientPopup);
}


function initAddPatientSection(){
	$(".cdisPanelSectionAddPatient").fadeIn(350);
	$(".cdisFnew").hide();
	$(".cdisFreports").hide();
	
	$(appDefine.communities).each(function(index, value) {
		if(index > 0){$("#idcommunity-value").append($("<option />").val(index).text(value));}
	});
	$(appDefine.diabetes).each(function(index, value) {
		$("#dtype-value").append($("<option />").val(index).text(value));
	});
	
	$("#deceased-section").hide();
	initAutocompleteHcp("grvChr");
	initAutocompleteHcp("grvMd");
	initAutocompleteHcp("grvNur");
	initAutocompleteHcp("grvNut");
	
	const rsexconfig = {container:"radio-sex",elements:[{label:"Male",value:"1",default:1},{label:"Female",value:"2",default:0}]};
	let rsex = new grvradio(rsexconfig);
	shareData.radios.push({name:rsexconfig.container,object:rsex});
	const rcreeconfig = {container:"radio-cree",elements:[{label:"Cree",value:"1",default:1},{label:"Non Cree",value:"0",default:0}]};
	let rcree = new grvradio(rcreeconfig);
	shareData.radios.push({name:rcreeconfig.container,object:rcree});
	const rdeadconfig = {container:"radio-deceased",elements:[{label:"Yes",value:"1",default:0},{label:"No",value:"0",default:1}]};
	let rdead = new grvradio(rdeadconfig);
	shareData.radios.push({name:rdeadconfig.container,object:rdead});
	rdead.on("change",function(){
		if(rdead.getValue() == 1)$("#deceased-section").show();
		if(rdead.getValue() == 0)$("#deceased-section").hide();
	});
	
	
	const ddate= new grvdatepicker($("#ddate-value"));
	shareData.datepickers.push({name:"ddate",object:ddate});
	const dobdate= new grvdatepicker($("#dob-value"));
	shareData.datepickers.push({name:"dob",object:dobdate});
	const doddate= new grvdatepicker($("#dod-value"));
	shareData.datepickers.push({name:"dod",object:doddate});
	
	$("#grvAddPatientCancelButton").on("click",function() {
		let fp = router.getParameterByName("frompage");
		if(fp != ""){
			if(fp == "cdis"){
				let r = router.getParameterByName("fr");
				router.gtc(appDefine.sid,appDefine.appLanguage,r,"patient");
			}else{
				router.gts(appDefine.sid,appDefine.appLanguage);
			}
		}else{
			router.gts(appDefine.sid,appDefine.appLanguage);
		}
	});
	$("#grvAddPatientSaveButton").on("click",{action:"add"},showEditPatientConfirm);
}



function showEditPatientConfirm(event){
	$("#grvErrorTextEditPatient").html("");
	const v = new grvvalidation();
	let genderValue = "";
	$.each(shareData.radios, function(i,o){if(o.name == "radio-sex")genderValue = o.object.getValue();});
	
	let dobValue = "";
	$.each(shareData.datepickers, function(i,o){if(o.name == "dob")dobValue = o.object.getValue();});
	
	let validRamq = v.validateRamq($("#ramq-value"),$("#lname-value").val(),$("#fname-value").val(),genderValue,dobValue);
	let validChart = v.checkEmpty($("#chart-value"), "Chart number cannot be empty!") && v.checkNumbers($("#chart-value"),"Chart number must be numerical!");
	
	let ddateValue = "";
	$.each(shareData.datepickers, function(i,o){if(o.name == "ddate")ddateValue = o.object.getValue();});
	let validDiabet = v.validateDiabet($("dtype-value").val(),ddateValue);
	
	let deceasedValue = "";
	let deceasedDateValue = "";
	let decesedCauseValue = $("#dcause-value").val();
	$.each(shareData.radios, function(i,o){if(o.name == "radio-deceased")deceasedValue = o.object.getValue();});
	$.each(shareData.datepickers, function(i,o){if(o.name == "dod")deceasedDateValue = o.object.getValue();});
	
  	let validDeceased = v.validateDeceased(deceasedValue, deceasedDateValue, decesedCauseValue);
	
  	if(validRamq && validChart && validDiabet  &&  validDeceased){
		let p = applib.getTemplatePath("editpatientconfirm",sectionconfig);
		var txt = applib.getTemplateContent(p);
		let action = event.data.action;
		let btext = (action=="edit")?"Confirm edit patient":"Confirm add patient";
		let bt = (action=="edit")?"Edit patient":"Add patient";
		let ba = (action=="edit")?"editPatient":"addPatient";
		let bc = (action=="edit")?"#grvEditPatientForm":"#grvAddPatientForm";
		let config = {
				width:500,
				height:620,
				container:"grvWraper",
				buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"},
						{"text":btext,"action":ba,"alias":"patientlib","params":["grvPatientConfirm"]}],
				content:txt,
				title:bt
		}
		shareData.pagepopup = new grvpopup(config);
		setTimeout(function(){populateConfirm($(bc));},100)
		
  	}
}


function populateConfirm(formObject){
	let confirmFormChildren = $("#grvPatientConfirm .value");
	$.each(confirmFormChildren, function(i,element){
		let name = $(element).attr("id");
		let value = formObject.find("#"+name+"-value").val();
		let type = $(element).attr("type");
		if(type == "text"){
			$(element).text(value);
			$(element).attr("value",value);
		}else if(type == "select"){
			if(name == "idcommunity")$(element).text(appDefine.communities[value]);
			if(name == "dtype")$(element).text(appDefine.diabetes[value]);
			$(element).attr("value",value);
		}else if(type == "grvradio"){
			let rvalue = "";
			$.each(shareData.radios, function(i,o){if(o.name == "radio-"+name)rvalue = o.object.getValue();});
			if(name == "sex")$(element).text(appDefine.genders[rvalue]);
			if(name == "cree")$(element).text(appDefine.crees[rvalue]);
			if(name == "deceased"){
				$(element).text(appDefine.deceases[rvalue]);
				if(rvalue == 0)$(".deceasedCondition").css("display","none");
			};
			$(element).attr("value",rvalue);
		}else if(type == "grvdatepicker"){
			let rvalue = "";
			$.each(shareData.datepickers, function(i,o){if(o.name == name)rvalue = o.object.getValue();});
			$(element).text(rvalue);
			$(element).attr("value",rvalue);
		}else if(type == "grvautocomplete"){
			//autocompletes come with an hidden value id
			let rvalue = "";
			let hrvalue = formObject.find("#"+name).val();
			$.each(shareData.achcp, function(i,o){if(o.name == "grv"+name)rvalue = o.object.getValue();});
			$(element).text(rvalue);
			if(rvalue == "") $(element).attr("value","0");
			else $(element).attr("value",hrvalue);
		}
	})
}


function getHcpObject(){
	var hcpObject = patientlib.getPatientObjectData("hcp");
	$(appDefine.users).each(function(k,v){
		if(hcpObject.chr != null && hcpObject.chr != "" && hcpObject.chr != "0" ){
			if(v.iduser == hcpObject.chr){
				hcpObject["chr"] = (genericlib.capitalizeFirstLetter((v.firstname).toLowerCase())+" "+genericlib.capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["chrid"] = v.iduser;
			}
		}else{
			hcpObject["chr"] = "";
			hcpObject["chrid"] = "";
		}
		if(hcpObject.md != null && hcpObject.md != "" &&  hcpObject.md != "0"){
			if(v.iduser == hcpObject.md){
				hcpObject["md"] = (genericlib.capitalizeFirstLetter((v.firstname).toLowerCase())+" "+genericlib.capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["mdid"] = v.iduser;
			}
		}else{
			hcpObject["md"] = "";
			hcpObject["mdid"] = "";
		}
		if(hcpObject.nur != null && hcpObject.nur != "" && hcpObject.nur != "0"){
			if(v.iduser == hcpObject.nur){
				hcpObject["nur"] = (genericlib.capitalizeFirstLetter((v.firstname).toLowerCase())+" "+genericlib.capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["nurid"] = v.iduser;
			}
		}else{
			hcpObject["nur"] = "";
			hcpObject["nurid"] = "";
		}
		if(hcpObject.nut != null && hcpObject.nut != "" && hcpObject.nut != "0"){
			if(v.iduser == hcpObject.nut){
				hcpObject["nut"] = (genericlib.capitalizeFirstLetter((v.firstname).toLowerCase())+" "+genericlib.capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["nutid"] = v.iduser;
			}
		}else{
			hcpObject["nut"] = "";
			hcpObject["nutid"] = "";
		}
	});
	return hcpObject;
}



function prepareDecesed(data){
	/*deceased tratment*/
	if($.type(data.dod) != "undefined" ){
		var d = {deceased: 0};
		var dodFlag = false;
		var dcauseFlag = false;
		if(data.dod == "" || data.dod == "NULL" || data.dod == null){
			dodFlag = false;
		}else{
			dodFlag = true;
		}
		if(data.dcause == "" || data.dcause == "NULL" || data.dcause == null){
			dcauseFlag = false;
		}else{
			dcauseFlag = true;
		}
		
		if(dodFlag || dcauseFlag){
			d.deceased = 1;
			$.extend(true,data,d);
		}else{
			d.deceased = 0;
			$.extend(true,data,d);
		}

	}
	return data;
}

function prepareDiabet(data){
	if($.type(data.dtype) != "undefined" ){
		$.each(data.dtype.values, function(index, obj){
			if(obj.value == "10"){
				data.dtype.values[index].value = "3";
			}
			if(obj.value == "11"){
				data.dtype.values[index].value = "4";
			}
			data.dtype.values[index]["dtype"] = data.dtype.values[index].value;
			data.dtype.values[index]["ddate"] = data.dtype.values[index].date;
		});
	}
	console.log("diabet data")
	console.log(data)
	return data;
}

function prepareData(data){
	data = prepareDecesed(data);
	data = prepareDiabet(data);
	return data;
}

function populateForm($form, data){
    $.each(data, function(key, value) {
    	if(typeof value == "object" && value != null){
    		populateForm($form, value.values[0]);
    	}else{
    		
            var $ctrl = $form.find('[name='+key+']');
            var $ctrlHidden = $form.find('[name='+key+'-hidden]');
			if($ctrlHidden.length > 0 ){$ctrlHidden.val(value);}
            if ($ctrl.is('select')){
                $('option', $ctrl).each(function() {
                    if (this.value == value)
                        this.selected = true;
                });
            } else if ($ctrl.is('textarea')) {
                $ctrl.val(value);
            } else {
                switch($ctrl.attr("type")) {
                    case "text":
						console.log(key,value);
						$ctrl.val(value);
						break;
                    case "checkbox":
                        if (value == '1')
                            $ctrl.prop('checked', true);
                        else
                            $ctrl.prop('checked', false);
                        break;
                    case "grvradio":
                    	$.each(shareData.radios,function(i,obj){
							if(obj.name == "radio-"+key){
								obj.object.setValue(value);
							}
						})
                    break;
					case "grvautocomplete":
						console.log(data)
                    	$.each(shareData.achcp,function(i,obj){
							let n = obj.name;
							if(n.toLowerCase() == "grv"+key){
								obj.object.input.val(value);
							}
						})
                    break;
                } 
            }
    	}
    	
    });
}



function initAutocompleteHcp(id){
	let f = null;
	let r = null;
	if(id == "grvMd"){f=searchMdHcp;r=renderMdHcp;}
	if(id == "grvChr"){f=searchChrHcp;r=renderChrHcp;}
	if(id == "grvNut"){f=searchNutHcp;r=renderNutHcp;}
	if(id == "grvNur"){f=searchNurHcp;r=renderNurHcp;}
	let gacconfig = {container:id,
				delay:200,
				highlight:true,
				minLenght:1,
				maxHeight:200,
				source:f,
				select:selectHcp,
				render:r
			}
	const ac = new grvautocomplete(gacconfig);
	shareData.achcp.push({name:id.toLowerCase(),object:ac});
}

function selectHcp(item){
	$("#"+$(item).attr("criteria")).val($(item).attr("id"));
}

function searchMdHcp(query, callback){aclib.searchHcp("md",query,callback);}
function searchChrHcp(query, callback){aclib.searchHcp("chr",query,callback);}
function searchNutHcp(query, callback){aclib.searchHcp("nut",query,callback);}
function searchNurHcp(query, callback){aclib.searchHcp("nur",query,callback);}

function renderMdHcp(results, query){return renderHcp("md",results,query);}
function renderChrHcp(results, query){return renderHcp("chr",results,query);}
function renderNutHcp(results, query){return renderHcp("nut",results,query);}
function renderNurHcp(results, query){return renderHcp("nur",results,query);}

function renderHcp(criteria,results,query){
	const container = $('<div>',{class:"grvautocomplete-dropdown-container"});
	//nu avem header
	const $body = $('<div>',{class:"autocomplete-item-body"}).appendTo(container);
	results.forEach((item, index) => {
		const $item = $('<div>',{class:"autocomplete-item",id:item.iduser, criteria:item.criteria, value:item.name})
		.css("display","grid").css("grid-template-columns","auto");
		if(criteria == item.criteria){
			//no highlight
			$("<div>").appendTo($item).html(item.name);	
		}	
		$body.append($item);
	});
	return container;
}

	
function drawPatientRecord(){
	var patientObj = appDefine.patientObjectArray[0];
	let fll = router.getParameterByName("fll");
	if(fll=='1'){
		//show back to local list button
		var fllramq =  router.getParameterByName("fll_ramq");
		var localramq =  router.getParameterByName("ramq");
		if(localramq == fllramq){
			$(".cdisfooter-fll").show();
			let fllstr = "&fll=1&fll_ramq="+router.getParameterByName("fll_ramq")+"&fll_age="+router.getParameterByName("fll_age")+"&fll_dp="+router.getParameterByName("fll_dp")+"&fll_dtype="+router.getParameterByName("fll_dtype")+"&fll_hba1c="+router.getParameterByName("fll_hba1c")+"&fll_idcommunity="+router.getParameterByName("fll_idcommunity")+"&fll_list="+router.getParameterByName("fll_list")+"&fll_sex="+router.getParameterByName("fll_sex")+"&fll_users="+router.getParameterByName("fll_users");
			$(".cdisfooter-fll").click(function(){
				router.gts(appDefine.sid,appDefine.appLanguage,fllstr);
			});
		}
	}
	if(appDefine.isDemo){$("#search").attr("type","password");}
	
	//$(".cdisFullButton").click(function(){router.gtc(appDefine.sid,appDefine.appLanguage,patientObj.ramq,"mdvisits",fllstr);});			
	$("#grvFullSections").on("click", function(){router.gtc(appDefine.sid,appDefine.appLanguage,patientObj.ramq,"mdvisits");});
	
	if(patientObj.dod != "" && patientObj.dod != null){
		$(".dead").css("display","block");
		$("#name_value").addClass("cdisDeceased");
	}else{
		$("#name_value" ).removeClass("cdisDeceased");
		$(".dead").css("display","none");
	}
			
	$(".cdisPatientRecordSummary .record").each(function( index ) {
		if($( this ).attr("id") == "name_value"){
			$(this).text(patientObj.lname +" "+patientObj.fname);
		}else if($( this ).attr("id") == "sex_value"){
			$(this).text(appDefine.genders[patientObj.sex]);
		}else if($( this ).attr("id") == "dtype_value"){
			$(this).text(appDefine.diabetes[appDefine.patientObjectArray[2].dtype.values[0].value]);
		}else if($( this ).attr("id") == "ddate_value"){
			$(this).text(appDefine.patientObjectArray[2].dtype.values[0].date);
		}else{
			var att = $( this ).attr("id");
			if(typeof(att) != "undefined"){
				att = att.replace("_value","");
				$(this).text(eval("patientObj."+att));
			}
		}
	});
			
	drawDiabetHistory();
	drawHcp();
}

function drawHcp(){
	var hcpObject = appDefine.patientObjectArray[1];
		console.log(appDefine.users)
		$.each(hcpObject,function(k,v){
			if(k != 'idpatient'){
				var n = '';
				$(appDefine.users).each(function(kk,vv){  
					if(vv.iduser == v){
						n = (genericlib.capitalizeFirstLetter((vv.firstname).toLowerCase())+" "+genericlib.capitalizeFirstLetter((vv.lastname).toLowerCase()));
					}
				});
				$("<tr>").append($("<td>",{class:"profession"}).text(appDefine.profession_object[k])).append($("<td>",{class:"name"}).text(n)).appendTo($("#grvHcp"));
			}
		}); 
}


function drawDiabetHistory(){
	/* diabet history table*/
	$("#grvDiabetHistory").empty();
	var dobj = appDefine.patientObjectArray[2];
	var vd = dobj.dtype.values;
	if(vd.length > 1){
		$("<tr>").append($("<td>",{colspan:3,class:"title"}).text("Diabetes history")).appendTo($("#grvDiabetHistory"));
		$("<tr>")
			.append($("<td>",{class:"header"}).text("Date"))
			.append($("<td>",{class:"header"}).text("Type of diabetes"))
			.append($("<td>",{class:"header",width:"20px"}).text(""))
			.appendTo($("#grvDiabetHistory"));
		$.each(vd,function(index,val){
			var linie = $("<tr>",{id:"diabetid-"+val.idvalue});
			var cdate = $("<td>",{class:"value"}).text(val.date);
			var ii = val.value;
			if(val.value == "10"){ii=3;}
			if(val.value == "11"){ii=4;}
						
			var ctype = $("<td>",{class:"value"}).text(appDefine.diabetes[ii]);
			var btype = $("<td>",{class:"value"});
			linie.append(cdate);
			linie.append(ctype);
			linie.append(btype);
			if(appDefine.userProfileObject.role.idrole == 1){
				var bb = $("<span>",{id:"diabet-"+val.idvalue}).html("<i class='fa fa-times-circle'></i>").appendTo(btype);
				let p = 
				bb.click(function(){
					let config = {
							width:300,
							height:220,
							container:sectionconfig.container,
							buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"},
									{"text":"Delete","action":"deleteValue","alias":"patientlib","params":[val.idvalue]}],
							content:"This type of diabetes will be permanently deleted. Are you sure ?",
							callback:drawDiabetHistory,
							title:"Delete diabet type"
					}
					shareData.pagepopup = new grvpopup(config);							
				});
			}
			$("#grvDiabetHistory").append(linie);
		});
	}else{
		/*only one diabetes type in history*/
		$("#grvDiabetHistory").hide();
	}
				
	$("#grvPatientRecordEditPatientButton").click(function() {
		if(appDefine.isDemo){
			var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>This function si not available in demo mode.</b></center></p>";
			let config = {
					width:300,
					height:250,
					container:sectionconfig.container,
					buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"}],
					content:txt,
					title:"CDIS Demo Mode"
			}
			shareData.pagepopup = new grvpopup(config);	
		}else{
			router.gtc(appDefine.sid,appDefine.appLanguage,appDefine.patientObjectArray[0].ramq,"editpatient");
		}
	});
}

function populateNotes(){
	const container = $("#grvMenu");
	if(shareData.section != "notes" && shareData.section != "patient" && shareData.section != "editpatient" && shareData.section != "addpatient" ){
		const noteContainer = $("<div>",{class:"cdisNote uss"}).appendTo(container);
		$("<div>",{class:"title"}).text("Patient Notes").appendTo(noteContainer);
		let notes = patientlib.getPatientNotes();
		let nn = 0;
		$.each(notes,function(index,objNote){
			var iduser = objNote.iduser;
			if(objNote.viewed == "0"){
				nn++;
				let user = userlib.getUserFromArray(iduser);
				$("<div>",{class:"note",id:"note-"+index})
					.append($("<span>",{class:"new"}).text("New message"))
					.append($("<span>",{class:"ts"}).text(genericlib.formatDate(new Date(objNote.notedate),"yyyy-mm-dd")))
					.append($("<br>"))
					.append($("<span>",{class:"author"}).text("From "+user.lastname+" "+user.firstname))
					.appendTo(noteContainer)
					.on("click",function(){router.gtc(appDefine.sid,appDefine.appLanguage,appDefine.patientObjectArray[0].ramq,"notes");});
				}
			
		});
		if(nn == 0){noteContainer.remove();}
	}
}


function populatePageside(){
	const container = $("#grvRight");
	let object = eval("shareData.recomandation_"+shareData.section);
	if(typeof object != "undefined"){
		aclib.loadRecomandation(object,container);
	}
	if(shareData.section != "patient" &&  shareData.section != "editpatient" && shareData.section != "addpatient" && shareData.section != "schedulevisits"){
		aclib.getPatientNextVisits();
	}
	setTimeout(populateNotes,100);
	//patientlib.getPatientNotes();
}

function populateRecord(){
	const container = $("#grvRight");
	const cr = $("<div>",{class:"cdisPatientRecord uss"}).appendTo(container);
	
	$("<div>",{class:"name"}).text(appDefine.patientObjectArray[0].lname+" "+appDefine.patientObjectArray[0].fname).appendTo(cr);
	$("<div>",{class:"row"})
		.append($("<div>",{class:"label"}).text("RAMQ"))
		.append($("<div>",{class:"value"}).text(appDefine.patientObjectArray[0].ramq))
		.appendTo(cr);
	$("<div>",{class:"row"})
		.append($("<div>",{class:"label"}).text("Chart #"))
		.append($("<div>",{class:"value"}).text(appDefine.patientObjectArray[0].chart))
		.appendTo(cr);
	$("<div>",{class:"row"})
		.append($("<div>",{class:"label"}).text("Community"))
		.append($("<div>",{class:"value"}).text(appDefine.patientObjectArray[0].community))
		.appendTo(cr);
	$("<div>",{class:"row"})
		.append($("<div>",{class:"label"}).text("Type of diabetes"))
		.append($("<div>",{class:"value"}).text(appDefine.diabetes[appDefine.patientObjectArray[2].dtype.values[0].value]))
		.appendTo(cr);
		
	$("<div>",{class:"row last"})
		.append($("<div>",{class:"label"}).text("Date of diagnostic"))
		.append($("<div>",{class:"value last"}).text(appDefine.patientObjectArray[2].dtype.values[0].date))
		.appendTo(cr);
	
}

function populateWidgets(){
	const containers = $("div [type='grvwidget']");
	$.each(containers, function(index,container){
		let d = $(container).attr("data");
		const w = new grvwidget(d);
		shareData.widgets.push({name:d,object:w});
	});
}

function deletePatientPopup() {
	let config = {
			width:300,
			height:220,
			container:"grvWraper",
			buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"},
					{"text":"Delete patient","action":"deletePatient","alias":"patientlib"}],
			content:"This action will permanently delete the patient record!",
			title:"Delete patient"
	}
	shareData.pagepopup = new grvpopup(config);
}

function editPatientSchedule(event){
	const hcpType = event.data.hcp;
	const hcpId = event.data.hcpid;
	const container = $("#"+hcpType+" .tbody");
	const hcontainer = $("#"+hcpType+" .thead");
	const bcontainer = $("#"+hcpType+" .tbutton");
	console.log(container)
	console.log("#"+hcpType+" .tbody");
	$("<div>",{class:"cdisCisButton"}).text("Save")
		.appendTo(bcontainer)
		.on("click",()=>{
			//scheduleid,iduser,idpatient,scheduledate,idprofesion,frequency,zone
			let iduser = ($("#"+hcpType+"-id").val() == "")?0:$("#"+hcpType+"-id").val();
			let idpatient = appDefine.patientObjectArray[0].idpatient;
			let sdate = ($("#"+hcpType+"-date").val() == "")?0:$("#"+hcpType+"-date").val();
			let idp = "";
			let frequency = ($("#"+hcpType+"-frequency").val() == "")?0:$("#"+hcpType+"-frequency").val();
			let zone = hcpType;
			$.each(appDefine.profession_index,(x,y)=>{if(y == hcpType)idp=x;})
			patientlib.setScheduleVisit("0",iduser,idpatient,sdate,idp,frequency,zone);
			console.log(iduser,idpatient,sdate,idp,frequency,zone)
			drawPatientSchedule();
		})
	$("<div>",{class:"cdisCisButton"}).text("Cancel")
		.appendTo(bcontainer)
		.on("click",(e)=>{
			container.find(".name").empty().text(hcontainer.attr("hcpname"));
			container.find(".date").empty().text(hcontainer.attr("hcpdate"));
			container.find(".frequency").empty().text(hcontainer.attr("hcpfrequency"));
			container.find(".button").css("pointer-events","auto");
			bcontainer.empty();
		});
	$.each(container.children(),(i,cell)=>{
		if($(cell).attr("class") == "name"){
			let n = $(cell).text();
			$(cell).empty();
			$("<div>",{type:"grvautocomplete",id:hcpType+"-input",name:hcpType})
				.css("height","35px")
				.css("width","220px")
				.appendTo($(cell));
			$("<input>",{type:"hidden",id:hcpType+"-id"}).appendTo($(cell)).val(hcpId);
			let f = null;
			let r = null;
			if(hcpType == "md"){f=searchMdHcp;r=renderMdHcp;}
			if(hcpType == "chr"){f=searchChrHcp;r=renderChrHcp;}
			if(hcpType == "nut"){f=searchNutHcp;r=renderNutHcp;}
			if(hcpType == "nur"){f=searchNurHcp;r=renderNurHcp;}
			
			let gacconfig = {container:hcpType+"-input",
							delay:200,
							highlight:true,
							minLenght:1,
							maxHeight:200,
							source:f,
							select:selectVisitHcp,
							render:r
						}
				const ac = new grvautocomplete(gacconfig);
				if(n !=""){ac.input.val(n);}
				shareData.achcp.push({name:hcpType+"-input",object:ac});
			
		}else if($(cell).attr("class") == "button"){
			$(cell).css("pointer-events","none");
		} else if($(cell).attr("class") == "date"){
			let n = $(cell).text();
			$(cell).empty();
			$("<input>",{type:"text",id:hcpType+"-date",autocomplete:"off"})
				.css("height","35px")
				.css("width","100px")
				.css("background","#efefef")
				.appendTo($(cell));
			const hcpdate= new grvdatepicker($("#"+hcpType+"-date"),{defaultDate:n});
			shareData.datepickers.push({name:hcpType+"-date",object:hcpdate});
		}else if($(cell).attr("class") == "frequency"){
			let n = $(cell).text();
			$(cell).empty();
			$("<input>",{type:"text",id:hcpType+"-frequency"})
				.css("height","35px")
				.css("width","50px")
				.css("background","#efefef")
				.val(n)
				.appendTo($(cell));
			
		}
	});
	
}

function selectVisitHcp(item){
	$("#"+$(item).attr("criteria")+"-id").val($(item).attr("id"));
}

export function deletePatientSchedule(params){
	let action = "";
	if(typeof params.data.action == "undefined"){
		$.each(shareData.radios,(i,o)=>{if(o.name == "deletePatientSchedule")action = o.object.getValue();})	
	}else{
		action = params.data.action;
	}
	let idp = params.data.idprofession;
	let hcpType = params.data.hcptype;
	console.log(hcpType)
	let idpatient = appDefine.patientObjectArray[0].idpatient;
	patientlib.deleteScheduleVisit(idpatient,idp,hcpType,action);
	drawPatientSchedule();
	return true;
}

function deletePatientSchedulePopup(event){
	let txt = "<p>Whould you like to delete the association with an HCP and scheduled visit?</p><div id='radio-data' type='grvradio'></div>";
	let rconfig =  {container:"radio-data",elements:[]};
	let elems = [];
	let params = {data:{idprofession:event.data.idprofession,hcptype:event.data.hcptype,objectname:"deletePatientSchedule"}};
	rconfig.elements.push({label:"Yes both",value:"both",default:0});
	rconfig.elements.push({label:"No, only scheduled visit",value:"visit",default:1});
	
	let config = {width:400,height:220,
		container:"grvWraper",
		buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"},
				 {"text":"Delete","action":"deletePatientSchedule","alias":"clib","params":[params]}],
		content:txt,
		title:"Delete value from table"
	}
	new grvpopup(config);
	setTimeout(function(){
		let r = new grvradio(rconfig);
		shareData.radios.push({name:"deletePatientSchedule",object:r});
	},300);
}


function drawPatientSchedule(){
	
	const containers = $("div [type='schedule']");
	let hcpObj = appDefine.patientObjectArray[1];
	$.each(containers,(i,container)=>{
		$(container).empty();
		let hcpType = $(container).attr("id");
		let hcp = eval("hcpObj."+hcpType);
		let idp = "";
		$.each(appDefine.profession_index,(x,y)=>{if(y == hcpType)idp=x;})
		let sv = patientlib.getScheduleVisit(hcpObj.idpatient,idp);
		$("<div>",{class:"header"})
			.appendTo($(container))
			.append($("<label>").text(appDefine.profession_object[hcpType]+" Scheduler"))
			.append($("<div>",{class:"cdisCisButton"}).html("<i class='fa-solid fa-plus'></i>").on("click",{hcpid:hcp,hcp:hcpType},editPatientSchedule))
		
		const body = $("<div>",{class:"body"}).appendTo($(container));
		const table = $("<div>",{class:"table"}).appendTo(body);
		const thead = $("<div>",{class:"thead"})
			.appendTo(table)
			.append($("<div>").text(appDefine.profession_object[hcpType]))
			.append($("<div>").text("Next visit date"))
			.append($("<div>").text("Frequency"))
			.append($("<div>"));
	
		const tbody = $("<div>",{class:"tbody"})
			.appendTo(table)
			.append($("<div>",{class:"name"}))
			.append($("<div>",{class:"date"}))
			.append($("<div>",{class:"frequency"}))
			.append($("<div>",{class:"button"}));
		$("<div>",{class:"tbutton"}).appendTo(body);
		if(!$.isEmptyObject(sv)){
			console.log(sv)
			let user = userlib.getUserFromArray(sv.iduser);
			tbody.find(".name").text(user.lastname+" "+user.firstname);
			tbody.find(".date").text(genericlib.formatDate(new Date(sv.datevisit),"yyyy-mm-dd"));
			tbody.find(".frequency").text(sv.frequency);
			
			thead.attr("hcpname", user.lastname+" "+user.firstname);
			thead.attr("hcpdate", genericlib.formatDate(new Date(sv.datevisit),"yyyy-mm-dd"));
			thead.attr("hcpfrequency", sv.frequency);
			$("#"+hcpType+" .header .cdisCisButton i").attr("class","fa-solid fa-pen");
			tbody.find(".button").append($("<i>",{class:"fa-regular fa-trash-can"}).on("click",{idprofession:idp,hcptype:hcpType},deletePatientSchedulePopup));
		}else if(hcp !="" && hcp !="0"){
			let user = userlib.getUserFromArray(hcp);
			tbody.find(".name").text(user.lastname+" "+user.firstname);
			thead.attr("hcpname", user.lastname+" "+user.firstname);
			$("#"+hcpType+" .header .cdisCisButton i").attr("class","fa-solid fa-pen");
			tbody.find(".button").append($("<i>",{class:"fa-regular fa-trash-can"}).on("click",{idprofession:idp,hcptype:hcpType,action:"both"},deletePatientSchedule));
		}
		
	});
}

function triggerPublicNote(object){
	if(object.getValue() == "user"){
		$(".cdisButtonArea .label label").show();
		$(".cdisButtonArea .select select").show();
	}else{
		$(".cdisButtonArea .label label").hide();
		$(".cdisButtonArea .select select").hide();
	}
}

function deleteNote(event){
	let idnote = event.data.idnote;
	patientlib.deletePatientNote(idnote);
	drawPatientNotesList($(".cdisNotesText"));
}

function saveNoteCallback(){
	$(".jqte_editor").empty();
	drawPatientNotesList($(".cdisNotesText"));
}


function drawPatientNotesList(container){
	container.empty();
	let notes = patientlib.getPatientNotes();
	console.log(notes);
	$.each(notes,function(index,objNote){
		if(objNote.iduserto == appDefine.userObject.iduser || objNote.iduserto == "0"){
			let iduser = objNote.iduser;
			let user = userlib.getUserFromArray(iduser);
			let userto = userlib.getUserFromArray(objNote.iduserto);
			let dateStr = genericlib.formatDate(new Date(objNote.notedate))
			let noteContainer = $("<div>",{class:"cdisNoteContainer"}).appendTo(container);
			let noteHeader = $("<div>",{class:"header"}).appendTo(noteContainer);
			let message = "";
			try{
				message = atob(objNote.note);
			}catch(error){
				console.log(error.message);
				message = objNote.note;
			}
			let noteBody = $("<div>",{class:"body"}).appendTo(noteContainer).html(message);
			if(objNote.viewed == "0"){
				$("<span>").text("New").css("color","red").css("font-weight","bold").appendTo(noteHeader);
			}else{
				$("<span>").appendTo(noteHeader);
			}
			$("<div>").text("["+dateStr+"]").appendTo(noteHeader);
			if(appDefine.userObject.iduser == objNote.iduserto && objNote.iduserto == objNote.iduser){
				$("<div>").html("Note to <b>self</b>").appendTo(noteHeader);
			}else if(objNote.iduserto == "0"){
				$("<div>").html("<b>Public note</b> "  ).appendTo(noteHeader);
			}else{
				$("<div>").html("Private Note From: <b>"+user.firstname+" "+user.lastname+"</b> "  ).appendTo(noteHeader);
			}

			$("<div>").html("<i class='fa-solid fa-circle-chevron-down'></i>").appendTo(noteHeader);
			$("<div>",{class:"delete"})
				.append($("<i>",{class:"fa-regular fa-trash-can"}).on("click",{idnote:objNote.idnote},deleteNote))
				.appendTo(noteHeader);
			noteHeader.on("click",function(){
				if($(this).hasClass("selected")){
					$(this).removeClass("selected");
					$(this).children().children("i").removeClass("fa-circle-chevron-up").addClass("fa-circle-chevron-down");
					noteBody.slideUp(500);	
				}else{
					$(this).parent().siblings().children(".header").removeClass("selected");
					$(this).parent().siblings().children(".header").children().children("i").removeClass("fa-circle-chevron-up").addClass("fa-circle-chevron-down");
					$(this).parent().siblings().children(".body").slideUp(300);
					$(this).addClass("selected");
					$(this).children().children("i").removeClass("fa-circle-chevron-down").addClass("fa-circle-chevron-up");
					noteBody.slideDown(500);
					patientlib.readPatientNote(objNote.idnote);
				}
			}); 
		}
	});
}


function drawPatientNotes(){
	$("#grvEditor").jqte({fsizes: ["8","10", "15", "18", "20"],funit: "px",format: true,i: false,link: false,ol: false,rule: false,source: false,sub: false,strike: false,sup: false,u: false,ul: false,unlink: false});
	$('.jqte_editor').css({'height': '60px','min-height': '60px','max-height': '60px'});
	const rconfig = {change:triggerPublicNote,
			container:"radio-public",
			elements:[
				{label:"Public note (All users can see the note)",value:"public",default:1},
				{label:"Private note (Choose user)",value:"user",default:0},
				{label:"Note to self",value:"self",default:0}
			]};
	let rpub = new grvradio(rconfig);
	if(rpub.getValue() == "public"){
		$(".cdisButtonArea .label label").hide();
		$(".cdisButtonArea .select select").hide();
	}
	$.each(appDefine.users,function(index,obj){
		if(obj.active == 1){
			$('#grvUsersNotes')
				.append($('<option>', {value: obj.iduser,text: obj.firstname+' '+obj.lastname}));	
		}
	});
	let idtouser = 0;
	
	$(".cdisButtonArea .button div").on("click",function(){
		if($(".cdisButtonArea .select select").is(":visible")){
			idtouser = $(".cdisButtonArea .select select").val();
		}
		let m = $(".jqte_editor").html();
		if(m != ""){
			let message = btoa(m);
			patientlib.savePatientNote(rpub.getValue(),message, idtouser,saveNoteCallback);
		}
	});
	drawPatientNotesList($(".cdisNotesText"));
}


function drawPatientDepression(){
	let config={container:"grvPhq",elements:[{name:"PHQ-2",alias:"phq2",default:1,callback:loadPhqSurvey},{name:"PHQ-9",alias:"phq9",default:0,callback:loadPhqSurvey}]};
	const t = new grvtabs(config);
}

function loadPhqSurvey(){
	const id = this.alias;
	const container = $("div [data='"+id+"']");
	const config = {
		container:container.attr("id"),
		surveyid:id,
		close:true,
		idpatient:appDefine.patientObjectArray[0].idpatient,
		iduser:appDefine.userObject.iduser,
		date:genericlib.formatDate(new Date(), "yyyy-mm-dd"),
		completeLabel:"Save Score",
		closeSurveyCallback:function(){},
		completeSurveyCallback:function(result){saveDepressionValue(result,id);}
	};
	
	const s = new grvsurvey(config);
	shareData.surveys.push({name:id,object:s});
	
	if(id == "phq2"){
		setTimeout(function(){$("#grvPHQ2Score").on("click",recordPhqScore)},200);
	}
	
}

export function recordPhqScore(){
	alert("aaaaa")
}

