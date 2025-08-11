





function setEvent(eventcode){
	var request = $.ajax({
		  url: "/ncdis/service/action/setEvent?sid="+sid+"&eventcode="+eventcode+"&language=en&ts="+moment(),
		  type: "GET",
		  dataType: "json"
		});
		request.done(function( json ) {
			var sObj = json.objs[0];
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
}

function getUser(iduser){
	var uObj = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUser?iduser="+iduser+"&language=en",
		  type: "GET",
		  async: false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObj = json.objs[0];
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
		//
	return uObj;
}

function getUserFromArray(iduser){
	var uObj = null;
	$.each(usersArray,function(i,obj){
		if(obj.iduser == iduser)uObj = obj;
	});
	return uObj;
}



function getPatientInfo(idpatient){
	var pObj = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getPatientInfo?idpatient="+idpatient+"&language=en",
		  type: "GET",
		  async: false,
		  dataType: "json"
		});
		request.done(function( json ) {
			pObj = json.objs[0];
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return pObj;
}







function getUserMessages(userId){
	var mObjArray = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserMessages?iduser="+userId+"&language=en",
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			mObjArray = json.objs;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed:  error  " + textStatus );
		});
	return mObjArray;
}





function getUsers(){
	var result = [];
	var request = $.ajax({
		  url: "/ncdis/service/data/getUsers?language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			result = json.objs;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}

function getUserActions(){
	var result = [];
	var request = $.ajax({
		  url: "/ncdis/service/action/getUserActions?language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			result = json.objs[0];
						
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}

function getUserNotes(sessionid){
	var result = [];
	var request = $.ajax({
		  url: "/ncdis/service/action/getUserNotes?language=en&sid="+sessionid,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			result = json.objs[0];
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}


function refreshUserNotes(sessionid){
	var request = $.ajax({
		  url: "/ncdis/service/action/getUserNotes?language=en&sid="+sessionid,
		  type: "GET",
		  async : true,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			userNotes = json.objs[0];
			if(userNotes.length > 0 ){
				$(".cdisHeaderMenu .messages").show();
				var cn = null;
				if($(".cdisHeaderMenu .messages .number").length > 0 ){
					cn = $(".cdisHeaderMenu .messages .number");
				}else{
					cn = $("<div>",{class:"number"}).appendTo($(".cdisHeaderMenu .messages"));
				}
				
				cn.text(userNotes.length);
				prepareMessageWidget(userNotes);
			}else{
				$(".cdisHeaderMenu .messages").hide();
			}
			setTimeout(refreshUserNotes,30000,sessionid);
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
}

function prepareMessageWidget(notes){
	if($(".cdisHeaderMenu .messages").length > 0 ){
		var mw = $(".cdisHeaderMenu .messages");
		var meev = getEvents(mw[0]);
		
		if(typeof(meev) == "undefined" || meev.mouseover.length <= 1 ){
			mw.on("mouseenter",function(){
				if($(".cdisMessagesDetailsContainer").length > 0){
					$(".cdisMessagesDetailsContainer").remove();
				}
				var mdc = $("<div>",{class:"cdisMessagesDetailsContainer"}).appendTo($("#grvWraper"));
				mdc.empty();
				mdc.append($("<div>",{class:"arrow-up"})).append($("<div>",{class:"cdisMessagesDetails"}));
				$.each(userNotes,function(i,not){
					var uzer = getUser(not.iduser);
					var patient = getPatientInfo(not.idpatient);
					$("<div>",{class:"cdisMessage"})
						.append($("<span>").html("New message from <b>"+uzer.firstname+" "+uzer.lastname+ "</b> for the patient <b>"+patient.ramq+"</b>"))
						.append($("<div>",{class:"cdisCisButton"}).text("View").click(function(){
							gtc(sid,"en",patient.ramq,"notes");
						}))
					.appendTo($(".cdisMessagesDetails"));
				});
				$(".cdisMessagesDetailsContainer").show("fade",600);
			}).on("mouseleave",function(){
				setTimeout(function(){
					if($(".cdisMessagesDetailsContainer:hover").length > 0){
						$(".cdisMessagesDetailsContainer").on("mouseleave",function(){$(".cdisMessagesDetailsContainer").remove();});
					}else{
						$(".cdisMessagesDetailsContainer").remove();
					}
				},700);
			});
		}
	}
}




function getUserActionsTop5Dataset(){
	var result = [];
	var request = $.ajax({
		  url: "/ncdis/service/action/getUserActionsTop5Dataset?language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			result = json.objs;
						
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}

function getUsersTop5Dataset(){
	var result = [];
	var request = $.ajax({
		  url: "/ncdis/service/action/getUserTop5Dataset?language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			result = json.objs;
						
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
}



function resetForm($form){
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
}

function populateForm($form, data){
    $.each(data, function(key, value) {
    	if(typeof value == "object" && value != null){
    		populateForm($form, value.values[0]);
    	}else{
    		
            var $ctrl = $form.find('[name='+key+']');
            var $ctrlHidden = $form.find('[name='+key+'-hidden]');
            if ($ctrl.is('select')){
                $('option', $ctrl).each(function() {
                    if (this.value == value)
                        this.selected = true;
                });
            } else if ($ctrl.is('textarea')) {
                $ctrl.val(value);
            } else {
                switch($ctrl.attr("type")) {
                    case "text":
                    case "hidden":
                    	//alert(key+"   "+value)
                    	$ctrl.val(value);
                    	$ctrlHidden.val(value);
                        break;
                    case "checkbox":
                        if (value == '1')
                            $ctrl.prop('checked', true);
                        else
                            $ctrl.prop('checked', false);
                        break;
                    case "radio":
                    	//alert($ctrl.filter("[value='"+value+"']").attr('id'));
                    	$ctrl.filter("[value='"+value+"']").prop('checked', true);
                    	$ctrl.filter("[value='"+value+"']").parent().button("toggle");
                    	break;
                } 
            }
    	}
    	
    });
}

function validateRamq(ramqValue){
	//alert("ramq value : "+ramqValue);
	var flagRamq =  Validate.now(Validate.Presence, ramqValue);
	//alert("ramq presence : "+flagRamq);
    var flagRamqDep =  Validate.now(Validate.Custom, ramqValue, { against: function(value , args){
    		var dfr = value.substring(4,10);
    		var year = dfr.substring(0,2);
    		var month = dfr.substring(2,4);
    		var day = dfr.substring(4,6);
    		var dobyear = args.dobValue.substring(2,4);
    		var dobmonth = args.dobValue.substring(5,7);
    		if(args.sexValue == 2){
    			dobmonth = dobmonth*1 + 50;
    		}
    		var dobday = args.dobValue.substring(8,10);
    		/*
    		var validYear = (year == dobyear)?true:false;
    		var validMonth = (month == dobmonth)?true:false;
    		var validDay = (day == dobday)?true:false;
    		if(validYear && validMonth && validDay){
    			return true;
    		}else{
    			return false;
    		}
    		*/
    		return true;
    	}, args: {sexValue: $("input[name='sex']").val(), dobValue: $("#dob-value").val()} });
    //alert("ramq dob : "+flagRamqDep);
    var flagRamqName =  Validate.now(Validate.Custom, ramqValue, { against: function(value , args){
		var nume3L = value.substring(0,3).toLowerCase();
		var prenume1L = value.substring(3,4).toLowerCase();
		var lname3L = args.lnameValue.substring(0,3).toLowerCase();
		var fname1L = args.fnameValue.substring(0,1).toLowerCase();
		var validlname = (nume3L == lname3L)?true:false;
		var validfname = (prenume1L == fname1L)?true:false;
		/*
		if(validlname && validfname){
			return true;
		}else{
			return false;
		}
		*/
		return true;
	}, args: {fnameValue: $("#fname-value").val(), lnameValue: $("#lname-value").val()} });
    //var flagRamqForm = Validate.Format( ramqValue, { pattern: /^([a-z]){4}([0-9]){8}$/i, failureMessage: "Failed!" } );
    var flagRamqForm = Validate.now(Validate.Format, ramqValue,  { pattern: /^([a-z]){4}([0-9]){8}$/i } );
    
    	
    	
    
    if(flagRamq && flagRamqDep && flagRamqName && flagRamqForm){
    	return true;
    }else{
    	if(!flagRamq){
    		var t = $("#errortext-patient").html();
			$("#errortext-patient").html(t+"<p>RAMQ Number cannot be empty!</p>");
    	}
    	if(!flagRamqDep){
    		var t = $("#errortext-patient").html();
			$("#errortext-patient").html(t+"<p>RAMQ Number must contain the corect date of birth and gender information!</p>");
    	}
    	if(!flagRamqName){
    		var t = $("#errortext-patient").html();
			$("#errortext-patient").html(t+"<p>RAMQ Number must contain the corect initials from first name and last name!</p>");
    	}
    	if(!flagRamqForm){
    		var t = $("#errortext-patient").html();
			$("#errortext-patient").html(t+"<p>RAMQ Number must have the correct format XXXX12341234. Four letters and eight numbers.</p>");
    	}
    	return false;
    }
}

function validateChart(chartValue){
	var flagChart =  Validate.now(Validate.Presence, chartValue);
	flagChart =  Validate.now(Validate.Numericality, chartValue);
    if(flagChart){
    	return true;
    }else{
   		var t = $("#errortext-patient").html();
		$("#errortext-patient").html(t+"<p>Chart Number must be a number!</p>");
    	return false;
    }
}


function validateFname(fnameValue){
	var flagFname =  Validate.now(Validate.Presence, fnameValue);
    if(flagFname){
    	return true;
    }else{
   		var t = $("#errortext-patient").html();
		$("#errortext-patient").html(t+"<p>First name cannot be empty!</p>");
    	return false;
    }
}

function validateLname(lnameValue){
	var flagLname =  Validate.now(Validate.Presence, lnameValue);
    if(flagLname){
    	return true;
    }else{
   		var t = $("#errortext-patient").html();
		$("#errortext-patient").html(t+"<p>Last name cannot be empty!</p>");
    	return false;
    }
}

function validateDdate(ddateValue){
	var flagDdate =  Validate.now(Validate.Presence, ddateValue);
    if(flagDdate){
    	return true;
    }else{
   		var t = $("#errortext-patient").html();
		$("#errortext-patient").html(t+"<p>Date of diagnosis cannot be empty!</p>");
    	return false;
    }
}

function validatePhone(phoneValue){
	var flagPhone = true; 
		if (phoneValue != null && phoneValue != ""){
			try{
				flagPhone = Validate.Format( phoneValue, { pattern: /^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/i, failureMessage: "The phone format shoud be xxx xxx xxxx or yyy-yyy-yyyy" } );
			}catch(err){
				var t = $("#errortext-patient").html();
				$("#errortext-patient").html(t+"<p>"+err.message+"</p>");
		    	return false;
			}
		}
		return flagPhone;
}

function validateDtype(dtypeValue){
	var flagDtype =  Validate.now(Validate.Exclusion, dtypeValue, { within: [ '0', 0 ], allowNull: false, partialMatch: false, caseSensitive: false });
    if(flagDtype){
    	return true;
    }else{
   		var t = $("#errortext-patient").html();
		$("#errortext-patient").html(t+"<p>Type of diagnosis cannot be unknown!</p>");
    	return false;
    }
}

function validateCommunity(idcommunityValue){
	var flagCommunity =  Validate.now(Validate.Exclusion, idcommunityValue, { within: [ '0', 0 ], allowNull: false, partialMatch: false, caseSensitive: false });
    if(flagCommunity){
    	return true;
    }else{
   		var t = $("#errortext-patient").html();
		$("#errortext-patient").html(t+"<p>Community cannot be unknown!</p>");
    	return false;
    }
}

function validateDeceased(dodValue,dcauseValue){
	var dValue = $("input[name='deceased']:checked").val();
	//alert("deceased : "+dValue);
	if(dValue == 1){
		var flagDod =  Validate.now(Validate.Presence, dodValue);
		var flagDcause =  Validate.now(Validate.Presence, dcauseValue);
		if(flagDod && flagDcause){
			return true;
		}else{
			if(!flagDod){
				var t = $("#errortext-patient").html();
				$("#errortext-patient").html(t+"<p>If the person is deceased date of death cannot be empty!</p>");
			}
			if(!flagDcause){
				var t = $("#errortext-patient").html();
				$("#errortext-patient").html(t+"<p>If the person is deceased death cause cannot be empty!</p>");
			}
			return false;
		}
	}else{
		return true;
	}
}

function prepareDecesed(data){
	/*deceased tratment*/
	if($.type(data.dod) != "undefined" ){
		var d = {deceased: 0};
		var dodFlag = false;
		var dcauseFlag = false;
		if(data.dod == "" || data.dod == "NULL" || data.dod == null){
			dodFlag = false;
		}else{
			dodFlag = true;
		}
		if(data.dcause == "" || data.dcause == "NULL" || data.dcause == null){
			dcauseFlag = false;
		}else{
			dcauseFlag = true;
		}
		
		if(dodFlag || dcauseFlag){
			d.deceased = 1;
			$.extend(true,data,d);
		}else{
			d.deceased = 0;
			$.extend(true,data,d);
		}

	}
	return data;
}

function prepareDiabet(data){
	
	if($.type(data.dtype) != "undefined" ){
		$.each(data.dtype.values, function(index, obj){
			if(obj.dtype == "10"){
				data.dtype.values[index].dtype = "3";
				data.dtype.values[index].value = "3";
			}
			if(obj.dtype == "11"){
				data.dtype.values[index].value = "4";
				data.dtype.values[index].dtype = "4";
			}
		});
	}
	return data;
}

function prepareData(data){
	data = prepareDecesed(data);
	data = prepareDiabet(data);
	return data;
}

function initPage(){
	/*
	$(".uoptions").hide();
	if(userProfileObj.role.idrole > 1){
		$(".users").hide();
		$(".audit").hide();
		$(".uoptions").hide();
		$("#frontpage-button").hide();
		$(".frontpage").hide();
		$("#admin-report-list").hide();
		$("#deletepatient-button").hide();
		$(".manage-data").hide();
	}
	
	if(userProfileObj.role.idrole > 2){
		$(".personalinfo").hide();
		$("#editpatient-button").hide();
		$("#addpatient-button").hide();
		$(".new-section-button-line").hide();
		$(".fnew").hide();
		$("#custom-reports-button").hide();
		$("#personal-report-list").hide();
		$(".value-graph-button").remove();
		$(".section-button-line").remove();
		$(".manage-data").hide();
	}
	$("#search").focus();
	*/
	initNavigation();
	$(document).ready(function(){$('[data-toggle="tooltip"]').tooltip();});
}



function readNote(noteid){
	var mes = $.ajax({
		  url: "/ncdis/service/action/readPatientNote?sid="+sid+"&language=en&noteid="+noteid,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	mes.done(function( json ) {
			
	});
	mes.fail(function( jqXHR, textStatus ) {
	});	
}

function deleteNote(noteid){
	var mes = $.ajax({
		  url: "/ncdis/service/action/deletePatientNote?sid="+sid+"&language=en&noteid="+noteid,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	mes.done(function( json ) {
			
	});
	mes.fail(function( jqXHR, textStatus ) {
	});	
}


function getPatientNotes(section){
	$(".notesText").empty();
	var rm = getParameterByName("ramq");
	var mes = $.ajax({
	  url: "/ncdis/service/data/getPatientNotes?sid="+sid+"&language=en&ramq="+rm,
	  type: "GET",
	  async : false,
	  cache : false,
	  dataType: "json"
	});
	mes.done(function( json ) {
		notes = json.objs[0];
		var loggedUser = userObj[0];
		
		if(section != "notes" && section != "patient"){
			$(".panel-notes").empty();
			$.each(notes,function(index,objNote){
				var iduser = objNote.iduser;
				var user = getUser(iduser);
				var day = moment(objNote.notedate);
				
					if(objNote.viewed == "0"){
						if($(".panel-notes").length == 0){
							$("<div>",{class:"panel-notes uss"}).appendTo($(".cdisRightPanel"));
						}
						var n = $("<div>",{class:"noteContainer",id:"note-"+index})
							.append("<span class='newNote'>New message</span> <span class='noteTimestamp'>"+day.format('YYYY-MM-DD')+"</span></br><span class='noteAuthor'>from <b> "+user.firstname+" "+user.lastname+" </b></span> ")
							.appendTo($(".panel-notes")	);
						n.click(function(){gtn(sid,"en",rm,objNote.idnote);});
					}
				
			});
		}else if(section == "notes"){
			$(".notesText").empty();
			$.each(notes,function(index,objNote){
				var iduser = objNote.iduser;
				var user = getUser(iduser);
				var userto = getUser(objNote.iduserto);
				var day = moment(objNote.notedate);
				var idn = objNote.idnote;
				var cls = "";
				if(objNote.viewed == "0"){
					cls = "<span class='newNote'>New</span>";
				}
				var n = $("<div>",{class:"noteContainer",id:"note-"+index})
							.append(cls+" <span class='noteTimestamp'>["+day.format('YYYY-MM-DD HH:mm:ss')+"]</span> <b>"+capitalizeFirstLetter(user.firstname)+" "+capitalizeFirstLetter(user.lastname)+"</b> for <b>"+capitalizeFirstLetter(userto.firstname)+" "+capitalizeFirstLetter(userto.lastname)+"</b>")
							.append($("<div>",{class:"note-header note-header-"+index})
									.append($("<div>",{class:"note-header-buttons",id:"toggleNote-"+objNote.idnote}).html("<i class='fa fa-close' aria-hidden='true'></i>"))
									
									)
							.append($("<div>",{class:"message",id:"message-"+objNote.idnote})
												.append($("<div>",{}).html(objNote.note))
												)
							.appendTo($(".notesText"));
				if(objNote.viewed == "0"){
					if(objNote.iduserto ==  userProfileObj.user.iduser){
						$("#message-"+objNote.idnote).append($("<div>",{class:"cisbutton",style:"margin:5px;",id:"note-"+objNote.idnote}).text("Acknowledge message").click(function(){readNote(objNote.idnote);$("#note-"+objNote.idnote).hide();}));
					}
					
				}
				
				if(userProfileObj.role.code == "ROOT" || userProfileObj.user.iduser == iduser){
					$(".note-header-"+index).append($("<div>",{class:"note-header-buttons",id:"delNote-"+objNote.idnote}).html("<i class='fa fa-trash' aria-hidden='true'></i>"));
				}
				
				
				$("#toggleNote-"+objNote.idnote).click(function(){
					$("#message-"+objNote.idnote).toggle();
					$("#toggleNote-"+objNote.idnote).empty();
					if($("#message-"+objNote.idnote).is(":visible")){
						$("#toggleNote-"+objNote.idnote).html("<i class='fa fa-close' aria-hidden='true'></i>");
					}else{
						$("#toggleNote-"+objNote.idnote).html("<i class='fa fa-square-o' aria-hidden='true'></i>");
					}
				});
				
				$("#delNote-"+objNote.idnote).click(function(){
					deleteNote(objNote.idnote);
					getPatientNotes("notes");
				});
				
			});
		}
		
	});
	mes.fail(function( jqXHR, textStatus ) {
	});	
}



function populateRecord(){
	const container = $(".cdisPanelRightRecord");
	if($(".cdisPanelRightRecordName").length == 0){$("<div>",{class:"cdisPanelRightRecordName"}).appendTo(container);}
	$(".cdisPanelRightRecordName").text(patientObj.lname +" "+patientObj.fname);
	
	if($(".cdisPanelRightRecordRamq").length == 0){$("<div>",{class:"cdisPanelRightRecordRamq"}).appendTo(container);}
	$(".cdisPanelRightRecordRamq").text(patientObj.ramq);
	
	if($(".cdisPanelRightRecordChart").length == 0){$("<div>",{class:"cdisPanelRightRecordChart"}).appendTo(container);}
	$(".cdisPanelRightRecordChart").text(patientObj.chart);
	
	if($(".cdisPanelRightRecordCommunity").length == 0){$("<div>",{class:"cdisPanelRightRecordCommunity"}).appendTo(container);}
	$(".cdisPanelRightRecordCommunity").text(patientObj.community);
	
	if($(".cdisPanelRightRecordDtype").length == 0){$("<div>",{class:"cdisPanelRightRecordDtype"}).appendTo(container);}
	$(".cdisPanelRightRecordDtype").text(dtype[patientObjArray[2].dtype.values[0].value]);
	
	if($(".cdisPanelRightRecordDtypedate").length == 0){$("<div>",{class:"cdisPanelRightRecordDtypedate"}).appendTo(container);}
	$(".cdisPanelRightRecordDtypedate").text(patientObjArray[2].dtype.values[0].date);
}



function populatePageside(){
	if(typeof(window["recomandation_"+cdisSection]) != "undefined"){
		loadRecomandation(window["recomandation_"+cdisSection]);
	}
	if(cdisSection != "patient" &&  cdisSection != "editpatient" && cdisSection != "addpatient"){
		getPatientNextVisits(patientObjArray);
	}
	/*BMI out*/
	/*
	if(cdisSection == "mdvisits"){
		loadBMI(getObjectSection(patientObjArray));
	}
	*/
	getPatientNotes(cdisSection);
}

function getPatientNextVisits(poArr){
	
	var iduserchr = (poArr[1].chr!=null && poArr[1].chr!='')?poArr[1].chr.trim():'0';
	var idusermd = (poArr[1].md!=null && poArr[1].md!='')?poArr[1].md.trim():'0';
	var idusernur = (poArr[1].nur!=null && poArr[1].nur!='')?poArr[1].nur.trim():'0';
	var idusernut = (poArr[1].nut!=null && poArr[1].nut!='')?poArr[1].nut.trim():'0';
	var idpatient = poArr[0].idpatient;
	var now = moment();
	var svchr = getScheduleVisit(idpatient, iduserchr);
	if(!$.isEmptyObject(svchr)){
		if(typeof(svchr.datevisit) != "undefined"){
			var dd = moment(svchr.datevisit);
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".cdisRightPanel"));
			$("<div>",{class:"visit-title"}).text("CHR Next Visit").appendTo(rcontainer);
			if(moment(svchr.datevisit).isSame(now.format('YYYY-MM-DD'), 'month')){
				$("<div>",{class:"visit-date currentvisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date futurevisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}
		}
	}
	
	var svmd = getScheduleVisit(idpatient, idusermd);
	if(!$.isEmptyObject(svmd)){
		if(typeof(svmd.datevisit) != "undefined"){
			var dd = moment(svmd.datevisit);
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".cdisRightPanel"));
			$("<div>",{class:"visit-title"}).text("MD Next Visit").appendTo(rcontainer);
			if(moment(svmd.datevisit).isSame(now.format('YYYY-MM-DD'), 'month')){
				$("<div>",{class:"visit-date currentvisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date futurevisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}
		}
	}
	
	var svnur = getScheduleVisit(idpatient, idusernur);
	if(!$.isEmptyObject(svnur)){
		if(typeof(svnur.datevisit) != "undefined"){
			var dd = moment(svnur.datevisit);
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".cdisRightPanel"));
			$("<div>",{class:"visit-title"}).text("Nurse Next Visit").appendTo(rcontainer);
			if(moment(svnur.datevisit).isSame(now.format('YYYY-MM-DD'), 'month')){
				$("<div>",{class:"visit-date currentvisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date futurevisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}
		}
	}
	var svnut = getScheduleVisit(idpatient, idusernut);
	if(!$.isEmptyObject(svnut)){
		if(typeof(svnut.datevisit) != "undefined"){
			var dd = moment(svnut.datevisit);
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".cdisRightPanel"));
			$("<div>",{class:"visit-title"}).text("Nutritionist Next Visit").appendTo(rcontainer);
			if(moment(svnut.datevisit).isSame(now.format('YYYY-MM-DD'), 'month')){
				$("<div>",{class:"visit-date currentvisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}else{
				$("<div>",{class:"visit-date futurevisits"}).text(dd.format('MMMM YYYY')).appendTo(rcontainer);
			}
		}
	}
}

function loadRecomandation(recObj){
	var ww = $(window).width();
	var h = 750;
	var wh = $(window).height();
	$.each(recObj.recomandations,function(index,rObj){
		if(recObj.section == 'patient'){
			var rcontainer = $("<div>",{class:"recomandations"}).appendTo($("#cdisRightPanel"));
		}else{
			var rcontainer = $("<div>",{class:"recomandations uss"}).appendTo($(".cdisRightPanel"));
		}
		if($(window).height() < h){
			$("<div>",{class:"title"}).text(rObj.title).appendTo(rcontainer);
			var tub = $("<div>",{class:"thumbnail",style:"text-align:right;"}).append($("<img>",{src:"/ncdis/client/libs/images/"+rObj.thumbnail+"?_"+moment().format('X'),height:"55px",width:"30px;"})).appendTo(rcontainer);
		}else{
			$("<div>",{class:"title"}).text(rObj.title).appendTo(rcontainer);
			var tub = $("<div>",{class:"thumbnail"}).append($("<img>",{src:"/ncdis/client/libs/images/"+rObj.thumbnail+"?_"+moment().format('X'),height:"60px"})).appendTo(rcontainer);
		}
		
		rcontainer.click(function(){
			var modalWidth = 980;
			if(rObj.source == 'recomandation_ckd.html'){
				modalWidth = 950; 
			}else if(rObj.source == 'recomandation.renalfunction.html'){
				modalWidth = 1000; 
			}
			$("#recomandation-modal").remove();
			$("<div>",{id:"recomandation-modal",title:rObj.title}).appendTo($("body"));
			$("#recomandation-modal").load("/ncdis/client/templates/"+rObj.source);
			
			if($(window).height() < h){
				h = $(window).height() - $(window).height()*0.02;
			}
			$("#recomandation-modal").dialog({
					autoOpen: false,
					height: h,
					width: modalWidth,
					modal: true,
			      show: {
			        effect: "blind",
			        duration: 1000
			      },
			      hide: {
			        effect: "blind",
			        duration: 1000
			      },
			      buttons: {
			    	  Print: function() {
			    		  var win = window.open('/ncdis/client/templates/'+rObj.source, '_blank');
			    		  if (win) {
			    		      //Browser has allowed it to be opened
			    		      win.focus();
			    		  } else {
			    		      //Browser has blocked it
			    		      alert('Please allow popups for CDIS');
			    		  }
				         },
			    	  Close: function() {
			            $( this ).dialog( "destroy" );
			            $("#recomandation-modal").remove();
			         }
			      }
			    });
			$( "#recomandation-modal" ).dialog( "open" );
		});
	});
	
	
}


function getScheduleVisit(idp,idu){
	var result = null;
	
	if(idp !=null &&idp!="" && idu!=null && idu!=""){
		var request = $.ajax({
			  url: "/ncdis/service/action/getScheduleVisit?language=en&sid="+sid+"&idpatient="+idp+"&iduser="+idu,
			  type: "GET",
			  async : false,
			  cache : false,
			  dataType: "json"
			});
			request.done(function( json ) {
				result = json.objs[0];
			});
			request.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
	}
	return result;
}

function setScheduleVisit(scheduleid,iduser,idpatient,scheduledate,idprofesion,frequency,zone){
	var mes = $.ajax({
		  url: "/ncdis/service/action/setScheduleVisit?sid="+sid+"&language=en&idschedule="+scheduleid+"&iduser="+iduser+"&idpatient="+idpatient+"&scheduledate="+scheduledate+"&idprofesion="+idprofesion+"&frequency="+frequency+"&zone="+zone,
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
	mes.done(function( json ) {
			
	});
	mes.fail(function( jqXHR, textStatus ) {
	});	
}


function randomDate(start, end) {
	  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

//const d = randomDate(new Date(2012, 0, 1), new Date());

function demoData(dataObject, context){
	if(context == "search"){
		var obArr = dataObject.objs;
		var term = $("#search").text();
		$.each(obArr, function(i,ob){
			ob.lastname = "Patient "+i;
			ob.firstname = "Full name";
			ob["realramq"] = ob.ramq;
			//ob.ramq = makelid(4)+makenid(8);
			ob.ramq = "XXXX12345678";
			//ob.chart = makenid(4);
			ob.chart = "0000";
			//ob.giu = makenid(5);
			ob.giu = "1111";
		});
		dataObject["objs"] = obArr;
	}else if(context == "userdashboard"){
		$.each(dataObject.history, function(i,ob){
			ob[2] = ob[1];
			ob[1] = "XXXX12345678";
		});
	} else if(context == "userpatients"){
		$.each(dataObject, function(i,ob){
			ob.fullname = "Full name" + " Patient "+i ;
			ob["realramq"] = ob.ramq;
			//ob.ramq = makelid(4)+makenid(8);
			ob.ramq = "XXXX12345678";
			//ob.chart = makenid(4);
			ob.chart = "0000";
		});
	}else if(context == "patient"){
		dataObject[0].fname = "First name";
		dataObject[0].lname = "Last name";
		//dataObject[0].chart = makenid(4);
		dataObject[0].chart = "0000";
		//dataObject[0].ramq = makelid(4)+makenid(8);
		dataObject[0].ramq = "XXXX12345678";
		//dataObject[0].dob = moment(new Date(+(new Date()) - Math.floor(Math.random()*10000000000))).format('MM/DD/YYYY');
		dataObject[0].dob = "01-01-2022";
		//dataObject[0].jbnqa = makenid(5);
		dataObject[0].jbnqa = "99999";
		//dataObject[0].giu = makenid(5);
		dataObject[0].giu = "1111";
	}
	
	return dataObject;
}




function getUserPatients(userId,hcpcat){
	var mObjArray = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserPatients?iduser="+userId+"&language=en&hcpcat="+hcpcat,
		  type: "GET",
		  async : true,
		  dataType: "json"
		});
		request.done(function( json ) {
			var obArr = json.objs;
			if(obArr.length === 0){
				$("<tr>",{class:"notvisits"}).appendTo($(".cdisPersonalPatients table tbody"))
				.append($("<td>",{colspan:5,align:"center",style:"font-weight:bold;"}).text("No patient linked to this user!"));
				
			}else{
				
				if(isDemo)obArr = demoData(obArr,"userpatients");
				
				
				$.each(obArr,function(index,obj){
					var dd = "";
					var now = moment();
					if(typeof(obj.datevisit)  != "undefined" ){
						dd = moment(obj.datevisit);
						if(moment(obj.datevisit).isSame(now.format('YYYY-MM-DD'), 'month')){
							$("<tr>",{class:"currentvisits"}).appendTo($(".cdisPersonalPatients table tbody"))
								.append($("<td>").text(obj.fullname))
								.append($("<td>").text(obj.chart))
								.append($("<td>").text(obj.ramq))
								.append($("<td>").text(obj.community))
								.append($("<td>").text(dd.format("MMM YYYY")))
								.click(function(){
									if(isDemo)obj.ramq = obj.realramq;
									gtc(sid,"en", obj.ramq,"patient");
								});
						}
					}
				});
				$.each(obArr,function(index,obj){
					var dd = "";
					var now = moment();
					if(typeof(obj.datevisit)  != "undefined" ){
						dd = moment(obj.datevisit);
						if(!moment(obj.datevisit).isSame(now.format('YYYY-MM-DD'), 'month')){
							$("<tr>",{class:"futurevisits"}).appendTo($(".cdisPersonalPatients table tbody"))
								.append($("<td>").text(obj.fullname))
								.append($("<td>").text(obj.chart))
								.append($("<td>").text(obj.ramq))
								.append($("<td>").text(obj.community))
								.append($("<td>").text(dd.format("MMM YYYY"))).click(function(){
									if(isDemo)obj.ramq = obj.realramq;
									gtc(sid,"en", obj.ramq,"patient");
								});

						}
					}
				});
				$.each(obArr,function(index,obj){
					var dd = "";
					var now = moment();
					if(typeof(obj.datevisit)  == "undefined" ){
							$("<tr>",{class:"notvisits"}).appendTo($(".cdisPersonalPatients table tbody"))
								.append($("<td>").text(obj.fullname))
								.append($("<td>").text(obj.chart))
								.append($("<td>").text(obj.ramq))
								.append($("<td>").text(obj.community))
								.append($("<td>").text("Not scheduled")).click(function(){
									if(isDemo)obj.ramq = obj.realramq;
									gtc(sid,"en", obj.ramq,"patient");
								});

					}
				});
			}
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed:  error  " + textStatus );
		});
	return mObjArray;
}




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
			if(isDemo){patientObjArray = demoData(patientObjArray,"patient");}
			patientObj = patientObjArray[0];
			console.log(patientObjArray)
		});
		patient.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});	
}

function getValueSectionArray(section, value, arr){
	//cdisSection = section;
	//var objSection = getObjectSection(arr);
	var objSection = getObjectArray(section,arr);
	var objValue = eval("objSection."+value);
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

function getValueLimits(valueName){
	var result = null;
	
	if(typeof(window['limits_'+valueName]) != 'undefined'){
		result = window['limits_'+valueName];
	}else{
		var limits = $.ajax({
			  url: "/ncdis/service/data/getValueLimits?sid="+sid+"&language=en&name="+valueName,
			  type: "GET",
			  async : false,
			  cache : false,
			  dataType: "json"
			});
			limits.done(function( json ) {
				result = json.objs[0];
			});
			limits.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
	} 
	return result;
}




function showProgress(container){
	if(!progressOn){
		$(container).css("position","relative");
		var p = $('<div>',{id:"progress",class:"fullscreen-progress"}).appendTo(container);
		var c = $('<div>',{class:"fullscreen-progress-container"}).appendTo(p);
		var l = $('<div>',{class:"fullscreen-progress-container-logo"}).appendTo(c);
		var t = $('<div>',{class:"fullscreen-progress-container-text"}).appendTo(c);
		progressOn=true;
	}
}

function hideProgress(container){
	$(container).find($("#progress")).fadeOut(500, function(){
		$(container).find($("#progress")).remove();
		progressOn=false;
	}).delay(500, function(){
		$(container).find($("#progress")).remove();
		progressOn=false;
	});
}



function showPopupMessage(title,text){
	var id = moment();
	$("body").css("overflow-y","hidden");
	var modal = $('<div>',{id:"fullscreen_"+id,class:"popupmessage-fullscreen-modal"}).appendTo($("#grvWraper"));
	var sett = $('<div>',{class:"popupmessage-window"}).appendTo(modal);
	var settH = $('<div>',{class:"popupmessage-window-header"}).appendTo(sett);
	var settB = $('<div>',{class:"popupmessage-window-body"}).appendTo(sett);
	var settBB = $('<div>',{class:"popupmessage-window-body-body"}).appendTo(settB);
	var settBF = $('<div>',{class:"popupmessage-window-body-footer"}).appendTo(settB);
	
	$('<div>',{class:"gap"}).appendTo(settBF);
	var cb = $('<button>',{class:"cisbutton"}).text("Close").appendTo(settBF);
	cb.click(function(){
		$(".popupmessage-fullscreen-modal").remove();
		$("body").css("overflow-y","auto");
	});
	settBB.html(text);
	$('<div>',{class:"popupmessage-window-header-title"}).text(title).appendTo(settH);
	var settHC = $('<div>',{class:"popupmessage-window-header-close"}).html("<i class='fa fa-times'></i>").appendTo(settH);
	settHC.click(function(){
		$(".popupmessage-fullscreen-modal").remove();
		$("body").css("overflow-y","auto");
	});
	
}
