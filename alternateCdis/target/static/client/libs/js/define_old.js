import './../jquery/jq.js'
import * as nav from './navigation.js'

export let page = nav.getPage();
export let applanguage="en";
export let userObj = null;
export let userProfileObj = null;
export let sid = nav.getParameterByName("sid");
export let patientObj = null;
export let patientObjArray = null;
export let messagesArray = null;
export let patientSearchObj = null;
export let backArray = [];
export let backArrayIndex = 0;
export let $body = $("body");
//export let usersArray = getUsers();
//export let userNotes = getUserNotes(sid);
export let containerApp = $('#grvWraper');
export let isDemo=false;
export let progressOn=false;
export let populationEI = {};

export let dbp_dec=0;
export let sbp_dec=0;
export let weight_dec=0;
export let aer_dec=0;
export let height_dec=0;
export let smoke_dec=0;
export let hipo_dec=0;
export let hba1c_dec=3;
export let acglu_dec=1;
export let acratio_dec=1;
export let crea_dec=2;
export let crcl_dec=3;
export let prote_dec=2;
export let egfr_dec=1;
export let pcr_dec=1;
export let pcrg_dec=1;
export let tchol_dec=2;
export let tglycer_dec=1;
export let hdl_dec=2;
export let ldl_dec=2;
export let tchdl_dec=2;

export let recomandation_lipid = {'section':"lipid",'recomandations':[{'title':"Guideline",'thumbnail':"recomandation_lipid_thumbnail.png",'source':"recomandation.lipid.html"}]} ;
//export let recomandation_patient ={'section':"patient",'recomandations':[{'title':"Guideline",'thumbnail':"recomandation_patient_thumbnail.png",'source':"recomandation.patient.html"},{'title':"Stages CKD",'thumbnail':"recomandation_ckd_thumbnail.png",'source':"recomandation.ckd.html"},{'title':"A1C Conversion Table",'thumbnail':"recomandation_renal_thumbnail.png",'source':"recomandation.renal.html"}]} ;
export let recomandation_patient ={'section':"patient",'recomandations':[{'title':"Guideline",'thumbnail':"recomandation_patient_thumbnail.png",'source':"recomandation.patient.html"},{'title':"A1C Conversion Table",'thumbnail':"recomandation_renal_thumbnail.jpg",'source':"recomandation.renal.html"},{'title':"Antihyperglycemic Agents and Renal Functions",'thumbnail':"recomandation_renalfunctions_thumbnail.jpg?_20240520",'source':"recomandation.renalfunction.html"}]} ;
export let recomandation_lab = {'section':"lab",'recomandations':[{'title':"Targets for glycemic control",'thumbnail':"recomandation_lab_thumbnail.jpg?_20230603",'source':"recomandation.lab.html"},{'title':"A1C Conversion Table",'thumbnail':"recomandation_renal_thumbnail.jpg",'source':"recomandation.renal.html"}]} ;;
export let recomandation_depression={'section':"depression",'recomandations':[{'title':"Happiness scale",'thumbnail':"recomandation_happiness_thumbnail.png",'source':"recomandation.happiness.html"},{'title':"PHQ-2",'thumbnail':"recomandation_phq2_thumbnail.png",'source':"recomandation.phq2.html"},{'title':"PHQ-9",'thumbnail':"recomandation_phq9_thumbnail.png",'source':"recomandation.phq9.html"}]} ;;
export let recomandation_renal = {'section':"renal",'recomandations':[{'title':"CKD Stages",'thumbnail':"recomandation_ckd_thumbnail.jpg?_20240520",'source':"recomandation.ckd.html"},{'title':"Antihyperglycemic Agents and Renal Functions",'thumbnail':"recomandation_renalfunctions_thumbnail.jpg?_20240520",'source':"recomandation.renalfunction.html"}]} ;
export let recomandation_mdvisits = {'section':"mdvisits",'recomandations':[{'title':"Monofilament Diagram",'thumbnail':"recomandation_monofilament_thumbnail.jpg",'source':"recomandation.monofilament.html"},{'title':"Diabetic foot screen Step 1",'thumbnail':"recomandation_foot_thumbnail.png",'source':"recomandation.foot.html"},{'title':"Diabetic foot screen Step 2 and Step 3",'thumbnail':"recomandation_foot2_thumbnail.png",'source':"recomandation.foot2.html"}]} ;
/*
 * *
 * data labels
 * 
 */

export let smoke=["Unknown","Yes","No"];
export let psyco=["Unknown","Yes","No"];
export let depr=["Unknown","Yes","No"];
export let foot = ["Not done","Done","Unknown"];
export let neuromd=["No","Yes"];
export let orala=["No","Yes"];
export let insulin=["No","Yes"];
export let acei=["No","Yes"];
export let statin=["No","Yes"];
export let asa=["No","Yes"];
export let role=["Please Select","ADMIN","USER","GUEST"];
export let dtype=["Unknown","Type 1 DM","Type 2 DM","PRE DM","GDM","Miyupimaatsiiun"];
export let community=["Please Select","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui","Not living in EI"];
export let report_idcommunity=["All","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui","Not living in EI"];
export let creport_idcommunity=["Please select","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui"];
export let report_dtype=["All","Type 1 DM","Type 2 DM","PRE DM","GDM","Miyupimaatsiiun"];
export let creport_dtype=["Please select","Type 1 DM","Type 2 DM","PRE DM","GDM"];
export let report_sex=["All","Male","Female"];
export let creport_sex=["Please select","Male","Female"];
export let report_select_operator=["","equal"];
export let report_date_operator=["","equal","starting","until","between"];
export let report_value_operator=["","equal","more than","less than","between"];
export let report_sections=["Please Choose","Lab", "Renal", "Lipid", "Complications"];
export let report_sections_Lab=["Please Choose","Lab Collected Date","HbA1c", "Fasting Glucose", "OGTT"];
export let report_sections_Renal=["Please Choose","Renal Collected Date","AC Ratio", "Serum Creatinine", "Creatinine Cleareance","Urine proteins 24Hr","eGFR"];
export let report_sections_Lipid=["Please Choose","Lipid Collected Date","Total Cholesterol","Tryglicerides","HDL","LDL-c","TC/HDL-c"];
export let report_sections_Complications=["Retinopathy","Laser Teraphy","Legal Blindness","Microalbuminuria","Macroalbuminuria","Renal Failure","Dialysis","Neuropathy","Foot Ulcer","Amputation","Impotence","Coronary artery disease","Cerebrovascular disease","Peripheral disease"];
export let report_value_operators=["more","less","equal","between"];
export let report_date_operators=["starting","until","equal","between"];
export let report_select_operators=["equal"];
export let report_profession=["None","CHR","MD","Nurse","Nutritionist"];
export let report_dp=["last 6 months","last 12 months","last 2 years","last 5 years"];
export let tool_idcommunity=["All Communities","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui"];
/*LABELS*/
export let label_ramq="RAMQ";
export let label_chart="Chart Number";
export let label_idpatient="ID Patient";
export let label_giu="IPM";
export let label_jbnqa="JBNQA";
export let label_fname="First Name";
export let label_lname="Last Name";
export let label_sex="Gender";
export let label_dob="Date of birth";
export let label_mfname="Mother First Name";
export let label_mlname="Mother Last Name";
export let label_pfname="Father First Name ";
export let label_plname="Father Last Name";
export let label_address="Address";
export let label_city="City";
export let label_idprovince="ID Province";
export let label_postalcode="Postal Code";
export let label_dod="Date of death";
export let label_idcommunity="Community";
export let label_iscree="Cree";
export let label_band="Band number";
export let label_consent="Consent";
export let label_death_cause="Death Cause";
export let label_dtype="Type of diabetes";
export let label_dtype_collected_date="Type of diabetes date of diagnosys";

/*MDVISITS VALUES*/
//sbp
export let label_sbp="SBP";
export let label_sbp_collected_date="Date";
export let type_sbp='table';
export let unit_sbp='mmHg';
export let section_sbp='mdvisits';
export let limits_sbp={maxvalue:130,minvalue:100,stages:[{title:"SBP > 130",min:130,max:180,color:"rgba(255,0,0,0.4)"},{title:"Normal",min:100,max:130,color:"rgba(0, 255, 0,0.3)"}]};
//dbp
export let label_dbp="DBP";
export let label_dbp_collected_date="Date";
export let type_dbp='table';
export let unit_dbp='mmHg';
export let section_dbp='mdvisits';
export let limits_dbp={maxvalue:80,minvalue:50,stages:[{title:"DBP > 80",min:80,max:100,color:"rgba(255,0,0,0.4)"},{title:"Normal",min:50,max:80,color:"rgba(0, 255, 0,0.3)"}]};
//sbp_and_dbp
export let label_sbp_and_dbp="SBP/DBP";
export let label_sbp_and_dbp_collected_date="Date";
export let type_sbp_and_dbp='table';
export let unit_sbp_and_dbp='mmHg';
export let section_sbp_and_dbp='mdvisits_and_mdvisits';
//weight
export let label_weight_collected_date=" Date";
export let label_weight="Weight";
export let type_weight='table';
export let unit_weight='Kg';
export let section_weight='mdvisits';
//height
export let label_height_collected_date=" Date";
export let label_height="Height";
export let type_height='table';
export let unit_height='Cm';
export let section_height='mdvisits';
//hipo
export let label_hipo_collected_date="Date";
export let label_hipo="Hypoglycemia";
export let type_hipo='table';
export let unit_hipo='Episodes/Month';
export let section_hipo='mdvisits';
//foot
export let label_foot_collected_date="Date";
export let label_foot="Visual foot exam";
export let type_foot='single';
export let unit_foot='';
export let section_foot='mdvisits';
export let trigger_foot={'value':"neuro",'field':"date",'section':"complications",'conditionfield':"value",'conditionvalue':"1",'conditionresult':"date"};
//smoke
export let label_smoke="Smoker";
export let label_smoke_collected_date="Date";
export let type_smoke='table';
export let unit_smoke='';
export let section_smoke='mdvisits';
//aer
export let label_aer="Physical Activity";
export let label_aer_collected_date="Date";
export let type_aer='table';
export let unit_aer='Minutes/Week';
export let section_aer='mdvisits';
//neuromd
export let label_neuromd="10 g Monofilament";
export let label_neuromd_collected_date="Date";
export let type_neuromd='single';
export let unit_neuromd='';
export let section_neuromd='mdvisits';
export let trigger_neuromd={'value':"neuro",'field':"date",'section':"complications",'conditionfield':"value",'conditionvalue':"1",'conditionresult':"date"};
//rpathscr
export let label_rpathscr="Rethinopaty Screening";
export let label_rpathscr_collected_date="Date of exam";
export let type_rpathscr="single";
export let unit_rpathscr='';
export let section_rpathscr='mdvisits';
export let trigger_rpathscr={'value':"reti",'field':"date",'section':"complications",'conditionfield':"value",'conditionvalue':"1",'conditionresult':"date"};

/*LAB VALUES*/
//hba1c
export let label_hba1c="HbA1c";
export let label_hba1c_collected_date="Date";
export let type_hba1c='graph';
export let unit_hba1c='Percentage or Absolute value';
export let section_hba1c='lab';
export let limits_hba1c={maxvalue:0.085,minvalue:0.055,stages:[{title:"HbA1C > 7%",min:0.07,max:0.085,color:"rgba(255,0,0,0.4)"},{title:"Target HbA1C 7%",min:0.06,max:0.07,color:"rgba(0, 255, 0,0.3)"},{title:"Normal HbA1C < 6%",min:0.055,max:0.06,color:"rgba(0, 255, 0,0.6)"}]};
//ogtt
export let label_ogtt="OGTT";
export let label_ogtt_collected_date="Date";
export let type_ogtt='graph';
export let unit_ogtt='';
export let section_ogtt='lab';
//acglu
export let label_acglu="Fasting Glucose";
export let label_acglu_collected_date="Date";
export let type_acglu='graph';
export let unit_acglu='mg/dL';
export let section_acglu='lab';
export let limits_acglu={maxvalue:15,minvalue:7,stages:[{title:"Fasting Glucose > 7",min:7,max:15,color:"rgba(255,0,0,0.4)"},{title:"Target Fasting Glucose  7",min:6,max:7,color:"rgba(0, 255, 0,0.3)"},{title:"Normal Fasting Glucose < 6",min:5,max:6,color:"rgba(0, 255, 0,0.6)"}]};

/*RENAL VALUES*/
//acratio_or_pcrg
export let type_acratio_or_pcrg = 'graph';
export let section_acratio_or_pcrg='renal_or_renal';
//acratio
export let label_acratio="AC Ratio";
export let label_acratio_collected_date="Date";
export let type_acratio='graph';
export let unit_acratio='mg/mmol';
export let section_acratio='renal';
export let limits_acratio={maxvalue:20,minvalue:1,stages:[{title:"AC Ratio > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"Ac Ratio < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//crea
export let label_crea="Serum Creatinine";
export let label_crea_collected_date="Serum Creatinine Date";
export let type_crea="graph";
export let unit_crea='mmol/L';
export let section_crea='renal';
export let limits_crea={maxvalue:150,minvalue:50,stages:[]};
//crcl
export let label_crcl="Creatinine Clearence";
export let label_crcl_collected_date="Date";
export let type_crcl='graph';
export let unit_crcl='ml/sec';
export let section_crcl='renal';
//prote
export let label_prote="Urine proteins 24hr";
export let label_prote_collected_date="Date";
export let type_prote='graph';
export let unit_prote='g/day';
export let section_prote='renal';
//egfr
export let label_egfr="eGFR";
export let label_egfr_collected_date="Date";
export let type_egfr='graph';
export let unit_egfr='ml/min';
export let section_egfr='renal';
export let limits_egfr={maxvalue:100,minvalue:5,stages:[{title:"",min:90,max:100,color:"rgba(0,255,0,0.3)"},{title:"",min:60,max:90,color:"rgba(0,255,0,0.3)"},{title:"STAGE 3",min:30,max:60,color:"rgba(255, 123, 15,0.5)"},{title:"STAGE 4",min:15,max:30,color:"rgba(255, 0, 0,0.3)"},{title:"STAGE 5",min:5,max:15,color:"rgba(255, 0, 0,0.4)"}]};
//pcr
export let label_pcr="PCR";
export let label_pcr_collected_date="Date";
export let type_pcr='graph';
export let unit_pcr='mg/mmol';
export let section_pcr='renal';
export let limits_pcr={maxvalue:20,minvalue:1,stages:[{title:"PCR > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"PCR < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//pcrg
export let label_pcrg="PCR";
export let label_pcrg_collected_date="Date";
export let type_pcrg='graph';
export let unit_pcrg='g/g';
export let section_pcrg='renal';
export let limits_pcrg={maxvalue:20,minvalue:1,stages:[{title:"PCR > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"PCR < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};


/*LIPIDS VALUES*/
//tchol
export let label_tchol="Total Cholesterol";
export let label_tchol_collected_date="Date";
export let type_tchol='graph';
export let unit_tchol='mmol/L';
export let section_tchol='lipid';
export let limits_tchol={maxvalue:9.9,minvalue:2,stages:[]};
//tglycer
export let label_tglycer="Triglycerides";
export let label_tglycer_collected_date="Date";
export let type_tglycer='graph';
export let unit_tglycer='mmol/L';
export let section_tglycer='lipid';
export let limits_tglycer={maxvalue:3,minvalue:1,stages:[{title:"Triglycerides > 2",min:2,max:3,color:"rgba(255,0,0,0.4)"},{title:"Triglycerides < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//hdl
export let label_hdl="HDL";
export let label_hdl_collected_date="Date";
export let type_hdl='graph';
export let unit_hdl='mmol/L';
export let section_hdl='lipid';
export let limits_hdl={maxvalue:2,minvalue:0.5,stages:[{title:"HDL > 1",min:1,max:2,color:"rgba(0, 255, 0,0.3)"},{title:"HDL < 1",min:0.5,max:1,color:"rgba(255,0,0,0.4)"}]};
//ldl
export let label_ldl="LDL";
export let label_ldl_collected_date="Date";
export let type_ldl='graph';
export let unit_ldl='mmol/L';
export let section_ldl='lipid';
export let limits_ldl={maxvalue:5,minvalue:1,stages:[{title:"LDL > 2",min:2,max:5,color:"rgba(255,0,0,0.4)"},{title:"Target LDL < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//tchdl
export let label_tchdl="TC/HDL-c";
export let label_tchdl_collected_date="Date";
export let type_tchdl='graph';
export let unit_tchdl='';
export let section_tchdl='lipid';


/*COMPLICATIONS VALUES*/
//reti
export let label_reti="Any Retinopathy";
export let label_reti_collected_date="Date";
export let type_reti='single';
export let unit_reti='';
export let section_reti='complications';
//lther
export let label_lther="Laser Therapy";
export let label_lther_collected_date="Date";
export let type_lther='single';
export let unit_lther='';
export let section_lther='complications';
//lblind
export let label_lblind="Legal Blindness";
export let label_lblind_collected_date="Date";
export let type_lblind='single';
export let unit_lblind='';
export let section_lblind='complications';
//micro
export let label_micro="Microalbuminuria (ACR 2-30)";
export let label_micro_collected_date="Date";
export let type_micro='single';
export let unit_micro='';
export let section_micro='complications';
//macro
export let label_macro="Overt proteinuria (ACR > 30)";
export let label_macro_collected_date="Date";
export let type_macro='single';
export let unit_macro='';
export let section_macro='complications';
//renf
export let label_renf="Renal Failure (GFR < 60)";
export let label_renf_collected_date="Date";
export let type_renf='single';
export let unit_renf='';
export let section_renf='complications';
//dial
export let label_dial="Dialysis";
export let label_dial_collected_date="Date";
export let type_dial='single';
export let unit_dial='';
export let section_dial='complications';
//rplant
export let label_rplant="Renal Transplant";
export let label_rplant_collected_date="Date";
export let type_rplant='single';
export let unit_rplant='';
export let section_rplant='complications';
//neuro
export let label_neuro="Any Neuropathy";
export let label_neuro_collected_date="Date";
export let type_neuro='single';
export let unit_neuro='';
export let section_neuro='complications';
//fulcer
export let label_fulcer="Foot Ulcer";
export let label_fulcer_collected_date="Date";
export let type_fulcer='single';
export let unit_fulcer='';
export let section_fulcer='complications';
//amput
export let label_amput="Amputation";
export let label_amput_collected_date="Date";
export let type_amput='single';
export let unit_amput='';
export let section_amput='complications';
//cad
export let label_cad="Coronary Arthery Disease";
export let label_cad_collected_date="Date";
export let type_cad='single';
export let unit_cad='';
export let section_cad='complications';
//cvd
export let label_cvd="Cerebrovascular Disease";
export let label_cvd_collected_date="Date";
export let type_cvd='single';
export let unit_cvd='';
export let section_cvd='complications';
//pvd
export let label_pvd="Peripheral Disease";
export let label_pvd_collected_date="Date";
export let type_pvd='single';
export let unit_pvd='';
export let section_pvd='complications';
//impot
export let label_impot="Erectile Dysfunction";
export let label_impot_collected_date="Date";
export let type_impot='single';
export let unit_impot='';
export let section_impot='complications';

/*MEDS VALUES*/
//orala
export let label_orala="Oral Agents";
export let label_orala_collected_date="Date";
export let type_orala='table';
export let unit_orala='';
export let section_orala='meds';
//insulin
export let label_insulin="Insulin";
export let label_insulin_collected_date="Date";
export let type_insulin='table';
export let unit_insulin='';
export let section_insulin='meds';
//acei
export let label_acei="ACEi/ARB";
export let label_acei_collected_date="Date";
export let type_acei='table';
export let unit_acei='';
export let section_acei='meds';
//statin
export let label_statin="Statin";
export let label_statin_collected_date="Date";
export let type_statin='table';
export let unit_statin='';
export let section_statin='meds';
//asa
export let label_asa="Asa";
export let label_asa_collected_date="Date";
export let type_asa='table';
export let unit_asa='';
export let section_asa='meds';

/*DEPRESSION SCREEN VALUES*/
//deps
export let label_deps="Depression Screen [PHQ-2]";
export let label_deps_collected_date="Date";
export let type_deps='single';
export let unit_deps='Score';
export let section_deps='depression';
//score
export let label_score="Depression Screen [PHQ-9]";
export let label_score_collected_date="Date";
export let type_score='single';
export let unit_score='Score';
export let section_score='depression';

/*MISCELLANEOUS VACCINATIONS VALUES*/
//dophta
export let label_dophta="Ophthalmology";
export let label_dophta_collected_date="Date";
export let type_dophta='single';
export let unit_dophta='';
export let section_dophta='miscellaneous';
//dinflu
export let label_dinflu="Influenza";
export let label_dinflu_collected_date="Date";
export let type_dinflu='single';
export let unit_dinflu='';
export let section_dinflu='miscellaneous';
//dpneu
export let label_dpneu="Pneumococcal";
export let label_dpneu_collected_date="Date";
export let type_dpneu='single';
export let unit_dpneu='';
export let section_dpneu='miscellaneous';
//dppd
export let label_dppd="PPD Screening Date";
export let label_dppd_collected_date="Date";
export let type_dppd='single';
export let unit_dppd='';
export let section_dppd='miscellaneous';
//ppd
export let label_ppd="PPD";
export let label_ppd_collected_date="Date";
export let type_ppd='table';
export let unit_ppd='';
export let section_ppd='miscellaneous';
//inh
export let label_inh="INH";
export let label_inh_collected_date="Date";
export let type_inh='table';
export let unit_inh='';
export let section_inh='miscellaneous';




export let mdvisits_title = "Clinical visits";
export let lab_title = "Glucose Control";
export let renal_title = "Renal ";
export let lipid_title = "Lipids";
export let complications_title = "Complications";
export let meds_title = "Medication";
export let miscellaneous_title = "Vaccinations";
export let depression_title = "Depression Screening";
export let complications_groups = [["reti","lther", "lblind"],["micro","macro", "renf", "dial","rplant"],["neuro","fulcer","amput"],["cad","cvd","pvd","impot"]];
export let complications_groups_names = ["Retinopathy","Nephropathy","Neuropathy","Macrovascular"];
export let profession_array = [["chr","PCCR"],["md","MD"],["nur","Nurse"],["nut","Nutritionist"]];
export let profession_object = {"chr":"PCCR","md":"MD","nur":"Nurse","nut":"Nutritionist"};
export let profession_dbindex={"chr":"4","md":"1","nur":"2","nut":"3"};
export let profession_index={"4":"chr","1":"md","2":"nur","3":"nut"};
export let profession_code_array = ["chr","md","nur","nut"];

export let neuromd_values={"0":"Normal","1":"Abnormal"};
export let smoke_values={"0":"No","1":"Yes","2":"Unknown"};
export let foot_values={"0":"Normal","1":"Abnormal"};
export let rpathscr_values={"0":"Normal","1":"Abnormal"};
export let rpathscr_datelabel="Date of exam";
export let dial_datelabel="Date dialysis start";
export let psyco_values={"0":"No","1":"Yes"};
export let depr_values={"0":"No","1":"Yes"};
export let orala_values={"0":"No","1":"Yes"};
export let insulin_values={"0":"No","1":"Yes"};
export let acei_values={"0":"No","1":"Yes"};
export let statin_values={"0":"No","1":"Yes"};
export let asa_values={"0":"No","1":"Yes"};


