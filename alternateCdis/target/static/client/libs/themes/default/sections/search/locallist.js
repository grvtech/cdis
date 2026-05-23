import * as applib from './../../../../js/applib.js';
import * as userlib from './../../../../js/userlib.js';
import * as genericlib from './../../../../js/genericlib.js';
import * as patientlib from './../../../../js/patientlib.js';
import * as graphlib from './../../../../js/graphlib.js';
import * as router from './../../../../js/router.js';

import * as slib from './lib.js';
import {appDefine} from './../../../../js/define.js';
import {grvpopup} from './../../modules/grvpopup.js';
import {shareData} from './define.js'; //define global variables
/*
 * global variable for list
 * */

var toolbarConfig = {"container":"grvLocallistToolbar","lists":[{"id":"list103","title":"Patients by HbA1c","selected":"false"},{"id":"list102","title":"Patients with no HbA1C in the ","selected":"false"},{"id":"list101","title":"HbA1c trend","selected":"false"}],"options":[]};
var dataperiodValues = [6,12,24,60];
const listConfig = {
		"container":"grvLocallistList",
		"initFilter":{"list":"list103","idcommunity":"0","dp":"12","dtype":"1_2","age":"0","hba1c":"0","sex":"0","users":"0"},
		"list101":{"header":["fullname","ramq","chart","age","dduration","trend","last_hba1c","last_hba1c_collecteddate","secondlast_hba1c","secondlast_hba1c_collecteddate"]},
		"list102":{"header":["fullname","ramq","chart","age","dduration","last_hba1c","last_hba1c_collecteddate"]},
		"list103":{"header":["fullname","ramq","chart","age","dduration","last_hba1c","last_hba1c_collecteddate"]},
		"list104":{"header":["fullname","ramq","chart","age","dduration","idcommunity","sex"]}
};
var statsConfig = {"container":"locallist-stats"};
var appFilter = listConfig.initFilter;
var globalReport = null;
var nowReport = null;
var linkedUsers = [];

var searchTimer;
var trendStatsData = {};
var periodStatsData = {};
var valueStatsData = {};



export function openList(pfilter){
	//create the modal window
	var id = "locallist";
	if(pfilter!=null){
		appFilter = pfilter;
	}else{
		appFilter = initFilter(listConfig.initFilter);
	}
	
	var modal = $('<div>',{class:"cdisFullscreenLocalList"}).appendTo($("#grvWraper"));
	$("body").css("overflow","hidden");
	buildFrameList(modal);
	setTimeout(loadReport, 10, "locallist");
}

/*
 * function to open the window of the report
 * the window will be splited in 3 parts ( subwindows)
 * 1 on the left - filters and choises 
 * 2 the main list
 * 3 on the bottom - stats of the list
 * */

function initFilter(initialFilter){
	var result = {};
	$.each(initialFilter,function(i,v){
		result[i]=v;
	});
	return result;
}


/*
 * function to build the frame
 * */
function buildFrameList(container){
	
	/**/
	var header = $('<div>',{id:"grvHeader"}).appendTo(container);
	$('<div>',{class:"cdisLogo"}).appendTo(header);
	$('<div>',{class:"cdisName"}).text("CDIS").appendTo(header);
	$('<div>',{class:"cdisTitle"}).text("Local Patient List").appendTo(header);
	$('<div>').appendTo(header);
	$('<div>',{class:"cdisFullscreenLocalListClose"}).html($('<i>',{class:"fa fa-times"})).click(function(){router.gts(appDefine.sid,appDefine.appLanguage);}).appendTo(header);
	
	var body = $('<div>',{class:"cdisFullscreenLocalListBody"}).appendTo(container);
	$('<div>').appendTo(body);
	$('<div>',{"id":"grvLocallistToolbar",class:"cdisLocallistToolbar"}).appendTo(body);
	$('<div>').appendTo(body);
	$('<div>').appendTo(body);
	var c = $('<div>',{"id":"grvLocallistList",class:"cdisLLList"}).appendTo(body);
	$('<div>',{class:"gap"}).appendTo(body);
	
	setTimeout(applib.showProgress , 100, c);
	
	$('<div>',{class:"cdisFullscreenLocalListFooter"}).appendTo(container);
	
}


function getAllPatients(report, community){
	var result=0 ;
	$.each(report.data.datasets,function(i,v){
		if( community == "0"){
			result++;
		}else{
			if(community == v.idcommunity){
				result++;
			}
		}
	});
	return result;
}


/*
 * function to load the report in the JSON object
 * */
function loadReport(reportID){
	var url = "/ncdis/client/reports/report."+reportID+"?ts="+Date.now();
	var result = null;
	var req1 = $.ajax({dataType: "json",url: url,async:false,cache:false})
	.done(function(obj){
		result = obj;
		nowReport = obj;
		globalReport = obj;
		var linkedUsersIds = [];
		$.each(obj.data.datasets,function(i,v){
			var users = v.users;
			if(users != ""){ 
				var parts = users.split(";");
				$.each(parts,function(ii,vv){
					if(vv != ""){
						if(!isNaN(vv)){
							if(!linkedUsersIds.includes(vv)){
								linkedUsers.push(userlib.getUserFromArray(vv));
								linkedUsersIds.push(vv);
							}
						}
					}
				});
			}
		});
		setTimeout(displayData,100,nowReport);
	});
	req1.fail(function( jqXHR, textStatus, errorThrown){console.log("AJAX failed!", jqXHR, textStatus, errorThrown)});
	return result;
}



/*function to display data from the report
 * will build the toolbar an the stats 
 * */
function displayData(report){
	setTimeout(drawToolbar,100, toolbarConfig);
	setTimeout(drawList,200, appFilter.list, listConfig, report);
}




function drawToolbar(toolbarConfig){
	var c = $("#"+toolbarConfig.container);
	$("<div>").appendTo(c);
	var fsFilters = $("<div>",{class:"cdisLLFilters"}).appendTo(c);
	var fsButtons = $("<div>",{class:"cdisLLButtons"}).appendTo(c);
	var fsLists = $("<div>",{class:"cdisLLLists"}).appendTo(c);
	drawToolbarFilters(fsFilters);
	drawToolbarButtons(fsButtons);
	drawToolbarLists(fsLists);
	setToolbar(appFilter);
}
function drawToolbarFilters(container){
	container.empty();
	//container
	var gr2col = $("<div>",{class:"cdisLine1"}).appendTo(container);
	var gr2col1 = $("<div>",{class:"cdisLine2"}).appendTo(container);
	//community
	var grComm = $("<div>").appendTo(gr2col);
	$("<div>",{class:"cdisLLLabel"}).text("Community").appendTo(grComm);
	var grCommS = $("<select>",{"id":"grvLLCommunityFilter",class:""}).appendTo(grComm);
	$.each(appDefine.communities, function(j,com){
		$("<option>",{"value":j}).text(com).appendTo(grCommS);
	});
	grCommS.on("change",function(){
		var v = $(this).val();
		if(v!=appFilter.idcommunity){appFilter["idcommunity"]=v;}
	});

	
	//gender
	var grGen = $("<div>").appendTo(gr2col);
	$("<div>",{class:"cdisLLLabel"}).text("Gender").appendTo(grGen);
	var grGenS = $("<select>",{"id":"grvLLGenderFilter",class:""}).appendTo(grGen);
	$.each(appDefine.genders, function(j,gen){
		$("<option>",{"value":j}).text(gen).appendTo(grGenS);
	});
	grGenS.on("change",function(){
		var v = $(this).val();
		if(v!=appFilter.sex){appFilter["sex"]=v;}
	});

	//users
	var grUsr = $("<div>").appendTo(gr2col);
	$("<div>",{class:"cdisLLLabel"}).text("Health Care Workers").appendTo(grUsr);
	var grUsrS = $("<select>",{"id":"grvLLUserFilter",class:""}).appendTo(grUsr);
	$("<option>",{"value":0}).text("All users").appendTo(grUsrS);
	if(linkedUsers.length > 0 ){
		$.each(linkedUsers,function(iii,vvv){
			if(vvv != null){
				$("#grvLLUserFilter").append($("<option>",{"value":vvv.iduser}).text(genericlib.capitalizeFirstLetter(vvv.firstname)+" "+genericlib.capitalizeFirstLetter(vvv.lastname)));
			}
		});
	}
	grUsrS.on("change",function(){
		var v = $(this).val();
		if(v!=appFilter.users){appFilter["users"]=v;}
	});
	
	
	
	//data period
	var grDp = $("<div>").appendTo(gr2col);
	$("<div>",{class:"cdisLLLabel"}).text("Data period").appendTo(grDp);
	var grDpS = $("<select>",{"id":"grvLLPeriodFilter"}).appendTo(grDp);
	$.each(appDefine.periods, function(x,dp){
		$("<option>",{"value":dataperiodValues[x]}).text(dp).appendTo(grDpS);
	});
	grDpS.on("change",function(){
		var v = $(this).val();
		if(v!=appFilter.dp){appFilter["dp"]=v;}
	});
	
	//dtype
	var grDtype = $("<div>").appendTo(gr2col);
	$("<div>",{class:"cdisLLLabel"}).text("Type of diabetes").appendTo(grDtype);
	var grDtypeC = $("<div>",{class:"gr-dtype-checkbox"}).appendTo(grDtype);
	$("<div>",{"id":"dtype-filter-1",class:"gr-radio","grv-data":"1_2"}).appendTo(grDtypeC).text("Type1 and Type 2");
	$("<div>",{"id":"dtype-filter-2",class:"gr-radio last","grv-data":"3"}).appendTo(grDtypeC).text("Pre DM");
	
	$(".gr-dtype-checkbox div").click(function(){
		var dValue = appFilter.dtype;
		var rv = $(this).attr("grv-data");
		if(!$(this).hasClass("selected")){
			$(".gr-dtype-checkbox div").removeClass("selected");
			$(this).addClass("selected");
			dValue = rv;
		}
		appFilter['dtype'] = dValue;
	});
	//age
	var grAge = $("<div>").appendTo(gr2col1);
	$("<div>",{class:"cdisLLLabel"}).text("Age").appendTo(grAge);
	var grAgeC = $("<div>",{class:"gr-age-radio gr"}).appendTo(grAge);
	$("<div>",{"id":"age-filter-1",class:"gr-radio","grv-data":"1"}).appendTo(grAgeC).text("All");
	$("<div>",{"id":"age-filter-2",class:"gr-radio last","grv-data":"2"}).appendTo(grAgeC).text("Custom");
	var grAgeCustom = $("<div>",{class:"gr-age-custom gr-custom"}).appendTo(grAgeC);
	$("<label>",{}).appendTo(grAgeCustom).text("Between min");
	$("<input>",{"type":"text","id":"age-custom-min"}).appendTo(grAgeCustom);
	$("<label>",{}).appendTo(grAgeCustom).text(" and max");
	$("<input>",{"type":"text","id":"age-custom-max"}).appendTo(grAgeCustom);
	$(".gr-age-radio .gr-radio").click(function(){
		$(".gr-age-radio div").removeClass("selected");
		$(this).addClass("selected");
		if($(this).attr("grv-data") == "2"){
			$(".gr-age-custom").css("visibility","visible");
			grDpS.val(60);
			appFilter["dp"] = 60;
		}else{
			$(".gr-age-custom").css("visibility","hidden");
			appFilter["age"] = "0";
			$("#age-custom-min").val("");
			$("#age-custom-max").val("");
			//draw data
		}
	});
	
}
function drawToolbarButtons(container){
	//buttons
	$("<div>").appendTo($(".cdisLine2"));
	$("<div>").appendTo($(".cdisLine2"));
	var genBtn = $("<button>",{class:"cdisCisButton"}).text("Generate List").appendTo($(".cdisLine2"));
	genBtn.click(function(){
		setTimeout(applib.showProgress,10,$("#grvLocallistList"));
		if($("#age-filter-2").hasClass("selected")){
			var min = isNaN($("#age-custom-min").val())?"0":($("#age-custom-min").val() === '')?"0":$("#age-custom-min").val();
			var max = isNaN($("#age-custom-max").val())?"0":($("#age-custom-max").val() === '')?"0":$("#age-custom-max").val();
			$("#age-custom-min").val(min);
			$("#age-custom-max").val(max);
			appFilter["age"] = min+"_"+max;
		}
		
		$("#list-list102").text(toolbarConfig.lists[1].title+appDefine.periods[dataperiodValues.indexOf(Number(appFilter.dp))]);
		setTimeout(drawList,100, appFilter.list, listConfig, globalReport) ;
	});
	
	$("<button>",{class:"cdisCisButton"}).text("Back to Search").appendTo($(".cdisLine2")).click(function(){
		router.gts(appDefine.sid,appDefine.appLanguage);
	});
	
	$("<div>").appendTo(container);
	$("<div>").appendTo(container);
	$("<div>").appendTo(container);
	var expBtn = $("<button>",{class:"cdisCisButton"}).text("Export list to CSV").appendTo(container);
	expBtn.click(function(){
		var fn = "Local_Patient_List-"+genericlib.formatDate(new Date())+".csv";
		var header = nowReport.data.header;
		var rows = nowReport.data.datasets;
		exportToCsv(fn, rows,header);
	});
	
	var prtBtn = $("<button>",{class:"cdisCisButton"}).text("Print list").appendTo(container);
	prtBtn.click(function(){
		//var bconfig = {"width":"300","height":"250"};
		//var bbut = [{"text":"Close","action":"closeGRVPopup"},{"text":"Print","action":"prt"}];
		//var txt = "<p><center><span style='color:red;font-size:35px;'><i class='fa fa-exclamation-circle'></i></span><br><b>The list you are about to print contains confidental information.</b></center></p>";
		//showGRVPopup("Confidential information!",txt,bbut,bconfig);
		
		
		let config = {
					width:300,
					height:250,
					container:"grvWraper",
					buttons:[{
							"text":"Close",
							"action":"closeGRVPopup",
							"alias":"this"},
							{
								"text":"Print",
								"action":"printLLContainer","alias":"slib"}],
					content:txt,
					title:"Confidential information!"
			}
			shareData.pagepopup = new grvpopup(config);

	});
	$("<div>").appendTo(container);
	$("<div>").appendTo(container);
}


function loadNoHbA1cPatients(){
	var url = "/ncdis/client/reports/report.nohba1c?ts="+Date.now();
	$.getJSON(url, function(data){
		globalNoHBA1cReport = data;
		nowNoHBA1cReport = data;
	}).fail(function(){
       alert("An error has occurred.");
    });
}



function drawToolbarLists(container){
	container.empty();
	container.append($("<div>"))
	.append($("<div>",{class:"cdisLLTabs"}))
	.append($("<div>"))
	.append($("<div>"))
	.append($("<div>"));
	$.each(toolbarConfig.lists, function(i, list){
		var tt = list.title;
		if(list.id == "list102"){
			tt += appDefine.periods[dataperiodValues.indexOf(Number(appFilter.dp))];
		}
		$("<div>",{"id":"list-"+list.id,class:"cdisLLTab"}).appendTo($(".cdisLLTabs")).text(tt).click(function(){
			$(".cdisLLListContainer").css("visibility","hiden");
			$(".cdisLLTab").removeClass("selected");
			$(this).addClass("selected");
			appFilter["list"] = $(this).attr("id").replace("list-",""); 
			setTimeout(applib.showProgress,10,$("#grvLocallistList"));
			setTimeout(drawList,1000,appFilter.list, listConfig, globalReport);
		});
	});
}
function setToolbar(filter){
	$("#grvLLCommunityFilter").val(filter.idcommunity);
	$("#grvLLGenderFilter").val(filter.sex);
	$("#grvLLUserFilter").val(filter.users);
	$("#grvLLPeriodFilter").val(filter.dp);
	
	var dtypeValue = filter.dtype;
	$.each($(".gr-dtype-checkbox div"),function(i,e){
		var rv = $(this).attr("grv-data");
		if(dtypeValue.indexOf(rv) >= 0 ){
			$(this).addClass("selected");
		};
	});
	
	var ageValue = filter.age;
	if(ageValue == "0"){
		$(".gr-age-radio div").removeClass("selected");
		$("#age-filter-1").addClass("selected");
	}else{
		$(".gr-age-radio div").removeClass("selected");
		$("#age-filter-2").addClass("selected");
		$(".gr-age-custom").css("visibility","visible");
		var vs = ageValue.split('_');
		$("#age-custom-min").val(vs[0]);
		$("#age-custom-max").val(vs[1]);
	}
	
	
	$.each($(".cdisLLTabs .cdisLLTab"), function(i, list){
		$(".cdisLLTab").removeClass("selected");
		$("#list-"+filter.list).addClass("selected");
	});
	
}

/*
function drawStats(statsConfig, report){
	//patients  number - percentage improvved a1c from list
	var container = $("#"+statsConfig.container);
	var c = $("<div>",{class:"stats-layout"}).appendTo(container);
	c.append($("<div>",{class:"stats-gap"})).append($("<div>",{class:"stats-gap"})).append($("<div>",{class:"stats-gap"}))
	.append($("<div>",{class:"stats-gap"})).append($("<div>",{class:"stats-container"})).append($("<div>",{class:"stats-gap"}))
	.append($("<div>",{class:"stats-gap"})).append($("<div>",{class:"stats-gap"})).append($("<div>",{class:"stats-gap"}));
	//$("<div>",{class:"s-container t1","id":"s1"}).appendTo($(".stats-container"));
	$("<div>",{class:"s-container tp","id":"s1"}).appendTo($(".stats-container"));
	$("<div>",{class:"s-container tp","id":"s2"}).appendTo($(".stats-container"));
	$("<div>",{class:"s-container tp","id":"s3"}).appendTo($(".stats-container"));
}
*/


function drawList(listid,listConfig,report){
	
	if($(".cdisLLListContainer").length){
		$(".cdisLLListContainer").remove();
	}
	var listContainer = $("<div>",{class:"cdisLLListContainer lista"+listid}).appendTo($("#"+listConfig.container));
	
	if($(".cdisLLListContainer .cdisLLListHeaderContainer").length){
		$(".cdisLLListContainer .cdisLLListHeaderContainer").remove();
	}
	if($(".cdisLLListContainer .cdisLLListBodyContainer").length){
		$(".cdisLLListContainer .cdisLLListBodyContainer").remove();
	}
	
	var dataContainer = $("<div>",{class:"cdisLLListDataContainer"}).appendTo(listContainer);
	var headerContainer = $("<div>",{class:"cdisLLListHeaderContainer"}).appendTo(listContainer);
	var bodyContainer = $("<div>",{"id":"grvLLListBody",class:"cdisLLListBodyContainer"}).appendTo(listContainer);
	bodyContainer.height($("#"+listConfig.container).height() - dataContainer.height() - headerContainer.height());
	
	drawListHeader(dataContainer, listid);
	var r = applyFilter(report,appFilter);
	nowReport = getReport(r);
	
	drawListTableHeader(headerContainer,r,listid);
	var stats = drawListTableBody(bodyContainer,r,listid);
	refreshHeaderStats(stats);
	listContainer.css("visibility","visible");
	applib.hideProgress($("#grvLocallistList"));
}

function drawListHeader(container, listid){
	$("<div>",{class:"cdisLLSearchButton search-"+listid}).appendTo(container).html('<i class="fa fa-search"></i>');
	if(listid == "list101"){
		$("<div>",{class:"cdisLLListDataContainerPanel panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Total")).append($("<div>",{class:"pvalue","id":"pTotal"}));
		$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Decreased")).append($("<div>",{class:"pvalue","id":"pImproved"})).append($("<div>",{class:"prvalue","id":"prImproved"}));
		$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Increased")).append($("<div>",{class:"pvalue","id":"pSetback"})).append($("<div>",{class:"prvalue","id":"prSetback"}));
		$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("No Change")).append($("<div>",{class:"pvalue","id":"pConstant"})).append($("<div>",{class:"prvalue","id":"prConstant"}));
	}else if(listid == "list102"){
		$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Total")).append($("<div>",{class:"pvalue","id":"pTotal"})).append($("<div>",{class:"prvalue","id":"prTotal"}));
	}else if(listid == "list103"){
		$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Total")).append($("<div>",{class:"pvalue","id":"pTotal"})).append($("<div>",{class:"prvalue","id":"prTotal"}));
		if(appFilter.dtype == "3"){
			$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Less than 0.06")).append($("<div>",{class:"pvalue","id":"pUnder6"})).append($("<div>",{class:"prvalue","id":"prUnder6"}));
		}else{
			$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Less than or equal to 0.07")).append($("<div>",{class:"pvalue","id":"pUnder7"})).append($("<div>",{class:"prvalue","id":"prUnder7"}));
			$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Less than 0.08")).append($("<div>",{class:"pvalue","id":"pUnder8"})).append($("<div>",{class:"prvalue","id":"prUnder8"}));
			$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Greater than or equal to 0.09")).append($("<div>",{class:"pvalue","id":"pOver9"})).append($("<div>",{class:"prvalue","id":"prOver9"}));
			$("<div>",{class:"cdisLLListDataContainerPanelPr panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Average HbA1c")).append($("<div>",{class:"prvalue","id":"prAvg"}));
		}
	}else if(listid == "list104"){
		$("<div>",{class:"cdisLLListDataContainerPanel panel-cell"}).appendTo(container).append($("<div>",{class:"plabel"}).text("Total")).append($("<div>",{class:"pvalue","id":"pTotal"}));
	}
	
	var f = $("<div>",{class:"cdisLLSearchForm form-"+listid}).appendTo(container);
	$("<div>",{class:"cdisLLSearchFormLabel"}).text("Name").appendTo(f);
	$("<div>",{class:"cdisLLSearchFormText"}).appendTo(f).append($("<input>",{class:"text-input","id":"text-input-name"}));
	$("<div>",{class:"cdisLLSearchFormLabel"}).text("Chart").appendTo(f);
	$("<div>",{class:"cdisLLSearchFormText"}).appendTo(f).append($("<input>",{class:"text-input","id":"text-input-chart"}));
	$("<div>",{class:"cdisLLSearchFormButton disabled"}).text("Clear list").appendTo(f).click(function(){
		$(".cdisLLSearchFormText input").val("");
		drawListTableBody($("#grvLLListBody"), nowReport, listid);
		$(this).addClass("disabled");
	});
	
	
	
	$(".search-"+listid).click(function(){
		var p = $(this).parent();
		if($(this).hasClass("selected")){
			$(this).removeClass("selected");
			$(p).find(".cdisLLSearchForm").fadeOut(function(){
				$(p).find(".panel-cell").fadeIn();
				
			});
		}else{
			$(p).find(".panel-cell").fadeOut(function(){
				$(p).find(".cdisLLSearchForm").css("display","grid");
				$(p).find(".cdisLLSearchForm").fadeIn();
				$(p).find(".cdisLLSearchFormText input").focus();
			});
			$(this).addClass("selected");
		}
	});
	

	$(".cdisLLSearchFormText input").keyup(function(event){
		var crit = $(this).attr("id").replace("text-input-","");
		clearTimeout(searchTimer);
		searchTimer = setTimeout(function(){
			if ( event.which == 13 ) {
			     event.preventDefault();
			  }
			var v1 = $("#text-input-name").val();
			var v2 = $("#text-input-chart").val();
			if(v1.length >= 2 || v2.length >= 2){
				$(".cdisLLSearchFormButton").removeClass("disabled");
				drawListTableBody($("#grvLLListBody"), searchListTerm(nowReport), listid);
			}else{
				drawListTableBody($("#grvLLListBody"), nowReport, listid);
			}
		}, 500);
	});

}
function searchListTerm(report){
	var result = {};
	var fullnameSearch = $("#text-input-name").val();
	var chartSearch = $("#text-input-chart").val();
	var hasName = false;
	var hasChart=false;
	if(fullnameSearch != "" ){
		hasName = true;
	}
	if(chartSearch != "" && !isNaN(chartSearch)){
		hasChart = true;
		
	}
	result["data"] = {};
	result["data"]["header"] = report.data.header;
	result["data"]["datasets"] = [];
	$.each(report.data.datasets, function(i,o){
		var rvName = o.fullname.toLowerCase();
		var rvChart = o.chart;
		var isIn= false;
		if(hasName){
			if(hasChart){
				if(rvName.indexOf(fullnameSearch.toLowerCase())>=0 && rvChart.indexOf(chartSearch.toLowerCase())>=0){
					result["data"]["datasets"].push(o);
				}
			}else{
				if(rvName.indexOf(fullnameSearch.toLowerCase())>=0){
					result["data"]["datasets"].push(o);
				}
			}
		}else{
			if(hasChart){
				if(rvChart.indexOf(chartSearch.toLowerCase())>=0){
					result["data"]["datasets"].push(o);
				}
			}else{
				
			}
		}
		
	});
	return result;
}
function applyFilter(report,filter){
	var result = {};
	var ds = report.data.datasets;
	var beforeFilterDs = report.data.datasets;
	var dsresult = [];
	var dsresultNoDataFilter = [];
	result["data"] = {};
	result["data"]["header"] = report.data.header; 
	
	
	$.each(ds, function(i,obj){
		//community
		var hasCommunity = false;
		if(filter.idcommunity != "0"){
			if(obj.idcommunity == filter.idcommunity) hasCommunity=true;
		}else{
			hasCommunity = true;
		}

		var hasSex = false;
		if(filter.sex != "0"){
			if(obj.sex == filter.sex) hasSex=true;
		}else{
			hasSex = true;
		}
		
		var hasUsers = false;
		if(filter.users != "0"){
			if(obj.users.indexOf(filter.users) >=0 ) hasUsers=true;
		}else{
			hasUsers = true;
		}
		
		var dpValue = filter.dp;
		var hasDate = false;
		/*
		 * temporar add 36 month 
		 * */
		if(dpValue != "0"){
			dpValue = dpValue;
			let d = new Date();
			var filterDate = d.setMonth(d.getMonth() - dpValue);
			//moment().subtract(dpValue, 'months');
			//var reportDate = moment(obj.last_hba1c_collecteddate);
			var reportDate = new Date(obj.last_hba1c_collecteddate);
			hasDate = (reportDate > new Date(filterDate));
			
			if(filter.list == "list102"){
				hasDate = (reportDate < new Date(filterDate));
			}
			//alert(moment(reportDate).format("YYYY-MM-DD")+"     "+moment(filterDate).format("YYYY-MM-DD") + "    "+ hasDate);
		}else{
			//no data period filter = all time
			hasDate = true;
		}

		var hasDtype = false;
		if(obj.dtype != ""){
			if(filter.dtype.indexOf(obj.dtype) >= 0 )hasDtype = true;
		}
		 
		
		var hasAge = false;
		if(filter.age.indexOf("_") >= 0){
			var ages = filter.age.split("_");
			if(Number(obj.age) >= Number(ages[0]) && Number(obj.age) <= Number(ages[1])){
				hasAge = true;
			}
		}else{
			hasAge=true;
		}
		
		var hasHBA1c = false;
		if(typeof(obj.last_hba1c) != "undefined"){
			if(filter.hba1c.indexOf("_") >= 0){
				var a1cs = filter.hba1c.split("_");
				if(obj.last_hba1c >= a1cs[0] && obj.last_hba1c <= a1cs[1]){
					hasHBA1c = true;
				}
			}else if(filter.hba1c == "0"){
				//(obj.last_hba1c >= 0.075
				hasHBA1c=true;
			}else if(filter.hba1c == "1"){
				if(obj.last_hba1c >= 0.075)hasHBA1c=true;
			}
		}else{
			hasHBA1c=true;
		}
		
		if(hasCommunity && hasDate && hasDtype && hasAge && hasHBA1c  && hasSex && hasUsers){
			if(filter.list == "list101"){
				if(obj.delta != ""){dsresult.push(obj);}else{ }
			}else if(filter.list == "list102"){
				if(obj.last_hba1c_colleteddate != ""){dsresult.push(obj);}
			}else if(filter.list == "list103"){
				if(obj.last_hba1c != ""){dsresult.push(obj);}
			}
		}else{
			
		}
	});
	
	//the values for data dates should always be calculated excluding data date filter
	
	if(filter.list == "list101"){dsresult.sort(compareDeltaDesc);}
	if(filter.list == "list102"){dsresult.sort(compareLastDateDesc);}
	if(filter.list == "list103"){dsresult.sort(compareHBA1cDesc);}
	result["data"]["datasets"] = dsresult;
	return result;
}

function compareDDurationAsc(a,b) {if (Number(a.dduration) < Number(b.dduration)){return -1;}if (Number(a.dduration) > Number(b.dduration)){return 1;}return 0;}
function compareDDurationDesc(a,b) {if (Number(a.dduration) > Number(b.dduration)){return -1;}if (Number(a.dduration) < Number(b.dduration)){return 1;}return 0;}
function compareAgeAsc(a,b) {if (Number(a.age) < Number(b.age))return -1;if (Number(a.age) > Number(b.age))return 1;return 0;}
function compareAgeDesc(a,b) {if (Number(a.age) < Number(b.age))return 1;if (Number(a.age) > Number(b.age))return -1;return 0;}
function compareDeltaAsc(a,b) {if (Number(a.delta) < Number(b.delta))return -1;if (Number(a.delta) > Number(b.delta))return 1;return 0;}
function compareDeltaDesc(a,b) {if (Number(a.delta) < Number(b.delta))return 1;if (Number(a.delta) > Number(b.delta))return -1;return 0;}
function compareLastDateAsc(a,b) {if (new Date(a.last_hba1c_collecteddate) > (new Date(b.last_hba1c_collecteddate)))return 1;if (new Date(a.last_hba1c_collecteddate) < (new Date(b.last_hba1c_collecteddate)))return -1;return 0;}
function compareLastDateDesc(a,b) {if (new Date(a.last_hba1c_collecteddate) < (new Date(b.last_hba1c_collecteddate)))return 1;if (new Date(a.last_hba1c_collecteddate) > (new Date(b.last_hba1c_collecteddate)))return -1;return 0;}
function compareHBA1cDesc(a,b) {if (a.last_hba1c < b.last_hba1c)return 1;if (a.last_hba1c > b.last_hba1c)return -1;return 0;}
function compareHBA1cAsc(a,b) {if (a.last_hba1c > b.last_hba1c)return 1;if (a.last_hba1c < b.last_hba1c)return -1;return 0;}



function drawListTableHeader(container, report, listid){
	
	container.empty();
	var reportHeader = report.data.header;
	var header = eval("listConfig."+listid+".header");
	$.each(header,function(index,column){
		var hconf = getReportHeaderConfig(column,reportHeader);
		if(column == "trend"){
			$("<div>").text("Trend").appendTo(container);
		}else{
			var cls = "";
			if(column == "fullname") cls = "fullname";
			if(column == "dduration"){
				var s = $("<div>",{class:"head "+cls,"title":"Click to sort list by duration of diabetes"}).html(hconf.display+"<span data='0'>&nbsp;</span>").appendTo(container);
				
				s.click(function(){
					var d = $(this).find("span").attr("data");
					$(container).find(".sortable").removeClass("sortable");
					$(container).find("span").html("&nbsp;");
					$(container).find("span").attr("data",0);
					$(this).addClass("sortable");
					if(d == "0"){
						var rep = {"data":{"header":{},"datasets":[]}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareDDurationAsc);
						$(this).find("span").html("&uarr;");
						$(this).find("span").attr("data",1);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "1"){
						var rep = {"data":{"header":{},"datasets":{}}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareDDurationDesc);
						$(this).find("span").html("&darr;");
						$(this).find("span").attr("data",2);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "2"){
						$(this).removeClass("sortable");
						drawListTableBody($("#grvLLListBody"), nowReport, listid);
						$(this).find("span").html("&nbsp;");
						$(this).find("span").attr("data",0);
					}
				});
			}else if(column == "last_hba1c"){
				var s = $("<div>",{class:"head "+cls,"title":"Click to sort list by value of HbA1c"}).html(hconf.display+"<span data='0'>&nbsp;</span>").appendTo(container);
				s.click(function(){
					var d = $(this).find("span").attr("data");
					$(container).find(".sortable").removeClass("sortable");
					$(container).find("span").html("&nbsp;");
					$(container).find("span").attr("data",0);
					$(this).addClass("sortable");
					if(d == "0"){
						var rep = {"data":{"header":{},"datasets":[]}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareHBA1cAsc);
						$(this).find("span").html("&uarr;");
						$(this).find("span").attr("data",1);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "1"){
						var rep = {"data":{"header":{},"datasets":{}}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareHBA1cDesc);
						$(this).find("span").html("&darr;");
						$(this).find("span").attr("data",2);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "2"){
						$(this).removeClass("sortable");
						drawListTableBody($("#grvLLListBody"), nowReport, listid);
						$(this).find("span").html("&nbsp;");
						$(this).find("span").attr("data",0);
					}
				});
			}else if(column == "last_hba1c_collecteddate"){
				var s = $("<div>",{class:"head "+cls,"title":"Click to sort list by Last Collected Date of HbA1c"}).html(hconf.display+"<span data='0'>&nbsp;</span>").appendTo(container);
				s.click(function(){
					var d = $(this).find("span").attr("data");
					$(container).find(".sortable").removeClass("sortable");
					$(container).find("span").html("&nbsp;");
					$(container).find("span").attr("data",0);
					$(this).addClass("sortable");
					if(d == "0"){
						var rep = {"data":{"header":{},"datasets":[]}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareLastDateAsc);
						$(this).find("span").html("&uarr;");
						$(this).find("span").attr("data",1);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "1"){
						var rep = {"data":{"header":{},"datasets":{}}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareLastDateDesc);
						$(this).find("span").html("&darr;");
						$(this).find("span").attr("data",2);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "2"){
						$(this).removeClass("sortable");
						drawListTableBody($("#grvLLListBody"), nowReport, listid);
						$(this).find("span").html("&nbsp;");
						$(this).find("span").attr("data",0);
					}
				});
			}else if(column == "age"){
				var s = $("<div>",{class:"head "+cls,"title":"Click to sort list by Age"}).html(hconf.display+"<span data='0'>&nbsp;</span>").appendTo(container);
				s.click(function(){
					var d = $(this).find("span").attr("data");
					$(container).find(".sortable").removeClass("sortable");
					$(container).find("span").html("&nbsp;");
					$(container).find("span").attr("data",0);
					$(this).addClass("sortable");
					if(d == "0"){
						var rep = {"data":{"header":{},"datasets":[]}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareAgeAsc);
						$(this).find("span").html("&uarr;");
						$(this).find("span").attr("data",1);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "1"){
						var rep = {"data":{"header":{},"datasets":{}}};
						rep["data"]["header"] = report.data.header;
						rep["data"]["datasets"] = report["data"]["datasets"];
						var dset = rep["data"]["datasets"];
						rep["data"]["datasets"] = dset.sort(compareAgeDesc);
						$(this).find("span").html("&darr;");
						$(this).find("span").attr("data",2);
						drawListTableBody($("#grvLLListBody"), rep, listid);
					}else if(d == "2"){
						$(this).removeClass("sortable");
						drawListTableBody($("#grvLLListBody"), nowReport, listid);
						$(this).find("span").html("&nbsp;");
						$(this).find("span").attr("data",0);
					}
				});
			}else{
				$("<div>",{class:"head "+cls}).text(hconf.display).appendTo(container);
			}
			
		}
	});
}
function getReportHeaderConfig(column, headerArray){
	var result = {};
	$.each(headerArray,function(i,ob){
		if(ob.name == column) result = ob;
	});
	return result;
}
function drawListTableBody(container,report,listid){
	
	//container.css("height",container.height()+"px");
	container.empty();
	var header = eval("listConfig."+listid+".header");
	var reportHeader = report.data.header;
	var hconfObj = {};
	$.each(header,function(index,column){
		var hconf = getReportHeaderConfig(column,reportHeader);
		hconfObj[column] = hconf;
	});
	var reportBody = report.data.datasets;
	
	var dataHeaderStats = {};
	
	var bc = document.getElementById("grvLLListBody");
	var c = document.createDocumentFragment();
	
	var totalTotal = getAllPatients(globalReport, appFilter.idcommunity);
	
	var pTotal = 0;
	var prTotal=0;
	var pMale = 0;
	var prMale = 0;
	var pFemale = 0;
	var prFemale = 0;
	var pImproved = 0;
	var prImproved = 0;
	var pSetback = 0;
	var prSetback = 0;
	var pConstant = 0;
	var prConstant = 0;
	var pUnder = 0;
	var prUnder = 0;
	var pBetween = 0;
	var prBetween = 0;
	var pOver = 0;
	var prOver = 0;
	var pLastmonth = 0;
	var prLastmonth = 0;
	var pUnder7=0;
	var prUnder7=0;
	var pUnder6=0;
	var prUnder6=0;
	var pUnder8=0;
	var prUnder8=0;
	var pAvg=0;
	var prAvg=0;
	var pOver9=0;
	var prOver9=0;
	var pMorethan5=0;
	var prMorethan5=0;
	var pMorethan10=0;
	var prMorethan10=0;
	
	var vTotal=0;
	
	$.each(reportBody,function(i,row){
		var e = document.createElement("div");
	    e.className = "cdisLLListBodyContainerLine";
	    e.id = row.ramq+"_"+row.idpatient;
	    bc.appendChild(e);
		
		$.each(header,function(index,column){
			if(column == "trend"){
				var e1 = document.createElement("div");
				if(listid == "list101"){
					e1.style="background-color:"+getColor(row.indexDelta,row.totalDelta,row.delta);
				}else if(listid == "list102" || listid == "list103"){
					e1.style="background-color:"+getColor(i,reportBody.length,1);
				}
			    
			    e1.className="trend";
			    e1.id = "trend_"+row.idpatient;
			    e.appendChild(e1);
			    
				//$("<div>").appendTo(linie).css("background-color",getColor(i,reportBody.length));
			}else{
				var cls = "value "+column;
			    var e2 = document.createElement("div");
			    if(column == "fullname"){ 
			    	cls = "value fullname";
			    	e2.id = "fullname_"+row.idpatient; /*version  3.7.0.1*/
			    }
				e2.className = cls;
				e2.innerText = renderValue(eval("row."+column),hconfObj[column]);
				e.appendChild(e2);
			}
			/**/
		});
		
		pTotal++;
		vTotal = vTotal + (row.last_hba1c*1000)/1000;
		
		if(row.sex == "1"){pMale++;}else{pFemale++;}
		if(row.delta < 0 ){pImproved++;}
		if(row.delta > 0 ){pSetback++;}
		if(row.delta == 0 ){pConstant++;}
		if(row.last_hba1c < 0.06){pUnder++;}else if(row.last_hba1c >= 0.06 && row.last_hba1c <= 0.07){pBetween++;}else if(row.last_hba1c > 0.07){pOver++;}
		if((new Date(row.last_hba1c_collecteddate)) > (new Date()).setMonth((new Date()).getMonth() - 1)){pLastmonth++;}
		if(row.last_hba1c <= 0.07){pUnder7++;}
		if(row.last_hba1c <= 0.06){pUnder6++;}
		if(row.last_hba1c < 0.08){pUnder8++;}
		if(row.last_hba1c >= 0.09){pOver9++;}
		if((new Date(row.last_hba1c_collecteddate)) < ((new Date()).setYear((new Date()).getYear() - 5))){pMorethan5++;}
		if((new Date(row.last_hba1c_collecteddate)) < ((new Date()).setYear((new Date()).getYear() - 10))){pMorethan10++;}
	});
	
	dataHeaderStats["pImproved"]=pImproved;
	dataHeaderStats["prImproved"]=Math.round((pImproved/pTotal)*100)+"%";
	dataHeaderStats["pConstant"]=pConstant;
	dataHeaderStats["prConstant"]=Math.round(100*pConstant/pTotal)+"%";
	dataHeaderStats["pTotal"]=pTotal;
	dataHeaderStats["prTotal"] = Math.round(100*pTotal/totalTotal)+"%";
	dataHeaderStats["pSetback"]=pSetback;
	dataHeaderStats["prSetback"]=Math.round(100*pSetback/pTotal)+"%";
	dataHeaderStats["pMale"]=pMale;
	dataHeaderStats["prMale"]=Math.round(100*pMale/pTotal)+"%";
	dataHeaderStats["pFemale"]=pFemale;
	dataHeaderStats["prFemale"]=Math.round(100*pFemale/pTotal)+"%";
	dataHeaderStats["pLastmonth"]=pLastmonth;
	dataHeaderStats["prLastmonth"]=Math.round(100*pLastmonth/pTotal)+"%";
	dataHeaderStats["pUnder"]=pUnder;
	dataHeaderStats["prUnder"]=Math.round(100*pUnder/pTotal)+"%";
	dataHeaderStats["pOver"]=pOver;
	dataHeaderStats["prOver"]=Math.round(100*pOver/pTotal)+"%";
	dataHeaderStats["pBetween"]=pBetween;
	dataHeaderStats["prBetween"]=Math.round(100*pBetween/pTotal)+"%";
	dataHeaderStats["pUnder7"]=pUnder7;
	dataHeaderStats["pUnder6"]=pUnder6;
	dataHeaderStats["prUnder7"]=Math.round(100*pUnder7/pTotal)+"%";
	dataHeaderStats["prUnder6"]=Math.round(100*pUnder6/pTotal)+"%";
	dataHeaderStats["pUnder8"]=pUnder8;
	dataHeaderStats["prUnder8"]=Math.round(100*pUnder8/pTotal)+"%";
	dataHeaderStats["pOver9"]=pOver9;
	dataHeaderStats["prOver9"]=Math.round(100*pOver9/pTotal)+"%";
	dataHeaderStats["pAvg"]=Number.parseFloat(vTotal/pTotal).toFixed(3);
	dataHeaderStats["prAvg"]=Number.parseFloat(vTotal/pTotal).toFixed(3);
	dataHeaderStats["pMorethan5"]=pMorethan5;
	dataHeaderStats["prMorethan5"]=Math.round(100*pMorethan5/pTotal)+"%";
	dataHeaderStats["pMorethan10"]=pMorethan10;
	dataHeaderStats["prMorethan10"]=Math.round(100*pMorethan10/pTotal)+"%";
	
	
	$(".cdisLLListBodyContainerLine").on("click",function(){
		var lid = $(this).attr("id");
		var parts = lid.split("_");
		if(!$(this).hasClass("selected")){
			$(".cdisLLListBodyContainerLine").removeClass("selected");
			var hasTrend = false;
			if($(".trend").length){
				hasTrend = true;
				$(".trend").empty();
			}else{
				$(".fullname-button").remove();
			}
			
			closeAllPatientView();
			$(this).addClass("selected");
			patientlib.getPatientRecord("ramq",parts[0]);
			var bc = $("#trend_"+parts[1]);
			var nc = "";
			if(!hasTrend) {
				bc =  $("#fullname_"+parts[1]);
				nc = "fullname-button";
			}
			$("<div>",{class:"cdisCisButton "+nc}).text("view").appendTo(bc).click(function(){
				if($(this).hasClass("view-on")){
					closeAllPatientView();
					$(this).removeClass("view-on");
					$(this).text("view");
					
				}else{
					$(this).addClass("view-on");
					$(this).text("close");
					createPatientView($("#"+lid));
				}
			});
		}else{
			
		}
	});
	return dataHeaderStats;
}
function closeAllPatientView(){
	$(".cdisViewPatientContainer").slideUp("fast", function() {
		 $(".cdisGrafsContainer").css("visibility","hidden");
		 $(".cdisViewPatientContainer").remove();
	});
}
function createPatientView(line){
	var lid = $(line).attr("id");
	var parts = lid.split("_");

	var viewContainer = $("<div>",{class:"cdisViewPatientContainer","id":"view-patient_"+lid});
	
	var c = $("<div>",{class:"cdisGrafsContainer"}).appendTo(viewContainer);
	var gap = $("<div>",{class:"graf-gap"});
	c.append($("<div>",{class:"graf-gap"})).append($("<div>",{class:"graf-gap"})).append($("<div>",{class:"graf-gap"}));
	var gc = $("<div>",{class:"cdisViewPatientGraphsContainer"})
		.append($("<div>",{class:"cdisViewPatientGraphContainer","id":"lab_hba1c"}).append($("<div>",{class:"title"}).text("HBA1c (Percentage)")))
		.append($("<div>",{class:"cdisViewPatientGraphContainer","id":"lipid_ldl"}).append($("<div>",{class:"title"}).text("LDL (mmol/L)")))   
		.append($("<div>",{class:"cdisViewPatientGraphContainer","id":"renal_acratio"}).append($("<div>",{class:"title"}).text("AcRatio (mg/mmol)")))
		.append($("<div>",{class:"cdisViewPatientGraphContainer","id":"renal_egfr"}).append($("<div>",{class:"title"}).text("eGFR (ml/min)")));
	
	var bc = $("<div>",{class:"cdisViewPatientButtonsContainer"}).append($("<div>",{class:"cdisCisButton cdisViewPatientDetail","id":"detail_"+lid}).text("View Patient Detail")).append($("<div>",{class:"cdisCisButton cdisViewPatientClose","id":"close_"+lid}).text("Close"));
	c.append($("<div>")).append(gc).append($("<div>"));
	c.append($("<div>")).append(bc).append($("<div>"));
	
	viewContainer.insertAfter(line);
	
	viewContainer.slideDown('slow', function() {
		$(".cdisGrafsContainer").css("visibility","visible");
		setTimeout(dg,100);
	});
}
function dg(){
	var p = "lab_hba1c".split("_");
	graphlib.drawGraphValue(p[0],p[1]);
	var p1 = "lipid_ldl".split("_");
	graphlib.drawGraphValue(p1[0],p1[1]);
	var p2 = "renal_acratio".split("_");
	graphlib.drawGraphValue(p2[0],p2[1]);
	var p3 = "renal_egfr".split("_");
	graphlib.drawGraphValue(p3[0],p3[1]);
	
	$(".cdisViewPatientClose").click(function(){
		var lid = $(this).attr("id").replace("close_","");
		var parts = lid.split("_");
		closeAllPatientView();
		if($(".trend").length){
			$("#trend_"+parts[1]).empty();
		}else{
			$(".fullname-button").remove();
		}
		$("#"+lid).removeClass("selected");
	});
	
	$(".cdisViewPatientDetail").click(function(){
		var lid = $(this).attr("id").replace("detail_","");
		var parts = lid.split("_");
		var fllparams = "&fll=1";
		$.each(appFilter, function(k,v){
			fllparams+="&"+"fll_"+k+"="+v
		});
		fllparams+="&"+"fll_ramq="+parts[0];
		router.gtc(appDefine.sid,appDefine.appLanguage,parts[0],"patient",fllparams);	
	});
	
}
function getColor(indexDelta, totalDelta, delta){
	var result = "#ffffff";
	var r = 255;
	var g = 0;
	
	if(Number(delta) == 0){
		result = "rgb(255,255,0)";
		
	}else if(Number(delta) > 0){
		let p = Number(indexDelta)/Number(totalDelta);
		g = Math.round(p*255);
		result = "rgb(255,"+g+",0)";
	}else if(Number(delta) < 0){
		let p = Number(indexDelta)/Number(totalDelta);
		r = Math.round(p*255);
		result = "rgb("+(255-r)+",255,0)";
	}
	
	return result;
}
function renderValue(value,valueConfig){
	if(appDefine.isDemo){
		if(valueConfig.name == "ramq"){
			//value = makelid(4)+makenid(8);
			value = "XXXX12345678";
		}else if(valueConfig.name == "chart"){
			//value = makenid(4);
			value = "0000";
		}else if(valueConfig.name == "fullname"){
			value = "Patient Full name "+ makelid(4);
		}
	}
	
	if(valueConfig.type == "text"){ 
		return value;
	}else if(valueConfig.type == "number" ){
		if(valueConfig.format.indexOf("N.") >=0 ){ 
			return Number(value).toFixed(valueConfig.format.replace("N.","").length);
		}else{
			//exeption for duration of diabetes
			if(valueConfig.name == "dduration"){
				if(value == 0){
					value = "< 1";
				}
				return value;
			}else{
				return value;
			}
			
		}
	}else if(valueConfig.type == "date" ){
		//return moment(value).format(valueConfig.format);
		return genericlib.formatDate(new Date(value),valueConfig.format);
	}else if(valueConfig.type == "array"){
		var arr = eval("report_"+valueConfig.name);
		return arr[value];
	}else{
		return value;
	}
}
function refreshHeaderStats(stats){
	$.each(stats,function(key, value){
		$("#"+key).text(value);
	});
	
}

function refreshStats(){
	trendStatsDataFlag=false;
	setTimeout(getTrendSeries, 100);
	setTimeout(getPeriodSeries, 50);
	setTimeout(getValueSeries, 80);
}

function getTrendSeries(){
	var data = {};
	data["stats"] = "trend";
	data["period"]=appFilter.dp;
	data["dtype"] = appFilter.dtype;
	data["age"] = appFilter.age;
	data["idcommunity"] = appFilter.idcommunity;
	data["hba1c"] = appFilter.hba1c;
	data["sex"] = appFilter.sex;
	
	$("#s1").empty();
	$("#s1")
	.append($("<div>",{class:"title"}).text("HbA1c trend"))
	.append($("<div>",{class:"tp-graph","id":"trend-graph"}));
	
	var trendStats = $.ajax({
		  url: "/ncdis/service/data/getStatsData?sid="+sid+"&language=en",
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			trendStatsData = json.objs[0];
			$("#trend-graph").css("background","#cdcdcd");
			drawAreaGraph($("#trend-graph"), trendStatsData);
		}).fail(function( jqXHR, textStatus ) {
			
		  alert( "Request failed: " + textStatus );
		});	
}
function getPeriodSeries(){
	var data = {};
	data["stats"] = "period";
	data["period"]=appFilter.dp;
	data["dtype"] = appFilter.dtype;
	data["age"] = appFilter.age;
	data["idcommunity"] = appFilter.idcommunity;
	data["hba1c"] = appFilter.hba1c;
	data["sex"] = appFilter.sex;
	$("#s2").empty();
	$("#s2")
	.append($("<div>",{class:"title"}).text("Percent of patients with HbA1C in past 12 months"))
	.append($("<div>",{class:"tp-graph","id":"period-graph"}));
	var trendStats = $.ajax({
		  url: "/ncdis/service/data/getStatsData?sid="+sid+"&language=en",
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			periodStatsData = json.objs[0];
			$("#period-graph").css("background","#cdcdcd");
			drawLineGraphReport($("#period-graph"), periodStatsData);
		}).fail(function( jqXHR, textStatus ) {
			
		  alert( "Request failed: " + textStatus );
		});	
}
function getValueSeries(){
	var data = {};
	data["stats"] = "value";
	data["period"]=appFilter.dp;
	data["dtype"] = appFilter.dtype;
	data["age"] = appFilter.age;
	data["idcommunity"] = appFilter.idcommunity;
	data["hba1c"] = appFilter.hba1c;
	data["sex"] = appFilter.sex;
	
	
	var tit = "Patients with HbA1C ";
	if(appFilter.hba1c == "1"){
		tit+= "over 0.075"
	}else{
		var ps = appFilter.hba1c.split("_");
		tit += "between "+ps[0]+" and "+ps[1]+"."
	}
	$("#s3").empty();
	$("#s3")
	.append($("<div>",{class:"title"}).text(tit))
	.append($("<div>",{class:"tp-graph","id":"value-graph"}));
	
	setTimeout(applib.showProgress,10,$("#value-graph"));
	var trendStats = $.ajax({
		  url: "/ncdis/service/data/getStatsData?sid="+sid+"&language=en",
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			valueStatsData = json.objs[0];
			$("#value-graph").css("background","#cdcdcd");
			drawBarLineGraph($("#value-graph"), valueStatsData);
			applib.hideProgress($("#value-graph"));
		}).fail(function( jqXHR, textStatus ) {
			
		  alert( "Request failed: " + textStatus );
		});	
}
function exportToCsv(filename, rows, header) {
	
	var processHeader = function (header) {
		var cnt = 0;
		var finalVal = '';
    	$.each(header, function(k,vob){
   			finalVal += '"' + vob.display +'",';	
    	});
    	finalVal += '\r\n';
    	return finalVal;
	};
	
    var processRow = function (row, header) {
        var finalVal = '';
       	$.each(header, function(k,v){
       		if(v.type == "array"){
				//there is an array to convert values	
				var iValue = row[v.name];
				var aValue = eval("report_"+v.name+"[iValue]");
				finalVal += '"'+aValue+'",';
			}else if (v.type == "number"){
				var nValue = row[v.name];
				if(nValue != ""){
					var cValue = Number(nValue);
					if(!isNaN(cValue)) cValue = cValue.toFixed(v.format.substring(2).length);	
				}else{
					var cValue = "no value";
				}
				finalVal += '"'+cValue+'",';
				
			}else if(v.type == "date"){
				var dValue = row[v.name];
				if(dValue != ""){
					var d = moment(dValue, 'YYYY-MM-DD HH:mm:ss.S');
					var val = d.format(v.format);	
				}else{
					var val = "no date";
				}
				finalVal += '"'+val+'",';
			}else if(v.type == "text"){
				var nValue = row[v.name];
				finalVal += '"'+nValue+'",';
			}
       	});
        finalVal += '\r\n';    	
		return finalVal;            	
    };
    
    
    var csvFile = processHeader(header);
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i], header);
    }
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    }else{
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
function getReportTitle(filter, type){
	var result = "List of patients ";
	if(type == "graph"){
		result = "Graphic historical representation of patients"
	}
	if(filter.sex != "0"){
		result = "List of "+appDefine.genders[filter.sex].toLowerCase()+" patients "
		if(type == "graph"){
			result = "Graphic historical representation of "+appDefine.genders[filter.sex].toLowerCase()+" patients "
		}
	}
	if (filter.idcommunity == "0"){
		result += " from <b>all Cree communities</b> ";
	}else {
		result += " from <b>"+ appDefine.communities[filter.idcommunity]+"</b> ";
	}
	
	var dtypes = filter.dtype.replace("_","");
	var dtypesParts = dtypes.split('');
	result += " with type of diabetes ";
	for(var i=0;i<dtypesParts.length;i++){
		if(i == dtypesParts.length -1){
			result += " <b>"+report_dtype[dtypesParts[i]]+"</b> ";
		}else{
			result += "<b>"+report_dtype[dtypesParts[i]]+"</b> and ";
		}
	}

	if(filter.age == "0"){
		result += " from <b>all ages</b> ";
	}else{
		var agesParts = filter.age.split("_");
		result += " from ages between <b>"+agesParts[0]+"</b> and <b>"+agesParts[1]+"</b> ";
	}
	
	if(filter.hba1c == "0"){
		result += " having no filter on HBA1c value ";
	}else if(filter.hba1c == "1"){
		result += " having HBA1c value greater than <b>0.075</b> ";
	}else{
		var hba1cParts = filter.hba1c.split("_");
		result += " having HBA1c value between <b>"+hba1cParts[0]+"</b> and <b>"+hba1cParts[1]+"</b> ";
	}
	
	var dpStr = "last 6 months ";
	if(filter.dp == 12) dpStr = " last 12 months ";
	if(filter.dp == 24) dpStr = " last 2 years ";
	if(filter.dp == 60) dpStr = " last 5 years ";
	result += " with HBA1c data recorded in the "+dpStr+". ";
	
	var usersStr = "<br>There is no linkeage between patients and health care workers.";
	if(filter.users != "0"){
		usersStr = "<br>Patients are linked to health care worker <b>"+$("#grvLLUserFilter option:selected").text()+"</b>";
	}
	if(type == "list"){
		result+=usersStr;
	}
	
	return result;
}

function getReport(report){
	
	
	var result = {};
	result["data"] = {};
	result["data"]["header"] = report.data.header;
	result["data"]["datasets"] = [];
	$.each(report.data.datasets, function(i,row){
		result["data"]["datasets"].push(row);
	});
	
	return result;
}

