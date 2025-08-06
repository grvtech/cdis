/*
 * GLOGAL variables
 * */
var trendStatsDataFlag = false;
var periodStatsDataFlag = false;
var valueStatsDataFlag = false;

var reportsSection = "dashboard";
var default_color = "#4d90fe";
var dashboard_color = "#fcfcfc";
var patient_color = "#fcfcfc";
var ispandiLoaded = false;
var reportObjectToExecute = null;
var criteriaArray = [];
var graphtype_line = {title:'Data Graph', axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer} },series:[{lineWidth:4, markerOptions:{style:'square'}}]};
var graphtype_bar =  {title:'Data Graph',seriesDefaults:{renderer:$.jqplot.BarRenderer},axes:{xaxis:{renderer: $.jqplot.CategoryAxisRenderer}}};
var graphtype_pie =  {title:'Data Graph',gridPadding: {top:0, bottom:38, left:0, right:0},seriesDefaults:{renderer:$.jqplot.PieRenderer,trendline:{ show:false },rendererOptions: { padding: 8, showDataLabels: true }},legend:{show:true,placement: 'outside',rendererOptions: {numberRows: 1},location:'s',marginTop: '15px'}};
var exportImage = null;
var isSurveillance = false;
var isPvalidation = false;
var showPopupFlag = true;




/*
 * EVENT definitions
 * 
 * */
$("#fullscreen-button").on("click",toggleFullScreen);

/*
 * MAIN Section 
 * */

let grvtabs = grvwtabs("grvTabs");
/*
$("#grvReportsTabs").tabs({
	create: function(event, ui){
		if(userProfileObj.role.idrole == 2 && userProfileObj.user.username != "demo"){$( "#tabs" ).tabs("disable",4)}
		if(isDemo)$( "#tabs" ).tabs("disable",3)
	},
    beforeLoad: function( event, ui ) {
      ui.jqXHR.fail(function() {
        ui.panel.html( "Couldn't load this tab. We'll try to fix this as soon as possible. ");
      });
    },
    activate : function(event, ui){
    	//ui.oldPanel.empty(); // clear the content of the previous tab
    	resetTabs();
    	var tabsActive = $( "#tabs" ).tabs( "option", "active" );
    	if(tabsActive == 2){
    		trendStatsDataFlag = true;
    		periodStatsDataFlag = true;
    		valueStatsDataFlag = true;
    		//drawg();
    	}else if(tabsActive == 3){
    		if(isDemo){
    			alert("This function si not available in demo mode");
    		}else{
        		$("#pvalidation").css("display","grid");
        		setTimeout(setEvent,100,"PATV");
        		if(showPopupFlag){
        			showPopupMessage(pvalidationPopupTitle,pvalidationText);
        			showPopupFlag = false;
        		}
    		}
    	}else if(tabsActive == 4){
    		$("#pandi").css("display","grid");
    		setTimeout(setEvent,100,"PANDI");
    		if(ispandiLoaded){
    			drawExistingHistory(pandiObjects);
				drawNewHistory(pandiObjects);
    		}
    	}else if(tabsActive == 5){
    		$("#importomnilab").css("display","grid");
    	}
    }
});

*/

if(userProfileObj.role.code!= "ROOT" && userProfileObj.role.code!= "ADMIN"){
	$("#admintab").remove();
	$("#grvTabs").tabs("refresh");
}


if(getParameterByName("reportid") == "surveillance"){
	grvtabs.setActive(2);
}else if(getParameterByName("reportid") == "pvalidation"){
	if(isDemo){
		alert("This function si not available in demo mode");
	}else{
		setTimeout(setEvent,100,"PATV");
		grvtabs.setActive(3);
		if(showPopupFlag){
			var bconfig = {"width":"500","height":"350"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
			var pvalidationPopupTitle = "Patient Validation";
			var pvalidationText = "<p>Patient Validation is a tool that allows CDIS users to screen for patients whose information may require updating (e.g. change of diagnosis, patient deceased, permanently moved from region).</p>"
						+"<ul><li>No data in last 5 years (unless GDM)</li>"
						+"<li>Age > 95</li>"
						+"<li>Duplicate name</li>"
						+"<li>Predm and value > 0.065 X 2 : if reclassifying as diabetic first verify that patient is aware of diagnosis</li></ul>"
						+"<span>Corrections can be done by CDIS users. For deletions, an email explaining the problem must be sent to support@grvtech.ca</span>";
			showGRVPopup(pvalidationPopupTitle,pvalidationText,bbut,bconfig);
			//showPopupMessage(pvalidationPopupTitle,pvalidationText);
			showPopupFlag = false;
		}
	}
}



/*
 * FUNCTIONS
 * */

function toggleFullScreen() {
	if ((document.fullScreenElement && document.fullScreenElement !== null) ||  (!document.mozFullScreen && !document.webkitIsFullScreen)) {
	    if (document.documentElement.requestFullScreen) {  
	      document.documentElement.requestFullScreen();  
	    } else if (document.documentElement.mozRequestFullScreen) {  
	      document.documentElement.mozRequestFullScreen();  
	    } else if (document.documentElement.webkitRequestFullScreen) {  
	      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
	    }
	    $(this).text("Exit fullscreen");
	  } else {  
	    if (document.cancelFullScreen) {  
	      document.cancelFullScreen();  
	    } else if (document.mozCancelFullScreen) {  
	      document.mozCancelFullScreen();  
	    } else if (document.webkitCancelFullScreen) {  
	      document.webkitCancelFullScreen();  
	    }
	    $(this).text("Fullscreen Dashboard");
	}   
}


function drawg(){
	if(trendStatsDataFlag && periodStatsDataFlag && valueStatsDataFlag){
		
		paramObject1 = {"container":$("#trend-graph"),"data":trendStatsData};
		drawAG(paramObject1);
		paramObject2 = {"container":$("#period-graph"),"data":periodStatsData};
		drawL(paramObject2);
		paramObject3 = {"container":$("#value-graph"),"data":valueStatsData,"filter":appFilter};
		drawHbA1cValueLL(paramObject3);
		hideProgress($(".surveillance-stats"));
		trendStatsDataFlag = false;
		periodStatsDataFlag = false;
		valueStatsDataFlag = false;
	}else{
		setTimeout(drawg,500);
	}
}

function initLocalPage(){
	
	if(isSurveillance){
		reportsSection = "surveillance";
		isSurveilance = false;
		$("#tabs").tabs({"active":2});
	}
	
	if(isPvalidation){
		if(!isDemo){
			reportsSection = "pvalidation";
			isPvalidation = false;
			$("#tabs").tabs({"active":3});
		}
	}
	
	initPage();
}

function resetTabs(){
	$(".contentTab").empty();
}