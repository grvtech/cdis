function grvwtabs(name){
		const self = this;
		self.obj =$("#"+name);
		if($("#"+name).attr("type") == "grvwtabs"){
			$("#"+name).addClass("grvwtabs");
			self.name=name;
			$("#"+name+" ul:first-child li").each(function(i,v){
				if($(v).hasClass("selected")){loadTab({data:{object: v, index: i,name:name}});}
				$(this).off("click").on("click",{object: v, index: i,name:name},loadTab);
			});
			if($("#"+name+"-element").length == 0){
				$("<input>",{type:"hidden",value:"0",id:name+"-element"}).appendTo(self.obj);
			}
			self.active = $("#"+name+"-element").val();
			$("#"+name+" ul:first-child li:not(.label)").each(function(i,v){
				if(self.active == i){loadTab({data:{object: v, index: i,name:name}});}
			});
			$("#"+name+"-element").off('change').on("change",preventSelfcallCallback);	
		} 
		
	function preventSelfcallCallback (event) {
		event.preventDefault();
	}
			
			
	function loadTab(event){
		const obj = event.data.object;
		const index = event.data.index;
		const name = event.data.name;
		let hr = $(obj).attr("target");
		if(hr.indexOf("#") >= 0){
			$("#"+name+" article:first-of-type > div").css("display","none");
			$("#"+name+" article:first-of-type "+hr).css("display","block");
		}else{
			$("#"+name+" article:first-of-type").empty();
			$("#"+name+" article:first-of-type").load(hr);	
		}
		$("#"+name+" ul:first-child li").removeClass("selected");
		$(obj).addClass("selected");
		self.active = index;
		$("#"+name+"-element").val(index);
		$("#"+name+"-element").trigger("change");	
	}
	
	return {
		name:name,
		on: function(eventName,params,handler){
			$("#"+name+"-element").off(eventName).on(eventName,params,handler);
		},
		getActive : function(){
			return self.active;
		},
		setActive:function(index){
			if(index != self.active){
				$("#"+name+" ul:first-child li:not(.label)").each(function(i,v){
					if(index == i){loadTab({data:{object: v, index: i,name:name}});}
				});	
			}
		}
	}
}