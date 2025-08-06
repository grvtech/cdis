

/**
 * PUBLIC FUNCTIONS
 *  */		

export function loadRessources(config, callback){
	let ressources = config.ressources;
	let container = $("#"+config.container);
	$.each(ressources, function(i,v){
		let t = v.type;
		if(t == "css"){
			let e = v.elements;
			$.each(e,function(j,k){
				let flag = k.initload;
				if(flag){
					loadCSS(k.file);
				}	
			});
		}else if(t == "js"){
			let e = v.elements;
			$.each(e,function(j,k){
				let flag = k.initload;
				if(flag){
					$.getScript(k.file, function() {console.log( k.file+"loaded and executed!" );});
				}	
			});
		}else if(t == "ui"){
			let e = v.elements;
			$.each(e,function(j,k){
				let flag = k.initload;
				if(flag){
					container.load(k.file, callback);
				}	
			});
		}
	});
}

export function getTemplatePath(name, config){
	let path = "";
	let rs = config.ressources;
	$.each(rs,function(i,v){
		if(v.type == "ui"){
			let es = v.elements;
			$.each(es, function(j,k){
				if(name == k.name){
					path = k.file;
				}
			})
		}
	})
	return path;
}

export function getTemplateContent(template){
	let templateContent = "";
	$.ajax({
	    url: template, 
	    type: 'GET',
		async: false,
	    dataType: 'html', // Expecting HTML content
	    success: function(data) {
	        templateContent = data; // Example: Select a div with ID 'yourTemplateId'
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        console.error('AJAX Error:', textStatus, errorThrown);
	    }
	});
	return templateContent;
}




/**
 * PRIVATE FUNCTIONS
 * 
 */

function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function loadJS(href) {
    const link = document.createElement('script');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}
