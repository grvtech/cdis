// verify session and load user info 
//alert("SID IS : "+sid);

/*default user template*/
var userTemplate = "dashboard";
var default_color = "#4d90fe";
var dashboard_color = "#cdcdcd";
var personalinfo_color = "#1d1d1d";
var messages_color = "#cecece";
var users_color = "#fdfdfd";
var frontpage_color = "#cdaacd";
var uoptions_color = "#cdcd33";
var userObjArray = null;

if (!isUserLoged(sid)){
	logoutUser(sid);
}else{
	tpl = getParameterByName("template");
	if(tpl != ""){userTemplate = tpl;}
	loadTemplate(page,loadUserTemplate);
}	
	
function loadUserTemplate(){
	var tpl = "/ncdis/client/templates/user."+userTemplate+".html";
	//var tpl = "/client/templates/user."+userTemplate+".html";
	if(isUserLoged(sid)){
		userObjArray = getUserBySession(sid);
		messagesArray = getUserMessages(userObjArray[0].iduser);
		closeAllTemplates();
		$("#ub_ubody").load(tpl, function(){
			$("#ub_"+userTemplate).show();
			populateTemplate(userTemplate);
		});
		//console.log("2 "+userTemplate);
	}else{
		logoutUser(sid);
	}
	
}


function closeAllTemplates(){
	$("#ub_dashboard").hide();
	$("#ub_personalinfo").hide();
	$("#ub_messages").hide();
	$("#ub_frontpage").hide();
	$("#ub_users").hide();
	$("#ub_uoptions").hide();
}


function clearAllActive(){
	$(".menu li").css("background-color",default_color);
	$("#userPage").css("background-color","#ececec");
}


function setTemplate(template){
	userTemplate = template;
	loadUserTemplate();
}

function cancelTemplate(){
	resetForm($("#"+userTemplate+"Form"));
	userTemplate = "dashboard";
	loadUserTemplate();
}

function saveTemplate(){
	//resetForm($("#"+userTemplate+"Form"));
	userTemplate = "dashboard";
	loadUserTemplate();
}



function populateTemplate(template){
	if(template == "personalinfo"){
		jsonData = {"fname":"Radu","lname":"Gabor", "email":"radu@grvtech.ca","username":"radu", "pass":"radu"};
		populateForm($("#"+userTemplate+"Form"),jsonData);
	}
	
	if(template == "dashboard"){
		userObj = userObjArray[0];
		statsObj = userObjArray[1];
		//$( "#messages-tabs" ).tabs({collapsible: true});
		
		
		
		$(messagesArray).each(function( i ) {
			if(i == 0){
				container = $("#messages-received");
			}else{
				container = $("#messages-sent");
			}
			$(this).each(function( j ) {
				var ul = $("<tr>", {id: "received-list", class: "a"}).appendTo(container).click(function() {
					if(i==0){
						var $mc = $("<div>",{class:"message-from-container"}).appendTo($(".messages-received-detail"));
						$("<div>",{class:"message-from-label"}).appendTo($mc);
						$("<div>",{class:"message-from-value"}).appendTo($mc);
						$("<div>",{class:"message-date-label"}).appendTo($mc);
						$("<div>",{class:"message-date-value"}).appendTo($mc);
						$("<div>",{class:"message-text-value"}).appendTo($mc);
						$("<div>",{id:"message-from-ok",class:"cisbutton"}).appendTo($mc);
						$(".messages-received-detail").show();
					}else{
						var $mc = $("<div>",{class:"message-to-container"}).appendTo($(".messages-sent-detail"));
						$("<div>",{class:"message-from-label"}).appendTo($mc);
						$("<div>",{class:"message-from-value"}).appendTo($mc);
						$("<div>",{class:"message-date-label"}).appendTo($mc);
						$("<div>",{class:"message-date-value"}).appendTo($mc);
						$("<div>",{class:"message-text-value"}).appendTo($mc);
						$("<div>",{id:"message-from-ok",class:"cisbutton"}).appendTo($mc);
						$(".messages-sent-detail").show();
					}
				});
				if(i == 0){
					var li1 = $('<td/>').addClass('message-from').text(this.from).appendTo(ul);
				}else{
					var li1 = $('<td/>').addClass('message-to').text(this.to).appendTo(ul);	
				}
				var li2 = $('<td/>').addClass('message-message').text(this.message).appendTo(ul);
				var li3 = $('<td/>').addClass('message-date').text(this.date).appendTo(ul);
			});
		});
		
		
		$("#w_username").text(userObj.firstname+" "+userObj.lastname);
		
		
		$("#w_s_l").text(statsObj.lastlogin);
		$.each( statsObj.lastpatient, function( key, value ) {
			var $app = $("<label>", {class : "appbox_small"});
			$app.text(key);
			$("#w_s_p").append($app);
			var $val = $("<span>", {class : "appvalue"});
			$val.text(value);
			$("#w_s_p").append($val);
			if(key=="cdis"){
				$val.click(function() {
					startApp(key,{"ramq":value});
				});
			}
		});
		
		$("#w_s_r").text(statsObj.lastreport.name).click(function() {
			startReport(statsObj.lastreport.id);
		});
	}
}