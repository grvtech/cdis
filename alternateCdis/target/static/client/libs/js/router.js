import appconfig from './config.json' with { type: 'json' };


/**
 * PUBLIC FUNCTIONS
 *  */		


export function route(section="index",theme="default"){
	let url = "/"+appconfig.context+"/"+getRoute("index"); //default theme and index page
	if(section!==null){
		url = "/"+appconfig.context+"/"+getRoute(section,theme); 		
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


export	function gti(){window.location = "index.html";}/*go to index*/

/*go to search*/
export	function gts(s,l,plus){
		var p = window.btoa("sid="+sid+"&language="+l+"&ts="+Math.floor(Date.now() / 1000)+plus);
		window.location = getRoute("search",getTheme())+"?"+p;
	}
/*	
export	function gtsplus(s,l,plus){
		var p = window.btoa("sid="+sid+"&language="+l+"&ts="+Math.floor(Date.now() / 1000)+plus);
		window.location = "search.html?"+p;
	}
*/
export	function gtc(s,l,r,sec){
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ramq="+r+"&ts="+Math.floor(Date.now() / 1000));
		window.location = "cdis.html?"+p;
	}/*go to cdis*/
export	function gtcplus(s,l,r,sec,plus){
		var pp = "sid="+sid+"&language="+l+"&section="+sec+"&ramq="+r+"&ts="+Math.floor(Date.now() / 1000)+plus;
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ramq="+r+"&ts="+Math.floor(Date.now() / 1000)+plus);
		window.location = "cdis.html?"+p;
	}/*go to cdis*/
export	function gtr(s,l,rid){
		var p = window.btoa("sid="+sid+"&language="+l+"&reportid="+rid+"&ts="+Math.floor(Date.now() / 1000));
		window.location = "reports.html?"+p;
	}/*go to reports*/
export	function gto(s,l,sec){
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ts="+Math.floor(Date.now() / 1000));
		window.location = "options.html?"+p;
	}/*go to options*/
export	function gta(s,l,sec){
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ts="+Math.floor(Date.now() / 1000));
		window.location = "admin.html?"+p;
	}/*go to admin*/
export	function gtn(s,l,r,idn){
		var p = window.btoa("sid="+sid+"&language="+l+"&section=notes&ramq="+r+"&idnote="+idn+"&ts="+Math.floor(Date.now() / 1000));
		window.location = "cdis.html?"+p;
	}/*go to admin*/

		
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

