import moduleconfig from './config.json' with { type: 'json' };
/*
 * properties : object format : {direction:v|h, open:1|0, container elements:[{label:text,value:text,active:1|0}]}
 * 
 * elements : array of objects format object : {id, label, value, status}
 * 
 * direction h :   if open :  el1 el2 el3 el4 ....
 * 					if close el1 >  on click : el1 el2 el3 el4 ...
 * direction v  if open
 * 						el1
 * 						el2
 * 						el3 ...
 * 
 * 				if close 
 * 						el1 > on click
 * 						el1
 * 						el2
 * 						el3 ... 
 * */
export class grvlist{
	static includes = {};
	constructor(config){
		this.direction = (config.direction)?config.direction:'v';// vertical by default
		this.open = (config.open)?config.open:0; //close by default
		this.id = 'grvlist-'+Date.now();
		this.container = (config.container)?$("#"+config.container):$("<div>",{id:this.id+"-container"}).appendTo($("body"));
		this.name="grvlist";
		this.loadstyle();
		const self = this;
		let listContainer = $('<div>',{class:'grvlist-container', id:this.id}).appendTo(this.container);
		let f = $('<input>',{type:'hidden',value:'',id:this.id}).appendTo(listContainer);
		if(this.open == 1){
			let c = $('<ul>',{class:'grvlist-group-'+this.direction}).appendTo(listContainer);
			$.each(config.elements, function(i, element){
				let a = (element.active==1)?'active':'';
				$('<li>',{value:element.value, class:'grvlist-group-item '+a}).text(element.label).appendTo(c);
			})	
			c.children('li').on('click',function(event){
					$(this).siblings('li').removeClass('active');
					$(this).addClass('active');
					$(this).parent().siblings('input').val($(this).attr('value'));
					$(this).parent().siblings('input').trigger('change');
			});	
		}else{
			let aitemLabel = "";
			$.each(config.elements, function(i, element){
				 if(element.active==1){aitemLabel = element.label;self.setValue(element.value);};
			});
			let activeItem = $('<div>',{class:'grvlist-active-item', id:this.id+"-active"}).appendTo(listContainer);
			$("<span>",{class:"label"}).text(aitemLabel).appendTo(activeItem);
			let actionItem = null;
			if(this.direction == 'v'){
				actionItem = $("<span>",{class:"action"}).html("&#x25BC;").appendTo(activeItem);	
			}else if(this.direction == 'h'){
				actionItem = $("<span>",{class:"action"}).html("&#9654;").appendTo(activeItem);
			}
			actionItem.on("click",function(event){
				
				let p = activeItem.position();
				//alert(p.left+"   "+p.top)
				//alert(activeItem.width())
				console.log($(this).parent().find(".grvlist-group-"+self.direction))
				if($(this).parent().parent().find(".grvlist-group-"+self.direction).length >0){$(this).parent().parent().find(".grvlist-group-"+self.direction).remove();}
				else{
					let c = $('<ul>',{class:'grvlist-group-'+self.direction}).appendTo(listContainer);
					let l,t=0;
					c.css("position","absolute");
					if(self.direction == 'h'){
						l = p.left + activeItem.outerWidth();
						t = p.top;	
					}else{
						l = p.left;
						t = p.top + activeItem.outerHeight;
						c.css("width",activeItem.outerWidth()+"px");
					}
					c.css("left",l+"px");
					c.css("top",t+"px");
					c.css("z-index",1000);
					
					$.each(config.elements, function(i, element){
						let a = "";
						if(element.value==self.getValue()){
							a = "active";
						}
						$('<li>',{value:element.value, class:'grvlist-group-item '+a}).text(element.label).appendTo(c);
					});
					c.children('li').on('click',function(event){
						$(this).siblings('li').removeClass('active');
						$(this).addClass('active');
						$(this).parent().siblings('input').val($(this).attr('value'));
						$(this).parent().siblings('.grvlist-active-item').children('.label').text($(this).text());
						$(this).parent().parent().siblings('input').trigger('change');
						$(this).parent().remove();
					});	
				}
					
				
			});
		}
		
	
	}

	getValue(){
		return $("#"+this.id+" input[id="+this.id+"]").val();
	}
	
	setValue(value){
		$("#"+this.id+" input[id="+this.id+"]").val(value);
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