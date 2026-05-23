const predm2dmConfig = {
		"container":"cdisPredm2dm-filters",
		"initFilter":{"predm2dmidcommunity":"0","predm2dmperiod":"5","predm2dmsex":"0"}
};

var predm2dmFilter = predm2dmConfig.initFilter;
var ispredm2dmLoaded = false;
var predm2dmObjects=null;
var predm2dmData = {};


/*
 * MAIN Section 
 * */
setTimeout(setEvent,100,"PREDM2DM");
initpredm2dm();
	
/*
 * EVENT definitions
 * 
 * */




/*
 * FUNCTIONS
 * */



function initpredm2dm(){
	initpredm2dmFilters();
	loadData();
	
	//getpredm2dmNow();
	//getpredm2dmHistory();
}


function initpredm2dmFilters(){
	var container = $(".cdisPredm2dm-filter");
	
	//init community
	var objComm = $("#predm2dmCommunity");
	$(objComm).empty();
	$.each(tool_idcommunity, function (i, v){
		var s = "false";
		if(predm2dmFilter.predm2dmidcommunity == i)s = "true";
		$("<option>", {"value":i,"selected":s}).text(v).appendTo(objComm);
	});
	let c = getParameterByName("fpredm_idcommunity");
	if(typeof(c) != "undefined" && c!="")predm2dmFilter.predm2dmidcommunity = c;
	
	objComm.val(predm2dmFilter.predm2dmidcommunity);
	objComm.on("change", function(){predm2dmFilter.predm2dmidcommunity = $(this).val();});
	
	//init gender
	var objGen = $("#predm2dmGender");
	$(objGen).empty();
	$.each(report_sex, function (i, v){
		var s = "false";
		if(predm2dmFilter.predm2dmsex == i)s = "true";
		$("<option>", {"value":i,"selected":s}).text(v).appendTo(objGen);
	});
	let ss = getParameterByName("fpredm_sex");
	if(typeof(ss) != "undefined" && ss!="")predm2dmFilter.predm2dmsex = ss;
	objGen.val(predm2dmFilter.predm2dmsex);
	objGen.on("change", function(){predm2dmFilter.predm2dmsex = $(this).val();});
	
	//init period
	var objAge = $("#predm2dmPeriod");
	$(objAge).empty();
	var s = "false";
	if(predm2dmFilter.predm2dmperiod == "5")s = "true";
	$("<option>", {"value":"5","selected":s}).text("Last 5 years").appendTo(objAge);
	if(predm2dmFilter.predm2dmperiod == "2")s = "true";
	$("<option>", {"value":"2","selected":s}).text("Last 2 years").appendTo(objAge);
	if(predm2dmFilter.predm2dmperiod == "1")s = "true";
	$("<option>", {"value":"1","selected":s}).text("Last year").appendTo(objAge);
	if(predm2dmFilter.predm2dmperiod == "0")s = "true";
	$("<option>", {"value":"0","selected":s}).text("This year").appendTo(objAge);
	let pp = getParameterByName("fpredm_period");
	if(typeof(pp) != "undefined" && pp!="")predm2dmFilter.predm2dmperiod = pp;
	objAge.val(predm2dmFilter.predm2dmperiod);
	objAge.on("change", function(){predm2dmFilter.predm2dmperiod = $(this).val();});
	
	var genBtn = $("#predm2dmApplyFilter").click(function(){
		getPredm2dmGraph(predm2dmData,predm2dmFilter);
		getPredm2dmTable(predm2dmData,predm2dmFilter);
	});
	
}


function loadData(){
	$.ajax({
		  url: "/ncdis/service/data/getPredm2dmData?sid="+sid+"&language=en",
		  async: false,
		  dataType: "json"
		}).done(function( json ) {
			predm2dmData = json.objs[0];
			getPredm2dmTable(predm2dmData,predm2dmFilter);
			getPredm2dmGraph(predm2dmData,predm2dmFilter);
		}).fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
}


function getPredm2dmTable(data,filter){
	let filterdateStart = moment();
	let filterdateEnd = moment().startOf('year');
	if(filter.predm2dmperiod == "5")filterdateStart = moment().subtract(5,"years").startOf('year');
	if(filter.predm2dmperiod == "2")filterdateStart = moment().subtract(2,"years").startOf('year');
	if(filter.predm2dmperiod == "1")filterdateStart = moment().subtract(1,"years").startOf('year');
	if(filter.predm2dmperiod == "0"){
		filterdateStart = moment().startOf('year');
		filterdateEnd = moment();
	}
	
	let container = $(".cdisPredm2dm-table");
	container.empty();
	let header = $("<div>",{class:"cdisPredm2dm-table-header"}).appendTo(container);
	let body = $("<div>",{class:"cdisPredm2dm-table-body"}).appendTo(container);
	//build the header
	$("<div>",{class:"cdisName"}).text("Patient Name").appendTo(header);
	$("<div>",{}).text("Gender").appendTo(header);
	$("<div>",{}).text("Patient RAMQ").appendTo(header);
	$("<div>",{}).text("Community").appendTo(header);
	$("<div>",{}).text("Diagnose date PRE DM").appendTo(header);
	$("<div>",{}).text("Diagnose date DM").appendTo(header);
	
		
	$.each(data.series,function(i,v){
		let predm_reportdate = moment(v.predm_datevalue);
		let dm_reportdate = moment(v.dm_datevalue);
		let predm_datelabel = predm_reportdate.format("MMM YYYY")
		let dm_datelabel = dm_reportdate.format("MMM YYYY")
		if(predm_reportdate.isAfter(filterdateStart) && predm_reportdate.isBefore(filterdateEnd)){
			
			if(filter.predm2dmidcommunity == "0"){
				if(filter.predm2dmsex == "0"){
					let line = $("<div>",{class:"cdisPredm2dm-table-body-line"}).appendTo(body);
					$("<div>",{class:"cdisName"}).text(v.fname+" "+v.lname).appendTo(line);
					$("<div>",{}).text(report_sex[v.sex]).appendTo(line);
					$("<div>",{}).text(v.ramq).appendTo(line);
					$("<div>",{}).text(v.community).appendTo(line);
					$("<div>",{}).text(predm_datelabel).appendTo(line);
					$("<div>",{}).text(dm_datelabel).appendTo(line);
					//line.click(function(){$(".cdisPredm2dm-table-body-line").removeClass("selected");$(this).addClass("selected");$(this).attr("ramq",v.ramq);});	
					line.on("click",{ramq:v.ramq},selectLinePredm2dm);
				}else{
					if(v.sex == filter.predm2dmsex){
						let line = $("<div>",{class:"cdisPredm2dm-table-body-line"}).appendTo(body);
						$("<div>",{class:"cdisName"}).text(v.fname+" "+v.lname).appendTo(line);
						$("<div>",{}).text(report_sex[v.sex]).appendTo(line);
						$("<div>",{}).text(v.ramq).appendTo(line);
						$("<div>",{}).text(v.community).appendTo(line);
						$("<div>",{}).text(predm_datelabel).appendTo(line);
						$("<div>",{}).text(dm_datelabel).appendTo(line);
						//line.click(function(){$(".cdisPredm2dm-table-body-line").removeClass("selected");$(this).addClass("selected");$(this).attr("ramq",v.ramq);});
						line.on("click",{ramq:v.ramq},selectLinePredm2dm);
					} 
				}
			}else{
				if(v.idcommunity == filter.predm2dmidcommunity){
					if(filter.predm2dmsex == "0"){
						let line = $("<div>",{class:"cdisPredm2dm-table-body-line"}).appendTo(body);
						$("<div>",{class:"cdisName"}).text(v.fname+" "+v.lname).appendTo(line);
						$("<div>",{}).text(report_sex[v.sex]).appendTo(line);
						$("<div>",{}).text(v.ramq).appendTo(line);
						$("<div>",{}).text(v.community).appendTo(line);
						$("<div>",{}).text(predm_datelabel).appendTo(line);
						$("<div>",{}).text(dm_datelabel).appendTo(line);
						//line.click(function(){$(".cdisPredm2dm-table-body-line").removeClass("selected");$(this).addClass("selected");$(this).attr("ramq",v.ramq);});	
						line.on("click",{ramq:v.ramq},selectLinePredm2dm);
					}else{
						if(v.sex == filter.predm2dmsex){
							let line = $("<div>",{class:"cdisPredm2dm-table-body-line"}).appendTo(body);
							$("<div>",{class:"cdisName"}).text(v.fname+" "+v.lname).appendTo(line);
							$("<div>",{}).text(report_sex[v.sex]).appendTo(line);
							$("<div>",{}).text(v.ramq).appendTo(line);
							$("<div>",{}).text(v.community).appendTo(line);
							$("<div>",{}).text(predm_datelabel).appendTo(line);
							$("<div>",{}).text(dm_datelabel).appendTo(line);
							line.on("click",{ramq:v.ramq},selectLinePredm2dm);
						} 
					}	
				}	
			}
		}
		
	});
	
}

function selectLinePredm2dm(event){
	let ramq = event.data.ramq;
	$(".cdisPredm2dm-table-body-line").removeClass("selected");
	$(".cdisPredm2dm-table-body-line .cdisName .cisbutton").remove();
	$(this).addClass("selected");
	$("<div>",{class:"cisbutton"})
		.css("margin-left","10px")
		.text("View")
		.appendTo($(this).find(".cdisName"))
		.on("click",{ramq:ramq},viewPatientPredm2dm);
	
}


function viewPatientPredm2dm(event){
	let ramq = event.data.ramq;
	gtc(sid,"en",ramq,"patient","&fpredm=1&fpredm_ramq="+ramq+"&fpredm_period="+predm2dmFilter.predm2dmperiod+"&fpredm_sex="+predm2dmFilter.predm2dmsex+"&fpredm_idcommunity="+predm2dmFilter.predm2dmidcommunity);
}


function getPredm2dmGraph(data,filter){
	let filterdateStart = moment();
	let filterdateEnd = moment().startOf('year');
	if(filter.predm2dmperiod == "5")filterdateStart = moment().subtract(5,"years").startOf('year');
	if(filter.predm2dmperiod == "2")filterdateStart = moment().subtract(2,"years").startOf('year');
	if(filter.predm2dmperiod == "1")filterdateStart = moment().subtract(1,"years").startOf('year');
	if(filter.predm2dmperiod == "0"){
		filterdateStart = moment().startOf('year');
		filterdateEnd = moment();
	}
	
	let raw = [];
	$.each(data.series,function(i,v){
		let reportdate = moment(v.predm_datevalue);
		let datelabel = reportdate.format("MMM YYYY")
		
		if(reportdate.isAfter(filterdateStart) && reportdate.isBefore(filterdateEnd)){
			if(filter.predm2dmidcommunity == "0"){
				if(filter.predm2dmsex == "0"){
					raw.push(datelabel);	
				}else{
					if(v.sex == filter.predm2dmsex) raw.push(datelabel);
				}
			}else{
				if(v.idcommunity == filter.predm2dmidcommunity){
					if(filter.predm2dmsex == "0"){
						raw.push(datelabel);	
					}else{
						if(v.sex == filter.predm2dmsex) raw.push(datelabel);
					}	
				}	
			}
		}
		
	});
	
	let datasets = [];
	let graphdata = raw.reduce((acc, value) => {
	  acc[value] = (acc[value] || 0) + 1;
	  return acc;
	}, {})
	let d = {label:"Number of patients with PRE DM diagnostic in "+$("#predm2dmPeriod option:selected").text()+" that have DM diagnostics",data:[]};
	for (const [key, value] of Object.entries(graphdata)) {
	  d["data"].push({x:`${key}`,y:`${value}`});
	}
	datasets.push(d);
	$("#grvPredm2dmGraph").empty();
	let chartStatus = Chart.getChart("grvPredm2dmGraph"); // <canvas> id
	if (chartStatus != undefined) {
	  chartStatus.destroy();
	}
	
	
	const cfg = {
	  type: 'bar',
	  data: {datasets: datasets},
	  options: {
          responsive: true,
          maintainAspectRatio: false // Crucial for custom height control
      }
	}
	let ctx = document.getElementById("grvPredm2dmGraph");
	const mixedChart = new Chart(ctx, cfg);
}




function drawReportGraph(report,percentage=false){
	const labels = report.header;
	let totals = report.totals;
	let labelsValues = Object.values(labels);
	let valueData = report.criteria[0].value;
	let nameData = report.criteria[0].name;
	if(nameData == "idcommunity" && valueData.indexOf("_") >= 0){
		let ls = [];
		$.each(labelsValues,function(x,l){
			let m = moment(l);
			ls.push(m.format("MMM YYYY"));
		});
		labelsValues = ls;
	}
	let data = {labels: labelsValues,datasets:[]};
	let colorSet = ["#36A2EB", "#36F2EC"];
	$.each(report.dataset,function(i,v){
		let preLabel = "Number of patients from ";
		if(percentage) preLabel = "Percentage of patients from ";
		if(nameData == "idcommunity"){
			if(valueData.indexOf("_") >=0){
				let parts = valueData.split("_");
				preLabel = preLabel+" "+tool_idcommunity[parts[i]];
			}else{
				preLabel = preLabel+" "+tool_idcommunity[valueData];
			}
		}else{
				preLabel = "Number of patients";
				if(percentage)preLabel = "Percentage of patients";
		}
		let vs = Object.keys(v);
		let d = [];
		
		$.each(Object.keys(labels), function(idx,label){
			let zk = vs[idx];
			let z = zk.split("_")[1]
			if(percentage){
				let total = getTotalValue(label+"_"+z,totals);
				let n = (100*(v[label+"_"+z]/total)).toFixed(2);
				d.push(n);
			}else{
				d.push(v[label+"_"+z]);	
			}
			
		});
		data['datasets'][data.datasets.length] = {label:preLabel,data:d,fill:false,borderColor: colorSet[i],backgroundColor: colorSet[i],tension: 0.5};
	});
	
	const config = {
	  type: report.graphtype,
	  data: data,
	  plugins: {colors: {enabled: true}}
	};
	$("#grvReportGraphContainer").empty();
	let chartStatus = Chart.getChart("grvReportGraphContainer"); // <canvas> id
	if (chartStatus != undefined) {
	  chartStatus.destroy();
	}
    //-- End of chart destroy  
	
	let ctx = document.getElementById("grvReportGraphContainer");
	const mixedChart = new Chart(ctx, config);
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

