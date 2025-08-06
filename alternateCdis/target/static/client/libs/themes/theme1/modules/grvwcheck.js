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
            value = value+$('#'+name+' div[default]').attr('value');
            $(obj).attr('value',value);
            $('#'+name+' div').each(function(i,v){
                $(v).click(function(){
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
        }

	$(obj).on("change",preventSelfcallCallback);
    
     
    function setValue(newvalue){
        value = value+valueSplit+newvalue;
        $(obj).attr('value',value);
        $(obj).trigger("change");
    }
      
	function unsetValue(newvalue){
        value = value.replace(valueSplit+newvalue,'');
        $(obj).attr('value',value);
        $(obj).trigger("change");
    }

	function preventSelfcallCallback (event) {
  		event.preventDefault();
	}
    
    function getValue(){
        return value;
    }  

	return {
		name:name,
		on: function(eventName,params,handler){
			$(obj).on(eventName,params,handler);
		},
		getValue : function(){
			var result = getValue();
			return result;
		}
	}
}
