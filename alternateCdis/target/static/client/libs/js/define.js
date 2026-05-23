import * as router from './router.js';

export const appDefine = {
	_t:Date.now(),
	page:router.getSection(),
	appLanguage:"en",
	pageHeight:0,
	criteriaSearchPatientObject:null,
	autocomleteSearchPatientObject:null,
	communities:["All Communities","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui"],
	genders:["All","Male","Female"],
	crees:["Non Cree","Cree"],
	deceases:["No","Yes"],
	diabetes:["Unknown","Type 1 DM","Type 2 DM","PRE DM","GDM","Miyupimaatsiiun"],
	periods:["last 6 months","last 12 months","last 2 years","last 5 years"],
	profession_index:{"4":"chr","1":"md","2":"nur","3":"nut"},
	profession_object:{"chr":"PCCR","md":"MD","nur":"Nurse","nut":"Nutritionist"},
	userObject : null,
	users:[],
	userProfileObject:null,
	userNotes:[],
	sid:router.getParameterByName("sid"),
	isDemo:false,
	progressOn:false,
	datepicker:null,
	grvwidgets:[],
	patientObjectArray:[],
	limits_sbp:{maxvalue:130,minvalue:100,stages:[{title:"SBP > 130",min:130,max:180,color:"rgba(255,0,0,0.4)"},{title:"Normal",min:100,max:130,color:"rgba(0, 255, 0,0.3)"}]},
	limits_dbp:{maxvalue:80,minvalue:50,stages:[{title:"DBP > 80",min:80,max:100,color:"rgba(255,0,0,0.4)"},{title:"Normal",min:50,max:80,color:"rgba(0, 255, 0,0.3)"}]},
	limits_hba1c:{maxvalue:0.085,minvalue:0.055,stages:[{title:"HbA1C > 7%",min:0.07,max:0.085,color:"rgba(255,0,0,0.4)"},{title:"Target HbA1C 7%",min:0.06,max:0.07,color:"rgba(0, 255, 0,0.3)"},{title:"Normal HbA1C < 6%",min:0.055,max:0.06,color:"rgba(0, 255, 0,0.6)"}]},
	limits_acglu:{maxvalue:15,minvalue:7,stages:[{title:"Fasting Glucose > 7",min:7,max:15,color:"rgba(255,0,0,0.4)"},{title:"Target Fasting Glucose  7",min:6,max:7,color:"rgba(0, 255, 0,0.3)"},{title:"Normal Fasting Glucose < 6",min:5,max:6,color:"rgba(0, 255, 0,0.6)"}]},
	limits_acratio:{maxvalue:20,minvalue:1,stages:[{title:"AC Ratio > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"Ac Ratio < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]},
	limits_crea:{maxvalue:150,minvalue:50,stages:[]},
	limits_egfr:{maxvalue:100,minvalue:5,stages:[{title:"",min:90,max:100,color:"rgba(0,255,0,0.3)"},{title:"",min:60,max:90,color:"rgba(0,255,0,0.3)"},{title:"STAGE 3",min:30,max:60,color:"rgba(255, 123, 15,0.5)"},{title:"STAGE 4",min:15,max:30,color:"rgba(255, 0, 0,0.3)"},{title:"STAGE 5",min:5,max:15,color:"rgba(255, 0, 0,0.4)"}]},
	limits_pcr:{maxvalue:20,minvalue:1,stages:[{title:"PCR > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"PCR < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]},
	limits_pcrg:{maxvalue:20,minvalue:1,stages:[{title:"PCR > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"PCR < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]},
	limits_tchol:{maxvalue:9.9,minvalue:2,stages:[]},
	limits_tglycer:{maxvalue:3,minvalue:1,stages:[{title:"Triglycerides > 2",min:2,max:3,color:"rgba(255,0,0,0.4)"},{title:"Triglycerides < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]},
	limits_hdl:{maxvalue:2,minvalue:0.5,stages:[{title:"HDL > 1",min:1,max:2,color:"rgba(0, 255, 0,0.3)"},{title:"HDL < 1",min:0.5,max:1,color:"rgba(255,0,0,0.4)"}]},
	limits_ldl:{maxvalue:5,minvalue:1,stages:[{title:"LDL > 2",min:2,max:5,color:"rgba(255,0,0,0.4)"},{title:"Target LDL < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]},
	errorCodes:{
		"E01":"ERRAPP-01 Communication error",
		"E02":"ERRAPP-02 Wrong username or password",
		"E03":"ERRAPP-03 Username empty",
		"E04":"ERRAPP-04 Password empty"
	}
}; 




 