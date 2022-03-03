/*
 * patient functions mostly from cdis
 * 
 */

function loadPatientObject(key,value){
	var patient = $.ajax({
		  url: "/ncdis/service/data/getPatientRecord?sid="+sid+"&language=en&"+key+"="+value,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		patient.done(function( json ) {
			patientObjArray = json.objs;
			patientObj = patientObjArray[0];
			//console.log("object patient");
			//console.log(patientObjArray);
		});
		patient.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		  console.log(this.url);
		});	
}

function getValueSectionArray(section, value, arr){
	//cdisSection = section;
	//var objSection = getObjectSection(arr);
	var objSection = getObjectArray(section,arr);
	//console.log('object section - '+section+'  -  value:'+value);
	//console.log(objSection);
	var objValue = eval("objSection."+value);
	
	//console.log(objValue);
	if(typeof(objValue) != 'undefined'){
		return objValue.values;
	}else{
		return [];
	}
}

function getValueObject(section, value, arr){
	//cdisSection = section;
	var objSection = getObjectArray(section,arr);
	var objValue = eval("objSection."+value);
	if(typeof(objValue) != 'undefined'){
		objValue['name'] = value;
		return objValue;
	}else{
		return {};
	}
}


function getObjectArray(objectName, objectArray){
	if(objectName == "mdvisits"){
		return objectArray[3];
	}else if(objectName == "lab"){
		return objectArray[6];
	}else if(objectName == "lipid"){
		return objectArray[5];
	}else if(objectName == "renal"){
		return objectArray[4];
	}else if(objectName == "complications"){
		return objectArray[7];
	}else if(objectName == "meds"){
		return objectArray[9];
	}else if(objectName == "miscellaneous"){
		return objectArray[8];
	}else if(objectName == "depression"){
		return objectArray[10];
	}else if(objectName == "diabet"){
		var oa = objectArray[2];
		 $.each(oa, function(key, value) {
			var oarr = value.values;
			$.each(oarr, function(k, v) {
				var newvalues = {dtype:v.value, ddate:v.date , diabetcode:v.code, diabetidvalue:v.idvalue};
				$.extend(true,v,newvalues);
			});
		 });
		return oa;
	}else if(objectName == "hcp"){
		var oa = objectArray[1];
		return oa;
	}
}



function getObjectSection(arr){
	
	if(cdisSection == "mdvisits"){
		return arr[3];
	}else if(cdisSection == "lab"){
		return arr[6];
	}else if(cdisSection == "lipid"){
		return arr[5];
	}else if(cdisSection == "renal"){
		return arr[4];
	}else if(cdisSection == "complications"){
		return arr[7];
	}else if(cdisSection == "meds"){
		return arr[9];
	}else if(cdisSection == "miscellaneous"){
		return arr[8];
	}else if(cdisSection == "depression"){
		return arr[10];
	}
}




function getValueLimits(valueName){
	var result = null;
	
	if(typeof(window['limits_'+valueName]) != 'undefined'){
		result = window['limits_'+valueName];
	}else{
		var limits = $.ajax({
			  url: "/ncdis/service/data/getValueLimits?sid="+sid+"&language=en&name="+valueName,
			  type: "GET",
			  async : false,
			  cache : false,
			  dataType: "json"
			});
			limits.done(function( json ) {
				result = json.objs[0];
				//console.log(result);
			});
			limits.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
	} 
	return result;
}





/* function to draw graph of value like in abc graphs - for normal values : without _and_ or _or_ in name */
function drawGraphValue(section, valueName){
	// section get data for graph
	//get data from patient object
	var valueArray = getValueSectionArray(section, valueName, patientObjArray);
	
	
	//get value limits
	var limitsObj = getValueLimits(valueName);
	
	//data formated for plot
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
	
	
	//section prepare graph place
	var valueContainer = $("#"+section+"_"+valueName);
	var gc = $("<div>",{"id":"graph-"+valueName}).appendTo(valueContainer);
	//
	
	//section plotGraph in place with data
	loadGraphValue(gc, values, labels,"title",limitsObj,valueName);
}

/*function to draw graf for blood pressure - not existent yet in patient summary*/
function drawGraphBP(){
	
}

/*function to draw grapf for values with _or_ in name , with condition*/
function drawGraphOrValues(valueName, condition){
	
}




function loadGraphValue(graphContainer, values, labels, title, limits, valueName){
	graphContainer.empty();
	var divStr = $(graphContainer).attr("id");
	
	var target=0;
	var series = [];
	var ten = 10;
	var serie = [];
	var lastvalues = [];
	
		if(values.length > 0){
			if(values.length < ten){ten = values.length;}
			var iday  = moment(labels[0]);
			var limitday = iday.subtract(24,'months');
			var dc = eval(valueName+"_dec");
			var lastday = moment(labels[0]);
			var iscut = false;
			 for(var i=0;i<ten;i++){
				 var lab = Number(values[i]).trimNum(dc);
				 var day = moment(labels[i]);
				 
				 /**/
				 if(i >0){
					 if(day.isAfter(limitday)){
						 serie = [labels[i],Number(values[i]).trimNum(dc),lab];
						 series.push(serie);
						 lastvalues.push(values[i]);
						 //iday = moment(labels[i]);
					 }			 
				 }else{
					 serie = [labels[i],Number(values[i]).trimNum(dc),lab];
					 series.push(serie);
					 lastvalues.push(values[i]);
				 }
				 lastday = day;
			 }
			 var arrLimits = [];
			 var hasMax = false;
			 var hasMin = false;
			 
			 var fs = "%."+dc+"f";
			 if(dc == 0){
				 fs = "%d";
			 }
			 
			 var minNum = lastvalues.min();
			 var maxNum = lastvalues.max();
			 if(limits != null){
				 
					 if(minNum > Number(limits.minvalue)){minNum = limits.minvalue;}
					 if(maxNum < Number(limits.maxvalue)){maxNum = limits.maxvalue;}
					 $.each(limits.stages,function(idx,val){
						 if(idx == 0){
							 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymin:Number(val.min), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: false, tooltipFormatString: val.title } };
						 }else if(idx == limits.stages.length-1){
							 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymax: Number(val.max),xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: false, tooltipFormatString: val.title } }; 
						 }else{
							 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymax: Number(val.max),ymin:Number(val.min), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: false, tooltipFormatString: val.title } };
						 }
						 arrLimits.push(limitObj);
					 });
					
			 }

			minNum = Number(minNum); 
			maxNum = Number(maxNum);

			 
			 $.jqplot.postDrawHooks.push(function() {
				 	for(var i=0;i<$('#'+divStr+' .jqplot-overlayCanvas-canvas').length;i++){
				 		var overlayCanvas = $($('#'+divStr+' .jqplot-overlayCanvas-canvas')[i]);
					    var seriesCanvas = $($('#'+divStr+' .jqplot-series-canvas')[i]);
					    seriesCanvas.detach();
					    overlayCanvas.after(seriesCanvas);
				 	}
			});
			
			var lc = title.toLowerCase();
			 
			 if (valueName == "hba1c"){
				 var lineLimitObj1 = {horizontalLine: {name: 'lineObj1',y: 0.060,lineWidth:1,xminOffset: '2px',xmaxOffset: '2px',color: 'rgb(5,5,5)',shadow: false}};
				 var lineLimitObj2 = {horizontalLine: {name: 'lineObj', y: 0.070,lineWidth: 1,xminOffset: '2px', xmaxOffset: '2px', color: 'rgb(5,5,5)',	shadow: false	}};
				 arrLimits.push(lineLimitObj1);
				 arrLimits.push(lineLimitObj2);
			 }
			 
			 if (valueName == "acglu"){
				 var lineLimitObj1 = {horizontalLine: {name: 'lineObj1',y: 6,lineWidth: 1,xminOffset: '2px',xmaxOffset: '2px',color: 'rgb(5,5,5)',shadow: false}};
				 var lineLimitObj2 = {horizontalLine: {name: 'lineObj2',y: 7,lineWidth: 1,xminOffset: '2px',xmaxOffset: '2px',color: 'rgb(5,5,5)',shadow: false}};
				 arrLimits.push(lineLimitObj1);
				 arrLimits.push(lineLimitObj2);
			 }
			 
			 var plot = jQuery.jqplot(divStr,[series], {
				 title:{text:"",show:false},
				 
				 grid:{backgroundColor: '#ffffff', gridLineColor: '#cdcdcd',gridLineWidth: 0.5, borderWidth: 0.5, borderColor: '#4d4d4d'},
				 seriesDefaults: {
					 rendererOptions: {smooth: true},
					 pointLabels:{ show:true, location:'s'}
				 },
			     axes:{
			            xaxis:{renderer:$.jqplot.DateAxisRenderer,rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickInset:0.2},tickOptions:{fontSize:'8pt',textColor:'#000000',fontFamily:'Sans-serif',show:true,formatString:'%b-%Y',markSize:8}},
			            yaxis:{rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickInset:0.5},tickOptions:{fontSize:'8pt',textColor:'#000000',fontFamily:'Sans-serif',show:true,formatString: fs,markSize:2},min:Number(minNum),max:Number(maxNum)}
			        },
			     canvasOverlay: {
			            show: true,
			            objects: arrLimits
			          }, 
		        series:[{lineWidth:2,markerOptions:{style:'filledCircle', color:'#cdcdcd',size:4 },color:'#4d4d4d'}],
		        
		        highlighter: {
		        	show: true,sizeAdjust: 10,tooltipLocation:'n',tooltipOffset:2,
		        	formatString:'<table class="jqplot-highlighter" border="0"><tr><td>Date:</td><td>%s</td></tr><tr><td>Value:</td><td>%s</td></tr></table>'},
		        cursor:{
		        	show: true,
		        	showTooltip:false
		        	}
				});
			
			 /*
			 if(limits != null){
				 var co = plot.plugins.canvasOverlay;
				 $.each(limits.stages,function(ii,vv){
					 var lineN = co.get('stage-'+valueName+'-'+ii);
					 var normLabel = lineN.gridStop[1]+11;
					 $('<div class="my-jqplot-normal-title" style="top:'+normLabel+'px;">'+vv.title+'</div>').insertBefore('#'+divStr+' .jqplot-overlayCanvas-canvas');
				 });
			 }
			 */
		}else{
			graphContainer.html("<p class='text-center'>No data for <b>"+valueName+"</b></p>");
		}/* end values lenght check */
		
}


function drawPiramidGraph(container,ticksArr,maleArr,femaleArr,valueName){
	    var ticks = ticksArr;
	    var male = maleArr;
	    var female = femaleArr;
	    var containerid = $(container).attr("id");
	    var blueColors = ["#4bb2c5","#eaa328"];
	    var plotOptions = {
	        title: '<div class="tp-graph-section-title-left">Male</div><div class="tp-graph-section-title-right">Female</div>',
	        seriesColors: blueColors,
	        grid: {
	            drawBorder: true,
	            borderWidth: 0.5,
	            shadow: false,
	            background: 'transparent',
	            rendererOptions: {
	                plotBands: {
	                    show: false
	                }
	            }
	        },
	        defaultAxisStart: 0,
	        seriesDefaults: {
	            renderer: $.jqplot.PyramidRenderer,
	            rendererOptions: {
	                barPadding: 7,
	                offsetBars: false
	            },
	            yaxis: 'yMidAxis',
	            shadow: true
	        },
	 
	        series: [
	            {
	                rendererOptions:{
	                    side: 'left',
	                    synchronizeHighlight: 1
	                }
	            },
	            {
	                yaxis: 'yMidAxis',
	                rendererOptions:{
	                    synchronizeHighlight: 0
	                }
	            }
	        ],
	 
	        axes: {
	            xaxis: {
	                tickOptions: {},
	                rendererOptions: {
	                    baselineWidth: 2
	                }
	            },
	            yMidAxis: {
	                label: valueName.replace(" ","&#160;"),
	                // include empty tick options, they will be used
	                // as users set options with plot controls.
	                labelOptions:{
	                	textColor:"#4d4d4d",
	                	fontSize:"0.7vw"
	                },
	                tickOptions: {
	                	showLabel : true,
	                	fontSize:"0.6vw",
	                	textColor:"#4d4d4d",
	                	showMark : false
	                },
	                tickInterval: 1,
	                showMinorTicks: false,
	                ticks: ticks,
	                rendererOptions: {
	                    category: true,
	                    baselineWidth: 2
	                }
	            }
	        }
	    };
	 
	    var plot1 = $.jqplot(containerid, [male, female], plotOptions);
	    
	    //$(container).bind('jqplotDataHighlight',{"plotObj":plot1,"index":pointIndex,"data":data} ,eval("plotStats"+valueName));
	    $(container).bind('jqplotDataHighlight',function(evt, seriesIndex, pointIndex, data ) {
	    	
	    	if(plot1 != null){
		    	var malePopulation = Math.abs(plot1.series[0].data[pointIndex][1]);
		        var femalePopulation = Math.abs(plot1.series[1].data[pointIndex][1]);
		        var ratio = femalePopulation / malePopulation ;
		        var v = valueName.toLowerCase().replace(" ","");
		        
		        $('.tp-table-'+v+'-male .value').stop(true, true).fadeIn(250).html(malePopulation);
		        $('.tp-table-'+v+'-female .value').stop(true, true).fadeIn(250).html(femalePopulation);
		        $('.tp-table-'+v+'-ratio .value').stop(true, true).fadeIn(250).html(ratio.toPrecision(4));
		        $('.tp-table-'+v+'-'+v+' .value').stop(true, true).fadeIn(250).html(ticks[pointIndex]);

	    	}
	    	
	    });
	    
	    
	    $(container).bind('jqplotDataUnhighlight', function(evt, seriesIndex, pointIndex, data){
	    	var v = valueName.toLowerCase().replace(" ","");
	        $('.tp-table-'+v+'-male .value').stop(true, true).fadeOut(200).html('');
	        $('.tp-table-'+v+'-female .value').stop(true, true).fadeOut(200).html('');
	        $('.tp-table-'+v+'-ratio .value').stop(true, true).fadeOut(200).html('');
	        $('.tp-table-'+v+'-'+v+' .value').stop(true, true).fadeOut(200).html('');
	    });
}



function drawPiramidGraphImprovment(container,ticks,maleArr,femaleArr){
	
		 
	    // the "x" values from the data will go into the ticks array.  
	    // ticks should be strings for this case where we have values like "75+"
	    var ticks = ticks;
	 
	    // The "y" values of the data are put into seperate series arrays.
	    var male = maleArr;
	    var female = femaleArr;
	    var containerid = $(container).attr("id");
	 
	    // Custom color arrays are set up for each series to get the look that is desired.
	    // Two color arrays are created for the default and optional color which the user can pick.
	    var greenColors = ["#526D2C", "#77933C", "#C57225", "#C57225"];
	    //var blueColors = ["#3F7492", "#4F9AB8", "#C57225", "#C57225"];
	    var blueColors = ["#4bb2c5","#eaa328"];
	 
	    // To accomodate changing y axis, need to keep track of plot options, so they are defined separately
	    // changing axes will require recreating the plot, so need to keep 
	    // track of state changes.
	    var plotOptions = {
	        // We set up a customized title which acts as labels for the left and right sides of the pyramid.
	        title: '<div class="tp-graph-section-title-left">Male</div><div class="tp-graph-section-title-right">Female</div>',
	 
	        // by default, the series will use the green color scheme.
	        seriesColors: blueColors,
	 
	        grid: {
	            drawBorder: true,
	            borderWidth: 0.5,
	            shadow: false,
	            background: 'transparent',
	            rendererOptions: {
	                // plotBands is an option of the pyramidGridRenderer.
	                // it will put banding at starting at a specified value
	                // along the y axis with an adjustable interval.
	                plotBands: {
	                    show: false
	                }
	            }
	        },
	 
	        // This makes the effective starting value of the axes 0 instead of 1.
	        // For display, the y axis will use the ticks we supplied.
	        defaultAxisStart: 0,
	        seriesDefaults: {
	            renderer: $.jqplot.PyramidRenderer,
	            rendererOptions: {
	                barPadding: 10,
	                offsetBars: false
	            },
	            yaxis: 'yMidAxis',
	            shadow: true
	        },
	 
	        // We have 4 series, the left and right pyramid bars and
	        // the left and rigt overlay lines.
	        series: [
	            // For pyramid plots, the default side is right.
	            // We want to override here to put first set of bars
	            // on left.
	            {
	                rendererOptions:{
	                    side: 'left',
	                    synchronizeHighlight: 1
	                }
	            },
	            {
	                yaxis: 'yMidAxis',
	                rendererOptions:{
	                    synchronizeHighlight: 0
	                }
	            }
	        ],
	 
	        // Set up all the y axes, since users are allowed to switch between them.
	        // The only axis that will show is the one that the series are "attached" to.
	        // We need the appropriate options for the others for when the user switches.
	        axes: {
	            xaxis: {
	                tickOptions: {},
	                rendererOptions: {
	                    baselineWidth: 2
	                }
	            },
	            yaxis: {
	                label: 'Age',
	                // Use canvas label renderer to get rotated labels.
	                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	                // include empty tick options, they will be used
	                // as users set options with plot controls.
	                tickOptions: {},
	                tickInterval: 1,
	                showMinorTicks: true,
	                ticks: ticks,
	                rendererOptions: {
	                    category: true,
	                    baselineWidth: 2
	                }
	            },
	            yMidAxis: {
	                label: 'Improvement',
	                // include empty tick options, they will be used
	                // as users set options with plot controls.
	                labelOptions:{
	                	textColor:"#4d4d4d",
	                	fontSize:"0.7vw"
	                },
	                tickOptions: {
	                	showLabel : true,
	                	fontSize:"0.6vw",
	                	textColor:"#4d4d4d",
	                	showMark : false
	                },
	                tickInterval: 1,
	                showMinorTicks: false,
	                ticks: ticks,
	                rendererOptions: {
	                    category: true,
	                    baselineWidth: 2
	                }
	            },
	            y2axis: {
	                label: 'Age',
	                // Use canvas label renderer to get rotated labels.
	                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	                // include empty tick options, they will be used
	                // as users set options with plot controls.
	                tickOptions: {},
	                tickInterval: 5,
	                showMinorTicks: false,
	                ticks: ticks,
	                rendererOptions: {
	                    category: true,
	                    baselineWidth: 2
	                }
	            }
	        }
	    };
	 
	    // initialize form elements
	    // set these before attaching event handlers.
	 
	 
	    plot1 = $.jqplot(containerid, [male, female], plotOptions);
	 
	 
	    // After plot creation, check to see if contours should be displayed
	    
	 
	    //////
	    // The followng functions use verbose css selectors to make
	    // it clear exactly which elements they are binging to/operating on
	    //////
	     
	    //////
	    // Function which checkes if the countour lines checkbox is checked.
	    // If not, hide the contour lines by hiding the canvases they are
	    // drawn on.
	    //////
	        
	 
	   
	 
	    // bind to the data highlighting event to make custom tooltip:
	    $('.jqplot-target').bind('jqplotDataHighlight', function(evt, seriesIndex, pointIndex, data) {
	        // Here, assume first series is male poulation and second series is female population.
	        // Adjust series indices as appropriate.
	        var malePopulation = Math.abs(plot1.series[0].data[pointIndex][1]);
	        var femalePopulation = Math.abs(plot1.series[1].data[pointIndex][1]);
	        var ratio = femalePopulation / malePopulation ;
	 
	        $('.tp-table-improvment-male .value').stop(true, true).fadeIn(250).html(malePopulation);
	        $('.tp-table-improvment-female .value').stop(true, true).fadeIn(250).html(femalePopulation);
	        $('.tp-table-improvment-ratio .value').stop(true, true).fadeIn(250).html(ratio.toPrecision(4));
	 
	        // Since we don't know which axis is rendererd and acive with out a little extra work,
	        // just use the supplied ticks array to get the age label.
	        $('.tp-table-improvment-improvment .value').stop(true, true).fadeIn(250).html(ticks[pointIndex]);
	    });
	 
	    // bind to the data highlighting event to make custom tooltip:
	    $('.jqplot-target').bind('jqplotDataUnhighlight', function(evt, seriesIndex, pointIndex, data) {
	        // clear out all the tooltips.
	        //$('.tooltip-item').stop(true, true).fadeOut(200).html('');
	        $('.tp-table-improvment-male .value').stop(true, true).fadeOut(200).html('');
	        $('.tp-table-improvment-female .value').stop(true, true).fadeOut(200).html('');
	        $('.tp-table-improvment-ratio .value').stop(true, true).fadeOut(200).html('');
	 
	        // Since we don't know which axis is rendererd and acive with out a little extra work,
	        // just use the supplied ticks array to get the age label.
	        $('.tp-table-improvment-improvment .value').stop(true, true).fadeOut(200).html('');
	    });
	 
	 
	    $("div.chart-container").bind("resize", function(event, ui) {
	        plot1.replot();
	    });
	
}

function drawPieGraph(container,dataObject){
	
	$(container).empty();
	var serie = [['Sony',7], ['Samsumg',13.3], ['LG',14.7], ['Vizio',5.2], ['Insignia', 1.2]];
    
	var th = $(".pie-label").height();
	var tw = $(".pie-label").width();
	var ph = $(container).parent().height();
    
	$(container).width(tw);
	$(container).height(ph-th);
	//console.log(dataObject);
	
    var cid = $(container).attr("id");
   $.jqplot(cid, [dataObject], {
	   grid: {
           drawBorder: false, 
           drawGridlines: false,
           background: '#ffffff',
           shadow:false
       },
       axesDefaults: {
            
       },
       seriesDefaults:{
           renderer:$.jqplot.PieRenderer,
           rendererOptions: {
               showDataLabels: true
           }
       }
    }); 
	
}

function drawPG(object){
	//console.log(object);
	drawPieGraph(object.container,object.data);
}

function drawAG(object){
	//console.log(object);
	//drawAreaGraph(object.container,object.data);
	var options = {"colors":['#6b03fc', '#b103fc', '#a103fc', '#fc0384', '#17BDB8']};
	drawLineGraphSimple(object.container,object.data, options);
}

function drawL(object){
	var options = {"colors":["#fc6203","#03c6fc","#e05910","#bd10e0"]};
	drawLineGraphSimple(object.container,object.data, options);
	//drawLineGraph(object.container,object.data);
}

function drawBL(object){
	drawBarLineGraph(object.container,object.data);
}

function drawHbA1cValueLL(object){
	var options = {"colors":["#02a16e","#0227a1","#e05910","#bd10e0"]};
	drawLineGraphSimple(object.container,object.data, options);
}

function drawAreaGraph(container, dataObject){
	
	$(container).empty();
    var ts = dataObject.ticks;
    var ticks = [];
    $.each(ts, function(i,v){
    	ticks.push([v[0],moment(v[1]).format('MMM YYYY')]);
    });
    
    var cid = $(container).attr("id");
    var ang = 0;
    if(ticks.length > 10 && $(container).width() < 1000 )ang = -15;
    
    
    
    var showTick = true;
    if(ticks.length > 18)showTick=false;
    plot2 = $.jqplot(cid,dataObject.series,{
       stackSeries: true,
       seriesColors: ["rgba(252, 104, 5, 0.7)", "rgba(247, 247, 12, 0.7)", "rgba(30, 214, 91, 0.7)"],
       showMarker: false,
       highlighter: {
        show: true,
        showTooltip: false
       },
       seriesDefaults: {
           fill: true,
           fillAndStroke: true,
           rendererOptions: {
               smooth: true,
               animation: {
            	   speed: 2000,
                   show: true
               }
               
           },
           markerOptions: {
               style: 'filledCircle',
               size: 2
           }
       },
       series:  dataObject.labels,
       legend: {
    	renderer: $.jqplot.EnhancedLegendRenderer,
        show: true,
        location:'e',
        placement: 'outsideGrid',
        fontSize:'0.6vw',
        rowSpacing:'0.7em',
        border: 'none',
        background:'transparent',
        marginRight:'5px',
        rendererOptions: {
            numberRows: 1
        }
       },
       grid: {
        drawBorder: false,
        shadow: false
       },
       axes: {
           xaxis: {
              ticks: ticks,
              tickRenderer: $.jqplot.CanvasAxisTickRenderer,
              tickOptions: {
            	  show: showTick,
            	tickInterval:2,
                angle: ang 
              },
              drawMajorGridlines: false
          },
          yaxis: {
              min: 0,
              max: 100,
              tickOptions: {
                showGridline: false,
                formatString : "%'d",
                suffix: '%'
              }
          }           
        }
    });
     
    // capture the highlighters highlight event and show a custom tooltip.
    $(container).bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
    		//alert(ev.pageX+"   "+ev.pageY);
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
            var content = '<span>HBA1c Trend : <b>'+plot.series[seriesIndex].label + '</b></span><br><span>Date: <b>' + plot.series[seriesIndex]._xaxis.ticks[pointIndex][1] + '</b></span><br><span>Percentage: <b>' + data[1]+'%</b>';
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('<div>',{class:"jqplot-highlight","style":"position:absolute;background:"+plot.series[seriesIndex].fillColor}).appendTo($(container));
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var parentOffset = $(elem).parent().offset();
            var ww = $("#wraper").outerWidth();
            var left = ev.pageX - parentOffset.left;
            if(ev.pageX + w > ww){
            	left = ev.pageX - parentOffset.left - w;
            }
            var top = ev.pageY - parentOffset.top;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(300);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $(container).bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('.jqplot-highlight').fadeOut(300);
        }
    );
}





function drawDoubleLineGraph(container, series, ticks, colors, labels){
	$(container).empty();
	var cid = $(container).attr("id");
    var ang = 0;
    if(series[0].length > 10 && $(container).width() < 1000)ang = -15;
    var showTick = true;
	$.jqplot(cid, series, {
		showMarker: false,
	    highlighter: {
	    	show: true,
	        showTooltip: false
	    },
		seriesDefaults:{
			rendererOptions: {
		        highlightMouseOver: true,
		        highlightMouseDown: false,
		        highlightColor: null,
		    }
		},
		grid: {
	        drawBorder: true,
	        borderWidth: 1,
	        shadow: false
	       },
	       
	    legend: {
	       	renderer: $.jqplot.EnhancedLegendRenderer,
	           show: true,
	           location:'e',
	           placement: 'outsideGrid',
	           fontSize:'0.6vw',
	           rowSpacing:'0.7em',
	           border: 'none',
	           background:'transparent',
	           marginRight:'5px',
	           rendererOptions: {
	               numberRows: 1
	           }
	        },
            series:[
                    {
            			renderer:$.jqplot.LineRenderer,
            			highlightMouseOver: false,
            			label: labels[0],
            			color:colors[0],
            			pointLabels: { 
            					show: false,
            					location : 'n'
            				}
            		}, 
            		{
            			renderer:$.jqplot.LineRenderer,
            			label:labels[1],
            			color: colors[1],
            			pointLabels: { 
            				show: false,
        					location : 's' }
            		}],
            axes: {
                  xaxis: {
                	  ticks: ticks,
                      renderer: $.jqplot.CategoryAxisRenderer,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      tickOptions: {
                          angle: ang,
                          show:showTick
                      }
                  },
                  yaxis: {
                	  min: 0,
                      max: 100,
                      tickOptions: {
                        showGridline: false,
                        formatString : "%'d",
                        suffix: '%'
                      }
                  }
              }
          });
	
	// capture the highlighters highlight event and show a custom tooltip.
    $(container).bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
    		//alert(ev.pageX+"   "+ev.pageY);
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
            var content = '<span><b>'+plot.series[seriesIndex].label + '</b></span><br><span>Date: <b>' + plot.series[seriesIndex]._xaxis.ticks[pointIndex] + '</b></span><br><span>Percentage: <b>' + data[1]+'%</b> ';
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('<div>',{class:"jqplot-highlight","style":"position:absolute"}).appendTo($(container));
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var parentOffset = $(elem).parent().offset();
            var ww = $("#wraper").outerWidth();
            var left = ev.pageX - parentOffset.left;
            if(ev.pageX + w > ww){
            	left = ev.pageX - parentOffset.left - w;
            }
            var top = ev.pageY - parentOffset.top;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(300);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $(container).bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('.jqplot-highlight').fadeOut(300);
        }
    );
}



function drawBarLineGraph(container, dataObject){
	$(container).empty();
	var cid = $(container).attr("id");
	
	var serie1Init = dataObject.series[0];
	var serie1 = [];
	var serie2 = [];
	$.each(dataObject.series[0], function(i, v){
		//if(i == 0 || i%3==0){
			var pr = Math.round(100*v/dataObject.series[1][i]);
			serie1.push(serie1Init[i]);
			serie2.push(pr);
		//}
	});
	var ts = dataObject.ticks;
    var ticks = [];
    $.each(ts, function(i,v){
    	//if(i == 0 || i%3==0){
    		ticks.push(moment(v[1]).format('MMM YYYY'));
    	//}
    });
    
    var ang = 0;
    if(serie2.length > 10 && $(container).width() < 1000)ang = -15;
    var showTick = true;
    if(serie2.length > 18)showTick=false;
	var plot4 = $.jqplot(cid, [serie1, serie2], {
				seriesDefaults:{
					rendererOptions: {
				        highlightMouseOver: false,
				        highlightMouseDown: false,
				        highlightColor: null,
				    }
				},
				grid: {
			        drawBorder: true,
			        borderWidth: 1,
			        shadow: false
			       },
	                series:[
	                        
	                        {
	                			renderer:$.jqplot.BarRenderer,
	                			highlightMouseOver: false,
	                			label: dataObject.labels[0].label,
	                			pointLabels: { 
	                					show: true,
	                					location : 'n'
	                				}
	                		}, 
	                		{
	                			label:dataObject.labels[1].label,
	                			xaxis:'xaxis', 
	                			yaxis:'y2axis',
	                			pointLabels: { show: true,
                					location : 's' }
	                		}],
	                axes: {
	                      xaxis: {
	                    	  ticks: ticks,
	                          renderer: $.jqplot.CategoryAxisRenderer,
	                          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	                          tickRenderer: $.jqplot.CanvasAxisTickRenderer,
	                          tickOptions: {
	                              angle: ang,
	                              show:showTick
	                          }
	                      },
	                      yaxis: {
	                          autoscale:true,
	                          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	                          tickRenderer: $.jqplot.CanvasAxisTickRenderer,
	                          tickOptions: {
	                              angle: ang
	                          }
	                      },
	                      y2axis: {
	                    	  min: 0,
	                          max: 100,
	                          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	                          rendererOptions : {
	                        	  forceTickAt0: true, 
	                        	  forceTickAt100: true  
	                          },
	                          tickRenderer: $.jqplot.CanvasAxisTickRenderer,
	                          tickOptions: {
	                              angle: ang,
	                              formatString:"%'d%"
	                          }
	                      }
	                  }
	              });
}



function drawLineGraph(container, dataObject){
	
	$(container).empty();
	var cid = $(container).attr("id");
	
	var serie1 = dataObject.series[0];
	var serie2 = [];
	$.each(dataObject.series[0], function(i, v){
		//if(i == 0 || i%3==0){
			var pr = Math.round(100*v/dataObject.series[1][i]);
			serie2.push(pr);
		//}
	});
	var ts = dataObject.ticks;
    var ticks = [];
    $.each(ts, function(i,v){
    	//if(i == 0 || i%3==0){
    		ticks.push(moment(v[1]).format('MMM YYYY'));
    	//}
    });
    
    var ang = 0;
    if(serie2.length > 10 && $(container).width() < 1000)ang = -15;
    
    var showTick = true;
    if(serie2.length > 18)showTick=false;
	var plot4 = $.jqplot(cid, [serie2], {
			highlighter: {
		        show: true,
		        showTooltip: false
		       },
		       grid: {
		           drawBorder: true,
		           borderWidth: 0.5,
		           shadow: false
		          },
			series:[{
				color: 'rgba(52,155,235,.6)',
                negativeColor: 'rgba(31,90,135,.6)',
                showMarker: true,
                showLine: true,
                fill: false,
                fillAndStroke: true,
                markerOptions: {
                    style: 'filledCircle',
                    size: 8
                },
                rendererOptions: {
                    smooth: true
                }
			}],
            axes: {
                  xaxis: {
                	  ticks: ticks,
                	  drawMajorGridlines: false,
                      renderer: $.jqplot.CategoryAxisRenderer,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      numberTicks: 5,
                      tickOptions: {
                    	  show: showTick,
                          angle: ang
                      }
                  },
                  yaxis: {
                      min:0,
                      max:100,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      rendererOptions : {forceTickAt0: true, forceTickAt100: true },
                      tickOptions: {
                          angle: ang,
                          prefix: '',
                          formatString:"%'d%"
                      }
                  }
              }
          });

	 // capture the highlighters highlight event and show a custom tooltip.
    $(container).bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
    		//alert(ev.pageX+"   "+ev.pageY);
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
    		
            var content = '<span>Date: <b>' + plot.series[seriesIndex]._xaxis.ticks[pointIndex] + '</b></span><br><span>Percentage: <b>' + data[1]+'%</b>';
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('<div>',{class:"jqplot-highlight","style":"position:absolute;background:"+plot.series[seriesIndex].fillColor}).appendTo($(container));
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var parentOffset = $(elem).parent().offset();
            var ww = $("#wraper").outerWidth();
            var left = ev.pageX - parentOffset.left;
            if(ev.pageX + w > ww){
            	left = ev.pageX - parentOffset.left - w;
            }
            var top = ev.pageY - parentOffset.top;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(300);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $(container).bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('.jqplot-highlight').fadeOut(300);
        }
    );
}


function drawLineGraphSimple(container, dataObject, options){
	$(container).empty();
	var cid = $(container).attr("id");
	var maxy = 100;
	var maxserie = 0;
	var series = [];
	var seriesPlotConfig = [];
	
	var markerStyle = ["filledCircle","filledDiamond","filledSquare","sqaure"];
	var rendererStyle = ["solid","dashed","doted",[2,5,10,5]];
	if(dataObject.length > 1){
		$.each(dataObject, function(i,v){
			var sconf = {};
			var vv = v.series[0];
			series.push(vv);
			var vm = vv.max();
			maxserie = Math.max(maxserie, vm);
			sconf["label"] = v.labels[0].label;
			sconf["markerOptions"] = {"style":markerStyle[i]};
			sconf["linePattern"] = rendererStyle[i];
			seriesPlotConfig.push(sconf);
		});
	}else{
		var sconf = {};
		var vv = dataObject[0].series[0];
		series.push(vv);
		maxserie = vv.max();
		sconf["label"] = dataObject[0].labels[0].label;
		sconf["markerOptions"] = {"style":markerStyle[0]};
		seriesPlotConfig.push(sconf);
		
	}
	var ts = dataObject[0].ticks;
    var ticks = [];
    $.each(ts, function(i,v){
    	//if(i == 0 || i%3==0){
    		ticks.push(moment(v[1]).format('MMM YYYY'));
    	//}
    });
    
    var showTick = true;
    var ang=0;
    if(ticks.length > 24)ang=-30;
    if(maxserie < 10)maxy = 10;
    else if(maxserie > 10 && maxserie < 25)maxy = 25;
    else if(maxserie > 25 && maxserie < 50)maxy = 50;
	var plot4 = $.jqplot(cid, series, {
			highlighter: {
		        show: true,
		        showTooltip: false
		       },
		       grid: {
		           drawBorder: true,
		           borderWidth: 0.5,
		           shadow: false
		          },
		    seriesColors:options.colors,
		    seriesDefaults:{
                negativeColor: 'rgba(31,90,135,.6)',
                showMarker: true,
                showLine: true,
                fill: false,
                fillAndStroke: false,
                markerOptions: {
                    style: 'filledCircle',
                    size: 8
                },
                rendererOptions: {
                    smooth: true,
                    animation: {
                  	   speed: 2000,
                       show: true
                     }
                }
			},
			series : seriesPlotConfig,
			legend: {
		    	renderer: $.jqplot.EnhancedLegendRenderer,
		        show: true,
		        location:'s',
		        border : 'none',
		        placement: 'outsideGrid',
		        fontSize:'0.6vw',
		        rowSpacing:'0.7em',
		        background:'transparent',
		        marginRight:'5px',
		        rendererOptions: {
		            numberRows: 2,
		            numberColumns: 2,
		        }
		       },
            axes: {
                  xaxis: {
                	  ticks: ticks,
                	  drawMajorGridlines: false,
                      renderer: $.jqplot.CategoryAxisRenderer,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      numberTicks: 5,
                      tickOptions: {
                    	  show: showTick,
                          angle: ang
                      }
                  },
                  yaxis: {
                      min:0,
                      max:maxy,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      rendererOptions : {forceTickAt0: true, forceTickAt100: true },
                      tickOptions: {
                          angle: ang,
                          prefix: '',
                          formatString:"%'d%"
                      }
                  }
              }
          });

	 // capture the highlighters highlight event and show a custom tooltip.
    $(container).bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
    		//alert(ev.pageX+"   "+ev.pageY);
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
            var content = '<span>'+plot.series[seriesIndex].label+'</span><br><span>Date: <b>' + plot.series[seriesIndex]._xaxis.ticks[pointIndex] + '</b></span><br><span>Value: <b>' + data[1]+'%</b>';
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('<div>',{class:"jqplot-highlight","style":"text-align:left;position:absolute;color:#ffffff;background:"+plot.series[seriesIndex].fillColor}).appendTo($(container));
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var parentOffset = $(elem).parent().offset();
            var ww = $("#wraper").outerWidth();
            var left = ev.pageX - parentOffset.left;
            if(ev.pageX + w > ww){
            	left = ev.pageX - parentOffset.left - w;
            }
            var top = ev.pageY - parentOffset.top;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(300);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $(container).bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('.jqplot-highlight').fadeOut(300);
        }
    );
}



function drawAreaStackedGraph(container, dataObject){
	$(container).empty();
	var cid = $(container).attr("id");
	var maxy = 100;
	var maxserie = 0;
	var series = [];
	var seriesPlotConfig = [];
	
	var markerStyle = ["filledCircle","filledDiamond","filledSquare","sqaure"];
	if(dataObject.length > 1){
		$.each(dataObject, function(i,v){
			var sconf = {};
			var vv = v.series[0];
			series.push(vv);
			var vm = vv.max();
			maxserie = Math.max(maxserie, vm);
			sconf["label"] = v.labels[0].label;
			sconf["markerOptions"] = {"style":markerStyle[i]};
			seriesPlotConfig.push(sconf);
		});
	}else{
		var sconf = {};
		var vv = dataObject[0].series[0];
		series.push(vv);
		maxserie = vv.max();
		sconf["label"] = dataObject[0].labels[0].label;
		sconf["markerOptions"] = {"style":markerStyle[0]};
		seriesPlotConfig.push(sconf);
		
	}
	var ts = dataObject[0].ticks;
    var ticks = [];
    $.each(ts, function(i,v){
    	//if(i == 0 || i%3==0){
    		ticks.push(moment(v[1]).format('MMM YYYY'));
    	//}
    });
    
    var showTick = true;
    var ang=0;
    if(ticks.length > 24)ang=-30;
    if(maxserie < 10)maxy = 10;
    else if(maxserie > 10 && maxserie < 25)maxy = 25;
    else if(maxserie > 25 && maxserie < 50)maxy = 50;
	var plot4 = $.jqplot(cid, series, {
		
			highlighter: {
		        show: true,
		        showTooltip: false
		       },
		       grid: {
		           drawBorder: true,
		           borderWidth: 0.5,
		           shadow: false
		          },
		    seriesColors:['#35fc03', '#03a1fc', '#a103fc', '#fc0384', '#17BDB8'],
		    seriesDefaults:{
                negativeColor: 'rgba(31,90,135,.6)',
                showMarker: true,
                showLine: true,
                fill: false,
                fillAndStroke: false,
                markerOptions: {
                    style: 'filledCircle',
                    size: 8
                },
                rendererOptions: {
                    smooth: true
                }
			},
			series : seriesPlotConfig,
			legend: {
		    	renderer: $.jqplot.EnhancedLegendRenderer,
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
		            numberColumns: 0,
		        }
		       },
            axes: {
                  xaxis: {
                	  ticks: ticks,
                	  drawMajorGridlines: false,
                      renderer: $.jqplot.CategoryAxisRenderer,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      numberTicks: 5,
                      tickOptions: {
                    	  show: showTick,
                          angle: ang
                      }
                  },
                  yaxis: {
                      min:0,
                      max:maxy,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      rendererOptions : {forceTickAt0: true, forceTickAt100: true },
                      tickOptions: {
                          angle: ang,
                          prefix: '',
                          formatString:"%'d%"
                      }
                  }
              }
          });

	 // capture the highlighters highlight event and show a custom tooltip.
    $(container).bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
    		//alert(ev.pageX+"   "+ev.pageY);
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
    		console.log(plot);
    		console.log(data);
            var content = '<span>'+plot.series[seriesIndex].label+'</span><br><span>Date: <b>' + plot.series[seriesIndex]._xaxis.ticks[pointIndex] + '</b></span><br><span>Value: <b>' + data[1]+'%</b>';
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('<div>',{class:"jqplot-highlight","style":"text-align:left;position:absolute;background:"+plot.series[seriesIndex].fillColor}).appendTo($(container));
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var parentOffset = $(elem).parent().offset();
            var ww = $("#wraper").outerWidth();
            var left = ev.pageX - parentOffset.left;
            if(ev.pageX + w > ww){
            	left = ev.pageX - parentOffset.left - w;
            }
            var top = ev.pageY - parentOffset.top;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(300);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $(container).bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('.jqplot-highlight').fadeOut(300);
        }
    );
}


function drawPrevalenceLL(object){
	var dataObject = object.data;
	
	var serie1 = dataObject.series[0];
	var serie2 = dataObject.series[1];
	var serie3 = dataObject.series[2];
	var serie4 = dataObject.series[3];
	
	
	//console.log(serie1);
	//console.log(serie2);
	//console.log(serie3);
	//console.log(serie4);
	
	var ticks = dataObject.ticks[0];
    
	var colors = ["#ed312b","#eb9b34","#0691bf","#8304ba"];
	var filter = object.filter;
	var hasGenderFilter = false;
	var hasAgeFilter = false;
	if(filter.pandisex != "0")hasGenderFilter = true;
	if(filter.pandiage != "0")hasAgeFilter = true;
	var labels = dataObject.labels;
	
	if(!hasGenderFilter && !hasAgeFilter){
		drawDoubleLinePrevalenceGraph(object.container,[serie1,serie3],ticks,colors,labels);
	} else{
		drawDoubleLinePrevalenceGraph(object.container,[serie1,serie2,serie3,serie4],ticks,colors,labels);
	}
}

function drawIncidenceLL(object){
	var dataObject = object.data;
	
	var serie1 = dataObject.series[0];
	var serie2 = dataObject.series[1];
	var serie3 = dataObject.series[2];
	var serie4 = dataObject.series[3];
	
	
	//console.log(serie1);
	//console.log(serie2);
	//console.log(serie3);
	//console.log(serie4);
	
	var ticks = dataObject.ticks[0];
    
	var colors = ["#ed312b","#eb9b34","#0691bf","#8304ba"];
	var filter = object.filter;
	var hasGenderFilter = false;
	var hasAgeFilter = false;
	if(filter.pandisex != "0")hasGenderFilter = true;
	if(filter.pandiage != "0")hasAgeFilter = true;
	var labels = dataObject.labels;
	
	if(!hasGenderFilter && !hasAgeFilter){
		drawDoubleLineIncidenceGraph(object.container,[serie1,serie3],ticks,colors,labels);
	} else{
		drawDoubleLineIncidenceGraph(object.container,[serie1,serie2,serie3,serie4],ticks,colors,labels);
	}
}


function drawDoubleLinePrevalenceGraph(container, series, ticks, colors, labels){
	$(container).empty();
	var cid = $(container).attr("id");
    
    var ang = 0;
    if(series[0].length > 10 && $(container).width() < 1000)ang = -15;
    
    var maxvalueY1 = Math.round(series[0].max() + series[0].max()*0.1);
    var maxvalueY21 = Math.round((( series[1].max() + series[1].max()*0.3) + Number.EPSILON ) * 100 ) / 100; 
    var maxvalueY22 = 0 ;
    if(series.length > 2){
    	maxvalueY1 = Math.round(series[1].max() + series[1].max()*0.1);
    	maxvalueY21 = Math.round((( series[3].max() + series[3].max()*0.3) + Number.EPSILON ) * 100 ) / 100; 
    	maxvalueY22 = Math.round((( series[2].max() + series[2].max()*0.3) + Number.EPSILON ) * 100 ) / 100;
    }
    var maxvalueY2 = Math.max(maxvalueY21,maxvalueY22);
    //console.log(maxvalueY2);

    var seriesConfig = [
                        {
                			renderer:$.jqplot.LineRenderer,
                			highlightMouseOver: false,
                			label: labels[0],
                			color:colors[0],
                			pointLabels: { 
                					show: false,
                					location : 'n'
                				}
                		}, 
                		{
                			renderer:$.jqplot.LineRenderer,
                			linePattern: [5, 2, 1, 2, 1, 3],
                			xaxis:'xaxis', 
                			yaxis:'y2axis',
                			label:labels[2],
                			color: colors[2],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		}];
    
    if(series.length == 4){
    	seriesConfig = [
                        {
                			renderer:$.jqplot.LineRenderer,
                			highlightMouseOver: false,
                			label: labels[0],
                			color:colors[0],
                			pointLabels: { 
                					show: false,
                					location : 'n'
                				}
                		},
                		{
                			renderer:$.jqplot.LineRenderer,
                			label:labels[1],
                			color: colors[1],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		},
                		{
                			renderer:$.jqplot.LineRenderer,
                			linePattern: 'dashed',
                	        lineWidth: 2,
                			xaxis:'xaxis', 
                			yaxis:'y2axis',
                			label:labels[2],
                			color: colors[2],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		},
                		{
                			renderer:$.jqplot.LineRenderer,
                			linePattern: [5, 2, 1, 2, 1, 3],
                			xaxis:'xaxis', 
                			yaxis:'y2axis',
                			label:labels[3],
                			color: colors[3],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		}];
    }
    
    var showTick = true;
	$.jqplot(cid, series, {
		showMarker: false,
	    highlighter: {
	    	show: true,
	        showTooltip: false
	    },
		seriesDefaults:{
			rendererOptions: {
		        highlightMouseOver: true,
		        highlightMouseDown: false,
		        highlightColor: null,
		    }
		},
		grid: {
	        drawBorder: true,
	        borderWidth: 1,
	        shadow: false
	       },
	       
	    legend: {
	       	renderer: $.jqplot.EnhancedLegendRenderer,
	           show: true,
	           location:'s',
	           placement: 'outsideGrid',
	           fontSize:'0.6vw',
	           rowSpacing:'0.7em',
	           border: 'none',
	           background:'transparent',
	           marginRight:'5px',
	           rendererOptions: {
	               numberRows: 1
	           }
	        },
            series:seriesConfig,
            axes: {
                  xaxis: {
                	  ticks: ticks,
                	  renderer: $.jqplot.CategoryAxisRenderer,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      tickOptions: {
                          angle: ang,
                          show:showTick
                      }
                  },
                  yaxis: {
                	  min:0,
                	  max: maxvalueY1,
                	  label:'Existing cases',
                      tickOptions: {
                        showGridline: false,
                        formatString : "%'d",
                        suffix: ' '
                      },
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                  },
                  y2axis: {
                	  min:0,
                	  max: maxvalueY2,
                	  tickRenderer:$.jqplot.CanvasAxisTickRenderer,
                	  label:'Prevalence',
                      tickOptions: {
                        showGridline: false,
                        formatString:'%.2f%',
                        suffix: ' '
                      },
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                  }
              }
          });
	
	// capture the highlighters highlight event and show a custom tooltip.
    $(container).bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
    		//alert(ev.pageX+"   "+ev.pageY);
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
            var content = '<span><b>'+plot.series[seriesIndex].label + '</b></span><br><span>Date: <b>' + plot.series[seriesIndex]._xaxis.ticks[pointIndex] + '</b></span><br><span>Value: <b>' + data[1]+'</b> ';
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('<div>',{class:"jqplot-highlight","style":"position:absolute"}).appendTo($(container));
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var parentOffset = $(elem).parent().offset();
            var ww = $("#wraper").outerWidth();
            var left = ev.pageX - parentOffset.left;
            if(ev.pageX + w > ww){
            	left = ev.pageX - parentOffset.left - w;
            }
            var top = ev.pageY - parentOffset.top;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(300);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $(container).bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('.jqplot-highlight').fadeOut(300);
        }
    );
}


function drawDoubleLineIncidenceGraph(container, series, ticks, colors, labels){
	$(container).empty();
	var cid = $(container).attr("id");
    
    var ang = 0;
    if(series[0].length > 10 && $(container).width() < 1000)ang = -15;
    
    var maxvalueY1 = Math.round(series[0].max() + series[0].max()*0.1);
    var maxvalueY21 = Math.round((( series[1].max() + series[1].max()*0.3) + Number.EPSILON ) * 1000 ) / 1000;
    var maxvalueY22 = 0;
    if(series.length > 2){
    	maxvalueY1 = Math.round(series[1].max() + series[1].max()*0.1);
    	maxvalueY21 = Math.round((( series[3].max() + series[3].max()*0.3) + Number.EPSILON ) * 1000 ) / 1000;
    	maxvalueY22 = Math.round((( series[2].max() + series[2].max()*0.3) + Number.EPSILON ) * 1000 ) / 1000;
    }
    var maxvalueY2 = Math.max(maxvalueY21,maxvalueY22);
    //console.log(maxvalueY2);

    var seriesConfig = [
                        {
                			renderer:$.jqplot.LineRenderer,
                			highlightMouseOver: false,
                			label: labels[0],
                			color:colors[0],
                			pointLabels: { 
                					show: false,
                					location : 'n'
                				}
                		}, 
                		{
                			renderer:$.jqplot.LineRenderer,
                			linePattern: [5, 2, 1, 2, 1, 3],
                			xaxis:'xaxis', 
                			yaxis:'y2axis',
                			label:labels[2],
                			color: colors[2],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		}];
    
    if(series.length == 4){
    	seriesConfig = [
                        {
                			renderer:$.jqplot.LineRenderer,
                			highlightMouseOver: false,
                			label: labels[0],
                			color:colors[0],
                			pointLabels: { 
                					show: false,
                					location : 'n'
                				}
                		},
                		{
                			renderer:$.jqplot.LineRenderer,
                			label:labels[1],
                			color: colors[1],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		},
                		{
                			renderer:$.jqplot.LineRenderer,
                			linePattern: 'dashed',
                	        lineWidth: 2,
                			xaxis:'xaxis', 
                			yaxis:'y2axis',
                			label:labels[2],
                			color: colors[2],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		},
                		{
                			renderer:$.jqplot.LineRenderer,
                			linePattern: [5, 2, 1, 2, 1, 3],
                			xaxis:'xaxis', 
                			yaxis:'y2axis',
                			label:labels[3],
                			color: colors[3],
                			pointLabels: { 
                				show: false,
            					location : 's' }
                		}];
    }
    
    var showTick = true;
	$.jqplot(cid, series, {
		showMarker: false,
	    highlighter: {
	    	show: true,
	        showTooltip: false
	    },
		seriesDefaults:{
			rendererOptions: {
		        highlightMouseOver: true,
		        highlightMouseDown: false,
		        highlightColor: null,
		    }
		},
		grid: {
	        drawBorder: true,
	        borderWidth: 1,
	        shadow: false
	       },
	       
	    legend: {
	       	renderer: $.jqplot.EnhancedLegendRenderer,
	           show: true,
	           location:'s',
	           placement: 'outsideGrid',
	           fontSize:'0.6vw',
	           rowSpacing:'0.7em',
	           border: 'none',
	           background:'transparent',
	           marginRight:'5px',
	           rendererOptions: {
	               numberRows: 1
	           }
	        },
            series:seriesConfig,
            axes: {
                  xaxis: {
                	  ticks: ticks,
                	  renderer: $.jqplot.CategoryAxisRenderer,
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                      tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                      tickOptions: {
                          angle: ang,
                          show:showTick
                      }
                  },
                  
                  yaxis: {
                	  min:0,
                	  max: maxvalueY1,
                	  label:'New cases',
                      tickOptions: {
                        showGridline: false,
                        formatString : "%'d",
                        suffix: ' '
                      },
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                  },
                  y2axis: {
                	  min:0,
                	  max: maxvalueY2,
                	  tickRenderer:$.jqplot.CanvasAxisTickRenderer,
                	  label:'Incidence',
                      tickOptions: {
                        showGridline: false,
                        formatString:'%.2f%',
                        suffix: ' '
                      },
                      labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                  }
              }
          });
	
	// capture the highlighters highlight event and show a custom tooltip.
    $(container).bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
    		//alert(ev.pageX+"   "+ev.pageY);
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
            var content = '<span><b>'+plot.series[seriesIndex].label + '</b></span><br><span>Date: <b>' + plot.series[seriesIndex]._xaxis.ticks[pointIndex] + '</b></span><br><span>Value: <b>' + data[1]+'</b> ';
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('<div>',{class:"jqplot-highlight","style":"position:absolute"}).appendTo($(container));
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var parentOffset = $(elem).parent().offset();
            var ww = $("#wraper").outerWidth();
            var left = ev.pageX - parentOffset.left;
            if(ev.pageX + w > ww){
            	left = ev.pageX - parentOffset.left - w;
            }
            var top = ev.pageY - parentOffset.top;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(300);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $(container).bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('.jqplot-highlight').fadeOut(300);
        }
    );
}


