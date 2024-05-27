/*
 * GLOGAL variables
 * */

const pvalidationConfig = {
		"container":"pvalidation-list",
		"initFilter":{"pidcommunity":"0","idlist":"1"},
		"lists":[
		         {"id":"1","name":"No data in last 5 years (unless GDM) "},
		         {"id":"2","name":"Age > 95"},
		         {"id":"3","name":"Duplicate name"},
		         {"id":"4","name":"Predm and last 2 HbA1c values > 0.065 "},
		         {"id":"5","name":"Patients with no diabetes diagnostic in CDIS "}
		         ]
};

var pappFilter = pvalidationConfig.initFilter;
var list1Object = null;
var list2Object = null;
var list3Object = null;
var list4Object = null;
var list5Object = null;
var listLoadedFlag = false;


/*
 * MAIN Section 
 * */
setTimeout(setEvent,100,"PATV");
initPvalidation();
	
/*
 * EVENT definitions
 * 
 * */


/*
 * FUNCTIONS
 * */

function initPvalidation(){
	drawPToolbarFilters($(".pvalidation-filters"));
	buildPListFrame();
	refreshPStats();
	var atab = $("#tabs").tabs("option","active");
	
	if(showPopupFlag && atab == 3){
		showPopupMessage(pvalidationPopupTitle,pvalidationText);
		showPopupFlag = false;
	}
	
}

function buildPListFrame(){
	var container = $("."+pvalidationConfig.container);
	container.empty();

	$("<div>",{class:"pvalidation-list-header"}).appendTo(container);
	$("<div>",{class:"pvalidation-list-body"}).appendTo(container);
	
	setTimeout(showProgress,10,$(".pvalidation-list"));
}

function drawPToolbarFilters(container){
	container.empty();
	//container

	
	var grfilter = $("<div>",{class:"gr-filters"}).appendTo(container);
	var grbut = $("<div>",{class:"gr-buttons"}).appendTo(container);
	
	var genBtn = $("<button>",{class:"cisbutton"}).text("Apply filter").appendTo(grbut);
	genBtn.click(function(){
		setTimeout(showProgress,10,$(".pvalidation-list"));
		buildPListFrame();
		refreshPStats();
	});
	
	
	//community
	var grComm = $("<div>",{"id":"ptoolbarFilterCommunity",class:"gr-pcomm group"}).appendTo(grfilter);
	$("<div>",{"for":"pcomm-filter",class:"label-filter"}).text("Community").appendTo(grComm);
	var grCommS = $("<select>",{"id":"pcomm-filter",class:""}).appendTo(grComm);
	$.each(tool_idcommunity, function(j,com){
		$("<option>",{"value":j}).text(com).appendTo(grCommS);
	});
	grCommS.on("change",function(){
		var v = $(this).val();
		if(v!=pappFilter.pidcommunity){pappFilter["pidcommunity"]=v;}
	});

	
	//lists
	var grList = $("<div>",{"id":"ptoolbarFilterList",class:"gr-lists group"}).appendTo(grfilter);
	$("<div>",{"for":"lists-filter",class:"label-filter"}).text("List").appendTo(grList);
	var grListS = $("<select>",{"id":"lists-filter",class:""}).appendTo(grList);
	$.each(pvalidationConfig.lists, function(j,lo){
		$("<option>",{"value":lo.id}).text(lo.name).appendTo(grListS);
	});
	$("#lists-filter").val(pappFilter.idlist);
	grListS.on("change",function(){
		var v = $(this).val();
		if(v!=pappFilter.idlist){pappFilter["idlist"]=v;}
	});

}

function refreshPStats(){
	getListSeries();
	removePStatsProgress();
}

function removePStatsProgress(){
	if(listLoadedFlag){
		hideProgress($(".pvalidation-list"));
		listLoadedFlag = false;
	}else{
		setTimeout(removePStatsProgress,500);
	}
}

function getListSeries(){
	var data = {};
	data["idlist"] = pappFilter.idlist;
	data["idcommunity"] = pappFilter.idcommunity;
	var lo = null;
	
	if(pappFilter.idlist == "1") lo = list1Object; 
	if(pappFilter.idlist == "2") lo = list2Object;
	if(pappFilter.idlist == "3") lo = list3Object;
	if(pappFilter.idlist == "4") lo = list4Object;
	if(pappFilter.idlist == "5") lo = list5Object;
	var flag = false;
	if(lo != null){
		flag = true;
	}
	if(flag){
		listLoadedFlag = true;
		drawPValidationList(applyPFilter(lo));
	}else{
		$.ajax({
			  url: "/ncdis/service/data/getPvalidationData?sid="+sid+"&language=en",
			  data : data,
			  dataType: "json"
			}).done(function( json ) {
				var sd = json.objs[0];
				
				if(pappFilter.idlist == "1") list1Object = sd; 
				if(pappFilter.idlist == "2") list2Object = sd;
				if(pappFilter.idlist == "3") list3Object = sd;
				if(pappFilter.idlist == "4") list4Object = sd;
				if(pappFilter.idlist == "5") list5Object = sd;
				listLoadedFlag = true;
				drawPValidationList(applyPFilter(sd));
			}).fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});	

	}
}

function applyPFilter(listObject){
	var result = {"header":[],"data":[]};
	result["header"] = listObject.header;
	
	
	
	$.each(listObject.data, function(i, row){
		
		if(pappFilter.pidcommunity == row.idcommunity ){
			result["data"].push(row);
		}else if(pappFilter.pidcommunity == "0"){
			result["data"].push(row);
		}
	});
	result["data"].sort(compareTextAsc);
	return result;
}

function compareTextAsc(a,b) {
  if (a.fullname.toLowerCase() < b.fullname.toLowerCase())return -1;
  if (a.fullname.toLowerCase() > b.fullname.toLowerCase())return 1;
  return 0;
}

function drawPValidationList(listObject){
	drawPValidationListHeader(listObject.header);
	drawPValidationListBody(listObject);
}

function drawPValidationListHeader(headerObject){
	var container = $(".pvalidation-list-header");
	$.each(headerObject, function(i,v){
		var cls = "";
		if(v.column == "fullname")cls = "fullname";
		$("<div>",{class:cls}).text(v.name).appendTo(container);
	});
}

function drawPValidationListBody(listObject){
	var container = $(".pvalidation-list-body");
	$.each(listObject.data, function(i,v){
		var row = $("<div>",{class:"pvalidation-list-body-line","id":v.idpatient+"_"+v.ramq}).appendTo(container);
		$.each(listObject.header, function(j,k){
			var cls = "";
			var val = eval("v."+k.column);
			if(k.column == "idcommunity")val = tool_idcommunity[val];
			if(k.column == "dtype")val = report_dtype[val];
			if(k.column == "lastdate")val = moment(val).format("YYYY-MM-DD");
			if(k.column == "fullname")cls = "fullname";
			$("<div>",{class:"pvalidation-list-body-line-cell "+cls}).text(val).appendTo(row);
		});
		row.click(function(){
			if(!$(this).hasClass("selected")){
				$(".pvalidation-list-body-line").removeClass("selected");
				$(".pvalidation-list-body-line .cisbutton").remove();
				$(this).addClass("selected");
				$("<div>" ,{class:"cisbutton"}).text("view patient details").appendTo($(this).find(".fullname")).click(function(){
					var pid = $(this).parent().parent().attr("id");
					var parts = pid.split("_");
					gtc(sid,"en",parts[1],"patient");
				})
			}
		});
	});
}

function showPatientABC(line){
	
}
