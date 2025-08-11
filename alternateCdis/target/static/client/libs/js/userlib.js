import { appDefine } from "./define.js";
import * as router from './router.js';


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
					if(appDefine.userObject[0].username=="demo")appDefine.isDemo=true;
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


/**
 * PRIVATE FUNCTIONS
 * 
 */


function getUserBySession(sessionId){
	var uObjArray = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserBySession?sid="+sessionId+"&language=en",
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObjArray = json.objs;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed:  error  " + textStatus );
		});
	return uObjArray;
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