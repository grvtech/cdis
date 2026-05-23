function grvwtabs(name){
		const self = this;
		self.obj =$("#"+name);
		if($(self.obj).attr("type") == "grvwtabs"){
			$("#"+name).addClass("grvwtabs");
			self.name=name;
			$("#"+name+" ul:first-child li").each(function(i,v){
				if($(v).hasClass("selected")){loadTab({data:{object: v, index: i,name:name}});}
				$(this).on("click",{object: v, index: i,name:name},loadTab);
			});
			self.active = 0;
			$("#"+name+" ul:first-child li:not(.label)").each(function(i,v){
				if(self.active == i){loadTab({data:{object: v, index: i,name:name}});}
			});
			
			$("#"+name+" article").css("min-height",( self.obj.height() - $("#"+name+" ul").outerHeight() - 80) );	
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
	}
	
	return {
		name:name,
		getActive : function(){
			return self.active;
		},
		setActive:function(index){
			$("#"+name+" ul:first-child li:not(.label)").each(function(i,v){
				if(index == i){loadTab({data:{object: v, index: i,name:name}});}
			});
		}
	}
}