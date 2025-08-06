/*The MIT License (MIT)

Copyright (c) 2014 https://github.com/kayalshri/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(function($){
        $.fn.extend({
            tableExport: function(options) {
                var defaults = {
						separator: ',',
						ignoreColumn: [],
						tableName:'yourTableName',
						type:'csv',
						pdfFontSize:14,
						pdfLeftMargin:20,
						escape:'true',
						htmlContent:'false',
						consoleLog:'false',
						mime:'text/plain',
						fileName:"report"
				};
                
				var options = $.extend(defaults, options);
				var el = this;
				
				var cleanUp = function(a) {
					  a.textContent = 'Downloaded';
					  a.dataset.disabled = true;

					  // Need a small delay for the revokeObjectURL to work properly.
					  setTimeout(function() {
					    window.URL.revokeObjectURL(a.href);
					  }, 1500);
					};
				

				var downloadFile = function(contentStr) {
						window.URL = window.webkitURL || window.URL;
						if(options.mime == "image/png"){
							var bb = contentStr;
							var a = $("<a>").appendTo($(".gbuttons"));
							 a.attr("download",options.fileName);
							 a.attr("href",bb);
							 a.data("downloadurl",[options.mime, a.attr("download"), a.attr("href")].join(':'));
							 a.click(function(e) {
								  if ('disabled' in this.dataset) {return false;}
							  });
						}else{
							var bb = new Blob([contentStr], {type: options.mime});
							var a = $("<a>").appendTo($(".gbuttons"));
							 a.attr("download",options.fileName);
							 a.attr("href",window.URL.createObjectURL(bb));
							 a.data("downloadurl",[options.mime, a.attr("download"), a.attr("href")].join(':'));
							 a.click(function(e) {
								  if ('disabled' in this.dataset) {return false;}
							  });
								 
						}
						$(".gbuttons a")[0].click();
					};
					
					function b64toBlob(b64Data, contentType, sliceSize) {
						  contentType = contentType || '';
						  sliceSize = sliceSize || 512;

						  var byteCharacters = atob(b64Data);
						  var byteArrays = [];

						  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						    var slice = byteCharacters.slice(offset, offset + sliceSize);

						    var byteNumbers = new Array(slice.length);
						    for (var i = 0; i < slice.length; i++) {
						      byteNumbers[i] = slice.charCodeAt(i);
						    }

						    var byteArray = new Uint8Array(byteNumbers);

						    byteArrays.push(byteArray);
						  }

						  var blob = new Blob(byteArrays, {type: contentType});
						  return blob;
					};	
					
				
				if(defaults.type == 'csv' || defaults.type == 'txt'){
				
					// Header
					var tdData ="";
					$(el).find('thead').find('tr').each(function() {
					tdData += "\n";					
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									tdData += '"' + parseString($(this)) + '"' + defaults.separator;									
								}
							}
							
						});
						tdData = $.trim(tdData);
						tdData = $.trim(tdData).substring(0, tdData.length -1);
					});
					
					// Row vs Column
					$(el).find('tbody').find('tr').each(function() {
					tdData += "\n";
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									tdData += '"'+ parseString($(this)) + '"'+ defaults.separator;
								}
							}
						});
						//tdData = $.trim(tdData);
						tdData = $.trim(tdData).substring(0, tdData.length -1);
					});
					
					//output
					if(defaults.consoleLog == 'true'){
						console.log(tdData);
					}
					//var base64data = "base64," + $.base64.encode(tdData);
					options.mime = "application/csv";
					if(defaults.type == "txt"){
						options.mime = "text/plain";
					}
					if(defaults.fileName == "report"){
						var now = moment();
						options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+"."+defaults.type;
					}
					//window.open('data:application/'+defaults.type+';filename=exportData;' + base64data);
					downloadFile(tdData);
					
					
				}else if(defaults.type == 'sql'){
				
					// Header
					var tdData ="INSERT INTO `"+defaults.tableName+"` (";
					$(el).find('thead').find('tr').each(function() {
					
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									tdData += '`' + parseString($(this)) + '`,' ;									
								}
							}
							
						});
						tdData = $.trim(tdData);
						tdData = $.trim(tdData).substring(0, tdData.length -1);
					});
					tdData += ") VALUES ";
					// Row vs Column
					$(el).find('tbody').find('tr').each(function() {
					tdData += "(";
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									tdData += '"'+ parseString($(this)) + '",';
								}
							}
						});
						
						tdData = $.trim(tdData).substring(0, tdData.length -1);
						tdData += "),";
					});
					tdData = $.trim(tdData).substring(0, tdData.length -1);
					tdData += ";";
					
					//output
					//console.log(tdData);
					if(defaults.consoleLog == 'true'){
						console.log(tdData);
					}
					
					//var base64data = "base64," + $.base64.encode(tdData);
					//window.open('data:application/sql;filename=exportData;' + base64data);
					options.mime = "application/sql";
					if(defaults.fileName == "report"){
						var now = moment();
						options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+"."+defaults.type;
					}
					downloadFile(tdData);
				
				}else if(defaults.type == 'json'){
				
					var jsonHeaderArray = [];
					$(el).find('thead').find('tr').each(function() {
						var tdData ="";	
						var jsonArrayTd = [];
					
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									jsonArrayTd.push(parseString($(this)));									
								}
							}
						});									
						jsonHeaderArray.push(jsonArrayTd);						
						
					});
					
					var jsonArray = [];
					$(el).find('tbody').find('tr').each(function() {
						var tdData ="";	
						var jsonArrayTd = [];
					
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									jsonArrayTd.push(parseString($(this)));									
								}
							}
						});									
						jsonArray.push(jsonArrayTd);									
						
					});
					
					var jsonExportArray =[];
					jsonExportArray.push({header:jsonHeaderArray,data:jsonArray});
					
					//Return as JSON
					//console.log(JSON.stringify(jsonExportArray));
					
					//Return as Array
					//console.log(jsonExportArray);
					if(defaults.consoleLog == 'true'){
						console.log(JSON.stringify(jsonExportArray));
					}
					//var base64data = "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
					//window.open('data:application/json;filename=exportData;' + base64data);
					options.mime = "application/json";
					if(defaults.fileName == "report"){
						var now = moment();
						options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+"."+defaults.type;
					}
					downloadFile(JSON.stringify(jsonExportArray));
					
					
				}else if(defaults.type == 'xml'){
				
					var xml = '<?xml version="1.0" encoding="utf-8"?>';
					xml += '<tabledata><fields>';

					// Header
					$(el).find('thead').find('tr').each(function() {
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){					
								if(defaults.ignoreColumn.indexOf(index) == -1){
									xml += "<field>" + parseString($(this)) + "</field>";
								}
							}
						});									
					});					
					xml += '</fields><data>';
					
					// Row Vs Column
					var rowCount=1;
					$(el).find('tbody').find('tr').each(function() {
						xml += '<row id="'+rowCount+'">';
						var colCount=0;
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){	
								if(defaults.ignoreColumn.indexOf(index) == -1){
									xml += "<column-"+colCount+">"+parseString($(this))+"</column-"+colCount+">";
								}
							}
							colCount++;
						});															
						rowCount++;
						xml += '</row>';
					});					
					xml += '</data></tabledata>'
					
					if(defaults.consoleLog == 'true'){
						console.log(xml);
					}
					
					//var base64data = "base64," + $.base64.encode(xml);
					//window.open('data:application/xml;filename=exportData;' + base64data);
					
					
					options.mime = "application/xml";
					if(defaults.fileName == "report"){
						var now = moment();
						options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss');+"."+defaults.type;
					}
					downloadFile(xml);
					

				}else if(defaults.type == 'excel' || defaults.type == 'doc'|| defaults.type == 'powerpoint'  ){
					var excel="<table>";
					$(el).find('thead').find('tr').each(function() {
						excel += "<tr>";
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){					
								if(defaults.ignoreColumn.indexOf(index) == -1){
									excel += "<td>" + parseString($(this))+ "</td>";
								}
							}
						});	
						excel += '</tr>';						
					});					
					
					// Row Vs Column
					var rowCount=1;
					$(el).find('tbody').find('tr').each(function() {
						excel += "<tr>";
						var colCount=0;
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){	
								if(defaults.ignoreColumn.indexOf(index) == -1){
									excel += "<td>"+parseString($(this))+"</td>";
								}
							}
							colCount++;
						});															
						rowCount++;
						excel += '</tr>';
					});					
					excel += '</table>'
					
					if(defaults.consoleLog == 'true'){
						console.log(excel);
					}
					
					var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"+defaults.type+"' xmlns='http://www.w3.org/TR/REC-html40'>";
					excelFile += "<head>";
					excelFile += "<!--[if gte mso 9]>";
					excelFile += "<xml>";
					excelFile += "<x:ExcelWorkbook>";
					excelFile += "<x:ExcelWorksheets>";
					excelFile += "<x:ExcelWorksheet>";
					excelFile += "<x:Name>";
					excelFile += "{worksheet}";
					excelFile += "</x:Name>";
					excelFile += "<x:WorksheetOptions>";
					excelFile += "<x:DisplayGridlines/>";
					excelFile += "</x:WorksheetOptions>";
					excelFile += "</x:ExcelWorksheet>";
					excelFile += "</x:ExcelWorksheets>";
					excelFile += "</x:ExcelWorkbook>";
					excelFile += "</xml>";
					excelFile += "<![endif]-->";
					excelFile += "</head>";
					excelFile += "<body>";
					excelFile += excel;
					excelFile += "</body>";
					excelFile += "</html>";

					//var base64data = "base64," + $.base64.encode(excelFile);
					//window.open('data:application/vnd.ms-'+defaults.type+';filename=exportData.doc;' + base64data);
					if(defaults.type == 'excel' ){
						//options.mime = "application/vnd.ms-excel";
						options.mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
					}else if(defaults.type == 'doc'){
						options.mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
					}else if(defaults.type == 'powerpoint'){
						options.mime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
					}
					
					if(defaults.fileName == "report"){
						var now = moment();
						if(defaults.type == 'excel' ){
							options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+".xlsx";
						}else if(defaults.type == 'doc'){
							options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+".docx";
						}else if(defaults.type == 'powerpoint'){
							options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+".pptx";
						}
					}
					downloadFile(excelFile);
					
				}else if(defaults.type == 'png'){
					options.mime = "image/png";
					var now = moment();
					options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+".png";
					downloadFile(exportImage);
						
				}else if(defaults.type == 'pdf'){
					var doc = new jsPDF('p','pt', 'letter', true);
					doc.setFontSize(defaults.pdfFontSize);
					
					// Header
					var startColPosition=defaults.pdfLeftMargin;
					$(el).find('thead').find('tr').each(function() {
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){					
								if(defaults.ignoreColumn.indexOf(index) == -1){
									var colPosition = startColPosition+ (index * 50);									
									doc.text(colPosition,20, parseString($(this)));
								}
							}
						});									
					});					
				
				
					// Row Vs Column
					var startRowPosition = 20; var page =1;var rowPosition=0;
					$(el).find('tbody').find('tr').each(function(index,data) {
						rowCalc = index+1;
						
					if (rowCalc % 26 == 0){
						doc.addPage();
						page++;
						startRowPosition=startRowPosition+10;
					}
					rowPosition=(startRowPosition + (rowCalc * 10)) - ((page -1) * 280);
						
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){	
								if(defaults.ignoreColumn.indexOf(index) == -1){
									var colPosition = startColPosition+ (index * 50);									
									doc.text(colPosition,rowPosition, parseString($(this)));
								}
							}
							
						});															
						
					});					
										
					// Output as Data URI
					//doc.output('datauri');
					options.mime = "application/pdf";
					var now = moment();
					options.fileName = "report_"+now.format('YYYY-MM-DD_HH_mm_ss')+".pdf";
					downloadFile(doc.output());
				}
				
				
				function parseString(data){
				
					if(defaults.htmlContent == 'true'){
						content_data = data.html().trim();
					}else{
						content_data = data.text().trim();
					}
					
					if(defaults.escape == 'true'){
						content_data = escape(content_data);
					}
					
					
					
					return content_data;
				}
			
			}
        });
    })(jQuery);
        
