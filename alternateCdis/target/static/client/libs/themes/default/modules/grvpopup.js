import moduleconfig from './config.json' with { type: 'json' };
/**
 * config = {
 * 	width:int, 
 * 	height:int, 
 * 	container:divid, 
 * 	buttons:{text:text, action:functionName|function}, 
 * 	content:htmlContent, 
 * 	title:text}
 * 
 * 
 * 
 */
export class grvpopup{
	static includes = {};
	static footer = null;
	constructor(config){
		this.id = Math.floor(Date.now() / 1000);
		this.name = "grvpopup";
		//this.includes = {}; 
		this.loadstyle();
		this.loadincludes();
		// remove scroll of body
		$("body").css("overflow-y","hidden").css("overflow-x","hidden");
	
		let modal = $('<div>',{id:"grvpopup_"+this.id,class:"grvpopup-fullscreen-modal"}).appendTo($("#"+config.container));
		let sett = $('<div>',{class:"grvpopup-window"}).appendTo(modal);
		if(typeof(config.width) != "undefined")sett.css("width",config.width+"px");
		if(typeof(config.height) != "undefined")sett.css("height",config.height+"px");
		let settH = $('<div>',{class:"grvpopup-window-header"}).appendTo(sett);
		let settB = $('<div>',{class:"grvpopup-window-body"}).appendTo(sett);
		let settBB = $('<div>',{class:"grvpopup-window-body-body"}).appendTo(settB);
		grvpopup.footer = $('<div>',{class:"grvpopup-window-body-footer"}).appendTo(settB);
		let autos = "";
		$.each(config.buttons,function(x,y){autos = "auto "+autos;});
		$(grvpopup.footer).css("grid-template-columns",autos);
		const self = this;
		$.each(config.buttons, function(i,button){
			let cb = $('<div>',{class:"cdisCisButton"}).text(button.text).appendTo(grvpopup.footer);
			if(button.action == "closeGRVPopup"){
				cb.on("click",self.closeGRVPopup);
			}else{
				cb.on("click",{"buttonAction":button.action, "alias":button.alias},function (event){
					//button function must return boolean
					let flag = false;
					flag = eval("grvpopup.includes."+event.data.alias+"."+event.data.buttonAction+"()");
					if(flag)setTimeout(self.closeGRVPopup,300);
				});	
			}
		});
		
		settBB.html(config.content);
		$('<div>',{class:"grvpopup-window-header-title"}).text(config.title).appendTo(settH);
		var settHC = $('<div>',{class:"grvpopup-window-header-close"}).html("&#128473;").appendTo(settH);
		settHC.on("click",this.closeGRVPopup);
	}
	
	changeButtons(bottonsconfig){
		$(grvpopup.footer).empty(); 
		let autos = "";
		$.each(bottonsconfig,function(x,y){autos = "auto "+autos;});
		$(grvpopup.footer).css("grid-template-columns",autos);
		$.each(bottonsconfig, function(i,button){
			let cb = $('<div>',{class:"cdisCisButton"}).text(button.text).appendTo(grvpopup.footer);
			if(button.action == "closeGRVPopup"){
				cb.on("click",self.closeGRVPopup);
			}else{
				cb.on("click",{"buttonAction":button.action, "alias":button.alias},function (event){
					//button function must return boolean
					let flag = false;
					flag = eval("grvpopup.includes."+event.data.alias+"."+event.data.buttonAction+"()");
					if(flag)setTimeout(self.closeGRVPopup,300);
				});	
			}
		});
	}
	
	closeGRVPopup(){
		$(".grvpopup-fullscreen-modal").remove();
		$("body").css("overflow-y","auto").css("overflow-x","auto");
		return true;
	}
	
	loadstyle(){
	    const link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.href = moduleconfig.path+this.name+".css";
	    document.head.appendChild(link);
	}
	loadincludes(){
		$.each(moduleconfig.includes, function(i,mod){
			if(mod.module == "grvpopup"){
				$.each(mod.libs, async function(j,lib){
					grvpopup.includes[lib.alias] = await import(lib.file);
				});
			}
		})
	}
}