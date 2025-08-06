/*
 * GLOGAL variables
 * */
var importFilesPeriod = 7;
var importFilesArray = new Array();
var dataImport = [];
var dataTable = [];

/*
 * MAIN Section 
 * */
reportsSection = "importomnilab";
initImportOmnilab();
	
/*
 * EVENT definitions
 * 
 * */

$("#irtf-button").on("click",function(){
	var v = $("#irtf").val();
	if(v.length>2){
		setTimeout(showProgress, 100, $(".importomnilab-report-table"));
		setTimeout(function(dt,dv){
			buildImportDashboardTable(dt,dv);
			hideProgress($(".importomnilab-report-table"));
		},200, dataTable, v);
	}else if(v.length == 0){
		setTimeout(showProgress, 100, $(".importomnilab-report-table"));
		setTimeout(function(dt,dv){
			buildImportDashboardTable(dt,dv);
			hideProgress($(".importomnilab-report-table"));
		},200, dataTable, "");
	}
});

/*
 * FUNCTIONS
 * */


function loadImportFiles(period){
	var omni = $.ajax({
		  url: "/ncdis/service/action/getImportOmnilabFiles?sid="+sid+"&language=en&period="+period,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		omni.done(function( json ) {
			importFilesArray = json;
			importFilesArray.sort(function(a,b){
				 var ma = moment(a.replace("import_","").replace(".json",""), "DD-MM-YYYY").utc();
				 var mb = moment(b.replace("import_","").replace(".json",""), "DD-MM-YYYY").utc();
				 return ma - mb;
				});
			$.each(importFilesArray,function(k,v){
				var fdate = v.replace("import_","").replace(".json","");
				var dayObj = {};
				dayObj["date"] = fdate;
				$.getJSON("/ncdis/client/reports/import/import_"+fdate+".json", function(data){
					dayObj["data"] = data;
		        }).fail(function(){
		            console.log("An error has occurred.");
		        });
				dataImport.push(dayObj);
			});
			
		});
		omni.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});	
}

function initImportOmnilab(){
	loadImportFiles(importFilesPeriod);
	//buildFileSelector(importFilesArray);
	buildImportDashboardFrame();
}

function buildImportDashboardFrame(){
	buildImportDashboardSelector();
}


function buildImportDashboardSelector(){
	var container = $(".importomnilab-selector-elements");
	$.each(tool_idcommunity, function(k,v){
		if(k==0)v="All communities";
		$("<div>",{class:"felem",id:"comm_"+k}).appendTo(container).text(v).click(function(){
			$(".felem").removeClass("selected");
			$(this).addClass("selected");
			setTimeout(showProgress , 100, $(".importomnilab-report"));
			setTimeout(loadDataGraph, 200, k);
		});
	});
}

function loadDataGraph(idc){
	//build series and ticks
	//ticks - [dates of import]
	//for community = 0 - 3 series total per day of lab inserts lipid inserts and renal inserts
	//table should by   date of import ramq community lab columns lipid columns renal columns date of test
	
	// [[12,13],[12,13],[12,13]] - series format lab lipid renal tics [date1,date2]
	var series = [];
	var ticks =[];
	var labels = [];
	var title="";
	var labserie = [];
	var lipidserie = [];
	var renalserie = [];
	var listtable = [];
	
	$.each(dataImport, function(date,data){
		ticks.push(data.date);
		var labTickCount = 0;
		var lipidTickCount = 0;
		var renalTickCount = 0;
		$.each(data.data, function(site,dataSite){
			$.each(dataSite,function(index,patientObject){
				
				if(idc == 0){
					if(typeof(patientObject.lab) != "undefined"){
						labTickCount++;
						var t = getLineTable(patientObject.lab, data.date, patientObject.ramq, patientObject.idcommunity, "Lab");
						listtable = listtable.concat(t);
					}
					if(typeof(patientObject.lipid) != "undefined"){
						lipidTickCount++;
						listtable = listtable.concat(getLineTable(patientObject.lipid, data.date, patientObject.ramq, patientObject.idcommunity, "Lipid"));
					}
					if(typeof(patientObject.renal) != "undefined"){
						renalTickCount++;
						listtable = listtable.concat(getLineTable(patientObject.renal, data.date, patientObject.ramq, patientObject.idcommunity, "Renal"));
					}
				}else{
					if(patientObject.idcommunity == idc){
						if(typeof(patientObject.lab) != "undefined"){
							labTickCount++;
							listtable = listtable.concat(getLineTable(patientObject.lab, data.date, patientObject.ramq, patientObject.idcommunity, "Lab"));
						}
						if(typeof(patientObject.lipid) != "undefined"){
							lipidTickCount++;
							listtable = listtable.concat(getLineTable(patientObject.lipid, data.date, patientObject.ramq, patientObject.idcommunity, "Lipid"));
						}
						if(typeof(patientObject.renal) != "undefined"){
							renalTickCount++;
							listtable = listtable.concat(getLineTable(patientObject.renal, data.date, patientObject.ramq, patientObject.idcommunity, "Renal"));
						}
					}
				}
			});
		});
		labserie.push(labTickCount);
		lipidserie.push(lipidTickCount);
		renalserie.push(renalTickCount);
		
	});
	series.push(labserie);
	labels.push("Number of patients with new lab data");
	series.push(lipidserie);
	labels.push("Number of patients with new lipid data");
	series.push(renalserie);
	labels.push("Number of patients with new renal data");
	if(idc == 0){
		title="New data for patients in all communities";
	}else{
		title="New data for patients in "+tool_idcommunity[idc];
	}
	dataTable = listtable;
	buildImportDashboardGraph(series,ticks,labels,title);
	buildImportDashboardTable(listtable,"");
	hideProgress($(".importomnilab-report"));
}

function getLineTable(arr, d, r, c, s){
	var result = [];
	$.each(arr, function(i,o){
		var listtableline = [];
		listtableline.push(d);
		listtableline.push(r);
		listtableline.push(tool_idcommunity[c]);
		listtableline.push(s);
		listtableline.push(o.namevalue);
		listtableline.push(o.value);
		listtableline.push(o.datevalue);
		result.push(listtableline);
	});
	return result;
}


function buildImportDashboardTable(table,criteria){
	var container = $(".importomnilab-report-table-body");
	$(container).empty();
	$.each(table,function(x,t){
		var searchkey = "";
		var line = $("<div>",{class:"importomnilab-report-table-body-line"});
		$.each(t,function(y,l){
			if(y==4){
				l = eval("label_"+l);
			}else if(y==1){l = l.toUpperCase();}
			searchkey +=l+"_"; 
			$("<div>",{class:"col"+y}).text(l).appendTo(line);
		});
		$("<div>",{class:"col8"}).appendTo(line).append($("<div>",{class:"cisbutton",style:"display:none"}).text("View patient details").click(function(){
			gtc(sid,"en",t[1],"patient");
		}));
		line.on("click",function(){
			$(".importomnilab-report-table-body-line").removeClass("selected");
			$(this).addClass("selected");
			$(".importomnilab-report-table-body-line").find(".col8 div").hide();
			$(this).find(".col8 div").show();
		});
		searchkey = searchkey.toLowerCase();
		criteria = criteria.toLowerCase();
		if(criteria!="" && criteria.length > 2){
			if(criteria.indexOf(" ") >= 0){
				var filterall = true;
				parts = criteria.split(" ");
				$.each(parts,function(i,part){
					if(searchkey.indexOf(part) >= 0){
						filterall = filterall && true;
					}else{
						filterall = filterall && false;
					}
				});
				
				if(filterall){
					line.appendTo(container);
				}
			}else{
				if(searchkey.indexOf(criteria) >= 0){
					line.appendTo(container);
				}
			}
		}else{
			line.appendTo(container);
		}
		
	});
	
}

function buildImportDashboardGraph(series,ticks,labels,title){
	var container = $(".importomnilab-report-graph");
	$(container).empty();
	var cid = $(container).attr("id");
	var max = 0;
	$.each(series, function(i,v){
		var m = v.max();
		max = Math.max(max,m);
	})
    max = max + Math.round(max*0.2);
    var showTick = true;
	
    $.jqplot(cid, series, {
			title:title,
			highlighter: {show: true,showTooltip: false},
		    grid: {drawBorder: false,borderWidth: 0.5,shadow: false},
		    seriesDefaults:{renderer:$.jqplot.BarRenderer,highlightMouseOver: false,pointLabels: { show: true,location : 'n'}},
            axes: {
            	xaxis: {ticks: ticks,drawMajorGridlines: false,renderer: $.jqplot.CategoryAxisRenderer,labelRenderer: $.jqplot.CanvasAxisLabelRenderer,tickRenderer: $.jqplot.CanvasAxisTickRenderer,tickOptions: {show: showTick,angle: 0}},
                yaxis: {autoscale:true,min: 0,max: max,labelRenderer: $.jqplot.CanvasAxisLabelRenderer,tickRenderer: $.jqplot.CanvasAxisTickRenderer,tickOptions: {angle: 0,prefix: '',formatString: '%d'}}
            },
            series:[
                    {label:labels[0]},{label:labels[1]},{label:labels[2]},
                    ],
            legend: {
		    	renderer: $.jqplot.EnhancedLegendRenderer,
		        show: true,
		        location:'s',
		        border : 'none',
		        placement: 'outsideGrid',
		        fontSize:'0.8vw',
		        rowSpacing:'0.7em',
		        background:'transparent',
		        marginRight:'5px',
		        rendererOptions: {
		            numberRows: 1
		        }
		       } 
          });
}



function buildFileSelector(filesArray){
	var container = $(".importomnilab-files-elements");
	$.each(filesArray, function(k,v){
		var fd = v.replace("import_","").replace(".html",""); 
		$("<div>",{class:"felem"}).appendTo(container).text(fd).click(function(){
			$(".felem").removeClass("selected");
			$(this).addClass("selected");
			$(".importomnilab-report").empty();
			$(".importomnilab-report").load("/ncdis/client/reports/import/"+v);
		});
	})
}
