/*
 * properties : object format : {direction:v|h, open:1|0, multivalue:1|0, name, id, class, container }
 * 
 * elements : array of objects format object : {id, label, value, status}
 * 
 * */
export default function(elements, properties){
	if(elements.length <= 0 ) return false;
	let  id, cls, container;
	if(properties){
		id = (properties.id)?properties.id:'grvdropdown-'+moment().unix();
		cls = (properties.class)?properties.class:'grvdropdown';
		container  = (properties.container)?$('.'+properties.container):$('.grvdropdown-container');
	}else{
		id = 'grvdropdown-'+moment().unix();
		cls = 'grvdropdown';
		container = $('.grvdropdown-container');
	}
	let cont = $('<div>',{class:'grvdropdown'}).appendTo(container);
	let f = $('<input>',{type:'hidden',value:'',id:id}).appendTo(cont);
	let c = $('<div>',{class:'grvdropdown-value','tabindex':'0'}).appendTo(cont);
	let clabel = $('<div>',{class:'grvdropdown-value-label'}).appendTo(c);
	let cicon = $('<div>',{class:'grvdropdown-value-icon'}).append($('<i>',{class:'fas fa-caret-down'})).appendTo(c);
	
	let m = $('<ul>',{class:'grvdropdown-menu umbra'}).appendTo(cont);
	let maxw = 0;
	for(var i=0;i<elements.length;i++){
		let element = elements[i];
		let a = 'active';
		if(element.status != 'active'){
			a = '';
		}else{
			f.val(element.value);
			clabel.text(element.label);
		}
		let li = $('<li>',{value:element.value, class:'grvdropdown-item '+a}).append($('<span>').text(element.label)).appendTo(m);
		let lw = li.text().visualLength(li.css('font-size'));
		maxw =  Math.max(maxw, lw);
	}
	
	maxw = Math.max(maxw, c.width());
	m.css('width',maxw+'px');
	c.on('click',function(){
		let p = $(this).parent().position();
		let ultop = $(this).parent().outerHeight(true)+p.top;
		$(this).parent().children('ul')
		$(this).parent().children('ul').css("top",ultop+"px");
		$(this).parent().children('ul').css("left",p.left+"px");
		$(this).parent().children('ul').removeClass('out').addClass('in');
	});
	c.on("blur",function(event){
		setTimeout(function(obj){
			$(obj).siblings('ul').removeClass('in').addClass('out');
		}, 200, this) ;
	});
	
	m.on('click','li',function(event){
		$(this).addClass('active').siblings().removeClass('active');
		$(this).parent().siblings('input').val($(this).attr('value'));
		$(this).parent().siblings('.grvdropdown-value').children('.grvdropdown-value-label').text($(this).find('span').text());
		$(this).parent().removeClass('in').addClass("out");
		$(this).parent().siblings('input').trigger('change');
	});
	
	return cont;
}