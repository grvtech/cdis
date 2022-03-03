var cdisSection = "dashboard";

/*
//Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);

*/

if (!isUserLoged(sid)){
	logoutUser(sid);
}else{
	loadTemplate(page,loadCdisTemplate);
}	
	
function loadCdisTemplate(){
	if(isUserLoged(sid)){
		var pr = getParameterByName("ramq");
		var sec = getParameterByName("section");
		if(sec != ""){
			if(pr != ""){
				loadPatientObject("ramq",pr);
				loadSection(sec);
			}else{
				loadSection(sec);
			}
		}else{
			loadDashboard();
		}
		
	}else{
		logoutUser(sid);
	}
}

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
	}else if(section == "addpatient"){
		cdisSection = section;
		$(".cdismenu").hide();
		$(".side").hide();
		$(".mainpage .main .page").load("/ncdis/client/templates/cdis."+section+".html", function(patientObjArr){
			$(".cdisbody_"+section).fadeIn(350);
			$(".fnew").hide();
			$(".freports").hide();
			initPage();
		});
	}else{
		$(".mainpage .main .page").load("/ncdis/client/templates/cdis."+section+".html", function(patientObjArr){
			$(".cdisbody_"+section).fadeIn(350);
			//drawPatientRecord(patientObjArray);
			drawSectionRecord(patientObjArray);
			populateRecord();
			populatePageside();
			initPage();
		});
		$("#menu li").removeClass("selected");
		$("#menu li").each(function( index ) {
			$(this).children("."+section+"_icon_").parent().addClass("selected");
		});
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
					console.log(sectionObj);
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
		gtc(sid,"en",patientObj.ramq,"editpatient");
		//window.location = "cdis.html?section=editpatient&ramq="+patientObj.ramq+"&sid="+sid+"&language=en";
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

/*
 * patient object = message oject
 * 	status = 1|0
 * 	
 * 
 * */

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
			console.log("object patient");
			console.log(patientObjArray);
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

function saveValue(idvalue, section, valueName, dValue, vValue, patientObjectArray){
	var po = patientObjectArray[0];
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
	  console.log(this.url);
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
			  console.log(this.url);
		});	
	
}


$('input,textarea').focus(function(){
	   $(this).removeAttr('placeholder');
	});

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

