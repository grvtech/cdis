import moduleconfig from './config.json' with { type: 'json' };

export class grvradio{
	static includes={};
	constructor(config) {
		this.config = config;
        this.obj = $('#'+config.container);
        this.value = 0;
		this.direction= config.direction;
        this.name = "grvradio";
		this.loadstyle();
		this.loadincludes();
		this.change = config.change;
		const self = this;
        if($(this.obj).attr('type') == 'grvradio'){
            $(this.obj).addClass('grvradio');
            if(this.direction == "vertical"){
                this.obj.css('flex-direction',"column");
            }
			$.each(config.elements,function(i,element){
				let c = "";
				if(element.default == 1){
					self.value=element.value;
					self.obj.attr("value",element.value);
					c = "selected";
				}
				$("<div>",{class:"grvradio-item "+c, value:element.value})
				.html(element.label)
				.appendTo(self.obj)
				.on("click",{self:self},self.selectItem); 
			});
            this.obj.on("change",{self:this},self.preventSelfcallCallback);
        }
	}

	loadstyle(){
	    const link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.href = moduleconfig.path+this.name+".css";
	    document.head.appendChild(link);
	}
		
	loadincludes(){
		$.each(moduleconfig.includes, function(i,mod){
			if(mod.module == "grvautocomplete"){
				$.each(mod.libs, async function(j,lib){
					grvautocomplete.includes[lib.alias] = await import(lib.file);
				});
			}
		})
	}
	
	selectItem(event){
		const self = event.data.self;
		self.obj.find("div").removeClass('selected');
        $(this).addClass('selected');
        let v = $(this).attr('value');
        self.value = v;
        $(self.obj).attr("value",v);
        $(self.obj).trigger("change");
	}
    
     
    setValue(newvalue){
        this.value = newvalue;
        $(this.obj).attr("value",this.value);
		this.obj.children("div").removeClass('selected');
        this.obj.children('div[value="'+newvalue+'"]').addClass("selected");
    }  

	preventSelfcallCallback (event) {
  		event.preventDefault();
		if(typeof event.data.self.change == "function"){
			event.data.self.change(event.data.self);
		}
	}
    
    getValue(){
        return this.value;
    }  

	on(eventName,params,handler){
		$(this.obj).on(eventName,params,handler);
	}
	
}
