import appconfig from './config.json' with { type: 'json' };


/**
 * PUBLIC FUNCTIONS
 *  */		


export function route(section="index",theme="default"){
	let url = getRoute("index"); //default theme and index page
	if(section!==null){
		url = getRoute(section,theme); 		
	}
	window.location = url+location.search;
}

export	function getPage() {
		var url =  window.location.href;
	    var index = url.lastIndexOf("/") + 1;
	    var filenameWithExtension = url.substr(index);
	    var filename = filenameWithExtension.split(".")[0]; 
	    filename = filename.split("?")[0]; // <-- added this line
	    if(filename == ""){filename="index";}
	    return filename;                                  
}

export	function getParameterByName(name) {
			var url = window.atob(location.search.substring(1));
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),results = regex.exec("?"+url);
	    	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

export	function getParametersString() {
			var url = window.atob(location.search.substring(1));
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),results = regex.exec("?"+url);
	    	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

export	function getSection() {
	let section = "";
	let pathname =  window.location.pathname;
	let parts = pathname.split("/");
	console.log(parts);
	if(parts.length > 3) section = parts[7];    
	return section;                                  
}		

export	function getTheme() {
	let theme = "";
	let pathname =  window.location.pathname;
	let parts = pathname.split("/");
	console.log(parts);
	if(parts.length > 3) theme = parts[5];    
	return theme;                                  
}		


export	function gti(){window.location = getRoute("index",getTheme());}/*go to index*/

/*go to search*/
export	function gts(s,l,plus){
		var p = window.btoa("sid="+s+"&language="+l+"&ts="+Math.floor(Date.now() / 1000)+plus);
		window.location = getRoute("search",getTheme())+"?"+p;
	}

/*go to cdis*/
export	function gtc(s,l,r,sec,plus=""){
		var p = window.btoa("sid="+s+"&language="+l+"&section="+sec+"&ramq="+r+"&ts="+Math.floor(Date.now() / 1000)+plus);
		window.location = getRoute("cdis",getTheme())+"?"+p;
}

/*go to reports*/
export	function gtr(s,l,rid){
		var p = window.btoa("sid="+s+"&language="+l+"&reportid="+rid+"&ts="+Math.floor(Date.now() / 1000));
		window.location =  getRoute("reports",getTheme())+"?"+p;
}

/*go to options*/
export	function gto(s,l,sec){
		var p = window.btoa("sid="+s+"&language="+l+"&section="+sec+"&ts="+Math.floor(Date.now() / 1000));
		window.location = getRoute("options",getTheme())+"?"+p;
}

/*go to admin*/
export	function gta(s,l,sec){
		var p = window.btoa("sid="+s+"&language="+l+"&section="+sec+"&ts="+Math.floor(Date.now() / 1000));
		window.location = getRoute("admin",getTheme())+"?"+p;
}

/*go to note*/
export	function gtn(s,l,r,idn){
		var p = window.btoa("sid="+s+"&language="+l+"&section=notes&ramq="+r+"&idnote="+idn+"&ts="+Math.floor(Date.now() / 1000));
		window.location = "cdis.html?"+p;
}

		
/**
 * PRIVATE FUNCTIONS
 *  */		

function getRoute(name,theme){
	let route = "";
	$.each(appconfig.routes, function(i,v){
		if(name === v.name){route = v.path.replace("{theme}",theme);}
	})
	return route;
}

