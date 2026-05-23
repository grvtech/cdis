import {appDefine} from './define.js'; //define global variables
import * as genericlib from './genericlib.js';
import * as patientlib from './patientlib.js';


/* function to draw graph of value like in abc graphs - for normal values : without _and_ or _or_ in name */
export function drawGraphValue(section, valueName){
	// section get data for graph
	//get data from patient object
	let valueArray = patientlib.getValueSectionArray(section, valueName);
	//get value limits
	let limitsObj = patientlib.getValueLimits(valueName);
	
	
	
	//section prepare graph place
	var valueContainer = $("#"+section+"_"+valueName).css("position","relative");
	
	let gcc = $("<div>").appendTo(valueContainer).css("position","relative").height(valueContainer.height() - 20).width(valueContainer.width());
	var gc = $("<canvas>",{"id":"graph-"+valueName}).appendTo(gcc);
	
	//alert(valueContainer.height()+"    "+valueContainer.width())
	//gc.height(valueContainer.height());
	//gc.width(valueContainer.width());
	//let gcont = $("<div>",{class:"cdisActivityGraph"}).appendTo(p2);
	//$("<canvas>",{id:"grvActivityGraph"}).appendTo(gcont);
	const ctx = document.getElementById("graph-"+valueName).getContext('2d');
	const labels = [];
	const serie = [];
	let ten=10;
	
	let maxv = 0;
	let minv = 100000;
	let maxDate = new Date("1900-01-01");
	$.each(valueArray,function(key,value){
		let dd = new Date(value.date);
		if(dd > maxDate)maxDate = dd;
		if(value.length < ten)ten = value.length;
		if( key < ten){
			if(Number(value.value) > maxv ) maxv = Number(value.value);
			if(Number(value.value) < minv ) minv = Number(value.value);
		}
	});
	
	let maxValue = (maxv > Number(limitsObj.maxvalue) )?maxv + (maxv * 0.4):limitsObj.maxvalue + (limitsObj.maxvalue * 0.4);
	let minValue = (minv < Number(limitsObj.minvalue) )?minv - (minv * 0.2):limitsObj.minvalue - (limitsObj.minvalue * 0.2);
	
	let limitDate = maxDate.setFullYear(maxDate.getFullYear() - 2)
	
	$.each(valueArray,function(key,value){
		let dd = new Date(value.date);
		if(value.length < ten)ten = value.length;
		if( key < ten){
			serie.push(value.value);
			labels.push(genericlib.formatDate(new Date(value.date), "mmm yyyy") );	
		}
		
	});
	
	const maxTicksLimitX = (labels.length > 5)?5:labels.length;		
	const data = {
		labels: labels,
		
		datasets: [
		    {
		      label: valueName,
		      data: serie,
		      borderColor: "rgba(71, 71, 71, 0.2)",
		      backgroundColor: "rgba(71, 71, 71, 1)",
		    }
		  ]
	};
	
	const backgroundPlugin = {
	        id: 'chartAreaBackground',
	        beforeDraw(chart, args, options) {
	            const { ctx, chartArea } = chart;
	            ctx.save();
	            ctx.fillStyle = options.backgroundColor || 'white'; // Default to white if not specified
	            ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
	            ctx.restore();
	        }
	    };
		const quadrants = {
		  id: 'quadrants',
		  beforeDraw(chart, args, options) {
		    const {ctx, chartArea: {left, top, right, bottom}, scales: {x, y}} = chart;
		    const midX = x.getPixelForValue(0);
		    
			
		    ctx.save();
			
			$.each(limitsObj.stages, function(i, stage){
				ctx.fillStyle = stage.color;
				
				let gYmax = (stage.max - y.min) * (y.height/(y.max-y.min)) ;
				let gYmin = (stage.min - y.min) * (y.height/(y.max-y.min));
				
				
				if(stage.min == limitsObj.minvalue) gYmin = 0;
				if(stage.max == limitsObj.maxvalue) gYmax = y.height;
				ctx.fillRect(left, top + (y.height - gYmax), right, gYmax - gYmin);
				if(valueName == "hba1c" && stage.min == 0.06){
					ctx.fillStyle = "rgba(0,0,0,1)";
					ctx.fillRect(left, top + (y.height - gYmax), right, 1);
					ctx.fillRect(left, top + (y.height - gYmin), right, 1);
				}
			})
			
			
		    ctx.restore();
		  }
		};		
	const config = {
		type: 'line',
		data: data,
		showTooltips: false,
		options: {
		    responsive: true,
			maintainAspectRatio: false,
		    plugins: { 
				legend: { display:false, position: 'top'}, 
				title: { display: false, text: 'User Activity'},
				chartAreaBackground: {backgroundColor: 'rgba(155, 1, 132, 0.2)'},
				datalabels: {
				                    // Customize label appearance
				                    color: '#fff',
				                    font: {weight: '100', size:8},
				                    formatter: function(value, context) {
				                        // Format the label text
				                        //return value + '%';
										if(valueName == "hba1c"){
											if(!isNaN(value)) value = Number(value).toFixed(3);	
										}else if(valueName == "ldl"){
											value = Number(value).toFixed(2);
										}else if(valueName == "acratio"){
											value = Number(value).toFixed(1);
										}else{
											value = Number(value).toFixed(0);
										} 
										
										return value;
				                    },
				                    anchor: 'end', // Position relative to the point
				                    align: 'top'
				                }
				
			},
			elements : {
				point:{
					radius:2
				},
				line:{
					tension :0.3
				}
			},	
			scales: {
				x:{reverse: true, display: true, offset: true ,
					ticks: {
					          font:{size:10,weight:"700"},
							  minRotation: 0,
							  maxRotation: 0,
							  color: "#4d4d4d",
							  maxTicksLimit:maxTicksLimitX,
							  /*
								// For a category axis, the val is the index so the lookup via getLabelForValue is needed
					          callback: function(val, index) {
					            // Hide every 2nd tick label
					            return index % 2 === 0 ? this.getLabelForValue(val) : '';
					          }
							  */
					}
				}, 
				y: { beginAtZero: true, offset: false,  max:maxValue, min:minValue,
					ticks:{
						font:{size:10,weight:"700"},
						color: "#4d4d4d",
						callback: function(val, index) {return index % 2 === 0 ? this.getLabelForValue(val) : '';}
				          
				     }
				}
			 } 
		  },
		  plugins: [quadrants,ChartDataLabels]
		};
		new Chart(ctx,config);
}


export function drawGraphWidget(widgetObject,history=null){
	let values = [];
	let limits = [];
	let limitsObj = null;
	let valueLabels = [];
	let valueName = null;
	if(widgetObject.valueName.indexOf(",") >= 0){
		let parts = widgetObject.valueName.split(",");
		valueName = widgetObject.valueName;
		$.each(parts, (i,part)=>{
			const section = widgetObject.configs[i].section;
			let valueArray = patientlib.getValueSectionArray(section, part);
			values.push(valueArray);
			limitsObj = patientlib.getValueLimits(part);
			if(limitsObj!=null)limits.push(limitsObj);
			valueLabels.push(valueArray[0].name);
		});
	}else{
		const section = widgetObject.configs[0].section;
		valueName = widgetObject.valueName;
		//valueLabels = [widgetObject.configs[0].label];
		let valueArray1 = patientlib.getValueSectionArray(section, valueName);
		values.push(valueArray1);
		limitsObj = patientlib.getValueLimits(valueName);
		if(limitsObj!=null)limits.push(limitsObj);
		valueLabels.push(valueArray1[0].name);
	}
	
	
	//let limitsObj = patientlib.getValueLimits(valueName);
	//limits.push(limitsObj);
	//valueLabels.push(valueArray1[0].name);
	
	
	
	//section prepare graph place
	var valueContainer = $("#"+widgetObject.id+"-graph");
	if(history != null){
		valueContainer = $("#"+widgetObject.id+"-graph-history");
	}
	
	let h = valueContainer.parent().parent().parent().height();
	let gcc = $("<div>").appendTo(valueContainer);
	
	
	if(history == null){
		gcc.css("position","relative").css("padding","10px").css("height",(h-55)+"px");	
	}else{
		gcc.css("position","relative").css("padding","10px").css("height",420+"px");
	} 
	
	
	let idCanvas = "graph-"+widgetObject.id;
	var gc = $("<canvas>",{"id":idCanvas});
	
	if(history != null){
		idCanvas = "graph-history-"+widgetObject.id;
		gc = $("<canvas>",{"id":idCanvas});
	}
	gc.appendTo(gcc);

	
	//gcc.css("position","relative").height(valueContainer.height() - 20).width(valueContainer.width()-20);
	//alert(valueContainer.parent().parent().height() + "  "+valueContainer.parent().parent().attr("class")+"   "+idCanvas)
	const ctx = document.getElementById(idCanvas).getContext('2d');
	
	//const ctx = gc;
	const labels = [];
	const series = [];
	let ten=10;
	
	let maxDate = new Date("1900-01-01");
	let maxValues = [];
	let minValues = [];
	$.each(values, function(i, valueArray){
		let maxv = 0;
		let minv = 100000;
		$.each(valueArray,function(key,value){
			let dd = new Date(value.date);
			if(dd > maxDate)maxDate = dd;
			if(value.length < ten)ten = value.length;
			if(history == null){
				if( key < ten){
					if(Number(value.value) > maxv ) maxv = Number(value.value);
					if(Number(value.value) < minv ) minv = Number(value.value);
				}	
			}else{
				if(Number(value.value) > maxv ) maxv = Number(value.value);
				if(Number(value.value) < minv ) minv = Number(value.value);
				
			}
		});
		if(typeof limits[i] != "undefined"){
			let maxValue = (maxv > Number(limits[i].maxvalue) )?maxv + (maxv * 0.4):limits[i].maxvalue + (limits[i].maxvalue * 0.4);
			let minValue = (minv < Number(limits[i].minvalue) )?minv - (minv * 0.2):limits[i].minvalue - (limits[i].minvalue * 0.2);
			maxValues.push(maxValue);
			minValues.push(minValue);	
		}
	});
	let mmax = maxValues.max();
	let mmin = minValues.min();
	
	
	let limitDate = maxDate.setFullYear(maxDate.getFullYear() - 2);
	
	$.each(values, function(i, valueArray){
		const serie = [];
		$.each(valueArray,function(key,value){
				let dd = new Date(value.date);
				if(value.length < ten)ten = value.length;
				if(history == null){
					if( key < ten ){
						serie.push(value.value);
						if(i==0)labels.push(genericlib.formatDate(new Date(value.date), "mmm yyyy") );	
					}	
				}else{
					serie.push(value.value);
					if(i==0)labels.push(genericlib.formatDate(new Date(value.date), "mmm yyyy") );
				}
			});
		series.push(serie);
	});

	
	const maxTicksLimitX = (labels.length > 5 && history == null)?5:labels.length;
	const datasets = [];
	const colors= ["rgba(71, 71, 71, 0.5)","rgba(52, 155, 235, 0.5)","rgba(52, 0, 235, 0.5)","rgba(52, 155, 0, 0.5)"];
	
	$.each(values,function(i,va){
		let ds = {label:valueLabels[i],data:series[i],borderColor:colors[i],backgroundColor: colors[i]}
		datasets.push(ds);
	});
	const data = {labels: labels,datasets: datasets};
	
	const backgroundPlugin = {
	        id: 'chartAreaBackground',
	        beforeDraw(chart, args, options) {
	            const { ctx, chartArea } = chart;
	            ctx.save();
	            ctx.fillStyle = options.backgroundColor || 'white'; // Default to white if not specified
	            ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
	            ctx.restore();
	        }
	    };
		
	const customTextPlugin = {
	        id: 'customTextPlugin',
	        beforeDraw: (chart, args, options) => {
				const {ctx, chartArea: {left, top, right, bottom}, scales: {x, y}} = chart;
				ctx.font = '8px Arial';
			    ctx.fillStyle = 'black';
			    ctx.textAlign = 'center';
			    ctx.textBaseline = 'middle';
				
				//write on graph only if one serie 
				if(limits.length == 1){
					let limitsObj = limits[0];
					$.each(limitsObj.stages, function(i, stage){
						let gYmax = (stage.max - y.min) * (y.height/(y.max-y.min)) ;
						let gYmin = (stage.min - y.min) * (y.height/(y.max-y.min));
						if(stage.min == limitsObj.minvalue) gYmin = 0;
						if(stage.max == limitsObj.maxvalue) gYmax = y.height;
						let txtl = (stage.title.length > 10)?stage.title.length*4.5:stage.title.length*8;
						const centerX = (left + right) - txtl;
						ctx.fillText(stage.title, centerX, y.height-gYmax+15);
					})	
				}
				
				
				ctx.restore();
	        }
	    };
	const quadrants = {
		  id: 'quadrants',
		  beforeDraw(chart, args, options) {
		    const {ctx, chartArea: {left, top, right, bottom}, scales: {x, y}} = chart;
		    const midX = x.getPixelForValue(0);
		    ctx.save();
			if(limits.length == 1){
				let limitsObj = limits[0];
				$.each(limitsObj.stages, function(i, stage){
					ctx.fillStyle = stage.color;
					
					let gYmax = (stage.max - y.min) * (y.height/(y.max-y.min)) ;
					let gYmin = (stage.min - y.min) * (y.height/(y.max-y.min));
					
					
					if(stage.min == limitsObj.minvalue) gYmin = 0;
					if(stage.max == limitsObj.maxvalue) gYmax = y.height;
					ctx.fillRect(left, top + (y.height - gYmax), right, gYmax - gYmin);
					if(valueName == "hba1c" && stage.min == 0.06){
						ctx.fillStyle = "rgba(0,0,0,1)";
						ctx.fillRect(left, top + (y.height - gYmax), right, 1);
						ctx.fillRect(left, top + (y.height - gYmin), right, 1);
					}
				})
			}else if(valueName == "sbp,dbp" || valueName == "sbp,dbp,weight,height"){
				ctx.font = '14px Arial';
			    ctx.textAlign = 'center';
		    	ctx.textBaseline = 'middle';
				ctx.fillStyle = "rgba(52, 155, 55, 0.5)";
				let gYmax1 = (120 - y.min) * (y.height/(y.max-y.min)) ;
				ctx.fillRect(left, top + (y.height - gYmax1), right, 2);
				ctx.fillText("SBP Target", left+right - 100, y.height-gYmax1+20);
				ctx.fillStyle = "rgba(235, 155, 235, 0.5)";
				let gYmax2 = (80 - y.min) * (y.height/(y.max-y.min)) ;
				ctx.fillRect(left, top + (y.height - gYmax2), right, 2);
				ctx.fillText("DBP Target", left+right - 100, y.height-gYmax2+20);
				
			}
		    ctx.restore();
		  }
		};
	let legendFlag = (history==null)?false:true;		
	const config = {
		type: 'line',
		data: data,
		showTooltips: false,
		options: {
		    responsive: true,
			maintainAspectRatio: false,
		    plugins: { 
				legend: { display:legendFlag, position: 'top'}, 
				title: { display: false, text: 'User Activity'},
				chartAreaBackground: {backgroundColor: 'rgba(155, 1, 132, 0.2)'},
				datalabels: {
				                    // Customize label appearance
				                    color: '#4d4d4d',
				                    font: {weight: '100', size:8},
				                    formatter: function(value, context) {
				                        // Format the label text
				                        //return value + '%';
										if(valueName == "hba1c"){
											if(!isNaN(value)) value = Number(value).toFixed(3);	
										}else if(valueName == "ldl"){
											value = Number(value).toFixed(2);
										}else if(valueName == "acratio"){
											value = Number(value).toFixed(1);
										}else{
											value = Number(value).toFixed(0);
										} 
										
										return value;
				                    },
				                    anchor: 'end', // Position relative to the point
				                    align: 'top'
				                }
				
			},
			elements : {
				point:{
					radius:2
				},
				line:{
					tension :0.3
				}
			},	
			scales: {
				x:{reverse: true, display: true, offset: true ,
					ticks: {
					          font:{size:10,weight:"700"},
							  minRotation: 0,
							  maxRotation: 0,
							  color: "#4d4d4d",
							  maxTicksLimit:maxTicksLimitX,
							  
					}
				}, 
				y: { beginAtZero: true, offset: false,  max:mmax, min:mmin,
					ticks:{
						font:{size:10,weight:"700"},
						color: "#4d4d4d",
						callback: function(val, index) {return index % 2 === 0 ? this.getLabelForValue(val) : '';}
				          
				     }
				}
			 } 
		  },
		  plugins: [quadrants,ChartDataLabels,customTextPlugin]
		};
		const graph = new Chart(ctx,config);
		
		
	return graph;
}



