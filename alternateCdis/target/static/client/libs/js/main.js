//import * as jQuery from './ncdis/client/libs/js/jquery/jq.js';
import './../jquery/jq.js'
import * as nav from './navigation.js'
import * as define from'./define.js'

/*
import sheet1 from '/ncdis/client/libs/css/site.css' with { type: 'css' };
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet1];
import sheet2 from '/ncdis/client/libs/css/index.css' with { type: 'css' };
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet2];
//document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet2];
*/
loadCSS('/ncdis/client/libs/css/site.css');

function loadTemplate(pageName,callBack){
	hideContainer();
	//alert("page :" + pageName)
	var ua = navigator.userAgent;
	console.log(ua)
	
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
				$("#grvWraper").load( "client/templates/"+pageName+".html");
			}else{
				$("#grvWraper").load("client/templates/"+pageName+".html", callBack);
			}	
		}else{
			if(callBack == null){
				$("#grvWraper").load("client/templates/"+pageName+".html", showContainer);
				
				
				import("/ncdis/client/libs/js/sections/"+pageName+"/section.js")
					.then(module => {
            			console.log("Module loaded:", module);
            			// Access exports from the module (e.g., module.myFunction())
            			loadCSS('/ncdis/client/libs/css/'+pageName+'.css');
        			})
			        .catch(error => {
			            console.error("Error loading module:", error);
			        });
			        
			       /*
			       import("/ncdis/client/libs/css/index_test.css", {"with": { "type": "css" }})
					.then(sheet1 => {
            			console.log("Module loaded:", sheet1);
            			// Access exports from the module (e.g., module.myFunction())
            			sheet = sheet1;
            			document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet1];
        			})
			        .catch(error => {
			            console.error("Error loading module:", error);
			        });
			        */
			}else{
				$("#grvWraper").load("client/templates/"+pageName+".html", callBack);
			}	
		}
	}
}

function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function showContainer(){
	//$("#grvWraper").attr("display","block");
	
	console.log($("#grvWraper").css("display"));
	// Example using an arrow function with parameters
setTimeout((name) => {
  console.log(`Welcome, ${name}!`);
  console.log($("#grvWraper").css("display"));
  $("#grvWraper").css("display","grid");
  console.log($("#grvWraper").css("display"));
}, 500, "Alice"); 
	
	
}

function hideContainer(){
	$("#grvWraper").css("display","none");
	//$("#grvWraper").hide();
}


export {loadTemplate}; // a list of exported variables