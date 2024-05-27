/*
 * GLOGAL variables
 * */

const pandiConfig = {
		"container":"pandi-filters",
		"initFilter":{"pandiidcommunity":"0","pandiage":"0","pandidtype":"1_2","pandisex":"0","since":"2013"}
};

var pandiFilter = pandiConfig.initFilter;
var tool_agegroups = ["0","0-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75p"]
var tool_agegroups_labels = ["All","Between 0 and 9 years","Between 10 and 14 years","Between 15 and 19 years","Between 20 and 24 years","Between 25 and 29 years","Between 30 and 34 years","Between 35 and 39 years","Between 40 and 44 years","Between 45 and 49 years","Between 50 and 54 years","Between 55 and 59 years","Between 60 and 64 years","Between 65 and 69 years","Between 70 and 74 years","75 years and more"];
var prevalenceObject = {"cases":"0","pcases":"0","delta":"0","pdelta":"0"};
var incidenceObject = {"cases":"0","pcases":"0","delta":"0","pdelta":"0"};

var pandiObjects=null;


/*
 * MAIN Section 
 * */
setTimeout(setEvent,100,"PANDI");
//reportsSection = "pandi";
initPandi();
	
/*
 * EVENT definitions
 * 
 * */
$(document).ready(function(){
	var request = $.ajax({
		  url: '/ncdis/client/reports/population.json?_'+moment(),
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			populationEI = json;
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
});

$("#pandiManageDataButton").on("click",openPandiManageData);

/*
 * FUNCTIONS
 * */

function initPandi(){
	//$("#pandi").css("display","grid");
	setTimeout(showProgress,10,$(".pandi-wraper"));
	initPandiFilters();
	getPandiNow();
	getPandiHistory();
}

function initPandiFilters(){
	var container = $(".pandi-filter");
	
	//init community
	var objComm = $("#pandiCommunity");
	$(objComm).empty();
	$.each(tool_idcommunity, function (i, v){
		var s = "false";
		if(pandiFilter.pandiidcommunity == i)s = "true";
		$("<option>", {"value":i,"selected":s}).text(v).appendTo(objComm);
	});
	objComm.val(pandiFilter.pandiidcommunity);
	objComm.on("change", function(){pandiFilter.pandiidcommunity = $(this).val();});
	
	//init gender
	var objGen = $("#pandiGender");
	$(objGen).empty();
	$.each(report_sex, function (i, v){
		var s = "false";
		if(pandiFilter.pandisex == i)s = "true";
		$("<option>", {"value":i,"selected":s}).text(v).appendTo(objGen);
	});
	objGen.val(pandiFilter.pandisex);
	objGen.on("change", function(){pandiFilter.pandisex = $(this).val();});
	
	//init age
	var objAge = $("#pandiAge");
	$(objAge).empty();
	$.each(tool_agegroups, function (i, v){
		var s = "false";
		if(pandiFilter.pandiage == v)s = "true";
		$("<option>", {"value":v,"selected":s}).text(tool_agegroups_labels[i]).appendTo(objAge);
	});
	objAge.val(pandiFilter.pandiage);
	objAge.on("change", function(){pandiFilter.pandiage = $(this).val();});
	//dtype
	$("#pandiDtype").val(pandiFilter.pandidtype);
	$(".pandi-dtype-group div[grv-data='"+pandiFilter.pandidtype+"']").addClass("selected");
	$(".pandi-dtype-group .filter-input-radio-item").click(function(){
		$(".filter-input-radio-item").removeClass("selected");
		$(this).addClass("selected");
		$("#pandiDtype").val($(this).attr("grv-data"));
		pandiFilter.pandidtype = $(this).attr("grv-data");
	});
	
	
	var genBtn = $("#pandiApplyFilter").click(function(){
		setTimeout(showProgress,10,$(".pandi-wraper"));
		getPandiNow();
		getPandiHistory();
	});
	
	//hide manage data button for all users except ADMINS
	if(userProfileObj.role.idrole > 1){
		$(".manage-data").hide();
	}
	
	
}


function openPandiManageData(){
	var id = "pandiManageData";
	var mid = $("#fullscreen_"+id);
	if(mid.length == 0){
		var modal = $('<div>',{id:"fullscreen_"+id,class:"fullscreen-modal"}).appendTo($("#wraper"));
	}
	//modal header
	var header = $("<div>",{class:"fullscreen-modal-header"}).appendTo(modal);
	$("<div>",{class:"fullscreen-modal-header-logo"}).appendTo(header);
	$("<div>",{class:"fullscreen-modal-header-cdis"}).appendTo(header).text("CDIS");
	$("<div>",{class:"fullscreen-modal-header-title"}).appendTo(header).text("Manage CDIS Population Data");
	$("<div>",{class:"fullscreen-modal-header-close"}).appendTo(header).append($("<i>",{class:"fa fa-times"})).click(function(){$("#fullscreen_pandiManageData").remove();});
	
	var body = $("<div>",{class:"fullscreen-modal-body"}).appendTo(modal);
	var footer = $("<div>",{class:"fullscreen-modal-footer"}).appendTo(modal);
	
	buildPandiManageDataBody(body);
}


function buildPandiManageDataBody(container){
	var toolbar = $("<div>",{class:"fullscreen-modal-body-toolbar"}).appendTo(container);
	var table = $("<div>",{class:"fullscreen-modal-body-table"}).appendTo(container);
	
	$(toolbar).append($("<div>",{class:"fullscreen-modal-body-toolbar-header"}).text("Population data years"));
	$.each(populationEI, function(k,v){
		var y = k.replace("year_","");
		$("<div>",{class:"fmbt-item"}).text(y).appendTo(toolbar).click({"container":table,"year":y},buildpandiManageDataTable);
	});
}


function buildpandiManageDataTable(event){
	var container = event.data.container;
	var year = event.data.year;
	$(container).empty();
	var tbl = $("<div>",{class:"fmb-table"}).appendTo(container);
	$.each(populationEI, function(k,v){
		var y = k.replace("year_","");
		if(y == year){
			$.each(v,function(index,obj){
				if(index==0){
					//build vertical header of table
					var tblh = $("<div>",{class:"fmb-table-header"}).appendTo(tbl);
					$("<div>",{class:"fmb-table-header-cell"}).html("&nbsp;").appendTo(tblh);
					$.each(obj.groups, function(x,y){
						$("<div>",{class:"fmb-table-header-cell"}).text(y.name).appendTo(tblh);
					});
				}
				var tblc = $("<div>",{class:"fmb-table-body"}).appendTo(tbl);
				var tblcc = $("<div>",{class:"fmb-table-body-header-container"}).appendTo(tblc);
				$("<div>",{class:"fmb-table-body-header-community"}).text(obj.name).appendTo(tblcc);
				var tblccc = $("<div>",{class:"fmb-table-body-header-container-columns"}).appendTo(tblcc);
				$("<div>",{class:"fmb-table-body-header-m"}).text("Male").appendTo(tblccc);
				$("<div>",{class:"fmb-table-body-header-f"}).text("Female").appendTo(tblccc);
				$("<div>",{class:"fmb-table-body-header-f"}).text("Total").appendTo(tblccc);
				
				$.each(obj.groups, function(x,y){
					var tblcellrow = $("<div>",{class:"fmb-table-body-cell-container"}).appendTo(tblc);
					$("<div>",{class:"fmb-table-body-header-m"}).text(y.m).appendTo(tblcellrow);
					$("<div>",{class:"fmb-table-body-header-f"}).text(y.f).appendTo(tblcellrow);
					$("<div>",{class:"fmb-table-body-header-f"}).text(y.t).appendTo(tblcellrow);
				});
				
				
			});
			//$("<div>",{class:"fmbt-item"}).text(y).appendTo(toolbar).click({"container":table,"year":y},buildpandiManageDataTable);
		}
	});
	
}



function drawPandiNow(pObject,iObject){
	drawExisting(pObject);
	drawNew(iObject);
}

function getPopulation(year,filter){
	if(filter == null)filter = pandiFilter;
	var result = 0;
	var pyear = eval("populationEI.year_"+year);
		$.each(pyear, function(i,com){
			if (filter.pandiidcommunity == "0"){
				$.each(com.groups, function(j,kobj){
					if(filter.pandiage == "0"){
						if(kobj.name == "total"){
							if(filter.pandisex == "0"){
								result+=Number(kobj.t);
							}else if(filter.pandisex == "1"){
								result+=Number(kobj.m);
							}else if(filter.pandisex == "2"){
								result+=Number(kobj.f);
							}
						}
					}else if(filter.pandiage == kobj.name){
						if(filter.pandisex == "0"){
							result+=Number(kobj.t);
						}else if(filter.pandisex == "1"){
							result+=Number(kobj.m);
						}else if(filter.pandisex == "2"){
							result+=Number(kobj.f);
						}
					}
						
				});
			}else{
				if(filter.pandiidcommunity == com.id){
					$.each(com.groups, function(j,kobj){
						if(filter.pandiage == "0"){
							if(kobj.name == "total"){
								if(filter.pandisex == "0"){
									result+=Number(kobj.t);
								}else if(filter.pandisex == "1"){
									result+=Number(kobj.m);
								}else if(filter.pandisex == "2"){
									result+=Number(kobj.f);
								}
							}
						}else if(filter.pandiage == kobj.name){
							if(filter.pandisex == "0"){
								result+=Number(kobj.t);
							}else if(filter.pandisex == "1"){
								result+=Number(kobj.m);
							}else if(filter.pandisex == "2"){
								result+=Number(kobj.f);
							}
						}
							
					});
				}
			}
			
		});
	
	return result;
}

function getPandiNow(){
	var data = {};
	data["dtype"] = pandiFilter.pandidtype;
	data["age"] = pandiFilter.pandiage;
	data["idcommunity"] = pandiFilter.pandiidcommunity;
	data["sex"] = pandiFilter.pandisex;
	
	$.ajax({
		  url: "/ncdis/service/data/getPandiNow?sid="+sid+"&language=en",
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			prevalenceObject["cases"] = Number(json.objs[0].series[0]);
			prevalenceObject["pcases"] = Math.round( ( (100*Number(json.objs[0].series[0])/getPopulation(moment().format("YYYY"))) + Number.EPSILON ) * 100 ) / 100;
			prevalenceObject["delta"] = json.objs[0].series[0] - json.objs[2].series[0];
			prevalenceObject["pdelta"] = Math.round( ( (100*(Number(json.objs[0].series[0]) - Number(json.objs[2].series[0]))/Number(json.objs[2].series[0])) + Number.EPSILON ) * 100 ) / 100;
			incidenceObject["cases"] = Number(json.objs[1].series[0]);
			incidenceObject["pcases"] = Math.round( ( (100*Number(json.objs[1].series[0])/getPopulation(moment().format("YYYY"))) + Number.EPSILON ) * 100 ) / 100;
			incidenceObject["delta"] = Number(json.objs[1].series[0]) - Number(json.objs[3].series[0]);
			incidenceObject["pdelta"] = Math.round( ( (100*(Number(json.objs[1].series[0]) - Number(json.objs[3].series[0]))/Number(json.objs[3].series[0])) + Number.EPSILON ) * 100 ) / 100;			
			drawPandiNow(prevalenceObject, incidenceObject);
			
		}).fail(function( jqXHR, textStatus ) {
			
		  alert( "Request failed: " + textStatus );
		});	
	
}

function getPandiHistory(){
	var data = {};
		data["since"] = pandiFilter.since;
		data["dtype"] = pandiFilter.pandidtype;
		data["age"] = pandiFilter.pandiage;
		data["idcommunity"] = pandiFilter.pandiidcommunity;
		data["sex"] = pandiFilter.pandisex;
		
		$.ajax({
			  url: "/ncdis/service/data/getPandiHistory?sid="+sid+"&language=en",
			  data : data,
			  dataType: "json"
			}).done(function( json ) {
				pandiObjects = json.objs;
				ispandiLoaded = true;
				drawExistingHistory(pandiObjects);
				drawNewHistory(pandiObjects);
				hideProgress($(".pandi-wraper"));
				
			}).fail(function( jqXHR, textStatus ) {
				
			  alert( "Request failed: " + textStatus );
			});	
		
	}

function pandiRenderValues(value, name){
	var result = value;
	switch(name){
	case "data-period" : 
		result = report_dp[dataperiodValues.indexOf(Number(value))];
		break;
	case "community" :
		if(value == "0"){
			result = "All communities";
		}else{
			result = tool_idcommunity[value];
		}
		break;
	case "dtype" :
		switch(value){
		case "1_2" : result = "Type 1 and Type 2";break;
		case "3" : result = "Pre DM";break;
		case "4" : result = "GDM";break;
		}
		break;
	case "gender" :
		switch(value){
		case "0" : result = "";break;
		case "1" : result = "male only";break;
		case "2" : result = "female only";break;
		}
		break;
	case "hba1c" :
		if(value.indexOf("_") >= 0){
			parts = value.split("_");
			result = "HbA1c value between "+parts[0]+" and "+parts[1];
		}else if(value == "0"){
			result = "any HbA1c value";
		}else if(value == "1"){
			result = "HbA1c value more than 0.08";
		}
		break;
	case "pcases" :
		result = value +" cases";
		break;
	case "prcases" :
		result = value +"% ";
		break;
	case "prlast" :
		if(Number(value) < 0){
			result = " an increase of "+ (value*-1) +"% &nearr;";
		}else if(Number(value) > 0){
			result = " a decrease of "+value +"% &searr;";
		}else if(Number(value) == 0){
			result = " a stagnation ";
		}
		break;
	case "ncases" :
		result = value +" new cases ";
		break;
	case "age" :
		if(value == "0"){ result = " ";}
		else if(value == "75p"){ result = " having 75 years or more";}
		else{
			var parts = value.split("-");
			result = "age "+parts[0]+" to "+parts[1]+" "
		}
		break;
	}
	return result;
}

function drawExisting(pObject){
	$("#pandiNowEx").empty();
	
	var title = "<p>Period :<b>"+moment().startOf('year').format('MMMM Do YYYY')+" to "+moment().format('MMMM Do YYYY')+"</b><br>" +
			"Community : <b>"+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+"</b><br>" +
			"<b>"+pandiRenderValues(pandiFilter.pandidtype,"dtype")+"</b> <span>"+pandiRenderValues(pandiFilter.pandiage,"age")+"</span> <span>"+pandiRenderValues(pandiFilter.pandisex,"gender")+"</span></p>";
	var p1text = "<p>Total: <b>"+pObject.cases+"</b></p>";

	dir="Increase";
	if(pObject.delta < 0 ){
		dir="Decrease";
	}else if(pObject.delta == 0){
		dir = "Stagnation";
	}
	var p2text="<p>" +
			"<span>Prevalence: <b>"+pObject.pcases+"%</b><br>" +
			"<span>"+dir+" of <b>"+pObject.pdelta+"%</b>  compared to previous year</span><br>" +
			"<span>Prevalence in adult population (18 and older): </span></p>";
	
	$("#pandiNowEx").html(title+p1text+p2text);
	
}

function drawNew(iObject){
$("#pandiNowNew").empty();
	
	var title = "<p>Period :<b>"+moment().startOf('year').format('MMMM Do YYYY')+" to "+moment().format('MMMM Do YYYY')+"</b><br>" +
				"Community : <b>"+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+"</b><br>" +
				"<b>"+pandiRenderValues(pandiFilter.pandidtype,"dtype")+"</b> <span>"+pandiRenderValues(pandiFilter.pandiage,"age")+"</span> <span>"+pandiRenderValues(pandiFilter.pandisex,"gender")+"</span></p>";
	var p1text = "<p>Total: <b>"+iObject.cases+"</b></p>";
	
	var dir = "Increase";
	var d2 = "more new diagnoses";
	var pi = Math.abs(iObject.pdelta)+"%";
	if(iObject.delta < 0 ){
		dir="Decrease";
		d2 = "fewer new diagnoses";
	}else if(iObject.delta == 0){
		dir = "Stagnation";
		d2 = "";
		pi = "";
	}
	var p2text="<p>" +
			"Incidence (rate of new cases): <b>"+iObject.pcases+"%</b><br>" +
			dir+" in incidence: <b>"+pi+"</b> "+d2+" compared to previous year ("+iObject.cases+" vs "+(iObject.cases + Math.abs(iObject.delta))+")" +
			"</p>";
	$("#pandiNowNew").html(title+p1text+p2text);
}

function drawExistingHistory(pandiHistory){
	
	var prevFilterArray = [];
	var prevNoFilterArray = [];
	var tcs = pandiHistory[0].ticks;
	$.each(pandiHistory[0].series, function(i,v){
		var p =  Math.round( ( (v / getPopulation(tcs[i])) + Number.EPSILON ) * 10000 ) / 100 ; 
		prevFilterArray.push(p);
	});
	
	var nofilter = {"pandiidcommunity":pandiFilter.pandiidcommunity,"pandiage":"0","pandidtype":pandiFilter.pandidtype,"pandisex":"0","since":"2013"};
	$.each(pandiHistory[2].series, function(j,k){
		var x =  Math.round( ( (k / getPopulation(tcs[j],nofilter)) + Number.EPSILON ) * 10000 ) / 100; 
		prevNoFilterArray.push(x);
	});
	var valueStatsData = {"series":[pandiHistory[0].series,pandiHistory[2].series,prevFilterArray,prevNoFilterArray], "ticks":[pandiHistory[0].ticks,pandiHistory[2].ticks],"labels":[getPandiGraphTitle("e"),getPandiGraphTitle("enf"),getPandiGraphTitle("p"),getPandiGraphTitle("pnf")]};
	paramObject3 = {"container":$("#pandiHistoryEx"),"data":valueStatsData,"filter":pandiFilter};
	
	drawPrevalenceLL(paramObject3);
}

function drawNewHistory(pandiHistory){
	
	var incFilterArray = [];
	var incNoFilterArray = [];
	var tcs = pandiHistory[1].ticks;
	$.each(pandiHistory[1].series, function(i,v){
		var p =  Math.round( ( (v / getPopulation(tcs[i])) + Number.EPSILON ) * 10000 ) / 100; 
		incFilterArray.push(p);
	});
	
	var nofilter = {"pandiidcommunity":pandiFilter.pandiidcommunity,"pandiage":"0","pandidtype":pandiFilter.pandidtype,"pandisex":"0","since":"2013"};
	$.each(pandiHistory[3].series, function(j,k){
		var x =  Math.round( ( (k / getPopulation(tcs[j],nofilter)) + Number.EPSILON ) * 10000 ) / 100; 
		incNoFilterArray.push(x);
	});
	
	var valueStatsData = {"series":[pandiHistory[1].series,pandiHistory[3].series,incFilterArray,incNoFilterArray], "ticks":[pandiHistory[1].ticks,pandiHistory[3].ticks],"labels":[getPandiGraphTitle("n"),getPandiGraphTitle("nnf"),getPandiGraphTitle("i"),getPandiGraphTitle("inf")]};
	paramObject3 = {"container":$("#pandiHistoryNew"),"data":valueStatsData,"filter":pandiFilter};
	
	drawIncidenceLL(paramObject3);
}

function getPandiGraphTitle(type){
	var result = "";
	if(type == "e"){
		result = "Existing cases in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of "+pandiRenderValues(pandiFilter.pandisex,"gender")+" and "+pandiRenderValues(pandiFilter.pandiage,"age")+"";
	}else if(type == "n"){
		result = "New cases in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of "+pandiRenderValues(pandiFilter.pandisex,"gender")+" and "+pandiRenderValues(pandiFilter.pandiage,"age")+"";
	}else if(type=="enf"){
		result = "Existing cases in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of all genders and all ages";
	}else if(type=="nnf"){
		result = "New cases in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of all genders and all ages";
	}else if(type=="p"){
		result = "Prevalence in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of "+pandiRenderValues(pandiFilter.pandisex,"gender")+" and "+pandiRenderValues(pandiFilter.pandiage,"age")+"";
	}else if(type=="pnf"){
		result = "Prevalence in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of all genders and all ages";
	}else if(type=="i"){
		result = "Incidence in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of "+pandiRenderValues(pandiFilter.pandisex,"gender")+" and "+pandiRenderValues(pandiFilter.pandiage,"age")+"";
	}else if(type=="inf"){
		result = "Incidence in "+pandiRenderValues(pandiFilter.pandiidcommunity,"community")+" for "+pandiRenderValues(pandiFilter.pandidtype,"dtype")+" patients of all genders and all ages";
	}
	return result;
}