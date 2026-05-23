import sectionconfig from './config.json' with { type: 'json' };
import * as applib from './../../../../js/applib.js';
import * as router from './../../../../js/router.js';
import {grvwidget} from './../../modules/grvwidget.js';
import {grvpopup} from './../../modules/grvpopup.js';
import {shareData} from './define.js'; //define global variables
import {appDefine} from './../../../../js/define.js'; //define global variables
import * as patientlib from './../../../../js/patientlib.js';
import * as genericlib from './../../../../js/genericlib.js';



/* old function with data of abc graphs in DB -- this is old -- because we do not go to DB to retrieve data - this function should be in lib
export function drawABCGraphs(){
		var abcObjArray = null;
		var abc = $.ajax({
			  url: "/ncdis/service/data/getABCData?sid="+appDefine.sid+"&language="+appDefine.appLanguage+"&idpatient="+appDefine.patientObjectArray[0].idpatient,
			  type: "GET",async : false, cache : false,dataType: "json"
			});
		
			abc.done(function( json ) {
				abcObjArray = json.objs;
				var abcObject = abcObjArray[0];
				var values = [];
				var sections =[];
				
				$.each(abcObject,function(key, value){
					var parts = key.split('.');
					if(parts[1] != null){
						if(key.indexOf("value")>=0){values[parts[1]] = value;}
						if(key.indexOf("section")>=0){sections[parts[1]] = value;}
					}
				});
				
				$.each(values,function(index,valueName){
					if(typeof(valueName) != 'undefined'){
						if(valueName.indexOf('_or_') >= 0){
							var condition = $("#"+valueName).attr("condition");
							let oldname = valueName;
							valueName = validateCondition(valueName,sections[index],condition);
							$("#"+oldname).attr("id",valueName);
						}
						new grvwidget(valueName);	
					}
				});
				
			});
			abc.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});	
}
*/


export function loadRecomandation(recObj,container){
	var rContainer = $("<div>",{class:"cdisRecomandations"}).appendTo(container);
	$.each(recObj.recomandations,function(index,rObj){
		var rc = $("<div>",{class:"recomandation uss"}).appendTo(rContainer);
		$("<div>",{class:"title"}).text(rObj.title).appendTo(rc);
		$("<div>",{class:"thumbnail",style:"text-align:right;"})
			.append($("<img>",{src:"/ncdis/client/libs/themes/default/images/"+rObj.thumbnail}).css("height","35px").css("width","35px"))
			.appendTo(rc);
		rc.on("click",function(){
			let txt = applib.getTemplateContent(sectionconfig.path+rObj.source);
			let h = rObj.height;
			if($(window).height() < h ) h = $(window).height() - 20; 
 			let config = {width:rObj.width,height:h,
				container:"grvWraper",
				buttons:[{"text":"Close","action":"closeGRVPopup","alias":"this"}],
				content:txt,
				title:rObj.title
			}
			shareData.pagepopup = new grvpopup(config);	
		});
	});
}



export function getPatientNextVisits(){
	const container = $("#grvRight");
	let chr = "4";
	let md = "1";
	let nut = "3";
	let nur = "2";
	
	var idpatient = appDefine.patientObjectArray[0].idpatient;

	var svchr = patientlib.getScheduleVisit(idpatient, chr);
	console.log(svchr)
	if(!$.isEmptyObject(svchr) && svchr.idprofesion > 0 ){
		if(typeof(svchr.datevisit) != "undefined"){
			let dd = new Date(svchr.datevisit);
			let now = Date.now();
			let ddStr = genericlib.formatDate(dd,"mmm yyyy");
			let nowStr = genericlib.formatDate(now,"mmm yyyy");
			var rcontainer = $("<div>",{class:"cdisPatientVisit uss"}).appendTo(container);
			$("<div>",{class:"visit-title"}).text("CHR Next Visit").appendTo(rcontainer);
			if(dd < now){
				let f = svchr.frequency *1;
				dd.setMonth(dd.getMonth() + f);
				$("<div>",{class:"visit-date futurevisits"}).text(genericlib.formatDate(dd,"mmm yyyy")).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date currentvisits"}).text(ddStr).appendTo(rcontainer);
			}
		}
	}
	
	var svmd = patientlib.getScheduleVisit(idpatient, md);
	if(!$.isEmptyObject(svmd) && svmd.idprofesion > 0){
		if(typeof(svmd.datevisit) != "undefined"){
			let dd = new Date(svchr.datevisit);
			let now = Date.now();
			let ddStr = genericlib.formatDate(dd,"mmm yyyy");
			let nowStr = genericlib.formatDate(now,"mmm yyyy");
			var rcontainer = $("<div>",{class:"cdisPatientVisit uss"}).appendTo(container);
			$("<div>",{class:"visit-title"}).text("MD Next Visit").appendTo(rcontainer);
			if(dd < now){
				let f = svmd.frequency *1;
				dd.setMonth(dd.getMonth()+f);
				$("<div>",{class:"visit-date futurevisits"}).text(genericlib.formatDate(dd,"mmm yyyy")).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date currentvisits"}).text(ddStr).appendTo(rcontainer);
			}
		}
	}
	
	var svnur = patientlib.getScheduleVisit(idpatient, nur);
	if(!$.isEmptyObject(svnur) && svnur.idprofesion > 0){
		if(typeof(svnur.datevisit) != "undefined"){
			let dd = new Date(svchr.datevisit);
			let now = Date.now();
			let ddStr = genericlib.formatDate(dd,"mmm yyyy");
			let nowStr = genericlib.formatDate(now,"mmm yyyy");
			var rcontainer = $("<div>",{class:"cdisPatientVisit uss"}).appendTo(container);
			$("<div>",{class:"visit-title"}).text("Nurse Next Visit").appendTo(rcontainer);
			if(dd < now){
				let f = svnur.frequency *1;
				dd.setMonth(dd.getMonth()+f);
				$("<div>",{class:"visit-date futurevisits"}).text(genericlib.formatDate(dd,"mmm yyyy")).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date currentvisits"}).text(ddStr).appendTo(rcontainer);
			}
		}
	}
	var svnut = patientlib.getScheduleVisit(idpatient, nut);
	if(!$.isEmptyObject(svnut) && svnut.idprofesion > 0){
		if(typeof(svnut.datevisit) != "undefined"){
			let dd = new Date(svchr.datevisit);
			let now = Date.now();
			let ddStr = genericlib.formatDate(dd,"mmm yyyy");
			let nowStr = genericlib.formatDate(now,"mmm yyyy");
			var rcontainer = $("<div>",{class:"cdisPatientVisit uss"}).appendTo(container);
			$("<div>",{class:"visit-title"}).text("Nutritionist Next Visit").appendTo(rcontainer);
			
			if(dd < now){
				let f = svnut.frequency *1;
				dd.setMonth(dd.getMonth()+f);
			
				$("<div>",{class:"visit-date futurevisits"}).text(genericlib.formatDate(dd,"mmm yyyy")).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date currentvisits"}).text(ddStr).appendTo(rcontainer);
			}
		}
	}
}




export function searchHcp(criteria, query, callback ) {
	$.ajax({
		url: "/ncdis/service/data/getHcps",
		dataType: "json",
		data: {
			criteria:criteria,
			term: query,
			language: appDefine.appLanguage,
			sid: appDefine.sid
		},
		success: function( data ) {
			callback($.map( data.objs[0], function( item ) {
				return {
					iduser : item.iduser,
					criteria: item.criteria,
					name : item.name
				};
			}));
		}
	});
}






