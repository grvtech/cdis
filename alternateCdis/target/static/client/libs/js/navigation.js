


export function initNavigation() {
	$(".cdisFooterRight").hover(function(){$(".cdisExpandMenu").toggle("fade");},function(){$(".cdisExpandMenu").toggle("fade");});
	
	$(".cdisFback").click(function() {gts(sid,applanguage);	});
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
		$(".cdisFreports").click(function() {gtr(sid,"en",null);});
		$(".cdisFlogout").click(function() {logoutUser(sid);});

		$(".cdisFnew").click(function() {
			var p = getPage();
			var plus = "&frompage="+p;
			if(p == "cdis")plus = plus+"&fr="+patientObjArray[0].ramq;
			gtc(sid,applanguage,null,"addpatient",plus);
		});
		
		$(".cdisFullButton").click(function(){
			gtc(sid,applanguage,getParameterByName("ramq"),"mdvisits",fllstr);
		});
}

export	function startReport(reportid){
		if(reportid == null){
			window.location = "reports.html?sid="+sid;
		}else{
			window.location = "reports.html?sid="+sid+"&reportid="+reportid;
		}
	}

	



	

	
//export {initNavigation, startReport, getPage, getParameterByName, gti, gts, gtsplus,gtc,gtcplus,gtr,gto,gta,gtn}; // a list of exported variables


