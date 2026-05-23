export class grvvalidation{
	constructor(){
		console.log("grvvalidation instance created.");
		this.emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
		this.lowCaseRegex= new RegExp(/[a-z]/g);
		this.upperCaseRegex = new RegExp(/[A-Z]/g);
		this.numbersRegex =new RegExp(/[0-9]/g);
		this.name="grvvalidation";
	};
	
	updateTips( t ) {
	    $(".cdisValidateTips").html( t );
	}

	checkEmpty( o, n ) {
	    if ( o.val().length == 0 || o.val() == '0') {
	    	if(n!=null)this.updateTips( n );
	      	return false;
	    } else {
	    	return true;
	    }
	}

	checkEmail( o, n ) {
		    if ( !( this.emailRegex.test( o.val() ) ) ) {
		      if(n!=null)this.updateTips( n );
		      return false;
		    } else {
		      return true;
		    }
		}
	
	checkRegexp( o, regexp, n ) {
	    if ( !( regexp.test( o.val() ) ) ) {
	      if(n!=null)this.updateTips( n );
	      return false;
	    } else {
	      return true;
	    }
	}
	
	checkLowcase( o, n ) {
	    if ( !( this.lowCaseRegex.test( o.val() ) ) ) {
	      if(n!=null)this.updateTips( n );
	      return false;
	    } else {
	      return true;
	    }
	}

	checkUppercase( o, n ) {
	    if ( !( this.upperCaseRegex.test( o.val() ) ) ) {
	      if(n!=null)this.updateTips( n );
	      return false;
	    } else {
	      return true;
	    }
	}

	checkNumbers( o, n ) {
	    if ( !( this.numbersRegex.test( o.val() ) ) ) {
	      if(n!=null)this.updateTips( n );
	      return false;
	    } else {
	      return true;
	    }
	}

	checkLength( o, l, n ) {
	    if ( !( o.val().length >= l ) ) {
	      if(n!=null)this.updateTips( n );
	      return false;
	    } else {
	      return true;
	    }
	}
	checkString( o, s, n ) {
	    if ( !( o.val().length >= 1 && o.val() === s) ) {
	      if(n!=null)this.updateTips( n );
	      return false;
	    } else {
	      return true;
	    }
	}
	
	// o obj l length  
	checkPassword(o,l){
		let ve = this.checkEmpty(o);
		let vc = this.checkLowcase(o);
		let vu = this.checkUppercase(o);
		let vn = this.checkNumbers(o);
		let vl = this.checkLength(o,l);
		if(ve && vc && vu && vn && vl) return true;
		else return false;
	}
	
	checkPasswordConfirm(o,s){
		let vc = this.checkString(o,s);
		if(vc) return true;
		else return false;
	}
	
	
	validateRamq(ramqObj, lnameValue, fnameValue, genderValue, dobValue){
		let flagRamq =  this.checkEmpty(ramqObj, "RAMQ cannot be empty!");
		let flagRamqFormat = this.checkRegexp(ramqObj,/^([a-z]){4}([0-9]){8}$/i,"RAMQ must respect format!");
		let flagRamqDate = false;
		let flagRamqName = false;
		let ramqValue = ramqObj.val();
		if(flagRamq && flagRamqFormat){
			let dateStr = ramqValue.substring(4,10);
			var year = Number(dateStr.substring(0,2));
			var month = Number(dateStr.substring(2,4));
			var day = Number(dateStr.substring(4,6));
			//dobvalue should be like YYYY-MM-DD
			var dobyear = Number(dobValue.substring(2,4));
			var dobmonth = (genderValue == 2)?Number(dobValue.substring(5,7))+50:Number(dobValue.substring(5,7));	
			var dobday = Number(dobValue.substring(8,10));
			if(year == dobyear && month == dobmonth && day == dobday) flagRamqDate = true;
			else this.updateTips("RAMQ must respect date of birth rule!");
			
			let ramqname = ramqValue.substring(0,3).toLowerCase()+ramqValue.substring(3,4).toLowerCase();
			let name = lnameValue.substring(0,3).toLowerCase()+fnameValue.substring(0,1).toLowerCase();
			if(ramqname == name )flagRamqName = true;
			else this.updateTips("RAMQ must respect name rule!");
			
			if(flagRamqDate && flagRamqName){
				return true;
			}else{
				return false;
			}
		}else{return false;}
	}
	
	validateDiabet(dtypeValue, ddateValue){
		
		let flagDtype =  false;
		if(dtypeValue != 0)flagDtype = true;
		else this.updateTips("Type of diabetes cannot be unknown");
	    let flagDdate = false;
		if(ddateValue != "")flagDdate = true;
		else this.updateTips("Date of diagnosis cannot be empty");
		return flagDtype && flagDdate;
	}
	
	validateDeceased(deceasedValue, deceasedDateValue, deceasedCauseValue){
			let flagDeceased =  false;
			if(deceasedValue == 1){
				flagDeceased = (deceasedDateValue == "")?false:true;
			}else{
				flagDeceased = true;
			}
			return flagDeceased;
	}	
}



