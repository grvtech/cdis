//options 
/**
 * {
 * 	title:text,
 * 	width:number,
 *  height:number,
 *  content: html content,
 *  buttons : [{text:text,action:function},...]
 * }
 * 
 * 
 */



function grvwpopup(options){
	const id = Date.now();
	if(typeof(options) != "object"){
		alert("Error creating the popup");
		return true;
	}else{
		let windowBody = $("body");
		windowBody.css("overflow-y","hidden");
		let windowPopup = $('<div>',{class:"grvwpopup-window"}); 
		$('<div>',{id:"grvwpopup-fullscreen_"+id,class:"grvwpopup-fullscreen-modal"})
			.append(windowPopup)
			.appendTo(windowBody);	
		let title = "CDIS";
		if(typeof(options.title) != "undefined") title = options.title;
		if(typeof(options.width) != "undefined")
			{windowPopup.css("width",options.width+"px");}
			else{windowPopup.css("width","400px");}
		if(typeof(options.height) != "undefined")
			{windowPopup.css("height",options.height+"px");}
			else{windowPopup.css("height","300px");}	
		 
		$('<div>',{class:"grvwpopup-window-header"})
			.append($('<div>',{class:"grvwpopup-window-header-title"}).text(title))
			.append($('<div>',{class:"grvwpopup-window-header-close"}).html("<i class='fa fa-times'></i>")
						.off("click").on("click",closegrvwpopup))
			.appendTo(windowPopup);
			
		$('<div>',{class:"grvpopup-window-body"})
			.append($('<div>',{class:"grvwpopup-window-body-body"}).html(options.content))
			.append($('<div>',{class:"grvwpopup-window-body-footer"}))
			.appendTo(windowPopup);
				
		let autos = "";
		$.each(options.buttons,function(x,y){
			autos = "auto "+autos;
		});
		$(".grvwpopup-window-body-footer").css("grid-template-columns",autos);
		$.each(options.buttons,function(x,y){
			
			$('<button>',{class:"cisbutton"}).text(y.text)
				.off("click")
				.on("click",{buttonAction:y.action},function (event){
					let flag = eval(event.data.buttonAction+"()");
					if(flag)setTimeout(closegrvwpopup,300);})
				.appendTo($(".grvwpopup-window-body-footer"));
		});
		
	}
	
	function closegrvwpopup(){
		$(".grvwpopup-fullscreen-modal").remove();
		windowBody.css("overflow-y","auto");
	}
}