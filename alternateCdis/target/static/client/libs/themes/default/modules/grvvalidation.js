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
}



