/*
if(location.hostname !== 'localhost' && location.hostname.toLowerCase() !== 'cdis.reg18.rtss.qc.ca'){
	location.replace('https://cdis.reg18.rtss.qc.ca/ncdis');
}else if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
*/
var page = getPage();
var applanguage="en";
var userObj = null;
var userProfileObj = null;
var sid = getParameterByName("sid");
var patientObj = null;
var patientObjArray = null;
var messagesArray = null;
var patientSearchObj = null;
var backArray = [];
var backArrayIndex = 0;
var $body = $("body");
var usersArray = getUsers();
var userNotes = getUserNotes(sid);
var containerApp = $('#wraper');
var isDemo=false;
var progressOn=false;
var populationEI = {};

dbp_dec=0;
sbp_dec=0;
weight_dec=0;
aer_dec=0;
height_dec=0;
smoke_dec=0;
hipo_dec=0;
hba1c_dec=3;
acglu_dec=1;
acratio_dec=1;
crea_dec=2;
crcl_dec=3;
prote_dec=2;
egfr_dec=1;
pcr_dec=1;
pcrg_dec=1;
tchol_dec=2;
tglycer_dec=1;
hdl_dec=2;
ldl_dec=2;
tchdl_dec=2;

var recomandation_lipid = {'section':"lipid",'recomandations':[{'title':"Guideline",'thumbnail':"recomandation_lipid_thumbnail.png",'source':"recomandation.lipid.html"}]} ;
//var recomandation_patient ={'section':"patient",'recomandations':[{'title':"Guideline",'thumbnail':"recomandation_patient_thumbnail.png",'source':"recomandation.patient.html"},{'title':"Stages CKD",'thumbnail':"recomandation_ckd_thumbnail.png",'source':"recomandation.ckd.html"},{'title':"A1C Conversion Table",'thumbnail':"recomandation_renal_thumbnail.png",'source':"recomandation.renal.html"}]} ;
var recomandation_patient ={'section':"patient",'recomandations':[{'title':"Guideline",'thumbnail':"recomandation_patient_thumbnail.png",'source':"recomandation.patient.html"},{'title':"A1C Conversion Table",'thumbnail':"recomandation_renal_thumbnail.jpg",'source':"recomandation.renal.html"},{'title':"Antihyperglycemic Agents and Renal Functions",'thumbnail':"recomandation_renalfunctions_thumbnail.jpg?_20240520",'source':"recomandation.renalfunction.html"}]} ;
var recomandation_lab = {'section':"lab",'recomandations':[{'title':"Targets for glycemic control",'thumbnail':"recomandation_lab_thumbnail.jpg?_20230603",'source':"recomandation.lab.html"},{'title':"A1C Conversion Table",'thumbnail':"recomandation_renal_thumbnail.jpg",'source':"recomandation.renal.html"}]} ;;
var recomandation_depression={'section':"depression",'recomandations':[{'title':"Happiness scale",'thumbnail':"recomandation_happiness_thumbnail.png",'source':"recomandation.happiness.html"},{'title':"PHQ-2",'thumbnail':"recomandation_phq2_thumbnail.png",'source':"recomandation.phq2.html"},{'title':"PHQ-9",'thumbnail':"recomandation_phq9_thumbnail.png",'source':"recomandation.phq9.html"}]} ;;
var recomandation_renal = {'section':"renal",'recomandations':[{'title':"CKD Stages",'thumbnail':"recomandation_ckd_thumbnail.jpg?_20240520",'source':"recomandation.ckd.html"},{'title':"Antihyperglycemic Agents and Renal Functions",'thumbnail':"recomandation_renalfunctions_thumbnail.jpg?_20240520",'source':"recomandation.renalfunction.html"}]} ;
var recomandation_mdvisits = {'section':"mdvisits",'recomandations':[{'title':"Monofilament Diagram",'thumbnail':"recomandation_monofilament_thumbnail.jpg",'source':"recomandation.monofilament.html"},{'title':"Diabetic foot screen Step 1",'thumbnail':"recomandation_foot_thumbnail.png",'source':"recomandation.foot.html"},{'title':"Diabetic foot screen Step 2 and Step 3",'thumbnail':"recomandation_foot2_thumbnail.png",'source':"recomandation.foot2.html"}]} ;
/*
 * *
 * data labels
 * 
 */

smoke=["Unknown","Yes","No"];
psyco=["Unknown","Yes","No"];
depr=["Unknown","Yes","No"];
foot = ["Not done","Done","Unknown"];
neuromd=["No","Yes"];
orala=["No","Yes"];
insulin=["No","Yes"];
acei=["No","Yes"];
statin=["No","Yes"];
asa=["No","Yes"];
role=["Please Select","ADMIN","USER","GUEST"];
dtype=["Unknown","Type 1 DM","Type 2 DM","PRE DM","GDM","Miyupimaatsiiun"];
community=["Please Select","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui","Not living in EI"];
report_idcommunity=["All","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui","Not living in EI"];
report_dtype=["All","Type 1 DM","Type 2 DM","PRE DM","GDM","Miyupimaatsiiun"];
report_sex=["All","Male","Female"];
report_select_operator=["","equal"];
report_date_operator=["","equal","starting","until","between"];
report_value_operator=["","equal","more than","less than","between"];
report_sections=["Please Choose","Lab", "Renal", "Lipid", "Complications"];
report_sections_Lab=["Please Choose","Lab Collected Date","HbA1c", "Fasting Glucose", "OGTT"];
report_sections_Renal=["Please Choose","Renal Collected Date","AC Ratio", "Serum Creatinine", "Creatinine Cleareance","Urine proteins 24Hr","eGFR"];
report_sections_Lipid=["Please Choose","Lipid Collected Date","Total Cholesterol","Tryglicerides","HDL","LDL-c","TC/HDL-c"];
report_sections_Complications=["Retinopathy","Laser Teraphy","Legal Blindness","Microalbuminuria","Macroalbuminuria","Renal Failure","Dialysis","Neuropathy","Foot Ulcer","Amputation","Impotence","Coronary artery disease","Cerebrovascular disease","Peripheral disease"];
report_value_operators=["more","less","equal","between"];
report_date_operators=["starting","until","equal","between"];
report_select_operators=["equal"];
report_profession=["None","CHR","MD","Nurse","Nutritionist"];
report_dp=["last 6 months","last 12 months","last 2 years","last 5 years"];
tool_idcommunity=["All","Chisasibi","Eastmain","Mistissini","Nemaska","Oujebougoumou","Waskaganish","Waswanipi","Wemindji","Whapmagoostui"];
/*LABELS*/
label_ramq="RAMQ";
label_chart="Chart Number";
label_idpatient="ID Patient";
label_giu="IPM";
label_jbnqa="JBNQA";
label_fname="First Name";
label_lname="Last Name";
label_sex="Gender";
label_dob="Date of birth";
label_mfname="Mother First Name";
label_mlname="Mother Last Name";
label_pfname="Father First Name ";
label_plname="Father Last Name";
label_address="Address";
label_city="City";
label_idprovince="ID Province";
label_postalcode="Postal Code";
label_dod="Date of death";
label_idcommunity="Community";
label_iscree="Cree";
label_band="Band number";
label_consent="Consent";
label_death_cause="Death Cause";
label_dtype="Type of diabetes";
label_dtype_collected_date="Type of diabetes date of diagnosys";

/*MDVISITS VALUES*/
//sbp
label_sbp="SBP";label_sbp_collected_date="Date";type_sbp='table';unit_sbp='mmHg';section_sbp='mdvisits';
limits_sbp={maxvalue:130,minvalue:100,stages:[{title:"SBP > 130",min:130,max:180,color:"rgba(255,0,0,0.4)"},{title:"Normal",min:100,max:130,color:"rgba(0, 255, 0,0.3)"}]};
//dbp
label_dbp="DBP";label_dbp_collected_date="Date";type_dbp='table';unit_dbp='mmHg';section_dbp='mdvisits';
limits_dbp={maxvalue:80,minvalue:50,stages:[{title:"DBP > 80",min:80,max:100,color:"rgba(255,0,0,0.4)"},{title:"Normal",min:50,max:80,color:"rgba(0, 255, 0,0.3)"}]};
//sbp_and_dbp
label_sbp_and_dbp="SBP/DBP";label_sbp_and_dbp_collected_date="Date";type_sbp_and_dbp='table';unit_sbp_and_dbp='mmHg';section_sbp_and_dbp='mdvisits_and_mdvisits';
//weight
label_weight_collected_date=" Date";label_weight="Weight";type_weight='table';unit_weight='Kg';section_weight='mdvisits';
//height
label_height_collected_date=" Date";label_height="Height";type_height='table';unit_height='Cm';section_height='mdvisits';
//hipo
label_hipo_collected_date="Date";label_hipo="Hypoglycemia";type_hipo='table';unit_hipo='Episodes/Month';section_hipo='mdvisits';
//foot
label_foot_collected_date="Date";label_foot="Visual foot exam";type_foot='single';unit_foot='';section_foot='mdvisits';trigger_foot={'value':"neuro",'field':"date",'section':"complications",'conditionfield':"value",'conditionvalue':"1",'conditionresult':"date"};
//smoke
label_smoke="Smoker";label_smoke_collected_date="Date";type_smoke='table';unit_smoke='';section_smoke='mdvisits';
//aer
label_aer="Physical Activity";label_aer_collected_date="Date";type_aer='table';unit_aer='Minutes/Week';section_aer='mdvisits';
//neuromd
label_neuromd="10 g Monofilament";label_neuromd_collected_date="Date";type_neuromd='single';unit_neuromd='';section_neuromd='mdvisits';trigger_neuromd={'value':"neuro",'field':"date",'section':"complications",'conditionfield':"value",'conditionvalue':"1",'conditionresult':"date"};
//rpathscr
label_rpathscr="Rethinopaty Screening";label_rpathscr_collected_date="Date of exam";type_rpathscr="single";unit_rpathscr='';section_rpathscr='mdvisits';trigger_rpathscr={'value':"reti",'field':"date",'section':"complications",'conditionfield':"value",'conditionvalue':"1",'conditionresult':"date"};

/*LAB VALUES*/
//hba1c
label_hba1c="HbA1c";label_hba1c_collected_date="Date";type_hba1c='graph';unit_hba1c='Percentage or Absolute value';section_hba1c='lab';
limits_hba1c={maxvalue:0.085,minvalue:0.055,stages:[{title:"HbA1C > 7%",min:0.07,max:0.085,color:"rgba(255,0,0,0.4)"},{title:"Target HbA1C 7%",min:0.06,max:0.07,color:"rgba(0, 255, 0,0.3)"},{title:"Normal HbA1C < 6%",min:0.055,max:0.06,color:"rgba(0, 255, 0,0.6)"}]};
//ogtt
label_ogtt="OGTT";label_ogtt_collected_date="Date";type_ogtt='graph';unit_ogtt='';section_ogtt='lab';
//acglu
label_acglu="Fasting Glucose";label_acglu_collected_date="Date";type_acglu='graph';unit_acglu='mg/dL';section_acglu='lab';
limits_acglu={maxvalue:15,minvalue:7,stages:[{title:"Fasting Glucose > 7",min:7,max:15,color:"rgba(255,0,0,0.4)"},{title:"Target Fasting Glucose  7",min:6,max:7,color:"rgba(0, 255, 0,0.3)"},{title:"Normal Fasting Glucose < 6",min:5,max:6,color:"rgba(0, 255, 0,0.6)"}]};

/*RENAL VALUES*/
//acratio_or_pcrg
type_acratio_or_pcrg = 'graph';section_acratio_or_pcrg='renal_or_renal';
//acratio
label_acratio="AC Ratio";label_acratio_collected_date="Date";type_acratio='graph';unit_acratio='mg/mmol';section_acratio='renal';
limits_acratio={maxvalue:20,minvalue:1,stages:[{title:"AC Ratio > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"Ac Ratio < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//crea
label_crea="Serum Creatinine";label_crea_collected_date="Serum Creatinine Date";type_crea="graph";unit_crea='mmol/L';section_crea='renal';
limits_crea={maxvalue:150,minvalue:50,stages:[]};
//crcl
label_crcl="Creatinine Clearence";label_crcl_collected_date="Date";type_crcl='graph';unit_crcl='ml/sec';section_crcl='renal';
//prote
label_prote="Urine proteins 24hr";label_prote_collected_date="Date";type_prote='graph';unit_prote='g/day';section_prote='renal';
//egfr
label_egfr="eGFR";label_egfr_collected_date="Date";type_egfr='graph';unit_egfr='ml/min';section_egfr='renal';
limits_egfr={maxvalue:100,minvalue:5,stages:[{title:"",min:90,max:100,color:"rgba(0,255,0,0.3)"},{title:"",min:60,max:90,color:"rgba(0,255,0,0.3)"},{title:"STAGE 3",min:30,max:60,color:"rgba(255, 123, 15,0.5)"},{title:"STAGE 4",min:15,max:30,color:"rgba(255, 0, 0,0.3)"},{title:"STAGE 5",min:5,max:15,color:"rgba(255, 0, 0,0.4)"}]};
//pcr
label_pcr="PCR";label_pcr_collected_date="Date";type_pcr='graph';unit_pcr='mg/mmol';section_pcr='renal';
limits_pcr={maxvalue:20,minvalue:1,stages:[{title:"PCR > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"PCR < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//pcrg
label_pcrg="PCR";label_pcrg_collected_date="Date";type_pcrg='graph';unit_pcrg='g/g';section_pcrg='renal';
limits_pcrg={maxvalue:20,minvalue:1,stages:[{title:"PCR > 2",min:2,max:20,color:"rgba(255,0,0,0.4)"},{title:"PCR < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};


/*LIPIDS VALUES*/
//tchol
label_tchol="Total Cholesterol";label_tchol_collected_date="Date";type_tchol='graph';unit_tchol='mmol/L';section_tchol='lipid';
limits_tchol={maxvalue:9.9,minvalue:2,stages:[]};
//tglycer
label_tglycer="Triglycerides";label_tglycer_collected_date="Date";type_tglycer='graph';unit_tglycer='mmol/L';section_tglycer='lipid';
limits_tglycer={maxvalue:3,minvalue:1,stages:[{title:"Triglycerides > 2",min:2,max:3,color:"rgba(255,0,0,0.4)"},{title:"Triglycerides < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//hdl
label_hdl="HDL";label_hdl_collected_date="Date";type_hdl='graph';unit_hdl='mmol/L';section_hdl='lipid';
limits_hdl={maxvalue:2,minvalue:0.5,stages:[{title:"HDL > 1",min:1,max:2,color:"rgba(0, 255, 0,0.3)"},{title:"HDL < 1",min:0.5,max:1,color:"rgba(255,0,0,0.4)"}]};
//ldl
label_ldl="LDL";label_ldl_collected_date="Date";type_ldl='graph';unit_ldl='mmol/L';section_ldl='lipid';
limits_ldl={maxvalue:5,minvalue:1,stages:[{title:"LDL > 2",min:2,max:5,color:"rgba(255,0,0,0.4)"},{title:"Target LDL < 2",min:1,max:2,color:"rgba(0, 255, 0,0.3)"}]};
//tchdl
label_tchdl="TC/HDL-c";label_tchdl_collected_date="Date";type_tchdl='graph';unit_tchdl='';section_tchdl='lipid';


/*COMPLICATIONS VALUES*/
//reti
label_reti="Any Retinopathy";label_reti_collected_date="Date";type_reti='single';unit_reti='';section_reti='complications';
//lther
label_lther="Laser Therapy";label_lther_collected_date="Date";type_lther='single';unit_lther='';section_lther='complications';
//lblind
label_lblind="Legal Blindness";label_lblind_collected_date="Date";type_lblind='single';unit_lblind='';section_lblind='complications';
//micro
label_micro="Microalbuminuria (ACR 2-30)";label_micro_collected_date="Date";type_micro='single';unit_micro='';section_micro='complications';
//macro
label_macro="Overt proteinuria (ACR > 30)";label_macro_collected_date="Date";type_macro='single';unit_macro='';section_macro='complications';
//renf
label_renf="Renal Failure (GFR < 60)";label_renf_collected_date="Date";type_renf='single';unit_renf='';section_renf='complications';
//dial
label_dial="Dialysis";label_dial_collected_date="Date";type_dial='single';unit_dial='';section_dial='complications';
//rplant
label_rplant="Renal Transplant";label_rplant_collected_date="Date";type_rplant='single';unit_rplant='';section_rplant='complications';
//neuro
label_neuro="Any Neuropathy";label_neuro_collected_date="Date";type_neuro='single';unit_neuro='';section_neuro='complications';
//fulcer
label_fulcer="Foot Ulcer";label_fulcer_collected_date="Date";type_fulcer='single';unit_fulcer='';section_fulcer='complications';
//amput
label_amput="Amputation";label_amput_collected_date="Date";type_amput='single';unit_amput='';section_amput='complications';
//cad
label_cad="Coronary Arthery Disease";label_cad_collected_date="Date";type_cad='single';unit_cad='';section_cad='complications';
//cvd
label_cvd="Cerebrovascular Disease";label_cvd_collected_date="Date";type_cvd='single';unit_cvd='';section_cvd='complications';
//pvd
label_pvd="Peripheral Disease";label_pvd_collected_date="Date";type_pvd='single';unit_pvd='';section_pvd='complications';
//impot
label_impot="Erectile Dysfunction";label_impot_collected_date="Date";type_impot='single';unit_impot='';section_impot='complications';

/*MEDS VALUES*/
//orala
label_orala="Oral Agents";label_orala_collected_date="Date";type_orala='table';unit_orala='';section_orala='meds';
//insulin
label_insulin="Insulin";label_insulin_collected_date="Date";type_insulin='table';unit_insulin='';section_insulin='meds';
//acei
label_acei="ACEi/ARB";label_acei_collected_date="Date";type_acei='table';unit_acei='';section_acei='meds';
//statin
label_statin="Statin";label_statin_collected_date="Date";type_statin='table';unit_statin='';section_statin='meds';
//asa
label_asa="Asa";label_asa_collected_date="Date";type_asa='table';unit_asa='';section_asa='meds';

/*DEPRESSION SCREEN VALUES*/
//deps
label_deps="Depression Screen [PHQ-2]";label_deps_collected_date="Date";type_deps='single';unit_deps='Score';section_deps='depression';
//score
label_score="Depression Screen [PHQ-9]";label_score_collected_date="Date";type_score='single';unit_score='Score';section_score='depression';

/*MISCELLANEOUS VACCINATIONS VALUES*/
//dophta
label_dophta="Ophthalmology";label_dophta_collected_date="Date";type_dophta='single';unit_dophta='';section_dophta='miscellaneous';
//dinflu
label_dinflu="Influenza";label_dinflu_collected_date="Date";type_dinflu='single';unit_dinflu='';section_dinflu='miscellaneous';
//dpneu
label_dpneu="Pneumococcal";label_dpneu_collected_date="Date";type_dpneu='single';unit_dpneu='';section_dpneu='miscellaneous';
//dppd
label_dppd="PPD Screening Date";label_dppd_collected_date="Date";type_dppd='single';unit_dppd='';section_dppd='miscellaneous';
//ppd
label_ppd="PPD";label_ppd_collected_date="Date";type_ppd='table';unit_ppd='';section_ppd='miscellaneous';
//inh
label_inh="INH";label_inh_collected_date="Date";type_inh='table';unit_inh='';section_inh='miscellaneous';




var mdvisits_title = "Clinical visits";
var lab_title = "Glucose Control";
var renal_title = "Renal ";
var lipid_title = "Lipids";
var complications_title = "Complications";
var meds_title = "Medication";
var miscellaneous_title = "Vaccinations";
var depression_title = "Depression Screening";
var complications_groups = [["reti","lther", "lblind"],["micro","macro", "renf", "dial","rplant"],["neuro","fulcer","amput"],["cad","cvd","pvd","impot"]];
var complications_groups_names = ["Retinopathy","Nephropathy","Neuropathy","Macrovascular"];
profession_array = [["chr","PCCR"],["md","MD"],["nur","Nurse"],["nut","Nutritionist"]];
profession_object = {"chr":"PCCR","md":"MD","nur":"Nurse","nut":"Nutritionist"};
profession_dbindex={"chr":"4","md":"1","nur":"2","nut":"3"};
profession_index={"4":"chr","1":"md","2":"nur","3":"nut"};
profession_code_array = ["chr","md","nur","nut"];

neuromd_values={"0":"Normal","1":"Abnormal"};
smoke_values={"0":"No","1":"Yes","2":"Unknown"};
foot_values={"0":"Normal","1":"Abnormal"};
rpathscr_values={"0":"Normal","1":"Abnormal"};
rpathscr_datelabel="Date of exam";
dial_datelabel="Date dialysis start";
psyco_values={"0":"No","1":"Yes"};
depr_values={"0":"No","1":"Yes"};
orala_values={"0":"No","1":"Yes"};
insulin_values={"0":"No","1":"Yes"};
acei_values={"0":"No","1":"Yes"};
statin_values={"0":"No","1":"Yes"};
asa_values={"0":"No","1":"Yes"};


