function logoutUser(sid){
	var request = $.ajax({
		  url: "/ncdis/service/data/logoutSession?sid="+sid+"&language=en&ts="+moment(),
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			var r = getParameterByName("ramq");
			if ((r != null) && (r != "")){
				$.cookie('ramq',r);
			}
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	//window.location = "index.html";
		gti();
}


function getSession(iduser){
	var sid = "";
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserSession?iduser="+iduser+"&language=en&ts="+moment(),
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			var sObj = json.objs[0];
			
			sid = sObj.idsession;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
		//alert("SID IN GEt SESSION :"+sid);
	return sid;
}

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
			//console.log(pObj);
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return pObj;
}



function getUserProfile(iduser,idsystem){
	var uObj = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserProfile?iduser="+iduser+"&idsystem="+idsystem+"&language=en",
		  type: "GET",
		  async: false,
		  cache: false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObj = json.objs[0];
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return uObj;
}

function getUserBySession(sessionId){
	var uObjArray = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUserBySession?sid="+sessionId+"&language=en",
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObjArray = json.objs;
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed:  error  " + textStatus );
		});
	return uObjArray;
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


function isUserLoged(sessionId){
	var result = false;
	//alert(sessionId);
	var request = $.ajax({
		  url: "/ncdis/service/data/isValidSession?sid="+sessionId+"&language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			var sObj = json.objs[0];
			if(sObj != null){
				if((sObj.idsession != null) && (sObj.idsession != "") ){
					userObj = getUserBySession(sObj.idsession);
					userProfileObj = getUserProfile(sObj.iduser, 1);
					result = true;
				}else{
					result = false;
				}
			}
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	return result;
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
	//console.log("usernotes");
	//console.log(result);
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
				$(".menu .messages").show();
				var cn = null;
				if($(".menu .messages .number").length > 0 ){
					cn = $(".menu .messages .number");
				}else{
					cn = $("<div>",{class:"number"}).appendTo($(".menu .messages"));
				}
				
				cn.text(userNotes.length);
				prepareMessageWidget(userNotes);
			}else{
				$(".menu .messages").hide();
			}
			setTimeout(refreshUserNotes,5000,sessionid);
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
}

function prepareMessageWidget(notes){
	if($(".menu .messages").length > 0 ){
		var mw = $(".menu .messages");
		var meev = getEvents(mw[0]);
		
		if(typeof(meev) == "undefined" || meev.mouseover.length <= 1 ){
			mw.on("mouseenter",function(){
				if($(".messages-details-container").length > 0){
					$(".messages-details-container").remove();
				}
				var mdc = $("<div>",{class:"messages-details-container"}).appendTo($("#wraper"));
				mdc.empty();
				mdc.append($("<div>",{class:"arrow-up"})).append($("<div>",{class:"messages-details"}));
				//console.log(userNotes.length);
				$.each(userNotes,function(i,not){
					var uzer = getUser(not.iduser);
					var patient = getPatientInfo(not.idpatient);
					$("<div>",{class:"message"})
						.append($("<span>").html("New message from <b>"+uzer.firstname+" "+uzer.lastname+ "</b> for the patient <b>"+patient.ramq+"</b>"))
						.append($("<div>",{class:"cisbutton"}).text("View").click(function(){
							gtc(sid,"en",patient.ramq,"notes");
						}))
					.appendTo($(".messages-details"));
				});
				$(".messages-details-container").show("fade",600);
			}).on("mouseleave",function(){
				setTimeout(function(){
					if($(".messages-details-container:hover").length > 0){
						$(".messages-details-container").on("mouseleave",function(){$(".messages-details-container").remove();});
					}else{
						$(".messages-details-container").remove();
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
    //resetForm($form);
	//console.log(data);
	
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
	$(".uoptions").hide();
	if(userProfileObj.role.idrole > 1){
		$(".users").hide();
		$(".audit").hide();
		$(".uoptions").hide();
		$("#frontpage-button").hide();
		$(".frontpage").hide();
		$("#admin-report-list").hide();
		$("#deletepatient-button").hide();
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
	}
	$("#search").focus();
	initNavigation();
	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip(); 
	});

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
	  console.log(this.url);
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
	  console.log(this.url);
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
		//console.log(userProfileObj);
		
		
		if(section != "notes" && section != "patient"){
			//var notesPanelSide = $(".panel-notes");
			$(".panel-notes").empty();
			//console.log(notes);
			$.each(notes,function(index,objNote){
				var iduser = objNote.iduser;
				var user = getUser(iduser);
				var day = moment(objNote.notedate);
				
					if(objNote.viewed == "0"){
						if($(".panel-notes").length == 0){
							$("<div>",{class:"panel-notes uss"}).appendTo($(".pageside"));
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
	  console.log(this.url);
	});	
}



function populateRecord(){
	if($(".panel-record-name").length == 0){
		$("<div>",{class:"panel-record-name"}).appendTo($(".panel-record"));
	}
	$(".panel-record-name").text(patientObj.lname +" "+patientObj.fname);
	if($(".panel-record-ramq").length == 0){
		$("<div>",{class:"panel-record-ramq"}).appendTo($(".panel-record"));
	}
	$(".panel-record-ramq").text(patientObj.ramq);
	if($(".panel-record-chart").length == 0){
		$("<div>",{class:"panel-record-chart"}).appendTo($(".panel-record"));
	}
	$(".panel-record-chart").text(patientObj.chart);
	if($(".panel-record-community").length == 0){
		$("<div>",{class:"panel-record-community"}).appendTo($(".panel-record"));
	}
	$(".panel-record-community").text(patientObj.community);
	
	if($(".panel-record-dtype").length == 0){
		$("<div>",{class:"panel-record-dtype"}).appendTo($(".panel-record"));
	}
	$(".panel-record-dtype").text(dtype[patientObjArray[2].dtype.values[0].value]);
}

function populatePageside(){
	if(typeof(window["recomandation_"+cdisSection]) != "undefined"){
		loadRecomandation(window["recomandation_"+cdisSection]);
	}
	if(cdisSection != "patient" && cdisSection != "schedulevisits" && cdisSection != "editpatient" && cdisSection != "addpatient"){
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
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".pageside"));
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
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".pageside"));
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
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".pageside"));
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
			var rcontainer = $("<div>",{class:"panel-visit uss"}).appendTo($(".pageside"));
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
			var rcontainer = $("<div>",{class:"recomandations"}).appendTo($("#rightPanel"));
		}else{
			var rcontainer = $("<div>",{class:"recomandations uss"}).appendTo($(".pageside"));
		}
		if($(window).height() < h){
			$("<div>",{class:"title"}).text(rObj.title).appendTo(rcontainer);
			var tub = $("<div>",{class:"thumbnail",style:"text-align:right;"}).append($("<img>",{src:"/ncdis/client/libs/images/"+rObj.thumbnail,height:"55px",width:"30px;"})).appendTo(rcontainer);
		}else{
			$("<div>",{class:"title"}).text(rObj.title).appendTo(rcontainer);
			var tub = $("<div>",{class:"thumbnail"}).append($("<img>",{src:"/ncdis/client/libs/images/"+rObj.thumbnail,height:"60px"})).appendTo(rcontainer);
		}
		
		rcontainer.click(function(){
			var modalWidth = 850;
			if(rObj.thumbnail == 'recomandation_ckd_thumbnail.png'){
				modalWidth = 950; 
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
	  console.log(this.url);
	});	
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
			//console.log(obArr);
			if(obArr.length === 0){
				$("<tr>",{class:"notvisits"}).appendTo($(".personal-patients table tbody"))
				.append($("<td>",{colspan:5,align:"center",style:"font-weight:bold;"}).text("No patient linked to this user!"));
				
			}else{
				$.each(obArr,function(index,obj){
					var dd = "";
					var now = moment();
					if(typeof(obj.datevisit)  != "undefined" ){
						dd = moment(obj.datevisit);
						if(moment(obj.datevisit).isSame(now.format('YYYY-MM-DD'), 'month')){
							$("<tr>",{class:"currentvisits"}).appendTo($(".personal-patients table tbody"))
								.append($("<td>").text(obj.fullname))
								.append($("<td>").text(obj.chart))
								.append($("<td>").text(obj.ramq))
								.append($("<td>").text(obj.community))
								.append($("<td>").text(dd.format("MMM YYYY")))
								.click(function(){
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
							$("<tr>",{class:"futurevisits"}).appendTo($(".personal-patients table tbody"))
								.append($("<td>").text(obj.fullname))
								.append($("<td>").text(obj.chart))
								.append($("<td>").text(obj.ramq))
								.append($("<td>").text(obj.community))
								.append($("<td>").text(dd.format("MMM YYYY"))).click(function(){
									gtc(sid,"en", obj.ramq,"patient");
								});

						}
					}
				});
				$.each(obArr,function(index,obj){
					var dd = "";
					var now = moment();
					//console.log(obj);
					if(typeof(obj.datevisit)  == "undefined" ){
							$("<tr>",{class:"notvisits"}).appendTo($(".personal-patients table tbody"))
								.append($("<td>").text(obj.fullname))
								.append($("<td>").text(obj.chart))
								.append($("<td>").text(obj.ramq))
								.append($("<td>").text(obj.community))
								.append($("<td>").text("Not scheduled")).click(function(){
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




