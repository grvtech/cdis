/*
 * GLOGAL variables
 * */
var generalCriteria = [{"name":"patient","type":"category","label":"Required columns in report","status":"0","visible":"0","section":"1","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"ramq","type":"none","label":"Ramq number","status":"1","visible":"0","section":"1","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"chart","type":"none","label":"Chart number","status":"1","visible":"0","section":"1","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"giu","type":"none","label":"IPM Number","status":"0","visible":"0","section":"1","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"jbnqa","type":"none","label":"Band number","status":"0","visible":"0","section":"1","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"visits","type":"category","label":"General criterias","status":"0","visible":"1","section":"3","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"dtype","type":"select","label":"Type of diabetes","status":"1","visible":"1","section":"2","report":"both","hasdate":"true","datedisplay":"Date of Diagnosis"},
                       {"name":"idcommunity","type":"select","label":"Community","status":"0","visible":"1","section":"1","report":"both","hasdate":"false","datedisplay":""},
                       {"name":"sex","type":"select","label":"Gender","status":"0","visible":"1","section":"1","report":"both","hasdate":"false","datedisplay":""},
                       {"name":"dob","type":"date","label":"Date of birth","status":"0","visible":"1","section":"1","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"sbp","type":"value","label":"Systolic Blood Presure","status":"0","visible":"1","section":"3","report":"list","hasdate":"true","datedisplay":"SBP Collected Date"},
                       {"name":"dbp","type":"value","label":"Diastolic Blood Presure","status":"0","visible":"1","section":"3","report":"list","hasdate":"true","datedisplay":"DBP Collected Date"},
                       {"name":"weight","type":"value","label":"Weight","status":"0","visible":"1","section":"3","report":"list","hasdate":"true","datedisplay":"Weight Collected Date"},
                       {"name":"height","type":"value","label":"Height","status":"0","visible":"1","section":"3","report":"list","hasdate":"true","datedisplay":"Height Collected Date"},
                       {"name":"renal","type":"category","label":"Renal Data","status":"0","visible":"1","section":"5","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"acratio","type":"value","label":"AC ratio","status":"0","visible":"1","section":"5","report":"list","hasdate":"true","datedisplay":"AC Ratio Collected Date"},
                       {"name":"crea","type":"value","label":"Serum Creatinine","status":"0","visible":"1","section":"5","report":"list","hasdate":"true","datedisplay":"Sertum Creatinine Collected Date"},
                       {"name":"crcl","type":"value","label":"Creatinine Clearence","status":"0","visible":"1","section":"5","report":"list","hasdate":"true","datedisplay":"Creatinine Clereance Collected Date"},
                       {"name":"pcr","type":"value","label":"Protein Creatinine Ratio","status":"0","visible":"1","section":"5","report":"list","hasdate":"true","datedisplay":"PCR Collected Date"},
                       {"name":"egfr","type":"value","label":"EGFR","status":"0","visible":"1","section":"5","report":"list","hasdate":"true","datedisplay":"EGFR Collected Date"},
                       {"name":"lab","type":"category","label":"Glucose control data","status":"0","visible":"1","section":"7","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"hba1c","type":"value","label":"HBA1C","status":"0","visible":"1","section":"7","report":"list","hasdate":"true","datedisplay":"HBA1C Collected Date"},
                       {"name":"acglu","type":"value","label":"Plasma Glucose","status":"0","visible":"1","section":"7","report":"list","hasdate":"true","datedisplay":"Plasma Glucose Collected Date"},
                       {"name":"ogtt","type":"value","label":"OGTT","status":"0","visible":"1","section":"7","report":"list","hasdate":"true","datedisplay":"OGTT Collected Date"},
                       {"name":"lipids","type":"category","label":"Lipids data","status":"0","visible":"1","section":"1","report":"list","hasdate":"false","datedisplay":""},
                       {"name":"tchol","type":"value","label":"Total Cholesterol","status":"0","visible":"1","section":"6","report":"list","hasdate":"true","datedisplay":"Total Cholesterol Collected Date"},
                       {"name":"tglycer","type":"value","label":"Tryglicerides","status":"0","visible":"1","section":"6","report":"list","hasdate":"true","datedisplay":"Tryglicerides Collected Date"},
                       {"name":"hdl","type":"value","label":"HDL","status":"0","visible":"1","section":"6","report":"list","hasdate":"true","datedisplay":"HDL Collected Date"},
                       {"name":"ldl","type":"value","label":"LDL","status":"0","visible":"1","section":"6","report":"list","hasdate":"true","datedisplay":"LDL Collected Date"},
                       {"name":"tchdl","type":"value","label":"TCHDL","status":"0","visible":"1","section":"6","report":"list","hasdate":"true","datedisplay":"TCHDL Collected Date"}];



/*
 * EVENT definitions
 * 
 * */
$("#betweenv1").on("change",onChangeBetween);
$("#betweenv2").on("change",onChangeBetween);
$("#reportFilter input[type=radio]").on("change",onChangeReportFilter);
$("#reportType input[type=radio]").on("change",onChangeReportType);
$("#reportPeriod input[type=radio]").on("change",onChangeReportPeriod);
$("#custom-report-execute-button").on("click",executeCustomReport);

/*
 * MAIN Section 
 * */


$("#reportType").buttonset();
$("#reportPeriod").buttonset();
$("#graphType").buttonset();
$("#reportCriteria").buttonset();
$("#reportFilter").buttonset();
$("#reportCriteria").hide();
$("#betweenPeriod").hide();
$("#graphType").hide();
$("#reportFilterSelect").hide();	

if(userProfileObj.role.idrole == 2){$("#reportFilter label[for=reportFilterHcp]").text("My patients only");}

$("#betweenv1").datepicker({changeMonth: true,yearRange: "1900:" +moment().year(),dateFormat: "yy-mm-dd",changeYear: true}).button();
$("#betweenv2").datepicker({changeMonth: true,yearRange: "1900:"+ moment().year(),dateFormat: "yy-mm-dd",changeYear: true}).button();

$("input[name='reporttype']").filter("[value='list']").prop('checked', true).button("refresh");
$("input[name='reportperiod']").filter("[value='last']").prop('checked', true).button("refresh");
$("input[name='reportcriteria']").filter("[value='diabet']").prop('checked', true).button("refresh");
$("input[name='graphtype']").filter("[value='bar']").prop('checked', true).button("refresh");
$("input[name='reportfilter']").filter("[value='all']").prop('checked', true).button("refresh");

buildCriteriaList(generalCriteria, $("#general-list > .custom-list-body"));


/*
 * FUNCTIONS
 * */

function onChangeBetween(){
	$.each($("#criteria-summary div"), function(index, obj){
		if($(obj).attr("date") == "yes"){
			$(obj).attr("dateoperator","between");
			$(obj).attr("datevalue", $("#betweenv1").val()+" and "+$("#betweenv2").val());
		}
	});
}

function onChangeReportFilter(){
	if($(this).val() == 'all'){
		$("#reportFilterSelect").hide();
		
		//$("input[name='reportperiod']").filter("[value='last']").prop('checked', true).button("refresh");
	}else if($(this).val() == "hcp"){
		$("#reportFilterSelect").show();
		
		if(userProfileObj.role.idrole == 2){
			$("#hcptype").val(profession_index[userProfileObj.user.idprofesion]);
			$("#hcptype").selectmenu({disabled:true});
			
			$("#hcpname").append($("<option>",{value:userProfileObj.user.iduser,selected:true}).text(capitalizeFirstLetter(userProfileObj.user.firstname)+" "+capitalizeFirstLetter(userProfileObj.user.lastname)));
			$("#hcpid").val(userProfileObj.user.iduser);
			$("#hcpname").selectmenu({width:250,disabled:true});
		}else if(userProfileObj.role.idrole == 1){
			$("#hcptype").val("chr");
			$.each(usersArray,function(i,vo){
				  if(typeof(vo.idprofesion) != "undefined"){
					  if(vo.idprofesion == "4"){
						  $("#hcpname").append($("<option>",{value:vo.iduser}).text(capitalizeFirstLetter(vo.firstname)+" "+capitalizeFirstLetter(vo.lastname)));
					  }
				  }
			});
			
			$("#hcpname").selectmenu({
				  width:250,
				  change : function (event, uin){
					  $("#hcpid").val(uin.item.value);
				  }
			});
			$("#hcpname").selectmenu("refresh");
			$("#hcpname").selectmenu().selectmenu("menuWidget").addClass("overflowselectmenu");
			//$("#hcpname").hide();
			$("#hcptype").selectmenu({
				  change: function( event, ui ) {
					  var zone = ui.item.value;
					  
					  $("#hcpname").empty();
					  $.each(usersArray,function(i,vo){
						  if(typeof(vo.idprofesion) != "undefined"){
							  if(vo.idprofesion == profession_dbindex[zone]){
								  $("#hcpname").append($("<option>",{value:vo.iduser}).text(capitalizeFirstLetter(vo.firstname)+" "+capitalizeFirstLetter(vo.lastname)));
							  }
						  }
					  });
					  
					  $("#hcpname").selectmenu({width:250});
					  $("#hcpname").selectmenu("refresh");
					  $("#hcpname").selectmenu().selectmenu("menuWidget").addClass("overflowselectmenu");
					  
				  }
			});
		}
		
	}
}

function onChangeReportType() {
	$("#betweenPeriod").hide();
	cleanAll();
	if($(this).val() == 'graph'){
		$("#graphType").show();
		$("#reportCriteria").show();
		$("input[name='reportperiod']").filter("[value='last']").prop('checked', true).button("refresh");
		$("input[name='reportcriteria']").filter("[value='diabet']").prop('checked', true).button("refresh");
		$("#reportPeriod").hide();
		$.each($(".report-criteria-summary"),function(index, obj){
			var id = $(obj).attr("id");
			if((id == "chart-summary") || (id == "ramq-summary") ){
				$(obj).remove();
			}
		});
		
		$.each($(".report-criteria"),function(index, obj){
			var id = $(obj).attr("id");
			if((id == "dtype") || (id == "idcommunity") || (id == "sex")){
				$(obj).hide();
			}
		});
		
	}else{
		$("#graphType").hide();
		$("#reportCriteria").hide();
		$("input[name='reportperiod']").filter("[value='last']").prop('checked', true).button("refresh");
		$("#reportPeriod").show();
		
		var isChartRamq = false;
		$.each($(".report-criteria-summary"),function(index, obj){
			var id = $(this).attr("id");
			if((id == "chart-summary") || (id == "ramq-summary") ){
				isChartRamq = true;
			}
		});
		
		$.each($(".report-criteria"),function(index, obj){
			var id = $(obj).attr("id");
			if((id == "dtype") || (id == "idcommunity") || (id == "sex")){
				$(obj).show();
			}
		});
		
		if(!isChartRamq){
			addToSummary({"name":"ramq","type":"none","label":"Ramq number","status":"1","visible":"0","section":"1","report":"list","hasdate":"false","datedisplay":""});
			addToSummary({"name":"chart","type":"none","label":"Chart number","status":"1","visible":"0","section":"1","report":"list","hasdate":"false","datedisplay":""});
		}
	}
}

function onChangeReportPeriod() {
	if($(this).val() == 'between'){
		$("#betweenPeriod").show();
		$.each($("#criteria-summary div"), function(index, obj){
			if($(obj).attr("date") == "yes"){
				$(obj).attr("dateoperator", "between");
				$(obj).attr("datevalue", $("#betweenv1").val()+" and "+$("#betweenv2").val());
			}
		});
	}else{
		$("#betweenPeriod").hide();
		$.each($("#criteria-summary div"), function(index, obj){
			if($(obj).attr("date") == "yes"){
				$(obj).attr("datevalue", $("#reportPeriod input[type=radio]:checked").val()) ;
			}
		});
	}
}

function executeCustomReport(){
	if(isDemo){
		alert("This function si not available in demo mode");
	}else{
		$("body").append($("<div>",{class:"modal"}).append($("<div>",{class:"modal-span"}).text("CDIS Loading..."))).addClass("loading");
		var reportObject = getReportObjectFromCriterias();
		executeAsyncReport(reportObject);
		setTimeout(function(){$("body").removeClass("loading");$(".modal").remove();},1500);	
	}
	
}


