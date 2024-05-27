const statsConfig = {
		"container":"surveillance-stats-trends",
		"viewEpidemiology":"false",
		"initFilter":{"idcommunity":"0","dp":"12","dtype":"1_2","age":"0","hba1c":"0","sex":"0"},
		"initSettings":{
			"groups":{
				"g1":"Awash (0 to 9 years)",
				"g2":"Uschiniichisuu (10 to 29 years)",
				"g3":"Chishaayiyuu (30 years and over)",
				"g1color":"#8eeaf6",
				"g2color":"#d8c587",
				"g3color":"#ad82dd"
			},
			"data":{
				"year2021":[{"idcommunity":"1","g1":"1089","g2":"1699","g3":"2225"},{"idcommunity":"2","g1":"175","g2":"291","g3":"371"},{"idcommunity":"3","g1":"895","g2":"1352","g3":"1877"},{"idcommunity":"4","g1":"159","g2":"298","g3":"391"},{"idcommunity":"5","g1":"207","g2":"322","g3":"390"},{"idcommunity":"6","g1":"575","g2":"895","g3":"1099"},{"idcommunity":"7","g1":"463","g2":"751","g3":"877"},{"idcommunity":"8","g1":"335","g2":"521","g3":"814"},{"idcommunity":"9","g1":"207","g2":"408","g3":"446"}]
			}
		}
};

var appFilter = initFilter(statsConfig.initFilter);
var dataperiodValues = [6,12,24,60];
var trendStatsData = null;
var periodStatsData = null;
var valueStatsData = null;
var appSettings = {"flag":statsConfig.viewEpidemiology,"data":statsConfig.initSettings};
var report = loadReport("locallist");
var incidenceData = null;
var prevalanceData = null;
var totalPatientsObject = {};

function initFilter(initialFilter){
	var result = {};
	$.each(initialFilter,function(i,v){
		result[i]=v;
	});
	
	return result;
}

function getIncidence(){
	var result = {"g1cases":"0","g2cases":"0","g3cases":"0","g1prgroup":"0","g2prgroup":"0","g3prgroup":"0","g1prtotal":"0","g2prtotal":"0","g3prtotal":"0","g1prlast":"0","g2prlast":"0","g3prlast":"0"};
	//incidence = new cases/ total population
	var ncg1 = 0;
	var ncg2 = 0;
	var ncg3 = 0;
	var ocg1 = 0;
	var ocg2 = 0;
	var ocg3 = 0;
	var tcg1 = 0;
	var tcg2 = 0;
	var tcg3 = 0;
	var ttcg1 = 0;
	var ttcg2 = 0;
	var ttcg3 = 0;

	var data = appSettings.data.data.year2021;

	$.each(data,function(j,k){
		ttcg1 += Number(k.g1);
		ttcg2 += Number(k.g2);
		ttcg3 += Number(k.g3);
	});

	if(appFilter.idcommunity == "0"){
		//add from all communities
		$.each(data,function(j,k){
			tcg1 += Number(k.g1);
			tcg2 += Number(k.g2);
			tcg3 += Number(k.g3);
		});
	}else{
		$.each(data,function(j,k){
			if(appFilter.idcommunity == k.idcommunity){
				tcg1 = Number(k.g1);
				tcg2 = Number(k.g2);
				tcg3 = Number(k.g3);
			}
		});
	}
	var ds = applyFilter();
	var filterDate = moment().subtract(appFilter.dp, 'months');
	var oldfilterDate = moment().subtract(appFilter.dp*2, 'months');
	$.each(ds,function(i,v){
		var reportDate = moment(v.ddate);
		if(v.age < 10 ){
			//console.log("age less 10");
			//console.log(v);
			
			if(moment(reportDate).isAfter(moment(filterDate))){
				ncg1++;
			}
			if(moment(reportDate).isAfter(oldfilterDate) && moment(reportDate).isBefore(filterDate)){
				ocg1++;
			}
			
		}else if(v.age >=10 && v.age < 30 ){
			//console.log("age less 30");
			//console.log(v);
			if(moment(reportDate).isAfter(moment(filterDate))){
				ncg2++;
			}
			if(moment(reportDate).isAfter(oldfilterDate) && moment(reportDate).isBefore(filterDate)){
				ocg2++;
			}
		}else if(v.age >= 30){
			//console.log("age more 30");
			//console.log(v);
			if(moment(reportDate).isAfter(moment(filterDate))){
				ncg3++;
			}
			if(moment(reportDate).isAfter(oldfilterDate) && moment(reportDate).isBefore(filterDate)){
				ocg3++;
			}
		}
	});
	
	
	result["g1cases"] = ncg1;
	result["g2cases"] = ncg2;
	result["g3cases"] = ncg3;
	result["g1prgroup"] = Number.parseFloat((100*ncg1/tcg1)).toPrecision(2); 
	result["g2prgroup"] = Number.parseFloat((100*ncg2/tcg2)).toPrecision(2);
	result["g3prgroup"] = Number.parseFloat((100*ncg3/tcg3)).toPrecision(2);
	result["g1prtotal"] = Number.parseFloat((100*ncg1/ttcg1)).toPrecision(2); 
	result["g2prtotal"] = Number.parseFloat((100*ncg2/ttcg2)).toPrecision(2);
	result["g3prtotal"] = Number.parseFloat((100*ncg3/ttcg3)).toPrecision(2);
	
	var pr1 = 0;
	if(ocg1 > ncg1){
		pr1 = (Number.parseFloat(100*(ocg1-ncg1)/ocg1)*-1).toPrecision(2);
	}else if(ocg1 < ncg1){
		pr1 = (Number.parseFloat(100*(ncg1-ocg1)/ocg1)).toPrecision(2);
	}
	result["g1prlast"] = pr1;
	
	var pr2 = 0;
	if(ocg2 > ncg2){
		pr2 = (Number.parseFloat(100*(ocg2-ncg2)/ocg2)*-1).toPrecision(2);
	}else if(ocg2 < ncg2){
		pr2 = (Number.parseFloat(100*(ncg2-ocg2)/ocg2)).toPrecision(2);
	}
	result["g2prlast"] = pr2;

	var pr3 = 0;
	if(ocg3 > ncg3){
		pr3 = (Number.parseFloat(100*(ocg3-ncg3)/ocg3)*-1).toPrecision(2);
	}else if(ocg3 < ncg3){
		pr3 = (Number.parseFloat(100*(ncg3-ocg3)/ocg2)).toPrecision(2);
	}
	result["g3prlast"] = pr3;

	
	return result;
}


function getPrevalance(){
	var result = {"g1cases":"0","g2cases":"0","g3cases":"0","g1prgroup":"0","g2prgroup":"0","g3prgroup":"0","g1prtotal":"0","g2prtotal":"0","g3prtotal":"0"};
	//incidence = new cases/ total population
	var ecg1 = 0;
	var ecg2 = 0;
	var ecg3 = 0;
	var tcg1 = 0;
	var tcg2 = 0;
	var tcg3 = 0;
	var ttcg1 = 0;
	var ttcg2 = 0;
	var ttcg3 = 0;

	var data = appSettings.data.data.year2021;
	$.each(data,function(j,k){
		ttcg1 += Number(k.g1);
		ttcg2 += Number(k.g2);
		ttcg3 += Number(k.g3);
	});

	if(appFilter.idcommunity == "0"){
		//add from all communities
		$.each(data,function(j,k){
			tcg1 += Number(k.g1);
			tcg2 += Number(k.g2);
			tcg3 += Number(k.g3);
		});
	}else{
		$.each(data,function(j,k){
			if(appFilter.idcommunity == k.idcommunity){
				tcg1 = Number(k.g1);
				tcg2 = Number(k.g2);
				tcg3 = Number(k.g3);
			}
		});
	}
	var ds = applyFilter();
	var filterDate = moment().subtract(appFilter.dp, 'months');
	$.each(ds,function(i,v){
		var reportDate = moment(v.ddate);
		if(v.age < 10 ){
			//console.log("age less 10");
			//console.log(v);
			ecg1++;
			
		}else if(v.age >=10 && v.age < 30 ){
			//console.log("age less 30");
			//console.log(v);
			ecg2++;
		}else if(v.age >= 30){
			//console.log("age more 30");
			//console.log(v);
			ecg3++;
		}
	});
	
	result["g1cases"] = ecg1;
	result["g2cases"] = ecg2;
	result["g3cases"] = ecg3;
	result["g1prgroup"] = Number.parseFloat((100*ecg1/tcg1)).toPrecision(2); 
	result["g2prgroup"] = Number.parseFloat((100*ecg2/tcg2)).toPrecision(2);
	result["g3prgroup"] = Number.parseFloat((100*ecg3/tcg3)).toPrecision(2);
	result["g1prtotal"] = Number.parseFloat((100*ecg1/ttcg1)).toPrecision(2); 
	result["g2prtotal"] = Number.parseFloat((100*ecg2/ttcg2)).toPrecision(2);
	result["g3prtotal"] = Number.parseFloat((100*ecg3/ttcg3)).toPrecision(2);
	return result;
}




function applyFilter(){
	var result = [];
	var ds = report.data.datasets;
	 
	
	$.each(ds, function(i,obj){
		//community
		var hasCommunity = false;
		if(appFilter.idcommunity != "0"){
			if(obj.idcommunity == appFilter.idcommunity) hasCommunity=true;
		}else{
			hasCommunity = true;
		}

		var hasSex = false;
		if(appFilter.sex != "0"){
			if(obj.sex == appFilter.sex) hasSex=true;
		}else{
			hasSex = true;
		}
		
		//we do not apply filter od data period for Hba1c collected data
		var hasDate = true;
		/*
		if(appFilter.dp != "0"){
			var filterDate = moment().subtract(appFilter.dp, 'months');
			var reportDate = moment(obj.last_hba1c_collecteddate);
			hasDate = moment(reportDate).isAfter(moment(filterDate));
		}
		*/
		
		var hasDtype = false;
		if(obj.dtype != ""){
			if(appFilter.dtype.indexOf(obj.dtype) >= 0 )hasDtype = true;
		}
		 
		
		//no age filter to apply
		
		var hasHBA1c = false;
		if(typeof(obj.last_hba1c) != "undefined"){
			if(appFilter.hba1c.indexOf("_") >= 0){
				var a1cs = appFilter.hba1c.split("_");
				if(obj.last_hba1c >= a1cs[0] && obj.last_hba1c <= a1cs[1]){
					hasHBA1c = true;
				}
			}else if(appFilter.hba1c == "0"){
				hasHBA1c=true;
			}else if(appFilter.hba1c == "1"){
				if(obj.last_hba1c >= 0.08)hasHBA1c=true;
			}
		}
		
		if(hasCommunity && hasDate && hasDtype && hasHBA1c  && hasSex ){
			result.push(obj)
		}else{
			//console.log(obj);
		}
	});
	
	return result;
}




function initSurveillance(p){
	drawToolbarFilters($(".surveillance-filters"));
	buildStatsFrame();
	refreshStatsOutcomes(p);
}

function setToolbar(filter){
	$("#comm-filter").val(filter.idcommunity);
	$("#gen-filter").val(filter.sex);
	$("#dp-filter").val(filter.dp);
	//$("#dp-filter option").attr("selected","false");
	//$("#dp-filter option[value='"+filter.dp+"']").attr("selected","true");
	
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
	
	var a1cValue = filter.hba1c;
	if(a1cValue == "0"){
		$(".gr-a1c-radio div").removeClass("selected");
		$("#a1c-filter-0").addClass("selected");
	}else if(a1cValue == "1"){
		$(".gr-a1c-radio div").removeClass("selected");
		$("#a1c-filter-1").addClass("selected");
	}else{
		$(".gr-a1c-radio div").removeClass("selected");
		$("#a1c-filter-2").addClass("selected");
		$(".gr-a1c-custom").css("visibility","visible");
		var vs = a1cValue.split('_');
		$("#a1c-custom-min").val(vs[0]);
		$("#a1c-custom-max").val(vs[1]);
	}
	
	$.each($(".list-tabs .list-tab"), function(i, list){
		$(".list-tab").removeClass("selected");
		$("#list-"+filter.list).addClass("selected");
	});
	
}



function drawGraphs(){
	
	paramObject1 = {"container":$("#trend-graph"),"data":trendStatsData};
	drawAG(paramObject1);
	
	paramObject2 = {"container":$("#period-graph"),"data":periodStatsData};
	drawL(paramObject2);
	
	paramObject3 = {"container":$("#value-graph"),"data":valueStatsData,"filter":appFilter};
	//drawBL(paramObject3);
	drawHbA1cValueLL(paramObject3);
}


function buildStatsFrame(){
	//patients  number - percentage improvved a1c from list
	if(appSettings.flag == "true"){
		$(".surveillance-stats").css("grid-template-columns","65% 35%");
		//$("<div>",{class:"surveillance-stats-trends"}).appendTo($(".surveillance-stats"));
		//$("<div>",{class:"surveillance-stats-epidemiology"}).appendTo($(".surveillance-stats"));
		$(".surveillance-stats-epidemiology").show();
	}else{
		$(".surveillance-stats").css("grid-template-columns","100% 0%");
		//$("<div>",{class:"surveillance-stats-trends"}).appendTo($(".surveillance-stats"));
		//$("<div>",{class:"surveillance-stats-epidemiology"}).appendTo($(".surveillance-stats"));
		$(".surveillance-stats-epidemiology").hide();
	}
	
	var container = $("."+statsConfig.container);
	
	container.empty();
	var c = $("<div>",{class:"stats-layout"}).appendTo(container);
	$("<div>",{class:"s-container tp","id":"s3"}).appendTo(c);
	$("<div>",{class:"s-container tp","id":"s1"}).appendTo(c);
	$("<div>",{class:"s-container tp","id":"s2"}).appendTo(c);
	
	
	$("#s1").empty();
	$("#s1")
	.append($("<div>",{class:"title"}).text("HbA1c trend"))
	.append($("<div>",{class:"tp-graph","id":"trend-graph"}));
	
	$("#s2").empty();
	$("#s2")
	.append($("<div>",{class:"title"}).html("Percent of patients with <b>NO</b> HbA1C measurement in  <span>"+$('#dp-filter option[value="'+appFilter.dp+'"]').text()+"</span>"))
	.append($("<div>",{class:"tp-graph","id":"period-graph"}));
	
	var tit = "HbA1C target";
	/*
	if(appFilter.hba1c == "1"){
		tit+= "over 0.08"
	}else if(appFilter.hba1c.indexOf("_") >= 0){
		var ps = appFilter.hba1c.split("_");
		tit += "between "+ps[0]+" and "+ps[1]+"."
	}else{
		
	}
	*/
	$("#s3").empty();
	$("#s3")
	.append($("<div>",{class:"title"}).text(tit))
	.append($("<div>",{class:"tp-graph","id":"value-graph"}));
	
	
	showProgress($(".surveillance-stats"));
	//var p = $("#surveillance");
	//$(p).height($(".reportsbody_dashboard").height() - $("#tabs ul").outerHeight() - 200);
	//alert($(".reportsbody_dashboard").height()+"   "+$("#tabs ul").outerHeight()+"  "+$(p).height()+"   "+$(".reportsbody_dashboard").width());
}




function drawToolbarFilters(container){
	container.empty();
	//container
	
	var grbut = $("<div>",{class:"gr-buttons"}).appendTo(container);
	var genBtn = $("<button>",{class:"cisbutton"}).text("Apply filter").appendTo(grbut); 
	genBtn.click(function(){
		
		//treat filters age and hba1c if there are custom values
		if($("#a1c-filter-2").hasClass("selected")){
			var min = isNaN($("#a1c-custom-min").val())?"0":($("#a1c-custom-min").val() === '')?"0":$("#a1c-custom-min").val();
			var max = isNaN($("#a1c-custom-max").val())?"0":($("#a1c-custom-max").val() === '')?"0":$("#a1c-custom-max").val();
			$("#a1c-custom-min").val(min);
			$("#a1c-custom-max").val(max);
			appFilter["hba1c"] = min+"_"+max;
		}
		
		if($("#age-filter-2").hasClass("selected")){
			var min = isNaN($("#age-custom-min").val())?"0":($("#age-custom-min").val() === '')?"0":$("#age-custom-min").val();
			var max = isNaN($("#age-custom-max").val())?"0":($("#age-custom-max").val() === '')?"0":$("#age-custom-max").val();
			$("#age-custom-min").val(min);
			$("#age-custom-max").val(max);
			appFilter["age"] = min+"_"+max;
		}
		
		//showProgress($(".surveillance-stats"));
		getNumberOfPatients();
		buildStatsFrame();
		refreshStatsOutcomes(1);
	});
		
	
	var grfilter = $("<div>",{class:"gr-filters"}).appendTo(container);
	
	//community
	/*
	var grComm = $("<div>",{"id":"toolbarFilterCommunity",class:"gr-comm group"}).appendTo(grfilter);
	$("<div>",{"for":"comm-filter",class:"label-filter"}).text("Community").appendTo(grComm);
	var grCommS = $("<select>",{"id":"comm-filter",class:""}).appendTo(grComm);
	$.each(tool_idcommunity, function(j,com){
		$("<option>",{"value":j}).text(com).appendTo(grCommS);
	});
	grCommS.on("change",function(){
		var v = $(this).val();
		if(v!=appFilter.idcommunity){appFilter["idcommunity"]=v;}
	});
	*/
	/*experiment  grvmselect*/
	/**/
	var grComm = $("<div>",{"id":"toolbarFilterCommunity",class:"gr-comm group"}).appendTo(grfilter);
	$("<div>",{"for":"comm-filter",class:"label-filter"}).html("Community <br><span>max 2 items selected</span>").appendTo(grComm);
	//var grCommS = $("<select>",{"id":"comm-filter",class:""}).appendTo(grComm);
	$("<div>",{class:"mselect"}).appendTo(grComm);
	var list = [{"name":"All Communities","value":"0"},
	            {"name":"Chisasibi","value":"1"},
	            {"name":"Eastmain","value":"2"},
	            {"name":"Mistissini","value":"3"},
	            {"name":"Nemaska","value":"4"},
	            {"name":"Oujebougoumou","value":"5"},
	            {"name":"Waskaganish","value":"6"},
	            {"name":"Waswanipi","value":"7"},
	            {"name":"Wemindji","value":"8"},
	            {"name":"Whapmagoostui","value":"9"}];
	var options = {"container":"mselect","maxSelect":"2","defaultSelected":"0","idrole":userProfileObj.role.idrole};
	var ms = GRVMSelect(list,options);
	$(ms.object).change(function(){
		var v = ms.getValue();
		if(v!=appFilter.idcommunity){appFilter["idcommunity"]=v;}
	})
	
	
	
	//gender
	var grGen = $("<div>",{"id":"toolbarFilterGender",class:"gr-gen group"}).appendTo(grfilter);
	$("<div>",{"for":"gen-filter",class:"label-filter"}).text("Gender").appendTo(grGen);
	var grGenS = $("<select>",{"id":"gen-filter",class:""}).appendTo(grGen);
	$.each(report_sex, function(j,gen){
		$("<option>",{"value":j}).text(gen).appendTo(grGenS);
	});
	grGenS.on("change",function(){
		var v = $(this).val();
		if(v!=appFilter.sex){appFilter["sex"]=v;}
	});

	
	//data period
	var grDp = $("<div>",{"id":"toolbarFilterDataperiod",class:"gr-dp group"}).appendTo(grfilter);
	$("<div>",{"for":"dp-filter",class:"label-filter"}).text("Data period").appendTo(grDp);
	var grDpS = $("<select>",{"id":"dp-filter"}).appendTo(grDp);
	$.each(report_dp, function(x,dp){
		$("<option>",{"value":dataperiodValues[x]}).text(dp).appendTo(grDpS);
	});
	
	grDpS.on("change",function(){
		var v = $(this).val();
		//$("#dp-filter option").attr("selected","false");
		//$("#dp-filter option[value='"+v+"']").attr("selected","true");
		if(v!=appFilter.dp){appFilter["dp"]=v;}
	});
	
	//dtype
	var grDtype = $("<div>",{"id":"toolbarFilterDtype",class:"gr-dtype group"}).appendTo(grfilter);
	$("<div>",{class:"label-filter"}).text("Type of diabetes").appendTo(grDtype);
	var grDtypeC = $("<div>",{class:"gr-dtype-checkbox"}).appendTo(grDtype);
	$("<div>",{"id":"dtype-filter-1",class:"gr-radio","grv-data":"1_2"}).appendTo(grDtypeC).text("Type1 and Type 2");
	$("<div>",{"id":"dtype-filter-2",class:"gr-radio ","grv-data":"3"}).appendTo(grDtypeC).text("Pre DM");
	//$("<div>",{"id":"dtype-filter-3",class:"gr-radio last","grv-data":"4"}).appendTo(grDtypeC).text("GDM");
	$(".gr-dtype-checkbox div").click(function(){
		var dValue = appFilter.dtype;
		var rv = $(this).attr("grv-data");
		if(!$(this).hasClass("selected")){
			$(".gr-dtype-checkbox div").removeClass("selected");
			$(this).addClass("selected");
			dValue = rv;
		}
		appFilter['dtype'] = dValue;
		if(dValue == "1_2"){
			$("#a1c-filter-0").text("<= 0.07 and <= 0.08");
		}else if(dValue == "3"){
			$("#a1c-filter-0").text("< 0.06");
		}
	});
	//age
	var grAge = $("<div>",{"id":"toolbarFilterAge",class:"gr-age group"}).appendTo(grfilter);
	$("<div>",{class:"label-filter"}).text("Age").appendTo(grAge);
	var grAgeC = $("<div>",{class:"gr-age-radio gr"}).appendTo(grAge);
	$("<div>",{"id":"age-filter-1",class:"gr-radio","grv-data":"1"}).appendTo(grAgeC).text("All");
	$("<div>",{"id":"age-filter-2",class:"gr-radio last","grv-data":"2"}).appendTo(grAgeC).text("Custom");
	
	var grAgeCustom = $("<div>",{class:"gr-age-custom gr-custom"}).appendTo(grAge);
	$("<label>",{}).appendTo(grAgeCustom).text("Between min");
	$("<input>",{"type":"text","id":"age-custom-min"}).appendTo(grAgeCustom);
	$("<label>",{}).appendTo(grAgeCustom).text(" and max");
	$("<input>",{"type":"text","id":"age-custom-max"}).appendTo(grAgeCustom);
	//$("<button>",{"id":"age-custom-button",class:"cisbutton"}).text("Set").appendTo(grAgeCustom);
	$(".gr-age-radio .gr-radio").click(function(){
		$(".gr-age-radio div").removeClass("selected");
		$(this).addClass("selected");
		if($(this).attr("grv-data") == "2"){
			$(".gr-age-custom").css("visibility","visible");
			//grDpS.val(60);
			//appFilter["dp"] = 60;
		}else{
			$(".gr-age-custom").css("visibility","hidden");
			appFilter["age"] = "0";
			$("#age-custom-min").val("");
			$("#age-custom-max").val("");
			//draw data
		}
	});
	$("#age-custom-button").click(function(){
		var min = isNaN($("#age-custom-min").val())?"0":($("#age-custom-min").val() === '')?"0":$("#age-custom-min").val();
		var max = isNaN($("#age-custom-max").val())?"0":($("#age-custom-max").val() === '')?"0":$("#age-custom-max").val();
		$("#age-custom-min").val(min);
		$("#age-custom-max").val(max);
		appFilter["age"] = min+"_"+max;
		//draw data
	});
	//a1c
	var grA1c = $("<div>",{"id":"toolbarFilterA1c",class:"gr-a1c group"}).appendTo(grfilter);
	$("<div>",{class:"label-filter"}).html("HbA1c <span>(for HbA1c target graph only)</span>").appendTo(grA1c);
	var grA1cC = $("<div>",{class:"gr-a1c-radio gr"}).appendTo(grA1c);
	if(appFilter["dtype"] == "1_2"){
		$("<div>",{"id":"a1c-filter-0",class:"gr-radio","grv-data":"0"}).appendTo(grA1cC).text("<= 0.07 and <= 0.08");
	}else if(appFilter["dtype"] == "3"){
		$("<div>",{"id":"a1c-filter-0",class:"gr-radio","grv-data":"0"}).appendTo(grA1cC).text("< 0.06");
	}
	
	//$("<div>",{"id":"a1c-filter-1",class:"gr-radio","grv-data":"1"}).appendTo(grA1cC).text("Last value >= 0.08");
	$("<div>",{"id":"a1c-filter-2",class:"gr-radio last","grv-data":"2"}).appendTo(grA1cC).text("Custom");
	
	var grA1cCustom = $("<div>",{class:"gr-a1c-custom gr-custom"}).appendTo(grA1c);
	$("<label>",{}).appendTo(grA1cCustom).text("Between min");
	$("<input>",{"type":"text","id":"a1c-custom-min"}).appendTo(grA1cCustom);
	$("<label>",{}).appendTo(grA1cCustom).text(" and max");
	$("<input>",{"type":"text","id":"a1c-custom-max"}).appendTo(grA1cCustom);
	//$("<button>",{"id":"a1c-custom-button",class:"cisbutton"}).text("Set").appendTo(grA1cCustom);
	$(".gr-a1c-radio .gr-radio").click(function(){
		$(".gr-a1c-radio div").removeClass("selected");
		$(this).addClass("selected");
		if($(this).attr("grv-data") == "2"){
			$(".gr-a1c-custom").css("visibility","visible");
		}else{
			$(".gr-a1c-custom").css("visibility","hidden");
			appFilter["hba1c"] = $(this).attr("grv-data");
			$("#a1c-custom-min").val("");
			$("#a1c-custom-max").val("");
			//draw data
		}
	});
	$("#a1c-custom-button").click(function(){
		var min = isNaN($("#a1c-custom-min").val())?"0":($("#a1c-custom-min").val() === '')?"0":$("#a1c-custom-min").val();
		var max = isNaN($("#a1c-custom-max").val())?"0":($("#a1c-custom-max").val() === '')?"0":$("#a1c-custom-max").val();
		$("#a1c-custom-min").val(min);
		$("#a1c-custom-max").val(max);
		appFilter["hba1c"] = min+"_"+max;
		//draw data
	});
	
	getNumberOfPatients();
}



function refreshStatsOutcomes(p){
	
	setToolbar(appFilter);
	
	//setTimeout(getTrendSeries, 100,p);
	setTimeout(getNewTrendSeries, 100,p);
	//setTimeout(getPeriodSeries, 100,p);
	setTimeout(getNewPeriodSeries, 100,p);
	
	//setTimeout(getValueSeries, 100,p);
	setTimeout(getNewValueSeries, 100,p);
	/*
	//incidenceData = getIncidence();
	//prevalanceData = getPrevalance();
	if(appSettings.flag == "true"){
		setTimeout(drawExisting,1000);
		setTimeout(drawNew,1000);
	}
	*/
	//console.log("p is :"+p)
	if(p!=null){
		removeStatsProgress();
	}
}


function removeStatsProgress(){
	if(trendStatsDataFlag && periodStatsDataFlag && valueStatsDataFlag){
		hideProgress($(".surveillance-stats"));
		trendStatsDataFlag = false;
		periodStatsDataFlag = false;
		valueStatsDataFlag = false;
	}else{
		//console.log("retry");
		setTimeout(removeStatsProgress,500);
	}
}


function formatDataSeries(dataseries,format){
	var result = {"labels":[],"series":[],"ticks":[]};
	if(format == "percentage"){
		var ss = [];
		$.each(dataseries.series, function(j,serie){
			if(j==0){
				var s0 = [];
				ss[j] = s0;
			}
		});
		
		var s1 = dataseries.series[0];
		$.each(s1, function(i,v){
			var tot = 0;
			$.each(dataseries.series, function(j,serie){
				tot += serie[i];
			});
			
			$.each(dataseries.series, function(j,serie){
				if(j==0){
					var sv = Math.round(100*serie[i]/tot);
					if(isNaN(sv))sv =0;
					ss[j].push(sv);
				}
			});
			
        });
	}
	result["labels"] = dataseries.labels[0];
	result["ticks"] = dataseries.ticks;
	result["series"] = ss;
	return result;
}


function getNumberOfPatients(){
	var data = {};
	data["period"]=appFilter.dp;
	data["dtype"] = appFilter.dtype;
	data["age"] = appFilter.age;
	data["idcommunity"] = appFilter.idcommunity;
	data["sex"] = appFilter.sex;
	$.ajax({
		  url: "/ncdis/service/data/getNumberOfPatients?sid="+sid+"&language=en",
		  data : data,
		  async: false,
		  dataType: "json"
		}).done(function( json ) {
			totalPatientsObject = json.objs[0];
			//console.log(totalPatientsObject);
		}).fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		  //console.log(this.url);
		});	
}


function getTrendSeries(p){
	var data = {};
	
	data["stats"] = "trend";
	data["period"]=appFilter.dp;
	data["dtype"] = appFilter.dtype;
	data["age"] = appFilter.age;
	data["idcommunity"] = appFilter.idcommunity;
	//data["idcommunity"] = "0_1";
	data["hba1c"] = appFilter.hba1c;
	data["sex"] = appFilter.sex;
	$.ajax({
		  url: "/ncdis/service/data/getStatsData?sid="+sid+"&language=en",
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			//console.log(json.objs);
			var sd = json.objs;
			//drawStatsTrendSeries($("#s1"), trendStatsData);
			$("#trend-graph").css("background","#ffffff");
			trendStatsData = sd;
			trendStatsDataFlag = true;
			
			if(p!=null){
				paramObject = {"container":$("#trend-graph"),"data":trendStatsData};
				drawAG(paramObject);
			}
			
		}).fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		  //console.log(this.url);
		});	
}


function getNewTrendSerie(idcommunity,dtype,age,sex,period){
	var result = {};
	result["series"] = [];
	result["ticks"] = [];
	result["labels"] = [];
	//Math.round( ( (100*(Number(json.objs[0].series[0]) - Number(json.objs[2].series[0]))/Number(json.objs[2].series[0])) + Number.EPSILON ) * 100 ) / 100;
	var file = "t";
	var isTotals = false;
	var iterations = period;
	if(idcommunity == "0" && age == "0" && sex == "0"){
		iterations = 1;
		file = "tt."+dtype;
		isTotals = true;
	}
	var dtypeLabel = "Type 1 & Type 2";
	if(dtype == "3")dtypeLabel = "PREDM";
	
	if(idcommunity == "0"){
		result["labels"].push({"label":"% of "+dtypeLabel+" patients with HBA1c trending toward target - All communities"});
	}else{
		result["labels"].push({"label":"% of "+dtypeLabel+" patients with HBA1c trending toward target - "+report_idcommunity[idcommunity]});
	}
	
	var serie = [];
	for(var i=0;i<iterations;i++){
		if(!isTotals){
			file = "t."+i+"."+dtype;
		}
		$.ajax({
			dataType:"json",
			async:false,
			url:"/ncdis/client/reports/outcomes/"+file
		}).done(function( data ) {
			  if(isTotals){
				
				for(var j=0;j<period;j++){
					var v = Number(eval("data.m"+j));
					var t = Number(totalPatientsObject["idcommunity_"+idcommunity][j].total);
					var p = Math.round(((100*v/t)+Number.EPSILON)*100)/100;
					serie.push(p);
					result["ticks"].push([j,totalPatientsObject["idcommunity_"+idcommunity][j].since]);
				}
				
				//"label", "% of "+dtypelabel+" patients with HBA1c trending toward target - "+communities[Integer.parseInt(idcommunity)]);
				
			  }else{
				var tot = 0;  
				$.each( data, function( index, obj ) {
					if(idcommunity == "0"){
						if(age == "0"){
							if(sex == "0"){
								tot+=Number(obj.n);
							}else{
								if(sex == obj.s){
									tot+=Number(obj.n);
								}
							}
						}else{
							if(age.indexOf("_") >= 0){
								var parts = age.split("_");
								if(Number(obj.a) >= Number(parts[0]) && Number(obj.a) <= Number(parts[1])){
									if(sex == "0"){
										tot+=Number(obj.n);
									}else{
										if(sex == obj.s){
											tot+=Number(obj.n);
										}
									}
								}
							}
						}
					}else{
						if(idcommunity == obj.c){
							if(age == "0"){
								if(sex == "0"){
									tot+=Number(obj.n);
								}else{
									if(sex == obj.s){
										tot+=Number(obj.n);
									}
								}
							}else{
								if(age.indexOf("_") >= 0){
									var parts = age.split("_");
									if(Number(obj.a) >= Number(parts[0]) && Number(obj.a) <= Number(parts[1])){
										if(sex == "0"){
											tot+=Number(obj.n);
										}else{
											if(sex == obj.s){
												tot+=Number(obj.n);
											}
										}
									}
								}
							}
						}
					}
					
				}); 
				var t = Number(totalPatientsObject["idcommunity_"+idcommunity][i].total);
				var p = Math.round(((100*tot/t)+Number.EPSILON)*100)/100;
				serie.push(p);
				result["ticks"].push([i,totalPatientsObject["idcommunity_"+idcommunity][i].since]);
			  }
			  
		});
	}
	result["series"].push(serie);
	return result;
}

function getNewTrendSeries(p){
	var trendsStatsData = [];
	if(appFilter.idcommunity.indexOf("_") >= 0){
		//multipple communities
		var parts = appFilter.idcommunity.split("_");
		$.each(parts,function(i,part){
			var serie = getNewTrendSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp);
			trendsStatsData.push(serie);
		});
	}else{
		var serie = getNewTrendSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp);
		trendsStatsData.push(serie);
	}
	trendsStatsData = reverseSerie(trendsStatsData);
	trendStatsDataFlag = true;
	paramObject = {"container":$("#trend-graph"),"data":trendsStatsData};
	drawAG(paramObject);
	
}

function reverseSerie(serieArray){
	var result = [];
	
	$.each(serieArray, function(idx, serieObject){
		var resultObject = {"labels":[],"series":[],"ticks":[]};
		resultObject["labels"] = serieObject["labels"];
		$.each(serieObject["series"],function(index, serie){
			resultObject["series"].push(serie.reverse());
		});
		var j=0;
		for(var i=serieObject["ticks"].length-1;i>=0;i--){
			
			resultObject["ticks"].push([j,serieObject["ticks"][i][1]]);
			j++;
		}
		result.push(resultObject);
	});
	
	return result;
}



function getNewPeriodSerie(idcommunity,dtype,age,sex,period){
	var result = {};
	result["series"] = [];
	result["ticks"] = [];
	result["labels"] = [];
	//Math.round( ( (100*(Number(json.objs[0].series[0]) - Number(json.objs[2].series[0]))/Number(json.objs[2].series[0])) + Number.EPSILON ) * 100 ) / 100;
	var file = "p";
	var isTotals = false;
	var iterations = period;
	if(idcommunity == "0" && age == "0" && sex == "0"){
		iterations = 1;
		file = "tp."+dtype;
		isTotals = true;
	}
	
	if(idcommunity == "0"){
		result["labels"].push({"label":"% patients with NO HbA1C measurement in last 12 months - All communities"});
	}else{
		result["labels"].push({"label":"% patients with NO HbA1C measurement in last 12 months - "+report_idcommunity[idcommunity]});
	}
	
	var serie = [];
	for(var i=0;i<iterations;i++){
		if(!isTotals){
			file = "p."+i+"."+dtype;
		}
		$.ajax({
			dataType:"json",
			async:false,
			url:"/ncdis/client/reports/outcomes/"+file
		}).done(function( data ) {
			  if(isTotals){
				for(var j=0;j<period;j++){
					var v = Number(eval("data.m"+j));
					var t = Number(totalPatientsObject["idcommunity_"+idcommunity][j].total);
					var p = Math.round(((100*v/t)+Number.EPSILON)*100)/100;
					serie.push(p);
					result["ticks"].push([j,totalPatientsObject["idcommunity_"+idcommunity][j].since]);
				}
			  }else{
				var tot = 0;  
				$.each( data, function( index, obj ) {
					if(idcommunity == "0"){
						if(age == "0"){
							if(sex == "0"){
								tot+=Number(obj.n);
							}else{
								if(sex == obj.s){
									tot+=Number(obj.n);
								}
							}
						}else{
							if(age.indexOf("_") >= 0){
								var parts = age.split("_");
								if(Number(obj.a) >= Number(parts[0]) && Number(obj.a) <= Number(parts[1])){
									if(sex == "0"){
										tot+=Number(obj.n);
									}else{
										if(sex == obj.s){
											tot+=Number(obj.n);
										}
									}
								}
							}
						}
					}else{
						if(idcommunity == obj.c){
							if(age == "0"){
								if(sex == "0"){
									tot+=Number(obj.n);
								}else{
									if(sex == obj.s){
										tot+=Number(obj.n);
									}
								}
							}else{
								if(age.indexOf("_") >= 0){
									var parts = age.split("_");
									if(Number(obj.a) >= Number(parts[0]) && Number(obj.a) <= Number(parts[1])){
										if(sex == "0"){
											tot+=Number(obj.n);
										}else{
											if(sex == obj.s){
												tot+=Number(obj.n);
											}
										}
									}
								}
							}
						}
					}
					
				}); 
				var t = Number(totalPatientsObject["idcommunity_"+idcommunity][i].total);
				var p = Math.round(((100*tot/t)+Number.EPSILON)*100)/100;
				serie.push(p);
				result["ticks"].push([i,totalPatientsObject["idcommunity_"+idcommunity][i].since]);
			  }
			  
		});
	}
	result["series"].push(serie);
	return result;
}

function getNewPeriodSeries(p){
	var periodsStatsData = [];
	if(appFilter.idcommunity.indexOf("_") >= 0){
		//multipple communities
		var parts = appFilter.idcommunity.split("_");
		$.each(parts,function(i,part){
			var serie = getNewPeriodSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp);
			periodsStatsData.push(serie);
		});
	}else{
		var serie = getNewPeriodSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp);
		periodsStatsData.push(serie);
	}
	//console.log(periodsStatsData)
	periodsStatsData = reverseSerie(periodsStatsData);
	periodStatsDataFlag = true;
	paramObject = {"container":$("#period-graph"),"data":periodsStatsData};
	drawL(paramObject);
}


function getNewValueSerie(idcommunity,dtype,age,sex,period,hba1c){
	var result = {};
	result["series"] = [];
	result["ticks"] = [];
	result["labels"] = [];
	//Math.round( ( (100*(Number(json.objs[0].series[0]) - Number(json.objs[2].series[0]))/Number(json.objs[2].series[0])) + Number.EPSILON ) * 100 ) / 100;
	var file = "p";
	var isTotals = false;
	var iterations = period;
	if(idcommunity == "0" && age == "0" && sex == "0" && hba1c=="0"){
		iterations = 1;
		file = "tp."+dtype;
		isTotals = true;
	}
	var dtypelabel = "Type 1 & Type 2 ";
	if(dtype!="1_2")dtypelabel = "PREDM";
	
	var labelDataStr = " <= ";
	if(hba1c == "0.07"){
		labelDataStr = " <= 0.07 ";
	}else if(hba1c == "0.08"){
		labelDataStr = " <= 0.08 ";
	}else if(hba1c == "0.06"){
		labelDataStr = " < 0.06 ";
	}else {
		if(hba1c.indexOf("_") >= 0){
			var ps = hba1c.split("_");
			labelDataStr = " between "+ps[0]+" and "+ps[1];
		}
	}
	
	if(idcommunity == "0"){
		result["labels"].push({"label":"% of "+dtypelabel+" patients with "+labelDataStr+" -  All communities"});
	}else{
		result["labels"].push({"label":"% of "+dtypelabel+" patients with "+labelDataStr+"- "+report_idcommunity[idcommunity]});
	}
	
	var serie = [];
	for(var i=0;i<iterations;i++){
		if(!isTotals){
			file = "v."+i+"."+dtype;
		}
		$.ajax({
			dataType:"json",
			async:false,
			url:"/ncdis/client/reports/outcomes/"+file
		}).done(function( data ) {
			  if(isTotals){
				for(var j=0;j<period;j++){
					var v = Number(eval("data.m"+j));
					var t = Number(totalPatientsObject["idcommunity_"+idcommunity][j].total);
					var p = Math.round(((100*v/t)+Number.EPSILON)*100)/100;
					serie.push(p);
					result["ticks"].push([j,totalPatientsObject["idcommunity_"+idcommunity][j].since]);
				}
			  }else{
				var tot = 0;  
				$.each( data, function( index, obj ) {
					if(idcommunity == "0"){
						if(age == "0"){
							if(sex == "0"){
								if(hba1c == "0.07" && Number(obj.v) <= 0.07){
									tot+=Number(obj.n);
								}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
									tot+=Number(obj.n);
								}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
									tot+=Number(obj.n);
								}else{
									var ps = hba1c.split("_");
									if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
										tot+=Number(obj.n);
									}
								}
							}else{
								if(sex == obj.s){
									if(hba1c == "0.07" && Number(obj.v) <= 0.07){
										tot+=Number(obj.n);
									}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
										tot+=Number(obj.n);
									}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
										tot+=Number(obj.n);
									}else{
										var ps = hba1c.split("_");
										if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
											tot+=Number(obj.n);
										}
									}
								}
							}
						}else{
							if(age.indexOf("_") >= 0){
								var parts = age.split("_");
								if(Number(obj.a) >= Number(parts[0]) && Number(obj.a) <= Number(parts[1])){
									if(sex == "0"){
										if(hba1c == "0.07" && Number(obj.v) <= 0.07){
											tot+=Number(obj.n);
										}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
											tot+=Number(obj.n);
										}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
											tot+=Number(obj.n);
										}else{
											var ps = hba1c.split("_");
											if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
												tot+=Number(obj.n);
											}
										}
									}else{
										if(sex == obj.s){
											if(hba1c == "0.07" && Number(obj.v) <= 0.07){
												tot+=Number(obj.n);
											}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
												tot+=Number(obj.n);
											}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
												tot+=Number(obj.n);
											}else{
												var ps = hba1c.split("_");
												if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
													tot+=Number(obj.n);
												}
											}
										}
									}
								}
							}
						}
					}else{
						if(idcommunity == obj.c){
							if(age == "0"){
								if(sex == "0"){
									if(hba1c == "0.07" && Number(obj.v) <= 0.07){
										tot+=Number(obj.n);
									}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
										tot+=Number(obj.n);
									}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
										tot+=Number(obj.n);
									}else{
										var ps = hba1c.split("_");
										if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
											tot+=Number(obj.n);
										}
									}
								}else{
									if(sex == obj.s){
										if(hba1c == "0.07" && Number(obj.v) <= 0.07){
											tot+=Number(obj.n);
										}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
											tot+=Number(obj.n);
										}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
											tot+=Number(obj.n);
										}else{
											var ps = hba1c.split("_");
											if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
												tot+=Number(obj.n);
											}
										}
									}
								}
							}else{
								if(age.indexOf("_") >= 0){
									var parts = age.split("_");
									if(Number(obj.a) >= Number(parts[0]) && Number(obj.a) <= Number(parts[1])){
										if(sex == "0"){
											if(hba1c == "0.07" && Number(obj.v) <= 0.07){
												tot+=Number(obj.n);
											}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
												tot+=Number(obj.n);
											}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
												tot+=Number(obj.n);
											}else{
												var ps = hba1c.split("_");
												if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
													tot+=Number(obj.n);
												}
											}
										}else{
											if(sex == obj.s){
												if(hba1c == "0.07" && Number(obj.v) <= 0.07){
													tot+=Number(obj.n);
												}else if(hba1c == "0.08" && Number(obj.v) <= 0.08){
													tot+=Number(obj.n);
												}else if(hba1c == "0.06" && Number(obj.v) < 0.06){
													tot+=Number(obj.n);
												}else{
													var ps = hba1c.split("_");
													if(Number(obj.v) >= Number(ps[0]) && Number(obj.v) <= Number(ps[1])){
														tot+=Number(obj.n);
													}
												}
											}
										}
									}
								}
							}
						}
					}
					
				}); 
				var t = Number(totalPatientsObject["idcommunity_"+idcommunity][i].total);
				var p = Math.round(((100*tot/t)+Number.EPSILON)*100)/100;
				serie.push(p);
				result["ticks"].push([i,totalPatientsObject["idcommunity_"+idcommunity][i].since]);
			  }
			  
		});
	}
	result["series"].push(serie);
	return result;
}

function getNewValueSeries(p){
	var valuesStatsData = [];
	if(appFilter.idcommunity.indexOf("_") >= 0){
		//multipple communities
		var parts = appFilter.idcommunity.split("_");
		$.each(parts,function(i,part){
			if(appFilter.hba1c == "0" && appFilter.dtype == "1_2"){
				var serie = getNewValueSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.07");
				valuesStatsData.push(serie);
				var serie1 = getNewValueSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.08");
				valuesStatsData.push(serie1);
			}else if(appFilter.hba1c == "0" && appFilter.dtype == "3"){
				var serie = getNewValueSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.06");
				valuesStatsData.push(serie);
			}else if(appFilter.hba1c != "0" && appFilter.dtype == "1_2"){
				var serie = getNewValueSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.07");
				valuesStatsData.push(serie);
				var serie1 = getNewValueSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, appFilter.hba1c);
				valuesStatsData.push(serie1);
			}else if(appFilter.hba1c != "0" && appFilter.dtype == "3"){
				var serie = getNewValueSerie(part,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, appFilter.hba1c);
				valuesStatsData.push(serie);
			}
		});
	}else{
		if(appFilter.hba1c == "0" && appFilter.dtype == "1_2"){
			var serie = getNewValueSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.07");
			valuesStatsData.push(serie);
			var serie1 = getNewValueSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.08");
			valuesStatsData.push(serie1);
		}else if(appFilter.hba1c == "0" && appFilter.dtype == "3"){
			var serie = getNewValueSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.06");
			valuesStatsData.push(serie);
		}else if(appFilter.hba1c != "0" && appFilter.dtype == "1_2"){
			var serie = getNewValueSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, "0.07");
			valuesStatsData.push(serie);
			var serie1 = getNewValueSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, appFilter.hba1c);
			valuesStatsData.push(serie1);
		}else if(appFilter.hba1c != "0" && appFilter.dtype == "3"){
			var serie = getNewValueSerie(appFilter.idcommunity,appFilter.dtype, appFilter.age, appFilter.sex, appFilter.dp, appFilter.hba1c);
			valuesStatsData.push(serie);
		}
	}
	valuesStatsData = reverseSerie(valuesStatsData);
	valueStatsDataFlag = true;
	paramObject = {"container":$("#value-graph"),"data":valuesStatsData,"filter":appFilter};
	drawHbA1cValueLL(paramObject);
	
}



function getPeriodSeries(p){
	var data = {};
	data["stats"] = "period";
	data["period"]=appFilter.dp;
	data["dtype"] = appFilter.dtype;
	data["age"] = appFilter.age;
	data["idcommunity"] = appFilter.idcommunity;
	data["hba1c"] = appFilter.hba1c;
	data["sex"] = appFilter.sex;
	
	$.ajax({
		  url: "/ncdis/service/data/getStatsData?sid="+sid+"&language=en",
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			periodStatsData = json.objs;
			console.log("period data");
			console.log(periodStatsData);
			periodStatsDataFlag = true;
			$("#period-graph").css("background","#ffffff");
			if(p != null){
				paramObject = {"container":$("#period-graph"),"data":periodStatsData};
				drawL(paramObject);
			}
		}).fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		  //console.log(this.url);
		});	
}
function getValueSeries(p){
	var data = {};
	data["stats"] = "value";
	data["period"]=appFilter.dp;
	data["dtype"] = appFilter.dtype;
	data["age"] = appFilter.age;
	data["idcommunity"] = appFilter.idcommunity;
	data["hba1c"] = appFilter.hba1c;
	data["sex"] = appFilter.sex;
	
	
	
	var trendStats = $.ajax({
		  url: "/ncdis/service/data/getStatsData?sid="+sid+"&language=en",
		  data : data,
		  dataType: "json"
		}).done(function( json ) {
			valueStatsData = json.objs;
			valueStatsDataFlag = true;
			$("#value-graph").css("background","#ffffff");
			if(p!=null){
				paramObject = {"container":$("#value-graph"),"data":valueStatsData,"filter":appFilter};
				drawHbA1cValueLL(paramObject);
			}
			
		}).fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});	
}


function renderValues(value, name){
	var result = value;
	switch(name){
	case "data-period" : 
		result = report_dp[dataperiodValues.indexOf(Number(value))];
		break;
	case "community" :
		if(value == "0"){
			result = "Eeyou Istchee";
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
		case "0" : result = "all genders";break;
		case "1" : result = "Male gender";break;
		case "2" : result = "Female gender";break;
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
	}
	
	return result;
}




function drawExisting(){
	var title = "<p><b>Existing cases</b> in <span class='pepi-text-period'>"+renderValues(appFilter.dp,"data-period")+"</span> in <span class='pepi-text-community'>"+renderValues(appFilter.idcommunity,"community")+"</span> for <span class='pepi-text-dtype'>"+renderValues(appFilter.dtype,"dtype")+"</span> patients of <span class='pepi-text-gender'>"+renderValues(appFilter.sex,"gender")+"</span> having <span class='pepi-text-hba1c'>"+renderValues(appFilter.hba1c,"hba1c")+"</span></p>";
	var g1text = "<p>In <span class='pepi-text-g1'>"+appSettings.data.groups.g1+"</span> group: <span class='pepi-text-g1-cases'>"+renderValues(prevalanceData.g1cases,"pcases")+"</span></p>" +
			"<ul class='pepi-text-g1-detail'>" +
			"<li class='pepi-g1-pr-group'>representing <span class='pepi-text-g1-pr-group'>"+renderValues(prevalanceData.g1prgroup,"prcases")+"</span> of group</li>" +
			"<li class='pepi-g1-pr-total'>representing <span class='pepi-text-g1-pr-total'>"+renderValues(prevalanceData.g1prtotal,"prcases")+"</span> of total population</li></ul>";
	var g2text = "<p>In <span class='pepi-text-g2'>"+appSettings.data.groups.g2+"</span> group: <span class='pepi-text-g2-cases'>"+renderValues(prevalanceData.g2cases,"pcases")+"</span></p>" +
	"<ul class='pepi-text-g2-detail'>" +
	"<li class='pepi-g2-pr-group'>representing <span class='pepi-text-g2-pr-group'>"+renderValues(prevalanceData.g2prgroup,"prcases")+"</span> of group</li>" +
	"<li class='pepi-g2-pr-total'>representing <span class='pepi-text-g2-pr-total'>"+renderValues(prevalanceData.g2prtotal,"prcases")+"</span> of total population</li></ul>";
	
	var g3text = "<p>In <span class='pepi-text-g3'>"+appSettings.data.groups.g3+"</span> group: <span class='pepi-text-g3-cases'>"+renderValues(prevalanceData.g3cases,"pcases")+"</span></p>" +
	"<ul class='pepi-text-g3-detail'>" +
	"<li class='pepi-g3-pr-group'>representing <span class='pepi-text-g3-pr-group'>"+renderValues(prevalanceData.g3prgroup,"prcases")+"</span> of group</li>" +
	"<li class='pepi-g3-pr-total'>representing <span class='pepi-text-g3-pr-total'>"+renderValues(prevalanceData.g3prtotal,"prcases")+"</span> of total population</li></ul>";
	
	$(".surveillance-stats-epidemiology-exist").html(title+g1text+g2text+g3text);
	
	if(appFilter.idcommunity == "0"){
		$(".pepi-g1-pr-total").remove();
		$(".pepi-g2-pr-total").remove();
		$(".pepi-g3-pr-total").remove();
	}
	
	if(prevalanceData.g1cases == "0")$(".pepi-text-g1-detail").remove();
	if(prevalanceData.g2cases == "0")$(".pepi-text-g2-detail").remove();
	if(prevalanceData.g3cases == "0")$(".pepi-text-g3-detail").remove();
	
}

function drawNew(){
	var title = "<p><b>New cases</b> in <span class='epi-text-period'>"+renderValues(appFilter.dp,"data-period")+"</span> in <span class='epi-text-community'>"+renderValues(appFilter.idcommunity,"community")+"</span> for <span class='epi-text-dtype'>"+renderValues(appFilter.dtype,"dtype")+"</span> patients of <span class='epi-text-gender'>"+renderValues(appFilter.sex,"gender")+"</span> having <span class='epi-text-hba1c'>"+renderValues(appFilter.hba1c,"hba1c")+"</span></p>";
	var g1l = renderValues(incidenceData.g1prlast,"prlast");
	var g1c = "epi-text-g1-pr-lastd";
	
	if(g1l.indexOf("increase") >= 0)g1c = "epi-text-g1-pr-lasti";
	if(g1l.indexOf("stagnation") >= 0)g1c = "epi-text-g1-pr-lasts";
	
	var g2l = renderValues(incidenceData.g2prlast,"prlast");
	var g2c = "epi-text-g2-pr-lasti";
	
	if(g2l.indexOf("increase") >= 0)g2c = "epi-text-g2-pr-lasti";
	if(g2l.indexOf("stagnation") >= 0)g2c = "epi-text-g2-pr-lasts";
	
	var g3l = renderValues(incidenceData.g3prlast,"prlast");
	var g3c = "epi-text-g3-pr-lasti";
	
	if(g3l.indexOf("increase") >= 0)g3c = "epi-text-g3-pr-lasti";
	if(g3l.indexOf("stagnation") >= 0)g3c = "epi-text-g3-pr-lasts";
	
	var g1text = "<p>In <span class='epi-text-g1'>"+appSettings.data.groups.g1+"</span> : <span class='epi-text-g1-cases'>"+renderValues(incidenceData.g1cases,"ncases")+"</span></p>" +
			"<ul class='epi-text-g1-detail'>" +
			"<li class='epi-g1-pr-last'>representing <span class='"+g1c+"'>"+g1l+"</span> from last period</li>" +
			"<li class='epi-g1-pr-group'>representing <span class='epi-text-g1-pr-group'>"+renderValues(incidenceData.g1prgroup,"prcases")+"</span> of group</li>" +
			"<li class='epi-g1-pr-total'>representing <span class='epi-text-g1-pr-total'>"+renderValues(incidenceData.g1prtotal,"prcases")+"</span> of total population</li></ul>";
	var g2text = "<p>In <span class='epi-text-g2'>"+appSettings.data.groups.g2+"</span> : <span class='epi-text-g2-cases'>"+renderValues(incidenceData.g2cases,"ncases")+"</span></p>" +
	"<ul class='epi-text-g2-detail'>" +
	"<li class='epi-g2-pr-last'>representing <span class='"+g2c+"'>"+g2l+"</span> from last period</li>" +
	"<li class='epi-g2-pr-group'>representing <span class='epi-text-g2-pr-group'>"+renderValues(incidenceData.g2prgroup,"prcases")+"</span> of group</li>" +
	"<li class='epi-g2-pr-total'>representing <span class='epi-text-g2-pr-total'>"+renderValues(incidenceData.g2prtotal,"prcases")+"</span> of total population</li></ul>";
	
	var g3text = "<p>In <span class='epi-text-g3'>"+appSettings.data.groups.g3+"</span> : <span class='epi-text-g3-cases'>"+renderValues(incidenceData.g3cases,"ncases")+"</span></p>" +
	"<ul class='epi-text-g3-detail'>" +
	"<li class='epi-g3-pr-last'>representing <span class='"+g3c+"'>"+g3l+"</span> from last period</li>" +
	"<li class='epi-g3-pr-group'>representing <span class='epi-text-g3-pr-group'>"+renderValues(incidenceData.g3prgroup,"prcases")+"</span> of group</li>" +
	"<li class='epi-g3-pr-total'>representing <span class='epi-text-g3-pr-total'>"+renderValues(incidenceData.g3prtotal,"prcases")+"</span> of total population</li></ul>";
	
	$(".surveillance-stats-epidemiology-new").html(title+g1text+g2text+g3text);
	
	if(appFilter.idcommunity == "0"){
		$(".epi-g1-pr-total").remove();
		$(".epi-g2-pr-total").remove();
		$(".epi-g3-pr-total").remove();
	}
	
	if(incidenceData.g1cases == "0")$(".epi-text-g1-detail").remove();
	if(incidenceData.g2cases == "0")$(".epi-text-g2-detail").remove();
	if(incidenceData.g3cases == "0")$(".epi-text-g3-detail").remove();
}



function loadReport(reportID){
	var url = "/ncdis/client/reports/report."+reportID+"?ts="+moment();
	var result = null;
	var req1 = $.ajax({dataType: "json",url: url,async:false,cache:false});
	req1.success(function(obj){
		result = obj;
	});
	req1.fail(function( jqXHR, textStatus, errorThrown){console.log("AJAX failed!", jqXHR, textStatus, errorThrown)});
	return result;
}




