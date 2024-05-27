/*
 * GLOGAL variables
 * */
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var adminSection = "users";
var userActionArray = getUserActions();
var userTop5Array = getUsersTop5Dataset();
var userActionsTop5Array = getUserActionsTop5Dataset();
var frontPageMessage = "";
var pendingUsers = 0;
var hasPending=false;

/*
 * MAIN Section 
 * */
$(".cdisfooter-left").hover(function(){$(".leftfootermenu").toggle("fade");},function(){$(".leftfootermenu").toggle("fade");});
refreshUserNotes(sid);
$(document).ready(function(){$('[data-toggle="tooltip"]').tooltip();});
/*
 * EVENT definitions
 * 
 * */



/*
 * FUNCTIONS
 * */

function hasPendingUsers(ua){
	$.each(ua, function(key, uobj){
		if(uobj.reset == "1" || uobj.confirmmail == "1"){
			hasPending=true;
			$("#filterpending-button").show();
		}
	});
}

function clearSections(){
	$(".mainpage .main .page").empty();
}

function loadAdminSection(section){
	adminSection = section;
	clearSections();
	if(section == "users"){
		$(".mainpage .main .page").load("/ncdis/client/templates/admin."+section+".html", function(){
			/*
			 * MAIN
			 * */
			
			$("#filter-id").empty();
			$("#filter-id").focus();
			$("#clearfilter-button").hide();
			$("#filterpending-button").hide();
			$(report_idcommunity).each(function(index, value) {$("#idcommunity-id").append($("<option />").val(index).text(value));});
			$(role).each(function(index, value) {$("#role-id").append($("<option />").val(index).text(value));});
			$(report_profession).each(function(index, value) {$("#profession-id").append($("<option />").val(index).text(value));});
			drawUsers(usersArray);
			
			/*
			 * EVENTS
			 * */
			$("#filter-id").on("keyup",function(event){if ( event.which == 13 ) {event.preventDefault();}var v = $(this).val();filterUsers(v);});
			$("#clearfilter-button").on("click",function(event){$("#filter-id").val('');drawUsers(usersArray);$(this).hide();});
			$("#filterpending-button").on("click",function(event){$("#filter-id").val('');filterPendingUsers();$(this).hide();});
			$("#deleteuser-button").on("click",deleteUser);
			$("#edituser-button").on("click",showEditUser);
			$("#adduser-button").on("click",showAddUser);
			$("#resetpass-button").on("click",sendResetPassword);
			$("#cancel-edituser-button").on("click",cancelShowEditAddUser);
			$("#pendinguser-button").on("click",function(){sendConfirmEmail()});
			$("#save-edituser-button").on("click",saveEditAddUser);
		});
	}else if(section == "frontpage"){
		$(".mainpage .main .page").load("/ncdis/client/templates/admin."+section+".html", function(){
			/*
			 * MAIN
			 * */
			getFrontPageMessage();
			$(".jqte-test").jqte();
			$(".jqte-test").jqteVal(fronPageMessage);
			
			/*
			 * EVENTS
			 * */
			$("#cancel-frontpage-button").click(function() {gts(sid,"en");});
			$("#save-frontpage-button").on("click",saveFronPageMessage);
			$("#clear-frontpage-button").on("click",clearFrontPageMessage);
		});
	}else if(section == "audit"){
		$(".mainpage .main .page").load("/ncdis/client/templates/admin."+section+".html", function(){
			/*
			 * MAIN
			 * */
			drawUserActions(userActionArray);
			drawTop5Users(userTop5Array);
			drawTop5UserActions(userActionsTop5Array);
		});
	}
	initPage();
}


function drawUserActions(usersArray){
	$("#users-table tbody").empty();
	$.each(userActionArray, function(index, data){
		var tr = $("<tr>",{id:"action-"+index}).appendTo($("#audit-table tbody"));
		$.each(data, function(i, v){
			if(v == null) v = '';
			$("<td>").appendTo(tr).text(v);
		})
	});
}
	
function drawTop5Users(userTop5Array){
	$('#audit-top5users').jqplot(userTop5Array, {
        title:'Top 5 active users last 7 days',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            pointLabels: { show: true }
        },
        axes:{
            xaxis:{
                renderer: $.jqplot.CategoryAxisRenderer
            }
        }
    });
}

function drawTop5UserActions(userActionsTop5Array){
	
	$('#audit-top5actions').jqplot(userActionsTop5Array, {
        title:'Top 5 actions used last 7 days',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                // Set the varyBarColor option to true to use different colors for each bar.
                // The default series colors are used.
                varyBarColor: true
            },
            pointLabels: { show: true }
        },
        
        axes:{
            xaxis:{
                renderer: $.jqplot.CategoryAxisRenderer
            }
        }
    });
}

function getFrontPageMessage(){
	var mes = $.ajax({
		  url: "/ncdis/service/action/getFrontPageMessage?sid="+sid+"&language=en",
		  type: "GET",
		  async : false,
		  cache : false,
		  dataType: "json"
		});
		mes.done(function( json ) {
			fronPageMessage = json.objs[0].message;
		});
		mes.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});	
}

function saveFronPageMessage() {
	var data = $('#frontpage-form').serialize();
	data+="&sid="+sid+"&language=en";
	var reps = $.ajax({
		  url: "/ncdis/service/action/setFrontPageMessage?sid="+sid+"&language=en",
		  method: 'POST',
		  async : false,
		  data: data,
		  cache : false,
		  dataType: "json"
		});
		reps.done(function( json ) {
			gta(sid,"en","frontpage");
					
		});
		reps.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
}

function clearFrontPageMessage() {
	$(".jqte-test").jqteVal("");
	$(".jqte_editor").html("");
	$("#fpmessage").val("");
	$("#save-frontpage-button").click();
}

function deleteUser(){
	var lineid = $("#users-table tbody .selected").attr("id");
	if(lineid != null){
		var userid = lineid.substring(5);
		var request = $.ajax({
			  url: "/ncdis/service/data/deleteUser?iduser="+userid+"&language=en",
			  type: "GET",
			  async : false,
			  cache : false,
			  dataType: "json"
			});
			request.done(function( json ) {
				usersArray = json.objs;
				drawUsers(usersArray);
				$("#filter-id").val("");
				$("#filter-id").focus();
			});
			request.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
	}else{
		var bconfig = {"width":"200","height":"200"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Please select a user first</b></center></p>";
		showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
	}
}

function showEditUser(){
	var lineid = $("#users-table tbody .selected").attr("id");
	if(lineid != null){
		var userid = lineid.substring(5);
		$("#users-container").hide();
		$("#users-toolbar").hide();
		$("#users-form").fadeIn(350);
	}else{
		var bconfig = {"width":"200","height":"200"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Please select a user first</b></center></p>";
		showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
	}
}

function showAddUser(){
	resetForm($("#users-form"));
	$("#iduser-id").val("0");
	$("#users-table tbody tr").removeClass("selected");
	$("#users-container").hide();
	$("#users-toolbar").hide();
	$("#users-form").fadeIn(350);
}

function sendResetPassword(){
	var lineid = $("#users-table tbody .selected").attr("id");
	if(lineid != null){
		var userid = lineid.substring(5);
		var uo = getUserFromArray(userid);
		if(uo != null ){
			var data = "iduser="+userid+"&language=en";
			var request = $.ajax({
			  url: "/ncdis/service/data/sendResetUserPassword",
			  type: "POST",
			  data: data,
			  async : false,
			  dataType: "json"
			});
			request.done(function( json ) {
				var txt = "";
				if(json.status == "1"){
					txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Reset password email was sent to user</b></center></p>";
				}else{
					txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Unable to send reset password email.<br>Contact CDIS Admisitrator or send an email to support@grvtech.ca</b></center></p>";
				}
				var bconfig = {"width":"200","height":"200"};
				var bbut = [{"text":"Close","action":"closeGRVPopup"}];
				showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
				//$(lineid).find(".resetCell").empty();
				//$(lineid).find(".resetCell").append($("<i>",{class:"fa fa-refresh"}));
				usersArray = getUsers();
				drawUsers(usersArray);
			});
			request.fail(function( jqXHR, textStatus ) {
				$("#errortext").text("Wrong Username or Password");
			});
		}else{
			var bconfig = {"width":"200","height":"200"};
			var bbut = [{"text":"Close","action":"closeGRVPopup"}];
			var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>The user did not initiated password reset.</b></center></p>";
			showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
		}
		
	}else{
		var bconfig = {"width":"200","height":"200"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Please select a user first</b></center></p>";
		showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
	}
}

function sendConfirmEmail(){
	var lineid = $("#users-table tbody .selected").attr("id");
	if(lineid != null){
		var userid = lineid.substring(5);
		var uo = getUserFromArray(userid);
		if(uo != null && uo.confirmmail=="1"){
			var data = "iduser="+userid+"&language=en";
			var request = $.ajax({
			  url: "/ncdis/service/action/confirmUserEmail",
			  type: "POST",
			  data: data,
			  async : false,
			  dataType: "json"
			});
			request.done(function( json ) {
				var txt = "";
				if(json.status == "1"){
					txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>User email was confirmed.</b></center></p>";
				}else{
					txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Unable to confirm user email.<br>Contact CDIS Admisitrator or send an email to support@grvtech.ca</b></center></p>";
				}
				var bconfig = {"width":"200","height":"200"};
				var bbut = [{"text":"Close","action":"closeGRVPopup"}];
				showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
				$("#clearfilter-button").hide();
				usersArray = getUsers();
				drawUsers(usersArray);
			});
			request.fail(function( jqXHR, textStatus ) {
				$("#errortext").text("Error sending confirm user email");
			});
		}else{
			var bconfig = {"width":"200","height":"200"};
			var bbut = [{"text":"Close","action":"closeGRVPopup"}];
			var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>The user has the email confirmed.</b></center></p>";
			showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
		}
		
	}else{
		var bconfig = {"width":"200","height":"200"};
		var bbut = [{"text":"Close","action":"closeGRVPopup"}];
		var txt = "<p><center><span style='color:yellow;font-size:35px;'><i class='fa fa-exclamation-triangle'></i></span><br><b>Please select a user first</b></center></p>";
		showGRVPopup("CDIS Admin Users",txt,bbut,bconfig);
	}
}


function cancelShowEditAddUser(){
	$("#users-table tbody tr").removeClass("selected");
	$("#users-form").hide();
	$("#users-container").fadeIn(350);
	$("#users-toolbar").fadeIn(350);
}

function saveEditAddUser(){
	var valid = true;
	valid = valid && checkLength(  $( "#firstname-id" ), "First name" );
    valid = valid && checkLength(  $( "#lastname-id" ), "Last name" );
    valid = valid && checkLength(  $( "#email-id" ), "Email" );
    valid = valid && checkLength(  $( "#idcommunity-id" ), "User Community" );
    valid = valid && checkLength(  $( "#role-id" ), "Role" );
    valid = valid && checkLength(  $( "#profession-id" ), "Profession" );
    valid = valid && checkRegexp(  $( "#email-id" ), emailRegex, "Email format should be : eg. name@domain.com" );
	
	
	if(valid){
		updateTips("All form fields except phone are required.");
		var data = $("#user-form").serialize();
		var request = $.ajax({
			  url: "/ncdis/service/data/saveUser?language=en",
			  type: "POST",
			  async : false,
			  cache : false,
			  data : data,
			  dataType: "json"
			});
			request.done(function( json ) {
				usersArray = json.objs;
				drawUsers(usersArray);
				$("#users-table tbody tr").removeClass("selected");
				$("#users-form").hide();
				$("#users-container").fadeIn(350);
				$("#users-toolbar").fadeIn(350);
			});
			request.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
		});
	}
	
}


function drawUsers(usersArray){
	$("#users-table tbody").empty();
	pendingUsers = 0;
	hasPendingUsers(usersArray);
	$.each(usersArray, function(key, uobj){
		var isPending = false;
		var isReset = false;
		if(uobj.confirmmail == "1"){
				pendingUsers++;
				isPending = true;
		}
		if(uobj.reset == "1"){isReset = true;}
		var tr = $("<tr>",{id:"user-"+uobj.iduser}).appendTo($("#users-table tbody"));
		tr.click(function(){
		    $(this).addClass("selected").siblings().removeClass("selected");
		    var upObj = getUserProfile(uobj.iduser,1);
		    uobj["role"] = upObj.role.idrole;
		    //profesion 1 md 2 nur 3 nut 4 chr  on page chr1 md2 nur3 nut4
		    if(upObj.user.idprofesion == "1"){
		    	uobj["profession"] = "2";	
		    }else if(upObj.user.idprofesion == "2"){
		    	uobj["profession"] = "3";
		    }else if(upObj.user.idprofesion == "3"){
		    	uobj["profession"] = "4";
		    }else if(upObj.user.idprofesion == "4"){
		    	uobj["profession"] = "1";
		    }
		    
		    populateForm($("#user-form"),uobj);
		});
		
		$("<td>").appendTo(tr).text(uobj.firstname);
		$("<td>").appendTo(tr).text(uobj.lastname);
		$("<td>").appendTo(tr).text(uobj.username);
		$("<td>").appendTo(tr).text(uobj.email);
		
		if(isReset){
			var cel = $("<td>",{class:"resetCell","data-toggle":"tooltip","title":"Password Reset Sent",style:"width:60px"}).appendTo(tr);
			$("<i>",{class:"fa fa-refresh"}).appendTo(cel);
		}else{
			$("<td>",{class:"resetCell",style:"width:60px"}).appendTo(tr).text();	
		}
		if(isPending){
			var cel = $("<td>",{class:"confirmCell","data-toggle":"tooltip","title":"Email confirm pending",style:"width:60px"}).appendTo(tr);
			$("<i>",{class:"fa fa-clock-o"}).appendTo(cel);
		}else{
			$("<td>",{class:"confirmCell",style:"width:60px"}).appendTo(tr).text();	
		}
	});
	
		
	if(pendingUsers > 0){
		$(".pending").text(pendingUsers);
		$("#pendinguser-button").show();
	}else{
		$("#pendinguser-button").hide();
	}
}

function filterUsers(criteria){
	var ua = usersArray;
	var uArr = [];
	if (criteria == ""){
		$("#clearfilter-button").hide();
		drawUsers(usersArray);
	}else{
		if(criteria.length >= 1){
			$("#clearfilter-button").show();
			if(criteria == "pending"){
				$.each(ua, function(key, uobj){
					if(uobj.phone && uobj.phone == 'GRV'){
						uArr.push(uobj);
					}
				});
				$("#pendinguser-button").show();				
			}else{
				$.each(ua, function(key, uobj){
					var fn = (uobj.firstname!=null)?uobj.firstname.toLowerCase():"";
					var ln = (uobj.lastname!=null)?uobj.lastname.toLowerCase():"";
					var usr = (uobj.username!=null)?uobj.username.toLowerCase():"";
					var mail = (uobj.email!=null)?uobj.email.toLowerCase():"";
					var ph = (uobj.phone!=null)?uobj.phone.toLowerCase():"";
					if(fn.indexOf(criteria) >= 0 || ln.indexOf(criteria) >= 0 || usr.indexOf(criteria) >= 0 || mail.indexOf(criteria) >= 0 || ph.indexOf(criteria) >= 0){
						uArr.push(uobj);
					}
				});
			}
			drawUsers(uArr);	
		}
			
	}	
}

function filterPendingUsers(){
	var ua = usersArray;
	var uArr = [];
	$("#clearfilter-button").show();
	$.each(ua, function(key, uobj){
			var fn = (uobj.firstname!=null)?uobj.firstname.toLowerCase():"";
			var ln = (uobj.lastname!=null)?uobj.lastname.toLowerCase():"";
			var usr = (uobj.username!=null)?uobj.username.toLowerCase():"";
			var mail = (uobj.email!=null)?uobj.email.toLowerCase():"";
			var ph = (uobj.phone!=null)?uobj.phone.toLowerCase():"";
			if(uobj.reset == "1" || uobj.confirmmail == "1"){
				uArr.push(uobj);
			}
	});
	drawUsers(uArr);	
}


function checkLength( o, n ) {
    if ( o.val().length == 0) {
      o.addClass( "ui-state-error" );
      updateTips( "Field " + n + " cannot be empty." );
      return false;
    } else {
      return true;
    }
}

function checkRegexp( o, regexp, n ) {
    if ( !( regexp.test( o.val() ) ) ) {
      o.addClass( "ui-state-error" );
      updateTips( n );
      return false;
    } else {
      return true;
    }
}

function updateTips( t ) {
    $(".validateTips")
      .text( t )
      .addClass( "ui-state-highlight" );
    setTimeout(function() {
    	$(".validateTips").removeClass( "ui-state-highlight", 1500 );
    }, 500 );
 }
