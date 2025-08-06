import grvwtabsstyles from "./grvwtabs.css" with { type: "css" };

export default class grvwtabs{
	constructor(name){
		const self = this;
		document.adoptedStyleSheets = [grvwtabsstyles];
		$("#"+name).addClass("grvwtabs");
		 
		self.name=name;
		self.active = 0;	
		$("#"+name+" ul li").each(function(i,v){
			if($(v).hasClass("selected")){self.active=i;self.loadTab({data:{object: v, index: i,name:name}} );}
			$(this).on("click",{object: v, index: i,name:name},self.loadTab);
		});
		if(self.active == 0){
			$("#"+name+" ul li").each(function(i,v){
				if(self.active == i){self.active=i;self.loadTab({data:{object: v, index: i,name:name}});}
			});
		}
		
	}
	
	loadTab(event){
		const obj = event.data.object;
		const index = event.data.index;
		const name = event.data.name;
		$("#"+name+" article").empty();
		$("#"+name+" article").load($(obj).attr("href"));
		$("#"+name+" ul li").removeClass("selected");
		$(obj).addClass("selected");
		this.active= index;
	}
	
}