import {appDefine} from './define.js'; //define global variables

export function printWidget(widgetObject){
	console.log(widgetObject.configs)
	
    let images = widgetObject.images;
	let patient = widgetObject.patient;
	let diabet = widgetObject.diabet;
	console.log(images)
	console.log(widgetObject.type)
	// Create a random name for the print frame.
	var strFrameName = ("printer-" + (new Date()).getTime());
	// Create an iFrame with the new name.
	var jFrame = $( "<iframe name='" + strFrameName + "'>" );
	// Hide the frame (sort of) and attach to the body.
	jFrame.css( "width", "1px" ).css( "height", "1px" ).css( "position", "absolute" ).css( "left", "-9999px" ).appendTo( $( "body:first" ) );
	 
	// Get a FRAMES reference to the new frame.
	var objFrame = window.frames[strFrameName];
	// Get a reference to the DOM in the new frame.
	var objDoc = objFrame.document;
	 
	objDoc.open();
	objDoc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" );
	objDoc.write( "<html>" );
	objDoc.write( "<head>" );
	objDoc.write( "<link rel='stylesheet' type='text/css' href='/ncdis/client/libs/css/print.css'>");
	objDoc.write( "<title>" );
	objDoc.write( document.title );
	objDoc.write( "</title>" );
	objDoc.write( "</head>" );

	// Typically, would just write out the html.	
	// objDoc.write( this.html() );
	objDoc.write( "<body style='background-color:#ffffff;'>" );
	objDoc.write('<table border=0 cellspacing="0" style="width:800px;">');
	objDoc.write('<thead class="main"><tr><th>CDIS</th><th>'+patient.fname+' '+patient.lname+'</th><th>'+patient.ramq+'</th><th>'+(new Date()).toISOString().slice(0, 10)+'</th></tr><thead>');
	objDoc.write('<tbody>');
	objDoc.write('<tr><td class="title" colspan="4">Patient Record</td></tr>');
	objDoc.write('<tr><td class="label">Name</td><td class="value" colspan="3">'+patient.fname+' '+patient.lname+'</td></tr>');
	objDoc.write('<tr><td class="label">RAMQ</td><td class="value" colspan="3">'+patient.ramq+'</td></tr>');
	objDoc.write('<tr><td class="label">Chart</td><td class="value" colspan="3">'+patient.chart+'</td></tr>');
	objDoc.write('<tr><td class="label">Community</td><td class="value" colspan="3">'+patient.community+'</td></tr>');
	objDoc.write('<tr><td colspan="4" class="title">Diagnostics history</td></tr>');
	for(var k=0;k<diabet.dtype.values.length;k++){
	    	var value = diabet.dtype.values[k];
	    	objDoc.write('<tr><td class="value">'+appDefine.diabetes[value.value]+'</td><td class="value">'+value.date+'</td></tr>');
	    }
	if(widgetObject.type == "graph"){
		objDoc.write('<tr><td colspan="4" class="title">'+widgetObject.configs[0].label+' graph</td></tr>');
		for(var j=0;j<images.length;j++){
	    	var chartImage = images[j];
	    	objDoc.write('<tr><td colspan="4" align="center"><img src="'+chartImage.image+'"></td></tr>');
	    	objDoc.write('');
	    }	
	}else{
		objDoc.write('<tr><td colspan="4" class="title">Historical data graph</td></tr>');
		for(var j=0;j<images.length;j++){
	    	var chartImage = images[j];
			console.log(chartImage.name,widgetObject.id)
			if(chartImage.name == widgetObject.id+"-history"){
				console.log(chartImage.image)
				objDoc.write('<tr><td colspan="4" align="center"><img src="'+chartImage.image+'"></td></tr>');
						    	
			}
	    }
	}
	objDoc.write('<tr><td colspan="4">');
	objDoc.write('<table class="data" cellspacing="0">');
	if(widgetObject.configs.length == 1){
		objDoc.write('<thead><tr><th>'+widgetObject.configs[0].label+'</th><th align="center">Collected date<th></tr></thead>');
	}else{
		objDoc.write('<thead><tr>');
		$.each(widgetObject.configs,(x,config)=>{
			objDoc.write('<th>'+config.label+'</th>');
		})
		objDoc.write('<th align="center">Collected date<th></tr></thead>');
	}
	objDoc.write('<tbody id="print-tbody">');
	
	$.each(widgetObject.dates, function(x,date){
		objDoc.write('<tr>');
		$.each(widgetObject.data, function(y,vArray){
			//normaly I should only have ne date per value so to be safe create the cell now and assign last value to it
			objDoc.write('<td>');
			let val = "";
			$.each(vArray, function(z,vValue){
				if(vValue.date == date){
					val = vValue.value;
				} 
			});
			if(widgetObject.configs[y].values_object){
				console.log(widgetObject.configs[y])
				val = widgetObject.configs[y].values_object[val]
			}
			objDoc.write(val+"</td>");
		});
		objDoc.write("<td>"+date+"</td></tr>");
	});	
	
	objDoc.write('</tbody>');
	objDoc.write('</table>');
	objDoc.write('</td></tr>');
	objDoc.write('</tbody>');
    objDoc.write('</table>');
	objDoc.write( "</body>" );
	objDoc.write( "</html>" );
	objDoc.close();
 
	setTimeout(function() {objFrame.focus();objFrame.print();}, 750);
 
	// Have the frame remove itself in about a minute so that
	// we don't build up too many of these frames.
	setTimeout(function(){jFrame.empty();jFrame.remove();},(60 * 1000));
}