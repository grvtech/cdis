function grvwcheck(name) {
        var obj = $('#'+name);
        this.ob = obj;
        var valueSplit = "&";
        var value = valueSplit;
        var checkClass = "fa-check-square-o";
        var uncheckClass = "fa-square-o";
        if($(obj).attr('type') == 'grvwcheck'){
            $(obj).addClass('grvwcheck');
            if($(obj).attr('direction') == "vertical"){
                $('#'+name).css('flex-direction',"column");
            }
            $('#'+name+' div[default]').addClass('selected');
            $('#'+name+' div[default] i').addClass(checkClass);
            $('#'+name+' div i:not(.'+checkClass+')').addClass(uncheckClass);
			let v = $('#'+name+' div[default]').attr('value');
			if(typeof v == "undefined"){
				value="";
			}else{
				value = value+$('#'+name+' div[default]').attr('value');	
			}
			if($("#"+name+"-element").length == 0){
				$("<input>",{type:"hidden",value:value,id:name+"-element"}).appendTo($(obj));
			}
            $(obj).attr('value',value);
            $('#'+name+' div').each(function(i,v){
                $(v).off("click").on("click",function(){
					if($(this).hasClass('selected')){
						$(this).removeClass('selected');
						$(this).find("i").removeClass(checkClass);
						$(this).find("i").addClass(uncheckClass);
						unsetValue($(this).attr('value'));
					}else{
                    	$(this).addClass('selected');
                    	$(this).find("i").removeClass(uncheckClass);
						$(this).find("i").addClass(checkClass);
                    	setValue($(this).attr('value'));	
					}
                });
            });
			
			$('#'+name+'-element').off('change').on("change",preventSelfcallCallback);
        }

	
    
     
    function setValue(newvalue){
        value = value+valueSplit+newvalue;
        $(obj).attr('value',value);
		$("#"+name+"-element").val(value);
        $("#"+name+"-element").trigger("change");
    }
      
	function unsetValue(newvalue){
        value = value.replace(valueSplit+newvalue,'');
        $(obj).attr('value',value);
		$("#"+name+"-element").val(value);
        $("#"+name+"-element").trigger("change");
    }

	function preventSelfcallCallback (event) {
  		event.preventDefault();
	}
    
    function getValue(){
        return $("#"+name+"-element").val();;
    }  

	return {
		name:name,
		object:$(obj),
		off: function(eventName){$('#'+name+'-element').off(eventName);},
		on: function(eventName,params,handler){
			$('#'+name+'-element').off(eventName).on(eventName,params,handler);
		},
		setValue: function(newvalue){
			$('#'+name+' div').each(function(i,v){
				if($(this).attr('value') == newvalue){
					$(this).addClass('selected');
					$(this).find("i").removeClass(uncheckClass);
					$(this).find("i").addClass(checkClass);
				}
            });
			setValue(newvalue);
		},
		removeValue : function (oldvalue){
			$('#'+name+' div').each(function(i,v){
				if($(this).attr('value') == oldvalue){
					$(this).removeClass('selected');
					$(this).find("i").removeClass(checkClass);
					$(this).find("i").addClass(uncheckClass);
				}
            });
			unsetValue(oldvalue);	
		},
		getValue : function(){
			var result = getValue();
			return result;
		}
	}
}
