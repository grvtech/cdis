// <--- --------------------------------------------------------------------------------------- ----
	
// 	Blog Entry:
// 	Ask Ben: Print Part Of A Web Page With jQuery
	
// 	Author:
// 	Ben Nadel / Kinky Solutions
	
// 	Link:
// 	http://www.bennadel.com/index.cfm?event=blog.view&id=1591
	
// 	Date Posted:
// 	May 21, 2009 at 9:10 PM
	
// ---- --------------------------------------------------------------------------------------- --->

// Create a jquery plugin that prints the given element.
jQuery.fn.printJQPlot = function(title){
	// NOTE: We are trimming the jtitlerQuery collection down to the
	// first element in the collection.
	if (this.size() > 1){
		this.eq( 0 ).print();
		return;
	} else if (!this.size()){
		return;
	}
	
	//can be one or can be more
    var charts = $(this).find('div.jqplot-target');
    // var imgelem = chart.jqplotToImageElem();
    var chartsImages = [];
    for(var i=0;i<charts.length;i++){
    	var chart = charts[i];
    	//chartsImages.push($(chart).jqplotToImageElemStr());
    	chartsImages.push($(chart).jqplotToImageStr());
    	//chartsImages.push($(chart).jqplotToImageElem());
    }
    //var imageElemStr = chart.jqplotToImageElemStr();
    
    //var statsTable = $('<div></div>').append($(this).closest('div.quintile-outer-container').find('table.stats-table').clone());
    // var rowstyles = window.getComputedStyle(statsrows.get(0), '');
 
	// ASSERT: At this point, we know that the current jQuery
	// collection (as defined by THIS), contains only one
	// printable element.
 
	// Create a random name for the print frame.
	var strFrameName = ("printer-" + (new Date()).getTime());
	// Create an iFrame with the new name.
	var jFrame = $( "<iframe name='" + strFrameName + "'>" );
	// Hide the frame (sort of) and attach to the body.
	jFrame
		.css( "width", "1px" )
		.css( "height", "1px" )
		.css( "position", "absolute" )
		.css( "left", "-9999px" )
		.appendTo( $( "body:first" ) )
	;
 
	// Get a FRAMES reference to the new frame.
	var objFrame = window.frames[ strFrameName ];
 
	// Get a reference to the DOM in the new frame.
	var objDoc = objFrame.document;
 
	// Grab all the style tags and copy to the new
	// document so that we capture look and feel of
	// the current document.
 
	// Create a temp document DIV to hold the style tags.
	// This is the only way I could find to get the style
	// tags into IE.
	var jStyleDiv = $( "<div>" ).append($( "style" ).clone());
	
	// Write the HTML for the document. In this, we will
	// write out the HTML of the current element.
	objDoc.open();
	objDoc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" );
	objDoc.write( "<html>" );
	objDoc.write( "<body style='background-color:#ffffff;'>" );
	objDoc.write( "<head>" );
	objDoc.write( "<link rel='stylesheet' type='text/css' href='client/libs/css/site.css'>");
	objDoc.write( "<link rel='stylesheet' type='text/css' href='client/libs/css/cdis-print.css'>");
	objDoc.write( "<link rel='stylesheet' type='text/css' href='client/libs/css/jqplot/jquery.jqplot.min.css'>");
	objDoc.write( "<title>" );
	objDoc.write( document.title );
	objDoc.write( "</title>" );
	objDoc.write( jStyleDiv.html() );
	objDoc.write( "</head>" );

	// Typically, would just write out the html.	
	// objDoc.write( this.html() );

	objDoc.write( '<div class="cdis-print-container ui-widget ui-corner-all">');
	objDoc.write( '<div class="cdis-print-header">');
	objDoc.write( '<div class="logo">CDIS</div>');
	objDoc.write( '<div class="date">'+(new Date()).toISOString().slice(0, 10)+'</div>');
	objDoc.write( '</div>');
	objDoc.write( '<div class="cdis-print-body"><table class="cdis-print-display" border=0 style="width:600px;">');
	objDoc.write('<tr><td class="cdis-print-title">'+title+'</td></tr>');
	//objDoc.write('<tr> <td class="cdis-print-cell"> '+chartsImages.length+'---'+$(this).attr('id')+'</td></tr>');
	for(var j=0;j<chartsImages.length;j++){
    	var chartImage = chartsImages[j];
    	//alert(chartImage);
    	var rez = chartImage.replace("<img","<img style='width:100%;' ");
    	//alert(rez);
    	//objDoc.write('<tr> <td class="cdis-print-cell">');
    	objDoc.write('<tr><td>');
    	objDoc.write('<img src="'+rez+'">');
    	objDoc.write('</td></tr>');
    }
    
    objDoc.write('</table></div></div>');

	objDoc.write( "</body>" );
	objDoc.write( "</html>" );
	objDoc.close();
 
 	// 
	// When the iframe is completely loaded, print it.
	// This seemed worked in IE 9, but caused problems in FF.
	//
	// $(objFrame).load(function() {
	// 	objFrame.focus();
	// 	objFrame.print();
	// });

	//
	// This works in all supported browsers.
	// Note, might have to adjust time.
	//
	setTimeout(
		function() {
			objFrame.focus();
			objFrame.print();
		}, 750);
 

	// Have the frame remove itself in about a minute so that
	// we don't build up too many of these frames.
	setTimeout(
		function(){
			jFrame.empty();
			jFrame.remove();
		},
		(60 * 1000)
		);
}

jQuery.fn.printCDISSection = function(){
	if (this.size() > 1){
		this.eq( 0 ).print();
		return;
	} else if (!this.size()){
		return;
	}
	
	//can be one or can be more
    var charts = $(this).find('div.jqplot-target');
    var printDivs = $(this).find('div.jqplot-cdistarget');
    var chartsImages = [];
    var chartsUrlArr = [];
    for(var i=0;i<charts.length;i++){
    	var chart = charts[i];
    	html2canvas($(chart), {
			onrendered: function(canvas) {										
				var img = canvas.toDataURL("image/png");
				chartsUrlArr.push(img);
			}
    	});
    }
    
    var strFrameName = ("printer-" + (new Date()).getTime());
    
    setTimeout(function() {
    	
    	var jFrame = $( "<iframe name='" + strFrameName + "'>" );
    	jFrame
    		.css( "width", "1px" )
    		.css( "height", "1px" )
    		.css( "position", "absolute" )
    		.css( "left", "-9999px" )
    		.appendTo( $( "body:first" ) )
    	;
    	var objFrame = window.frames[ strFrameName ];
    	var objDoc = objFrame.document;
    	var jStyleDiv = $( "<div>" ).append($("style" ).clone());
     
    	objDoc.open();
    	objDoc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" );
    	objDoc.write( "<html>" );
    	objDoc.write( "<body style='background-color:#ffffff;'>" );
    	objDoc.write( "<head>" );
    	objDoc.write( "<title>" );
    	objDoc.write( document.title );
    	objDoc.write( "</title>" );
    	objDoc.write( jStyleDiv.html() );
    	objDoc.write( "</head>" );
    	
    	
    	 if ($("link[media=print]").length > 0){
             $("link[media=print]").each( function() {
            	 objDoc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
             });
         }else{
             $("link").each( function() {
            	 objDoc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
             });
         }
    	
    	objDoc.write( '<div class="cdis-print-container ui-widget ui-corner-all"> \
        <div class="cdis-print-header"><div class="logo">CDIS</div></div>\
    		<table class="cdis-print-display" border="0" width="100%">');
    	//objDoc.write('<tr> <td class="cdis-print-graph-cell"> '+chartsUrlArr.length+'---'+$(this).attr('class')+'</td></tr>');
    	 for(var i=0;i<chartsUrlArr.length;i++){
    	    	var chartUrl = chartsUrlArr[i];
    	    	objDoc.write('<tr> <td class="cdis-print-graph-cell" align="center"><img src="'+chartUrl+'"/></td></tr>');
    	    }
        objDoc.write('</table>');
        objDoc.write( '<table class="cdis-print-display" border="0" width="100%">');
        for(var jj=0;jj<printDivs.length;jj++){
        	var printDiv = printDivs[jj];
        	objDoc.write('<tr> <td align="center">'+$(printDiv).html()+'</td></tr>');
        	//objDoc.write($(printDiv).html());
        }
        objDoc.write( '</table>');
    	objDoc.write( "</body>" );
    	objDoc.write( "</html>" );
    	objDoc.close();
    }, 2000);
    
    
	setTimeout(function() {var objFrame = window.frames[ strFrameName ];objFrame.focus();objFrame.print();}, 2750);

	// Have the frame remove itself in about a minute so that
	// we don't build up too many of these frames.
	setTimeout(function(){
		jFrame.empty();
		jFrame.remove();
		},
		(60 * 1000)
		);
}


jQuery.fn.printCDISLocalListOld = function(){
	if (this.size() > 1){
		this.eq( 0 ).print();
		return;
	} else if (!this.size()){
		return;
	}
	
	//onli the list should be printed
    var printHeaderDivs = $(this).find('.list-header-container .head');
    var printBodyRowsDivs = $(this).find('.list-body-container .list-body-container-line');
    
    var strFrameName = ("CDIS Local List Printer-" + (new Date()).getTime());
    
    setTimeout(function() {
    	
    	var jFrame = $( "<iframe name='" + strFrameName + "'>" );
    	jFrame
    		.css( "width", "1px" )
    		.css( "height", "1px" )
    		.css( "position", "absolute" )
    		.css( "left", "-9999px" )
    		.appendTo( $( "body:first" ) )
    	;
    	var objFrame = window.frames[ strFrameName ];
    	var objDoc = objFrame.document;
    	//var jStyleDiv = $( "<div>" ).append($("<style>" ).clone());
     
    	objDoc.open();
    	objDoc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" );
    	objDoc.write( "<html>" );
    	objDoc.write( "<head>" );
    	objDoc.write( "<title>" );
    	objDoc.write( document.title );
    	objDoc.write( "</title>" );
    	//objDoc.write( jStyleDiv.html() );
    	
    	
    	if ($("link[media=print]").length > 0){
             $("link[media=print]").each( function() {
            	 objDoc.write("<link type='text/css' rel='stylesheet' href='"  + $(this).attr("href") + "' media='print' />");
             });
        }
    	
    	objDoc.write( "</head>" );
    	objDoc.write( "<body style='background-color:#ffffff;'>" );
    	//objDoc.write( '<div class="locallist-print-container">');
    		//page-header
    		objDoc.write( '<div class="locallist-print-container-header">');
    			objDoc.write('<table border="0" width="100%" height="100%">');
    			objDoc.write( '<tr><td class="header-cell-logo"><div class="header-logo"></td><td class="header-cell-app"><div class="header-app"><label>CDIS<label><br><span>Cree Diabetes Information System</span></td><td class="header-cell-section"><div class="header-section"><span>Local Patient List</span></td></tr>');
    			objDoc.write( '<tr><td class="header-cell-title" colspan=3><div class="header-report-title">'+getReportTitle(appFilter,"list")+'</div></td></tr>');
    			objDoc.write( '<tr><td class="header-cell-header" colspan=3><table border="0" width="100%"><tr><td class="table-header patient-details">Patient Details</td><td class="table-header patient-comments">Comments</td></table></table></td></tr>');
    			objDoc.write( '</table>');
    		objDoc.write( '</div>');
    		
    		//page-footer
    		objDoc.write( '<div class="locallist-print-container-footer">');
				objDoc.write('<table border="0" width="100%" height="100%">');
				objDoc.write( '<tr><td>Report Generated : '+moment().format()+'</td></tr>');
				objDoc.write( '</table>');
			objDoc.write( '</div>');
    		
			objDoc.write( '<div class="page locallist-print-container-body">');
    		objDoc.write('<table class="cdis-print-display" border="0" width="100%">');
    			objDoc.write( '<thead><tr><td>');
    				objDoc.write('<div class="page-header-space"></div>');
    			objDoc.write( '</td></tr></thead>');
    		
    			objDoc.write( '<tbody><tr><td>');	
	    			objDoc.write( '<table width="100%">');
	    			$.each(printBodyRowsDivs,function(index, row){
	    				objDoc.write( '<tr class="page-body-line">');
		    				objDoc.write( '<td class="patient-details">');
		    				$.each($(row).find(".value"), function(i, v){
		    					var addText = "";
		    					if($(v).hasClass("chart"))addText = "<b>Chart:</b>";
		    					if($(v).hasClass("age"))addText = "<b>Age:</b>";
		    					if($(v).hasClass("last_hba1c"))addText = "<b>most recent value:</b>";
		    					if($(v).hasClass("secondlast_hba1c"))addText = "<b>2nd most recent value:</b>";
		    					//if(i == 2 || i == 5 || i== 7)objDoc.write('<br>');
		    					if(i == 5)objDoc.write('<br>');
		    					if($(v).hasClass("dtype")){
		    						objDoc.write('<span><b>'+addText+$(v).text()+'</b></span>');
		    					}else if($(v).hasClass("fullname")){
		    						objDoc.write('<span><b>'+addText+$(v).text()+'</b></span>');
		    					}else if($(v).hasClass("last_hba1c_collecteddate")){
		    						objDoc.write('<span>('+$(v).text()+')</span>');
		    					}else if($(v).hasClass("secondlast_hba1c_collecteddate")){
		    						objDoc.write('<span>('+$(v).text()+')</span>');
		    					}else{
		    						objDoc.write('<span>'+addText+$(v).text()+'</span>');
		    					}
		    				});
		    				objDoc.write( '</td>');
		    				objDoc.write( '<td class="patient-comments">&nbsp; ');
		    				//comments cell
		    				objDoc.write( '</td>');
	    				objDoc.write( '</tr>');
	    			});
	    			objDoc.write( '</table>');
    			objDoc.write( '</td></tr></tbody>');
    			
    			objDoc.write( '<tfoot><tr><td>');
    			objDoc.write('<div class="page-footer-space"></div>');
    			objDoc.write( '</td></tr></tfoot>');
			objDoc.write( '</table>');
			objDoc.write( '</div>');
			
    	objDoc.write( "</body>" );
    	objDoc.write( "</html>" );
    	objDoc.close();
    }, 1000);
    
    
	setTimeout(function() {var objFrame = window.frames[ strFrameName ];objFrame.focus();objFrame.print();}, 2750);

	// Have the frame remove itself in about a minute so that
	// we don't build up too many of these frames.
	setTimeout(function(){
		jFrame.empty();
		jFrame.remove();
		},
		(60 * 1000)
		);
}

jQuery.fn.printCDISLocalListGraphs = function(){
	if (this.size() > 1){
		this.eq( 0 ).print();
		return;
	} else if (!this.size()){
		return;
	}
	
	//onli the list should be printed
	//can be one or can be more
    var charts = $(this).find('div.tp-graph');
    var chartsTs = $(this).find('.s-container .title');
    // var imgelem = chart.jqplotToImageElem();
    var chartsImages = [];
    var chartsTitles = [];
    var chartsData = [];
    var chartsTypes = [];
    for(var i=0;i<charts.length;i++){
    	var chart = charts[i];
    	chartsImages.push($(chart).jqplotToImageElemStr());
    	//chartsImages.push($(chart).jqplotToImageStr());
    	//chartsImages.push($(chart).jqplotToImageElem());
    	chartsTitles.push($(chartsTs[i]).text());
    	var id = $(chart).prop("id").replace("-graph","");
    	chartsData.push(eval(id+"StatsData"));
    	chartsTypes.push(id);
    }
    
    var strFrameName = ("CDIS Local List Printer-" + (new Date()).getTime());
    
    setTimeout(function() {
    	
    	var jFrame = $( "<iframe name='" + strFrameName + "'>" );
    	jFrame
    		.css( "width", "1px" )
    		.css( "height", "1px" )
    		.css( "position", "absolute" )
    		.css( "left", "-9999px" )
    		.appendTo( $( "body:first" ) )
    	;
    	var objFrame = window.frames[ strFrameName ];
    	var objDoc = objFrame.document;
    	//var jStyleDiv = $( "<div>" ).append($("<style>" ).clone());
     
    	objDoc.open();
    	objDoc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" );
    	objDoc.write( "<html>" );
    	objDoc.write( "<head>" );
    	objDoc.write( "<title>" );
    	objDoc.write( document.title );
    	objDoc.write( "</title>" );
    	
    	if ($("link[media=print]").length > 0){
             $("link[media=print]").each( function() {
            	 objDoc.write("<link type='text/css' rel='stylesheet' href='"  + $(this).attr("href") + "' media='print' />");
             });
        }
    	
    	objDoc.write( "</head>" );
    	objDoc.write( "<body style='background-color:#ffffff;'>" );
    	//objDoc.write( '<div class="locallist-print-container">');
    		//page-header
    		objDoc.write( '<div class="locallist-print-container-header">');
    			objDoc.write('<table border="0" width="100%" height="100%">');
    			objDoc.write( '<tr><td class="header-cell-logo"><div class="header-logo"></td><td class="header-cell-app"><div class="header-app"><label>CDIS<label><br><span>Cree Diabetes Information System</span></td><td class="header-cell-section"><div class="header-section"><span>Local Patient List</span></td></tr>');
    			objDoc.write( '<tr><td class="header-cell-title" colspan=3><div class="header-report-title">'+getReportTitle(appFilter,"graph")+'</div></td></tr>');
    			//objDoc.write( '<tr><td class="header-cell-header" colspan=3><table border="0" width="100%"><tr><td class="table-header patient-details">Patient Details</td><td class="table-header patient-comments">Comments</td></table></table></td></tr>');
    			objDoc.write( '</table>');
    		objDoc.write( '</div>');
    		
    		//page-footer
    		objDoc.write( '<div class="locallist-print-container-footer">');
				objDoc.write('<table border="0" width="100%" height="100%">');
				objDoc.write( '<tr><td>Report Generated : '+moment().format()+'</td></tr>');
				objDoc.write( '</table>');
			objDoc.write( '</div>');
    		
			objDoc.write( '<div class="page locallist-print-container-body">');
    		objDoc.write('<table class="cdis-print-display" border="0" width="100%">');
    			objDoc.write( '<thead><tr><td>');
    				objDoc.write('<div class="page-header-space"></div>');
    			objDoc.write( '</td></tr></thead>');
    			
    			objDoc.write( '<tbody><tr><td>');	
    			$.each(chartsImages, function(i, img){
    				objDoc.write( '<div class="page">');
		    			objDoc.write( '<table width="100%" border="0">');
		    					objDoc.write( '<tr class="page-body-line-graph-title">');
		    						objDoc.write('<td class="patient-graph-title">');
		    							objDoc.write(chartsTitles[i]);
		    						objDoc.write('</td>');
		    					objDoc.write('</tr>');
		    					objDoc.write( '<tr class="page-body-line-graph">');
		    						objDoc.write( '<td class="patient-graph">');
		    							objDoc.write(img);
		    						objDoc.write('</td>');
		    					objDoc.write('</tr>');
		    					objDoc.write( '<tr class="page-body-line-graph">');
	    							objDoc.write( '<td class="patient-graph-table" align="center">');
	    							var data = chartsData[i];
	    							var ticks = chartsData[i].ticks;
	    							var chartType = chartsTypes[i];
	    								objDoc.write( '<table>');
	    									objDoc.write( '<thead>');
	    									if(chartType == "trend"){
	    										objDoc.write( '<tr><td>Date</td><td>Improved</td><td>Constatnt</td><td>Setback</td></tr>');
	    									}else{
	    										objDoc.write( '<tr><td>Date</td><td>Number of patiens</td><td>Percentage</td></tr>');
	    									}
	    									objDoc.write( '<thead>');
	    									objDoc.write( '<tbody>');
	    									$.each(data.series[0], function(i,v){
	    										if(chartType == "trend"){
	    											objDoc.write( '<tr><td>'+moment(ticks[i][1]).format('MMMM YYYY')+'</td><td>'+data.series[2][i]+'</td><td>'+data.series[1][i]+'</td><td>'+data.series[0][i]+'</td></tr>');
	    										}else{
	    											var pr = Math.round(100*data.series[0][i]/data.series[1][i]);
	    											objDoc.write( '<tr><td>'+moment(ticks[i][1]).format('MMMM YYYY')+'</td><td>'+data.series[0][i]+'</td><td>'+pr+'%</td></tr>');
	    										}
	    									});
	    									objDoc.write( '</tbody>');
	    								objDoc.write( '</table>');
	    							objDoc.write('</td>');
	    						objDoc.write('</tr>');
		    			objDoc.write( '</table>');
	    			objDoc.write( '</div>');
	    			
	    			
    			});
    			objDoc.write( '</td></tr></tbody>');
    			
    			objDoc.write( '<tfoot><tr><td>');
    			objDoc.write('<div class="page-footer-space"></div>');
    			objDoc.write( '</td></tr></tfoot>');
			objDoc.write( '</table>');
			objDoc.write( '</div>');
			
    	objDoc.write( "</body>" );
    	objDoc.write( "</html>" );
    	objDoc.close();
    }, 1000);
    
    
	setTimeout(function() {var objFrame = window.frames[ strFrameName ];objFrame.focus();objFrame.print();}, 4750);

	// Have the frame remove itself in about a minute so that
	// we don't build up too many of these frames.
	setTimeout(function(){
		jFrame.empty();
		jFrame.remove();
		},
		(60 * 1000)
		);
}

jQuery.fn.printCDISLocalList = function(){
	if (this.size() > 1){
		this.eq( 0 ).print();
		return;
	} else if (!this.size()){
		return;
	}
	
	//onli the list should be printed
    var printHeaderDivs = $(this).find('.list-header-container .head');
    var printBodyRowsDivs = $(this).find('.list-body-container .list-body-container-line');
    
    var strFrameName = ("CDIS Local List Printer-" + (new Date()).getTime());
    
    setTimeout(function() {
    	
    	var jFrame = $( "<iframe name='" + strFrameName + "'>" );
    	jFrame
    		.css( "width", "1px" )
    		.css( "height", "1px" )
    		.css( "position", "absolute" )
    		.css( "left", "-9999px" )
    		.appendTo( $( "body:first" ) )
    	;
    	var objFrame = window.frames[ strFrameName ];
    	var objDoc = objFrame.document;
    	//var jStyleDiv = $( "<div>" ).append($("<style>" ).clone());
     
    	objDoc.open();
    	objDoc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" );
    	objDoc.write( "<html>" );
    	objDoc.write( "<head>" );
    	objDoc.write( "<title>" );
    	objDoc.write( document.title );
    	objDoc.write( "</title>" );
    	//objDoc.write( jStyleDiv.html() );
    	
    	
    	if ($("link[media=print]").length > 0){
             $("link[media=print]").each( function() {
            	 objDoc.write("<link type='text/css' rel='stylesheet' href='"  + $(this).attr("href") + "' media='print' />");
             });
        }
    	
    	objDoc.write( "</head>" );
    	objDoc.write( "<body style='background-color:#ffffff;'>" );
    	//objDoc.write( '<div class="locallist-print-container">');
    		//page-header
    		objDoc.write( '<div class="locallist-print-container-header">');
    			//objDoc.write( '<div class="locallist-print-container-header-buffer"></div>');
    			objDoc.write( '<div class="locallist-print-container-header-content">');
	    			objDoc.write('<table border="0" width="100%" height="100%">');
	    			objDoc.write( '<tr><td class="header-cell-logo"><div class="header-logo"></td><td class="header-cell-app"><div class="header-app"><label>CDIS<label><br><span>Cree Diabetes Information System</span></td><td class="header-cell-section"><div class="header-section"><span>Local Patient List</span></td></tr>');
	    			objDoc.write( '<tr><td class="header-cell-title" colspan=3><div class="header-report-title">'+getReportTitle(appFilter,"list")+'</div><div><b>MRV</b> - most recent value<br><b>2nd MRV</b> - second most recent value</div></td></tr>');
	    			objDoc.write( '<tr><td class="header-cell-header" colspan=3>');
	    				objDoc.write( '<table border="0" width="100%"><tr>');
	    					$.each(printBodyRowsDivs,function(index, row){
	    						if(index == 0){
	    							$.each($(row).find(".value"), function(i, v){
	    		    					if($(v).hasClass("chart")){
	    		    						objDoc.write('<td class="chart">Chart</b></td>');
	    		    					}else if($(v).hasClass("age")){
	    		    						objDoc.write('<td class="age">Age</td>');
	    		    					}else if($(v).hasClass("last_hba1c")){
	    		    						v1 = $(v).text();
	    		    					}else if($(v).hasClass("secondlast_hba1c")){
	    		    						v2 = $(v).text();
	    		    					}else if($(v).hasClass("fullname")){
	    		    						objDoc.write('<td class="name">Fullname</td>');
	    		    					}else if($(v).hasClass("last_hba1c_collecteddate")){
	    		    						objDoc.write('<td class="mrv">MRV</td>');
	    		    					}else if($(v).hasClass("secondlast_hba1c_collecteddate")){
	    		    						objDoc.write('<td class="mrv">2nd MRV</td>');
	    		    					}else{
	    		    					}
	    		    				});
	    							objDoc.write( '<td class="notes">Notes</td>');
	    						}else{
	    							return false;
	    						}
	    					});
	    				objDoc.write( '</tr></table></td></tr>');
	    			objDoc.write( '</table>');
	    		objDoc.write( '</div>');
    		objDoc.write( '</div>');
    		
    		//page-footer
    		objDoc.write( '<div class="locallist-print-container-footer">');
    			//objDoc.write( '<div class="locallist-print-container-footer-buffer"></div>');
    			objDoc.write( '<div class="locallist-print-container-footer-content">');
					objDoc.write('<table border="0" width="100%" height="100%">');
					objDoc.write( '<tr><td>Report Generated : '+moment().format()+'</td></tr>');
					objDoc.write( '</table>');
				objDoc.write( '</div>');
			objDoc.write( '</div>');
    		
			objDoc.write( '<div class="page locallist-print-container-body">');
			//objDoc.write( '<div class="locallist-print-container-body-buffer"></div>');
			objDoc.write( '<div class="locallist-print-container-body-content">');
    		objDoc.write('<table class="cdis-print-display" border="0" width="100%">');
    			objDoc.write( '<thead><tr><td>');
    				objDoc.write('<div class="page-header-space"></div>');
    			objDoc.write( '</td></tr></thead>');

    			
    			objDoc.write( '<tbody><tr><td>');	
	    			objDoc.write( '<table border="0" width="100%" height="100%">');
	    			$.each(printBodyRowsDivs,function(index, row){
	    				objDoc.write( '<tr class="page-body-line">');
		    				//objDoc.write( '<td class="patient-details">');
	    					var v1 = "";
	    					var v2 = "";
		    				$.each($(row).find(".value"), function(i, v){
		    					if($(v).hasClass("chart")){
		    						objDoc.write('<td class="chart"><b>'+$(v).text()+'</b></td>');
		    					}else if($(v).hasClass("age")){
		    						objDoc.write('<td class="age">'+$(v).text()+'</td>');
		    					}else if($(v).hasClass("last_hba1c")){
		    						v1 = $(v).text();
		    					}else if($(v).hasClass("secondlast_hba1c")){
		    						v2 = $(v).text();
		    					}else if($(v).hasClass("fullname")){
		    						objDoc.write('<td class="name"><b>'+$(v).text()+'</b></td>');
		    					}else if($(v).hasClass("last_hba1c_collecteddate")){
		    						objDoc.write('<td class="mrv">'+v1+'<br>('+$(v).text()+')</td>');
		    					}else if($(v).hasClass("secondlast_hba1c_collecteddate")){
		    						objDoc.write('<td class="mrv">'+v2+'<br>('+$(v).text()+')</td>');
		    					}else{
		    					}
		    				});
		    				//objDoc.write( '</td>');
		    				objDoc.write( '<td class="notes">&nbsp;</td>');
	    				objDoc.write( '</tr>');
	    			});
	    			objDoc.write( '</table>');
    			objDoc.write( '</td></tr></tbody>');
    			
    			objDoc.write( '<tfoot><tr><td>');
    			objDoc.write('<div class="page-footer-space"></div>');
    			objDoc.write( '</td></tr></tfoot>');
			objDoc.write( '</table>');
			objDoc.write( '</div>');//div content 
			objDoc.write( '</div>'); // div body
			
    	objDoc.write( "</body>" );
    	objDoc.write( "</html>" );
    	objDoc.close();
    }, 1000);
    
    
	setTimeout(function() {var objFrame = window.frames[ strFrameName ];objFrame.focus();objFrame.print();}, 2750);

	// Have the frame remove itself in about a minute so that
	// we don't build up too many of these frames.
	setTimeout(function(){
		jFrame.empty();
		jFrame.remove();
		},
		(60 * 1000)
		);
}
