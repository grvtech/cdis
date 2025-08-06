function loadGraph2(){
	  var ajaxDataRenderer = function(url, plot, options) {
	    var ret = null;
	    $.ajax({
	      async: false,
	      url: "/ncdis/service/data/diabetByType",
	      dataType: "json",
	      data: {
			language: "en",
			sid: sid
	      },
	      success: function(data) {
	        ret = data.objs;
	      }
	    });
	    return ret;
	  };
	 var jsonurl = "/ncdis/service/data/diabetByType";
	  // passing in the url string as the jqPlot data argument is a handy
	  // shortcut for our renderer.  You could also have used the
	  // "dataRendererOptions" option to pass in the url.
	  var plot2 = $.jqplot('chart2', jsonurl,{
	    title: "Cree  diabetes population by community",
	    animate: true,
	    grid:{backgroundColor: 'rgba(254, 254, 254, 0.5)', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},
	    seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {fillToZero: true}
        },
        series:[
                {label:'Men'},
                {label:'Women'}
            ],
        legend: {
            show: true,
           /* placement : 'outsideGrid',*/
            location: 'nw'
        },
        axesDefaults: {
            tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
            tickOptions: {
              angle: -15,
              fontSize: '8pt'
            }
        },
        axes: {
          xaxis: {
            renderer: $.jqplot.CategoryAxisRenderer
          }
        },
       dataRenderer: ajaxDataRenderer,
       dataRendererOptions: {
	      unusedOptionalUrl: jsonurl
	    }
	   
	  });
}



function loadGraph1(targetDivId){
	 // Our ajax data renderer which here retrieves a text file.
	  // it could contact any source and pull data, however.
	  // The options argument isn't used in this renderer.
	  var ajaxDataRenderer = function(url, plot, options) {
	    var ret = null;
	    $.ajax({
	      // have to use synchronous here, else the function 
	      // will return before the data is fetched
	      async: false,
	      url: "/ncdis/service/data/diabetByCommunity",
	      dataType: "json",
	      data: {
			language: "en",
			graphtype: "pyramid",
			sid: sid
	      },
	      success: function(data) {
	        ret = data.objs;
	      }
	    });
	    return ret;
 };
	 
	
	  
     // Custom color arrays are set up for each series to get the look that is desired.
     // Two color arrays are created for the default and optional color which the user can pick.
     var greenColors = ["#526D2C", "#77933C", "#C57225", "#C57225"];
     var blueColors = ["#3F7492", "#FA96DC", "#C57225", "#C57225"];
     var data = ajaxDataRenderer();
     var series = data[0];
     var ticksC = data[1];
     // To accomodate changing y axis, need to keep track of plot options.
     // changing axes will require recreating the plot, so need to keep 
     // track of state changes.
     var plotOptions = {
         // We set up a customized title which acts as labels for the left and right sides of the pyramid.
         title: '<div style="float:left;width:50%;text-align:center">Male</div><div style="float:right;width:50%;text-align:center">Female</div>',
	         // by default, the series will use the green color scheme.
	         seriesColors: blueColors,
	         
	         grid: {
	             drawBorder: false,
	             shadow: false,
	             backgroundColor: 'rgba(254, 254, 254, 0.5)',
	             rendererOptions: {
	                 // plotBands is an option of the pyramidGridRenderer.
	                 // it will put banding at starting at a specified value
	                 // along the y axis with an adjustable interval.
	                 plotBands: {
	                     show: false,
	                     interval: 2
	                 }
	             },
	         },
	  
	         // This makes the effective starting value of the axes 0 instead of 1.
	         // For display, the y axis will use the ticks we supplied.
	         defaultAxisStart: 0,
	         seriesDefaults: {
	             renderer: $.jqplot.PyramidRenderer,
	             rendererOptions: {
	                 barPadding: 4
	             },
	             yaxis: "yMidAxis",
	             shadow: false
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
	                 yaxis: "yMidAxis",
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
	                 label: "Community",
	                 // Use canvas label renderer to get rotated labels.
	                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	                 // include empty tick options, they will be used
	                 // as users set options with plot controls.
	                 tickOptions: {},
	                 showMinorTicks: true,
	                 ticks: ticksC,
	                 rendererOptions: {
	                     category: true,
	                     baselineWidth: 2
	                 }
	             },
	             
	             yMidAxis: {
	                 label: "Community",
	                 // include empty tick options, they will be used
	                 // as users set options with plot controls.
	                 tickOptions: {},
	                 showMinorTicks: true,
	                 ticks: ticksC,
	                 rendererOptions: {
	                     category: true,
	                     baselineWidth: 2
	                 }
	             },
	             y2axis: {
	                 label: "Community",
	                 // Use canvas label renderer to get rotated labels.
	                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	                 // include empty tick options, they will be used
	                 // as users set options with plot controls.
	                 tickOptions: {},
	                 showMinorTicks: true,
	                 ticks: ticksC,
	                 rendererOptions: {
	                     category: true,
	                     baselineWidth: 2
	                 }
	             }
	         }
	     };
	 
     	$("#predefined-report-data").append($("<table>",{id:"data-table1",cellpadding:3,cellspacing:0}));
     	$("#predefined-report-data").append($("<table>",{id:"data-table2",cellpadding:3,cellspacing:0}));
     	
     	$("#data-table1").append($("<tr>").append($("<th>",{class:"diabet-total"}).text("Type 1 & Type 2 Patients")).append($("<th>",{class:"sex-ratio"}).text("Male to Female Ratio")));
     	$("#data-table1").append($("<tr>").append($("<td>",{class:"diabet-total"})).append($("<td>",{class:"sex-ratio"})));
     	
     	$("#data-table2").append($("<tr>").append($("<th>").text("Community")).append($("<td>",{class:"inter-community"}).append(
     			$("<select>",{class:"graph-generic-select"})
     	)));
     	$.each($(community),function(index,value){
			$(".graph-generic-select").append($("<option>",{value:index,text:value}));	
		});

     	$(".graph-generic-select").change(function(){
     		 $('.inter-male').stop(true, true).fadeIn(350).text(getPatientNumber(data,  $(this).find('option:selected').text(), "male"));
             $('.inter-female').stop(true, true).fadeIn(350).html(getPatientNumber(data, $(this).find('option:selected').text(), "female"));
     	});
     	
     	$("#data-table2").append($("<tr>").append($("<th>").text("Female patients")).append($("<td>",{class:"inter-female"})));
     	$("#data-table2").append($("<tr>").append($("<th>").text("Male patients")).append($("<td>",{class:"inter-male"})));
     
     
     	$('td.diabet-total').each(function(index) {
           $(this).html($.jqplot.sprintf("%'d", getPatientNumber(data)));
     	});

        $('td.sex-ratio').each(function(index) {
        	var nomale = getPatientNumber(data, null, "male");
        	var nofemale = getPatientNumber(data, null, "female");
            $(this).html($.jqplot.sprintf("%2.2f", (nomale/nofemale)));
        });

       
        
        var plot1 = $.jqplot(targetDivId, series, plotOptions);
        /*
        // bind to the data highlighting event to make custom tooltip:
        $(".jqplot-target").each(function(index){
            $(this).bind("jqplotDataHighlight", function(evt, seriesIndex, pointIndex, data) {
                var plot = $(this).data('jqplot');
                var malePopulation = series[0][pointIndex];
                var femalePopulation = series[1][pointIndex];
                $('.inter-community').stop(true, true).fadeIn(350).text(ticksC[pointIndex]);
                $('.inter-male').stop(true, true).fadeIn(350).text(malePopulation);
                $('.inter-female').stop(true, true).fadeIn(350).html(femalePopulation);
            });
        });
        // bind to the data highlighting event to make custom tooltip:
        $(".jqplot-target").each(function() {
            $(this).bind("jqplotDataUnhighlight", function(evt, seriesIndex, pointIndex, data) {
                // clear out all the tooltips.
                $(".tooltip-item").fadeOut(250);
            });
        });
	   */
}


function getPatientNumber(arrayData, community, sex, graphtype){
	var series = arrayData[0];
	var ticks = arrayData[1];
	var result = 0;
	if(graphtype == null){
		graphtype = "pyramid"; //by default
	}
	
	//2 series male - female calculate all patients 
	//each serie has [label - community, value] 
	// first serie is male second is female
	var males = series[0];
	var females = series[1];
	for(var i=0;i<males.length;i++){
		var pairmale = males[i];
		var pairfemale = females[i];
		if(community == null && sex == null){
			if(graphtype == "pyramid" ){
				result += pairmale*1;
				result += pairfemale*1;
			}else{
				result+=pairmale[1]*1;
				result+=pairfemale[1]*1;
			}
		}else if(community != null && sex == null){
			if(graphtype == "pyramid" ){
				if(ticks[i] == community){
					result += pairmale*1;
					result += pairfemale*1;
				}
			}else{
				if(pairmale[0] == community){
					result+=pairmale[1]*1;
					result+=pairfemale[1]*1;
				}
			}
			
		}else if(community == null && sex != null){
			if(sex == "male"){
				if(graphtype == "pyramid" ){
					result+=pairmale*1;
				}else{
					result+=pairmale[1]*1;
				}
			}else{
				if(graphtype == "pyramid" ){
					result+=pairfemale*1;
				}else{
					result+=pairfemale[1]*1;
				}
			}
		}else{
			if(ticks[i] == community){
				if(sex == "male"){
					if(graphtype == "pyramid" ){
						result+=pairmale*1;
					}else{
						result+=pairmale[1]*1;
					}
				}else{
					if(graphtype == "pyramid" ){
						result+=pairfemale*1;
					}else{
						result+=pairfemale[1]*1;
					}
					
				}
			}
		}
	}
	return result.toFixed();
}


function loadGraph3(){
	  var ajaxDataRenderer = function(url, plot, options) {
	    var ret = null;
	    $.ajax({
	      async: false,
	      url: "/ncdis/service/data/diabetByCommunity",
	      dataType: "json",
	      data: {
			language: "en",
			graphtype : "pyramid",
			sid: sid
	      },
	      success: function(data) {
	        ret = data.objs;
	      }
	    });
	    return ret;
	  };
	 var data = ajaxDataRenderer();
	 var series = data[0];
	 
	 var men = series[0].sum();
	 var women = series[1].sum();
	  // passing in the url string as the jqPlot data argument is a handy
	  // shortcut for our renderer.  You could also have used the
	  // "dataRendererOptions" option to pass in the url.
	 plot3 = jQuery.jqplot('chart3',[[["Male",men],["Female",women]]] , 
			    {
			      title: 'Diabetes patients Male - Female Ratio',
			      grid:{backgroundColor: 'rgba(236, 236, 236, 0.5)', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},
			      seriesDefaults: {
			        shadow: false,
			        seriesColors: [ "#4bb2c5", "#c5b47f", "#EAA228", "#579575" ],
			        renderer: jQuery.jqplot.PieRenderer, 
			        rendererOptions: { 
			          sliceMargin: 4, 
			          showDataLabels: true
			        } 
			      }, 
			      legend: { show:true, location: 'e' }
			    }
			  );

}

function loadGraph4(){
	
	 var ajaxDataRenderer = function(url, plot, options) {
		    var ret = null;
		    $.ajax({
		      async: false,
		      url: "/ncdis/service/data/diabetByYear",
		      dataType: "json",
		      data: {
				language: "en",
				years : 5,
				sid: sid
		      },
		      success: function(data) {
		        ret = data.objs;
		      }
		    });
		    return ret;
		  };
		 var data = ajaxDataRenderer();
		 var series = data[0];
		 var dataset = data[1];
	
	var plot2 = $.jqplot ('chart4', dataset, {
	      title: 'Diabetes patients - last five years',
	      grid:{backgroundColor: 'rgba(236, 236, 236, 0.5)', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},
	      axesDefaults: {
	    	  labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	    	  
	    	  },
	      seriesDefaults: {
	          rendererOptions: {
	              smooth: true,
	              fillToZero: true
	          },
	          tickOptions: {
	              mark: 'outside',    // Where to put the tick mark on the axis
	                                  // 'outside', 'inside' or 'cross',
	              showMark: true,
	              showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
	              markSize: 4,        // length the tick will extend beyond the grid in pixels.  For
	                                  // 'cross', length will be added above and below the grid boundary,
	              show: true,         // wether to show the tick (mark and label),
	              showLabel: true,    // wether to show the text label at the tick,
	              formatString: '',   // format string to use with the axis tick formatter
	          }
	    	  
	      },
	      series:series,
	        legend: {
	            show: true,
	            placement : 'outsideGrid',
	            location: 'ne'
	        },
	      axes: {
	        xaxis: {
	        	label: "Years",
	        	renderer:$.jqplot.CategoryAxisRenderer,
	        	pad: 0
	        },
	        yaxis: {label: "Number of Patients"}
	      }
	    });
	
}


function loadGraphABC(divStr, values, labels, title, value){
	var limits = getValueLimits(value);
	var $gr = $("<div>", {id: divStr}).addClass("abcgraph").appendTo($("#abcgraphs-container"));
	if(!$(divStr).hasClass("jqplot-target")){
		var series = [];
		var ten = 10;
		var lastvalues = [];
		if(values.length < 10){ten = values.length;}
		 for(var i=0;i<ten;i++){
			 var serie = [labels[i],Number(values[i])];
			 series.push(serie);
			 lastvalues.push(values[i]);
		 }
		 var arrLimits = [];
		 var minNum = lastvalues.min();
		 var maxNum = lastvalues.max();
		 var ismax = false;
		 var ismin = false;
		 if(limits.maxvalue != "undefined"){
			 var maxLimitObj = { rectangle: { ymin: Number(limits.maxvalue), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: "rgba(255, 0, 0, 0.5)", showTooltip: true, tooltipFormatString: "Critical High" } };
			 arrLimits.push(maxLimitObj);
			 ismax = true;
			 
		 }
		 if(limits.minvalue != "undefined"){
			 var minLimitObj = { rectangle: { ymax: Number(limits.minvalue), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: "rgba(255, 165, 0, 0.5)", showTooltip: true, tooltipFormatString: "Abnormal Low" } };
			 arrLimits.push(minLimitObj);
			 ismin = true;
		 }
		 
		 if(ismax && ismin){
			 var normLimitObj = { rectangle: {ymin:Number(limits.minvalue), ymax: Number(limits.maxvalue), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: "rgba(102, 255, 0, 0.5)", showTooltip: true, tooltipFormatString: "Critical High" } };
			 arrLimits.push(normLimitObj);
		 }
		 
		 
		 if(limits.startvalue != "undefined"){
			 if(limits.startvalue < minNum){
				 minNum = limits.startvalue;
			 }
		 }
		 if(limits.endvalue != "undefined"){
				if(limits.endvalue > maxNum){
					var r = limits.endvalue / maxNum;
					if(r > 10){
						maxNum = maxNum *1.2;
					}else{
						maxNum = limits.endvalue;
					}
					
				}
		 }
		 
		 
		 var fs = "%.2f";
		 if (value == "acratio"){
			 fs = "%.1f";
		 }else if(value == "hba1c"){
			 fs = "%.3f";
		 }
		if(series.length > 1 ){
			var plot = jQuery.jqplot(divStr,[series], {
				 title:title,
				 grid:{backgroundColor: 'rgba(255, 255, 255, 1)', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},
				 seriesDefaults: {
					 rendererOptions: {smooth: false},
					 pointLabels:{ show:true, location:'ne', ypadding:7, edgeTolerance: 7 }
				 },
			     axes:{
			            xaxis:{renderer:$.jqplot.DateAxisRenderer,rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer},tickOptions:{fontSize:'10pt',fontFamily:'Sans-serif'}},
			            yaxis:{rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer},tickOptions:{fontSize:'10pt',fontFamily:'Sans-serif',formatString: fs}, min:Number(minNum), max:Number(maxNum) }
			        },
			     canvasOverlay: {
			            show: true,
			            objects: arrLimits
			          }, 
		        series:[{lineWidth:2, markerOptions:{ style:'filledCircle', color:"#000000" },neighborThreshold: -1,color:'#4d4d4d'}],
		        highlighter: {show: true,sizeAdjust: 7.5},
		        cursor:{show: true}
				});
			 $.jqplot.postDrawHooks.push(function() {
				 	//	alert($('.jqplot-overlayCanvas-canvas').length + "    "+ $('.jqplot-series-canvas').length);
				 	for(var i=0;i<$('.jqplot-overlayCanvas-canvas').length;i++){
				 		var overlayCanvas = $($('.jqplot-overlayCanvas-canvas')[i]);
					    var seriesCanvas = $($('.jqplot-series-canvas')[i]);
					    seriesCanvas.detach();
					    overlayCanvas.after(seriesCanvas);
				 	}
			});
		}
	}
}

function loadGraph(divStr, values, labels, title, limits, valueName){
	$("#"+divStr).empty();
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
							 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymin:Number(val.min), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: true, tooltipFormatString: val.title } };
						 }else if(idx == limits.stages.length-1){
							 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymax: Number(val.max),xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: true, tooltipFormatString: val.title } }; 
						 }else{
							 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymax: Number(val.max),ymin:Number(val.min), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: true, tooltipFormatString: val.title } };
						 }
						 arrLimits.push(limitObj);
					 });
					
			 }

			minNum = Number(minNum); 
			maxNum = Number(maxNum);

			 
			 $.jqplot.postDrawHooks.push(function() {
				 	for(var i=0;i<$('.jqplot-overlayCanvas-canvas').length;i++){
				 		var overlayCanvas = $($('.jqplot-overlayCanvas-canvas')[i]);
					    var seriesCanvas = $($('.jqplot-series-canvas')[i]);
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
			            xaxis:{renderer:$.jqplot.DateAxisRenderer,rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickInset:0.2},tickOptions:{fontSize:'9pt',textColor:'#000000',fontFamily:'Sans-serif',show:true,formatString:'%b-%Y',angle:-10,markSize:8}},
			            yaxis:{rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickInset:0.5},tickOptions:{fontSize:'9pt',textColor:'#000000',fontFamily:'Sans-serif',show:true,formatString: fs,markSize:2},min:Number(minNum),max:Number(maxNum)}
			        },
			     canvasOverlay: {
			            show: true,
			            objects: arrLimits
			          }, 
		        series:[{lineWidth:3,markerOptions:{style:'filledCircle', color:'#cdcdcd',size:7 },color:'#4d4d4d'}],
		        
		        highlighter: {
		        	show: true,sizeAdjust: 10,tooltipLocation:'n',tooltipOffset:2,
		        	formatString:'<table class="jqplot-highlighter" border="0"><tr><td>Date:</td><td>%s</td></tr><tr><td>Value:</td><td>%s</td></tr></table>'},
		        cursor:{
		        	show: true,
		        	showTooltip:false
		        	}
				});
				
			 if(limits != null){
				 var co = plot.plugins.canvasOverlay;
				 $.each(limits.stages,function(ii,vv){
					 var lineN = co.get('stage-'+valueName+'-'+ii);
					 var normLabel = lineN.gridStop[1]+11;
					 $('<div class="my-jqplot-normal-title" style="top:'+normLabel+'px;">'+vv.title+'</div>').insertBefore('#'+divStr+' .jqplot-overlayCanvas-canvas');
				 });
			 }
			
		}else{
			$("#"+divStr).html("<p class='text-center'>No data for "+valueName+"<br>Please use <span class='cisbutton'><i class='fa fa-plus' aria-hidden='true'></i></span> button to add new data.</p>");
		}/* end values lenght check */
		
}


function loadBMI(mdvisitObj){
	//BMI = ( Weight in Kilograms / ( Height in Meters x Height in Meters ) ) 
	var weightLast =mdvisitObj.weight.values[0].value;
	var heightLast = mdvisitObj.height.values[0].value;
	if(weightLast != null && heightLast != null){
		var all = 140; 
		var bmi = Number(weightLast)/ (heightLast*0.01 *heightLast*0.01);
		
		$("<div>",{class:"bmicontainer"}).append($("<div>",{class:"bmititle"}).text("BMI"))
				.append(
						$("<div>",{class:"bmi"})
							.append(
									$("<div>",{class:"bmilabels"})
										.append($("<div>",{class:"bmilabel"}).text("Underweight").css("top","144px"))
										.append($("<div>",{class:"bmilabel"}).text("Normal").css("top","100px"))
										.append($("<div>",{class:"bmilabel"}).text("Overweight").css("top","55px"))
										.append($("<div>",{class:"bmilabel"}).text("Obesity").css("top","20px"))
							)
							.append($("<div>",{class:"bmitermo"}))
							.append(
									$("<div>",{class:"bmiarrow"})
										.append($("<div>",{class:"bmivirf"}))
										.append($("<div>",{class:"bmivalue"}).text(bmi.trimNum(1)))
							)
				)
				.appendTo($(".pageside"));
		if(bmi < 18.5){
			$(".bmiarrow").css("top","140px");
		}else if(bmi >= 18.5 && bmi < 25){
			//120 70
			var b =  all - 30 - ((bmi*100)/25)*0.01*50;
			$(".bmiarrow").css("top",b+"px");
		}else if(bmi >= 25 && bmi < 30){
			var b = all - 50 - ((bmi*100)/30)*0.01*65;
			$(".bmiarrow").css("top",b+"px");
		}else{
			$(".bmiarrow").css("top","5px");
		}
	}
}



function extractSerieFromObject(sectionObject, valueName, values){
	var obj = eval("sectionObject."+valueName);
	result = [];
	var i=0;
	$.each(obj.values, function(key, value) {
		if(i<values){
			var pair = [value.date,Number(value.value)];
			result.push(pair);
		}
		i++;
	});
	return result;
}


function createValueButton(section, valueName, valueObj){
	var $ds = $("#lsection_"+section+"_"+valueName);
	var $ds_button_container = $("#lsection_"+section+"_"+valueName+" .section-line-buttons");
	if($("#lsection_"+section+"_"+valueName+" .section-line-buttons").length == 0){
		$ds_button_container = $("<div>", {class: "section-line-buttons"}).appendTo($ds);		
	}
		
		
		if(valueObj.vtype == "radio" || valueObj.vtype == "date"){
			if(valueObj.vtype == "date"){
				if(valueObj.idvalue != 0 ){
					$ds_button_table = $("<div>",{class:"section-button uss",id:"button-table-"+valueName,title:"Modify date of diagnosis"}).html("<i class='fa fa-pencil'></i>").appendTo($ds_button_container);
					$ds_button_table.click(function(){
						$("#data_"+valueName).empty();
						if($("#button-table-"+valueName).hasClass("section-button-selected")){
							$("#button-table-"+valueName).removeClass("section-button-selected");
							$("#button-add-"+valueName).removeClass("section-button-selected");
						}else{
							$("#button-table-"+valueName).addClass("section-button-selected");
							$("#button-add-"+valueName).removeClass("section-button-selected");
							createValueTable(section, valueName, valueObj);
						}
					});
				}else{
					$ds_button_add = $("<div>",{class:"section-button uss",id:"button-add-"+valueName, title:"Add date of diagnosis"}).html("<i class='fa fa-plus'></i>").appendTo($ds_button_container);
					$ds_button_add.click(function(){
						
						$("#data_"+valueName).empty();
						if($(this).hasClass("section-button-selected")){
							$(this).removeClass("section-button-selected");
							$("#button-table-"+valueName).removeClass("section-button-selected");
						}else{
							$(this).addClass("section-button-selected");
							$("#button-table-"+valueName).removeClass("section-button-selected");
							createValueTable(section, valueName, valueObj);
						}
					});
				}
			}
			
			if(valueObj.vtype == "radio"){
				$ds_button_table = $("<div>",{class:"section-button uss",id:"button-table-"+valueName, title:"Modify data"}).html("<i class='fa fa-pencil'></i>").appendTo($ds_button_container);
				$ds_button_table.click(function(){
					$("#data_"+valueName).empty();
					if($("#button-table-"+valueName).hasClass("section-button-selected")){
						$("#button-table-"+valueName).removeClass("section-button-selected");
					}else{
						$("#button-table-"+valueName).addClass("section-button-value-selected");
						createValueTable(section, valueName, valueObj);
					}
				});
			}
			
		}else{
			//type == text
			if(valueObj.idvalue != 0){

				$ds_button_table = $("<div>",{class:"section-button uss",id:"button-table-"+valueName, title:"See data in table"}).html("<i class='fa fa-table'></i>").appendTo($ds_button_container);
				$ds_button_table.click(function(){
					$("#data_"+valueName).empty();
					if($("#button-table-"+valueName).hasClass("section-button-selected")){
						$("#button-table-"+valueName).removeClass("section-button-selected");
						$("#button-add-"+valueName).removeClass("section-button-selected");
					}else{
						$("#button-table-"+valueName).addClass("section-button-selected");
						$("#button-add-"+valueName).removeClass("section-button-selected");
						createValueTable(section, valueName, valueObj);
					}
				});
				
				$ds_button_add = $("<div>",{class:"section-button uss",id:"button-add-"+valueName, title:"Add new value"}).html("<i class='fa fa-plus'></i>").appendTo($ds_button_container);
				$ds_button_add.click(function(){
					$("#data_"+valueName).empty();
					if($(this).hasClass("section-button-selected")){
						$(this).removeClass("section-button-selected");
						$("#button-table-"+valueName).removeClass("section-button-selected");
					}else{
						$(this).addClass("section-button-selected");
						$("#button-table-"+valueName).removeClass("section-button-selected");
						createValueAdd(section, valueName, valueObj);
					}
				});
				
			}else{
				$ds_button_add = $("<div>",{class:"section-button uss",id:"button-add-"+valueName, title:"Add new value"}).html("<i class='fa fa-plus'></i>").appendTo($ds_button_container);
				$ds_button_add.click(function(){
					$("#data_"+valueName).empty();
					if($(this).hasClass("section-button-selected")){
						$(this).removeClass("section-button-selected");
					}else{
						$(this).addClass("section-button-selected");
						createValueAdd(section, valueName, valueObj);
					}
				});
			}
		}
}

function drawValueGraph(section, valueName, valueObj, subsection){
	var md = moment(valueObj.date);
	var $ds = $("#lsection_"+section+"_"+valueName);
	
	if(subsection != null){
		if($ds.length == 0){
			$ds = $("<div>", {id: "lsection_"+section+"_"+valueName}).addClass("section-line").appendTo($("#lsection_"+section+"_"+subsection));
		}
	}else{
		if($ds.length == 0){
			$ds = $("<div>", {id: "lsection_"+section+"_"+valueName}).addClass("section-line").appendTo($("#lsection_"+section));
		}
	}

	$ds.empty();
	
	//createLineHeader(section, valueName, valueObj);
	createValueHeader(section, valueName, valueObj);
	createValueButton(section, valueName, valueObj);
	//createLineButton(section, valueName, valueObj, valueLimitsObj);
	//createLineGraph(section, valueName, valueObj, valueLimitsObj);
	
	/*
	var $ds_container = $("<div>").appendTo($ds).addClass("section-value-container");
	var $ds_title = $("<div>", {class: "value-title-container"}).appendTo($ds_container);
	var $ds_title_title = $("<div>", {class: "value-title"}).text(valueObj.name).appendTo($ds_title);
	
	if(valueObj.unit != null ){
		
		var $ds_title_date = $("<div>", {class: "value-date"}).text(valueObj.unit).appendTo($ds_title);
	}

	var $ds_graph = $("<div>", {class: "value-graph-container"}).appendTo($ds_container);
	
	
	
	if(valueObj.idvalue == 0){
		$("<div>").appendTo($ds_graph).addClass("value-graph-container-value").text("[NA]");
	}else{
		var $ds_graph_value = $("<div>").appendTo($ds_graph).addClass("value-graph-container-value");
		if(valueObj.vtype == "radio"){
			$ds_graph_value.text(eval(valueObj.code+"["+valueObj.value+"]"));
		}else if(valueObj.vtype == "date"){
			$ds_graph_value.text(valueObj.date).css("font-size","120%");
		}else{
			if(  typeof(window[valueObj.code+"_values"])  != "undefined" ){
 				var vob = eval(valueObj.code+"_values");
				$ds_graph_value.text(vob[valueObj.value]);
			}else{
				$ds_graph_value.text(valueObj.value);
			}
			
		}
	}
	*/
}

function drawLineGraph(section, valueName, valueObj, valueLimitsObj){
	$("#lsection_"+section+"_"+valueName).empty();
	//var $ds_line = $("<div>").appendTo($("#lsection_"+section+"_"+valueName)).addClass("section-line-line");
	
	
	createLineHeader(section, valueName, valueObj);
	createLineButton(section, valueName, valueObj, valueLimitsObj);
	createLineGraph(section, valueName, valueObj, valueLimitsObj);
	
	/*
	if(valueObj.idvalue != "0"){
		createLine(section, valueName, valueObj, valueLimitsObj);
	}else{
		createLineEmpty(section, valueName, valueObj, valueLimitsObj);
	}
	*/
	//if value = weight close the graph before display
	if(valueName == "weight"){
		$("#button-control-weight").click();
	}
}



/*prima functie */
function drawValue(section, valueName, valueObj, valueLimitsObj, subsection){
	var $dsection = $("#lsection_"+section);
	if(subsection != null){
		var dsubsection = $("#lsection_"+section+"_"+subsection);
		if(dsubsection.length == 0){
			var dsubsection = $("<div>",{class:"subsection-container"});
			var subIndex = subsection.substring(subsection.indexOf("-")+1);
			var subcontt = $("<div>",{class:"subsection-title"}).text(capitalizeFirstLetter(section)+" Group "+subIndex);
			var subsec = $("<div>",{id:"lsection_"+section+"_"+subsection,class:"subsection"});
			$(dsubsection).append(subcontt);
			$(dsubsection).append(subsec);
			
			$("#lsection_"+section+" section").append(dsubsection);
			if($("#lsection_"+section+"_"+valueName).length == 0){
				 $("<div>",{id:"lsection_"+section+"_"+valueName,class:"section-line"}).appendTo(subsec);
			}
		}
		if(valueObj.vtype == "int" || valueObj.vtype == "double"){
			drawLineGraph(section, valueName, valueObj, valueLimitsObj, subsection);
		}else{
			drawValueGraph(section, valueName, valueObj, subsection);
		}
	}else{
		if($("#lsection_"+section+"_"+valueName).length == 0){
			 $("<div>",{id:"lsection_"+section+"_"+valueName,class:"section-line"}).appendTo($("#lsection_"+section+" section"));
		}
		if(valueObj.vtype == "int" || valueObj.vtype == "double"){
			drawLineGraph(section, valueName, valueObj, valueLimitsObj);
		}else{
			drawValueGraph(section, valueName, valueObj);
		}
	}
	initPage();
}




function createHistory(section, valueName, valueLimitsObj){
	var objValueArray = getValueSectionArray(section,valueName,patientObjArray);
	var values = [];
	var labels = [];
	$(objValueArray).each(function( index ) {
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
		$("#graph-"+valueName).hide();
	}
}


function createHistoryTable(section, valueName, valueLimitsObj){
	var $ds = null;
	if($("#lsection_"+section+"_"+valueName+" .section-line-data").length == 0 ){
		$ds = $("<div>",{class:"section-line-data",id:"data-"+valueName}).appendTo($("#lsection_"+section+"_"+valueName));
	}else{
		$ds = $("#data-"+valueName);
	}
	$("<div>",{id:"data-table-"+valueName,class:"data-table"}).appendTo($ds);
	$("<table>",{}).append($("<thead>").append($("<tr>").append($("<td>")).append($("<td>").text("Date")).append($("<td>").text("Value")))).append($("<tbody>",{id:"data-body-"+valueName})).appendTo($("#data-table-"+valueName));
	var objValueArray = getValueSectionArray(section,valueName,patientObjArray);
	$(objValueArray).each(function( index ) {
		var ob = $(this)[0];
		$("#data-body-"+valueName).append($("<tr>",{id:"data-body-"+valueName+"-"+index}));
		$("#data-body-"+valueName+"-"+index)
			.append($("<td>",{width:50,align:"center"})
							.append(
									$("<div>",{id:"buttons-"+valueName+"-"+ob.idvalue}).hide()
										.append($("<i>",{class:"fa fa-trash", "aria-hidden":"true",style:"margin-right:5px;",id:"delete-"+valueName+"-"+index}))
										.append($("<i>",{class:"fa fa-pencil", "aria-hidden":"true",style:"margin-right:5px;",id:"edit-"+valueName+"-"+index}))
									)
			)
			.append($("<td>")
					.text(ob.date)
			)		
			.append($("<td>")
					.text(ob.value)
			);
		$("#delete-"+valueName+"-"+index).click(function(){
			var $d = $("<div>",{id:"dialog-confirm",title:"DeleteValue"}).appendTo($("body"));
			var $p = $("<p>").text("This value will be permanently deleted. Are you sure ?").appendTo($d); 
			$d.dialog({
			      resizable: false,
			      height: "auto",
			      width: 400,
			      modal: true,
			      buttons: {
			        "Delete value": function() {
			        	$("#data-"+valueName+"-"+ob.idvalue).remove();
			        	deleteValue(ob.idvalue, patientObjArray);
			          $( this ).dialog( "close" );
			          $(this.remove());
			        },
			        Cancel: function() {
			          $( this ).dialog( "close" );
			          $(this.remove());
			        }
			      }
			    });
		});
		$("#edit-"+valueName+"-"+index).click(function(){
			$("#data-table-"+valueName).hide();
			$("<div>",{class:"data-edit",id:"data-edit-"+valueName}).appendTo($ds);
			$("<table>",{})
				.append(
						$("<tr>")
							.append($("<td>",{class:"data-edit-label"}).text("Collected Date"))
							.append($("<td>",{class:"data-edit-label"}).text("Value"))
				)
				.append(
						$("<tr>")
							.append(
									$("<td>",{class:"data-edit-control"})
										.append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"}).val(ob.date))
										.append($("<i>",{class:"fa fa-calendar"}))
									)
							.append(
									$("<td>",{class:"data-edit-control"})
										.append($("<input>",{id:"value-"+valueName, type:"text", class:"control-value-text"}).val(Number(ob.value).trimNum(eval(valueName+"_dec"))))
									)
				)
				.append($("<tr>")
						.append(
								$("<td>",{class:"data-edit-control"})
									.append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save"))
						)
						.append(
								$("<td>",{class:"data-edit-control"})
									.append($("<div>", {id:"cancel-"+valueName,class:"cisbutton"}).text("Cancel"))
						)
				).appendTo($("#data-edit-"+valueName));
			
			$("#date-"+valueName).datepicker({
		        changeMonth: true,
		        changeYear: true,
		        yearRange: '1920:'+moment().year(),
		        dateFormat : 'yy-mm-dd',
		        defaultDate : $(this).val()
		    });
			$("#edit-"+valueName).css("margin-right","20px").click(function(){
				var v = $("#value-"+valueName).val();
				var d = $("#date-"+valueName).val();
				var isDate = Validate.now(Validate.Presence,d);
				var isValue = Validate.now(Validate.Presence, v);
				var isNumber = Validate.now(Validate.Numericality, v );
				if(isDate && isValue && isNumber){
					saveValue(ob.idvalue,section, valueName, d, v, patientObjArray);
					//send value to the db but update the array localy
					//$("#line-graph-container-graph-buttons_"+valueName).click();
					var os = getObjectSection(patientObjArray);
					var vo = eval("os."+valueName);
					drawLineGraph(section, valueName, vo.values[0], valueLimitsObj);
					$("#button-table-"+valueName).click();
				}else{
					if(!isNumber){
						$(".cdisbody_patient_alerts").text("Value must be between "+valueLimitsObj.startvalue+" and "+valueLimitsObj.endvalue+"!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
						
					}else{
						$(".cdisbody_patient_alerts").text("Missing value!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
					}
				}
			});
			$("#cancel-"+valueName).click(function(){
				$("#data-edit-"+valueName).remove();
			});
			
		});
		
		$("#data-body-"+valueName+" tr").hover(function(){
			$(this).find("#buttons-"+valueName+"-"+ob.idvalue).show();
			$(this).css("background","#cdcdcd");
		},function(){
			$(this).find("#buttons-"+valueName+"-"+ob.idvalue).hide();
			$(this).css("background","#e5e6e8");
		});
	});

}


function createHistoryAdd(section, valueName, valueLimitsObj){
	
	var $ds = null;
	if($("#lsection_"+section+"_"+valueName+" .section-line-data").length == 0 ){
		$ds = $("<div>",{class:"section-line-data",id:"data-"+valueName}).appendTo($("#lsection_"+section+"_"+valueName));
	}else{
		$ds = $("#data-"+valueName);
	}
	$("<div>",{id:"data-add-"+valueName,class:"data-edit"}).appendTo($ds);
	$("<table>",{})
	.append(
			$("<tr>")
				.append($("<td>",{class:"data-edit-label"}).text("Collected Date"))
				.append($("<td>",{class:"data-edit-label"}).text("Value"))
	)
	.append(
			$("<tr>")
				.append(
						$("<td>",{class:"data-edit-control"})
							.append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"}))
							.append($("<i>",{class:"fa fa-calendar"}))
						)
				.append(
						$("<td>",{class:"data-edit-control"})
							.append($("<input>",{id:"value-"+valueName, type:"text", class:"control-value-text"}))
						)
	)
	.append($("<tr>")
			.append(
					$("<td>",{class:"data-edit-control"})
						.append($("<div>", {id:"cancel-"+valueName,class:"cisbutton"}).text("Cancel"))
			)
			.append(
					$("<td>",{class:"data-edit-control"})
						.append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save"))
			)
	).appendTo($("#data-add-"+valueName));

	
	$("#date-"+valueName).datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1920:'+moment().year(),
        dateFormat : 'yy-mm-dd'
        
    });
    
	$("#edit-"+valueName).click(function(){
		var v = $("#value-"+valueName).val();
		var d = $("#date-"+valueName).val();
		var isDate = Validate.now(Validate.Presence,d);
		var isValue = Validate.now(Validate.Presence, v);
		var isNumber = Validate.now(Validate.Numericality, v );
		if(isDate && isValue && isNumber){
			saveValue(0,section, valueName, d, v, patientObjArray);
			//send value to the db but update the array localy
			//$("#line-graph-container-graph-buttons_"+valueName).click();
			var os = getObjectSection(patientObjArray);
			var vo = eval("os."+valueName);
			drawLineGraph(section, valueName, vo.values[0], valueLimitsObj);
		}else{
			if(!isNumber){
				$(".cdisbody_patient_alerts").text("Value must be between "+valueLimitsObj.startvalue+" and "+valueLimitsObj.endvalue+"!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
				
			}else{
				$(".cdisbody_patient_alerts").text("Missing value!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
			}
		}
	});
	
	$("#cancel-"+valueName).click(function(){
		$("#data-add-"+valueName).remove();
		$("#button-add-"+valueName).removeClass("section-button-selected");
	});
}

function createValueHeader(section, valueName, valueObj){
	
	if($("#lsection_"+section+"_"+valueName+" .section-line-header").length == 0 ){
		$("#lsection_"+section+"_"+valueName).append($("<div>",{class:"section-line-header"}));
	}
	$("#lsection_"+section+"_"+valueName+" .section-line-header").empty();
	$("<div>", {class: "line-title"}).text(valueObj.name).appendTo($("#lsection_"+section+"_"+valueName+" .section-line-header"));
	$("<div>", {class: "line-unit"}).html(valueObj.unit).appendTo($("#lsection_"+section+"_"+valueName+" .section-line-header"));
	var valueDiv = $("<div>", {class: "line-value"}).appendTo($("#lsection_"+section+"_"+valueName+" .section-line-header"));
	
	if(valueObj.idvalue == 0){
		$(valueDiv).text("[NA]");
	}else{
		//var $ds_graph_value = $("<div>").appendTo($ds_graph).addClass("value-graph-container-value");
		if(valueObj.vtype == "radio"){
			$(valueDiv).text(eval(valueObj.code+"["+valueObj.value+"]"));
		}else if(valueObj.vtype == "date"){
			$(valueDiv).text(valueObj.date);
		}else{
			if(  typeof(window[valueObj.code+"_values"])  != "undefined" ){
 				var vob = eval(valueObj.code+"_values");
 				$(valueDiv).text(vob[valueObj.value]);
			}else{
				$(valueDiv).text(valueObj.value);
			}
		}
	}
}


function createLineHeader(section, valueName, valueObj){
	
	if($("#lsection_"+section+"_"+valueName+" .section-line-header").length == 0 ){
		$("#lsection_"+section+"_"+valueName).append($("<div>",{class:"section-line-header"}));
	}
	$("#lsection_"+section+"_"+valueName+" .section-line-header").empty();
	$("<div>", {class: "line-title"}).text(valueObj.name).appendTo($("#lsection_"+section+"_"+valueName+" .section-line-header"));
	$("<div>", {class: "line-unit"}).html(valueObj.unit).appendTo($("#lsection_"+section+"_"+valueName+" .section-line-header"));
}


function createLineGraph(section, valueName, valueObj, valueLimitsObj){
	if($("#lsection_"+section+"_"+valueName+" .section-line-graph").length == 0 ){
		$("#lsection_"+section+"_"+valueName).append($("<div>",{class:"section-line-graph",id:"graph-"+valueName}));
	}
	$("#graph-"+valueName).empty();
	createHistory(section, valueName, valueLimitsObj);
}

/*
function createLine(section, valueName, valueObj, valueLimitsObj){
	var $ds_line = $("#lsection_"+section+"_"+valueName+" .section-line-line");
	var $ds_title = $("<div>", {class: "line-title-container"}).appendTo($ds_line);
	var $ds_title_title = $("<div>", {class: "line-title"}).text(valueObj.name).appendTo($ds_title);
	var $ds_title_unit = $("<div>", {class: "line-unit"}).html(valueObj.unit).appendTo($ds_title);

	var $ds_graph_data = $("#line-graph-container-graph-data_"+valueName);
	if($ds_graph_data.length == 0){
		createHistory(section, valueName, valueLimitsObj);
	}else{
		$ds_graph_data.fadeIn(350);
	}
}
*/


function createLineButton(section, valueName, valueObj, valueLimitsObj){
	var $ds = $("#lsection_"+section+"_"+valueName);
	if(cdisSection != "patient"){
		if($("#lsection_"+section+"_"+valueName+" .section-line-buttons").length == 0){
			$("<div>",{class:"section-line-buttons"}).appendTo($ds);
		}
		
		var ds_button_container = $("#lsection_"+section+"_"+valueName+" .section-line-buttons");
		$(ds_button_container).empty();
		if(valueObj.idvalue != 0){
			$ds_button_table = $("<div>",{class:"section-button uss",id:"button-table-"+valueName,title:"See data in table"}).html("<i class='fa fa-table'></i>").appendTo(ds_button_container);
			$ds_button_table.click(function(){
				$("#data-"+valueName).empty();
				if($("#button-table-"+valueName).hasClass("section-button-selected")){
					$("#button-table-"+valueName).removeClass("section-button-selected");
					$("#button-table-"+valueName).html("<i class='fa fa-table'></i>");
					$(this).attr("title", "See data in table");
				}else{
					$(this).attr("title", "Close data table");
					$("#button-table-"+valueName).addClass("section-button-selected");
					$("#button-table-"+valueName).html("<i class='fa fa-level-up'></i>");
					if($("#button-add-"+valueName).hasClass("section-button-selected")){
						$("#button-add-"+valueName).click();
					}
					if($("#button-control-"+valueName).hasClass("section-button-selected")){
						$("#button-control-"+valueName).click();
					}
					createHistoryTable(section, valueName, valueLimitsObj);
				}
			});
		}
		
		$ds_button_add = $("<div>",{class:"section-button uss",id:"button-add-"+valueName, title:"Add new value"}).html("<i class='fa fa-plus'></i>").appendTo(ds_button_container);
		$ds_button_add.click(function(){
			$("#data-"+valueName).empty();
			if($(this).hasClass("section-button-selected")){
				$(this).removeClass("section-button-selected");
				$("#button-table-"+valueName).removeClass("section-button-selected");
			}else{
				$(this).addClass("section-button-selected");
				if($("#button-table-"+valueName).hasClass("section-button-selected")){
					$("#button-table-"+valueName).click();
				}
				if($("#button-control-"+valueName).hasClass("section-button-selected")){
					$("#button-control-"+valueName).click();
				}
				createHistoryAdd(section, valueName, valueLimitsObj);
			}
		});
		
		if(valueObj.idvalue != 0){
			$ds_button_control = $("<div>",{class:"section-button uss",id:"button-control-"+valueName, title:"Close chart"}).html('<i class="fa fa-times"></i>').appendTo(ds_button_container);
			$ds_button_control.click(function(){
				if($(this).find(".fa").hasClass("fa-times")){
					$(this).attr("title" , "Open chart");
					$(this).find(".fa").removeClass("fa-times");
					$(this).find(".fa").addClass("fa-line-chart");
					$("#graph-"+valueName).hide();
				}else{
					$(this).attr("title","Close chart");
					$(this).find(".fa").removeClass("fa-line-chart");
					$(this).find(".fa").addClass("fa-times");
					//createHistory(section, valueName, valueLimitsObj);
					$("#graph-"+valueName).show();
				}
			});
			$ds_button_history = $("<div>",{class:"section-button uss",id:"button-history-"+valueName, title:"View all history graph"}).html('<i class="fa fa-history"></i>').appendTo(ds_button_container);
			$ds_button_history.click(function(){
				fullScreenHistory(section, valueName, valueLimitsObj);
			});
		}
	}
}


function createLineEmpty(section,valueName,valueObj,valueLimitsObj){
	var $ds = $("#lsection_"+section+"_"+valueName);
	var $ds_line = $("#lsection_"+section+"_"+valueName+" .section-line-line");
	var $ds_title = $("<div>", {class: "line-title-container"}).appendTo($ds_line).append($("<div>", {class: "line-title"}).text(valueObj.name));
	if(valueObj.date != "NULL"){
		$ds_title.append($("<div>", {class: "line-date"}).text(md.format("L")));
	}
	$ds_title.append($("<div>", {class: "line-unit"}).html(valueObj.unit));
	
	var $ds_graph = $("<div>", {class: "line-graph-container"}).appendTo($ds_line);
	$("<div>", {class:"line-graph-container-text"}).appendTo($ds_graph).text("[Not Collected]");
}


function createValue(section, valueName, valueObj){
	var $ds = $("#lsection_"+section+"_"+valueName);
	var $ds_graph_data = $("#line-graph-container-graph-data_"+valueName);
	if($ds_graph_data.length == 0){
			if(valueObj.vtype == "radio"){
				$ds_graph_data = $("<div>", {id: "line-graph-container-graph-data_"+valueName, class:"value-graph-container-graph-data-radio"}).appendTo($ds);
				$ds_graph_data_data_edit = $("<div>", {class:"line-graph-container-graph-data-data-edit"}).appendTo($ds_graph_data);
				var vlabels = eval(valueName);
				var $rDiv = $("<div>",{id:"radio-"+valueName,class:"line-graph-container-graph-data-data-edit-radio"}).appendTo($ds_graph_data_data_edit);
				$(vlabels).each(function(index){
					var $rItems = $("<input>",{id:valueName+"-"+index,name:valueName,value:index,type:"radio"}).appendTo($rDiv);
					var $lItems = $("<label>",{'for':valueName+"-"+index}).text(vlabels[index]).appendTo($rDiv);
				});
				$rDiv.buttonset();
				$rDiv.find("[value='"+valueObj.value+"']").prop('checked', true).button("refresh");
				$rDiv.val(valueObj.value);
				$("#radio-"+valueName+" input[type=radio]").change(function() {
				     saveValue(valueObj.idvalue, section, valueName, moment().format("L"), $(this).val(), patientObjArray);
				     var objValueArray = getValueSectionArray(section,valueObj.code, patientObjArray);
				     drawValueGraph(section,valueName,objValueArray[0]);
				     $ds_graph_data.hide();
				});
				$(".cdisbody_"+section).height("+="+$("#line-graph-container-graph-data_"+valueName).height());
			}else if(valueObj.vtype == "date"){
				$ds_graph_data = $("<div>", {id: "line-graph-container-graph-data_"+valueName, class:"value-graph-container-graph-data-date"}).appendTo($ds);
				$ds_graph_data_data_edit = $("<div>", {class:"line-graph-container-graph-data-data-edit"}).appendTo($ds_graph_data);
				$ds_graph_data_data_edit_value = $("<div>", {class:"value-graph-container-graph-data-data-edit-date"}).appendTo($ds_graph_data_data_edit);
				$ds_graph_data_data_edit_button = $("<div>", {class:"value-graph-container-graph-data-data-edit-button"}).appendTo($ds_graph_data_data_edit);
				$("<div>", {class:"line-graph-container-graph-data-data-edit-label"}).appendTo($ds_graph_data_data_edit_value).text("Screening Date");
				$ds_graph_data_data_edit_date = $("<div>", {class:"data-edit-controls-date"}).appendTo($ds_graph_data_data_edit_value).append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"})).append($("<i>",{class:"fa fa-calendar"}));
				$ds_graph_data_data_edit_button.append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save").css("margin-top","15px").css("margin-right","10px")).css("text-align","center");
				$("#date-"+valueName).datepicker({
			        changeMonth: true,
			        changeYear: true,
			        yearRange: '1920:'+moment().year(),
			        dateFormat : 'yy-mm-dd'
			    });
				$("#date-"+valueName).val(valueObj.date);
				$("#edit-"+valueName).click(function(){
					var d = $("#date-"+valueName).val();
					var isDate = Validate.now(Validate.Presence,d);
					if(isDate){
						saveValue(valueObj.idvalue, section, valueName,d,"", patientObjArray);
						var objValueArray = getValueSectionArray(section,valueObj.code, patientObjArray);
						var ob = $(objValueArray)[0]; 
						$ds_graph_data.hide();
					    $ds.css("background-color","#ffffff");
					    drawValueGraph(section, valueName, ob);
					}else{
						$(".cdisbody_patient_alerts").text("Missing date!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
					}
				});
				$(".cdisbody_"+section).height("+="+$("#line-graph-container-graph-data_"+valueName).height());
			}else{
				$ds_graph_data = $("<div>", {id: "line-graph-container-graph-data_"+valueName, class:"value-graph-container-graph-data"}).appendTo($ds);
				$ds_graph_data_data = $("<div>", {id: "line-graph-container-graph-data_"+valueName+"_data", class:"value-graph-container-graph-data-data"}).appendTo($ds_graph_data);
				$ds_graph_data_data_header = $("<div>", {class:"value-graph-container-graph-data-data-header"}).appendTo($ds_graph_data_data);
				$ds_graph_data_data_header_date = $("<div>", {class:"line-graph-container-graph-data-data-header-date"}).appendTo($ds_graph_data_data_header).text("Date");
				$ds_graph_data_data_header_value = $("<div>", {class:"line-graph-container-graph-data-data-header-value"}).appendTo($ds_graph_data_data_header).text("Value");
				$ds_graph_data_data_body = $("<div>", {class:"value-graph-container-graph-data-data-body"}).appendTo($ds_graph_data_data);
				$ds_graph_data_data_footer_button = $("<div>", {id:"new-"+valueName,class:"value-graph-button"}).css("top","150px").text("New").appendTo($ds_graph_data).show();
				$("#new-"+valueName).click(function(){
					$ds_graph_data_data_edit =$("#line-graph-container-graph-data_"+valueName+" .line-graph-container-graph-data-data-edit");
					if($ds_graph_data_data_edit.length == 0){
						$ds_graph_data_data_edit = $("<div>", {class:"line-graph-container-graph-data-data-edit"}).appendTo($("#line-graph-container-graph-data_"+valueName+"_data"));
						$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
						$("<div>", {class:"line-graph-container-graph-data-data-edit-label"}).appendTo($ds_graph_data_data_edit).text("Collected Date");
						$ds_graph_data_data_edit_date = $("<div>", {class:"data-edit-controls-date"}).appendTo($ds_graph_data_data_edit).append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"}).val("")).append($("<i>",{class:"fa fa-calendar"}));
						$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
						$("<div>", {class:"line-graph-container-graph-data-data-edit-label"}).appendTo($ds_graph_data_data_edit).text("Value");
						$ds_graph_data_data_edit_value = $("<div>", {class:"data-edit-controls-value"}).appendTo($ds_graph_data_data_edit).append($("<input>",{id:"value-"+valueName, type:"text", class:"control-value-text"}).val(""));
						$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
						$ds_graph_data_data_edit_button = $("<div>", {class:"data-edit-controls-button"}).appendTo($ds_graph_data_data_edit).append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save")).append($("<div>", {id:"cancel-"+valueName,class:"cisbutton"}).text("Cancel")).css("text-align","center");
						$("#date-"+valueName).datepicker({
					        changeMonth: true,
					        changeYear: true,
					        yearRange: '1920:'+moment().year(),
					        dateFormat : 'yy-mm-dd'
					    });
						$("#edit-"+valueName).css("margin-right","20px").click(function(){
							var v = $("#value-"+valueName).val();
							var d = $("#date-"+valueName).val();
							var isDate = Validate.now(Validate.Presence,d);
							var isValue = Validate.now(Validate.Presence, v);
							var isNumber = Validate.now(Validate.Numericality, v);
							if(isDate && isValue && isNumber){
								saveValue(0,section, valueName, d, v, patientObjArray);
								//send value to the db but update the array localy
								$("#line-graph-container-graph-buttons_"+valueName).click();
								var os = getObjectSection(patientObjArray);
								var vo = eval("os."+valueName);
								//$(".cdisbody_"+section).height("+="+$("#line-graph-container-graph-data_"+valueName).height());
								drawValueGraph(section, valueName, vo.values[0]);
							}else{
								if(!isNumber){
									$(".cdisbody_patient_alerts").text("Value must be a number!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
								}else{
									$(".cdisbody_patient_alerts").text("Missing value!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
								}
							}
						});
						$("#cancel-"+valueName).click(function(){
							$("#line-graph-container-graph-data_"+valueName+"_data .line-graph-container-graph-data-data-edit").remove();
						});
					}else{
						$("#line-graph-container-graph-data_"+valueName+"_data .line-graph-container-graph-data-data-edit").show();
					}
					
				});
				
				$(".cdisbody_"+section).height("+="+$("#line-graph-container-graph-data_"+valueName).height());
				
				var objValueArray = getValueSectionArray(section,valueObj.code, patientObjArray);
				$(objValueArray).each(function( index ) {
					var ob = $(this)[0];
					$ds_graph_data_data_body_line = $("<div>", {id:"data-"+valueObj.code+"-"+ob.idvalue,class:"line-graph-container-graph-data-data-body-line"}).appendTo($ds_graph_data_data_body);
					$ds_graph_data_data_body_line.click(function(){
						$ds_graph_data_data_edit = $("<div>", {class:"line-graph-container-graph-data-data-edit"}).appendTo($("#line-graph-container-graph-data_"+valueName+"_data"));
						$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
						$("<div>", {class:"line-graph-container-graph-data-data-edit-label"}).appendTo($ds_graph_data_data_edit).text("Collected Date");
						$ds_graph_data_data_edit_date = $("<div>", {class:"data-edit-controls-date"}).appendTo($ds_graph_data_data_edit).append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"}).val(ob.date)).append($("<i>",{class:"fa fa-calendar"}));
						$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
						$("<div>", {class:"line-graph-container-graph-data-data-edit-label"}).appendTo($ds_graph_data_data_edit).text("Value");
						$ds_graph_data_data_edit_value = $("<div>", {class:"data-edit-controls-value"}).appendTo($ds_graph_data_data_edit).append($("<input>",{id:"value-"+valueName, type:"text", class:"control-value-text"}).val(ob.value));
						$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
						$ds_graph_data_data_edit_button = $("<div>", {class:"data-edit-controls-button"}).appendTo($ds_graph_data_data_edit).append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save")).append($("<div>", {id:"cancel-"+valueName,class:"cisbutton"}).text("Cancel")).css("text-align","center");
						$("#date-"+valueName).datepicker({
					        changeMonth: true,
					        changeYear: true,
					        yearRange: '1920:'+moment().year(),
					        dateFormat : 'yy-mm-dd',
					        defaultDate : $(this).val()
					    });
						$("#edit-"+valueName).css("margin-right","20px").click(function(){
							var v = $("#value-"+valueName).val();
							var d = $("#date-"+valueName).val();
							var isDate = Validate.now(Validate.Presence,d);
							var isValue = Validate.now(Validate.Presence, v);
							var isNumber = Validate.now(Validate.Numericality, v);
							if(isDate && isValue && isNumber){
								saveValue(ob.idvalue,section, valueName, d, v, patientObjArray);
								//send value to the db but update the array localy
								$("#line-graph-container-graph-buttons_"+valueName).click();
								var os = getObjectSection(patientObjArray);
								var vo = eval("os."+valueName);
								drawValueGraph(section, valueName, vo.values[0]);
							}else{
								if(!isNumber){
									$(".cdisbody_patient_alerts").text("Value must be between a number!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
									
								}else{
									$(".cdisbody_patient_alerts").text("Missing value!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
								}
							}
						});
						$("#cancel-"+valueName).click(function(){
							$("#line-graph-container-graph-data_"+valueName+"_data .line-graph-container-graph-data-data-edit").remove();
						});
					});
					$ds_graph_data_data_body_line_date = $("<div>", {class:"line-graph-container-graph-data-data-body-line-date"}).text(ob.date).appendTo($ds_graph_data_data_body_line);
					$ds_graph_data_data_body_line_value = $("<div>", {class:"line-graph-container-graph-data-data-body-line-value"}).text(ob.value).appendTo($ds_graph_data_data_body_line);
				});
			}
			$ds_graph_data.fadeIn(350);
		}else{
			$ds_graph_data.fadeIn(350);
			$(".cdisbody_"+section).height("+="+$ds_graph_data.height());
			$ds_graph_buttons.text("Close");
		}
	
}


function createValueTable(section, valueName, valueObj){
	var $ds = $("#lsection_"+section+"_"+valueName);
	var $ds_table_data = $("#data_"+valueName);
	
	if($ds_table_data.length == 0){
		$ds_table_data = $("<div>", {id: "data_"+valueName, class:"section-line-data"}).appendTo($ds);
	}
	
	if(valueObj.vtype == "radio"){
		var vlabels = eval(valueName);
		var $rDiv = $("<div>",{id:"radio-table-"+valueName,class:"data-table"}).appendTo($ds_table_data);
		$(vlabels).each(function(index){
			var $rItems = $("<input>",{id:valueName+"-"+index,name:valueName,value:index,type:"radio"}).appendTo($rDiv);
			var $lItems = $("<label>",{'for':valueName+"-"+index}).text(vlabels[index]).appendTo($rDiv);
		});
		$rDiv.buttonset();
		$rDiv.find("[value='"+valueObj.value+"']").prop('checked', true).button("refresh");
		$rDiv.val(valueObj.value);
		$("#radio-table-"+valueName+" input[type=radio]").change(function() {
		     saveValue(valueObj.idvalue, section, valueName, moment().format("L"), $(this).val(), patientObjArray);
		     var objValueArray = getValueSectionArray(section,valueObj.code, patientObjArray);
		     drawValueGraph(section,valueName,objValueArray[0]);
			 $("#button-table-"+valueName).removeClass("section-button-selected");
			 $ds_table_data.empty();
		});
		
	}else if(valueObj.vtype == "date"){
		var $rDiv = $("<div>",{id:"date-table-"+valueName,class:"data-table"}).appendTo($ds_table_data);
		var dateLabel = "Date of diagnosis";
		if(typeof(window[valueName+"_datelabel"]) != "undefined"){
			dateLabel = eval(valueName+"_datelabel");
		}
		
		
		$("<table>",{})
			.append(
					$("<tr>").append($("<td>")).append($("<td>"))
			)
			.append(
					$("<tr>")
						.append($("<td>").text(dateLabel))
						.append($("<td>").append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"})).append($("<i>",{class:"fa fa-calendar"})))
			)
			.append(
					$("<tr>")
						.append(
								$("<td>",{colspan:"2"})
									.append($("<div>", {id:"edit-"+valueName,class:"cisbutton",title:"Modify date of diagnosis"}).text("Save"))
						)		
			).appendTo($rDiv);
			
		$("#date-"+valueName).datepicker({
	        changeMonth: true,
	        changeYear: true,
	        yearRange: '1920:'+moment().year(),
	        dateFormat : 'yy-mm-dd'
	    });
		var dateValue = "";
		if((typeof(valueObj.date)!= "undefined") && (valueObj.date != "NULL")){
			dateValue = valueObj.date;
		}
		$("#date-"+valueName).val(dateValue);
		$("#edit-"+valueName).click(function(){
			var d = $("#date-"+valueName).val();
			var isDate = Validate.now(Validate.Presence,d);
			if(isDate){
				saveValue(valueObj.idvalue, section, valueName,d,"", patientObjArray);
				var objValueArray = getValueSectionArray(section,valueObj.code, patientObjArray);
				var ob = $(objValueArray)[0]; 
				$ds_table_data.empty();
				$("#button-table-"+valueName).removeClass("section-button-selected");
			    drawValueGraph(section, valueName, ob);
			}else{
				$(".cdisbody_patient_alerts").text("Missing date!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
			}
		});
		
	}else{
			
		$("<div>",{id:"data-table-"+valueName,class:"data-table"}).appendTo($ds_table_data);
		$("<table>",{}).append($("<thead>").append($("<tr>").append($("<td>")).append($("<td>").text("Date")).append($("<td>").text("Value")))).append($("<tbody>",{id:"data-body-"+valueName})).appendTo($("#data-table-"+valueName));
		
		
		//$ds_graph_data_data_header = $("<div>", {class:"value-graph-container-graph-data-data-header"}).appendTo($ds_table_data);
			//$ds_graph_data_data_header_date = $("<div>", {class:"line-graph-container-graph-data-data-header-date"}).appendTo($ds_graph_data_data_header).text("Date");
			//$ds_graph_data_data_header_value = $("<div>", {class:"line-graph-container-graph-data-data-header-value"}).appendTo($ds_graph_data_data_header).text("Value");
			//$ds_graph_data_data_body = $("<div>", {class:"value-graph-container-graph-data-data-body"}).appendTo($ds_table_data);
			//$(".cdisbody_"+section).height("+="+$("#value-table-data_"+valueName).height());
			
			
			
			var objValueArray = getValueSectionArray(section,valueObj.code, patientObjArray);
			$(objValueArray).each(function( index ) {
				var ob = $(this)[0];
				var value = ob.value;
				if(typeof(window[ob.code+"_values"]) != "undefined"){
					var vob = eval(ob.code+"_values");
					value = vob[ob.value];
				}
				
				$("#data-body-"+valueName).append($("<tr>",{id:"data-body-"+valueName+"-"+index}));
				$("#data-body-"+valueName+"-"+index)
					.append($("<td>",{width:50,align:"center"})
									.append(
											$("<div>",{id:"buttons-"+valueName+"-"+ob.idvalue}).hide()
												.append($("<i>",{class:"fa fa-trash", "aria-hidden":"true",style:"margin-right:5px;",id:"delete-"+valueName+"-"+index}))
												.append($("<i>",{class:"fa fa-pencil", "aria-hidden":"true",style:"margin-right:5px;",id:"edit-"+valueName+"-"+index}))
											)
					)
					.append($("<td>")
							.text(ob.date)
					)		
					.append($("<td>")
							.text(value)
					);
				
				$("#delete-"+valueName+"-"+index).click(function(){
					var $d = $("<div>",{id:"dialog-confirm",title:"DeleteValue"}).appendTo($("body"));
					var $p = $("<p>").text("This value will be permanently deleted. Are you sure ?").appendTo($d); 
					$d.dialog({
					      resizable: false,
					      height: "auto",
					      width: 400,
					      modal: true,
					      buttons: {
					        "Delete value": function() {
					        	$("#data-"+valueName+"-"+ob.idvalue).remove();
					        	deleteValue(ob.idvalue, patientObjArray);
					          $( this ).dialog( "close" );
					          $(this.remove());
					        },
					        Cancel: function() {
					          $( this ).dialog( "close" );
					          $(this.remove());
					        }
					      }
					    });
				});
				$("#edit-"+valueName+"-"+index).click(function(){
					var valueObject = null;
					if(typeof(window[ob.code+"_values"]) != "undefined"){
						//$ds_graph_data_data_edit_value = $("<div>", {class:"data-edit-controls-value"}).appendTo($ds_graph_data_data_edit);
						$sv = $("<select>",{id:"value-"+valueName, class:"control-value-text"});
						var vob = eval(ob.code+"_values");
						$.each(vob,function(index, value){
							if(ob.value == index){
								$sv.append($("<option>",{value:index, selected:true}).text(value));
							}else{
								$sv.append($("<option>",{value:index}).text(value));
							}
						});
						//$ds_graph_data_data_edit_value.append($sv);
						valueObject = $sv;
					}else{
						valueObject = $("<input>",{id:"value-"+valueName, type:"text", class:"control-value-text"}).val(ob.value);
					}
					
					$("#data-table-"+valueName).hide();
					$("<div>",{class:"data-edit",id:"data-edit-"+valueName}).appendTo($ds_table_data);
					$("<table>",{})
						.append(
								$("<tr>")
									.append($("<td>",{class:"data-edit-label"}).text("Collected Date"))
									.append($("<td>",{class:"data-edit-label"}).text("Value"))
						)
						.append(
								$("<tr>")
									.append(
											$("<td>",{class:"data-edit-control"})
												.append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"}).val(ob.date))
												.append($("<i>",{class:"fa fa-calendar"}))
											)
									.append(
											$("<td>",{class:"data-edit-control"})
												.append(valueObject)
											)
						)
						.append($("<tr>")
								.append(
										$("<td>",{class:"data-edit-control"})
											.append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save"))
								)
								.append(
										$("<td>",{class:"data-edit-control"})
											.append($("<div>", {id:"cancel-"+valueName,class:"cisbutton"}).text("Cancel"))
								)
						).appendTo($("#data-edit-"+valueName));
					
					
					
					//$ds_graph_data_data_edit = $("<div>", {class:"line-graph-container-graph-data-data-edit"}).appendTo($("#value-table-data_"+valueName));
					//$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
					//$("<div>", {class:"line-graph-container-graph-data-data-edit-label"}).appendTo($ds_graph_data_data_edit).text("Collected Date");
					//$ds_graph_data_data_edit_date = $("<div>", {class:"data-edit-controls-date"}).appendTo($ds_graph_data_data_edit).append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"}).val(ob.date)).append($("<i>",{class:"fa fa-calendar"}));
					//$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
					//$("<div>", {class:"line-graph-container-graph-data-data-edit-label"}).appendTo($ds_graph_data_data_edit).text("Value");
					
					//$("<div>", {class:"value-graph-container-graph-data-data-edit-spacer"}).appendTo($ds_graph_data_data_edit);
					//$ds_graph_data_data_edit_button = $("<div>", {class:"data-edit-controls-button"}).appendTo($ds_graph_data_data_edit).append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save")).append($("<div>", {id:"cancel-"+valueName,class:"cisbutton"}).text("Cancel")).css("text-align","center");
					
					
					$("#date-"+valueName).datepicker({
				        changeMonth: true,
				        changeYear: true,
				        yearRange: '1920:'+moment().year(),
				        dateFormat : 'yy-mm-dd',
				        defaultDate : $(this).val()
				    });
					$("#edit-"+valueName).click(function(){
						var v = $("#value-"+valueName).val();
						var d = $("#date-"+valueName).val();
						var isDate = Validate.now(Validate.Presence,d);
						var isValue = Validate.now(Validate.Presence, v);
						var isNumber = Validate.now(Validate.Numericality, v);
						if(isDate && isValue && isNumber){
							saveValue(ob.idvalue,section, valueName, d, v, patientObjArray);
							//send value to the db but update the array localy
							//$("#line-graph-container-graph-buttons_"+valueName).click();
							var os = getObjectSection(patientObjArray);
							var vo = eval("os."+valueName);
							//$("#lsection_"+section+"_"+valueName).css("background-color","#efefef");
							//$("#lsection_"+section+"_"+valueName +"  .section-value-design").css("background-color","#8CA5AE");
							$("#button-table-"+valueName).removeClass("section-button-selected");
							drawValueGraph(section, valueName, vo.values[0]);
						}else{
							if(!isNumber){
								$(".cdisbody_patient_alerts").text("Value must be between a number!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
							}else{
								$(".cdisbody_patient_alerts").text("Missing value!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
							}
						}
					});
					$("#cancel-"+valueName).click(function(){
						$ds_table_data.empty();
					});
					
				});
				
				$("#data-body-"+valueName+" tr").hover(function(){
					$(this).find("#buttons-"+valueName+"-"+ob.idvalue).show();
					$(this).css("background","#cdcdcd");
				},function(){
					$(this).find("#buttons-"+valueName+"-"+ob.idvalue).hide();
					$(this).css("background","#e5e6e8");
				});
			});
		}
}




function createValueAdd(section, valueName, valueObj){
	var $ds = $("#lsection_"+section+"_"+valueName);
	var $ds_table_data = $("#data_"+valueName);
	if($ds_table_data.length == 0 ){
		$ds_table_data = $("<div>",{id:"data_"+valueName, class:"section-line-data"}).appendTo($ds);
	}
	
	if(valueObj.vtype == "text"){
			var dateLabel = "Collected Date";
			if(typeof(window[valueObj.code+"_datelabel"]) != "undefined"){
				dateLabel = eval(valueObj.code+"_datelabel");
			}
			var valueObject = null;
			if(typeof(window[valueObj.code+"_values"]) != "undefined"){
				$ds_graph_data_data_edit_value = $("<div>", {class:"data-edit-controls-value"}).appendTo($ds_table_data);
				$sv = $("<select>",{id:"value-"+valueName, class:"control-value-select"});
				var vob = eval(valueObj.code+"_values");
				$.each(vob,function(index, value){
						$sv.append($("<option>",{value:index}).text(value));
				});
				valueObject = $sv;
			}else{
				valueObject = $("<input>",{id:"value-"+valueName, type:"text", class:"control-value-text"}).val("");
			}
			
			$("<div>",{class:"data-edit",id:"data-edit-"+valueName}).appendTo($ds_table_data);
			$("<table>",{})
				.append(
						$("<tr>")
							.append($("<td>",{class:"data-edit-label"}).text(dateLabel))
							.append($("<td>",{class:"data-edit-label"}).text("Value"))
				)
				.append(
						$("<tr>")
							.append(
									$("<td>",{class:"data-edit-control"})
										.append($("<input>",{id:"date-"+valueName, type:"text", class:"control-date-text"}).val(""))
										.append($("<i>",{class:"fa fa-calendar"}))
									)
							.append(
									$("<td>",{class:"data-edit-control"})
										.append(valueObject)
									)
				)
				.append($("<tr>")
						.append(
								$("<td>",{class:"data-edit-control"})
									.append($("<div>", {id:"cancel-"+valueName,class:"cisbutton"}).text("Cancel"))
						)
						.append(
								$("<td>",{class:"data-edit-control"})
									.append($("<div>", {id:"edit-"+valueName,class:"cisbutton"}).text("Save"))
						)
				).appendTo($("#data-edit-"+valueName));
			
			$("#date-"+valueName).datepicker({
		        changeMonth: true,
		        changeYear: true,
		        yearRange: '1920:'+moment().year(),
		        dateFormat : 'yy-mm-dd'
		    });
			$("#edit-"+valueName).click(function(){
				var v = $("#value-"+valueName).val();
				var d = $("#date-"+valueName).val();
				var isDate = Validate.now(Validate.Presence,d);
				var isValue = Validate.now(Validate.Presence, v);
				var isNumber = Validate.now(Validate.Numericality, v);
				if(isDate && isValue && isNumber){
					saveValue(0,section, valueName, d, v, patientObjArray);
					//send value to the db but update the array localy
					var os = getObjectSection(patientObjArray);
					var vo = eval("os."+valueName);
					$("#lsection_"+section+"_"+valueName +"  .section-button-selected").removeClass("section-button-selected");
					drawValueGraph(section, valueName, vo.values[0]);
				}else{
					if(!isNumber){
						$(".cdisbody_patient_alerts").text("Value must be a number!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
					}else{
						$(".cdisbody_patient_alerts").text("Missing value!").addClass("ui-state-error").show().delay(5000).fadeOut(350);
					}
				}
			});
			$("#cancel-"+valueName).click(function(){
				$ds_table_data.empty();
				$("#lsection_"+section+"_"+valueName +"  .section-button-selected").removeClass("section-button-selected");
			});
	}
}



function fullScreenHistory(section, valueName, valueLimitsObj){
	
	var $w = $("#wraper");
	var wmd = $("<div>", {id:"fullscreen"});
	$w.scrollTop()
	$w.css("overflow","hidden");
	wmd.css("position","absolute");
	wmd.css("height",$w.height()*0.98+"px");
	wmd.css("width",$w.width()*0.98+"px");
	wmd.css("top","50%");
	wmd.css("left","50%");
	wmd.css("margin-top","-"+wmd.height()/2+"px");
	wmd.css("margin-left","-"+wmd.width()/2+"px");
	wmd.css("background-color","#efefef");
	wmd.css("z-index","99999");
	
	var wmdHeader = $("<div>", {id:"fullscreen-header"});
	wmdHeader.css("position","relative");
	wmdHeader.css("top","0px");
	wmdHeader.css("left","0px");
	wmdHeader.css("width","100%");
	wmdHeader.css("height","20px");
	wmdHeader.css("background-color","#db4437");
	wmdHeader.css("text-align","right");
	wmdHeader.css("color","#ffffff");
	
	//wmdHeader.css("border","1px solid #cdcdcd");
	wmdHeader.html('<i class="fa fa-times"></i> &nbsp;');
	wmdHeader.appendTo(wmd);
	
	var wmdTool = $("<div>", {id:"fullscreen-tool"});
	wmdTool.css("position","relative");
	wmdTool.css("left","0px");
	//wmdTool.css("width","100%");
	wmdTool.css("height","60px");
	wmdTool.css("padding","5px");
	wmdTool.css("background-color","#efefef");
	wmdTool.append($("<div>",{class:"cisbutton"}).text("Close").click(function(){$("#fullscreen").remove();$("#wraper").css("overflow","auto");}));
	wmdTool.append($("<div>",{class:"cisbutton",id:"fullscreen-graph-zoomreset"}).text("Reset Zoom"));
	wmdTool.append($("<div>",{class:"cisbutton",id:"fullscreen-graph-print"}).text("Print Graph").click(function(){
		printHistoryGraph("Print all data history graph for "+valueName);
	}));
	wmdTool.append($("<div>",{style:"position:relative;padding:10px;font-family:Arial;color:#4d4d4d;font-size:80%;"}).text("Select area in graph to zoom in."));
	wmdTool.appendTo(wmd);
	
	var wmdBody = $("<div>", {id:"fullscreen-body"});
	wmdBody.css("position","relative");
	wmdBody.css("left","0px");
	wmdBody.css("width","100%");
	wmdBody.css("height",(wmd.height()-90)+"px");
	wmdBody.css("background-color","#efefef");
	wmdBody.appendTo(wmd);
	
	var wmdGraph = $("<div>", {id:"fullscreen-graph"});
	wmdGraph.css("position","absolute");
	wmdGraph.css("top","5%");
	wmdGraph.css("left","5%");
	
	wmdGraph.css("width","90%");
	wmdGraph.css("height","90%");
	
	wmdGraph.css("background-color","#efefef");
	wmdGraph.appendTo(wmdBody);
	
	wmd.appendTo($w);
	
	var objValueArray = getValueSectionArray(section,valueName,patientObjArray);
	var values = [];
	var labels = [];
	$(objValueArray).each(function( index ) {
		var ob = $(this)[0];
		values.push(ob.value);
		labels.push(ob.date);
	});
	var vv  = eval("label_"+valueName);
	var gtitle = "Evolution of "+vv+" in time";
	
	loadGraphAllValues("fullscreen-graph",values,labels,gtitle,valueLimitsObj,valueName);

	$("#fullscreen-header .fa-times").click(function(){
		$("#fullscreen").remove();
		$("#wraper").css("overflow","auto");
		
	});
}



function loadGraphAllValues(divStr, values, labels, title, limits, valueName){
	$(divStr).empty();
	
	if(values.length > 0){
		if(!$(divStr).hasClass("jqplot-target")){
			
			/*special treatment for smoke graph*/
			
			if(valueName == 'smoke'){
				var series = [];
				for(var i=0;i<values.length;i++){
					var num = Number(values[i]).trimNum(0);
					var valNum = 0;
					switch(num) {
					    case 0:
					        valNum = 1;
					        break;
					    case 1:
					        valNum = -1;
					        break;
					    default:
					        valNum = 0;
					}
					var serie = [labels[i],valNum];
					series.push(serie);
				}
				var lc = title.toLowerCase();
				
				var plot = jQuery.jqplot(divStr,[series], {
					 title:title,
					 grid:{backgroundColor: '#fefefe', gridLineColor: '#d9d9d9',gridLineWidth: 0.5, borderWidth: 1, borderColor: '#cdcdcd'},
					 /*grid:{backgroundColor: '#efefef', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},*/
					 seriesDefaults: {
						 rendererOptions: {smooth: true},
						 pointLabels:{ show:false}
					 },
				     axes:{
				            xaxis:{renderer:$.jqplot.DateAxisRenderer,rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickInset:0.5},tickOptions:{fontSize:'0.8em',textColor:'#000000' ,fontFamily:'Arial',formatString:'%m/%Y',angle:-30}},
				            yaxis: {min:-2,max:2,tickOptions:{showGridline: false,labelPosition: 'middle',angle:-0,},tickRenderer:$.jqplot.CanvasAxisTickRenderer,labelRenderer: $.jqplot.CanvasAxisLabelRenderer,ticks: [[-1.3,' '],[-1,'Smoker'],[0,'Unknown Status'],[1,'Not smoker'],[1.3,' ']]}
				        },
			        seriesDefaults:{renderer:$.jqplot.BarRenderer,color: 'green',negativeSeriesColors: ["#F94545"],rendererOptions: {fillToZero: true,barWidth: 30},pointLabels: { show: false }}
				});
				
				$("#"+divStr+"-zoomreset").remove();
			}else{
				var target=0;
				var series = [];
				var lastvalues = [];
				var dc = eval(valueName+"_dec");
				var arrLimits = [];
				
				var fs = "%."+dc+"f";
				if(dc == 0){fs = "%d";}
				 
				
				for(var i=0;i<values.length;i++){
					 var lab = Number(values[i]).trimNum(dc);
					 var serie = [labels[i],Number(values[i]).trimNum(dc),lab];
					 series.push(serie);
					 lastvalues.push(values[i]);
				}
				
				 
				var minNum = lastvalues.min();
				var maxNum = lastvalues.max();
				if(limits != null ){
					 
						 if(minNum > Number(limits.minvalue)){minNum = limits.minvalue;}
						 if(maxNum < Number(limits.maxvalue)){maxNum = limits.maxvalue;}
						 $.each(limits.stages,function(idx,val){
							 if(idx == 0){
								 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymin:Number(val.min), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: true, tooltipFormatString: val.title } };
							 }else if(idx == limits.stages.length-1){
								 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymax: Number(val.max),xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: true, tooltipFormatString: val.title } }; 
							 }else{
								 var limitObj = { rectangle: {name:"stage-"+valueName+"-"+idx, ymax: Number(val.max),ymin:Number(val.min), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",color: val.color, showTooltip: true, tooltipFormatString: val.title } };
							 }
							 arrLimits.push(limitObj);
						 });
				 }
				minNum = Number(minNum) - Number(minNum)*0.2; 
				maxNum = Number(maxNum) + Number(maxNum)*0.2;
				 
				$.jqplot.postDrawHooks.push(function() {
					 	for(var i=0;i<$('.jqplot-overlayCanvas-canvas').length;i++){
					 		var overlayCanvas = $($('.jqplot-overlayCanvas-canvas')[i]);
						    var seriesCanvas = $($('.jqplot-series-canvas')[i]);
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
					 title:title,
					 grid:{backgroundColor: '#fefefe', gridLineColor: '#d9d9d9',gridLineWidth: 0.5, borderWidth: 1, borderColor: '#cdcdcd'},
					 /*grid:{backgroundColor: '#efefef', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},*/
					 seriesDefaults: {
						 rendererOptions: {smooth: true},
						 step:true,
						 pointLabels:{ show:true, location:'n', xpadding:10, ypadding:7, edgeTolerance:7 }
					 },
				     axes:{
				            xaxis:{renderer:$.jqplot.DateAxisRenderer,rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickInset:0.5},tickOptions:{fontSize:'0.8em',textColor:'#000000' ,fontFamily:'Arial',formatString:'%m/%Y',angle:-30}},
				            yaxis:{rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickInset:0.5},tickOptions:{fontSize:'0.8em',fontFamily:'Arial',show:true, textColor:'#000000', formatString: fs},min:Number(minNum),max:Number(maxNum)}
				        },
				     canvasOverlay: {
				            show: true,
				            objects: arrLimits
				          }, 
			        series:[{lineWidth:3,markerOptions:{ style:'filledCircle', color:'#cdcdcd' },neighborThreshold: -1,color:'#4d4d4d'}],
			        highlighter: {show: true,sizeAdjust: 10.5,lineWidthAdjust:3.5,tooltipLocation:'ne',tooltipOffset:4,
			        	formatString:'<table class="jqplot-highlighter" border="0"><tr><td>Date:</td><td>%s</td></tr><tr><td>Value:</td><td>%s</td></tr></table>'},
			        cursor:{
			        	show: true,
			        	zoom:true
			        	}
					});
				 
				 $("#"+divStr+"-zoomreset").click(function(){
					 plot.resetZoom();
					 plot.redraw();
					 
					 if(limits != null){
						 var co = plot.plugins.canvasOverlay;
						 $.each(limits.stages,function(ii,vv){
							 var lineN = co.get('stage-'+valueName+'-'+ii);
							 var normLabel = lineN.gridStop[1]+40;
							 $('<div class="my-jqplot-normal-title" style="position:absolute;text-align:left;padding:1px;font-weight:bold;color:#b5b5b5;top:'+normLabel+'px;right:15px;font-size:90%;">'+vv.title+'</div>').insertBefore('#'+divStr+' .jqplot-overlayCanvas-canvas');
						 });
					 }
					 
				 });
				 
				 if(limits != null){
					 var co = plot.plugins.canvasOverlay;
					 $.each(limits.stages,function(ii,vv){
						 var lineN = co.get('stage-'+valueName+'-'+ii);
						 var normLabel = lineN.gridStop[1]+40;
						 $('<div class="my-jqplot-normal-title" style="position:absolute;text-align:left;padding:1px;font-weight:bold;color:#b5b5b5;top:'+normLabel+'px;right:15px;font-size:90%;">'+vv.title+'</div>').insertBefore('#'+divStr+' .jqplot-overlayCanvas-canvas');
					 });
				 }
			}

		}
	}/*end values > 0 */
}


function drawReportGraph(reportObject, dataset){
	 var series = [];
	 var head = dataset.header;
	 var data = dataset.dataset;
	 $.each(data, function(noLine, arrLine){
		 var serie = [];
		$.each(arrLine, function(index, value){
			var line = [];
			line[line.length] = head[index];
			line[line.length] = Number(value);
			serie[serie.length] = line;
		});
		series[series.length] = serie;
	 });
	 var plotOptions = null;
	 if(reportObject.graphtype == "line"){
		 plotOptions ={
				 title: reportObject.title,
				 animate: true,
				 grid:{backgroundColor: 'rgba(254, 254, 254, 0.5)', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},
				 seriesDefaults:{
					 shadowAlpha: 0.1,
			         shadowDepth: 2,
			         fillToZero: true,
			         smooth: true
				 },
			     legend: {
			          show: true,
			          location: 'w'
			     },
			     axesDefaults: {
			          tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			          tickOptions: {
			            angle: 0,
			            fontSize: '9pt'
			          }
			     },
			     axes: {
			        xaxis: {
			          renderer: $.jqplot.CategoryAxisRenderer
			        }
			     }
			  }; 
	 }else if(reportObject.graphtype == "bar"){
		 plotOptions ={
				 title: reportObject.title,
				 animate: true,
				 grid:{backgroundColor: 'rgba(234, 234, 234, 0.5)', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},
				 seriesDefaults:{
					 shadowAlpha: 0.1,
			         shadowDepth: 2,
			         fillToZero: true,
			         smooth: true,
			         renderer: $.jqplot.BarRenderer,
		                showHighlight: false,
		                yaxis: 'y2axis',
		                rendererOptions: {
		                    barWidth: 15,
		                    barPadding: -15,
		                    barMargin: 0,
		                    highlightMouseOver: false
		                }
				 },
			     axesDefaults: {
			          tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			          tickOptions: {
			            angle: 0,
			            fontSize: '9pt'
			          }
			     },
			     axes: {
			        xaxis: {
			          renderer: $.jqplot.CategoryAxisRenderer
			        }
			     }
			  }; 
	 }else if(reportObject.graphtype == "pie"){
		 plotOptions ={
				 title: reportObject.title,
				 grid:{
					 background:"#f2f2f2"
				 },
				 seriesDefaults:{ 
			          renderer: jQuery.jqplot.PieRenderer, 
			          rendererOptions: {
			            showDataLabels: true
			          }
			      },
			      legend:{
			            show:true, 
			            placement: 'inside', 
			            rendererOptions: {
			                numberRows: 1
			            }, 
			            location:'s',
			            marginTop: '5px'
			        }
			  };
	 }else{
		 plotOptions ={
				 title: reportObject.title,
				 animate: true,
				 grid:{backgroundColor: 'rgba(254, 254, 254, 0.5)', gridLineColor: '#cdcdcd',gridLineWidth: 1, borderWidth: 1, borderColor: '#4d4d4d'},
				 seriesDefaults:{
					 shadowAlpha: 0.1,
			         shadowDepth: 2,
			         fillToZero: true,
			         smooth: true
				 },
			     legend: {
			          show: true,
			          location: 'w'
			     },
			     axesDefaults: {
			          tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			          tickOptions: {
			            angle: 0,
			            fontSize: '9pt'
			          }
			     },
			     axes: {
			        xaxis: {
			          renderer: $.jqplot.CategoryAxisRenderer
			        }
			     }
			  };	 
	}
	 
	  var plot = $.jqplot("graphReport", series,plotOptions);
	
}



