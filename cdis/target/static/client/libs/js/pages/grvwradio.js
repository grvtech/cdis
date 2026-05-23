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
                $(v).off("click").on("click",{object:this},selectItem);
            });
            if($("#"+name+"-element").length == 0){
				$("<input>",{type:"hidden",value:value,id:name+"-element"}).appendTo($(obj));
			}
            $("#"+name+"-element").off('change').on("change",preventSelfcallCallback);
        }

	function selectItem(event){
		let ob = event.data.object;
		$('#'+nume+' div').removeClass('selected');
        $(ob).addClass('selected');
        let v = $(ob).attr('value');
        value = v;
        $(obj).attr("value",value);
		$("#"+name+"-element").val(value);
        $("#"+name+"-element").trigger("change");
	}
    
     
    function setValue(newvalue){
        value = newvalue;
        $(obj).attr("value",value);
		$("#"+name+"-element").val(value);
        $("#"+name).find("div[value='"+newvalue+"']").each(function(k,v){
			$(this).trigger("click");
		})
    }  

	function preventSelfcallCallback (event) {
  		event.preventDefault();
	}
    
    function getValue(){
        //return $(input).val();
        return $("#"+name+"-element").val();;
    }  

	return {
		name:name,
		off: function(eventName){
			$("#"+name+"-element").off(eventName);
		},
		on: function(eventName,params,handler){
			$("#"+name+"-element").off(eventName).on(eventName,params,handler);
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
