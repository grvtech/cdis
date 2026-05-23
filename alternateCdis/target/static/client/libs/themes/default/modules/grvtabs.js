import moduleconfig from './config.json' with { type: 'json' };
import cdisconfig from '../sections/cdis/config.json' with { type: 'json' };
import * as applib from '../../../js/applib.js';

export class grvtabs{
	static includes ={};
	constructor(config){
		this.name = "grvtabs";
		this.id = this.name+"-"+Date.now();
		this.container = $("#"+config.container);
		this.config = config;
		if($(this.container).attr("type") == "grvtabs"){
			this.loadstyle();
			this.loadincludes();
			this.container.addClass("grvwtabs").attr("id",this.id);
			this.tabs = $("<ul>",{class:"tabs"}).appendTo(this.container);
			this.body = $("<article>",{class:"body"}).appendTo(this.container);
			this.active = 0;
			const self = this;
			$.each(this.config.elements, function(i, element){
				let c = "";
				$("<li>",{class:"tab "+c}).html(element.name)
					.on("click",{self:self, index:i},self.loadTab)
					.appendTo(self.tabs);
				if(element.default == 1){
					c = "selected";
					this.active = i;
					self.loadTab({data:{self: self,index:i}});
				}				
			});
			
			/*
			$("#"+name+" ul:first-child li").each(function(i,v){
				if($(v).hasClass("selected")){loadTab({data:{object: v, index: i,name:name}});}
				$(this).on("click",{object: v, index: i,name:name},loadTab);
			});
			
			
			$("#"+name+" ul:first-child li:not(.label)").each(function(i,v){
				if(self.active == i){loadTab({data:{object: v, index: i,name:name}});}
			});
			
			$("#"+name+" article").css("min-height",( self.obj.height() - $("#"+name+" ul").outerHeight() - 80) );
			*/	
		}	
	}
		 
	loadstyle(){
	    const link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.href = moduleconfig.path+this.name+".css";
	    document.head.appendChild(link);
	}	
	
	loadincludes(){
		const self = this;
		$.each(moduleconfig.includes, function(i,mod){
			console.log(self.name)
			if(mod.module == self.name){
				$.each(mod.libs, async function(j,lib){
					try {
					  grvtabs.includes[lib.alias] = await import(lib.file);
					} catch (error) {
					  console.error("An error occurred:", error.message);
					} finally {}
				});
			}
		})
	}
	
	
	loadTab(event){
		const self = event.data.self;
		const index = event.data.index;
		const tabs = event.data.self.tabs;
		const body = event.data.self.body;
		body.empty();
		$.each(self.config.elements, function(i,element){
			if(i == index){
				let t = applib.getTemplatePath(element.alias,cdisconfig);
				let tc =  applib.getTemplateContent(t);
				body.html(tc);
				if(element.callback)element.callback();
				$.each(tabs.children(),(j,li)=>{
					if(j == index){
						$(li).addClass("selected");
						self.active = index;
					}else{
						$(li).removeClass("selected");
					}
				})
			}
		});
	}
	
	
	getActive(){
		return this.active;
	}
	
	setActive(index){
		$("#"+name+" ul:first-child li:not(.label)").each(function(i,v){
			if(index == i){loadTab({data:{object: v, index: i,name:name}});}
		});
	}
	
}