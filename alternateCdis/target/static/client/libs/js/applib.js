import {appDefine} from './define.js';

/**
 * PUBLIC FUNCTIONS
 *  */		

export function loadRessources(config, callback){
	let ressources = config.ressources;
	let container = $("#"+config.container);
	$.each(ressources, function(i,v){
		let t = v.type;
		if(t == "css"){
			let e = v.elements;
			$.each(e,function(j,k){
				let flag = k.initload;
				if(flag){
					loadCSS(k.file);
				}	
			});
		}else if(t == "js"){
			let e = v.elements;
			$.each(e,function(j,k){
				let flag = k.initload;
				if(flag){
					$.getScript(k.file, function() {console.log( k.file+"loaded and executed!" );});
				}	
			});
		}else if(t == "ui"){
			let e = v.elements;
			$.each(e,function(j,k){
				let flag = k.initload;
				if(flag){
					container.load(k.file, callback);
				}	
			});
		}
	});
}

export function loadRessourcesUi(config, name, container, callback){
	$.each(config.ressources, function(i,v){
		if(v.type == "ui"){
			$.each(v.elements,function(j,element){
				if(element.name == name){
					container.load(element.file, callback);
				}	
			});
		}
	});
}



export function getTemplatePath(name, config){
	let path = "";
	let rs = config.ressources;
	$.each(rs,function(i,v){
		if(v.type == "ui"){
			let es = v.elements;
			$.each(es, function(j,k){
				if(name == k.name){
					path = k.file;
				}
			})
		}
	})
	return path;
}

export function getTemplateContent(template){
	let templateContent = "";
	$.ajax({
	    url: template, 
	    type: 'GET',
		async: false,
	    dataType: 'html', // Expecting HTML content
	    success: function(data) {
	        templateContent = data; // Example: Select a div with ID 'yourTemplateId'
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        console.error('AJAX Error:', textStatus, errorThrown);
	    }
	});
	return templateContent;
}

export function getEvents(element) {
	//let eid = $.data(element);
	//console.log(eid)
	//let alleevents = $.cache[eid].events;
	let alleevents = $._data(element, "events");
	//var elemEvents = $._data(element, "events");
	
    //var allDocEvnts = $._data(document, "events");
	//let did = $.data(document);
	//let alldevents = $.cache[did].events;
	let alldevents = $._data(document, "events");;
	
    for(var evntType in alldevents) {
        //if(allDocEvnts.hasOwnProperty(evntType)) {
			if(Object.prototype.hasOwnProperty.call(alldevents, evntType)) {
            var evts = alldevents[evntType];
            for(var i = 0; i < evts.length; i++) {
                if($(element).is(evts[i].selector)) {
                    if(alleevents == null) {
                        alleevents = {};
                    }
                    //if(!elemEvents.hasOwnProperty(evntType)) {
					if(!Object.prototype.hasOwnProperty.call(element, evntType)) {
                        alleevents[evntType] = [];
                    }
                    alleevents[evntType].push(evts[i]);
                }
            }
        }
    }
	
    return alleevents;
}


export function showProgress(container){
	if(!appDefine.progressOn){
		$(container).css("position","relative");
		var p = $('<div>',{id:"progress",class:"fullscreen-progress"}).appendTo(container);
		var c = $('<div>',{class:"fullscreen-progress-container"}).appendTo(p);
		var l = $('<div>',{class:"fullscreen-progress-container-logo"}).appendTo(c);
		var t = $('<div>',{class:"fullscreen-progress-container-text"}).appendTo(c);
		appDefine.progressOn=true;
	}
}

export function hideProgress(container){
	$(container).find($("#progress")).hide(500, function(){
		$(container).find($("#progress")).remove();
		appDefine.progressOn=false;
	}).delay(500, function(){
		$(container).find($("#progress")).remove();
		appDefine.progressOn=false;
	});
}



/**
 * PRIVATE FUNCTIONS
 * 
 */

function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function loadJS(href) {
    const link = document.createElement('script');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}
