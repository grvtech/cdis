/*
 * GLOGAL variables
 * */
var reportsObject = null;

/*
 * MAIN Section 
 * */
initLocalDashboardPage();
	
/*
 * EVENT definitions
 * 
 * */



/*
 * FUNCTIONS
 * */

function initLocalDashboardPage(){
	reportsSection = "dashboard";
	reportsObject = getDashboardReports(sid);
	var list = $("#grvDashboard");
	list.empty();
	var predefinedReports = reportsObject.predefined;
	if(predefinedReports.length > 0){
		
		$.each(predefinedReports, function(k, vObj){
			var raport = prepareDashboardReport(vObj.code);
			reportObjectToExecute = loadDashboardReport(raport);
			list.append(
					$("<div>",{class:"cdisDashboardItem uss",id:reportObjectToExecute.id})
						.append($("<div>",{class:"title"}))
						.append($("<div>",{class:"form"}))
						.append($("<div>",{class:"graph",id:"graph-"+reportObjectToExecute.id}).append($("<div>",{class:"loading-span"}).text("Loading ...")))
			);
			renderDashboardReport(reportObjectToExecute);
		});
	}
}

function prepareDashboardReport(reportID){
	var url = "/ncdis/client/reports/report."+reportID+"?ts="+moment().format('X');
	var result = null;
	var req1 = $.ajax({
		  dataType: "json",
		  url: url,
		  async:false,
		  cache : false
		});	
	req1.success(function(obj){
		result = obj;
	});
	req1.fail(function( jqXHR, textStatus, errorThrown){console.log("AJAX failed!", jqXHR, textStatus, errorThrown)});
	return result;
}

function loadDashboardReport(rObj){
	var report = rObj;
	if(report.input!= null &&  $.type(report.input) === "array" ){
		$.each(report.input, function(ix, objInput){
			var obj = {};
			var val = "0";
			obj["subname"] = objInput.name;
			if(objInput.section != "90"){
				if((objInput.name == "idcommunity" || objInput.name == "dtype") && (val == "0")){
					obj["suboperator"] = "more than";
				}else{
					obj["suboperator"] = objInput.operator;
				}
			}else{
				obj["suboperator"] = objInput.operator;
			}
			obj["subvalue"] = val;
			obj["subdisplay"] = objInput.display;
			obj["subsection"] = objInput.section;
			report.subcriteria[ix] = obj;
			reportObjectToExecute = report;
		});
	}
	return report;
}

function renderDashboardReport(reportObj){
	$("#"+reportObj.id+" > .title").append($("<div>",{style:"display:inline-block;width:90%;"}).text(reportObj.title));
	
	if($.type(reportObj.input) === "array"){
		$.each(reportObj.input,function(i,v){
			var cinputForm = $("<div>",{class:"form-item"});
			cinputForm.append($("<div>",{class:"form-label"}).text(v.display));
			var rid = reportObj.id;
			$("#"+rid+" > .form").append(cinputForm);
			if(v.name == "idcommunity" ){
				$("<div>",{class:"ms"+rid}).appendTo(cinputForm);
				var voptions = {"container":"ms"+rid,"maxSelect":"2","defaultSelected":"0","idrole":userProfileObj.role.idrole};
				var vlist = [{"name":"All Communities","value":"0"},
				            {"name":"Chisasibi","value":"1"},
				            {"name":"Eastmain","value":"2"},
				            {"name":"Mistissini","value":"3"},
				            {"name":"Nemaska","value":"4"},
				            {"name":"Oujebougoumou","value":"5"},
				            {"name":"Waskaganish","value":"6"},
				            {"name":"Waswanipi","value":"7"},
				            {"name":"Wemindji","value":"8"},
				            {"name":"Whapmagoostui","value":"9"}];
				
				var ms = new GRVMSelect(vlist,voptions);
				$(ms.object).change(function(){
					var v = ms.getValue();
					$(ms.element).attr("value",v);
					var subObj = reportObj["subcriteria"][i];
					var vv = v;
					if(subObj.subsection == "1"){
						if(vv == "0"){
							subObj["suboperator"] = "more than";
						}else{
							subObj["suboperator"] = "equal";
						}
					}
					subObj["subvalue"] = v;
					reportObj["subcriteria"][i] = subObj;
					
					if($("#form-field-cvalue-REP3").val() == "on" && ($(reportObj).attr("id")).indexOf("REP3") >=0 ){
						if(!isDecimal($("#form-field-cvalue-REP3-cvalue-value").val())){
							$("#form-item-cvalue-REP3-cvalue .form-label").addClass("txtErrorRed");
							$("#form-field-cvalue-REP3-cvalue-value").addClass("inputErrorRed");
						}else{
							renderGraphReport3CustomValue($("#form-field-dtype-REP3").val(),$(".msREP3").attr("value"), $("#form-field-cvalue-REP3-cvalue-value").val(),$("#REP3 > .graph"));
						}
					}else if($("#form-field-filter-REP4").val() == "on" && ($(reportObj).attr("id")).indexOf("REP4") >=0 ){
						renderGraphReport4CustomValue($("#form-field-dtype-REP4").val(),$(".msREP4").attr("value"), "sens", "value",$("#REP4 > .graph"));
					}else{
						renderGraphReport(reportObj, $("#"+reportObj.id+" > .graph"));
					}
					
				});
			}else{
				var ri = $("<select>",{id:"form-field-"+v.name+"-"+reportObj.id});
				ri.change(function(){
					var subObj = reportObj["subcriteria"][i];
					var vv = ri.val();
					if(subObj.subsection == "1"){
						if(vv == "0"){
							subObj["suboperator"] = "more than";
						}else{
							subObj["suboperator"] = "equal";
						}
					}
					subObj["subvalue"] = ri.val();
					reportObj["subcriteria"][i] = subObj;
					
					if($("#form-field-cvalue-REP3").val() == "on" && ($(this).attr("id")).indexOf("REP3") >=0 ){
						if(!isDecimal($("#form-field-cvalue-REP3-cvalue-value").val())){
							$("#form-item-cvalue-REP3-cvalue .form-label").addClass("txtErrorRed");
							$("#form-field-cvalue-REP3-cvalue-value").addClass("inputErrorRed");
						}else{
							renderGraphReport3CustomValue($("#form-field-dtype-REP3").val(),$(".msREP3").attr("value"), $("#form-field-cvalue-REP3-cvalue-value").val(),$("#REP3 > .graph"));
						}
					}else if($("#form-field-filter-REP4").val() == "on" && ($(this).attr("id")).indexOf("REP4") >=0 ){
						renderGraphReport4CustomValue($("#form-field-dtype-REP4").val(),$(".msREP4").attr("value"), "sens", "value",$("#REP4 > .graph"));
						
					}else{
						
						renderGraphReport(reportObj, $("#"+reportObj.id+" > .graph"));
					}
					
					
				});
				var ric = $("<div>",{class:"field-container"}).append(ri);
				cinputForm.append(ric);
				$.each(v.values, function (i, item) {
				    ri.append($('<option>', { 
				       value: i,
				        text : item 
				    }));
				});
				
				//all dtype should be default at Type 1 anf type 2 DM 
				if(v.name == "dtype"){
					$(ri).val(1);
					var subObj = reportObj["subcriteria"][i];
					var vv = ri.val();
					if(subObj.subsection == "1"){
						if(vv == "0"){
							subObj["suboperator"] = "more than";
						}else{
							subObj["suboperator"] = "equal";
						}
					}
					subObj["subvalue"] = ri.val();
					reportObj["subcriteria"][i] = subObj;
				}
			}
			
		});
		//out of input loop
		// add checkbox to include custom value
		if(reportObj.id == "REP3"){
			var cc = $("<div>",{class:"form-item"});
			cc.append($("<div>",{class:"form-label"}).text("Custom value"));
			var chekri = $("<input>",{type:"checkbox",id:"form-field-cvalue-REP3",value:"off",style:"vertical-align: middle;position: relative;bottom: 1px;"}).appendTo(cc);
			$("#"+reportObj.id+" > .form").append(cc);
			
			chekri.change(function(){
				if($("#form-field-cvalue-REP3").val() == "off"){
					
					$("#form-field-cvalue-REP3").val("on");
					
					if($("#form-item-cvalue-REP3-cvalue").length <= 0){
						var hfb = $("#"+reportObj.id+" .form").height();
						var c = $("<div>",{class:"form-item",id:"form-item-cvalue-REP3-cvalue"}).appendTo($("#"+reportObj.id+" > .form"));
						var l = $("<div>",{class:"form-label"}).text("Value");
						c.append(l);
						var input = $("<input>",{type:"text",id:"form-field-cvalue-REP3-cvalue-value",style:"width:50px;padding:2px;"}); 
						c.append(input);
						input.focus(function(){
							$("#form-item-cvalue-REP3-cvalue .form-label").removeClass("txtErrorRed");
							$("#form-field-cvalue-REP3-cvalue-value").removeClass("inputErrorRed");
						});
						var b = $("<div>",{class:"cisbutton",style:"color:#fff;margin-left:10px;padding:5px;"}).text("Graph");
						c.append(b);
						b.click(function(){
							if(!isDecimal($(input).val())){
								$("#form-item-cvalue-REP3-cvalue .form-label").addClass("txtErrorRed");
								$("#form-field-cvalue-REP3-cvalue-value").addClass("inputErrorRed");
							}else{
								renderGraphReport3CustomValue($("#form-field-dtype-REP3").val(),$(".msREP3").attr("value"), $("#form-field-cvalue-REP3-cvalue-value").val(),$("#REP3 > .graph"));
							}
						});
						
						var hfa = $("#"+reportObj.id+" .form").height();
						var hg = $("#"+reportObj.id+" .graph").height();
						if(hfa > hfb ){
							$("#"+reportObj.id+" .graph").height(hg - (hfa - hfb));
						}
						renderGraphReport(reportObj, $("#"+reportObj.id+" > .graph"));
						
					}else{
						if(!isDecimal($("#form-field-cvalue-REP3-cvalue-value").val())){
							$("#form-item-cvalue-REP3-cvalue .form-label").addClass("txtErrorRed");
							$("#form-field-cvalue-REP3-cvalue-value").addClass("inputErrorRed");
						}else{
							renderGraphReport3CustomValue($("#form-field-dtype-REP3").val(),$(".msREP3").attr("value"), $("#form-field-cvalue-REP3-cvalue-value").val(),$("#REP3 > .graph"));
						}
						
					}
					
				}else{
					var hfb = $("#"+reportObj.id+" .form").height();
					$("#form-field-cvalue-REP3").val("off");
					$("#form-item-cvalue-REP3-cvalue").remove();
					var hfa = $("#"+reportObj.id+" .form").height();
					var hg = $("#"+reportObj.id+" .graph").height();
					if(hfa < hfb ){
						$("#"+reportObj.id+" .graph").height(hg + (hfb - hfa));
					}
					renderGraphReport(reportObj, $("#"+reportObj.id+" > .graph"));
				}
			});
			
			
			
		}else if(reportObj.id == "REP4"){
			var hfb = $("#"+reportObj.id+" .form").height();
			var cc = $("<div>",{class:"form-item"});
			cc.append($("<div>",{class:"form-label"}).text("Filter"));
			var chekfilter = $("<input>",{type:"checkbox",id:"form-field-filter-REP4",value:"off",style:"vertical-align: middle;position: relative;bottom: 1px;"}).appendTo(cc);
			$("<div>",{class:"form-label"}).text("Reduction of LDL by 50% from baseline").appendTo(cc);
			$("#"+reportObj.id+" > .form").append(cc);
			
			var hfa = $("#"+reportObj.id+" .form").height();
			var hg = $("#"+reportObj.id+" .graph").height();
			if(hfa > hfb ){
				$("#"+reportObj.id+" .graph").height(hg - (hfa - hfb));
			}
			
			chekfilter.change(function(){
				if($("#form-field-filter-REP4").val() == "off"){
					$("#form-field-filter-REP4").val("on");
					renderGraphReport4CustomValue($("#form-field-dtype-REP4").val(),$(".msREP4").attr("value"), "sens", "value",$("#REP4 > .graph"));
				}else{
					$("#form-field-filter-REP4").val("off");
					renderGraphReport(reportObj, $("#"+reportObj.id+" > .graph"));
				}
			});
		}
		
	}else{
		$("#"+reportObj.id+" > .form").hide();
		if(reportObj.class == "half"){
			$("#"+reportObj.id+" > .graph").height($("#"+reportObj.id+" > .graph").height() + 40);
		}else if(reportObj.class == "full"){
			$("#"+reportObj.id+" > .graph").css("width","100%");
		}
	}
	
	renderGraphReport(reportObj, $("#"+reportObj.id+" > .graph"));
}

function renderGraphReport(reportObj, divObj){
	if($.type(reportObj.data) === "object"){
		var obset = [];
		for(var i=0;i<reportObj.subcriteria.length;i++){
			if(obset.length == 0 ) {
				obset = reportObj;
			}
			
			var iname = reportObj.subcriteria[i].subname;
			var ival = reportObj.subcriteria[i].subvalue;
			if(ival.indexOf("_") >= 0){
				var parts = ival.split("_");
				var obsett = obset;
				var obs = [];
				for(var j=0;j<parts.length;j++){
					ival = parts[j];
					obset = getObjects(obsett,iname,ival);
					obs.push(obset);
				}
				obset = obs;
			}else{
				obset = getObjects(obset,iname,ival);
			}
		} 
		var ds = null;
		var r = [];
		for(var k=0;k<obset.length;k++){
			ds = obset[k];
			r.push(ds.set);
		}

		var set = obset[0];
		var obj ={};
		obj["objs"] = [{"dataset":r,"header":reportObj.data.header}];
		
		drawGraphReport(obj,reportObj,divObj);
	}else{
		$.ajax({
		    url: "/ncdis/service/action/executeReport?language=en&idreport="+reportObj.id+"&owner="+reportObj.owner+"&type="+reportObj.type+"&graphtype="+reportObj.graphtype+"&subcriteriatype="+reportObj.subcriteriatype,
		    type: 'POST',
		    data:JSON.stringify(reportObj),
		    contentType: 'application/json; charset=utf-8',
		    dataType: 'json',
		    async: true,
		    success: function(data){
		    	var rob = reportObj;
		    	var dob = divObj;
		    	drawGraphReport(data,rob,dob);
		    }
		});
	}
}

function renderGraphReport3CustomValue(dtype, idcommunity, customValue, divObj){
	$.ajax({
	    url: "/ncdis/service/action/executeReport3CustomValue?language=en&cvalue="+customValue+"&idcommunity="+idcommunity+"&dtype="+dtype,
	    type: 'GET',
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    async: true,
	    success: function(data){
	    	var rob = {"graphtype":"pie","subcriteria":[],"id":"REP3"};
	    	var dob = divObj;
	    	drawGraphReport(data,rob,dob);
	    }
	});
}

function renderGraphReport4CustomValue(dtype, idcommunity, sens, pvalue, divObj){
	$.ajax({
	    url: "/ncdis/service/action/executeReport4CustomValue?language=en&sens="+sens+"&pvalue="+pvalue+"&idcommunity="+idcommunity+"&dtype="+dtype,
	    type: 'GET',
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    async: true,
	    success: function(data){
	    	var rob = {"graphtype":"pie","subcriteria":[],"id":"REP4"};
	    	var dob = divObj;
	    	drawGraphReport(data,rob,dob);
	    }
	});
}

function drawGraphReport(msg,reportObj, divObj) {
    dataset = msg.objs[0];

    if($.type(dataset) === "object"){
		var ds = dataset.dataset;
		var dh = dataset.header;
		var labels = [];
		var datalabels = [];
		var multiSerie = false;
		if(ds.length > 1)multiSerie = true;
		
		if(ds.length > 0){
			if($.type(ds[0]) != "array"){ds = [ds];}
			$(divObj).empty();
			var series = [];
			var totals = [];
			var total = 0;
			
			for(var x=0;x<ds.length;x++){
				var tt = 0;
				for(var j=0;j<dh.length;j++){
					total += Number(ds[x][j]);
					tt += Number(ds[x][j]);
				}
				totals.push(tt);
			}
			
			var graphOptions=null;
			var axes = null;
			
			if(reportObj.graphtype == "bar"){
				//add to series the percentage 
				var getPercentage = false;
				var pmax = 0;
				if(reportObj.id == "REP3" || reportObj.id == "REP2" || reportObj.id == "REP6"){
					getPercentage = true;
				}
				
				if(reportObj.subcriteria.length > 0 ){
					if(reportObj.subcriteriatype == "single"){
						for(var k=0;k<reportObj.subcriteria.length;k++){
							var s = [];
							for(var kk=0;kk<dh.length;kk++){
								var serie = [dh[kk], Number(ds[k][kk]) ];
								s.push(serie);
							}
							series.push(s);
						}
					}else{
						for(var x=0;x<ds.length;x++){
							var labelp = [];
							if(getPercentage){
								var pserie = [];
								var nserie = [];
								for(var i=0;i<dh.length;i++){
									var p = Number(100*Number(ds[x][i])/totals[x]).toFixed(2);
									pmax = Math.max(pmax,Number(ds[x][i]));
									pserie.push([dh[i], p]);
									nserie.push([dh[i], Number(ds[x][i])]);
									labelp.push("<b>"+Number(ds[x][i])+" individuals </b><br/>"+p+"%");
								}
								//series.push(nserie);
								series.push(pserie);
								var o = $(".ms"+reportObj.id+" .grvmselect-bar .grvmselect-item-container");
								var lselect = $(o[x]).find(".grvmselect-item-label").text();
								labels.push(lselect);
								//labels.push("Percentage "+lselect);
							}else{
								var nserie = [];
								for(var i=0;i<dh.length;i++){
									nserie.push([dh[i], Number(ds[x][i])]);
								}
								series.push(nseries);
							}
							datalabels.push(labelp);
						}
					}
				}else{
					for(var i=0;i<dh.length;i++){
						var serie = [dh[i], Number(ds[0][i]) ];
						series.push(serie);
					}
					series = [series];
				}
				
				graphOptions = {
						grid:{background:'transparent',drawBorder:false,shadow:false,borderWidth: 1},
						seriesColors:['#9ddb86','#00749F', '#C7754C', '#17BDB8','#85802b','#7ca1d9', '#73C774', '#00749F'],
						seriesDefaults:{renderer:$.jqplot.BarRenderer,pointLabels: { show: true },rendererOptions: {varyBarColor: true}},
				        axes:{xaxis:{renderer: $.jqplot.CategoryAxisRenderer}}
				    };
				
				if(getPercentage && series.length == 1){
					//var ymax = Math.round(pmax+Number(pmax*0.2));
					var ymax = 100;
					graphOptions = {
							grid:{background:'transparent',drawBorder:false,shadow:false,borderWidth: 1},
							seriesColors:['#9ddb86','#00749F', '#C7754C', '#17BDB8','#85802b','#7ca1d9', '#73C774', '#00749F'],
							series:[
							        {renderer:$.jqplot.BarRenderer,
							        	pointLabels: { 
							        		show: true , 
							        		location:'n',
							        		escapeHTML:false,
							        		labels:datalabels[0]
							        		}
							        ,rendererOptions: {varyBarColor: true,highlightMouseDown: false,highlightMouseOver: false}}
							        
							],
					        axes:{
					            xaxis:{renderer: $.jqplot.CategoryAxisRenderer},
					            //yaxis:{label: 'No patients',max:ymax,labelRenderer: $.jqplot.CanvasAxisLabelRenderer,tickOptions: { formatString: "%'d" }}
					            yaxis:{label: '% patients',max:ymax,labelRenderer: $.jqplot.CanvasAxisLabelRenderer,tickOptions: { formatString: "%'d" }}
					        }
					    };
				}else if(getPercentage && series.length == 2){
					//var ymax = Math.round(pmax+Number(pmax*0.2));
					var ymax = 100;
					graphOptions = {
							grid:{background:'transparent',drawBorder:false,shadow:false,borderWidth: 1},
							seriesColors:['#9ddb86','#00749F', '#C7754C', '#17BDB8','#85802b','#7ca1d9', '#73C774', '#00749F'],
							series:[
							        {renderer:$.jqplot.BarRenderer,pointLabels: { show: true ,escapeHTML:false, location:'n',labels:datalabels[0]},rendererOptions: {varyBarColor: false,highlightMouseDown: false,highlightMouseOver: false},yaxis:'yaxis',
							        	seriesColors:['#9ddb86','#00749F', '#C7754C', '#17BDB8','#85802b','#7ca1d9', '#73C774', '#00749F']
							        },
							        {renderer:$.jqplot.BarRenderer,pointLabels: { show: true ,escapeHTML:false, location:'n',labels:datalabels[1]},rendererOptions: {varyBarColor: false,highlightMouseDown: false,highlightMouseOver: false},yaxis:'yaxis',
							        	seriesColors:['#9ddb86','#00749F', '#C7754C', '#17BDB8','#85802b','#7ca1d9', '#73C774', '#00749F']
							        }
							        
							],
							legend: {
						    	renderer: $.jqplot.EnhancedLegendRenderer,
						    	labels : labels,
						        show: true,
						        location:'s',
						        border : 'none',
						        placement: 'outsideGrid',
						        fontSize:'0.6vw',
						        rowSpacing:'0.7em',
						        background:'transparent',
						        marginRight:'5px',
						        rendererOptions: {
						            numberRows: 1,
						            numberColumns: 4,
						        }
						       },
					        axes:{
					            xaxis:{renderer: $.jqplot.CategoryAxisRenderer},
					            //yaxis:{label: 'No patients',max:ymax,labelRenderer: $.jqplot.CanvasAxisLabelRenderer,tickOptions: { formatString: "%'d" }}
					            yaxis:{label: '% patients',max:ymax,labelRenderer: $.jqplot.CanvasAxisLabelRenderer,tickOptions: { formatString: "%'d" }}
						        
					        }
					    };
				}
				
			}else if(reportObj.graphtype == "pie"){
				if(ds.length > 1){
					
					var labels = [];
					for(var i=0;i<dh.length;i++){
						labels.push(dh[i]);
					}
					
					for(var x=0;x<ds.length;x++){
						var s = []; 
						var o = $(".ms"+reportObj.id+" .grvmselect-bar .grvmselect-item-container");
						var lselect = $(o[x]).find(".grvmselect-item-label").text();
						for(var i=0;i<dh.length;i++){
							var serie = [dh[i]+" "+lselect+" "+Number(((Number(ds[x][i])*100)/totals[x]).toFixed(2))+"% ["+ds[x][i]+"]",  Number(((Number(ds[x][i])*100)/totals[x]).toFixed(2))  ];
							labels[i] = labels[i] +" "+ lselect + ":[<b> "+ds[x][i]+" "+Number(((Number(ds[x][i])*100)/totals[x]).toFixed(2))+"% </b>] "
							s.push(serie);
						}
						series.push(s);
					}
					graphOptions = {
							grid:{background:'transparent',drawBorder:false,shadow:false,borderWidth: 1},
							seriesColors:['#9ddb86','#00749F', '#C7754C', '#17BDB8','#85802b','#7ca1d9', '#73C774', '#fa756b'],
							gridPadding: {top:0, bottom:0, left:0, right:0},
							seriesDefaults: {
							      // make this a donut chart.
							      renderer:$.jqplot.DonutRenderer,
							      rendererOptions:{
							        // Donut's can be cut into slices like pies.
							        sliceMargin: 3,
							        // Pies and donuts can start at any arbitrary angle.
							        startAngle: -90,
							        showDataLabels: true,
							        // By default, data labels show the percentage of the donut/pie.
							        // You can show the data 'value' or data 'label' instead.
							        dataLabels: 'value',
							        dataLabelFormatString : "%'d%"
							      }
							},
							legend:{show:true,placement: 'inside',location:'e',labels:labels}
					};
					
				}else{
					graphOptions = {
							grid:{background:'transparent',drawBorder:false,shadow:false,borderWidth: 1},
							seriesColors:['#9ddb86','#00749F', '#C7754C', '#17BDB8','#85802b','#7ca1d9', '#73C774', '#fa756b'],
							gridPadding: {top:0, bottom:0, left:0, right:0},
							seriesDefaults:{renderer:$.jqplot.PieRenderer,trendline:{ show:true },rendererOptions: { padding: 4, sliceMargin: 2, showDataLabels: true }},
							legend:{show:true,placement: 'inside',location:'e'}       				
					};
					for(var i=0;i<dh.length;i++){
						var serie = [dh[i]+" "+Number(((Number(ds[0][i])*100)/total).toFixed(2))+"% ["+ds[0][i]+"]",  Number(((Number(ds[0][i])*100)/total).toFixed(2))  ];
						series.push(serie);
					}
					series = [series];
				}
				
			
			}else if(reportObj.graphtype == "line"){
				if(reportObj.subcriteria.length > 0 ){
					if(reportObj.subcriteriatype == "single"){
						for(var k=0;k<reportObj.subcriteria.length;k++){
							var s = [];
							for(var kk=0;kk<dh.length;kk++){
								var serie = [dh[kk], Number(ds[k][kk]) ];
								s.push(serie);
							}
							series.push(s);
						}
					}else{
						for(var i=0;i<dh.length;i++){
							var serie = [dh[i], Number(ds[0][i]) ];
							series.push(serie);
						}
						series = [series];
					}
				}else{
					for(var i=0;i<dh.length;i++){
						var serie = [dh[i], Number(ds[0][i]) ];
						series.push(serie);
					}
					series = [series];
				}
				graphOptions = {
						 grid:{
							 background:'transparent',
							 drawBorder:false,
							 shadow:false,
							 borderWidth: 1 
						},
					      axesDefaults: {
					    	  renderer: $.jqplot.CategoryAxisRenderer,
				             labelRenderer: $.jqplot.CanvasAxisLabelRenderer
					      },
					      seriesDefaults: {
					          rendererOptions: {
					              smooth: true
					          }
					      }
					    };
			}
			
			var plot = jQuery.jqplot($(divObj).attr("id"),series, graphOptions);
			$(divObj).bind('jqplotDataHighlight', function(ev, seriesIndex, pointIndex, series) {
		        var idx = pointIndex;
		        $(divObj).find('tr.jqplot-table-legend').removeClass('legend-row-highlighted');  
		        $(divObj).find('tr.jqplot-table-legend').children('.jqplot-table-legend-label').removeClass('legend-text-highlighted');
		        $(divObj).find('tr.jqplot-table-legend').eq(idx).addClass('legend-row-highlighted');
		        $(divObj).find('tr.jqplot-table-legend').eq(idx).children('.jqplot-table-legend-label').addClass('legend-text-highlighted');
		    });
		 
			$(divObj).bind('jqplotDataUnhighlight', function(ev, seriesIndex, pointIndex, series) {
				$(divObj).find('tr.jqplot-table-legend').removeClass('legend-row-highlighted');  
				$(divObj).find('tr.jqplot-table-legend').children('.jqplot-table-legend-label').removeClass('legend-text-highlighted');
		    });
		}else{
			$("#"+reportObj.id).hide();
		}
	}
    $("#"+reportObj.id+" > .graph").find(".loading-span").remove();
}

function getDashboardReports(sid){
	var result = null;
	
	var reps = $.ajax({
		  url: "/ncdis/service/action/getReports?sid="+sid+"&language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		reps.done(function( json ) {
			result = json.objs[0];
			
		});
		reps.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}