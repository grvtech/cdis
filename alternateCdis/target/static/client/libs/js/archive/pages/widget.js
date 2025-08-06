
function buildWidget(valueName,valueArray,container){
	container.empty();
	
	var type = eval('type_'+valueName);
	var values = [];
	
	if(valueName.indexOf('_and_') >= 0){
		//special treatement
		values = valueName.split('_and_');
	}else{
		values = [valueName];
	}
	
	if(type == 'graph'){
		createGraphWidget(values,valueArray,container);
	}else if(type == 'table'){
		createTableWidget(values,valueArray,container);
	}else if(type == 'single'){
		createSingleWidget(values,valueArray,container);
	}
		
}


function createGraphWidget(values,arrays,container){
	//build 
	
	if (values.length == 1){
		value = values[0];
		labelLabelValue = eval('label_'+value);
		labelDate = eval('label_'+value+'_collected_date');
		labelID = value;
		if( typeof(arrays[0][0].unit) != 'undefined'){
			labelValue = arrays[0][0].unit;
		}else{
			labelValue = labellabelValue;
		}
		var limitsObj = getValueLimits(value);
		var limitss = [limitsObj];
	}else if(values.length == 2){
		v1 = values[0];
		v2 = values[1];
		labelLabelValue = eval('label_'+v1+'_and_'+v2);
		labelDate = eval('label_'+v1+'_and_'+v2+'_collected_date');
		labelID = v1+'_and_'+v2;
		if( typeof(arrays[0][0].unit) != 'undefined'){
			labelValue = arrays[0][0].unit;
		}else{
			labelValue = labellabelValue;
		}
		var limitsObj1 = getValueLimits(v1);
		var limitsObj2 = getValueLimits(v2);
		var limitss = [limitsObj1,limitsObj2];
	}
	
	var gc = $("<div>",{class:"graph-widget uss"}).appendTo(container);
	
	var gch = $("<div>",{class:"widget-header row"}).appendTo(gc);
	var gcht = $("<div>",{class:"widget-title col-sm-5"}).appendTo(gch).text(labelLabelValue+ " ("+eval('unit_'+value)+")");
	var gchm = $("<div>",{class:"widget-menu col-sm-7"}).appendTo(gch);
	var gcb = $("<div>",{class:"widget-body"}).appendTo(gc);
	var mt = $("<div>",{id:"tab-"+labelID,class:"cisbutton",'data-toggle':"tooltip",title:"Open data table"}).appendTo(gchm).append($("<i>",{class:"fa fa-table",ariaHidden:"true"}));
	var ma = $("<div>",{id:"add-"+labelID,class:"cisbutton",'data-toggle':"tooltip",title:"Add new data"}).appendTo(gchm).append($("<i>",{class:"fa fa-plus",ariaHidden:"true"}));
	var mh = $("<div>",{id:"history-"+labelID,class:"cisbutton",'data-toggle':"tooltip",title:"Open history graph"}).appendTo(gchm).append($("<i>",{class:"fa fa-history",ariaHidden:"true"}));
	var mp = $("<div>",{id:"print-"+labelID,class:"cisbutton",'data-toggle':"tooltip",title:"Print graph"}).appendTo(gchm).append($("<i>",{class:"fa fa-print",ariaHidden:"true"}));
	
	$("<div>",{class:"widget-graph",id:"graph-"+value}).appendTo(gcb);
	plotGraph(value,arrays[0],limitss[0]);
	
	var gctb = $("<div>",{class:"uss widget-table container",id:"table-"+value}).appendTo(gcb);
	var gctbh =  $("<div>",{class:"widget-table-header row"}).appendTo(gctb);
	$("<div>",{class:"col-sm-6"}).appendTo(gctbh).text(labelValue);
	$("<div>",{class:"col-sm-4"}).appendTo(gctbh).text(labelDate);
	$("<div>",{class:"col-sm-2"}).appendTo(gctbh).append($("<i>",{class:"fa fa-close",ariaHidden:"true"})).click(function(){toggleTable(gctb);});
	var gctbb = $("<div>",{class:"widget-table-body container"}).appendTo(gctb);
	
	buildTable(arrays,gctb,limitss);
	$("#tab-"+labelID).click(function(){
		if(!gctb.is(":visible")){
			toggleTable(gctb);	
		}
	});
	$("#add-"+labelID).click(function(){
		if(isDemo){
			alert("This function si not available in demo mode");
		}else{
			if(!gctb.is(":visible")){
				toggleTable(gctb);	
			}
			openTableForm("","",'0',gctb,arrays[0][0].vtype);
		}
	});
	
	$("#history-"+labelID).click(function(){plotGraphHistory(values,arrays,limitss);});
	$("#print-"+labelID).click(function(){$("#graph-"+values).parent().printJQPlot(values);});
}


function createTableWidget(values,arrays,container){
	//build 
	console.log(values)
	console.log(arrays)
	
	if (values.length == 1){
		value = values[0];
		labelLabelValue = eval('label_'+value);
		
		labelValue = eval("unit_"+value);
		labelDate = eval('label_'+value+'_collected_date');
		labelID = value;
		var limitsObj = getValueLimits(value);
		var limitss = [limitsObj];
	}else if(values.length == 2){
		v1 = values[0];
		v2 = values[1];
		labelValue = eval("unit_"+v1+"_and_"+v2);
		labelLabelValue = eval('label_'+v1+'_and_'+v2);
		labelDate = eval('label_'+v1+'_and_'+v2+'_collected_date');
		labelID = v1+'_and_'+v2;
		var limitsObj1 = getValueLimits(v1);
		var limitsObj2 = getValueLimits(v2);
		var limitss = [limitsObj1,limitsObj2];
	}
	
	var gc = $("<div>",{class:"table-widget uss"}).appendTo(container);
	var gch = $("<div>",{class:"widget-header"}).appendTo(gc);
	var gcht = $("<div>",{class:"widget-title"}).appendTo(gch).text(labelLabelValue);
	var gchm = $("<div>",{class:"widget-menu"}).appendTo(gch);
	
	
	var ma = $("<div>",{class:"cisbutton",'data-toggle':"tooltip",title:"Add new data"}).appendTo(gchm).append($("<i>",{class:"fa fa-plus",ariaHidden:"true"}));
	var mh = $("<div>",{class:"cisbutton",'data-toggle':"tooltip",title:"Open history graph"}).appendTo(gchm).append($("<i>",{class:"fa fa-history",ariaHidden:"true"}));
	var mp = $("<div>",{class:"cisbutton",'data-toggle':"tooltip",title:"Print graph"}).appendTo(gchm).append($("<i>",{class:"fa fa-print",ariaHidden:"true"}));
	
	var gcb = $("<div>",{class:"widget-body"}).appendTo(gc);
	
	var gctb = $("<div>",{class:"widget-table container",id:"table-"+labelID}).appendTo(gcb);
	
	
	var gctbh =  $("<div>",{class:"widget-table-header row"}).appendTo(gctb);
	$("<div>",{class:"col-sm-6"}).appendTo(gctbh).text(labelValue);
	$("<div>",{class:"col-sm-6"}).appendTo(gctbh).text(labelDate);
	
	var gctbb = $("<div>",{class:"widget-table-body container"}).appendTo(gctb);
	
	buildTable(arrays,gctb,limitss);
	
	ma.click(function(){
		if(isDemo){
			alert("This function si not available in demo mode");
		}else{
			if(!gctb.is(":visible")){
				toggleTable(gctb);	
			}
			if(values.length == 2){
				openTableForm("","",'0-0',gctb,arrays[0][0].vtype);
			}else{
				openTableForm("","",'0',gctb,arrays[0][0].vtype);
			}
		}
		
		
	});
	
	mh.click({labelid:labelID,dataarray:arrays,datalimits:limitss},function(event){
		plotGraphHistory(event.data.labelid,event.data.dataarray,event.data.datalimits);
	});
	mp.click({labelid:labelID,dataarray:arrays,datalimits:limitss},function(event){
		plotGraphHistoryForPrint(event.data.labelid,event.data.dataarray,event.data.datalimits);
		$("#fullscreen-print").printJQPlot("");
		$("#fullscreen-print").remove();
	});
}



function createSingleWidget(values,arrays,container){
	var valueArray = [];
	if (values.length == 1){
		value = values[0];
		
		labelLabelValue = eval('label_'+value);
		if( typeof(arrays[0][0].unit) != 'undefined' && arrays[0][0].unit != null){
			labelValue = arrays[0][0].unit;
		}else{
			labelValue = labelLabelValue;
		}
		labelDate = eval('label_'+value+'_collected_date');
		labelID = value;
		var limitsObj = getValueLimits(value);
		var limitss = [limitsObj];
		tarrays = arrays[0][0];
		valueArray[0] = [tarrays];
		
	}else if(values.length == 2){
		v1 = values[0];
		v2 = values[1];
		labelLabelValue = eval('label_'+v1+'_and_'+v2);
		labelDate = eval('label_'+v1+'_and_'+v2+'_collected_date');
		labelID = v1+'_and_'+v2;
		if( typeof(arrays[0][0].unit) != 'undefined'){
			labelValue = arrays[0][0].unit;
		}else{
			labelValue = labelLabelValue;
		}
		var limitsObj1 = getValueLimits(v1);
		var limitsObj2 = getValueLimits(v2);
		var limitss = [limitsObj1,limitsObj2];
		tarrays1 = arrays[0][0];
		tarrays2 = arrays[1][0];
		valueArray[0] = [tarrays1,tarrays2];
	}
	
	var gc = $("<div>",{class:"single-widget uss"}).appendTo(container);
	var gch = $("<div>",{class:"widget-header row"}).appendTo(gc);
	var gcht = $("<div>",{class:"widget-title col-sm-10"}).appendTo(gch).text(labelLabelValue);
	var gchm = $("<div>",{class:"widget-menu col-sm-2"}).appendTo(gch);
	
	
	var ma = $("<div>",{class:"cisbutton"}).appendTo(gchm).append($("<i>",{class:"fa fa-plus",ariaHidden:"true"}));
	
	
	var gcb = $("<div>",{class:"widget-body"}).appendTo(gc);
	var gctb = $("<div>",{class:"widget-table container",id:"table-"+value}).appendTo(gcb);
	var gctbh =  $("<div>",{class:"widget-table-header row"}).appendTo(gctb);
	$("<div>",{class:"col-sm-6"}).appendTo(gctbh).text("");
	$("<div>",{class:"col-sm-6"}).appendTo(gctbh).text(labelDate);
	
	var gctbb = $("<div>",{class:"widget-table-body container"}).appendTo(gctb);
	
	buildTable(valueArray,gctb,limitss);
	
	ma.click(function(){
		if(isDemo){
			alert("This function si not available in demo mode");
		}else{
			openTableForm("","",'0',gctb,valueArray[0][0].vtype);
		}
	});
	
}





function toggleTable(table){
	table.toggle('slide');
	closeTableForm(table);
}



function buildTable(arrays,container,limitss){
	var cb = container.find('.widget-table-body');
	cb.empty();
	var isEmpty = false;
	
	if(arrays.length == 1 ){
		var arr = arrays[0];
		var limits = limitss[0];
		
		$.each(arr,function(index,value){
			
			
			if(value != null && value.value != null && value.idvalue!='0'){
				if(index == 0){
					var line = $("<div>",{class:"widget-table-line first-line row line-"+(index%2),id:value.idvalue}).appendTo(cb);
				}else{
					var line = $("<div>",{class:"widget-table-line row line-"+(index%2),id:value.idvalue}).appendTo(cb);	
				}
				line.click(function(){
					if(isDemo){
						alert("This function si not available in demo mode");
					}else{
						var target = $(event.target);
						if(!target.is("i")){
							var id = $(this).attr("id");
							if(typeof(id) != "undefined"){
								var val = $(this).find(".col-sm-5 span").text();
								var dat = $(this).find(".col-sm-7").text();
								openTableForm(val,dat,id, container,value.vtype);
							}else{
								alert("undefined");
							}
						}
					}
				});
				var valClass = '';
				/*
				if(limits != null){
					if(typeof(limits.maxvalue) != 'undefined'){
						var maxV = Number(limits.maxvalue);
						var valV = Number(value.value);
						if(maxV > valV){
							valClass = 'normalValue';
						}else if(maxV < valV){
							valClass = 'criticValue';
						}
					}else if(typeof(limits.minvalue) != 'undefined'){
						var minV = Number(limits.minvalue);
						var valV = Number(value.value);
						if(minV < valV){
							valClass = 'normalValue';
						}else if(minV > valV){
							valClass = 'criticValue';
						}
					}
				}
				*/
				var vv = value.value;
				if(typeof(window[value.code+"_values"]) != 'undefined'){
					var vvObj = eval(value.code+"_values");
					vv = vvObj[value.value];
				}
				if(isDecimal(Number(vv))){vv = Number(vv).toFixed(3);}
				if(value.vtype == "date"){
					line.append($("<div>",{class:"col-sm-5"}).append($("<span>",{class:valClass}).text("")));
				}else{
					line.append($("<div>",{class:"col-sm-5"}).append($("<span>",{class:valClass}).text(vv)));
				}
				line.append($("<div>",{class:"col-sm-7"}).text(value.date));
				line.append($("<div>",{class:"delete-inline",id:"delete-"+value.code+"-"+value.idvalue}).html("<i class='fa fa-trash' aria-hidden='true'></i>"));
				
				$("#delete-"+value.code+"-"+value.idvalue).click(function(){
					if(isDemo){
						alert("This function si not available in demo mode");
					}else{
						var target = $(event.target);
						if(target.is("i")){
							var $d = $("<div>",{id:"dialog-confirm",title:"Delete value"}).appendTo($("body"));
							var $p = $("<p>").text("This value will be permanently deleted. Are you sure ?").appendTo($d); 
							$d.dialog({
							      resizable: false,
							      height: "auto",
							      width: 400,
							      modal: true,
							      buttons: {
							        "Delete value": function() {
							        	deleteValue(value.idvalue,patientObjArray);
										$("#"+value.idvalue).remove();
										$( this ).dialog( "close" );
								        $(this.remove());
							        },
							        Cancel: function() {
							          $( this ).dialog( "close" );
							          $(this.remove());
							        }
							      }
							    });
						}
					}
				});
			}else{
				isEmpty = true;
			}
		});
	}else if(arrays.length == 2){
		
		var prime = arrays[0];  //this should be sbp
		var second =arrays[1];
		var limitsPrime = limitss[0];
		var limitsSecond = limitss[1];
		//prime should be systolic bp 
		$.each(prime,function(index,value){
			
			if(value != null && value.value != null && value.idvalue!='0'){
				var date = value.date;
				var eObj = 0;
				$.each(second,function(ii,vv){
					if(vv.date == date){
						eObj = vv;
					}
				});
				if(eObj == 0){
					eObj = {idvalue:'0',value:'0',date:''};
				}
				if(index == 0){
					var line = $("<div>",{class:"widget-table-line first-line row line-"+(index%2),id:value.idvalue+"-"+eObj.idvalue}).appendTo(cb);
				}else{
					var line = $("<div>",{class:"widget-table-line row line-"+(index%2),id:value.idvalue+"-"+eObj.idvalue}).appendTo(cb);	
				}
				
				line.click(function(){
					if(isDemo){
						alert("This function si not available in demo mode");
					}else{
						var id = $(this).attr("id");
						if(typeof(id) != "undefined"){
							var val = $(this).find(".col-sm-5 span").text();
							var dat = $(this).find(".col-sm-7").text();
							openTableForm(val,dat,id, container,value.vtype);
						}else{
							alert("undefined");
						}
					}
				});
				
				var valClass1 = 'genericValue';
				var valClass2 = 'genericValue';
				/*2018-09-13 Show only critic values in red*/
				if(typeof(limitsPrime.maxvalue) != 'undefined'){
					
					var maxV = Number(limitsPrime.maxvalue);
					var valV = Number(value.value);
					if(maxV >= valV){
						valClass1 = 'normalValue';
						valClass1 = 'genericValue';
					}else if(maxV <= valV){
						valClass1 = 'criticValue';
					}
				}else if(typeof(limitsPrime.minvalue) != 'undefined'){
					var minV = Number(limitsPrime.minvalue);
					var valV = Number(value.value);
					if(minV < valV){
						valClass1 = 'normalValue';
						valClass1 = 'genericValue';
					}else if(minV > valV){
						valClass1 = 'criticValue';
					}
				}
				
				if(typeof(limitsSecond.maxvalue) != 'undefined'){
					var maxV1 = Number(limitsSecond.maxvalue);
					var valV1 = Number(eObj.value);
					if(maxV1 >= valV1){
						valClass2 = 'normalValue';
						valClass2 = 'genericValue';
					}else if(maxV1 < valV1){
						valClass2 = 'criticValue';
					}
				}else if(typeof(limitsSecond.minvalue) != 'undefined'){
					var minV2 = Number(limitsSecond.minvalue);
					var valV2 = Number(eObj.value);
					if(minV2 <= valV2){
						valClass2 = 'normalValue';
						valClass2 = 'genericValue';
					}else if(minV2 > valV2){
						valClass2 = 'criticValue';
					}
				}
				/**/
				line.append($("<div>",{class:"col-sm-5"}).append($("<span>",{class:valClass1}).text(value.value)).append($("<span>",{class:"separator"}).html("/")).append($("<span>",{class:valClass2}).text(eObj.value)));
				line.append($("<div>",{class:"col-sm-7"}).text(value.date));
			}else{
				isEmpty = true;
			}
		});
	}
	if(isEmpty){
		container.html("<p>There is no data recorded.<br>Please use <span class='cisbutton'><i class='fa fa-plus' aria-hidden='true'></i></span> button to add new data.</p>");
	}
}


function openTableForm(value,date,idline,container,dataType){
	//dataType = int|double|radio|date
	//valueType = single|table|graph
	var cid = container.attr('id');
	var cp = cid.split('-');
	var valueName = cp[1];
	var valueType = eval('type_'+valueName);
	var valueId='0';
	var isDouble = false;
	
	if(idline == null){ idline = "0";}
	
	if( idline.indexOf("-") >=0 ){
		//this is double value
		idDouble = true;
		valueId = idline;
	}else{
		valueId = idline;
	}
	
	var vObj = {'id':idline,'date':date,'value':value};
	if(valueType == 'single'){
		//the container should be all widget
		var c = container.parent().parent();
		closeTableForm(c);
		c.append($("<div>",{class:"widget-table-body-modal"}));
		var form = $("<div>",{class:"widget-table-body-form"}).appendTo(c);
		createFormWidget(valueName, dataType, form, vObj);
		container.find(".widget-table-body").css("overflow-y","hidden");
	}else{
		closeTableForm(container);
		container.append($("<div>",{class:"widget-table-body-modal"}));
		var form = $("<div>",{class:"widget-table-body-form"}).appendTo(container);
		createFormWidget(valueName, dataType, form, vObj);
		container.find(".widget-table-body").css("overflow-y","hidden");
	}
	
}

function closeTableForm(container){
	container.find(".widget-table-body-modal").remove();
	container.find(".widget-table-body-form").remove();
	container.find(".widget-table-body").css("overflow-y","auto");
}


function plotGraph(valueName, valueArray, valueLimitsObj){
	var values = [];
	var labels = [];
	$(valueArray).each(function( index ) {
		var ob = $(this)[0];
		if(ob.value != "" && ob.value!=null){
			values.push(ob.value);
		}
		if(ob.date != "" && ob.date!=null){
			labels.push(ob.date);
		}
	});
	if(values.length > 0 ){
		var vv  = eval("label_"+valueName);
		var gtitle = "Evolution of "+vv+" in time";
		loadGraph("graph-"+valueName,values,labels,gtitle,valueLimitsObj, valueName);
	}else{
		$("#graph-"+valueName).html("<p style='text-align:center;padding-top:20px;'>There is no data recorded for "+valueName.toUpperCase()+".<br> Please use <span class='cisbutton'><i class='fa fa-plus' hidden-area='true'/></span> button to add new data.</p>");
	}
}


function plotGraphHistory(valueName, valueArray, valueLimitsObj){
	
	var label = eval("label_"+valueName);
	var $w = $("#grvWraper");
	var wmd = $("<div>", {id:"fullscreen",class:"uss widget-fullscreen-modal"});
	$w.scrollTop();
	$w.css("overflow","hidden");
	var wmdHeader = $("<div>", {id:"fullscreen-header",class:"widget-fullscreen-header"}).html('<i class="fa fa-times"></i>').appendTo(wmd);
	var wmdTool = $("<div>", {id:"fullscreen-tool",class:"widget-fullscreen-tool"});
	wmdTool.append($("<div>",{class:"cisbutton"}).text("Close").click(function(){$("#fullscreen").remove();$("#wraper").css("overflow","auto");}));
	wmdTool.append($("<div>",{class:"cisbutton",id:"fullscreen-graph-zoomreset"}).text("Reset Zoom"));
	wmdTool.append($("<div>",{class:"cisbutton",id:"fullscreen-graph-print"}).text("Print Graph").click(function(){
		printHistoryGraph("Print all data history graph for "+label);
	}));
	wmdTool.append($("<div>",{style:"position:relative;padding:10px;font-family:Arial;color:#4d4d4d;font-size:80%;"}).text("Select area in graph to zoom in."));
	wmdTool.appendTo(wmd);
	var wmdBody = $("<div>", {id:"fullscreen-body",class:"widget-fullscreen-body"}).appendTo(wmd);
	wmd.appendTo($w);
	if(valueArray.length == 2){
		var wmdGraph1 = $("<div>", {id:"fullscreen-graph1",class:"widget-fullscreen-graph-half"}).appendTo(wmdBody);
		var wmdGraph2 = $("<div>", {id:"fullscreen-graph2",class:"widget-fullscreen-graph-half"}).appendTo(wmdBody);
		var vs = valueName.split("_and_");
		var values1 = [];
		var labels1 = [];
		$(valueArray[0]).each(function( index ) {
			var ob = $(this)[0];
			values1.push(ob.value);
			labels1.push(ob.date);
		});
		
		var values2 = [];
		var labels2 = [];
		$(valueArray[1]).each(function( index ) {
			var ob = $(this)[0];
			values2.push(ob.value);
			labels2.push(ob.date);
		});
		
		var gtitle1 = "Evolution of "+vs[0]+" in time";
		var gtitle2 = "Evolution of "+vs[1]+" in time";
		
		
		loadGraphAllValues("fullscreen-graph1",values1,labels1,gtitle1,valueLimitsObj[0],vs[0]);
		loadGraphAllValues("fullscreen-graph2",values2,labels2,gtitle2,valueLimitsObj[1],vs[1]);
		$("#fullscreen-graph-zoomreset").hide();
	}else{
		
		var wmdGraph = $("<div>", {id:"fullscreen-graph",class:"widget-fullscreen-graph"}).appendTo(wmdBody);
		
		var values = [];
		var labels = [];
		
		
		$.each(valueArray[0], function( i , ob) {
			//var ob = $(this)[0];
			
			
			values.push(ob.value);
			labels.push(ob.date);
		});
		
		var gtitle = "Evolution of "+label+" in time";
		loadGraphAllValues("fullscreen-graph",values,labels,gtitle,valueLimitsObj[0],valueName);

	}
	
	$("#fullscreen-header .fa-times").click(function(){
		$("#fullscreen").remove();
		$("#wraper").css("overflow","auto");
	});
}

function plotGraphHistoryForPrint(valueName, valueArray, valueLimitsObj){
	var label = eval("label_"+valueName);
	var $w = $("#wraper");
	$("#fullscreen-print").remove();
	var wmd = $("<div>", {id:"fullscreen-print",class:"uss widget-fullscreen-print"});
	$w.scrollTop();
	//$w.css("overflow","hidden");
	var wmdBody = $("<div>", {id:"fullscreen-body-print",class:"widget-fullscreen-body-print"}).appendTo(wmd);
	wmd.appendTo($w);
	if(valueArray.length == 2){
		var wmdGraph1 = $("<div>", {id:"fullscreen-graph1-print",class:"widget-fullscreen-graph-print"}).appendTo(wmdBody);
		var wmdGraph2 = $("<div>", {id:"fullscreen-graph2-print",class:"widget-fullscreen-graph-print"}).appendTo(wmdBody);
		var vs = valueName.split("_and_");
		var values1 = [];
		var labels1 = [];
		$(valueArray[0]).each(function( index ) {
			var ob = $(this)[0];
			values1.push(ob.value);
			labels1.push(ob.date);
		});
		
		var values2 = [];
		var labels2 = [];
		$(valueArray[1]).each(function( index ) {
			var ob = $(this)[0];
			values2.push(ob.value);
			labels2.push(ob.date);
		});
		
		var gtitle1 = "Evolution of "+vs[0]+" in time";
		var gtitle2 = "Evolution of "+vs[1]+" in time";
		loadGraphAllValues("fullscreen-graph1-print",values1,labels1,gtitle1,valueLimitsObj[0],vs[0]);
		loadGraphAllValues("fullscreen-graph2-print",values2,labels2,gtitle2,valueLimitsObj[1],vs[1]);
		//$("#fullscreen-graph-zoomreset").hide();
	}else{
		var wmdGraph = $("<div>", {id:"fullscreen-graph-print",class:"widget-fullscreen-graph-print"}).appendTo(wmdBody);
		var values = [];
		var labels = [];
		
		$.each(valueArray[0], function( i , ob) {
			values.push(ob.value);
			labels.push(ob.date);
		});
		var gtitle = "Evolution of "+label+" in time";
		loadGraphAllValues("fullscreen-graph-print",values,labels,gtitle,valueLimitsObj[0],valueName);
	}
}



function createFormWidget(valueName,dataType,containerForm,actualValuesObj){
	var valueType = eval('type_'+valueName);
	var unit= eval('label_'+valueName);
	var dateLabel= eval('label_'+valueName+"_collected_date");
	
	
	if(typeof(window['unit_'+valueName]) != 'undefined'){
		unit = eval('unit_'+valueName);
	}
	
	if(valueType == 'single'){
		//3 rows
		if(dataType == 'int' || dataType == 'double'){
			$("<div>",{class:"row",style:"height:35px;"})
			.appendTo(containerForm)
			.append($("<div>",{class:"col-sm-5 widget-form-label"}).text(unit))
			.append($("<div>",{class:"col-sm-7 widget-form-value form-value-"+valueName}));
			$("<div>",{class:"row",style:"height:35px;"})
				.appendTo(containerForm)
				.append($("<div>",{class:"col-sm-5 widget-form-label"}).text(dateLabel))
				.append($("<div>",{class:"col-sm-7 widget-form-date form-date-"+valueName}));
			
			$(".form-value-"+valueName).append($("<input>",{type:"text",id:"val-"+valueName+"-"+actualValuesObj.id,value:actualValuesObj.value}));
			$(".form-date-"+valueName).append(
					$("<input>",{class:"",value:actualValuesObj.date,id:"dat-"+valueName+"-"+actualValuesObj.id}).datepicker({
				        changeMonth: true,
				        changeYear: true,
				        yearRange: '1920:'+moment().year(),
				        dateFormat : 'yy-mm-dd',
				        defaultDate: 0
				    })
			).append(
					$("<i>",{class:"fa fa-calendar"})
			);
		}else if(dataType == 'date'){
			$("<div>",{class:"",style:"height:35px;"})
			.appendTo(containerForm)
			.append($("<div>",{class:"widget-form-label"}).text(dateLabel));
			$("<div>",{class:"",style:"height:35px;"})
				.appendTo(containerForm)
				.append($("<div>",{class:"widget-form-date form-date-"+valueName}));
			$(".form-date-"+valueName).append(
					$("<input>",{class:"",value:actualValuesObj.date,id:"dat-"+valueName+"-"+actualValuesObj.id}).datepicker({
				        changeMonth: true,
				        changeYear: true,
				        yearRange: '1920:'+moment().year(),
				        dateFormat : 'yy-mm-dd',
				        defaultDate: 0
				    })
			).append(
					$("<i>",{class:"fa fa-calendar"})
			).append(
					$("<input>",{class:"",value:'0',id:"val-"+valueName+"-"+actualValuesObj.id,type:"hidden"})
			);
			
		}else if(dataType == 'radio'){
			$("<div>",{class:"",style:"height:35px;"})
			.appendTo(containerForm)
			.append($("<div>",{class:""})
							.append($("<div>",{class:"btn-group form-value-"+valueName,'data-toggle':"buttons",id:"val-"+valueName+"-"+actualValuesObj.id}))
			);
			$("<div>",{class:"",style:"height:35px;"})
				.appendTo(containerForm)
				.append($("<div>",{class:"" })
						.append($("<div>",{class:"widget-form-date form-date-"+valueName}))
				);
			
			var valueValues = eval(valueName+"_values");
			
			$.each(valueValues,function(ind,vl){
				var nclass = '';
				var chk = '';
				if(vl == 'Normal'){nclass='btn-success';}
				if(vl == 'Abnormal'){nclass='btn-danger';}
				if(vl == 'Yes' && valueName == 'smoke'){nclass='btn-danger';}
				if(vl == 'No' && valueName == 'smoke'){nclass='btn-success';}
				if(actualValuesObj.value == vl){chk = 'active';}
				$("<label>",{class:"btn btn-primary btn-sm "+nclass+" "+chk})
				.append($("<input>",{type:"radio",name:"val-"+valueName+"-"+actualValuesObj.id,value:ind}))
				.append(vl)
				.appendTo($(".form-value-"+valueName));
				
			});
					
			$(".form-date-"+valueName).append(
					$("<input>",{class:"",value:actualValuesObj.date,id:"dat-"+valueName+"-"+actualValuesObj.id}).datepicker({
				        changeMonth: true,
				        changeYear: true,
				        yearRange: '1920:'+moment().year(),
				        dateFormat : 'yy-mm-dd',
				        defaultDate: 0
				    })
			).append(
					$("<i>",{class:"fa fa-calendar"})
			);
		}
		if(actualValuesObj.id == '0'){
			$("#dat-"+valueName+"-"+actualValuesObj.id).datepicker().datepicker("setDate", new Date());
		}
	//buttons	
	$("<div>",{class:"row",style:"height:35px;"})
		.appendTo(containerForm)
		.append($("<div>",{class:"col-sm-6"})
				.append($("<div>",{class:"cisbutton"})
						.text("Cancel")
						.click(function(){
							closeTableForm(containerForm.parent());
						})
				)
		)
		.append($("<div>",{class:"col-sm-5"})
				.append($("<div>",{class:"cisbutton"})
						.text("Save")
						.click(function(){
							
							var s = eval("section_"+valueName);
							var vValue = $("#val-"+valueName+"-"+actualValuesObj.id).val();
							var dValue = $("#dat-"+valueName+"-"+actualValuesObj.id).val();
							if(dataType == 'radio'){
								vValue = $("#val-"+valueName+"-"+actualValuesObj.id+" input:radio:checked").val();
							}
							
							if(typeof(vValue) == 'undefined' || typeof(dValue) == 'undefined'){
								var $d = $("<div>",{id:"dialog-confirm",title:"Missing value or date"}).appendTo($("body"));
								var $p = $("<p>").text("You cannot add a value without a date or a date without a value").appendTo($d); 
								$d.dialog({
								      resizable: false,
								      height: "auto",
								      width: 400,
								      modal: true,
								      buttons: {
								        OK: function() {
								          $( this ).dialog( "close" );
								          $(this.remove());
								        }
								      }
								    });
							}else{
								saveValue(actualValuesObj.id,s,valueName, dValue,vValue,patientObjArray);
								
								if(typeof(window['trigger_'+valueName]) != 'undefined'){
									var tobj = window['trigger_'+valueName];
									if(tobj.conditionfield == 'value'){
										if(vValue == tobj.conditionvalue){
											saveValue('0',tobj.section,tobj.value, dValue,vValue,patientObjArray);
										}
									}else if(tobj.conditionfield == 'date'){
										if(dValue == tobj.conditionvalue){
											saveValue('0',tobj.section,tobj.value, dValue,vValue,patientObjArray);
										}
									}
								}
								
								var sectionObj = getObjectSection(patientObjArray);
								
								var secObjValue = eval("sectionObj."+valueName);
								buildWidget(valueName, [secObjValue.values], $("#"+valueName));
								closeTableForm(containerForm.parent());
								
							}
						})
				)
		);
	
	}else{
		//table or graph valueType contains  int  double and radio values  
		if(dataType == 'int' || dataType=='double'){
			containerForm.append(
					$("<div>",{class:"widget-form-label"})
						.text(unit)
					);
			if(valueName.indexOf('_and_') >= 0){
				var vs = valueName.split('_and_');
				var vals = actualValuesObj.value.split("/");
				var ids = actualValuesObj.id.split("-");
				containerForm.append(
						$("<div>",{class:"widget-form-value",style:"width:110px;"})
							.append($("<input>",{style:"width:50px;",value:vals[0],id:"val-"+vs[0]+"-"+ids[0]}))
							.append($("<span>",{class:""}).text("/"))
							.append($("<input>",{style:"width:50px;",value:vals[1],id:"val-"+vs[1]+"-"+ids[1]}))
						);
			}else{
				containerForm.append(
						$("<div>",{class:"widget-form-value"})
							.append($("<input>",{class:"",value:actualValuesObj.value,id:"val-"+valueName+"-"+actualValuesObj.id}))
						);
			}
			
			containerForm.append(
						$("<div>",{class:"widget-form-label"})
							.text(eval('label_'+valueName+'_collected_date'))
						);
			
			containerForm.append(
						$("<div>",{class:"widget-form-date"}).append(
							$("<input>",{class:"",value:actualValuesObj.date,id:"dat-"+valueName+"-"+actualValuesObj.id}).datepicker({
						        changeMonth: true,
						        changeYear: true,
						        yearRange: '1920:'+moment().year(),
						        dateFormat : 'yy-mm-dd',
						        defaultDate: 0
						    })
						).append(
								$("<i>",{class:"fa fa-calendar"})
						)
			);
		}else if(dataType == 'radio'){
			containerForm.append($("<div>",{class:"widget-form-label"}));
			containerForm.append($("<div>",{class:"btn-group form-value-"+valueName,'data-toggle':"buttons"}));
			var valueValues = eval(valueName+"_values");
			$.each(valueValues,function(ind,vl){
				var nclass = '';
				var chk = '';
				var ckd = false;
				if(vl == 'Yes' && valueName == 'smoke'){nclass='btn-danger';}
				if(vl == 'No' && valueName == 'smoke'){nclass='btn-success';}
				if(actualValuesObj.value == vl){chk = 'active';ckd = true;}
				$("<label>",{class:"btn btn-primary btn-sm "+nclass+" "+chk})
				.append($("<input>",{type:"radio",id:"val-"+valueName+"-"+actualValuesObj.id,value:ind,checked:ckd}))
				.append(vl)
				.appendTo($(".form-value-"+valueName));
			});
			
			containerForm.append(
						$("<div>",{class:"widget-form-label"})
							.text(eval('label_'+valueName+'_collected_date'))
						);
			
			containerForm.append(
						$("<div>",{class:"widget-form-date"}).append(
							$("<input>",{class:"",value:actualValuesObj.date,id:"dat-"+valueName+"-"+actualValuesObj.id}).datepicker({
						        changeMonth: true,
						        changeYear: true,
						        yearRange: '1920:'+moment().year(),
						        dateFormat : 'yy-mm-dd',
						        defaultDate: 0
						    })
						).append(
								$("<i>",{class:"fa fa-calendar"})
						)
			);
			
		}
		
		if(actualValuesObj.id == '0' || actualValuesObj.id == '0-0'){
			$("#dat-"+valueName+"-"+actualValuesObj.id).datepicker().datepicker("setDate", new Date());
		}
		
		//buttons
		containerForm.append(
				$("<div>",{style:"padding-top:15px;"})
					.append($("<div>",{class:"cisbutton"})
							.text("Cancel")
							.click(function(){
									closeTableForm(containerForm.parent());
							})
					)
					.append(
							$("<div>",{class:"cisbutton"})
								.text("Save")
								.click(function(){
									if(valueName.indexOf('_and_') >= 0){
										var ss = eval("section_"+valueName).split('_and_');
										var vs = valueName.split('_and_');
										var vals = actualValuesObj.value.split("/");
										var ids = actualValuesObj.id.split("-");
										var vValue1 = $("#val-"+vs[0]+"-"+ids[0]).val();
										var dValue1 = $("#dat-"+valueName+"-"+actualValuesObj.id).val();
										var vValue2 = $("#val-"+vs[1]+"-"+ids[1]).val();
										saveValue(ids[0],ss[0],vs[0], dValue1,vValue1,patientObjArray);
										saveValue(ids[1],ss[1],vs[1], dValue1,vValue2,patientObjArray);
										var sectionObj1 = getObjectArray(ss[0],patientObjArray);
										var sectionObj2 = getObjectArray(ss[1],patientObjArray);
										var secObjValue1 = eval("sectionObj1."+vs[0]);
										var secObjValue2 = eval("sectionObj2."+vs[1]);
										buildWidget(valueName, [secObjValue1.values,secObjValue2.values], $("#"+valueName));
										closeTableForm(containerForm.parent());
									}else{
										var s = eval("section_"+valueName);
										if(dataType == 'radio'){
											var vValue = $(".form-value-"+valueName+" .btn.active input").val();
										}else{
											var vValue = $("#val-"+valueName+"-"+actualValuesObj.id).val();
										}
										
										
										var dValue = $("#dat-"+valueName+"-"+actualValuesObj.id).val();
										
										if(typeof(vValue) == 'undefined' || typeof(dValue) == 'undefined'){
											var $d = $("<div>",{id:"dialog-confirm",title:"Missing value or date"}).appendTo($("body"));
											var $p = $("<p>").text("You cannot add a value without a date or a date without a value").appendTo($d); 
											$d.dialog({
											      resizable: false,
											      height: "auto",
											      width: 400,
											      modal: true,
											      buttons: {
											        OK: function() {
											          $( this ).dialog( "close" );
											          $(this.remove());
											        }
											      }
											    });
										}else{
										
											saveValue(actualValuesObj.id,s,valueName, dValue,vValue,patientObjArray);
											
											if(typeof(window['trigger_'+valueName]) != 'undefined'){
												var tobj = window['trigger_'+valueName];
												if(tobj.conditionfield == 'value'){
													if(vValue == tobj.conditionvalue){
														saveValue('0',tobj.section,tobj.value, dValue,vValue,patientObjArray);
													}
												}else if(tobj.conditionfield == 'date'){
													if(dValue == tobj.conditionvalue){
														saveValue('0',tobj.section,tobj.value, dValue,vValue,patientObjArray);
													}
												}
											}
											
											var sectionObj = getObjectArray(s,patientObjArray);
											var secObjValue = eval("sectionObj."+valueName);
											buildWidget(valueName, [secObjValue.values], $("#"+valueName));
											closeTableForm(containerForm.parent());
										}
									}
									
							})
					)
		);
	}
}
