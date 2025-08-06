/*generic functions*/

function getECMAScriptVersion() {
  if (typeof Promise.finally === 'function') {
    return 'ECMAScript 2018 or later';
  } else if (typeof Array.prototype.includes === 'function') {
    return 'ECMAScript 2016 or later';
  } else if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    return 'ECMAScript 2015 (ES6) or later';
  } else {
    return 'ECMAScript 5 or earlier';
  }
}


/*



*/


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




function isDecimal(input){
    let regex = /^[-+]?[0-9]+\.[0-9]+$/;
    return (regex.test(input));
}




