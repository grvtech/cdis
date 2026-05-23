import moduleconfig from './config.json' with { type: 'json' };
import {grvdatepicker} from './grvdatepicker.js';
import { shareData } from '../sections/cdis/define.js';

/**
 * predata format is [{question:id,answers:[id,id,id]}]
 * if id answer is not in survey id is the value of answer  
 */

export class grvsurvey{
	static includes = {};
	static survey = {};
	constructor(config, predata=null){
		this.name = "grvsurvey";
		this.id = this.name+"-"+Date.now();
		this.container = $("#"+config.container);
		this.surveyalias = config.surveyid;
		this.surveydata = {};
		this.completeLabel = config.completeLabel;
		this.currentPage = 1;
		this.close = (config.close)?config.close:false;
		if(predata != null)this.predata = predata;
		this.result={idfiller:config.iduser,date:config.date,id:config.surveyid,idpatient:config.idpatient,result:[]};
		this.loadstyle();
		this.loadincludes();
		this.loadsurvey(this.surveyalias);
		this.closeSurveyCallback = config.closeSurveyCallback;
		this.completeSurveyCallback = config.completeSurveyCallback;
		//setTimeout(this.buildSurvey,500);
		
	}
	
	loadstyle(){
	    const link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.href = moduleconfig.path+this.name+".css";
	    document.head.appendChild(link);
	}
	
	loadincludes(){
		$.each(moduleconfig.includes, function(i,mod){
			if(mod.module == "grvsurvey"){
				$.each(mod.libs, async function(j,lib){
					grvsurvey.includes[lib.alias] = await import(lib.file);
				});
			}
		})
	}
	
	loadsurvey(surveyAlias){
		const self = this;
		
		$.each(moduleconfig.includes, function(i,mod){
			if(mod.module == "grvsurvey"){
				$.each(mod.surveys, function(j,lib){
					if(lib.alias == surveyAlias){
						//grvsurvey.survey[lib.alias] = await import(lib.file);
						fetch(lib.file)
						  .then(response => {
						    if (!response.ok) {
						      throw new Error(`HTTP error! status: ${response.status}`);
						    }
						    return response.json(); // Parses the response body as JSON
						  })
						  .then(data => {
							//console.log("data");
						    //console.log(data); // 'data' is now a JavaScript object
							self.surveydata = data;
							self.buildSurvey();
						  })
						  .catch(error => {
						    console.error('Error fetching JSON:', error);
						  });
					}
				});
			}
		})
		//this.survey = grvsurvey.survey;
	}
	
	buildSurvey(){
		
		const self = this;
		console.log("survey data")
		console.log(this.surveydata)
		const container = $("<div>",{class:"grvsurvey-container",id:this.id}).appendTo(this.container);
		
		const header = $("<div>",{class:"grvsurvey-header"}).appendTo(container);
		$("<span>",{class:"title"}).text(this.surveydata.title).appendTo(header);
		let t = (this.surveydata.pages.length > 1)?"Page <span class='pagenumber'>1</span> of "+this.surveydata.pages.length+" pages":"Page 1";
		$("<label>").html(t).appendTo(header);
		
		const body = $("<div>",{class:"grvsurvey-body"}).appendTo(container);
		const footer = $("<div>",{class:"grvsurvey-footer"}).appendTo(container);
		if(!this.close){
			$("<div>",{class:"cdisCisButton"}).html("&times;").appendTo(footer).on("click",{self:self},self.closeSurvey);	
		}else{
			$("<div>").appendTo(footer);
		}
		
		const buttons = $("<div>",{class:"buttons"})
			.appendTo(footer)
			.append($("<div>",{class:"prev"}))
			.append($("<div>",{class:"next"}));
		
		
		$.each(this.surveydata.pages, function(i, page){
			let pageNumber = i+1;
			const pageContainer = $("<div>",{class:"page",id:page.id,number:pageNumber}).appendTo(body);
			$("<div>",{class:"title"}).html(page.title).appendTo(pageContainer);
			$("<div>",{class:"context"}).html(page.context).appendTo(pageContainer);
			const questionsContainer = $("<div>",{class:"questions"}).appendTo(pageContainer);
			$.each(page.questions, function(j,question){
				const questionContainer = $("<div>",{class:"question "+question.direction, id:question.id, type:question.type}).appendTo(questionsContainer);
				let q = $("<div>",{class:"text"}).text(question.question).appendTo(questionContainer);
				if(question.question == "")q.css("height","0px");
				const answersContainer = $("<div>",{class:"answers "+question.direction}).appendTo(questionContainer);
				let atypeclass = "";
				if(question.type == "checkbox") atypeclass = "fa-regular fa-square-check";
				if(question.type == "radio") atypeclass = "fa-solid fa-circle-dot";
				if(question.type == "text") atypeclass = "";
				$.each(question.answers, function(k,answer){
					if(answer.type == "text"){
						$("<div>",{class:"answer "+question.type, id:answer.id, idvalue:0})
						.append($("<div>",{class:"answer-text "}).html(answer.label).css("width",(answer.label.length * 8)+"px"))
						.append($("<div>").css("width",answer.width+"px").css("height","30px")
									.append(
										$("<input>",{class:"answer-input "})
										.on("blur",function(){
											if($(this).val() != ""){
												$(this).parent().siblings(".answer-type").addClass("selected");
											}else{
												$(this).parent().siblings(".answer-type").removeClass("selected");
											} 
										})
									)
						).appendTo(answersContainer)
						.on("click",{"answer":answer,"question":question},self.selectAnswer);
						if(self.predata){
							$.each(self.predata,function(ii, aa){
								if(aa.question == question.id){
									$("#"+answer.id+" input").val(aa.answers[0]);
									$("#"+answer.id).attr("idvalue",aa.idvalue);
									$("#"+answer.id).addClass("selected");
								}
							})
						}
					}else if(answer.type == "grvdatepicker"){
						$("<div>",{class:"answer "+question.type, id:answer.id, idvalue:0})
						.append($("<div>",{class:"answer-text "}).html(answer.label).css("width",(answer.label.length * 8)+"px"))
						.append(
							$("<div>").append($("<div>")
													.css("width",answer.width+"px")
													.css("display","grid")
													.css("grid-template-columns","auto 25px")
													.css("background","#ddd")
													.append($("<input>",{class:"answer-input",id:answer.id+"-input"}))
													.append($("<i>",{class:"fa fa-calendar"}).css("line-height","25px").css("padding","3px"))
										)
						
						)
						.appendTo(answersContainer)
						.on("click",{"answer":answer,"question":question},self.selectAnswer);
						
						let dd = null;
						if(self.predata){
							$.each(self.predata,function(ii, aa){
								if(aa.question == question.id){
									dd = {defaultDate:aa.answers[0]};
									$("#"+answer.id).attr("idvalue",aa.idvalue);
									$("#"+answer.id).addClass("selected");
								}
							})
						}
						const bpdate= new grvdatepicker($("#"+answer.id+"-input"),dd);
						shareData.datepickers.push({name:self.surveyalias,object:bpdate});
						
					}else{
						$("<div>",{class:"answer "+question.type, id:answer.id, idvalue:0})
						.append($("<div>",{class:"answer-type "+answer.type}).append($("<i>",{class:atypeclass})))
						.append($("<div>",{class:"answer-text "}).html(answer.answer))
						.appendTo(answersContainer)
						.on("click",{"answer":answer,"question":question},self.selectAnswer);
						if(self.predata){
							$.each(self.predata,function(ii, aa){
								if(aa.question == question.id){
									$("#"+answer.id).attr("idvalue",aa.idvalue);
									if(question.type == "checkbox"){
										$.each(aa.answers,(jj,bb)=>{
											if(answer.answer == bb ){
												$("#"+answer.id).addClass("selected");
												$("#"+answer.id+" .answer-type").addClass("selected");
												$("#"+answer.id).attr("value",answer.value);
											}		
										})
									}else{
										if(answer.answer == aa.answers[0] ){
											$("#"+answer.id).addClass("selected");
											$("#"+answer.id+" .answer-type").addClass("selected");
											$("#"+answer.id).attr("value",answer.value);
										}
									}
								}
							}); //end each 
						}	
					}
				});
			});
		});
		if(this.surveydata.conclusion){
			const conclusion = $("<div>",{class:"page",id:this.id+"-conclusion"}).appendTo(body);
			$("<div>",{class:"title"}).html(this.surveydata.conclusion.title).appendTo(conclusion);
			$("<div>",{class:"context"}).html(this.surveydata.conclusion.context).appendTo(conclusion);
			
		}
		if(this.surveydata.pages.length > 1){
			$('[number="'+this.currentPage+'"]').css("display","block");
			$("<div>",{class:"cdisCisButton"}).text("Next").appendTo(buttons.find("div.next")).on("click",{self:self},self.nextPage);
		}else{
			$('[number="'+this.currentPage+'"]').css("display","block");
			let c  = buttons.find("div.next");
			$("<div>",{class:"cdisCisButton"}).text(self.completeLabel).appendTo(c).on("click",{self:self},self.complete);
		}
		
 	}
	
	closeSurvey(event){
		const self = event.data.self;
		if(!self.close){
			let n = $("#"+self.id).parent().attr("id");
			$("#"+self.id).remove();
			self.closeSurveyCallback(n);
			$.each(shareData.datepickers,(i,dp)=>{if(dp.name == self.surveyalias){dp.object.destroy();shareData.datepickers.splice(i,1);}});	
		}
		
	}
	
	closeSurveyCallback(){
		this.closeSurveyCallback();
	}
	
	
	prevPage(event){
		const self = event.data.self;
		$('#'+self.id+' div [number="'+self.currentPage+'"]').hide();
		self.currentPage--;
		$('#'+self.id+' div [number="'+self.currentPage+'"]').show();
		$("#"+self.id+" .grvsurvey-header label .pagenumber").text(self.currentPage);
		if(self.currentPage == 1) $(this).hide();
		//add next
		const nextContainer = $("#"+self.id+" .grvsurvey-footer .buttons .next");
		nextContainer.empty();
		$("<div>",{class:"cdisCisButton"}).text("Next").appendTo(nextContainer).on("click",{self:self},self.nextPage);
	}
	
	selectAnswer(event){
		let answer = event.data.answer;
		let question = event.data.question;
		if(question.type == "radio"){
			if(!$("#"+answer.id).hasClass("selected")){
				$("#"+answer.id).siblings().find(".answer-type").removeClass("selected");
				$("#"+answer.id).siblings().removeClass("selected");
				$("#"+answer.id+" .answer-type").addClass("selected");
				$("#"+answer.id).addClass("selected");
				$("#"+answer.id).attr("value", answer.value);
			}
		}else if(question.type == "checkbox"){
			if($("#"+answer.id).hasClass("selected")){
				$("#"+answer.id+" .answer-type").removeClass("selected");
				$("#"+answer.id).removeClass("selected");
			}else{
				$("#"+answer.id+" .answer-type").addClass("selected");
				$("#"+answer.id).addClass("selected");
				$("#"+answer.id).attr("value", answer.value);
			}	
		}else if(question.type == "text"){
			$("#"+answer.id).addClass("selected");
			$("#"+answer.id).attr("value", answer.value);
			$(this).find("input").focus();	
		}
	}
	
	
	nextPage(event){
		const self = event.data.self; 
		$('#'+self.id+' div [number="'+self.currentPage+'"]').hide();
		self.currentPage++;
		$('#'+self.id+' div [number="'+self.currentPage+'"]').show();
		$("#"+self.id+" .grvsurvey-header label .pagenumber").text(self.currentPage);
		if(self.currentPage == self.surveydata.pages.length){
			let c  = $(this).parent(); 
			$(this).hide();
			$("<div>",{class:"cdisCisButton"}).text(self.completeLabel).appendTo(c).on("click",{self:self},self.complete);
		}
		//add previous
		const prevContainer = $("#"+self.id+" .grvsurvey-footer .buttons .prev");
		prevContainer.empty();
		$("<div>",{class:"cdisCisButton"}).text("Prev").appendTo(prevContainer).on("click",{self:self},self.prevPage);
	}
	
	
	complete(event){
		const self = event.data.self;
		console.log(self.surveydata)
		$.each(self.surveydata.pages, function(i, page){
			$.each(page.questions, function(j,question){
				let r = {question:question.id,type:question.type,answers:[]};
				$.each(question.answers, function(k,answer){
					if($("#"+answer.id).hasClass("selected")){
 						/*r.answers.push($("#"+answer.id).attr("idvalue"));*/
						//r.answers.push(answer.id);
						let t = $("#"+answer.id).attr("value");
						if(answer.type == "text" || answer.type == "grvdatepicker"){
							t = $("#"+answer.id+" input").val();
						}
						/*self.result.text.push({id:$("#"+answer.id).attr("idvalue"),text:btoa(t)});*/
						/*self.result.text.push({id:answer.id,idvalue:$("#"+answer.id).attr("idvalue"),text:btoa(t)});*/
						r.answers.push({id:answer.id,idvalue:$("#"+answer.id).attr("idvalue"),text:btoa(t)});
					}
				});
				if(r.answers.length > 0)self.result.result.push(r);
			});
		});
		$("#"+self.id+" .page").hide();
		$("#"+self.id+"-conclusion").show();
		$("#"+self.id+" .grvsurvey-footer .buttons .prev").empty();
		$("#"+self.id+" .grvsurvey-footer .buttons .next").empty();
		self.completeSurveyCallback(self.result);
	}
	
}