function grvwradio(name) {
        let obj = $('#'+name);
        let value = 0;
        let nume = name;
        if($(obj).attr('type') == 'grvwradio'){
            $(obj).addClass('grvwradio');
            if($(obj).attr('direction') == "vertical"){
                $('#'+name).css('flex-direction',"column");
            }
            $('#'+name+' div[default]').addClass('selected');
            value = $('#'+name+' div[default]').attr('value');
            $(obj).attr("value",value);
            $('#'+name+' div').each(function(i,v){
                $(v).on("click",{object:this},selectItem);
            });
            
            $(obj).on("change",preventSelfcallCallback);
        }

	function selectItem(event){
		let ob = event.data.object;
		$('#'+nume+' div').removeClass('selected');
        $(ob).addClass('selected');
        let v = $(ob).attr('value');
        value = v;
        $(obj).attr("value",value);
        $(obj).trigger("change");
	}
    
     
    function setValue(newvalue){
        value = newvalue;
        $(obj).attr("value",value);
        $(this.obj).find("div [value='"+newvalue+"']").trigger("click");
    }  

	function preventSelfcallCallback (event) {
  		event.preventDefault();
	}
    
    function getValue(){
        //return $(input).val();
        return value;
    }  

	return {
		name:name,
		on: function(eventName,params,handler){
			$(obj).on(eventName,params,handler);
		},
		setValue : function(v){
			setValue(v);
		},
		getValue : function(){
			var result = getValue();
			return result;
		}
	}
}
