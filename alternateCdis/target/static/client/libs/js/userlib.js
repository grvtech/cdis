import { appDefine } from "./define.js";
import * as router from './router.js';
import * as patientlib from './patientlib.js';
import * as applib from './applib.js';




export function getUserFromArray(iduser){
	var uObj = null;
	$.each(appDefine.users,function(i,obj){
		if(obj.iduser == iduser)uObj = obj;
	});
	return uObj;
}



export function getUsers(){
	var result = [];
	var request = $.ajax({
		  url: "/ncdis/service/data/getUsers?language="+appDefine.appLanguage,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			result = json.objs;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}



export function getUser(iduser){
	var uObj = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUser?iduser="+iduser+"&language=en",
		  type: "GET",
		  async: false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObj = json.objs[0];
			if(uObj.username == "demo") appDefine.isDemo=true;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
		//
	return uObj;
}

export function getSession(iduser){
	var sid = "";
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserSession?iduser="+iduser+"&language="+appDefine.appLanguage+"&ts="+appDefine._t,
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			var sObj = json.objs[0];
			sid = sObj.idsession;
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return sid;
}


export function isUserLoged(sid){
	var result = false;
	var request = $.ajax({
		  url: "/ncdis/service/data/isValidSession?sid="+sid+"&language="+appDefine.appLanguage,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			var sObj = json.objs[0];
			if(sObj != null){
				if((sObj.idsession != null) && (sObj.idsession != "") &&  (sObj.idsession != "0")){
					appDefine.userObject = getUserBySession(sObj.idsession);
					if(appDefine.userObject.username=="demo")appDefine.isDemo=true;
					appDefine.userProfileObject = getUserProfile(sObj.iduser, 1);
					result = true;
				}else{
					result = false;
				}
			}
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}

export function logoutUser(sid){
	var request = $.ajax({
		  url: "/ncdis/service/data/logoutSession?sid="+sid+"&language="+appDefine.appLanguage+"&ts="+appDefine._t,
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	
		router.gti();
}


export function refreshUserNotes(sessionid){
	var request = $.ajax({
		  url: "/ncdis/service/action/getUserNotes?language="+appDefine.appLanguage+"&sid="+sessionid,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			appDefine.userNotes = json.objs[0];
			console.log("user notes in refresh user notes"+appDefine.userNotes)
			if(appDefine.userNotes.length > 0 ){
				$(".cdisHeaderMenu .messages").show();
				var cn = null;
				if($(".cdisHeaderMenu .messages .number").length > 0 ){
					cn = $(".cdisHeaderMenu .messages .number");
				}else{
					cn = $("<div>",{class:"number"}).appendTo($(".cdisHeaderMenu .messages"));
				}
				
				cn.text(appDefine.userNotes.length);
				prepareMessageWidget(appDefine.userNotes);
			}else{
				$(".cdisHeaderMenu .messages").hide();
			}
			setTimeout(refreshUserNotes,30000,sessionid);
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
}

export function getUserDashboard(){
	var iduser = appDefine.userObject.iduser;
	var data = "iduser="+iduser+"&language="+appDefine.appLanguage;
	let result = null;
	$.ajax({
		  url: "/ncdis/service/data/getUserDashboard",
		  type: "POST",
		  async : false,
		  cache : false,
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			result = json.objs[0];
			//if(isDemo)result = demoData(userDashboardObj,"userdashboard");
		}).fail(function( jqXHR, textStatus ) {
			alert( "Request failed: " + textStatus );
	});	
	return result;
}	
export function getUserBySession(sessionId){
	var uObjArray = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserBySession?sid="+sessionId+"&language=en",
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObjArray = json.objs[0];
			if(uObjArray.username == "demo")appDefine.isDemo = true;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed:  error  " + textStatus );
		});
	return uObjArray;
}


export function getUserPatients(userId,hcpcat){
	
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserPatients?iduser="+userId+"&language="+appDefine.appLanguage+"&hcpcat="+hcpcat,
		  type: "GET",
		  async : true,
		  dataType: "json"
		});
		request.done(function( json ) {
			var obArr = json.objs;
			if(obArr.length === 0){
				$("<tr>",{class:"notvisits"}).appendTo($(".cdisPersonalPatients table tbody"))
				.append($("<td>",{colspan:5,align:"center",style:"font-weight:bold;"}).text("No patient linked to this user!"));
			}else{
				
				//if(isDemo)obArr = demoData(obArr,"userpatients");
				
				const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short'});
				$.each(obArr,function(index,obj){
					var dd = "";
					var now = new Date();
					let nowMonth = now.getMonth();
					if(typeof(obj.datevisit)  != "undefined" ){
						dd = new Date(obj.datevisit);
						let ddMonth = dd.getMonth();
						if(ddMonth == nowMonth){
							$("<tr>",{class:"currentvisits"}).appendTo($(".cdisPersonalPatients table tbody"))
								.append($("<td>").text(obj.fullname))
								.append($("<td>").text(obj.chart))
								.append($("<td>").text(obj.ramq))
								.append($("<td>").text(obj.community))
								.append($("<td>").text(formatter.format(dd)))
								.click(function(){
									if(appDefine.isDemo)obj.ramq = obj.realramq;
									router.gtc(appDefine.sid,appDefine.appLanguage, obj.ramq,"patient");
								});
						}else{
							$("<tr>",{class:"futurevisits"}).appendTo($(".cdisPersonalPatients table tbody"))
							.append($("<td>").text(obj.fullname))
							.append($("<td>").text(obj.chart))
							.append($("<td>").text(obj.ramq))
							.append($("<td>").text(obj.community))
							.append($("<td>").text(formatter.format(dd))).click(function(){
								if(appDefine.isDemo)obj.ramq = obj.realramq;
								router.gtc(appDefine.sid,appDefine.appLanguage, obj.ramq,"patient");
							});
						}
					}else{
						$("<tr>",{class:"notvisits"}).appendTo($(".cdisPersonalPatients table tbody"))
						.append($("<td>").text(obj.fullname))
						.append($("<td>").text(obj.chart))
						.append($("<td>").text(obj.ramq))
						.append($("<td>").text(obj.community))
						.append($("<td>").text("Not scheduled")).click(function(){
							if(appDefine.isDemo)obj.ramq = obj.realramq;
							router.gtc(appDefine.sid,appDefine.appLanguage, obj.ramq,"patient");
						});
					}
				});
			}
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed:  error  " + textStatus );
		});
	
}

export function setUserEvent(eventcode){
	var request = $.ajax({
	  url: "/ncdis/service/action/setEvent?sid="+appDefine.sid+"&eventcode="+eventcode+"&language="+appDefine.appLanguage+"&ts="+Date.now(),
	  type: "GET",
	  dataType: "json"
	});
	request.fail(function( jqXHR, textStatus ) {
	  alert( "Request failed: " + textStatus );
	});
}


/**
 * PRIVATE FUNCTIONS
 * 
 */

function prepareMessageWidget(notes){
	if($(".cdisHeaderMenu .messages").length > 0 ){
		var mw = $(".cdisHeaderMenu .messages");
		console.log(mw)
		var meev = applib.getEvents(mw[0]);
		
		if(typeof(meev) == "undefined" || meev.mouseover.length <= 1 ){
			mw.on("mouseenter",function(){
				if($(".cdisMessagesDetailsContainer").length > 0){
					$(".cdisMessagesDetailsContainer").remove();
				}
				var mdc = $("<div>",{class:"cdisMessagesDetailsContainer"}).appendTo($("#grvWraper"));
				mdc.empty();
				mdc.append($("<div>",{class:"arrow-up"})).append($("<div>",{class:"cdisMessagesDetails"}));
				$.each(appDefine.userNotes,function(i,not){
					var uzer = getUser(not.iduser);
					var patient = patientlib.getPatientInfo(not.idpatient);
					$("<div>",{class:"cdisMessage"})
						.append($("<span>").html("New message from <b>"+uzer.firstname+" "+uzer.lastname+ "</b> for the patient <b>"+patient.ramq+"</b>"))
						.append($("<div>",{class:"cdisCisButton"}).text("View").click(function(){
							gtc(sid,"en",patient.ramq,"notes");
						}))
					.appendTo($(".cdisMessagesDetails"));
				});
				$(".cdisMessagesDetailsContainer").show();
			}).on("mouseleave",function(){
				setTimeout(function(){
					if($(".cdisMessagesDetailsContainer:hover").length > 0){
						$(".cdisMessagesDetailsContainer").on("mouseleave",function(){$(".cdisMessagesDetailsContainer").remove();});
					}else{
						$(".cdisMessagesDetailsContainer").remove();
					}
				},700);
			});
		}
	}
}





function getUserProfile(iduser,idsystem){
	var uObj = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserProfile?iduser="+iduser+"&idsystem="+idsystem+"&language=en",
		  type: "GET",
		  async: false,
		  cache: false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObj = json.objs[0];
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return uObj;
}