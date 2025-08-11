import * as applib from './../../../../js/applib.js';
import * as router from './../../../../js/router.js';
import * as userlib from './../../../../js/userlib.js';
import * as aslib from './apilib.js';
import {grvpopup} from './../../modules/grvpopup.js';
import {grvautocomplete} from './../../modules/grvautocomplete.js';
import {grvlist} from './../../modules/grvlist.js';
import {grvvalidation} from './../../modules/grvvalidation.js';
import sectionconfig from './config.json' with { type: 'json' };
import {shareData} from './define.js'; //define global variables
import {appDefine} from './../../../../js/define.js'; //define global variables


/**
 * PUBLIC FUNCTIONS
 *  */	

export function initPage(){
	
	let configlist = {direction:'h',
						open:0,
						container:"grvList1", 
						elements:[
							{label:'element1',value:'1',active:1},
							{label:'element2',value:'2',active:0},
							{label:'element3',value:'3',active:0},
							{label:'element4',value:'4',active:0},
							{label:'element5',value:'5',active:0}
						]
					}
	
	const l = new grvlist(configlist);
	
	
	let gacconfig = {container:"grvAutocomplete",
		delay:200,
		highlight:true,
		minLenght:1,
		maxHeight:300,
		source:searchPatient
	}
	
	const ac = new grvautocomplete(gacconfig);
}

function searchPatient(query, callback) {
		$.ajax({
			url: "/ncdis/service/data/searchPatient",
			dataType: "json",
			data: {
				criteria: "chart",
				term: query,
				language: appDefine.appLanguage,
				sid: appDefine.sid
			},
			success: function( data ) {
				callback(data.objs);
				/*
				if(appDefine.isDemo){data = demoData(data,"search");}
				return $.map( data.objs, function( item ) {
					return {
						idpatient : item.idpatient,
						lastname : item.lastname,
						firstname : item.firstname,
						chart : item.chart,
						ramq : item.ramq,
						realramq : (appDefine.isDemo)?item.realramq:item.ramq,
						community: item.community,
						giu: item.giu,
						criteria : "chart",
						term : query
					};
				});
				*/
			}
		});
	}