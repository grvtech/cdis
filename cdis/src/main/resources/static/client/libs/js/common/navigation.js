
function initNavigation() {
	
	$(".fback").click(function() {gts(sid,applanguage);	});
	$("#addpatient-button").click(function() {
		//alert("add patient");
			gtc(sid,applanguage,null,"addpatient");
			//window.location = "cdis.html?section=addpatient&sid="+sid+"&language=en";
		});
		
		$("#frontpage-button").click(function() {
			//gtc(sid,applanguage,null,"addpatient");
			//window.location = "cdis.html?section=frontpage&sid="+sid+"&language=en";
			gta(sid,applanguage,"frontpage");
		});
		$(".frontpage").click(function() {
			gta(sid,applanguage,"frontpage");
			//window.location = "cdis.html?section=frontpage&sid="+sid+"&language=en";
		});
		
		$(".personalinfo").click(function() {
			gto(sid,applanguage,"personalinfo");
			//window.location = "cdis.html?section=personalinfo&sid="+sid+"&language=en";
		});
		$(".users").click(function() {
			gta(sid,applanguage,"users");
			//window.location = "cdis.html?section=users&sid="+sid+"&language=en";
		});
		$(".audit").click(function() {
			gta(sid,applanguage,"audit");
			//window.location = "cdis.html?section=audit&sid="+sid+"&language=en";
		});
		$("#reports-button").click(function() {
			gtr(sid,"en",null);
			//window.location = "cdis.html?section=frontpage&sid="+sid+"&language=en";
		});
		$(".freports").click(function() {gtr(sid,"en",null);});
		$(".flogout").click(function() {logoutUser(sid);});

		$(".fnew").click(function() {gtc(sid,applanguage,null,"addpatient");});
		
		$(".cdisfull").click(function(){
			gtc(sid,applanguage,getParameterByName("ramq"),"mdvisits",fllstr);
		});
}

	function startReport(reportid){
		if(reportid == null){
			window.location = "reports.html?sid="+sid;
		}else{
			window.location = "reports.html?sid="+sid+"&reportid="+reportid;
		}
	}

	
	function getPage() {
		var url =  window.location.href;
	    var index = url.lastIndexOf("/") + 1;
	    var filenameWithExtension = url.substr(index);
	    var filename = filenameWithExtension.split(".")[0]; 
	    filename = filename.split("?")[0]; // <-- added this line
	    if(filename == ""){filename="index";}
	    return filename;                                  
	}

	function getParameterByName(name) {
		var url = window.atob(location.search.substring(1));
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),results = regex.exec("?"+url);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function gti(){window.location = "index.html";}/*go to index*/
	function gts(s,l){
		var p = window.btoa("sid="+sid+"&language="+l+"&ts="+moment());
		window.location = "search.html?"+p;
	}/*go to search*/
	function gts(s,l,plus){
		var p = window.btoa("sid="+sid+"&language="+l+"&ts="+moment()+plus);
		window.location = "search.html?"+p;
	}/*go to search*/
	function gtc(s,l,r,sec){
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ramq="+r+"&ts="+moment());
		window.location = "cdis.html?"+p;
	}/*go to cdis*/
	function gtc(s,l,r,sec,plus){
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ramq="+r+"&ts="+moment()+plus);
		window.location = "cdis.html?"+p;
	}/*go to cdis*/
	function gtr(s,l,rid){
		var p = window.btoa("sid="+sid+"&language="+l+"&reportid="+rid+"&ts="+moment());
		window.location = "reports.html?"+p;
	}/*go to reports*/
	function gto(s,l,sec){
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ts="+moment());
		window.location = "options.html?"+p;
	}/*go to options*/
	function gta(s,l,sec){
		var p = window.btoa("sid="+sid+"&language="+l+"&section="+sec+"&ts="+moment());
		window.location = "admin.html?"+p;
	}/*go to admin*/
	function gtn(s,l,r,idn){
		var p = window.btoa("sid="+sid+"&language="+l+"&section=notes&ramq="+r+"&idnote="+idn+"&ts="+moment());
		window.location = "cdis.html?"+p;
	}/*go to admin*/
	

	
window.addEventListener("beforeunload", function (e) {
	logout(sid);
});
	