/*generic functions*/


function loadTemplate(pageName,callBack){
	var ua = window.navigator.userAgent;
	var msie1 = ua.indexOf("Edge");
	var msie2 = ua.indexOf(".NET");
	var msie3 = ua.indexOf("MSIE");
	if((msie1 >= 0) || (msie2 >= 0)  || (msie3 >= 0)){
		$("<div>",{id:"dialog-msie"}).appendTo($("body")).html("<p>CDIS application is not supported using Internet Explorer or Edge Browser.</p><p>Please use <b>Chrome</b>  or <b>Firefox</b> browser.</p><p>If Chrome of Firefox are not installed on your computer please contact your system administrator.</p>");
		$("#dialog-msie").dialog({
			autoOpen: true,
		    resizable: false,
		    height: 350,
		    width: 400,
		    modal: true,
		    buttons: {
		      OK: function() {
		    	  $( this ).dialog( "close" );
		        }
		    },
		    close: function() { }
		  });
	}else{
		
		if(pageName == "reports"){
			if(callBack == null){
				$("#grvWraper").load( "client/templates/"+pageName+".html"+"?ts="+moment());
			}else{
				$("#grvWraper").load("client/templates/"+pageName+".html"+"?ts="+moment(), callBack);
			}	
		}else{
			if(callBack == null){
				$("#grvWraper").load( "client/templates/"+pageName+".html"+"?ts="+moment());
			}else{
				$("#grvWraper").load("client/templates/"+pageName+".html"+"?ts="+moment(), callBack);
			}	
		}
	}
}

function logout(){
	logoutUser(sid);
}

function logoutLocal(){
	logoutUserLocal(sid);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


Array.prototype.sum = function(selector) {
    if (typeof selector !== 'function') {
        selector = function(item) {
            return item;
        };
    }
    var sum = 0;
    for (var i = 0; i < this.length; i++) {
        sum += parseFloat(selector(this[i]));
    }
    return sum;
};

Array.prototype.max = function() {
	  return Math.max.apply(null, this);
	};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};


Number.prototype.trimNum = function(places,rounding){
	(rounding != 'floor' && rounding != 'ceil') ? rounding = 'round' : rounding = rounding;
	var result, num = this, multiplier = Math.pow( 10,places );
	result = Math[rounding](num * multiplier) / multiplier;
	return Number( result );
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function getEvents(element) {
    var elemEvents = $._data(element, "events");
    var allDocEvnts = $._data(document, "events");
    for(var evntType in allDocEvnts) {
        if(allDocEvnts.hasOwnProperty(evntType)) {
            var evts = allDocEvnts[evntType];
            for(var i = 0; i < evts.length; i++) {
                if($(element).is(evts[i].selector)) {
                    if(elemEvents == null) {
                        elemEvents = {};
                    }
                    if(!elemEvents.hasOwnProperty(evntType)) {
                        elemEvents[evntType] = [];
                    }
                    elemEvents[evntType].push(evts[i]);
                }
            }
        }
    }
    return elemEvents;
}


function getCacheStatus(){
	var appCache = window.applicationCache;
	switch (appCache.status) {
	  case appCache.UNCACHED: // UNCACHED == 0
	    return 'UNCACHED';
	    break;
	  case appCache.IDLE: // IDLE == 1
	    return 'IDLE';
	    break;
	  case appCache.CHECKING: // CHECKING == 2
	    return 'CHECKING';
	    break;
	  case appCache.DOWNLOADING: // DOWNLOADING == 3
	    return 'DOWNLOADING';
	    break;
	  case appCache.UPDATEREADY:  // UPDATEREADY == 4
		  return 'UPDATEREADY';
	    break;
	  case appCache.OBSOLETE: // OBSOLETE == 5
	    return 'OBSOLETE';
	    break;
	  default:
	    return 'UKNOWN CACHE STATUS';
	    break;
	};
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function makelid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function makenid(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function showGRVPopup(title,text,buttons,config){
	var id = moment();
	$("body").css("overflow-y","hidden");
	var modal = $('<div>',{id:"fullscreen_"+id,class:"grvpopup-fullscreen-modal"}).appendTo($("#grvWraper"));
	var sett = $('<div>',{class:"grvpopup-window"}).appendTo(modal);
	if(typeof(config.width) != "undefined")sett.css("width",config.width+"px");
	if(typeof(config.height) != "undefined")sett.css("height",config.height+"px");
	var settH = $('<div>',{class:"grvpopup-window-header"}).appendTo(sett);
	var settB = $('<div>',{class:"grvpopup-window-body"}).appendTo(sett);
	var settBB = $('<div>',{class:"grvpopup-window-body-body"}).appendTo(settB);
	var settBF = $('<div>',{class:"grvpopup-window-body-footer"}).appendTo(settB);
	var autos = "";
	$.each(buttons,function(x,y){autos = "auto "+autos;});
	$(settBF).css("grid-template-columns",autos);
	
	$.each(buttons, function(i,button){
		
		var cb = $('<button>',{class:"cisbutton"}).text(button.text).appendTo(settBF);
		cb.on("click",{"buttonAction":button.action},function (event){
			var flag = eval(event.data.buttonAction+"()");
			if(flag)setTimeout(closeGRVPopup,300);
		});
	});
	
	settBB.html(text);
	$('<div>',{class:"grvpopup-window-header-title"}).text(title).appendTo(settH);
	var settHC = $('<div>',{class:"grvpopup-window-header-close"}).html("<i class='fa fa-times'></i>").appendTo(settH);
	settHC.click(function(){
		closeGRVPopup(); 
	});
	
	function closeGRVPopup(){
		$(".grvpopup-fullscreen-modal").remove();
		$("body").css("overflow-y","auto");
	}
}

function isDecimal(input){
    let regex = /^[-+]?[0-9]+\.[0-9]+$/;
    return (regex.test(input));
}



function loadJS(FILE_URL){
	$.getScript("client/libs/js/common/define.js", function(data, textStatus, jqxhr) {
	});
}




/* tooltip function*/
//Use a closure to keep vars out of global scope
/*
(function () {
var ID = "tooltip_cdis", CLS_ON = "tooltip_ON", FOLLOW = true,
DATA = "_tooltip", OFFSET_X = 20, OFFSET_Y = 10,
showAt = function (e) {
    var ntop = e.pageY + OFFSET_Y, nleft = e.pageX + OFFSET_X;
	  //var ntop =  OFFSET_Y, nleft = OFFSET_X;
    $("#" + ID).html($(e.target).data(DATA)).css({
        position: "absolute", top: ntop, left: nleft
    }).show();
};
$(document).on("mouseenter", "*[title]", function (e) {
    $(this).data(DATA, $(this).attr("title"));
    $(this).removeAttr("title").addClass(CLS_ON);
    $("<div id='" + ID + "' />").appendTo("body");
    showAt(e);
});
$(document).on("mouseleave", "." + CLS_ON, function (e) {
    $(this).attr("title", $(this).data(DATA)).removeClass(CLS_ON);
    $("#" + ID).remove();
});
if (FOLLOW) { $(document).on("mousemove", "." + CLS_ON, showAt); }
}());

*/