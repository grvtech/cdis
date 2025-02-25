/*
 * GLOGAL variables
 * */
var generalCriteria = [{"name":"patient","type":"category","label":"Required columns in report","status":"0","visible":"0","section":"1","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"ramq","type":"none","label":"Ramq number","status":"1","visible":"0","section":"1","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"chart","type":"none","label":"Chart number","status":"1","visible":"0","section":"1","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"giu","type":"none","label":"IPM Number","status":"0","visible":"0","section":"1","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"jbnqa","type":"none","label":"Band number","status":"0","visible":"0","section":"1","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"visits","type":"category","label":"General criterias","status":"0","visible":"1","section":"3","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"dtype","type":"select","label":"Type of diabetes","status":"1","visible":"1","section":"2","report":"both","hasdate":"true","iddata":"1"},
                       {"name":"dtypeCollectedDate","type":"date","label":"Date of diagnosis","status":"1","visible":"1","section":"2","report":"list","hasdate":"false","iddata":"1"},
                       {"name":"idcommunity","type":"select","label":"Community","status":"0","visible":"1","section":"1","report":"both","hasdate":"false","iddata":"0"},
                       {"name":"sex","type":"select","label":"Gender","status":"0","visible":"1","section":"1","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"dob","type":"date","label":"Date of birth","status":"0","visible":"1","section":"1","report":"both","hasdate":"false","iddata":"0"},
                       {"name":"sbp","type":"value","label":"Systolic Blood Presure","status":"0","visible":"1","section":"3","report":"both","hasdate":"true","iddata":"2"},
                       {"name":"sbpCollectedDate","type":"date","label":"SBP Collected date","status":"0","visible":"1","section":"3","report":"list","hasdate":"false","iddata":"2"},
                       {"name":"dbp","type":"value","label":"Diastolic Blood Presure","status":"0","visible":"1","section":"3","report":"both","hasdate":"true","iddata":"3"},
                       {"name":"dbpCollectedDate","type":"date","label":"SBD Collected date","status":"0","visible":"1","section":"3","report":"list","hasdate":"false","iddata":"3"},
                       {"name":"weight","type":"value","label":"Weight","status":"0","visible":"0","section":"3","report":"list","hasdate":"true","iddata":"13"},
                       {"name":"height","type":"value","label":"Height","status":"0","visible":"0","section":"3","report":"list","hasdate":"true","iddata":"14"},
                       {"name":"renal","type":"category","label":"Renal Data","status":"0","visible":"1","section":"5","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"acratio","type":"value","label":"AC ratio","status":"0","visible":"1","section":"5","report":"both","hasdate":"true","iddata":"15"},
                       {"name":"acratioCollectedDate","type":"date","label":"AC Ratio Collected date","status":"0","visible":"1","section":"5","report":"list","hasdate":"false","iddata":"15"},
                       {"name":"crea","type":"value","label":"Serum Creatinine","status":"0","visible":"1","section":"5","report":"both","hasdate":"true","iddata":"16"},
                       {"name":"creaCollectedDate","type":"date","label":"Creatinine Collected date","status":"0","visible":"1","section":"5","report":"list","hasdate":"false","iddata":"16"},
                       {"name":"crcl","type":"value","label":"Creatinine Clearence","status":"0","visible":"1","section":"5","report":"both","hasdate":"true","iddata":"17"},
                       {"name":"crclCollectedDate","type":"date","label":"CC Collected date","status":"0","visible":"1","section":"5","report":"list","hasdate":"false","iddata":"17"},
                       {"name":"pcr","type":"value","label":"Protein Creatinine Ratio","status":"0","visible":"1","section":"5","report":"both","hasdate":"true","iddata":"20"},
                       {"name":"pcrCollectedDate","type":"date","label":"PCR Collected date","status":"0","visible":"1","section":"5","report":"list","hasdate":"false","iddata":"20"},
                       {"name":"egfr","type":"value","label":"EGFR","status":"0","visible":"1","section":"5","report":"both","hasdate":"true","iddata":"19"},
                       {"name":"egfrCollectedDate","type":"date","label":"EGFR Collected date","status":"0","visible":"1","section":"5","report":"list","hasdate":"false","iddata":"19"},
                       {"name":"lab","type":"category","label":"Glucose control data","status":"0","visible":"1","section":"7","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"hba1c","type":"value","label":"HBA1C","status":"0","visible":"1","section":"7","report":"both","hasdate":"true","iddata":"27"},
                       {"name":"hba1cCollectedDate","type":"date","label":"HBA1C Collected date","status":"0","visible":"1","section":"7","report":"list","hasdate":"false","iddata":"27"},
                       {"name":"acglu","type":"value","label":"Plasma Glucose","status":"0","visible":"1","section":"7","report":"both","hasdate":"true","iddata":"28"},
                       {"name":"acgluCollectedDate","type":"date","label":"Plasma Glucose Collected date","status":"0","visible":"1","section":"7","report":"list","hasdate":"false","iddata":"28"},
                       {"name":"ogtt","type":"value","label":"OGTT","status":"0","visible":"0","section":"7","report":"both","hasdate":"true","iddata":"29"},
                       {"name":"ogttCollectedDate","type":"date","label":"OGTT Collected date","status":"0","visible":"0","section":"7","report":"list","hasdate":"false","iddata":"29"},
                       {"name":"lipids","type":"category","label":"Lipids data","status":"0","visible":"1","section":"1","report":"list","hasdate":"false","iddata":"0"},
                       {"name":"tchol","type":"value","label":"Total Cholesterol","status":"0","visible":"1","section":"6","report":"both","hasdate":"true","iddata":"22"},
                       {"name":"tcholCollectedDate","type":"date","label":"Total Cholesterol Collected date","status":"0","visible":"1","section":"6","report":"list","hasdate":"false","iddata":"22"},
                       {"name":"tglycer","type":"value","label":"Tryglicerides","status":"0","visible":"1","section":"6","report":"both","hasdate":"true","iddata":"23"},
                       {"name":"tglycerCollectedDate","type":"date","label":"Tryglicerides Collected date","status":"0","visible":"1","section":"6","report":"list","hasdate":"false","iddata":"23"},
                       {"name":"hdl","type":"value","label":"HDL","status":"0","visible":"1","section":"6","report":"both","hasdate":"true","iddata":"24"},
                       {"name":"hdlCollectedDate","type":"date","label":"HDL Collected date","status":"0","visible":"1","section":"6","report":"list","hasdate":"false","iddata":"24"},
                       {"name":"ldl","type":"value","label":"LDL","status":"0","visible":"1","section":"6","report":"both","hasdate":"true","iddata":"25"},
                       {"name":"ldlCollectedDate","type":"date","label":"LDL Collected date","status":"0","visible":"1","section":"6","report":"list","hasdate":"false","iddata":"25"},
                       {"name":"tchdl","type":"value","label":"TCHDL","status":"0","visible":"1","section":"6","report":"both","hasdate":"true","iddata":"26"},
                       {"name":"tchdlCollectedDate","type":"date","label":"TCHDL Collected date","status":"0","visible":"1","section":"6","report":"list","hasdate":"false","iddata":"26"}];

let historyReports = null;
let historyReportToDelete = null;
let globalGRVMSelect = null;
/*
 * EVENT definitions
 * 
 * */

$("#grvAddReportListCriteria").on("click",{type:"list"},addReportCriteria);
$("#grvAddReportGraphCriteria").on("click",{type:"graph"},addReportCriteria);
$("#grvClearReportList").on("click",{type:"list"},clearReportCriteria);
$("#grvClearReportGraph").on("click",{type:"graph"},clearReportCriteria);

$("<div>",{class:"cdisCisButton"}).text("Execute Report").appendTo($(".cdisReportListToolbarFooterButtons")).on("click",{type:"list"},executeCustomReport);
$("<div>",{class:"cdisCisButton"}).text("Execute Report").appendTo($(".cdisReportGraphToolbarFooterButtons")).on("click",{type:"graph"},executeCustomReport);
$(".cdisSortHistory").on("click",sortHistory);
 

/*
 * MAIN Section 
 * */

if(userProfileObj.role.idrole > 1){$("div [value='hcp']").text("My patients only").attr("value","myhcp");}

let rType = grvwtabs("grvCustomReportType");

//list
let r1 = grvwradio("grvReportPeriodList");
r1.on("change",{container:"cdisReportPeriodListContainer",reportContainer:"cdisReportListToolbarBody", object:r1},changeReportPeriod);
let r2 = grvwradio("grvReportFilterList");
r2.on("change",{container:"cdisReportFilterListContainer",reportContainer:"cdisReportListToolbarBody", object:r2},changeReportFilter);

let ramqCriteriaObject = getGeneralCriteriaObject("ramq");
let ramqObj = {name:ramqCriteriaObject.name,section:ramqCriteriaObject.section, type:ramqCriteriaObject.type,filter:"allvalues",operator:"equal",value:"0",hasdate:"",label:"RAMQ",iddata:"0"};
addToSummaryObject(ramqObj);
let chartCriteriaObject = getGeneralCriteriaObject("chart");
let chartObj = {name:chartCriteriaObject.name,section:chartCriteriaObject.section, type:chartCriteriaObject.type,filter:"allvalues",operator:"equal",value:"0",hasdate:"",label:"Chart",iddata:"0"};
addToSummaryObject(chartObj);
 
console.log(userProfileObj);    
getUserReportHistory(userProfileObj.user.iduser,"asc");
$(".cdisCustomReports").height($(".cdisCustomReports").parent().height());
$("#grvCustomReportType article").height($("#grvCustomReportType").height() - $("#grvCustomReportType ul").height() - 50);
$(".cdisCustomReportsHistory").height($("#grvCustomReportType article").height()+60);


//graph
let p1 = grvwradio("grvReportGraphType");
//p1.on("change",{container:"cdisReportPeriodListContainer",reportContainer:"cdisReportListToolbarBody", object:r1},changeReportPeriod);
let p2 = grvwradio("grvReportGraphCriteria");
p2.on("change",{container:"cdisReportGraphCriteriaContainer",reportContainer:"cdisReportGraphToolbarBody", object:p2},changeReportGraphCriteria);
let p3 = grvwradio("grvReportGraphFilter");
p3.on("change",{container:"cdisReportFilterGraphContainer",reportContainer:"cdisReportGraphToolbarBody", object:p3},changeReportFilter);

/* 
 * FUNCTIONS
 * */
 
 function clearReportCriteria(event){
	let type = event.data.type;
	let criteriaContainer = null;
	if(type == "list"){
		criteriaContainer = $(".cdisReportListToolbarBody");
		r1.setValue("last");
		r2.setValue("allhcp");
		criteriaContainer.empty();
		let ramqCriteriaObject = getGeneralCriteriaObject("ramq");
		let ramqObj = {name:ramqCriteriaObject.name,section:ramqCriteriaObject.section, type:ramqCriteriaObject.type,filter:"allvalues",operator:"equal",value:"0",hasdate:"",label:"RAMQ",iddata:"0"};
		addToSummaryObject(ramqObj);
		let chartCriteriaObject = getGeneralCriteriaObject("chart");
		let chartObj = {name:chartCriteriaObject.name,section:chartCriteriaObject.section, type:chartCriteriaObject.type,filter:"allvalues",operator:"equal",value:"0",hasdate:"",label:"Chart",iddata:"0"};
		addToSummaryObject(chartObj);
		$(".cdisReportNotes textarea").empty();
		$(".cdisButtonLastExecutionList").remove();
	}else if(type == "graph"){
		criteriaContainer = $(".cdisReportGraphToolbarBody");
		//criteriaContainer.attr("graphtype","line");
		p1.setValue("line");
		p2.setValue("dtype");
		p3.setValue("allhcp");
		criteriaContainer.attr("periodreport","last");
		criteriaContainer.empty();
		$(".cdisReportGraphNotes textarea").empty();
		$(".cdisButtonLastExecutionGraph").remove();
	}
	criteriaContainer.attr("idreport","0");
	criteriaContainer.attr("typereport",type);
	//criteriaContainer.attr("periodreport","last");
	criteriaContainer.attr("titlereport","Custom Report");
	//criteriaContainer.attr("filterreport","allhcp");
	
}
 
 function changeReportPeriod(event){
	let containerName = event.data.container;
	let container = $("."+containerName);
	let radio = event.data.object;
	let radioValue = radio.getValue();
	let betweenContainer = $(".cdisReportPeriodBetweenContainer");
	
	if(betweenContainer.length == 0){
		betweenContainer = $("<div>",{class:"cdisReportPeriodBetweenContainer"}).appendTo(container);	
	}
	betweenContainer.empty();
	if(radioValue == "between"){
		$("<input>",{type:"text",id:"grvReportPeriodBetweenValue1"}).appendTo(betweenContainer);
		$("<span>").text(" and ").appendTo(betweenContainer);
		$("<input>",{type:"text",id:"grvReportPeriodBetweenValue2"}).appendTo(betweenContainer);
		new Datepicker("#grvReportPeriodBetweenValue1",{yearRange:50,onChange:changeDateFormat});
		new Datepicker("#grvReportPeriodBetweenValue2",{yearRange:50,onChange:changeDateFormat});
	}else{
		betweenContainer.remove();
	}
}
 
 
function formatDate(date){
	let result = "";
	if(typeof date != "undefined"){
		result = moment(date).format('YYYY-MM-DD');
	}
	return result;	
} 
 
function changeDateFormat(date){
	$(".cdisCriteriaFilterErrorMessage").empty();
	if(typeof date != "undefined"){
		this._el.value = formatDate(date);
		let v1d = moment($("#grvReportPeriodBetweenValue1").val());
		let v2d = moment($("#grvReportPeriodBetweenValue2").val());
		if(v1d.isAfter(v2d))$(".cdisCriteriaFilterErrorMessage").text("Please respect minimum and maximum date format!");
		
		if(v1d!="" && typeof v1d != "undefined" && v2d!="" && typeof v2d != "undefined"){
			$(".cdisReportListToolbarBody").attr("periodreport",v1d+"|"+v2d);
		}				
	}
}

function changeFormatDatepicker(date){
	if(typeof date != "undefined"){
		this._el.value = formatDate(date);
	}
}


function changeReportGraphCriteria(event){
	let containerName = event.data.container;
	let container = $("."+containerName);
	let radio = event.data.object;
	let radioValue = radio.getValue();
	let reportContainer = $("."+event.data.reportContainer);
	let selectContainer = $(".cdisReportGraphCriteriaSelectContainer");
	if(selectContainer.length == 0 )selectContainer = $("<div>",{class:"cdisReportGraphCriteriaSelectContainer"}).appendTo(container);
	selectContainer.empty();
	if(radioValue == "idcommunity"){
		$("<div>",{class:"cdisMSIdcommunity",id:"grvReportGraphCriteriaIdcommunity"}).appendTo(selectContainer);
		let voptions = {"container":"cdisMSIdcommunity","maxSelect":"2","defaultSelected":"0","idrole":userProfileObj.role.idrole};
		let vlist = [{"name":"All Communities","value":"0"},
				            {"name":"Chisasibi","value":"1"},
				            {"name":"Eastmain","value":"2"},
				            {"name":"Mistissini","value":"3"},
				            {"name":"Nemaska","value":"4"},
				            {"name":"Oujebougoumou","value":"5"},
				            {"name":"Waskaganish","value":"6"},
				            {"name":"Waswanipi","value":"7"},
				            {"name":"Wemindji","value":"8"},
				            {"name":"Whapmagoostui","value":"9"}];
				
		let ms = new GRVMSelect(vlist,voptions);

		$(ms.object).change(function(){
			var v = ms.getValue();
			$(ms.element).attr("value",v);
			if(v != "0"){
				//show period select
				let sc = $(".cdisReportGraphCriteriaPeriodContainer");
				if(sc.length == 0)sc = $("<div>",{class:"cdisReportGraphCriteriaPeriodContainer"}).appendTo(selectContainer);
				sc.empty();
				$(".cdisReportGraphToolbarBody").attr("periodreport","6");
				$("<select>",{class:"cdisReportGraphCriteriaPeriod"}). appendTo(sc)
					.append($("<option>",{value:"6"}).text("in the last 6 months"))
					.append($("<option>",{value:"12"}).text("in the last 12 months"))
					.append($("<option>",{value:"1"}).text("last year"))
					.append($("<option>",{value:"2"}).text("last 2 years"))
					.on("change",function(){
						$(".cdisReportGraphToolbarBody").attr("periodreport",$(this).val());
					});
			}else{
				let sc = $(".cdisReportGraphCriteriaPeriodContainer");
				sc.remove();
				$(".cdisReportGraphToolbarBody").attr("periodreport","last");
			}			
			
		});
		globalGRVMSelect = ms;
		//now clean idcommunity from criterias 
		$.each($(".cdisReportGraphToolbar div"),function(k,v){
			if($(v).attr("name") == "idcommunity"){
				$(v).remove();	
			}
		});
			
	}else if(radioValue == "dtype"){
		selectContainer.remove();
		$(".cdisReportGraphToolbarBody").attr("periodreport","last");
		//now clean dtype from criterias 
		$.each($(".cdisReportGraphToolbar div"),function(k,v){
			if($(v).attr("name") == "dtype"){
				$(v).remove();	
			}
		});
	}
}


 
function changeReportFilter(event){
	let containerName = event.data.container;
	let container = $("."+containerName);
	let radio = event.data.object;
	let radioValue = radio.getValue();
	let reportContainer = $("."+event.data.reportContainer);
	let selectContainer = $(".cdisReportFilterListSelectContainer");
	if(containerName.indexOf("Graph")>=0) selectContainer = $(".cdisReportFilterGraphSelectContainer");
	if(selectContainer.length == 0 ){
		let cl = "cdisReportFilterListSelectContainer";
		if(containerName.indexOf("Graph")>=0) cl = "cdisReportFilterGraphSelectContainer";
		selectContainer = $("<div>",{class:cl}).appendTo(container);
	}
	
	selectContainer.empty();
	if(radioValue == "hcpid"){
		let s = $("<select>",{}).appendTo(selectContainer);
		let gr1 = $("<optgroup>",{label:"MDs"}).appendTo(s);
		let gr2 = $("<optgroup>",{label:"Nurse"}).appendTo(s);
		let gr3 = $("<optgroup>",{label:"Nutritionist"}).appendTo(s);
		let gr4 = $("<optgroup>",{label:"PCCR or Team"}).appendTo(s);
		$.each(usersArray,function(i,v){
			if(v.idprofesion == 1)$("<option>",{value:v.iduser}).text(v.firstname+" "+v.lastname).appendTo(gr1);
			if(v.idprofesion == 2)$("<option>",{value:v.iduser}).text(v.firstname+" "+v.lastname).appendTo(gr2);
			if(v.idprofesion == 3)$("<option>",{value:v.iduser}).text(v.firstname+" "+v.lastname).appendTo(gr3);
			if(v.idprofesion == 4)$("<option>",{value:v.iduser}).text(v.firstname+" "+v.lastname).appendTo(gr4);
		});
		s.on("change",function(){
			$(reportContainer).attr("filterreport",$(this).val());
		});
		s.trigger("change");	
	}else if(radioValue == "myhcp"){
		$(reportContainer).attr("filterreport",userObj[0].iduser);
	}else{
		selectContainer.remove();
	}
}
 

function addReportCriteria(event){
	let type = event.data.type;
	displayCriteriasList(type);
	$("#grvCriteriaSelect").on("change",{name:"grvCriteriaSelect",type:type},selectCriteria);
	
}


function displayCriteriasList(type){
	var bconfig = {"width":"680","height":"430"};
	var bbut = [{"text":"Close","action":"closeGRVPopup"},{"text":"Add Criteria","action":"addCriteriaItem"}];
	var txt = buildCriteriaPopupForm(type);
	showGRVPopup("Choose Criteria",txt,bbut,bconfig);
}


function addCriteriaItem(){
	let csf = $(".cdisCriteriaSelectFilter");
	let operator = $("#grvCriteriaFilterOperator").val();
	let hasOperator = false;
	let hasValue = false;
	let hasOperatorDate = false;
	let hasValueDate = false;
	if(csf.attr("type") == "date")operator = $("#grvCriteriaFilterOperatorDate").val();
	if(operator != 0)hasOperator = true;
	let value = "";
	let valueDate = "";
	let operatorDate = "";
	let filterValue = $("#grvCriteriaFilterRadio").attr("value");
	let checkIncludeDate = "";
	
	if(operator == "morethan")operator = "more than";
	if(operator == "lessthan")operator = "less than";
	
	if($("#grvCriteriaFilterIncludeDate").length > 0 )checkIncludeDate = $("#grvCriteriaFilterIncludeDate").attr("value");
	if(filterValue == "filtervalues"){
		if(operator == "between"){
			let v1, v2 = "";
			if(csf.attr("type") == "date"){
				v1 = $("#grvCriteriaFilter #grvCriteriaFilterValueDate1").val();
				v2 = $("#grvCriteriaFilter #grvCriteriaFilterValueDate2").val();
			}else{
				v1 = $("#grvCriteriaFilter #grvCriteriaFilterValue1").val();
				v2 = $("#grvCriteriaFilter #grvCriteriaFilterValue2").val();	
			}
			
			if( v1 != "" && v2 != "")hasValue = true;
			value = v1+"|"+v2 ;
		}else{
			if(csf.attr("type") == "date"){
				value = $("#grvCriteriaFilter #grvCriteriaFilterValueDate").val();
			}else{
				value = $("#grvCriteriaFilter #grvCriteriaFilterValue").val();	
			}
			
			if(value != "") hasValue=true;
		}
		
		if(checkIncludeDate.indexOf("includeDate") >=0){
			operatorDate = $("#grvCriteriaFilterDate #grvCriteriaFilterOperatorDate").val();
			if(operatorDate != "0")hasOperatorDate = true;
			if(operatorDate == "between"){
				let v1Date = $("#grvCriteriaFilterDate #grvCriteriaFilterValueDate1").val();
				let v2Date = $("#grvCriteriaFilterDate #grvCriteriaFilterValueDate2").val();
				if( v1Date != "" && v2Date != "")hasValueDate = true;
				valueDate = v1Date+"|"+v2Date ;
			}else{
				valueDate = $("#grvCriteriaFilterDate #grvCriteriaFilterValueDate").val();
				if(valueDate != "") hasValueDate=true;
			}
			
			if(hasOperator && hasValue && hasOperatorDate && hasValueDate){
				let obj = {name:csf.attr("name"),section:csf.attr("section"), type:csf.attr("type"),filter:csf.attr("filter"),operator:operator,value:value,hasdate:$("#grvCriteriaFilterIncludeDate").attr("value"),label:csf.attr("label"),iddata:csf.attr("iddata")}
				addToSummaryObject(obj);
				let objCriteriaDate = getGeneralCriteriaObject(csf.attr("name")+"CollectedDate");
				let objDate = {name:objCriteriaDate.name,section:objCriteriaDate.section, type:"date",filter:"filtervalues",operator:operatorDate,value:valueDate,hasdate:"false",label:objCriteriaDate.label,iddata:objCriteriaDate.iddata}
				addToSummaryObject(objDate);
				return true;	
			}else{
				$(".cdisCriteriaFilterErrorMessage").text("Please choose an operator and a correct value for criteria!")
				return false;	
			}
			
			
		}else{
			if(hasOperator && hasValue){
				let obj = {name:csf.attr("name"),section:csf.attr("section"), type:csf.attr("type"),filter:csf.attr("filter"),operator:operator,value:value,hasdate:$("#grvCriteriaFilterIncludeDate").attr("value"),label:csf.attr("label"),iddata:csf.attr("iddata")}
				addToSummaryObject(obj);
				return true;	
			}else{
				$(".cdisCriteriaFilterErrorMessage").text("Please choose an operator and a correct value for criteria!")
				return false;	
			}
		}
	}else{
		//all values
		
		let obj = {name:csf.attr("name"),section:csf.attr("section"), type:csf.attr("type"),filter:csf.attr("filter"),operator:"equal",value:"0",hasdate:$("#grvCriteriaFilterIncludeDate").attr("value"),label:csf.attr("label"),iddata:csf.attr("iddata")}
		addToSummaryObject(obj);
		
		if(checkIncludeDate.indexOf("includeDate") >=0){
			let objCriteriaDate = getGeneralCriteriaObject(csf.attr("name")+"CollectedDate");
			let objDate = {name:objCriteriaDate.name,section:objCriteriaDate.section, type:"date",filter:"allvalues",operator:"equal",value:"0",hasdate:"false",label:objCriteriaDate.label,iddata:objCriteriaDate.iddata}
			addToSummaryObject(objDate);
		}
		return true;	
	} 
}



function addToSummaryObject(objItem){
	let activeTab = rType.getActive();
	let container = $(".cdisReportListToolbarBody");
	if(activeTab == 1) container = $(".cdisReportGraphToolbarBody");
	var summary = $("<div>",{id:"grvSummary"+objItem.name,class:"cdisReportCriteriaSummary"}).appendTo(container);
	summary.attr("section",objItem.section);
	summary.attr("name",objItem.name);
	summary.attr("operator",objItem.operator);
	summary.attr("value",objItem.value);
	summary.attr("display",objItem.label);
	summary.attr("type",objItem.type);
	summary.attr("filter",objItem.filter);
	summary.attr("iddata",objItem.iddata);
	
	$("<p>").append($("<b>").text("Column : ")).append($("<span>").text(objItem.label)).appendTo(summary);
	let value = objItem.value;
	let filter = "no filter";
	
	if(objItem.filter == "filtervalues"){
		if(objItem.type == "select")value = eval("creport_"+objItem.name+"["+value+"]");
		if(value.indexOf("|") >= 0)value = value.replace("|" , " and ");
		filter = objItem.operator+" "+value;	
	}else {
		filter = "all values";	
	}
	$("<p>").append($("<b>").text("[ ")).append($("<i>").text(filter)).append($("<b>").text(" ]")).appendTo(summary);
	$("<div>",{class:"cdisReportCriteriaSummaryClose"}).append($("<i>",{class:"fa fa-times"})).appendTo(summary).click(function(){$(this).parent().remove();});
}


function buildCriteriaPopupForm(type){
	var precontainer = $("<div>");
	var container = $("<div>",{class:"cdisCriteriaPopupForm"}).appendTo(precontainer);
	$("<p>").text("You can add a new criteria to the report. The criteria choosen will be displayed as a column in the report. You can also define a filter for some of the criteria chosen.").appendTo(container);		
	$("<label>",{for:"grvCriteriaSelect"}).text("Select criteria : ").appendTo(container);
	var criteriaSelect = $("<select>",{id:"grvCriteriaSelect"}).appendTo(container);
	$("<option>",{value:0}).text("Select from list").appendTo(criteriaSelect);
	var gr1 = $("<optgroup>",{label:"Patient demographic data"}).appendTo(criteriaSelect);
	var gr2 = $("<optgroup>",{label:"Glucose control tests laboratory data"}).appendTo(criteriaSelect);
	var gr3 = $("<optgroup>",{label:"Renal tests laboratory data"}).appendTo(criteriaSelect);
	var gr4 = $("<optgroup>",{label:"Lipid tests laboratory data"}).appendTo(criteriaSelect);
	let classContainer = "";
	if(type == "list"){
		classContainer = "cdisReportListToolbarBody";
	}else{
		classContainer = "cdisReportGraphToolbarBody";
	}
	
	$.each(generalCriteria, function(index, objItem){
		if(objItem.visible != "0" && (objItem.report==type || objItem.report=="both")){
			var oName = objItem.name;
			var isAdded = false;
			$.each($("."+classContainer+" div"),function(k,v){
				if($(v).attr("name") == oName){
					isAdded=true;
					return false;	
				}
			});
			if(!isAdded){
				if(objItem.type != "category"){
					if(oName == "ramq" || oName == "chart" || oName == "dtype" || oName == "idcommunity" || oName == "dob" || oName == "sbp" || oName == "dbp" || oName == "weight" || oName == "height"){
						if(type == "graph"){
							if($("#grvReportGraphCriteria").attr("value") == "dtype"){
								//do not add dtype
								if(oName != "dtype") $("<option>",{value:oName}).text(objItem.label).appendTo(gr1);
							}else if($("#grvReportGraphCriteria").attr("value") == "idcommunity"){
								if(oName != "idcommunity") $("<option>",{value:oName}).text(objItem.label).appendTo(gr1);
							}
						}else{
							$("<option>",{value:oName}).text(objItem.label).appendTo(gr1);	
						}
						
					}else if(oName == "acratio" || oName =="crea" || oName =="crcl" || oName =="pcr" || oName =="egfr"){
						$("<option>",{value:oName}).text(objItem.label).appendTo(gr3);
					}else if(oName == "hba1c" || oName =="acglu" || oName =="ogtt"){
						$("<option>",{value:oName}).text(objItem.label).appendTo(gr2);
					}else if(oName == "tchol" || oName =="tglycer" || oName =="hdl" || oName =="ldl" || oName =="tchdl"){
						$("<option>",{value:oName}).text(objItem.label).appendTo(gr4);
					}
				}	
			}
			
		}
	});
	$("<div>",{class:"cdisCriteriaSelectFilter"}).appendTo(container);
	return $(precontainer).html();	
	
}




function selectCriteria(event){
	let select = $("#"+event.data.name);
	let type = event.data.type;
	let container = $(".cdisCriteriaSelectFilter");
	let cObj =  getGeneralCriteriaObject(select.val());
	container.empty();
	$("<p>").text("You can choose to define a filter for criteria selected or to see all the values of the criteria.").appendTo(container);
	if(type == "list"){
		$("<div>",{id:"grvCriteriaFilterRadio",type:"grvwradio"}).appendTo(container)
			.append($("<div>",{value:"allvalues", default:1}).text("All values"))
			.append($("<div>",{value:"filtervalues"}).text("Filter"));
		let fRadio = grvwradio("grvCriteriaFilterRadio");
		fRadio.on("change",{container:"cdisCriteriaFilter",filter:fRadio, select:select, type:type},buildFilterForm)
		container.attr("filter",fRadio.getValue());
		if(cObj.hasdate == "true"){
			$("<div>",{type:"grvwcheck",id:"grvCriteriaFilterIncludeDate"}).appendTo(container).append($("<div>",{value:"includeDate",default:1}).append($("<i>",{class:"fa"})).append($("<span>").text("Include also the date of the collected value")));
			let cd =  grvwcheck("grvCriteriaFilterIncludeDate");
			cd.on("change",{object:cd, filter:fRadio},checkDate);	
		}
	}else{
		$("<div>",{id:"grvCriteriaFilterRadio",type:"grvwradio"}).appendTo(container)
			.append($("<div>",{value:"filtervalues", default:1}).text("Filter"));
		let fRadio = grvwradio("grvCriteriaFilterRadio");
		fRadio.on("change",{container:"cdisCriteriaFilter",filter:fRadio, select:select, type:type},buildFilterForm)
		let p = {data:{container:"cdisCriteriaFilter",filter:fRadio, select:select, type:type}};
		buildFilterForm(p);
		container.attr("filter",fRadio.getValue());
	}
	
	$("<div>",{class:"cdisCriteriaFilterErrorMessage"}).appendTo(container);
	$("<div>",{class:"cdisCriteriaFilter", id:"grvCriteriaFilter"}).appendTo(container);
	let name = $("#grvCriteriaSelect").val();
	container.attr("name",name);
	container.attr("label",cObj.label)
	container.attr("section",cObj.section);
	container.attr("type",cObj.type);
	container.attr("iddata",cObj.iddata);
}

function checkDate(event){
	let ob = event.data.object;
	let filter = event.data.filter;
	let value = ob.getValue();
	let filterValue = filter.getValue();
	if(value.indexOf("includeDate") >= 0 && filterValue == "filtervalues"){
		$("#grvCriteriaFilterDate").css("display","grid");
	}else{
		$("#grvCriteriaFilterDate").css("display","none");
	}
}


function buildFilterForm(event){
	let container = $("."+event.data.container);
	let filter = event.data.filter;
	let filterValue = filter.getValue();
	let select = event.data.select;
	let cName = select.val();
	let cObj =  getGeneralCriteriaObject(cName);
	let type = event.data.type;
	container.empty();
	let p = container.parent();
	p.attr("filter",filterValue);
	let hasDate = $("#grvCriteriaFilterIncludeDate").attr("value"); 
	
	if(filterValue == "filtervalues"){
		$("<div>",{class:"label"}).text(cObj.label).appendTo(container);
		$("<div>",{class:"operator"}).appendTo(container); 
		$("<div>",{class:"value"}).appendTo(container);
		getOperatorForValue(cName,container);
		
		
		if(hasDate != "" && typeof hasDate != "undefined" ){
			let cObjDate = getGeneralCriteriaObject(cName+"CollectedDate");
			let containerDate = $("<div>",{class:"cdisCriteriaFilter",id:"grvCriteriaFilterDate"}).appendTo(p);
			$("<div>",{class:"label"}).text(cObjDate.label).appendTo(containerDate);
			$("<div>",{class:"operator"}).appendTo(containerDate); 
			$("<div>",{class:"value"}).appendTo(containerDate);
			
			getOperatorForValue(cName+"CollectedDate",containerDate);
			
			if($("#grvReportPeriodList").attr("value") == "between"){
				$("#grvCriteriaFilterOperatorDate").val("between").trigger("change");
				$("#grvCriteriaFilterOperatorDate").prop('readonly', true);
				
			}
		}
	}else{
		//all values no need for filter
		//container.empty();
	}
}


function getOperatorForValue(name,container){
	let cObj =  getGeneralCriteriaObject(name);
	let result = null;
	 
	if(cObj.type == "select"){
		result = $("<input>",{id:"grvCriteriaFilterOperator",value:"equal",readonly:"readonly"}).text("Equal");
		result.appendTo(container.find(".operator"));
		getFieldForValue(name,container,"equal");
	}else if(cObj.type == "date"){
		
		if($("#grvReportPeriodList").attr("value") == "between"){
			result = $("<input>",{id:"grvCriteriaFilterOperatorDate",value:"between",readonly:"readonly"}).text("Between");
			result.appendTo(container.find(".operator"));
			let operatorValue = result.val();
			getFieldForValue(name,container,operatorValue)
		}else{
			result = $("<select>",{id:"grvCriteriaFilterOperatorDate"});
			$("<option>",{value:"0"}).text("Select operator").appendTo(result);
			$("<option>",{value:"before"}).text("Before").appendTo(result);
			$("<option>",{value:"after"}).text("After").appendTo(result);
			$("<option>",{value:"between"}).text("Between").appendTo(result);
			$("<option>",{value:"equal"}).text("Equal").appendTo(result);
			result.appendTo(container.find(".operator"));
			result.on("change",function(){
				let operatorValue = $(this).val();
				getFieldForValue(name,container,operatorValue)
			});
		}
		
		
	}else if(cObj.type == "value"){
		result = $("<select>",{id:"grvCriteriaFilterOperator"});
		$("<option>",{value:"0"}).text("Select operator").appendTo(result);
		$("<option>",{value:"equal"}).text("Equal").appendTo(result);
		$("<option>",{value:"morethan"}).text("More than").appendTo(result);
		$("<option>",{value:"lessthan"}).text("Less than").appendTo(result);
		$("<option>",{value:"between"}).text("Between").appendTo(result);
		result.appendTo(container.find(".operator"));
		result.on("change",function(){
			let operatorValue = $(this).val();
			getFieldForValue(name,container,operatorValue)
		});
	}
	//return result;
	
}


function getFieldForValue(name,container,operatorValue){
	let cObj =  getGeneralCriteriaObject(name);
	let cName = cObj.name;
	let result = null;
	
	/*
	values types are:
		select with options from array  idcommunity sex dtype 
		value for operators equal, more than, less than,
		 
		2 value set for between
		
		date value for equal, after, before
		2 date value for between
		 
	 */
	 let valueName = "grvCriteriaFilterValue";
	 //if(cObj.hasdate == "true")valueName = valueName+"Date";
	container.find(".value").empty();
	if(cObj.type == "select"){
		result = $("<select>",{id:valueName});
		result.appendTo(container.find(".value"));
		let optionsArray = eval("creport_"+name);
		$.each(optionsArray,function(i,v){$("<option>",{value:i}).text(optionsArray[i]).appendTo(result);});
	}else if(cObj.type == "date"){
		if(operatorValue == "between"){
			let d = $("<div>");
			d.appendTo(container.find(".value"));
			result1 = $("<input>",{id:valueName+"Date1", type:"text", class:"between"});
			result1.appendTo(d);
			$("<b>").text("and").appendTo(d);
			result2 = $("<input>",{id:valueName+"Date2", type:"text", class:"between"});
			result2.appendTo(d);
			if($("#grvReportPeriodList").attr("value")  == "between"){
				result1.val($("#grvReportPeriodBetweenValue1").val()).prop("readonly",true);
				result2.val($("#grvReportPeriodBetweenValue2").val()).prop("readonly",true);
			}else{
				let dp1 = new Datepicker("#"+valueName+"Date1",{onChange:changeFormatDatepicker});
				let dp2 = new Datepicker("#"+valueName+"Date2",{onChange:changeFormatDatepicker});	
			}
		}else{
			result = $("<input>",{id:valueName+"Date", type:"text"});
			result.appendTo(container.find(".value"));
			let dp = new Datepicker("#"+valueName+"Date",{onChange:changeFormatDatepicker});
		}
	
	}else if(cObj.type == "value"){
		if(operatorValue == "between"){
			let d = $("<div>");
			d.appendTo(container.find(".value"));
			result1 = $("<input>",{id:valueName+"1", type:"text", class:"between"});
			result1.appendTo(d);
			$("<b>").text("and").appendTo(d);
			result2 = $("<input>",{id:valueName+"2", type:"text", class:"between"});
			result2.appendTo(d);
		}else{
			result = $("<input>",{id:valueName, type:"text"});
			result.appendTo(container.find(".value"));
		}
	}
	//return result;
}



function getGeneralCriteriaObject(name){
	let result = null;
	$.each(generalCriteria, function(index,obj){
		if(obj.name == name){
			result = obj;
			return false;
		}
	});
	return result;
}


function getReportObjectFromCriterias(type){
	let container = $(".cdisReportListToolbarBody");
	if(type == "graph") container = $(".cdisReportGraphToolbarBody");
	var result = {};
	var now = moment();
	result["id"] = container.attr("idreport");
	result["type"] = container.attr("typereport");
	result["period"] = container.attr("periodreport");
	result["title"] = container.attr("titlereport");
	result["owner"] = userObj[0].iduser;
	result["generated"] = now.format('YYYY-MM-DD HH:mm:ss');
	let gtype = $("#grvReportGraphType").attr("value");
	if($("#grvReportGraphType").length == 0) gtype = "bar";
	result["graphtype"] = gtype;
	result["filter"] = container.attr("filterreport");
	result["note"] = window.btoa($(".cdisReportNotes textarea").val());
	if(type == "graph")result["note"] = window.btoa($(".cdisReportGraphNotes textarea").val());
	
	var subcriterias = [];
	if(type == "graph"){
		$.each($(container).find(".cdisReportCriteriaSummary"),function(index,obj){
			var criteria = {};
			criteria["name"] = $(obj).attr("name");
			criteria["iddata"] = $(obj).attr("iddata");
			criteria["section"] = $(obj).attr("section");
			criteria["value"] = $(obj).attr("value");
			criteria["operator"] = $(obj).attr("operator");
			criteria["display"] = $(obj).attr("display");
			criteria["type"] = $(obj).attr("type");
			subcriterias[subcriterias.length] = criteria;
		});
	}
	result["subcriteria"] = subcriterias;
	
	var criterias = [];
	if(type == "list"){
		$.each($(container).find(".cdisReportCriteriaSummary"),function(index,obj){
			var criteria = {};
			criteria["name"] = $(obj).attr("name");
			criteria["iddata"] = $(obj).attr("iddata");
			criteria["section"] = $(obj).attr("section");
			criteria["value"] = $(obj).attr("value");
			criteria["operator"] = $(obj).attr("operator");
			criteria["display"] = $(obj).attr("display");
			criteria["type"] = $(obj).attr("type");
			criterias[criterias.length] = criteria;
		});
	}else{
		//if graph criterias is either type of diabetes or community 
		//dtype = all values - values are the header of data table
		//community - all cumunities as header of data table OR
		//a community - and show historic data - last 5 years last 2 years last year year to date
		// ex : hba1c > 0.08 and community = chisasibi period last 2 years = number of pattients in chisasibi with hba1c> 0.08 as last collected date
		
		let v = $("#grvReportGraphCriteria").attr("value");
		let c = $("#grvReportGraphCriteriaIdcommunity").attr("value");//can be 0, 1, 2 ...or 0_1 2_3 ....
		let gcObj = getGeneralCriteriaObject(v);
		console.log(gcObj)
		var criteria = {};
		criteria["name"] = v;
		criteria["iddata"] = gcObj.iddata;
		criteria["section"] = gcObj.section;
		if(v == "dtype" || (v=="idcommunity" && c == "0")){
			criteria["value"] = "0";
		}else{
			criteria["value"] = c;
		}
		criteria["operator"] = "equal";
		criteria["display"] = gcObj.label;
		criteria["type"] = gcObj.type;
		criterias[criterias.length] = criteria;
	}
		
	result["criteria"] = criterias;
	return result;
}


function executeCustomReport(event){
	if(isDemo){
		alert("This function si not available in demo mode");
	}else{
		let reportObject;
		let type = event.data.type;
		if(typeof event.data.report == "undefined"){
			reportObject = getReportObjectFromCriterias(type);
			console.log(reportObject);
		}else{
			reportObject = event.data.report;
		}
		executeAsyncReport(reportObject);
	}
	
}



function executeAsyncReport(reportObject){
	buildAsyncReport(reportObject);
	if(typeof reportObject.dataset == "undefined" && typeof reportObject.header == "undefined"){
		$.ajax({
		    url: "/ncdis/service/action/executeReport?language=en",
		    type: 'POST',
		    data:JSON.stringify(reportObject),
		    contentType: 'application/json; charset=utf-8',
		    dataType: 'json',
		    async: true,
		    success: function(msg) {
				console.log(msg)
		    	let report = msg.objs[0];
		    	reportObject["dataset"] = report.dataset;
		    	reportObject["header"] = report.header;
		    	if(reportObject.type == "graph"){
					drawReportGraph(reportObject);
				}
		    	drawReportTable(reportObject);
		    }
		});
	}else{
		//report is already generated
		if(reportObject.type == "graph"){
			drawReportGraph(reportObject);
		}
    	drawReportTable(reportObject);
	}
}

function drawReportTable(report){
	let dataset = report.dataset;
	let header = report.header;
	let containerList = $(".cdisReportListContainer"); 
	let type = report.type;
	//add div for header 
	let divContainer = $("<div>",{class:"cdisReportListTableHeaderContainer"}).appendTo(containerList);
	let table1 = $("<table>").appendTo(divContainer);
	let tableH1 = $("<thead>").appendTo(table1);
	let th1 = $("<tr>").appendTo(tableH1);
	
	let table = $("<table>").appendTo(containerList);
	let tableH = $("<thead>").appendTo(table);
	let tableB = $("<tbody>").appendTo(table);
	let th = $("<tr>").appendTo(tableH);
	
	$.each(header,function(i, value){
		let c = "center";
		if(value=="RAMQ" || value=="Chart")c = "";
		if(type == "graph" && i==0){
			$("<th>",{class:c}).text("").appendTo(th);
		}
		$("<th>",{class:c}).text(value).appendTo(th);
		$("<th>",{class:c}).text(value).appendTo(th1);
	});
	$.each(dataset,function(index, arrLine){
		let rline = $("<tr>").appendTo(tableB);
		let c = "center";
		if(type=="graph"){
			let preLabel = "Number of patients from ";
			if(report.criteria[0].name == "idcommunity"){
				let valueData = report.criteria[0].value;
				if(valueData.indexOf("_") >=0){
					let parts = valueData.split("_");
					preLabel = preLabel+" "+tool_idcommunity[parts[index]];
				}else{
					preLabel = preLabel+" "+tool_idcommunity[valueData];
				}
			}else{
				preLabel = "Number of patients";
			}
			$("<td>",{class:c}).text(preLabel).appendTo(rline);	
		}
		
		$.each(arrLine,function(ii, arrValue){
			
			if(header[ii]=="RAMQ" || header[ii]=="Chart")c = "";
			if(isNaN(arrValue)){
				$("<td>",{class:c}).text(arrValue).appendTo(rline);	
			}else{
				if(type=="list"){
					if(header[ii] != "Chart"){
						arrValue = Number(arrValue).toFixed(3);	
					}	
				}else{
					arrValue = Number(arrValue).toFixed(0);
				}
				$("<td>",{class:c}).text(arrValue).appendTo(rline);
			}
			
		});
	});
	let hc = $(table).find("th");
	$.each($(table1).find("th"),function(i,v){
		 $(v).width($(hc[i]).width());
	});
	containerList.on("scroll",function(e){
		let st = $(this).scrollTop();
		if(st < 30 ) divContainer.css("display","none");
		else divContainer.css("display","block")
	});
}


function drawReportGraph(report){
	const labels = report.header;
	let data = {labels: labels,datasets:[]};
	let colorSet = ["#36A2EB", "#36F2EC"];
	$.each(report.dataset,function(i,v){
		let preLabel = "Number of patients from ";
		if(report.criteria[0].name == "idcommunity"){
			let valueData = report.criteria[0].value;
			if(valueData.indexOf("_") >=0){
				let parts = valueData.split("_");
				preLabel = preLabel+" "+tool_idcommunity[parts[i]];
			}else{
				preLabel = preLabel+" "+tool_idcommunity[valueData];
			}
		}else{
				preLabel = "Number of patients";
		}
		data['datasets'][data.datasets.length] = {label:preLabel,data:v,fill:false,borderColor: colorSet[i],tension: 0.5};
	});
	/*
	const data = {
	  labels: labels,
	  datasets: [{
	    label: 'My First Dataset',
	    data: [65, 59, 80, 81, 56, 55, 40],
	    fill: false,
	    borderColor: 'rgb(75, 192, 192)',
	    tension: 0.5
	  },
	  {
	    label: 'My Second Dataset',
	    data: [35, 29, 10, 41, 56, 75, 90],
	    fill: false,
	    borderColor: 'rgb(192, 75, 192)',
	    tension: 0.1
	  }]
	};
	*/
	const config = {
	  type: report.graphtype,
	  data: data,
	};
	let ctx = document.getElementById("grvReportGraphContainer");
	const mixedChart = new Chart(ctx, config);
	/*
	const mixedChart = new Chart(ctx, {
	    data: {
	        datasets: [{
	            type: 'bar',
	            label: 'Bar Dataset',
	            data: [10, 20, 30, 40]
	        }, {
	            type: 'line',
	            label: 'Line Dataset',
	            data: [50, 50, 50, 50],
	        }],
	        labels: ['January', 'February', 'March', 'April']
	    },
	    options: {
		    responsive: true,
		    maintainAspectRatio: false,
		    scales: {
		        yAxes: [{
		            ticks: {
		                beginAtZero:true
			            }
		        }]
		    }
		}
	});
*/
}



function buildAsyncReport(reportObject){
	var raper = $(".cdisCustomReports");
	var report = $("<div>",{class:"cdisReportContainer"}).appendTo(raper);
	var reportH = $("<div>",{class:"cdisReportContainerHeader umbra"})
					.append($("<div>",{class:"cdisLogo"}))
					.append($("<div>",{class:"cdisTitle"}).text("Custom report"))
					.append($("<div>"))
					.append($("<div>",{class:"cdisReportContainerHeaderClose"}).append($("<i>",{class:"fa fa-times"})).click(function(){closeReportContainer();}))
					.appendTo(report);
	var reportT = $("<div>",{class:"cdisReportContainerToolbar"}).appendTo(report);
	var reportB = $("<div>",{class:"cdisReportContainerBody"}).appendTo(report);
	
	buildReportToolbar(reportObject);
	
	if(reportObject.type == "graph"){
		$("<div>",{class:"cdisReportGraphContainer"})
		.appendTo(reportB)
		.append($("<canvas>",{id:"grvReportGraphContainer"}));
	}
	$("<div>",{class:"cdisReportListContainer"}).appendTo(reportB);
	
}


function getUserReportHistory(iduser,sort){
	//sort can be asc or desc
	$.ajax({
	    url: "/ncdis/service/action/getUserReportHistory?language=en&iduser="+iduser+"&sort="+sort,
	    type: 'GET',
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    async: true,
	    success: function(msg){
	    	console.log(msg["objs"]);
	    	let reports = msg.objs[0];
	    	historyReports = reports;
	    	let container = $(".cdisCustomReportsHistoryBody");
	    	container.empty();
	    	$.each(reports,function(index, report){
	    		let r = $("<div>",{class:"cdisReportsHistoryItem",id:report.id}).appendTo(container);
	    		$("<p>",{class:"title"}).text(report.title).appendTo(r);
	    		$("<p>",{class:"type"}).appendTo(r).append($("<i>").text("Type : ")).append($("<b>").text(report.type));
	    		$("<p>",{class:"date"}).appendTo(r).append($("<i>").text("Generated : ")).append($("<b>").text(report.generated));
	    		let n = report.note;
	    		if(n!="") n = window.atob(n).substr(0,100);
	    		$("<p>",{class:"note"}).appendTo(r).append($("<b>").text(n));
	    		r.on("click",function(){
					loadReportCriteriaFromReport($(this).attr("id"));
				});
				let d = $("<div>",{class:"cdisDeleteHistoryItem"}).append($("<i>",{class:"fa fa-trash"})).appendTo(r);
				d.on("click",{report:report.id},deleteHistoryItem);
	 		});
	    }
	});
	
}

function deleteHistoryItemObject(){
	let id = historyReportToDelete;
	//delete history todo
	$.ajax({
	    url: "/ncdis/service/action/deleteUserReportHistory?language=en&idreport="+id,
	    type: 'GET',
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    async: true,
	    success: function(msg){
	    	console.log(msg);
			if(msg.status == "1"){
				$("#"+id).remove();
			}
	    }
	});
	return true;
}



function deleteHistoryItem(event){
	let id = event.data.report;
	historyReportToDelete = id;
	var bconfig = {"width":"300","height":"150"};
	var bbut = [{"text":"Cancel","action":"closeGRVPopup"},{"text":"Delete Report","action":"deleteHistoryItemObject"}];
	var txt = "Are you sure you want to permanently delete the report from history?";
	showGRVPopup("Delete Report from History",txt,bbut,bconfig);
	
	
	
}

function loadReportCriteriaFromReport(reportId){
	
	 $.ajax({
	    url: "/ncdis/client/reports/history/"+reportId+".json",
	    type: 'GET',
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    async: true,
	    success: function(msg){
	    	console.log(msg);
	    	let report = msg;
	    	let type = report.type;
	    	if(type=="list")rType.setActive(0);
	    	else rType.setActive(1);
	    	let container = $(".cdisReportListToolbarBody");
	    	if(type=="graph") container = $(".cdisReportGraphToolbarBody");
	    	container.empty();
	    	container.attr("idreport",report.id);
	    	container.attr("typereport",report.type);
	    	container.attr("periodreport",report.period);
	    	container.attr("titlereport",report.title);
	    	if(report.filter!="allhcp"){
				if(type=="list"){
					r2.setValue("hcpid");
					$(".cdisReportFilterListSelectContainer select").val(report.filter);	
				}else{
					p3.setValue("hcpid")
					$(".cdisReportFilterGraphSelectContainer select").val(report.filter);
				}
			}else{
				if(type=="list")r2.setValue("allhcp");
				else p3.setValue("allhcp");
			}
			container.attr("filterreport",report.filter);
			if(report.period != "last"){
				if(type=="list"){
					r1.setValue("between");	
					let parts = report.period.split("|");
					let m1 = moment(new Date(Number(parts[0])));
					let m2 = moment(new Date(Number(parts[1])));
					$(".cdisReportPeriodBetweenContainer #grvReportPeriodBetweenValue1").val(m1.format('YYYY-MM-DD'));
					$(".cdisReportPeriodBetweenContainer #grvReportPeriodBetweenValue2").val(m2.format('YYYY-MM-DD'));
				}
				if(type=="graph") {
					$(".cdisReportGraphCriteriaSelectContainer").remove();
					p2.setValue("idcommunity");
					let criteria = report.criteria[0];
					globalGRVMSelect.setValue(criteria.value);
					$(".cdisReportGraphCriteriaPeriod").val(report.period);	
				}
				
			}else{
				if(type=="list") r1.setValue("last");
			}
			
			if(type=="list"){
				$.each(report.criteria,function(index, criteria){
		    		let name = criteria.name;
		    		let cObj = getGeneralCriteriaObject(name);
		    		let filterCriteria = "allvalues";
		    		if((criteria.value != "0" && criteria.operator=="equal") || criteria.operator!="equal"){
						filterCriteria = "filtervalues";
					}
		    		let criteriaObj = {name:name,section:criteria.section, type:cObj.type,filter:filterCriteria,operator:criteria.operator,value:criteria.value,hasdate:"",label:criteria.display,iddata:criteria.iddata};
		    		addToSummaryObject(criteriaObj);
		 		});
		 		$(".cdisReportNotes textarea").text("");
		 		if(report.note != ""){
					$(".cdisReportNotes textarea").text(window.atob(report.note));
				}
				let c = $(".cdisReportListToolbarFooterButtons");
				c.empty();
				$("<div>",{class:"cdisCisButton"}).text("Execute Report").appendTo(c).on("click",{type:report.type},executeCustomReport);
				$("<div>",{class:"cdisCisButton cdisButtonLastExecutionList"}).text("Get Report data from last execution").appendTo(c).on("click",{type:report.type,report:report},executeCustomReport);	
			}else{
				$.each(report.subcriteria,function(index, criteria){
		    		let name = criteria.name;
		    		let cObj = getGeneralCriteriaObject(name);
		    		let filterCriteria = "allvalues";
		    		if((criteria.value != "0" && criteria.operator=="equal") || criteria.operator!="equal"){
						filterCriteria = "filtervalues";
					}
		    		let criteriaObj = {name:name,section:criteria.section, type:cObj.type,filter:filterCriteria,operator:criteria.operator,value:criteria.value,hasdate:"",label:criteria.display,iddata:criteria.iddata};
		    		addToSummaryObject(criteriaObj);
		 		});
		 		$(".cdisReportGraphNotes textarea").text("");
		 		if(report.note != ""){
					$(".cdisReportGraphNotes textarea").text(window.atob(report.note));
				}
				let c = $(".cdisReportGraphToolbarFooterButtons");
				c.empty();
				$("<div>",{class:"cdisCisButton"}).text("Execute Report").appendTo(c).on("click",{type:report.type},executeCustomReport);
				$("<div>",{class:"cdisCisButton cdisButtonLastExecutionGraph"}).text("Get Report data from last execution").appendTo(c).on("click",{type:report.type,report:report},executeCustomReport);
				
			}
			
	    }
	});
}

function buildReportToolbar(reportObject){
	let container = $(".cdisReportContainerToolbar");
	// toolbar for list : export to CSV exit
	// toolbar for graph : print exit
	console.log(reportObject)
	let rtype = reportObject.type;
	let note = reportObject.note;
	if(note!="")note = window.atob(note);
	//show onlycriteria with filter
	//toolbar split : Generated date | note | filters (Either No Filter or Filters) | buttons Export to CSV and Close report 
	
	$("<div>",{class:"gdate"}).text(reportObject.generated).appendTo(container);
	$("<div>",{class:"gnote"}).text(note).appendTo(container);
	$("<div>",{class:"gfilter"}).appendTo(container);
	$("<div>",{class:"gbuttons"}).appendTo(container);
	let criterias = null;
	// build filter text to add to gfilter
	if(rtype == "list"){
		criterias = reportObject.criteria;
	}else{
		criterias = reportObject.subcriteria;
	}
	$.each(criterias,function(i,o){
		if(o.value != "0"){
			$("<span>")
			.append($("<i>").text(o.display))
			.append($("<u>").text(" "+o.operator+" "))
			.append($("<b>").text(renderValue(o)))
			.appendTo($(".gfilter"));
		}
	});
	
	//build buttons to add to gbuttons	
	if(rtype == "list"){
		$("<div>",{class:"cdisCisButton"})
			.text("Export to CSV (table only)")
			.appendTo($(".gbuttons"))
			.click(function(){
				$(".cdisReportListContainer table").tableExport({type:'csv',escape:'false',consoleLog:'true',fileName:"report"});
			});
	}else{
		$("<div>",{class:"cdisCisButton"})
			.text("Print Report")
			.appendTo($(".gbuttons"))
			.click(function(){
				$(".cdisReportContainerBody").printCDISSection();
				return false;
			});	
	}
	
	$("<div>",{class:"cdisCisButton"})
		.text("Close")
		.appendTo($(".gbuttons"))
		.click(function(){
			closeReportContainer();
		});	
	
}

function renderValue(criteria){
	let result = criteria.value;
	if(criteria.type == "select"){
		result = eval("creport_"+criteria.name+"["+criteria.value+"]");
	}else if(criteria.type == "date"){
		if(criteria.operator == "between"){
			let parts = criteria.value.split("|");
			let m1 = moment(parts[0]).format('YYYY-MM-DD');
			let m2 = moment(parts[1]).format('YYYY-MM-DD');
			result = m1 +" and "+m2;
		}else{
			result = moment(criteria.value).format('YYYY-MM-DD');
		}
	}else{
		if(criteria.operator == "between"){
			let parts = criteria.value.split("|");
			result = parts[0] +" and "+parts[1];
		}else{
			result = criteria.value;
		}
	}
	return result;
}


function closeReportContainer(){
	$(".cdisReportContainer").remove();
	//refresh history
	let sens = $(".cdisSortHistory").text().replace("Date","").charCodeAt(0);
	if(sens == 8595)getUserReportHistory(userProfileObj.user.iduser, "asc");
	else getUserReportHistory(userProfileObj.user.iduser, "desc");
}


function sortHistory(event){
	let sens = $(this).text().replace("Date","").charCodeAt(0);
	//8595 is down 8593 is up
	if(sens == 8595){
		$(this).html("Date&uarr;");
		getUserReportHistory(userProfileObj.user.iduser, "desc");
	}else{
		$(this).html("Date&darr;");
		getUserReportHistory(userProfileObj.user.iduser, "asc");
	}
}