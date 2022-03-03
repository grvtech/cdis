function drawABCGraphs(){
		var abcObjArray = null;
		var abc = $.ajax({
			  url: "/ncdis/service/data/getABCData?sid="+sid+"&language=en&idpatient="+patientObjArray[0].idpatient,
			  type: "GET",async : false, cache : false,dataType: "json"
			});
		
			abc.done(function( json ) {
				abcObjArray = json.objs;
				console.log(abcObjArray);
				var abcObject = abcObjArray[0];
				var values = [];
				var sections =[];
				
				//$('#ppp').width('100%');
				//alert($('.page').width());
				
				$.each(abcObject,function(key, value){
					var parts = key.split('.');
					if(parts[1] != null){
						if(key.indexOf("value")>=0){values[parts[1]] = value;}
						if(key.indexOf("section")>=0){sections[parts[1]] = value;}
					}
				});
				
				$.each(values,function(index,valueName){
					if(typeof(valueName) != 'undefined'){
						
						//alert($("#"+valueName).parent().parent().width() +'  aaa '+$("#"+valueName).parent().prop('tagName')+ '  '+$("#"+valueName).parent().attr('class') );
						//$("#"+valueName).width($("#"+valueName).parent().width());
						
						if(valueName.indexOf('_or_') >= 0){
							var condition = $("#"+valueName).attr("condition");
							valueObj = validateCondition(valueName,sections[index],condition);
							buildWidget(valueObj.name,[valueObj.values], $("#"+valueName));
						}else if(valueName.indexOf('_and_') >= 0){
							var parts  = valueName.split('_and_');
							var valueArray1 = getValueSectionArray(sections[index], parts[0], patientObjArray);
							var valueArray2 = getValueSectionArray(sections[index], parts[1], patientObjArray);
							buildWidget(valueName,[valueArray1,valueArray2], $("#"+valueName));
						}else{
							var valueArray = getValueSectionArray(sections[index], valueName, patientObjArray);
							buildWidget(valueName,[valueArray], $("#"+valueName));
						}
					}
				});
				
			});
			abc.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});	
}

function validateCondition(valueName, section, condition){
	var partsName  = valueName.split('_or_');
	var partsSection  = section.split('_or_');
	
	if(condition == 'last'){
		obArray1 = getValueObject(partsSection[0], partsName[0], patientObjArray);
		obArray2 = getValueObject(partsSection[1], partsName[1], patientObjArray);
		var valArray1 = obArray1.values;
		var valArray2 = obArray2.values;
		var objVal1 = {date:'1900-01-01'};
		var objVal2 = {date:'1900-01-01'};
		
		
		
		if(valArray1.length > 0 && valArray2.length > 0){
			objVal1 = valArray1[0];
			objVal2 = valArray2[0];
		}else if(valArray1.length > 0 && valArray2.length < 0){
			objVal1 = valArray1[0];
		}else if(valArray1.length < 0 && valArray2.length > 0){
			objVal2 = valArray2[0];
		}
		if(objVal1.date == null || objVal1.date == 'NULL'){
			if(objVal2.date == null || objVal2.date == 'NULL'){
				return obArray1;
			}else{
				return obArray2;
			}
		}else if(objVal2.date == null || objVal2.date == 'NULL'){
			if(objVal1.date == null || objVal1.date == 'NULL'){
				return obArray1;
			}else{
				return obArray1;
			}
		}else{
			var d1 = moment(objVal1.date);
			var d2 = moment(objVal2.date);
			if(d1.isBefore(d2)){
				return obArray2;
			}else{
				return obArray1;
			}
		}
	}
}

function openABCGraphs(){
	if(!$("#abcgraphs-button").hasClass("cisbutton_selected")){
		toggleRecord("off");
		$("#ub_cdisbody_page").hide();
		$("#printsection").hide();
		$(".cdisbody_abcgraphs").fadeIn(350);
		$("#abcgraphs-button").addClass("cisbutton_selected");
		drawABCGraphs();
	}
}




function closeABCGraphs(){
	if($("#abcgraphs-button").hasClass("cisbutton_selected")){
		$(".cdisbody_abcgraphs").hide();
		
		$("#ub_cdisbody_page").fadeIn(350);
		if(cdisSection != "patient"){
			$("#printsection").fadeIn(350);
		}
		$("#abcgraphs-button").removeClass("cisbutton_selected");
		toggleRecord("on");
	}
}



function printABCGraphs(){
	$("#abcgraphs-container").printJQPlot("Summary Lab Graphs");
}



/*
 * PAGE ACTIONS
 * 
 * */


