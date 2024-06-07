/*
 * GLOBAL varaibles
 * 
 * */
var cdisSection = "patient";
var optionSelected = false;
var c = getParameterByName("criteria");
var fll = getParameterByName("fll");
var diabetObj = [];
var fllstr = "";

/*
 * MAIN SECTION
 * */
refreshUserNotes(sid);
$(".cdisfooter-left").hover(function(){$(".leftfootermenu").toggle("fade");},function(){$(".leftfootermenu").toggle("fade");});
if(fll=='1'){
	//show back to local list button
	var fllramq =  getParameterByName("fll_ramq");
	var localramq =  getParameterByName("ramq");
	if(localramq == fllramq){
		$(".cdisfooter-fll").show();
		fllstr = "&fll=1&fll_ramq="+getParameterByName("fll_ramq")+"&fll_age="+getParameterByName("fll_age")+"&fll_dp="+getParameterByName("fll_dp")+"&fll_dtype="+getParameterByName("fll_dtype")+"&fll_hba1c="+getParameterByName("fll_hba1c")+"&fll_idcommunity="+getParameterByName("fll_idcommunity")+"&fll_list="+getParameterByName("fll_list")+"&fll_sex="+getParameterByName("fll_sex")+"&fll_users="+getParameterByName("fll_users");
		console.log(fllstr);
		$(".cdisfooter-fll").click(function(){
			gts(sid,"en",fllstr);
		});
	}
}
if(isDemo){$("#search").attr("type","password");}

if(c != ""){
	$("#"+c).prop("checked", true).button("refresh");
	$("#criteria").text($("#radios  :radio:checked").text());
}
	
$("#menu li").each(function( index ) {
	var sclass = $(this).children("span").attr("class");
	var sec = sclass.substring(0,sclass.indexOf("_icon"));
	$(this).click(function() {
		if(isDemo){
			if(sec == "notes"){
				var bconfig = {"width":"300","height":"250"};
				var bbut = [{"text":"Close","action":"closeGRVPopup"}];
				var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>This function si not available in demo mode.</b></center></p>";
				showGRVPopup("CDIS Demo Mode",txt,bbut,bconfig);
			}else{
				gtc(sid,"en",getParameterByName("ramq"),sec,fllstr);	
			}
		}else{
			gtc(sid,"en",patientObj.ramq,sec,fllstr);	
		}
		
	});
});


$("#search").autocomplete(
		{
			delay: 300,minLength: 2,autoFocus: true,
			source: function( request, response ) {
					$.ajax(
							{
								url: "/ncdis/service/data/searchPatient",dataType: "json",
								data: {criteria: $("#radios :radio:checked").attr('id'),term: request.term,language: "en",sid: sid},
								success: function( data ) {
											if(isDemo){data = demoData(data,"search");}
											response( $.map( data.objs, function( item ) {
												return {
													idpatient : item.idpatient,
													lastname : item.lastname,
													firstname : item.firstname,
													chart : item.chart,
													ramq : item.ramq,
													realramq : (isDemo)?item.realramq:item.ramq,
													community: item.community,
													giu: item.giu,
													criteria : $("#radios :radio:checked").attr('id'),
													term : request.term
												};
											}));
								}
							});
					},
			select: function( event, ui ) {
						optionSelected = true;
						clearSections();
						patientSearchObj = ui.item;
						if(isDemo)patientSearchObj.ramq = patientSearchObj.realramq;
						gtc(sid,"en",patientSearchObj.ramq,"patient");
						return false;
					},
			open: function() {
						optionSelected = false;
			
					},
			close: function() {
						if(!optionSelected){$("#ub_cdisbody").fadeTo( "fast", 1 );}
					}
	}).data("ui-autocomplete")._renderItem = function(ul, item) {
			var $line = $("<a>");
			var $liline = $("<li>");
			var $container = $("<div>",{class:"search-line"}).appendTo($liline);
			if(item.criteria == "fnamelname"){
				var fn = (item.firstname+" "+item.lastname).toString().toLowerCase();
				fn = replaceAll(fn,item.term.toLowerCase(), "<strong>"+item.term.toLowerCase()+"</strong>");
				$("<div>",{class:'searchname criteria'}).appendTo($container).append($("<span>").html(fn.toUpperCase()));
			}else{
				$("<div>",{class:'searchname'}).appendTo($container).append($("<span>").html((item.firstname+" "+item.lastname).toUpperCase()));
			}
			$("<div>",{class:'searchcommunity'}).text(item.community).appendTo($container);
			if(item.criteria == "chart"){
				var cn = item.chart.toString();
				cn = replaceAll(cn,item.term, "<strong>"+item.term+"</strong>");
				$("<div>",{class:'searchchart criteria'}).html("<span> "+cn+" </span>").appendTo($container);
			}else{
				$("<div>",{class:'searchchart'}).html("<span>"+item.chart+"</span>").appendTo($container);
			}
			if(item.criteria == "ramq"){
				var ran = (item.ramq).toString().toLowerCase();
				ran = replaceAll(ran, item.term.toLowerCase(), "<strong>"+item.term.toLowerCase()+"</strong>");
				$("<div>",{class:'searchramq criteria'}).html("<span>"+ran.toUpperCase()+"</span>").appendTo($container);
			}else{
				$("<div>",{class:'searchramq'}).html("<span>"+item.ramq+"</span>").appendTo($container);
			}
			
			if(item.criteria == "ipm"){
				var gan = (item.giu).toString().toLowerCase();
				gan = replaceAll(gan, item.term.toLowerCase(), "<strong>"+item.term.toLowerCase()+"</strong>");
				$("<div>",{class:'searchgiu criteria'}).html("<span>"+gan.toUpperCase()+"</span>").appendTo($container);
			}else{
				$("<div>",{class:'searchgiu'}).html("<span>"+item.giu+"</span>").appendTo($container);
			}
			$liline.appendTo(ul);
			return $liline;
	};


/*
 * EVENT definitions
 * 
 * */
$("#radios .btn").focusin(function() {$("#search").val("");$("#search").focus();$("#criteria").text($("#radios :radio:checked").parent().text());$("#radios").hide();});
$("#criteria").on("click",function(e){if(cdisSection != "dashboard"){$("#radios").show().delay(5000).fadeOut();}});


/*
 * FUNCTIONS
 * */

function clearSections(){
	//$("#ub_cdisbody_page > div").hide();
	$(".page").empty();
}

function selectSection(section){
	$("#menu li").removeClass("selected");
	$("#menu li").each(function( index ) {
		$(this).children("."+section+"_icon_").parent().addClass("selected");
	});
	loadSection(section);
}

function adjustScreen(){
	if($(window).width() <= 1520){
		$("#ub_cdisbody").css("left","260px");
		$("#ub_cdisbody").css("margin-left","0px");
	}
}

function loadPatient(){
	clearSections();
	var dtypevalue = patientObjArray[2].dtype.values[0].value;
	var sec = "patient";
	if(dtypevalue == 5){
		sec = "patientblank";
	}
	$(".mainpage .main .page").load("/ncdis/client/templates/cdis."+sec+".html", function(patientObjArr){
		cdisSection = "patient";
		$(".side").hide();
		$(".cdismenu").hide();
		$("#menu li").removeClass("selected");
		$("#menu li").children(".patient_icon_").parent().addClass("selected");
		
		drawPatientRecord(patientObjArray);
		drawABCGraphs();
		populatePageside();
		
		var hcpObject = patientObjArray[1];
		var cnt = 0;
		
		$.each(hcpObject,function(k,v){
			if(k != 'idpatient'){
				var n = '';
				$(usersArray).each(function(kk,vv){  
					if(vv.iduser == v){
						n = (capitalizeFirstLetter((vv.firstname).toLowerCase())+" "+capitalizeFirstLetter((vv.lastname).toLowerCase()));
					}
				});
				$("<tr>").append($("<td>",{class:"hcp-profession"}).text(profession_object[k])).append($("<td>",{class:"hcp-name"}).text(n)).appendTo($("#hcp"));
			}
		});
		initPage();
	});
}

function loadNotes(){
	clearSections();
	$(".mainpage .main .page").load("/ncdis/client/templates/cdis.notes.html", function(patientObjArr){
		cdisSection = "notes";
		
		$("#ub_cdisbody_page").css("position","absolute");
		$("#ub_cdisbody_page").css("width","590px");
		$("#ub_cdisbody_page").css("right","0px");
		$("#ub_cdisbody_page").css("min-height","800px");
		$(".cdisbody_patient_record").css("position","absolute");
		$(".cdisbody_patient_record").css("width","400px");
		$(".cdisbody_patient_record").addClass("coverband");
		$(".temporar").show();
		drawPatientRecord(patientObjArray);
		$("#temporarDiv").hide();
		$("#patient-record-buttons").hide();
		$(".cdisbody").css("height",$("#ub_cdisbody_page").height());
		$(".cdisbody_patient_record").css("height",$("#ub_cdisbody_page").height());
		$(".cdisbody_patient").fadeIn(350);
		backArray.push("cdis.html?sid="+sid);
		backArrayIndex++;
		$("#menu li").removeClass("selected");
		$("#menu li").each(function( index ) {
			$(this).children(".notes_icon_").parent().addClass("selected");
		});
		var hcpObj = patientObjArray[1];
		$.each(profession_array, function(index,value){
			var n = hcpObj[value[0]];
			if(n == "null" || n == null || n == 'NULL'){
				n = "";
			}
			$("<tr>").append($("<td>",{class:"hcp-profession"}).text(value[1])).append($("<td>",{class:"hcp-name"}).text(n)).appendTo($("#hcp"));
		});	
		getPatientNotes();
		$(".search").fadeIn(350);
		initPage();
	});
}

function drawPatientSection(section, sectionObj, valuesArr){
	
	for(var i=0;i<valuesArr.length;i++){
		var valObj = eval("sectionObj."+valuesArr[i]);
		if(valObj.values[0].idvalue > 0){
			var limitsObj = getValueLimits(valuesArr[i]);
			drawValue(section, valuesArr[i], valObj.values[0], limitsObj);
		}
	}
}

function loadSection(section){
	cdisSection = section;
	if(section == "patient"){
		loadPatient();
	}else{
		$(".mainpage .main .page").load("/ncdis/client/templates/cdis."+section+".html", function(){
			initPage();
			initLocalPage(section);
		});
	}
}



function compare(a,b) {
  if (a.values[0].order < b.values[0].order)
    return -1;
  if (a.values[0].order > b.values[0].order)
    return 1;
  return 0;
}

function getSortedKeys(obj){
	var result = [];
	if(obj != null ){
		var keys = Object.keys(obj);
		//result.push(keys[0]);
		for(var j=0;j<keys.length;j++){
			var kk = eval("obj."+keys[j]);
			if(kk != null){
				var ind = kk.values[0].order;
				var l = result.length;
				var add = true;
				for(var k=0;k<l;k++){
					var vk = eval("obj."+result[k]);
					var v = vk.values[0].order;
					if(ind <= v){
						result.splice(k,0,keys[j]);
						add=false;
						break;
					}
				}
				if(add){
					result.push(keys[j]);
				}
			}
		}
	}
	return result;
}

function drawSectionRecord(arr){
	
	var sectionObj = getObjectSection(arr);
	var keys = getSortedKeys(sectionObj);
	var diab = getObjectArray("diabet", arr);
	var diabObj = diab.dtype.values[0];
	if(cdisSection == "complications"){
		
		$.each(complications_groups, function(index, groupArray){
			$("#group"+index+" .subsection-title").text(complications_groups_names[index]);
			
			$.each(groupArray, function(key,value){
				var valObj = eval("sectionObj."+value);
				//var limitsObj = getValueLimits(value);
				//drawValue(cdisSection, value, valObj.values[0], limitsObj, subsection);
				buildWidget(value,[valObj.values],$("#"+value));
			});
		});
	}else if(cdisSection == 'mdvisits'){
		var f = true;
		for(var i=0;i<keys.length;i++){
			
			if(keys[i] == "sbp" || keys[i] == "dbp"){
				if(f){
					var valO1 = sectionObj.sbp;
					var valO2 = sectionObj.dbp;
					buildWidget('sbp_and_dbp',[valO1.values,valO2.values],$("#sbp_and_dbp"));
					f = false;
				}
			}else{
				var valObj = eval("sectionObj."+keys[i]);
				buildWidget(keys[i],[valObj.values],$("#"+keys[i]));
			}
		}
	}else{
		for(var i=0;i<keys.length;i++){
			var valObj = eval("sectionObj."+keys[i]);
			//var limitsObj = getValueLimits(keys[i]);
			if(keys[i] != "ogtt" && (diabObj.value != "1" || diabObj.value != "2")){
				/*there is no ogtt when diabet type = 1 or 2*/
				//drawValue(cdisSection, keys[i], valObj.values[0], limitsObj);
				buildWidget(keys[i],[valObj.values],$("#"+keys[i]));
			}
		}
	}
}

function drawPatientRecord(pObj){
	var patientObj = pObj[0];
	patientObj = prepareData(patientObj);
	
	if(patientObj.deceased == 1){
		$(".dead").css("display","inline-block");
		$("#name_value").addClass("name-label-deceased");
	}else{
		$("#name_value" ).removeClass("name-label-deceased");
		$(".dead").css("display","none");
	}
	
	$("#patient-record div .record").each(function( index ) {
		if($( this ).attr("id") == "name_value"){
			$(this).text(patientObj.lname +" "+patientObj.fname);
		}else if($( this ).attr("id") == "sex_value"){
			if(patientObj.sex == "1"){
				$("#sex_value").text("Male");
			}else{
				$("#sex_value").text("Female");
			}
		}else if($( this ).attr("id") == "dtype_value"){
			var idtype = pObj[2].dtype.values[0].value;
			if(idtype == "10"){
				idtype= "3";
			}else if(idtype == "11"){
				idtype= "4";
			}
			$(this).text(dtype[idtype]);
		}else if($( this ).attr("id") == "ddate_value"){
				$("#ddate_value").text(pObj[2].dtype.values[0].date);
		}else{
			var att = $( this ).attr("id");
			if(typeof(att) != "undefined"){
				att = att.replace("_value","");
				$(this).text(eval("patientObj."+att));
			}
		}
	});
	
	/* diabet history table*/
	var dobj = pObj[2];
	var vd = dobj.dtype.values;
	
	$.each(vd,function(index,val){
		var linie = $("<tr>",{id:"diabetid-"+val.idvalue});
		var cdate = $("<td>",{class:"diabet-history-value"}).text(val.date);
		var ii = val.value;
		if(val.value == "10"){ii=3;}
		if(val.value == "11"){ii=4;}
		
		var ctype = $("<td>",{class:"diabet-history-value"}).text(dtype[ii]);
		var btype = $("<td>",{class:"diabet-history-value"});
		linie.append(cdate);
		linie.append(ctype);
		linie.append(btype);
		if(vd.length > 1){
			if(userProfileObj.role.idrole == 1){
				var bb = $("<span>",{id:"diabet-"+val.idvalue}).html("<i class=\"fa fa-times-circle\" aria-hidden=\"true\"></i>").appendTo(btype);
				bb.click(function(){
					var $d = $("<div>",{id:"dialog-confirm",title:"Delete diabetes type"}).appendTo($("body"));
					var $p = $("<p>").text("This type of diabetes will be permanently deleted. Are you sure ?").appendTo($d); 
					$d.dialog({
					      resizable: false,
					      height: "auto",
					      width: 400,
					      modal: true,
					      buttons: {
					        "Delete diabates type": function() {
					        	deleteValue(val.idvalue,patientObjArray);
								$("#diabetid-"+val.idvalue).remove();
								if($("#diabet-history tr").length == 3){
									$(".diabet-history-value span").hide();
								}
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
			}
		}		
		$("#diabet-history").append(linie);
		
	});
	$("#editpatient-button, #editpatient-button-second").click(function() {
		if(isDemo){
			var bconfig = {"width":"300","height":"250"};
			var bbut = [{"text":"Close","action":"closeGRVPopup"}];
			var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>This function si not available in demo mode.</b></center></p>";
			showGRVPopup("CDIS Demo Mode",txt,bbut,bconfig);
		}else{
			gtc(sid,"en",patientObj.ramq,"editpatient");
			//window.location = "cdis.html?section=editpatient&ramq="+patientObj.ramq+"&sid="+sid+"&language=en";
		}
	});
}

function drawPatientRecordOptions(pObj){
	$("#abcgraphs-button").click(function() {
		openABCGraphs();
	});
}

function printHistoryGraph(title){
	$("#fullscreen").printJQPlot(title);
}

function printSectionGraphs(title){
		$("section").printJQPlot(title);
}

function animateButton(obj){
	var bname = obj.attr("id"); 
	if(obj.hasClass(bname+"-button")){
		obj.addClass(bname+"-button-select");
		obj.removeClass(bname+"-button");
	}else{
		obj.addClass(bname+"-button");
		obj.removeClass(bname+"-button-select");
	}
}

function saveValue(idvalue, section, valueName, dValue, vValue, patientObjectArray){
	var po = patientObjectArray[0];
	if(valueName == "hba1c"){
		if(vValue >= 1){
			vValue = (vValue / 100).toFixed(3);
		}
	}
	if(vValue.indexOf(",") >= 0 ){
		vValue = vValue.replace(",",".");
	}
	
	var valueResult = $.ajax({
		  url: "/ncdis/service/data/saveValue?sid="+sid+"&language=en&valueName="+valueName+"&value="+vValue+"&date="+dValue+"&idpatient="+po.idpatient+"&idvalue="+idvalue,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	valueResult.done(function( json ) {
			patientObjArray = json.objs;
			patientObj = patientObjArray[0];
		});
	valueResult.fail(function( jqXHR, textStatus ) {
	  alert( "Request failed: " + textStatus );
	});	
}

function deleteValue(idvalue,patientObjectArray){
	var po = patientObjectArray[0];
	var value = $.ajax({
		  url: "/ncdis/service/data/deleteValue?sid="+sid+"&language=en&idvalue="+idvalue+"&idpatient="+po.idpatient,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		value.done(function( json ) {
			patientObjArray = json.objs;
			patientObj = patientObjArray[0];
		});
		value.fail(function( jqXHR, textStatus ) {
			 alert( "Request failed: " + textStatus );
		});	
	
}

function toggleRecord(flag){
	if(cdisSection == "editpatient" || cdisSection == "frontpage" || cdisSection == "addpatient" || cdisSection == "personalinfo" || cdisSection == "users" ||  cdisSection == "audit"){
		$(".cdisbody_patient_record").hide();
	}else{
		$(".cdisbody_patient_record").show();
	}	
	if(flag == null){
		
	}else{
		if(flag == "off"){
			$("#record-button").removeClass("selected").text("+");
			$("#patient-record-data").hide();
			//$("#patient-record-bmi").hide();
			$("#patient-record-buttons").hide();
			$("#patient-record-diabet").hide();
			$("#record-button-label").text("Maximize Record");
		}else if(flag == "on"){
			$("#record-button").addClass("selected").text("-");
			$("#patient-record-data").show();
			$("#patient-record-bmi").show();
			$("#patient-record-buttons").show();
			$("#patient-record-diabet").show();
			$("#record-button-label").text("Minimize Record");
		}
	}
	
}

function initAutocompleteHcp(obj){
	obj.autocomplete({
		delay: 300,
		minLength: 2,
		autoFocus: true,
		source: function( request, response ) {
			$.ajax({
				url: "/ncdis/service/data/getHcps",
				dataType: "json",
				data: {
					criteria:obj.attr('id'),
					term: request.term,
					language: "en",
					sid: sid
				},
				success: function( data ) {
					response($.map( data.objs[0], function( item ) {
						return {
							iduser : item.iduser,
							name : item.name
						};
					}));
				}
			});
		},
		position: {  collision: "flip"  },
		select: function( event, ui ) {
			//optionSelected = true;
			$("#"+obj.attr('id')).val(ui.item.name);
			$("#"+obj.attr('id')+"id").val(ui.item.iduser);
			return false;
		},
		open: function() {
			//optionSelected = false;
		},
		close: function() {
			
		}
	}).data("ui-autocomplete")._renderItem = function(ul, item) {
		var $liline = $("<li>");
		$("<div>",{class:'searchname'}).appendTo($liline).append($("<span>").html(item.name));
		$liline.appendTo(ul);
		$(ul).height(180);
		return $liline;
	};

}


function initLocalPage(section){
	if(section == "addpatient"){
		initAddPatientSection();
	}else if(section == "editpatient"){
		initEditPatientSection();
	}else if(section == "notes"){
		initNotesLocalSection();
	}else if(section == "schedulevisits"){
		initSchedulevisistsLocalSection();
	}else{
		initLocalSection(section);
	}
}


/*
 * FUNCTIONS LOCAL PAGES
 * */
/*
 * ADDPATIENT
 * */
function initAddPatientSection(){
	/*
	 * DEFINE ELEMNTS
	 * */
	
	$("#dob-value").datepicker({changeMonth: true,yearRange: "1900:"+moment().year(),dateFormat: "yy-mm-dd",changeYear: true});
	$("#dod-value").datepicker({changeMonth: true,yearRange: "1900:"+moment().year(),dateFormat: "yy-mm-dd",changeYear: true});
	$("#ddate-value").datepicker({changeMonth: true,yearRange: "1900:"+moment().year(),dateFormat: "yy-mm-dd",changeYear: true});

	$(community).each(function(index, value) {$("#idcommunity-value").append($("<option />").val(index).text(value));});
	$(dtype).each(function(index, value) {$("#dtype-value").append($("<option />").val(index).text(value));});

	$("input[name='iscree']").filter("[value='0']").prop('checked', true);
	$("input[name='iscree']").val(0);
	$("input[name='deceased']").filter("[value='0']").prop('checked', true);
	$("input[name='deceased']").val(0);
	$("#deceased-section").hide();
	$("#dtype-value").val(0);
	$("#idcommunity-value").val(0);

	/*
	 * MAIN
	 * */
	$(".cdismenu").hide();
	$(".side").hide();
	$(".cdisbody_addpatient").fadeIn(350);
	$(".fnew").hide();
	$(".freports").hide();
	resetForm($("#addpatient-form"));
	initAutocompleteHcp($("#chr"));
	initAutocompleteHcp($("#md"));
	initAutocompleteHcp($("#nur"));
	initAutocompleteHcp($("#nut"));
	/*
	 * EVENTS
	 * */
	$("#radio-deceased input[type=radio]").on("change",function() {
		if($("input[name='deceased']:checked").attr("id") == "deceased-yes-value"){
			$("input[name='deceased']:checked").val("1");
			$("#deceased-section").show();
			$("#deceased-yes-value").prop("checked",true);
			$("#deceased-no-value").prop("checked",false);
		}else{
			$("input[name='deceased']:checked").val("0");
			$("#deceased-section").hide();
			$("#deceased-yes-value").prop("checked",false);
			$("#deceased-no-value").prop("checked",true);
		}
	});
	$("#radio-sex label").on("change",function() {$("input[name='sex']").val($(this).find("input[type='radio']").val());});
	$("#radio-iscree label").on("change",function() {$("input[name='iscree']").val($(this).find("input[type='radio']").val());});
	$("#cancel-addpatient").on("click",function() {gts(sid,"en");});
	$("#add-patient").on("click",addPatient);
	$('#myModal').on('show.bs.modal', populateAddPatientConfirm);
	$("#save-addpatient").on("click",showAddPatientConfirm);
}

function addPatient(){
	var data = $('#addpatient-form').serialize();
	data+="&sid="+sid+"&language=en";
	var save = $.ajax({
		  url: "/ncdis/service/data/addPatientRecord?sid="+sid+"&language=en",
		  type: "POST",
		  async : false,
		  data: data,
		  dataType: "json"
		});
		save.done(function( json ) {
			$('#myModal').modal('hide');
			gtc(sid,"en",$("#ramq-value").val(),"patient");
		});
		save.fail(function( jqXHR, textStatus ) {
			var t = $("#errortext-addpatient").html();
			$("#errortext-addpatient").html(t+"<p>Error saving the patient!</p>");
		});
	
}

function populateAddPatientConfirm(event) {
	//var button = $(event.relatedTarget) // Button that triggered the modal
	//var recipient = button.data('whatever') // Extract info from data-* attributes
	// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
	var modal = $(this);
	$.each(modal.find(".mb-value"), function (k,v){
		var classList = $(v).attr('class').split(/\s+/);
		$.each(classList, function(index, item) {
		      if (item.indexOf('mbvalue-') >= 0) {
		          var idv = item.substring('mbvalue-'.length);
		          if($.inArray(idv,profession_code_array) >= 0){
		        	  $(v).text($("#"+idv).val());
		          }else if(idv == 'sex'){
		        	  $(v).text(report_sex[$("input[name='sex']").val()]);
		          }else if(idv == 'dtype'){
		        	  $(v).text(report_dtype[$("#"+idv+"-value").val()]);
		          }else if(idv == 'idcommunity'){
		        	  $(v).text(report_idcommunity[$("#"+idv+"-value").val()]);
		          }else if(idv == 'deceased'){
		        	  if($("input[name='"+idv+"']:checked").val() == 0 ){
		        		  $(v).text("No");
		        		  $("#dod-value").val("");
		        		  $("#dcause-value").val("");
		        	  }else{
		        		  $(v).text("Yes");
		        	  }
		          }else{
		        	  $(v).text($("#"+idv+"-value").val());
		          }
		      }
		  });
	});
}

function showAddPatientConfirm() {
	$("#errortext-patient").html("");
  	if(isDemo){
  		var bconfig = {"width":"300","height":"250"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>This function is not available in DEMO mode!</b></center></p>";
		showGRVPopup("CDIS Demo Mode",txt,bbut,bconfig);
  	}else{
  		var validRamq = validateRamq($("#ramq-value").val());
  	  	var validChart = validateChart($("#chart-value").val());
  	  	//var validFname = validateFname($("#fname-value").val());
  	  	//var validLname = validateLname($("#lname-value").val());
  	  	var validDeceased = validateDeceased($("#dod-value").val(), $("#dcause-value").val());
  	  	var validDtype = validateDtype($("#dtype-value").val());
  	  	var validDdate = validateDdate($("#ddate-value").val());
  	  	var validPhone = validatePhone($("#phone-value").val());
  	  	var validCommunity = validateCommunity($("#idcommunity-value").val());
  		if(validRamq && validChart && validCommunity && validDtype && validDdate && validPhone && validDeceased){
  	  	  	$('#myModal').modal({
  	  		  keyboard: false
  	  		});
  	  	}
  	}	
}

/*
 * EDITPATIENT
 * */

function initEditPatientSection(){
	/*
	 * DEFINE ELEMNTS
	 * */
	
	$("#dob-value").datepicker({changeMonth: true,yearRange: "1900:"+moment().year(),dateFormat: "yy-mm-dd",changeYear: true});
	$("#dod-value").datepicker({changeMonth: true,yearRange: "1900:"+moment().year(),dateFormat: "yy-mm-dd",changeYear: true});
	$("#ddate-value").datepicker({changeMonth: true,yearRange: "1900:"+moment().year(),dateFormat: "yy-mm-dd",changeYear: true});

	$(community).each(function(index, value) {$("#idcommunity-value").append($("<option />").val(index).text(value));});
	$(dtype).each(function(index, value) {$("#dtype-value").append($("<option />").val(index).text(value));});
	
	diabetObj = getObjectArray("diabet",patientObjArray);
	

	/*
	 * MAIN
	 * */
	
	
	$(".cdismenu").hide();
	$(".side").hide();
	$(".cdisbody_editpatient").fadeIn(350);
	$(".fnew").hide();
	$(".freports").hide();
	
	patientObj = prepareData(patientObj);
	if(patientObj.deceased == 1){$("#deceased-section").show();}else{$("#deceased-section").hide();}
	
	initAutocompleteHcp($("#chr"));
	initAutocompleteHcp($("#md"));
	initAutocompleteHcp($("#nur"));
	initAutocompleteHcp($("#nut"));
	
	resetForm($("#editpatient-form"));
	populateForm($("#editpatient-form"), prepareData(patientObj));
	populateForm($("#editpatient-form"), prepareData(diabetObj));
	var hcpObject = getHcpObject();
	populateForm($("#editpatient-form"), hcpObject);
	
	//disable ramq so it cannot be modified
	$("#ramq-value").prop("disabled",true);
	
	/*
	 * EVENTS
	 * */
	$("#radio-deceased input[type=radio]").on("change",function() {
		if($("input[name='deceased']:checked").attr("id") == "deceased-yes-value"){
			$("input[name='deceased']:checked").val("1");
			$("#deceased-section").show();
			$("#deceased-yes-value").prop("checked",true);
			$("#deceased-no-value").prop("checked",false);
		}else{
			$("input[name='deceased']:checked").val("0");
			$("#deceased-section").hide();
			$("#deceased-yes-value").prop("checked",false);
			$("#deceased-no-value").prop("checked",true);
			//make dod null and dcause null ????
			
		}
	});
	$("#radio-sex label").on("change",function() {$("input[name='sex']").val($(this).find("input[type='radio']").val());});
	$("#radio-iscree label").on("change",function() {$("input[name='iscree']").val($(this).find("input[type='radio']").val());});
	$("#chr").on("blur",function(){if($(this).val()== ""){$("#chrid").val("");}});
	$("#md").on("blur",function(){if($(this).val()== ""){$("#mdid").val("");}});
	$("#nur").on("blur",function(){if($(this).val()== ""){$("#nurid").val("");}});
	$("#nut").on("blur",function(){if($(this).val()== ""){$("#nutid").val("");}});
	$("#cancel-editpatient").on("click",function() {gtc(sid,"en",patientObj.ramq,"patient");});
	
	$("#save-editpatient").on("click",showEditPatientConfirm);
	$("#deletepatient-button").on("click",deletePatient);
	
	$("#edit-patient").on("click",editPatient);
	$('#myModalEdit').on('show.bs.modal', populateAddPatientConfirm);

}

function getHcpObject(){
	var hcpObject = getObjectArray("hcp",patientObjArray);
	$(usersArray).each(function(k,v){
		if(hcpObject.chr != null && hcpObject.chr != "" && hcpObject.chr != "0" ){
			if(v.iduser == hcpObject.chr){
				hcpObject["chr"] = (capitalizeFirstLetter((v.firstname).toLowerCase())+" "+capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["chrid"] = v.iduser;
			}
		}else{
			hcpObject["chr"] = "";
			hcpObject["chrid"] = "";
		}
		if(hcpObject.md != null && hcpObject.md != "" &&  hcpObject.md != "0"){
			if(v.iduser == hcpObject.md){
				hcpObject["md"] = (capitalizeFirstLetter((v.firstname).toLowerCase())+" "+capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["mdid"] = v.iduser;
			}
		}else{
			hcpObject["md"] = "";
			hcpObject["mdid"] = "";
		}
		if(hcpObject.nur != null && hcpObject.nur != "" && hcpObject.nur != "0"){
			if(v.iduser == hcpObject.nur){
				hcpObject["nur"] = (capitalizeFirstLetter((v.firstname).toLowerCase())+" "+capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["nurid"] = v.iduser;
			}
		}else{
			hcpObject["nur"] = "";
			hcpObject["nurid"] = "";
		}
		if(hcpObject.nut != null && hcpObject.nut != "" && hcpObject.nut != "0"){
			if(v.iduser == hcpObject.nut){
				hcpObject["nut"] = (capitalizeFirstLetter((v.firstname).toLowerCase())+" "+capitalizeFirstLetter((v.lastname).toLowerCase()));
				hcpObject["nutid"] = v.iduser;
			}
		}else{
			hcpObject["nut"] = "";
			hcpObject["nutid"] = "";
		}
	});
	return hcpObject;
}


function editPatient() {
	$("#errortext-patient").html("");
	//remove disabled ramq so we can sen it
	$("#ramq-value").prop("disabled",false);
	var data = $('#editpatient-form').serialize();
	data+="&sid="+sid+"&language=en&casem=&idpatient="+patientObjArray[0].idpatient;
	var save = $.ajax({
		  url: "/ncdis/service/data/savePatientRecord",
		  type: "POST",
		  async : false,
		  data: data,
		  dataType: "json",
		  beforeSend: function(xhr, opts){
		  	var validRamq = validateRamq($("#ramq-value").val());
		  	var validChart = validateChart($("#chart-value").val());
		  	//var validFname = validateFname($("#fname-value").val());
		  	//var validLname = validateLname($("#lname-value").val());
		  	var validDeceased = validateDeceased($("#dod-value").val(), $("#dcause-value").val());
		  	var validDtype = validateDtype($("#dtype-value").val());
		  	var validDdate = validateDdate($("#ddate-value").val());
		  	var validPhone = validatePhone($("#phone-value").val());
		  	var validCommunity = validateCommunity($("#idcommunity-value").val());
		  	if(validRamq && validChart && validCommunity && validDeceased && validDtype && validDdate && validPhone){
		  		return true;
		  		//return false;
		  	}else{
		  		return false;
		  	}
		  }
		});
		save.done(function( json ) {
			gtc(sid,"en",patientObj.ramq,"patient");
		});
		save.fail(function( jqXHR, textStatus ) {
			var t = $("#errortext-editpatient").html();
			$("#errortext-editpatient").html(t+"<p>Error saving the patient!</p>");
		});	
}

function deletePatient() {
	var $d = $("<div>",{id:"dialog-confirm",title:"Delete CDIS patient"}).appendTo($("body"));
	var $p = $("<p>").text("This patient will be permanently deleted. Are you sure ?").appendTo($d); 
	$d.dialog({
	      resizable: false,
	      height: "auto",
	      width: 400,
	      modal: true,
	      buttons: {
	        "Delete patient": function() {
	        	var del = $.ajax({
	  			  url: "/ncdis/service/data/deletePatientRecord?sid="+sid+"&language=en&idpatient="+patientObj.idpatient,
	  			  type: "GET",
	  			  async : false,
	  			  cache : false,
	  			  dataType: "json"
	  			});
	  		del.done(function( json ) {
	  				msg = json.message;
	  				if(msg == "error"){
	  					alert("Error deleteing the patient.");
	  				}else{
	  					gts(sid,"en");
	  					//window.location = "cdis.html?sid="+sid+"&language=en";
	  				}
	  			});
	  		del.fail(function( jqXHR, textStatus ) {
	  			  alert( "Request failed: " + textStatus );
	  			});	
	        },
	        Cancel: function() {
	          $( this ).dialog( "close" );
	          $(this.remove());
	        }
	      }
	    });
}

function showEditPatientConfirm() {
	$("#errortext-patient").html("");
	//var data = $('#addpatient-form').serialize();
	//data+="&sid="+sid+"&language=en";
	
	var validRamq = validateRamq($("#ramq-value").val());
  	var validChart = validateChart($("#chart-value").val());
  	//var validFname = validateFname($("#fname-value").val());
  	//var validLname = validateLname($("#lname-value").val());
  	var validDeceased = validateDeceased($("#dod-value").val(), $("#dcause-value").val());
  	var validDtype = validateDtype($("#dtype-value").val());
  	var validDdate = validateDdate($("#ddate-value").val());
  	var validPhone = validatePhone($("#phone-value").val());
  	var validCommunity = validateCommunity($("#idcommunity-value").val());

  		
  	if(validRamq && validChart && validCommunity && validDtype && validDdate && validPhone && validDeceased){
  	  	$('#myModalEdit').modal({
  		  keyboard: false
  		});
  	}
}


/*
 * NOTES
 * */

function initNotesLocalSection(){
	/*
	 * MAIN
	 * */
	
	$("#menu li").removeClass("selected");
	$("#menu li").each(function( index ) {
		$(this).children(".notes_icon_").parent().addClass("selected");
	});
	
	$(".jqte-test").jqte({fsizes: ["10", "15", "20"],funit: "px",format: false,i: false,link: false,ol: false,outdent: false,right: false,rule: false,source: false,sub: false,strike: false,sup: false,u: false,ul: false,unlink: false});
	
	$.each(usersArray,function(index,obj){
		if(obj.active == 1){
			$('#note-user').append($('<option>', {
			    value: obj.iduser,
			    text: obj.firstname+' '+obj.lastname
			}));	
		}
	});
	getPatientNotes("notes");
	populateRecord();
	
	/*
	 * EVENTS
	 * */
	$('#note-user').on("change",function(){if($(this).val() >= 0){$("#save-notes-button").removeClass("disabled");}else{$("#save-notes-button").addClass("disabled");}});
	$("#save-notes-button").on("click",saveNote);
}

function saveNote() {
	var n = $("textarea[name='note']").val();
	var u = $("#note-user").val();
	if( n != ""){
		if(u >= 0){
			var data = $('#notes-form').serialize();
			data+="&sid="+sid+"&language=en&ramq="+getParameterByName("ramq")+"&iduserto="+u;
			var reps = $.ajax({
				  url: "/ncdis/service/data/setPatientNotes?sid="+sid+"&language=en&iduserto="+u,
				  method: 'POST',
				  async : false,
				  data: data,
				  cache : false,
				  dataType: "json"
				});
				reps.done(function( json ) {
					getPatientNotes("notes");
				});
				reps.fail(function( jqXHR, textStatus ) {

				});
		}
	}
	$(".jqte-test").jqteVal("");
}

/*
 * SCHEDULEVISISTS
 * */

function initSchedulevisistsLocalSection(){
	/*
	 * MAIN
	 * */
	hcpObjArr = getObjectArray("hcp", patientObjArray);
	$(profession_array).each(function(ind,vArr){
		drawPatientSchedule(patientObjArray[0].idpatient,vArr[0]);
	});
	$("#menu li").removeClass("selected");
	$("#menu li").each(function( index ) {
		$(this).children(".schedulevisits_icon_").parent().addClass("selected");
	});
	populateRecord();
	populatePageside();
	/*
	 * EVENTS
	 * */
	$(".associate").on("click",associatePatientSchedule);
}

function associatePatientSchedule(){
	if(isDemo){
		var bconfig = {"width":"300","height":"250"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>This function si not available in demo mode.</b></center></p>";
		showGRVPopup("CDIS Demo Mode",txt,bbut,bconfig);			
	}else{
		var parts = $(this).attr("id").split("-");
		var zone = parts[0];
		var action = parts[1];
		if(action == "associate"){
			$("#visits-"+zone+" .visit-body").empty();
			$("<select>",{id:"select-"+zone,class:"schedule-select"}).append($("<option>",{value:"0"}).text("Select "+eval("profession_object."+zone))).appendTo($("#visits-"+zone+" .visit-body")).selectmenu();
			var hcpid = 0;
			if(zone == "chr"){hcpid = 4;}
			if(zone == "md"){hcpid = 1;}
			if(zone == "nur"){hcpid = 2;}
			if(zone == "nut"){hcpid = 3;}
			$(usersArray).each(function(index,Object){
				if(Object.idprofesion == hcpid){
					$("#select-"+zone).append($("<option>",{value:Object.iduser}).text(capitalizeFirstLetter(Object.firstname)+" "+capitalizeFirstLetter(Object.lastname)));
				}
			});
			$("<input>",{id:"schedule-select-date-"+zone,type:"text",placeholder:"Schedule date",class:"ui-button ui-widget ui-state-default ui-corner-all ui-state-hover schedule-input"}).appendTo($("#visits-"+zone+" .visit-body")).MonthPicker(
					{
						MonthFormat: 'M, yy', 
						Button: false, 
						AltFormat: "yy-mm-dd",
						AltField:"#schedule-date-"+zone
					});
			
			$("<input>",{id:"schedule-frequency-"+zone,type:"text",placeholder:"Frequency",class:"ui-button ui-widget ui-state-default ui-corner-all ui-state-hover schedule-input"}).width(100).appendTo($("#visits-"+zone+" .visit-body"));
			$("<span>",{style:"vertical-align:top;line-height:35px;font-size:110%;font-weight:bold;padding:7px;margin-top:3px;"}).text("(months)").appendTo($("#visits-"+zone+" .visit-body"));
			$("<div>",{id:"save-schedule-"+zone,class:"cisbutton save-"+zone+"",style:"vertical-align:top;margin-top:10px;"}).text("Save").appendTo($("#visits-"+zone+" .visit-body"));
			$("<input>",{id:"schedule-idprofesion-"+zone,type:"hidden",value:hcpid}).appendTo($("#visits-"+zone+" .visit-body"));
			$("<input>",{id:"schedule-date-"+zone,type:"hidden"}).appendTo($("#visits-"+zone+" .visit-body"));
			$("<input>",{id:"schedule-idpatient-"+zone,type:"hidden",value:patientObjArray[0].idpatient}).appendTo($("#visits-"+zone+" .visit-body"));
			$(".save-"+zone).click(function(){
				//var flagHcp =  Validate.now(Validate.Presence, $("#select-"+zone).val());
				var flagHcp =  Validate.now(Validate.Exclusion, $("#select-"+zone).val(), { within: [ '0', 0 ], allowNull: false, partialMatch: false, caseSensitive: false });
				var flagDate = Validate.now(Validate.Presence, $("#schedule-date-"+zone).val());
				var flagFreq = Validate.now(Validate.Presence, $("#schedule-frequency-"+zone).val());
				$("#select-"+zone+"-button").css("border","none");
				$("#schedule-select-date-"+zone).css("border","none");
				$("#schedule-frequency-"+zone).css("border","none");
				if(flagHcp && flagDate && flagFreq){
					setScheduleVisit("0", $("#select-"+zone).val(), $("#schedule-idpatient-"+zone).val(), $("#schedule-date-"+zone).val(), $("#schedule-idprofesion-"+zone).val(), $("#schedule-frequency-"+zone).val(),zone);
					eval("patientObjArray[1]."+zone+"='"+$("#select-"+zone).val()+"'");
					drawPatientSchedule(patientObjArray[0].idpatient,zone);
				}else{
					if(!flagHcp){$("#select-"+zone+"-button").css("border","2px solid red");}
					if(!flagDate){$("#schedule-select-date-"+zone).css("border","2px solid red");}
					if(!flagFreq){$("#schedule-frequency-"+zone).css("border","2px solid red");}
				}
			});	
		
		}
	}
}

function editPatientSchedule(){
	if(isDemo){
		var bconfig = {"width":"300","height":"250"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>This function si not available in demo mode.</b></center></p>";
		showGRVPopup("CDIS Demo Mode",txt,bbut,bconfig);
	}else{
		var hcpObjArr = getObjectArray("hcp", patientObjArray);
		var parts = $(this).attr("id").split("-");
		var zone = parts[0];
		var action = parts[1];
		var hcpVal = eval("hcpObjArr."+zone);
		if(action == "edit"){
			var scheduleVisit = getScheduleVisit(patientObjArray[0].idpatient, hcpVal);
			var sdate = moment(scheduleVisit.datevisit);
			$("#visits-"+zone+" .visit-body").empty();
			$("<select>",{id:"select-"+zone,class:"schedule-select"}).append($("<option>",{value:"0"}).text("Select "+eval("profession_object."+zone))).appendTo($("#visits-"+zone+" .visit-body")).selectmenu();
			var hcpid = 0;
			if(zone == "chr"){hcpid = 4;}
			if(zone == "md"){hcpid = 1;}
			if(zone == "nur"){hcpid = 2;}
			if(zone == "nut"){hcpid = 3;}
			scheduleVisit.idprofesion = hcpid;
			$(usersArray).each(function(index,Object){
				if(Object.idprofesion == hcpid){
					if(Object.iduser == hcpVal){
						$("#select-"+zone).append($("<option>",{value:Object.iduser,selected:true}).text(capitalizeFirstLetter(Object.firstname)+" "+capitalizeFirstLetter(Object.lastname)));
					}else{
						$("#select-"+zone).append($("<option>",{value:Object.iduser}).text(capitalizeFirstLetter(Object.firstname)+" "+capitalizeFirstLetter(Object.lastname)));
					}
				}
			});
			$("#select-"+zone).selectmenu( "refresh" );
			$("<input>",{id:"schedule-select-date-"+zone,type:"text",placeholder:"Schedule date",class:"ui-button ui-widget ui-state-default ui-corner-all ui-state-hover schedule-input"}).appendTo($("#visits-"+zone+" .visit-body")).MonthPicker(
					{
						SelectedMonth: sdate.format("MMM, YYYY"),
						MonthFormat: 'M, yy', 
						Button: false, 
						AltFormat: "yy-mm-dd",
						AltField:"#schedule-date-"+zone
					});
			
			$("<input>",{id:"schedule-frequency-"+zone,type:"text",placeholder:"Frequency",class:"ui-button ui-widget ui-state-default ui-corner-all ui-state-hover schedule-input"}).val(scheduleVisit.frequency).width(100).appendTo($("#visits-"+zone+" .visit-body"));
			//$("<span>",{style:"vertical-align:top;line-height:35px;font-size:110%;font-weight:bold;padding:7px;margin-top:3px;"}).text("(months)").appendTo($("#visits-"+zone+" .visit-body"));
			$("<div>",{id:"save-schedule-"+zone,class:"cisbutton save-"+zone+"",style:"vertical-align:top;margin-top:10px;"}).text("Save").appendTo($("#visits-"+zone+" .visit-body"));
			$("<input>",{id:"schedule-idprofesion-"+zone,type:"hidden",value:scheduleVisit.idprofesion}).appendTo($("#visits-"+zone+" .visit-body"));
			$("<input>",{id:"schedule-date-"+zone,type:"hidden",value:sdate.format('YYYY-MM-DD')}).appendTo($("#visits-"+zone+" .visit-body"));
			$("<input>",{id:"schedule-idpatient-"+zone,type:"hidden",value:patientObjArray[0].idpatient}).appendTo($("#visits-"+zone+" .visit-body"));
			$(".save-"+zone).click(function(){
				var flagHcp =  Validate.now(Validate.Exclusion, $("#select-"+zone).val(), { within: [ '0', 0 ], allowNull: false, partialMatch: false, caseSensitive: false });
				var flagDate = Validate.now(Validate.Presence, $("#schedule-date-"+zone).val());
				var flagFreq = Validate.now(Validate.Presence, $("#schedule-frequency-"+zone).val());
				$("#select-"+zone+"-button").css("border","none");
				$("#schedule-select-date-"+zone).css("border","none");
				$("#schedule-frequency-"+zone).css("border","none");
				if(flagHcp && flagDate && flagFreq){
					setScheduleVisit("0", $("#select-"+zone).val(), $("#schedule-idpatient-"+zone).val(), $("#schedule-date-"+zone).val(), $("#schedule-idprofesion-"+zone).val(), $("#schedule-frequency-"+zone).val(),zone);
					eval("patientObjArray[1]."+zone+"='"+$("#select-"+zone).val()+"'");
					drawPatientSchedule(patientObjArray[0].idpatient,zone);
				}else{
					if(!flagHcp){$("#select-"+zone+"-button").css("border","2px solid red");}
					if(!flagDate){$("#schedule-select-date-"+zone).css("border","2px solid red");}
					if(!flagFreq){$("#schedule-frequency-"+zone).css("border","2px solid red");}
				}
			});	
		}
	}
}	

function drawPatientSchedule(idpatient, hcpcode){
	var professionIndex = eval("profession_dbindex."+hcpcode);
	var hcpObjArr = getObjectArray("hcp", patientObjArray);
	var hcpVal = eval("hcpObjArr."+hcpcode);
	if(hcpVal != "" && hcpVal != " " && hcpVal != null && hcpVal!="NULL"){
		if($.isNumeric(hcpVal)){
			$("#visits-"+hcpcode+" .visit-body").empty();
			var scheduleVisit = getScheduleVisit(idpatient, hcpVal);
			$("<table>",{id:"table-"+hcpcode,class:"schedule-table"}).appendTo($("#visits-"+hcpcode+" .visit-body"));
			$("<tr>").appendTo($("#table-"+hcpcode))
				.append($("<td>",{class:"schedule-table-header"}).text(eval("profession_object."+hcpcode)))
				.append($("<td>",{class:"schedule-table-header"}).text("Next visit date"))
				.append($("<td>",{class:"schedule-table-header"}).text("Frequency"))
				.append($("<td>",{class:"schedule-table-header",style:"width:50px;"}));
			var hcpName = "";
			$(usersArray).each(function(index,Object){
				if(Object.idprofesion == professionIndex){
					if(Object.iduser == hcpVal){
						hcpName = capitalizeFirstLetter(Object.firstname)+" "+capitalizeFirstLetter(Object.lastname);
					}	
				}
			});
			var dv = "";
			var df = "";
			if(typeof(scheduleVisit.datevisit) != "undefined" ){
				dv = moment(scheduleVisit.datevisit).format("YYYY MMMM");
			}
			if(typeof(scheduleVisit.frequency) != "undefined" ){
				df = scheduleVisit.frequency;
			}
			$("<tr>").appendTo($("#table-"+hcpcode))
				.append($("<td>",{class:"schedule-table-value"}).text(hcpName))
				.append($("<td>",{class:"schedule-table-value"}).text(dv))
				.append($("<td>",{class:"schedule-table-value"}).text(scheduleVisit.frequency))
				.append($("<td>",{class:"schedule-table-value"}).html("<i class=\"fa fa-pencil\" id=\""+hcpcode+"-edit\" style=\"display:none;\" aria-hidden=\"true\"></i>"))
				.hover(function(){
							$("#"+hcpcode+"-edit").show();
							$("#"+hcpcode+"-edit").bind("click",editPatientSchedule);
							$(this).css("background","#efefef");
						},
					function(){
							$("#"+hcpcode+"-edit").hide();
							$("#"+hcpcode+"-edit").unbind("click",editPatientSchedule);
							$(this).css("background","#ffffff");
						});

		}else{
			
		}
	}	
}


/*
 * OTHER
 * */

function initLocalSection(section){
	/*
	 * MAIN
	 * */
	$(".cdisbody_"+section).fadeIn(350);
	drawSectionRecord(patientObjArray);
	populateRecord();
	populatePageside();
	
	$("#menu li").removeClass("selected");
	$("#menu li").each(function( index ) {
		$(this).children("."+section+"_icon_").parent().addClass("selected");
	});
}