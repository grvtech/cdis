package com.grvtech.cdis.controler;

import java.io.File;
import java.io.FileFilter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.net.util.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.grvtech.cdis.db.CdisDBridge;
import com.grvtech.cdis.db.ChbDBridge;
import com.grvtech.cdis.model.Action;
import com.grvtech.cdis.model.MessageResponse;
import com.grvtech.cdis.model.Note;
import com.grvtech.cdis.model.Report;
import com.grvtech.cdis.model.ReportCriteria;
import com.grvtech.cdis.model.ReportSubcriteria;
import com.grvtech.cdis.model.Role;
import com.grvtech.cdis.model.ScheduleVisit;
import com.grvtech.cdis.model.Session;
//import com.grv.cdis.model.SearchPatient;
import com.grvtech.cdis.model.User;
import com.grvtech.cdis.util.FileFilterTool;
import com.grvtech.cdis.util.FileTool;
import com.grvtech.cdis.util.MailTool;
import com.grvtech.cdis.util.Misc;
import com.grvtech.cdis.util.SecurityTool;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


@RestController
public class ActionProcessor {
	
	Logger logger = LogManager.getLogger(ActionProcessor.class);
	
	@Autowired
	ChbDBridge chbdb;
	
	@Autowired
	CdisDBridge cdisdb;
	
	@Autowired
	FileTool ft;
	
	@Autowired
	Misc misc;
	
	@Autowired
	MailTool mt;
	
	@Value("${frontpage}")
	private String frontpageFile;
	
	@Value("${reports}")
	private String reportsFolder;
	
	
@RequestMapping(value = {"/service/action/loginSession"}, method = RequestMethod.GET)
public String loginSession(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String username = request.getParameter("username").toString();
	String password = request.getParameter("password").toString();
	String language = request.getParameter("language").toString();
	String reswidth = request.getParameter("reswidth").toString();
	String resheight = request.getParameter("resheight").toString();
	
	String encPassword = "";
	String clearPassword = "";
	try {
		clearPassword = new String(Base64.decodeBase64(password), "UTF-8");
		encPassword = SecurityTool.encryptPassword(clearPassword);
		
	} catch (UnsupportedEncodingException e) {
		e.printStackTrace();
	}
	
	User user = chbdb.getUser(username, encPassword);
	Action act = chbdb.getAction("LOGIN");
	Session userSession = null;

	if(!user.getIduser().equals("0")){
		String ip =  misc.getIpAddr(request);
		String combination = ip+user.getUsername()+ (new Date()).toString();
		String idsession = DigestUtils.md5Hex(combination);
		userSession = new Session(idsession, user.getIduser(), ip, 0, 0, Integer.parseInt(reswidth),Integer.parseInt(resheight),1);
		chbdb.setUserSession(userSession);
		ArrayList<Object> obs = new ArrayList<>();
		obs.add(user);
		result = json.toJson(new MessageResponse(act,true,language,obs));
		chbdb.setEvent(user.getIduser(), act.getIdaction(), "1", userSession.getIdsession());
		logger.log(Level.INFO, "User "+username+" has logged successfuly");
	}else{
		logger.log(Level.INFO, "User "+username+" failed to log");
		result = json.toJson(new MessageResponse(act,false,language,null));
	}
	return result;
}
	
@RequestMapping(value = {"/service/action/search"}, method = RequestMethod.GET)
public String search(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String searchText = request.getParameter("text").toString();
	String criteria = request.getParameter("criteria").toString();
	String language = request.getParameter("language").toString();
	// criteria can be name|chart|ramq
	Action act = chbdb.getAction("SEARCH"); 
	if(searchText != null && !searchText.equals("") ){
		//ArrayList<SearchPatient> patientList = cdisdb.getSearchPatientsByCriteria(searchText,criteria);
		//result = json.toJson(patientList);
	}else{
		result = json.toJson(new MessageResponse(act,false,language,null));
	}
	return result;
}

@RequestMapping(value = {"/service/action/getReports"}, method = RequestMethod.GET)
public String getReports(final HttpServletRequest request){
		Gson json = new Gson();
		String result = "";
		String sid = request.getParameter("sid").toString();
		String language = request.getParameter("language").toString();
		// criteria can be name|chart|ramq
		User userData = chbdb.getUser(sid);
		ArrayList<Object> obs = new ArrayList<Object>();
		Role r = chbdb.getUserRole(userData);
		
		HashMap<String, ArrayList<Report>> reports = cdisdb.getUserReports(r.getCode(), userData.getIdcommunity(), userData.getIduser());
		obs.add(reports);
		result = json.toJson(new MessageResponse(true,language,obs));
		logger.log(Level.INFO,"getReports");
		return result;
	}

@RequestMapping(value = {"/service/action/executeReport3CustomValue"}, method = RequestMethod.GET)
public String executeReport3CustomValue(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	JsonParser jp = new JsonParser();
	
	String language = request.getParameter("language").toString();
	String cvalue = "0";
	if(request.getParameter("cvalue") != null){cvalue = request.getParameter("cvalue").toString();}
	
	String idcommunity = "0";
	if(request.getParameter("idcommunity") != null){idcommunity = request.getParameter("idcommunity").toString();}
	String dtype = "0";
	if(request.getParameter("dtype") != null){dtype = request.getParameter("dtype").toString();}
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    Hashtable<String, Object> reportObject = cdisdb.a1cReportCustomValue(cvalue,idcommunity,dtype);
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(reportObject);
	result = json.toJson(new MessageResponse(true,language,obs));
	logger.log(Level.INFO,"execute Report 3 custom value");
	return result;
}

@RequestMapping(value = {"/service/action/executeReport4CustomValue"}, method = RequestMethod.GET)
public String executeReport4CustomValue(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	JsonParser jp = new JsonParser();
	
	String language = request.getParameter("language").toString();
	
	String pvalue = "0";
	if(request.getParameter("pvalue") != null){pvalue = request.getParameter("pvalue").toString();}
	
	String sens = "0";
	if(request.getParameter("sens") != null){sens = request.getParameter("sens").toString();}
	
	String idcommunity = "0";
	if(request.getParameter("idcommunity") != null){idcommunity = request.getParameter("idcommunity").toString();}
	
	String dtype = "0";
	if(request.getParameter("dtype") != null){dtype = request.getParameter("dtype").toString();}
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    Hashtable<String, Object> reportObject = cdisdb.ldlReportCustomValue(sens,pvalue,idcommunity,dtype);
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(reportObject);
	result = json.toJson(new MessageResponse(true,language,obs));
	logger.log(Level.INFO,"execute Rep 4 custom value");
	return result;
}

@RequestMapping(value = {"/service/action/executeReport"}, method = RequestMethod.POST)
public String executeReport(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	
	
	String raw ="";
	try {
		raw = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
	} catch (IOException e) {
		logger.log(Level.ERROR,"unable to read request lines from report");
		e.printStackTrace();
	}
	
	String language = request.getParameter("language").toString();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMddHHmmss");
	Gson gson = new Gson();
    //JsonParser parser = new JsonParser();
    //JsonObject jObject = parser.parse(raw).getAsJsonObject();
    //JsonObject jObject = gson.fromJson(raw, JsonObject.class);
    
    JsonObject jObject = JsonParser.parseString(raw).getAsJsonObject();
	String type = jObject.get("type").getAsString();
    JsonArray jArrayC = jObject.get("criteria").getAsJsonArray();
    JsonArray jArraySC = jObject.get("subcriteria").getAsJsonArray();
    
    ArrayList<ReportCriteria> lcs = new ArrayList<ReportCriteria>();
    ArrayList<ReportCriteria> slcs = new ArrayList<ReportCriteria>();//subcriterias
    
    String filter = "allhcp";
    
    if(jObject.has("filter")){
    	filter = jObject.get("filter").getAsString();
    }
    
    for(JsonElement obj : jArrayC ){
        ReportCriteria cse = gson.fromJson( obj , ReportCriteria.class);
        lcs.add(cse);
        System.out.println("=========================================");
        System.out.println(" criteria name : "+cse.getName());
        System.out.println(" criteria value : "+cse.getValue());
        System.out.println(" criteria iddata : "+cse.getIddata());
        System.out.println("=========================================");
    }
    
    for(JsonElement obj : jArraySC ){
        //ReportSubcriteria scse = gson.fromJson( obj , ReportSubcriteria.class);
    	ReportCriteria scse = gson.fromJson( obj , ReportCriteria.class);
    	slcs.add(scse);
    }

    ArrayList<String> header = new ArrayList<>();
    ArrayList<ArrayList<String>> set = new ArrayList<>();
    
    System.out.println("=========================================");
    System.out.println(" type: "+type);
    System.out.println("=========================================");
    
    if(type.equals("list")){
    	ArrayList<String> idpatients = new ArrayList<>();
    	
    	if(filter.equals("allhcp")){
    		idpatients = cdisdb.getIdPatients();
    	}else{
    		idpatients = cdisdb.getIdFilterPatients(filter);
    	}
    	
    	Hashtable<String, ArrayList<ArrayList<String>>> report = new Hashtable<>();
	    for(int i=0;i<lcs.size();i++){ 
	    	ReportCriteria rc = lcs.get(i);
	    	
	    	header.add(rc.getDisplay());
    		//list : count | idpatient | key | value | date 
	    	//graph : count | key | value 
	    	
		    ArrayList<ArrayList<String>> criteriaSet = cdisdb.executeReport(rc);
		    
		    report.put(rc.getName(), criteriaSet);
		    
	    	ArrayList<String> criteriaPatients = new ArrayList<>();
	    	for(int ii=0;ii<criteriaSet.size();ii++){
	    		ArrayList<String> line = criteriaSet.get(ii);
	    		String idp = line.get(1);
	    		if(!criteriaPatients.contains(idp)){
	    			criteriaPatients.add(idp);
	    		}
	    	}
		    	
	    	//remove patients from idpatients if are not in criteria set
	    	
		    ArrayList<String> toRemove = new ArrayList<>();
		    for(int k=0;k<idpatients.size();k++){
		    	String idpatientP = idpatients.get(k);
		    	if(!criteriaPatients.contains(idpatientP)){
	    			if(!toRemove.contains(idpatientP)){toRemove.add(idpatientP);}
		    	}
		    }
		    idpatients.removeAll(toRemove);
		    
	    }	
	    
	    for(int x=0;x<idpatients.size();x++){
	    	String idpat = idpatients.get(x);
	    	Hashtable<ReportCriteria, ArrayList<ArrayList<String>>> patientMap = new Hashtable<>();
	    	
	    	for(int y=0;y<lcs.size();y++){
	    		ReportCriteria rcc = lcs.get(y);
	    		String rccName = rcc.getName();

	    		ArrayList< ArrayList<String>>  rcset =  report.get(rccName);
	    		ArrayList< ArrayList<String>>  rcsetPatient =  new ArrayList<>();
	    		for(int z=0;z<rcset.size();z++){
	    			ArrayList<String> rcLine = rcset.get(z);
	    			String rcIdPat = rcLine.get(1);
	    			if(rcIdPat.equals(idpat)){
	    				rcsetPatient.add(rcLine);
	    			}
	    		}
	    		patientMap.put(rcc, rcsetPatient);
	    	}
	    	
	    	//now obtain bigest set
	    	
	    	int bigSet = 0;
	    	Object[] psetColl = patientMap.values().toArray();
	    	for(int xx=0;xx<psetColl.length;xx++){
	    		ArrayList<ArrayList<String>> pset = (ArrayList<ArrayList<String>>)psetColl[xx];
	    		if(pset.size() > bigSet){
	    			bigSet = pset.size();
	    		}
	    	}
	    	
	    	
	    	//now create line
	    	for(int q=0;q<bigSet;q++){ 
	    		ArrayList<String> setLine = new ArrayList<>();
	    		for(int qq=0;qq<lcs.size();qq++){
	    			ReportCriteria r = lcs.get(qq);
	    			
	    			ArrayList<ArrayList<String>> rpset = patientMap.get(r);
	    			
	    				
	    				if(rpset.size() > 0){
			    			if(r.getSection().equals("1")){
			    				//the set size is 1
			    				ArrayList<String> rpsetLine = rpset.get(0);
			    				setLine.add(rpsetLine.get(3));
			    			}else{
			    				if(q >= rpset.size()){
			    					setLine.add(" ");
			    				}else{
			    					ArrayList<String> rpsetLine = rpset.get(q);
			    					setLine.add(rpsetLine.get(3));
			    				}
			    			}
	    				}else{
	    					setLine.add(" ");
	    				}
	    			
	    		}
	    		set.add(setLine);
	    	}
	    }
	    
    }else{
    	//graphdata = getGraphdata
    	//2 criterias : dtype and idcommunity
    	// for dtype :   header is type 1... type2 ....
    	// for dtype : data is numbers 
    	// for dtype only one dataset - always
    	
    	//for id community : if value is 0 - onlyone dataset with header = the comunities
    	// for idcommunity : if value different from 0 :  if only one digit 1 to 9 - only one dataset with header the month based on report period ex: August 2024 Sept2024 ....
    	//for id community : if value contains _ (underscore) = 2 datasets with the same header - time 
    	
    	//if value is 0
    	// aproach : apply all subcriteria conditions as in list => list of idpatients that respect the subcriteria 
    	// with the list of ids count patients based on criteria dtype or idcommunity
    	
    	//if value different of 0 means idcommunity
    	// get idpatient from that community then for each subcriteria count patients based on datevalue from begining to max() each end of month in the period list ( last 6 months = header of 6 months) 
    	// for last 2 years we have a header with 24 values
    	
    	//for graph i know there is only one criteria so...
    	
    	ReportCriteria criteria = lcs.get(0);
    	String criteriaValue = criteria.getValue();
    	
    	if(criteriaValue.equals("0")) {
    		//build header
    		if(criteria.getName().equals("dtype")) {
    			header = cdisdb.getDiabetesTypes("normal");
    		}else if(criteria.getName().equals("idcommunity")) {
    			header = cdisdb.getAllCommunities();
    		}
    		
    		
    		ArrayList<String> idpatients = new ArrayList<>();
    		ArrayList<HashMap<String,String>> idpatientsWithCriteria = cdisdb.getIdPatientsForCustomReportGraph(criteria,filter);
        	for(HashMap row: idpatientsWithCriteria){
        		idpatients.add(row.get("idpatient").toString());
        	}
        	
        	
    	    for(int i=0;i<slcs.size();i++){ 
    	    	ReportCriteria subcriteria = slcs.get(i);
    		    ArrayList<ArrayList<String>> criteriaSet = cdisdb.executeReport(subcriteria);
    		    
    	    	ArrayList<String> criteriaPatients = new ArrayList<>();
    	    	//get all idpatient from criteriaset
    	    	for(int ii=0;ii<criteriaSet.size();ii++){
    	    		ArrayList<String> line = criteriaSet.get(ii);
    	    		String idp = line.get(1);
    	    		if(!criteriaPatients.contains(idp)){
    	    			criteriaPatients.add(idp);
    	    		}
    	    	}
    		    	
    	    	//remove patients from idpatients if are not in criteria set
    		    ArrayList<String> toRemove = new ArrayList<>();
    		    for(int k=0;k<idpatients.size();k++){
    		    	String idpatientP = idpatients.get(k);
    		    	if(!criteriaPatients.contains(idpatientP)){
    	    			if(!toRemove.contains(idpatientP)){toRemove.add(idpatientP);}
    		    	}
    		    }
    		    idpatients.removeAll(toRemove);
    	    }	
    	    
    	    //idpatient is the list now build the set
    	    HashMap<String,String> line = new HashMap<>();
    	    for(int x=0;x<idpatients.size();x++){
    	    	String idpat = idpatients.get(x);
    	    	String cr = "";
    	    	for(HashMap pline: idpatientsWithCriteria) {
    	    		 if(pline.get("idpatient").equals(idpat)) {
    	    			 cr = pline.get("criteria").toString();
    	    			 break;
    	    		 }
    	    	}
    	    	
    	    	int num = 0;
    	    	if(line.keySet().contains(cr)) {
    	    		num = Integer.parseInt(line.get(cr));
    	    	}
    	    	num++;
    	    	line.put(cr, Integer.toString(num));
    	    }
    	    ArrayList<String> setLine = new ArrayList<>();
    		for(String col : header) {
    			setLine.add(line.get(col));
    		}
    		set.add(setLine);
    		
    	}else {
    		
    		// build header
    		String period = jObject.get("period").getAsString();
    		// period is 6 = last 6 month 12 =last 12 months 1 =last year (if we are in 2024 that means 2023) 2 = last 2 years ( 24 columns) 
    		header = misc.getHeaderGraphCustomReportPeriod(period);
    		
    		if(criteria.getValue().indexOf("_") >=0) {
    			//the value is with 2 communities
    			String[] parts = criteria.getValue().split("_");
    			
    			for(int i=0;i<parts.length;i++) {
    				criteria.setValue(parts[i]);
    				ArrayList<HashMap<String,String>> idpatientsWithCriteria = cdisdb.getIdPatientsForCustomReportGraph(criteria,filter);
    				ArrayList<String> idpatients = new ArrayList<>();
    	        	for(HashMap row: idpatientsWithCriteria){
    	        		idpatients.add(row.get("idpatient").toString());
    	        	}

    	        	Hashtable<String, ArrayList<ArrayList<String>>> report = new Hashtable<>();
    	    	    for(int j=0;j<slcs.size();j++){ 
    	    	    	ReportCriteria subcriteria = slcs.get(j);
    	    		    ArrayList<ArrayList<String>> criteriaSet = cdisdb.getSetGraphCustomReportPeriod(subcriteria,header);
    	    	    	
    	    	    	//get all idpatient from criteriaset
    	    	    	for(int ii=0;ii<criteriaSet.size();ii++){
    	    	    		ArrayList<String> column = criteriaSet.get(ii);
    	    	    		ArrayList<String> toRemove = new ArrayList();
    	    	    		for(String idp :column) {
    	    	    			if(!idpatients.contains(idp))toRemove.add(idp);
    	    	    		}
    	    	    		column.removeAll(toRemove);
    	    	    		criteriaSet.set(ii, column);
    	    	    	}
    	    		    
    	    	    	report.put(subcriteria.getName(), criteriaSet);
    	    	    	
    	    	    }
    	        	
    	    	    ArrayList<String> subset = new ArrayList<>();
    	    	    
    	    	    for(int k=0;k<header.size();k++) {
    	    	    	ArrayList<String> reference = new ArrayList<>();
    	    	    	for(int kk=0;kk<slcs.size();kk++){
    	    	    		ReportCriteria subcriteria = slcs.get(kk);
    	    	    		ArrayList<ArrayList<String>> cSet = report.get(subcriteria.getName());
    	    	    		ArrayList<String> column = cSet.get(k);
    	    	    		if(reference.size() == 0 ) reference = column;
    	    	    		ArrayList<String> toRemove = new ArrayList<>();
    	    	    		for(String idp:reference) {
    	    	    			if(!column.contains(idp))toRemove.add(idp);
    	    	    		}
    	    	    		reference.removeAll(toRemove);
    	    	    	}
    	    	    	subset.add(Integer.toString(reference.size()));
    	    	    }
    				set.add(subset);
    			}
    			
    		}else {
    			
    			ArrayList<HashMap<String,String>> idpatientsWithCriteria = cdisdb.getIdPatientsForCustomReportGraph(criteria,filter);
				ArrayList<String> idpatients = new ArrayList<>();
	        	for(HashMap row: idpatientsWithCriteria){
	        		idpatients.add(row.get("idpatient").toString());
	        	}

	        	Hashtable<String, ArrayList<ArrayList<String>>> report = new Hashtable<>();
	    	    for(int j=0;j<slcs.size();j++){ 
	    	    	ReportCriteria subcriteria = slcs.get(j);
	    		    ArrayList<ArrayList<String>> criteriaSet = cdisdb.getSetGraphCustomReportPeriod(subcriteria,header);
	    	    	
	    	    	//get all idpatient from criteriaset
	    	    	for(int ii=0;ii<criteriaSet.size();ii++){
	    	    		ArrayList<String> column = criteriaSet.get(ii);
	    	    		ArrayList<String> toRemove = new ArrayList();
	    	    		for(String idp :column) {
	    	    			if(!idpatients.contains(idp))toRemove.add(idp);
	    	    		}
	    	    		column.removeAll(toRemove);
	    	    		criteriaSet.set(ii, column);
	    	    	}
	    		    
	    	    	report.put(subcriteria.getName(), criteriaSet);
	    	    	
	    	    }
	        	
	    	    ArrayList<String> subset = new ArrayList<>();
	    	    
	    	    for(int k=0;k<header.size();k++) {
	    	    	ArrayList<String> reference = new ArrayList<>();
	    	    	for(int kk=0;kk<slcs.size();kk++){
	    	    		ReportCriteria subcriteria = slcs.get(kk);
	    	    		ArrayList<ArrayList<String>> cSet = report.get(subcriteria.getName());
	    	    		ArrayList<String> column = cSet.get(k);
	    	    		if(reference.size() == 0 ) reference = column;
	    	    		ArrayList<String> toRemove = new ArrayList<>();
	    	    		for(String idp:reference) {
	    	    			if(!column.contains(idp))toRemove.add(idp);
	    	    		}
	    	    		reference.removeAll(toRemove);
	    	    	}
	    	    	subset.add(Integer.toString(reference.size()));
	    	    }
				set.add(subset);
    			
    		}
    		
    		System.out.println("=====================================");
    		System.out.println(header);
    		System.out.println("=====================================");
    		System.out.println("=====================================");
    		System.out.println(set);
    		System.out.println("=====================================");
    	}
    	
    	/*
    	Hashtable<ReportCriteria, ArrayList<ArrayList<String>>> map = new Hashtable<>();
    	for(int i=0;i<lcs.size();i++){
    		ReportCriteria rc = lcs.get(i);
    		header.add(rc.getDisplay());
    		ArrayList<ArrayList<String>> criteriaSet = cdisdb.executeReport(rc, "graph", slcs);
    		map.put(rc, criteriaSet);
    	}
    	
    	if(slcs.size() > 0){
    		
    		if(subcriteriatype.equals("single")){
	    		for(int j=0;j<slcs.size();j++){
		    		//ReportSubcriteria rsc = slcs.get(j);
	    			ArrayList<String> setLine = new ArrayList<>();
		    		for(int jj=0;jj<lcs.size();jj++){
		    			ArrayList<ArrayList<String>> criteriaSet = map.get(lcs.get(jj));
		    			
		    			if(criteriaSet.size() > 0){
		    				setLine.add(criteriaSet.get(j).get(2));
		    			}else{
		    				setLine.add("0");
		    			}
		    		}
		    		set.add(setLine);
		    	}
    		}else{
    			ArrayList<String> setLine = new ArrayList<>();
	    		for(int jj=0;jj<lcs.size();jj++){
	    			ArrayList<ArrayList<String>> criteriaSet = map.get(lcs.get(jj));
	    			if(criteriaSet.size() > 0){
	    				setLine.add(criteriaSet.get(0).get(2));
	    			}else{
	    				setLine.add("0");
	    			}
	    		}
	    		set.add(setLine);
    		}
    	}else{
    		ArrayList<String> setLine = new ArrayList<>();
    		for(int jj=0;jj<lcs.size();jj++){
    			ArrayList<ArrayList<String>> criteriaSet = map.get(lcs.get(jj));
    			if(criteriaSet.size() > 0){
    				setLine.add(criteriaSet.get(0).get(2));
    			}else{
    				setLine.add("0");
    			}
    		}
    		set.add(setLine);
    	}
    	*/
    	
    }
    	    
    Hashtable<String, Object> reportObject = new Hashtable<>();
    reportObject.put("dataset", set);
    reportObject.put("header", header);
    JsonElement jset = gson.toJsonTree(set); 
    JsonElement jheader = gson.toJsonTree(header);
    jObject.add("dataset", jset);
    jObject.add("header", jheader);
    String owner = jObject.get("owner").getAsString();
    String note = jObject.get("note").getAsString();
    if(note!=null)note="Custom Report";
    int l = 200;
    if(note.length() < l) l = note.length();
    String reportName = note.substring(0, l);
    String reportCode = "CR_"+owner+"_"+sdf1.format(new Date());
    jObject.addProperty("id", reportCode);
    
    try (Writer writer = new FileWriter(reportsFolder+System.getProperty("file.separator")+"history"+System.getProperty("file.separator")+reportCode+".json")) {
        gson.toJson(jObject, writer);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
    
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(reportObject);
	result = json.toJson(new MessageResponse(true,language,obs));
	logger.log(Level.INFO,"execute report");
	return result;
}

@RequestMapping(value = {"/service/action/setFrontPageMessage"}, method = RequestMethod.POST)
public String setFrontPageMessage(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String message = "";
	if(request.getParameter("fpmessage") != null){
		message = request.getParameter("fpmessage").toString();
	}
	ArrayList<Object> obs = new ArrayList<Object>();
	try {
		File frontPageFile = new File(frontpageFile);
		if(!frontPageFile.exists()){
			frontPageFile.createNewFile();
		}
		ft.setMessage(frontPageFile.getAbsolutePath(), message);
	} catch (IOException e) {
		logger.log(Level.ERROR,"error seting front page");
		e.printStackTrace();
	}
	
	//obs.add(reports);
	result = json.toJson(new MessageResponse(true,language,obs));
	logger.log(Level.INFO,"set front page");
	return result;
}
	
@RequestMapping(value = {"/service/action/sendUserMessage"}, method = RequestMethod.GET)
public String sendUserMessage(final HttpServletRequest request){
	Gson json = new Gson();
	
	
	String result = "";
	String nameUser = request.getParameter("nameUser").toString();
	String messageUser = request.getParameter("messageUser").toString();
	String emailUser = request.getParameter("emailUser").toString();
	String adminUser = request.getParameter("adminUser").toString();
	String language = request.getParameter("language").toString();
	
	String messagEmail = "<b><p>Hello CDIS user</p></b><p>New message from : "+emailUser+"<br><br><b>Message:</b><br><pre>"+messageUser+"</pre></p>";
	mt.sendMailInHtml("CDIS User Message", messagEmail, ft.getEmailProperty("admin."+adminUser));
	
	ArrayList<Object> obs = new ArrayList<Object>();
	result = json.toJson(new MessageResponse(true,language,obs));
	logger.log(Level.INFO,"send user message");
	return result;
}

@RequestMapping(value = {"/service/action/forgotPassword"}, method = RequestMethod.POST)
public String forgotPassword(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	
	String usernameUser = request.getParameter("usernameUser").toString();
	String emailUser = request.getParameter("emailUser").toString();
	String language = request.getParameter("language").toString();
	String fusername = request.getParameter("fusername").toString();
	if(fusername.equals("true")) {
		usernameUser = chbdb.getUsernameByEmail(emailUser);
	}
	String server = request.getServerName();
	int port = request.getServerPort();
	

	User u = chbdb.isValidUser(emailUser, usernameUser);
	if(!u.getIduser().equals("0")){
		chbdb.setResetPassword(u.getIduser(),"1");
		String params = "rst=1&iduser="+u.getIduser(); 
		String url = "https://"+server+":"+port+"/ncdis/index.html?"+Base64.encodeBase64String(params.getBytes());
		String messagEmail = "<b><p>CDIS Password reset</p></b><p>Hello <b>"+u.getFirstname()+" "+u.getLastname()+"</b></p><p><b>Username:</b>"+u.getUsername()+"</p><p>Click on the button below to reset your password<br><br><a href='"+url+"'>Reset Password</a></p>";
		mt.sendMailInHtml("CDIS Password Reset", messagEmail, u.getEmail());
		
		ArrayList<Object> obs = new ArrayList<Object>();
		String msg = "You initiated password reset. Click on Reset Password button in the email you received to reset your password.";
		MessageResponse mr = new MessageResponse(true,language,obs);
		mr.setMessage(msg);
		result = json.toJson(mr);
		logger.log(Level.INFO,"send forgot password message");
	}else{
		logger.log(Level.INFO,"wrong user");
		ArrayList<Object> obs = new ArrayList<Object>();
		result = json.toJson(new MessageResponse("FORGOT-FALSE",false,language,obs));
	}
	return result;
}
	
@RequestMapping(value = {"/service/action/subscribe"}, method = RequestMethod.GET)
public String subscribe(final HttpServletRequest request){
		Gson json = new Gson();
		
		String result = "";
		String firstnameUser = request.getParameter("firstnameSub").toString();
		String lastnameUser = request.getParameter("lastnameSub").toString();
		String idcommunityUser = request.getParameter("idcommunitySub").toString();
		String idprofesionUser = request.getParameter("idprofesionSub").toString();
		String emailUser = request.getParameter("emailSub").toString();
		String language = request.getParameter("language").toString();
		//String server = request.getParameter("server").toString();
		String server = request.getServerName();
		int port = request.getServerPort();
		
		String usernameUser = lastnameUser.toLowerCase().trim()+firstnameUser.toLowerCase().substring(0,1);
		String pass = request.getParameter("passwordSub").toString();
		
		String encPassword = "";
		try {
			String clearPassword = new String(Base64.decodeBase64(pass), "UTF-8");
			encPassword = SecurityTool.encryptPassword(clearPassword);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		
		User u = chbdb.isValidUser(emailUser, usernameUser);
		if(!u.getIduser().equals("0")){
			
			String message = "Subscribe to CDIS \nYour information is already in CDIS database.\n";
			if(u.getReset().equals("1")){
				message+="A reset password was initiated and you should click on Reset Password button in the email that you received.\n If you did not received an email to reset your password click on Forgot Password link to reset your password again.";
			}else if(u.getConfirmmail().equals("1")){
				message+="You must confirm your password in order to log in.\nYou should click on Confirm Email button in the email that you received.\n If you did not received an email to confirm your subscription contact CDIS Admisitrator or send en email to support@grvtech.ca.";
			}else{
				message = "\nIf you forgot your password you should click on forgot password link to reset your password.";
			}
			ArrayList<Object> obs = new ArrayList<Object>();
			MessageResponse mr = new MessageResponse(false,language,obs);
			mr.setMessage(message);
			result = json.toJson(mr);
		}else{
			u.setActive("1");
			u.setEmail(emailUser);
			u.setFirstname(firstnameUser);
			u.setLastname(lastnameUser);
			u.setUsername(usernameUser);
			u.setPassword(encPassword);
			u.setIdcommunity(idcommunityUser);
			u.setIdprofesion(idprofesionUser);
			u.setPhone(u.getPhone());
			u.setReset("0");
			u.setConfirmmail("1");
			int idPendingUser = chbdb.addUser(u);
			
			
			if(chbdb.saveUserProfile(idPendingUser, 1, 2)){
				//MailTool.sendMailText("CDIS New User Subscribe", , "support@grvtech.ca");
				
				String messagEmail = "<b><p>Hello CDIS Administrator</p></b><p>New user is subscribed to CDIS.<br>The user should confirm the email in order to finish subscription.<br>Login to CDIS and go to Users section to view users pending. <br>The administrator can confirm users email in order to activate subscription.<br><b>User Info:</b><br><b>Name :</b> "+u.getFirstname()+" "+u.getLastname()+"<br><b>Username :</b> "+u.getUsername()+"<br><b>User Email :</b> "+u.getEmail()+"<br><br><b>An email will be sent to the user to confirm email and activate subscription.</b></p>";
				mt.sendMailInHtml("CDIS New User Subscribe", messagEmail, "admins@grvtech.ca");
				
				String params = "confirm=1&iduser="+idPendingUser; 
				String url = "https://"+server+":"+port+"/ncdis/index.html?"+Base64.encodeBase64String(params.getBytes());
				String messagEmailUser = "<p><b>Welcome to CDIS</b></p><p><b>Name :</b> "+u.getFirstname()+" "+u.getLastname()+"<br><b>Username :</b> "+u.getUsername()+"<br><b>User Email :</b> "+u.getEmail()+"<br></p><p>In order to activate your CDIS subscription you should confirm the email.<br><br><b>Click on the button below to confirm your email and activate the subscription</b><br><br><a href='"+url+"'>Confirm Email</a></p>";
				mt.sendMailInHtml("CDIS Subscribe", messagEmailUser, u.getEmail());
				
				String message = "Subscribe to CDIS.\nYou will receive an email with a button to confirm email and activate the subscription. ";
				ArrayList<Object> obs = new ArrayList<Object>();
				MessageResponse mr = new MessageResponse(true,language,obs);
				mr.setMessage(message);
				result = json.toJson(mr);
				logger.log(Level.INFO,"save user profile for user " +idPendingUser);
			}else{
				logger.log(Level.ERROR,"error saving profile of user "+idPendingUser);
				ArrayList<Object> obs = new ArrayList<Object>();
				MessageResponse mr = new MessageResponse(false,language,obs);
				result = json.toJson(mr);
			}
		}
		
	return result;
}

@RequestMapping(value = {"/service/action/confirmUserEmail"}, method = RequestMethod.POST)
public String confirmUserEmail(final HttpServletRequest request){
	Gson json = new Gson();
	
	
	String result = "";
	String language = request.getParameter("language").toString();
	String iduser = request.getParameter("iduser").toString();
	String server = request.getServerName();
	int port = request.getServerPort();
	
	User u = chbdb.getUser(Integer.parseInt(iduser));
	
	
	if(!u.getIduser().equals("0")){
		chbdb.setEmailConfirm(iduser, "0");
		
		String messagEmail = "<b><p>Hello "+u.getFirstname()+" "+u.getLastname()+"</p></b><p>You email was confirmed with success!<br><br>Use you new credentials to login into CDIS<br><br><a href='https://"+server+":"+port+"/ncdis'>Login to CDIS</a></p>";
		mt.sendMailInHtml("CDIS Email Confirmed Successfully", messagEmail, u.getEmail());
		
		ArrayList<Object> obs = new ArrayList<Object>();
		MessageResponse mr = new MessageResponse(true,language,obs);
		result = json.toJson(mr);
	}else{
		ArrayList<Object> obs = new ArrayList<Object>();
		MessageResponse mr = new MessageResponse(false,language,obs);
		result = json.toJson(mr);
	}
	logger.log(Level.INFO,"confirm mail for user "+iduser);
	return result;
}

@RequestMapping(value = {"/service/action/resetUserPassword"}, method = RequestMethod.POST)
public String resetUserPassword(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	
	String language = request.getParameter("language").toString();
	String usernameUser = request.getParameter("username").toString();
	String pass = request.getParameter("passwordr").toString();
	String iduser = request.getParameter("iduser").toString();
	String server = request.getServerName();
	int port = request.getServerPort();
	
	String encPassword = "";
	String clearPassword = "";
	try {
		clearPassword = new String(Base64.decodeBase64(pass), "UTF-8");
		encPassword = SecurityTool.encryptPassword(clearPassword);
	} catch (UnsupportedEncodingException e) {
		e.printStackTrace();
	}

	User u = chbdb.getUser(Integer.parseInt(iduser));
	if(!u.getIduser().equals("0")){
		u.setPassword(encPassword);
		chbdb.resetUserPassword(u);
		
		String messagEmail = "<p>Hello <b>"+u.getFirstname()+" "+u.getLastname()+"</b></p><p><b>Username : </b>"+u.getUsername()+"</p><p>You reset you password with success!<br><br>Use you new credentials to login into CDIS<br><br><a href='https://"+server+":"+port+"/ncdis'>Login to CDIS</a></p>";
		mt.sendMailInHtml("CDIS Password Reset Successfully", messagEmail, u.getEmail());
		
		String message = "You successfully reset your password\n.";
		ArrayList<Object> obs = new ArrayList<Object>();
		MessageResponse mr = new MessageResponse(true,language,obs);
		mr.setMessage(message);
		result = json.toJson(mr);
		logger.log(Level.INFO,"reset password for user : "+iduser);
	}else{
		logger.log(Level.ERROR,"no user wit id  : "+iduser);
		ArrayList<Object> obs = new ArrayList<Object>();
		MessageResponse mr = new MessageResponse(false,language,obs);
		mr.setMessage("User is invalid");
		result = json.toJson(mr);
	}		
	return result;
}

@RequestMapping(value = {"/service/action/getFrontPageMessage"}, method = RequestMethod.GET)
public String getFrontPageMessage(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	
	String language = request.getParameter("language").toString();
	// criteria can be name|chart|ramq
	//HashMap<String, String> userData  = chbdb.getUser(sid);
	String message = "";
	ArrayList<Object> obs = new ArrayList<Object>();
	
	try {
		File frontPageFile = new File(frontpageFile);
		if(!frontPageFile.exists()){
			frontPageFile.createNewFile();
		}
		message = ft.getMessage(frontPageFile.getAbsolutePath());
		
		HashMap<String, String> map = new HashMap<>();
		map.put("message", message);
		obs.add(map);
	} catch (IOException e) {
		e.printStackTrace();
	}
	if(message.equals("")){
		result = json.toJson(new MessageResponse(false,language,obs));
	}else{
		result = json.toJson(new MessageResponse(true,language,obs));
	}
	return result;
}
	
@RequestMapping(value = {"/service/action/getUserActions"}, method = RequestMethod.GET)
public String getUserActions(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	ArrayList<ArrayList<String>> userData  = chbdb.getUserActions();
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(userData);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/action/getUserNotes"}, method = RequestMethod.GET)
public String getUserNotes(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	String sid = request.getParameter("sid").toString();
	User user = chbdb.getUser(sid);
	// criteria can be name|chart|ramq
	ArrayList<Note> userNotes  = chbdb.getUserNotes(user.getIduser());
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(userNotes);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/action/readPatientNote"}, method = RequestMethod.GET)
public String readPatientNote(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	String sid = request.getParameter("sid").toString();
	String noteid = request.getParameter("noteid").toString();
	User user = chbdb.getUser(sid);
	chbdb.readPatientNote(noteid);
	ArrayList<Object> obs = new ArrayList<Object>();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}

@RequestMapping(value = {"/service/action/setEvent"}, method = RequestMethod.GET)
public String setEvent(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String language = request.getParameter("language").toString();
	String sid = request.getParameter("sid").toString();
	String eventCode = request.getParameter("eventcode").toString();
	User user = chbdb.getUser(sid);
	Action a = chbdb.getAction(eventCode);
	Session session = chbdb.isValidSession(sid);
	if(session != null){
		chbdb.setUserSession(session);
	}
	chbdb.setEvent(user.getIduser(), a.getIdaction(), "1", sid);
	ArrayList<Object> obs = new ArrayList<Object>();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}

@RequestMapping(value = {"/service/action/deletePatientNote"}, method = RequestMethod.GET)
public String deletePatientNote(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	String sid = request.getParameter("sid").toString();
	String noteid = request.getParameter("noteid").toString();
	User user = chbdb.getUser(sid);
	chbdb.deletePatientNote(noteid);
	ArrayList<Object> obs = new ArrayList<Object>();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/action/getUserActionsTop5Dataset"}, method = RequestMethod.GET)
public String getUserActionsTop5Dataset(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	ArrayList<ArrayList<Object>> userData  = chbdb.getUserActionsTop5Dataset();
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(userData);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/action/getUserTop5Dataset"}, method = RequestMethod.GET)
public String getUserTop5Dataset(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	ArrayList<ArrayList<Object>> userData  = chbdb.getUserTop5Dataset();
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(userData);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}


@RequestMapping(value = {"/service/action/getUserReportHistory"}, method = RequestMethod.GET)
public String getUserReportHistory(final HttpServletRequest request) throws FileNotFoundException{
	Gson json = new Gson();
	ArrayList<Object> obs = new ArrayList<Object>();
	String result = "";
	String language = request.getParameter("language").toString();
	String iduser = request.getParameter("iduser").toString();
	String sort = request.getParameter("sort").toString();
	ArrayList<HashMap> userReports = new ArrayList<>();
	
	File historyFolder = new File(reportsFolder+System.getProperty("file.separator")+"history");
	if(historyFolder.exists()) {
		String filePrefix = "CR_"+iduser;
		File[] files = historyFolder.listFiles(new FileFilterTool(".json", filePrefix));
		for(int i=0;i<files.length;i++) {
			try {
				File r = files[i];
				JsonReader jr = new JsonReader(new FileReader(r));
				JsonObject jo = JsonParser.parseReader(jr).getAsJsonObject();
				HashMap<String, String> rep = new HashMap<>();
				rep.put("id", jo.get("id").getAsString());
				rep.put("note", jo.get("note").getAsString());
				rep.put("generated", jo.get("generated").getAsString());
				rep.put("title", jo.get("title").getAsString());
				rep.put("type", jo.get("type").getAsString());
				userReports.add(rep);
				jr.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	if(sort.equals("asc")) {
		Collections.sort(userReports, new Comparator<HashMap>() {
		  public int compare(HashMap o1, HashMap o2) {
			  final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			  LocalDateTime dateTime1 = LocalDateTime.parse(o1.get("generated").toString(), formatter);
			  LocalDateTime dateTime2 = LocalDateTime.parse(o2.get("generated").toString(), formatter);
		      return  dateTime1.compareTo(dateTime2) ;
		  }
		});
	}else {
		Collections.sort(userReports, new Comparator<HashMap>() {
		  public int compare(HashMap o1, HashMap o2) {
			  final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			  LocalDateTime dateTime1 = LocalDateTime.parse(o1.get("generated").toString(), formatter);
			  LocalDateTime dateTime2 = LocalDateTime.parse(o2.get("generated").toString(), formatter);
		      return  dateTime2.compareTo(dateTime1) ;
		  }
		});
	}
	
	obs.add(userReports);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}


@RequestMapping(value = {"/service/action/saveReport"}, method = RequestMethod.POST)
public String saveReport(final HttpServletRequest request, @RequestBody String payload){
	Gson json = new Gson();
	String result = "";
	JsonParser jp = new JsonParser();
	String language = request.getParameter("language").toString();
	String iduser = request.getParameter("iduser").toString();
	
	Gson gson = new Gson();
    JsonParser parser = new JsonParser();
    JsonObject jObject = parser.parse(payload).getAsJsonObject();
    
    jObject.addProperty("iduser", iduser);
    String reportCode = cdisdb.saveReport(jObject);
    jObject.addProperty("id", reportCode);
    User usr = chbdb.getUser(iduser);
    jObject.addProperty("owner", usr.getFirstname()+" "+usr.getLastname());
    String reportStr = jObject.toString();
    FileOutputStream fop = null;
	try {
		File reportFile = new File(reportsFolder+System.getProperty("file.separator")+"report.PERSONAL"+reportCode);
		fop = new FileOutputStream(reportFile);
		if (!reportFile.exists()) {
			reportFile.createNewFile();
		}
		// get the content in bytes
		byte[] contentInBytes = reportStr.getBytes();

		fop.write(contentInBytes);
		fop.flush();
		fop.close();
		
		
	} catch (IOException e) {
		e.printStackTrace();
	}
    
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(jObject);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/action/getScheduleVisit"}, method = RequestMethod.GET)
public String getScheduleVisit(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	String sid = request.getParameter("sid").toString();
	String idpatient = request.getParameter("idpatient").toString();
	String iduser = request.getParameter("iduser").toString();
	ScheduleVisit sv  = chbdb.getScheduleVisit(idpatient,iduser);
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(sv);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/action/setScheduleVisit"}, method = RequestMethod.GET)
public String setScheduleVisit(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	String sid = request.getParameter("sid").toString();
	String idschedule = request.getParameter("idschedule").toString();
	String idpatient = request.getParameter("idpatient").toString();
	String iduser = request.getParameter("iduser").toString();
	String scheduledate = request.getParameter("scheduledate").toString();
	String idprofesion = request.getParameter("idprofesion").toString();
	String frequency = request.getParameter("frequency").toString();
	String hcpcode = request.getParameter("zone").toString();
	boolean flag  = chbdb.setScheduleVisit(idschedule,iduser,idpatient,scheduledate,idprofesion,frequency);
	boolean flag1 = cdisdb.setOneHcpOfPatient(idpatient, iduser, hcpcode);
	ArrayList<Object> obs = new ArrayList<Object>();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}

@RequestMapping(value = {"/service/action/writeReportFile"}, method = RequestMethod.GET)
public void writeReportFile(String reportCode, String content){
	try {
		File reportFile = new File(reportsFolder+System.getProperty("file.separator")+"report."+reportCode);
		Writer writer = new FileWriter(reportFile);
		writer.write(content);
		writer.close();
	} catch (IOException e) {
		e.printStackTrace();
	}
}

@RequestMapping(value = {"/service/action/writeOutcomeFile"}, method = RequestMethod.GET)
public void writeOutcomeFile(String outcomeFile, String content){
	
	try {
		File reportFile = new File(reportsFolder+System.getProperty("file.separator")+"outcomes"+System.getProperty("file.separator")+outcomeFile);
		Writer writer = new FileWriter(reportFile);
		writer.write(content);
		writer.close();
	} catch (IOException e) {
		e.printStackTrace();
	}
}

@RequestMapping(value = {"/service/action/generateDataReport"}, method = RequestMethod.GET)
public String generateDataReport(final HttpServletRequest request){
		Gson json = new Gson();
		String result = "";
		JsonParser jp = new JsonParser();
		String reportCode = request.getParameter("rep").toString();
		try {
			File reportFile = new File(reportsFolder+System.getProperty("file.separator")+"report."+reportCode);
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
			Gson gson = new Gson();
		    JsonParser parser = new JsonParser();
		    JsonElement je = parser.parse(new FileReader(reportFile));
		    JsonObject jObject = je.getAsJsonObject();
		    JsonArray jArrayC = jObject.get("criteria").getAsJsonArray();
		    JsonArray jArraySC = jObject.get("subcriteria").getAsJsonArray();
		    JsonArray jArrayI = jObject.get("input").getAsJsonArray();
		    String reportType = jObject.get("type").getAsString();
		    String reportId = jObject.get("id").getAsString();
		    
		    ArrayList<Object> header = new ArrayList<Object>();
		    ArrayList<Object> datasets = new ArrayList<Object>();
		    Hashtable<String, Object> dataObject = new Hashtable<>();
		    jObject.addProperty("generated", sdf.format(new Date()));
		    
		    if(reportType.equals("graph")){
			    ArrayList<ReportCriteria> lcs = new ArrayList<ReportCriteria>();
			    ArrayList<ReportSubcriteria> slcs = new ArrayList<ReportSubcriteria>();
			    for(JsonElement obj : jArrayC ){
			        ReportCriteria cse = gson.fromJson( obj , ReportCriteria.class);
			        cse.setIddata(cdisdb.getIddata(cse.getName()));
			        //cse.loadIddata();
			        lcs.add(cse);
			    }
			    
			    for(JsonElement obj : jArraySC ){
			        ReportSubcriteria scse = gson.fromJson( obj , ReportSubcriteria.class);
			        scse.setSubiddata(cdisdb.getIddata(scse.getSubname()));
			        //scse.loadIddata();
		        	slcs.add(scse);
			    }
			    
			    //build subcriteria from input if exists 
			    ArrayList<ArrayList<ReportSubcriteria>> matrix = new ArrayList<>();
			    
			    for(int iobj=0;iobj<jArrayI.size();iobj++){
			        JsonObject input = jArrayI.get(iobj).getAsJsonObject();
			        String iname = input.get("name").getAsString();
			        
			        if(matrix.size() > 0){
			        	JsonArray varr = input.get("values").getAsJsonArray();
			        	int ml = matrix.size();
			        	
			        	for(int jj=0;jj<varr.size();jj++){
			        		ReportSubcriteria scs1 = new ReportSubcriteria();
			 		        for(JsonElement sobj : jArraySC ){
			 			        scs1 = gson.fromJson( sobj , ReportSubcriteria.class);
			 			        if(scs1.getSubname().equals(iname)){break;}
			 			    }
			        		scs1.setSubvalue(Integer.toString(jj));
			        		if(iname.equals("idcommunity") && scs1.getSubvalue().equals("0")){scs1.setSuboperator("more than");}
			        		for(int ii=0;ii<ml;ii++){
			        			ArrayList<ReportSubcriteria> ars1 = new ArrayList<>();
				        		ArrayList<ReportSubcriteria> ars = matrix.get(ii);
				        		for(ReportSubcriteria xx : ars){
				        			ars1.add(xx);
				        		}

			        			//ars1 = ars;
				        		ars1.add(scs1);

					        	matrix.add(ars1);
				        	}
			        	}
			        	
			        	for(int iii=0;iii<ml;iii++){
			        		ArrayList<ReportSubcriteria> d1 = matrix.get(0);
			        		matrix.remove(0);
			        	}
			        	
			        }else{
			        	JsonArray varr = input.get("values").getAsJsonArray();
			        	for(int j=0;j<varr.size();j++){
			        		ArrayList<ReportSubcriteria> arsc = new ArrayList<>();
			        		ReportSubcriteria scs1 = new ReportSubcriteria();
			 		        for(JsonElement sobj : jArraySC ){
			 			        scs1 = gson.fromJson( sobj , ReportSubcriteria.class);
			 			        if(scs1.getSubname().equals(iname)){break;}
			 			    }
			        		scs1.setSubvalue(Integer.toString(j));
			        		if(iname.equals("idcommunity") && scs1.getSubvalue().equals("0")){scs1.setSuboperator("more than");}
			        		arsc.add(scs1);
			        		matrix.add(arsc);
			        	}
			        }
			    }

			    for(int x=0;x<matrix.size();x++){
			    	ArrayList<ReportSubcriteria> sc = matrix.get(x);
				    ArrayList<ArrayList<String>> set = new ArrayList<>();
				    Hashtable<ReportCriteria, ArrayList<ArrayList<String>>> map = new Hashtable<>();
			    	for(int i=0;i<lcs.size();i++){
			    		ReportCriteria rc = lcs.get(i);
			    		if(!header.contains(rc.getDisplay())){
			    			header.add(rc.getDisplay());
			    		}
			    		//ArrayList<ArrayList<String>> criteriaSet = cdisdb.executeReport(rc, reportType, sc);
			    		ArrayList<ArrayList<String>> criteriaSet = cdisdb.executeReportBackupMethod(rc, reportType, sc);
			    		map.put(rc, criteriaSet);
			    	}
		    		ArrayList<String> setLine = new ArrayList<>();
		    		for(int jj=0;jj<lcs.size();jj++){
		    			ArrayList<ArrayList<String>> criteriaSet = map.get(lcs.get(jj));
		    			if(criteriaSet.size() > 0){
		    				setLine.add(criteriaSet.get(0).get(2));
		    			}else{
		    				setLine.add("0");
		    			}
		    		}
				    Hashtable<String, Object> dataset = new Hashtable<>();
				    for(ReportSubcriteria r : sc ){
				    	dataset.put(r.getSubname(), r.getSubvalue());
				    }
					dataset.put("set", setLine);
				    datasets.add(dataset);
			    }
		    }else if(reportType.equals("flist")){
		    	 for(JsonElement obj : jArrayC ){
				        ReportCriteria cse = gson.fromJson( obj , ReportCriteria.class);
				        HashMap<String, String> col = new HashMap<>();
				        //header.add(cse.getDisplay());
				        col.put("name", cse.getName());
				        col.put("display", cse.getDisplay());
				        col.put("type", cse.getType());
				        col.put("format", cse.getFormat());
				        header.add(col);
				        /*
				        if(cse.getDate().equals("yes")){
				        	HashMap<String, String> cold = new HashMap<>();
				        	cold.put("name", cse.getDatename());
				        	cold.put("display", cse.getDatedisplay());
				        	cold.put("type", "date");
				        	cold.put("format", cse.getDateformat());
				        	header.add(cold);
				        }
				        */
				    }
		    	 String dataName = reportId.substring("LIST.".length()).toLowerCase();
		    	 datasets = executeReportFlist(dataName, jArrayC, jArraySC); 
		    	 
		    }else if(reportType.equals("locallist")){
		    	 JsonArray hdr = jObject.get("data").getAsJsonObject().get("header").getAsJsonArray();
		    	 for(JsonElement obj : hdr ){header.add(obj);}
		    	 datasets = executeReportLocalList(); 
		    	 
		    }else if(reportType.equals("nohba1c")){
		    	 JsonArray hdr = jObject.get("data").getAsJsonObject().get("header").getAsJsonArray();
		    	 for(JsonElement obj : hdr ){header.add(obj);}
		    	 datasets = executeReportNoHBA1c(); 
		    	 
		    }
		    
		    dataObject.put("header",header);
		    dataObject.put("datasets",datasets);
			
			jObject.add("data", json.toJsonTree(dataObject));
			writeReportFile(reportCode, jObject.toString());
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	return "REPORT "+ reportCode+" GENERATED";
}
	
@RequestMapping(value = {"/service/action/generateDataGraph"}, method = RequestMethod.GET)
public String generateDataGraph(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	JsonParser jp = new JsonParser();
	String dataset = request.getParameter("dataset").toString();
	
	try {
		Gson gson = new Gson();
	    JsonParser parser = new JsonParser();
	    
	    if (dataset.equals("trend")){
	    	//get ticks for trend graph
	    	//get labels for trend graph
	    	//get series for trend graph
	    	//should be like 3 series negative = improved , positive trend = setback , constant trend
	    	//variables for the function should be  idcommunity, sex, dateperiod, dype
	    	// dateperiod = last 3 monts means dates from the last 3 months  means 12 weeks  alltime = 24 months = 96 weeks
	    	int dateperiod = 96;
	    	int idc = 0;
	    	int gen = 0;
	    	ArrayList<Integer> dtypes = new ArrayList<>();
	    	dtypes.add(1);
	    	dtypes.add(2);
	    }
		
	} catch (Exception e) {
		e.printStackTrace();
	}
	return "DATA GRAPH GENERATED";
}
	
@RequestMapping(value = {"/service/action/executeReportFlist"}, method = RequestMethod.GET)
public ArrayList<Object> executeReportFlist(String dataName, JsonArray criterias, JsonArray subcriterias){
	ArrayList<Object> result = new ArrayList<>();
	Gson json = new Gson();
	Hashtable<String, Object> datasetObject = new Hashtable<>();
	for(JsonElement obj : subcriterias ){
	        ReportSubcriteria scse = json.fromJson( obj , ReportSubcriteria.class);
	        datasetObject.put(scse.getSubname(), scse.getSubvalue());
	}
	
	List<Map<String, Object>> dataset = cdisdb.executeReportFlist(dataName, criterias);
	datasetObject.put("set",dataset);
	result.add(datasetObject);
	return result;
}

@RequestMapping(value = {"/service/action/executeReportLocalList"}, method = RequestMethod.GET)
public ArrayList<Object> executeReportLocalList(){
	ArrayList<Object> result = new ArrayList<>();
	result = cdisdb.executeReportLocalList();
	return result;
}

@RequestMapping(value = {"/service/action/executeReportNoHBA1c"}, method = RequestMethod.GET)
public ArrayList<Object> executeReportNoHBA1c(){
	ArrayList<Object> result = new ArrayList<>();
	result = cdisdb.executeReportNoHBA1c();
	return result;
}

@RequestMapping(value = {"/service/action/generateDataOutcomes"}, method = RequestMethod.GET)
public String generateDataOutcomes(final HttpServletRequest request){
	String result = "";
	JsonParser jp = new JsonParser();
	try {
		
		Gson gson = new Gson();

	    Hashtable<String,ArrayList<Hashtable<String,String>>> t12 = cdisdb.getHbA1cTrend("1_2");
	    Iterator<String> t12keys = t12.keySet().iterator();
	    Hashtable<String, String> t12totals = new Hashtable<>();
	    while(t12keys.hasNext()){
	    	String key = t12keys.next();
	    	ArrayList<Hashtable<String,String>> month = t12.get(key);
	    	int tt = 0;
	    	for(int i=0;i<month.size();i++){
	    		Hashtable<String, String> line = month.get(i);
	    		tt+=Integer.parseInt(line.get("n"));
	    	}
	    	t12totals.put(key, Integer.toString(tt));
	    	String outcomeFile = "t."+key.replace("m", "")+".1_2";
	    	String content = gson.toJson(month);
	    	writeOutcomeFile(outcomeFile, content);
	    }
	    String t12tout  = "tt.1_2";
	    String t12tcontent = gson.toJson(t12totals);
	    writeOutcomeFile(t12tout, t12tcontent);
	    
	    Hashtable<String,ArrayList<Hashtable<String,String>>> tpdm = cdisdb.getHbA1cTrend("3");
	    Iterator<String> tpdmkeys = tpdm.keySet().iterator();
	    Hashtable<String, String> tpdmtotals = new Hashtable<>();
	    while(tpdmkeys.hasNext()){
	    	String key = tpdmkeys.next();
	    	ArrayList<Hashtable<String,String>> month = tpdm.get(key);
	    	int tt = 0;
	    	for(int i=0;i<month.size();i++){
	    		Hashtable<String, String> line = month.get(i);
	    		tt+=Integer.parseInt(line.get("n"));
	    	}
	    	tpdmtotals.put(key, Integer.toString(tt));
	    	String outcomeFile = "t."+key.replace("m", "")+".3";
	    	String content = gson.toJson(month);
	    	writeOutcomeFile(outcomeFile, content);
	    }
	    String tpdmtout  = "tt.3";
	    String tpdmtcontent = gson.toJson(tpdmtotals);
	    writeOutcomeFile(tpdmtout, tpdmtcontent);
	    
	    
	    Hashtable<String,ArrayList<Hashtable<String,String>>> p12 = cdisdb.getHbA1cPeriod("1_2");
	    Iterator<String> p12keys = p12.keySet().iterator();
	    Hashtable<String, String> p12totals = new Hashtable<>();
	    while(p12keys.hasNext()){
	    	String key = p12keys.next();
	    	ArrayList<Hashtable<String,String>> month = p12.get(key);
	    	int tt = 0;
	    	for(int i=0;i<month.size();i++){
	    		Hashtable<String, String> line = month.get(i);
	    		tt+=Integer.parseInt(line.get("n"));
	    	}
	    	p12totals.put(key, Integer.toString(tt));
	    	String outcomeFile = "p."+key.replace("m", "")+".1_2";
	    	String content = gson.toJson(month);
	    	writeOutcomeFile(outcomeFile, content);
	    }
	    String p12tout  = "tp.1_2";
	    String p12tcontent = gson.toJson(p12totals);
	    writeOutcomeFile(p12tout, p12tcontent);
	    

	    Hashtable<String,ArrayList<Hashtable<String,String>>> ppdm = cdisdb.getHbA1cPeriod("3");
	    Iterator<String> ppdmkeys = ppdm.keySet().iterator();
	    Hashtable<String, String> ppdmtotals = new Hashtable<>();
	    while(ppdmkeys.hasNext()){
	    	String key = ppdmkeys.next();
	    	ArrayList<Hashtable<String,String>> month = ppdm.get(key);
	    	int tt = 0;
	    	for(int i=0;i<month.size();i++){
	    		Hashtable<String, String> line = month.get(i);
	    		tt+=Integer.parseInt(line.get("n"));
	    	}
	    	ppdmtotals.put(key, Integer.toString(tt));
	    	String outcomeFile = "p."+key.replace("m", "")+".3";
	    	String content = gson.toJson(month);
	    	writeOutcomeFile(outcomeFile, content);
	    }
	    String ppdmtout  = "tp.3";
	    String ppdmtcontent = gson.toJson(ppdmtotals);
	    writeOutcomeFile(ppdmtout, ppdmtcontent);
	    
	    Hashtable<String,ArrayList<Hashtable<String,String>>> v12 = cdisdb.getHbA1cValue("1_2");
	    Iterator<String> v12keys = v12.keySet().iterator();
	    Hashtable<String, String> v12totals = new Hashtable<>();
	    while(v12keys.hasNext()){
	    	String key = v12keys.next();
	    	ArrayList<Hashtable<String,String>> month = v12.get(key);
	    	int tt = 0;
	    	for(int i=0;i<month.size();i++){
	    		Hashtable<String, String> line = month.get(i);
	    		tt+=Integer.parseInt(line.get("n"));
	    	}
	    	v12totals.put(key, Integer.toString(tt));
	    	String outcomeFile = "v."+key.replace("m", "")+".1_2";
	    	String content = gson.toJson(month);
	    	writeOutcomeFile(outcomeFile, content);
	    }
	    String v12tout  = "tv.1_2";
	    String v12tcontent = gson.toJson(v12totals);
	    writeOutcomeFile(v12tout, v12tcontent);
	    

	    Hashtable<String,ArrayList<Hashtable<String,String>>> vpdm = cdisdb.getHbA1cValue("3");
	    Iterator<String> vpdmkeys = vpdm.keySet().iterator();
	    Hashtable<String, String> vpdmtotals = new Hashtable<>();
	    while(vpdmkeys.hasNext()){
	    	String key = vpdmkeys.next();
	    	ArrayList<Hashtable<String,String>> month = vpdm.get(key);
	    	int tt = 0;
	    	for(int i=0;i<month.size();i++){
	    		Hashtable<String, String> line = month.get(i);
	    		tt+=Integer.parseInt(line.get("n"));
	    	}
	    	vpdmtotals.put(key, Integer.toString(tt));
	    	String outcomeFile = "v."+key.replace("m", "")+".3";
	    	String content = gson.toJson(month);
	    	writeOutcomeFile(outcomeFile, content);
	    }
	    String vpdmtout  = "tv.3";
	    String vpdmtcontent = gson.toJson(vpdmtotals);
	    writeOutcomeFile(vpdmtout, vpdmtcontent);
	    
	} catch (Exception e) {
		e.printStackTrace();
	}
	return "Outcome files GENERATED";
}

@RequestMapping(value = {"/service/action/getImportOmnilabFiles"}, method = RequestMethod.GET)
public String getImportOmnilabFiles(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String period = request.getParameter("period").toString();
	
	int p = Integer.parseInt(period)*-1;
	ArrayList<Object> obs = new ArrayList<Object>();
	
	try {
		
		//String rf = (String) ic.lookup("reports-folder");
		File importFolder = new File(reportsFolder+System.getProperty("file.separator")+"import");
		FileFilter fileFilter = new FileFilter(){
	         public boolean accept(File dir) {          
	            if (dir.isFile()) {
	            	String dName = dir.getName();
	            	String extension = dName.substring(dName.lastIndexOf(".")+1);
	            	if(extension.equals("json")){
	            		return true;
	            	}else{
	            		return false;
	            	}
	            } else {
	               return false;
	            }
	         }
	      };
	     
	     File[] list = importFolder.listFiles(fileFilter);
	     ArrayList<String> files = new ArrayList<>();
	     for(int i=0;i<list.length;i++){
	    	 String fn = list[i].getName();
	    	 Date curentDate = new Date();
	    	 
	    	 DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
	    	 Date fileDate = dateFormat.parse(fn.substring(fn.lastIndexOf("_")+1 ,fn.lastIndexOf(".")));
	         String todate = dateFormat.format(curentDate);

	         Calendar cal = Calendar.getInstance();
	         cal.add(Calendar.DATE, p);
	         Date todate1 = cal.getTime();    
	         String fromdate = dateFormat.format(todate1);
	         
	         if(fileDate.after(todate1)){
	        	 files.add(fn);
	         }
	         /*
	    	 if(fn.indexOf(fromdate) >=0 ){
	    		 files.add(fn);
	    	 }
	    	 */
	     }
	     result = json.toJson(files);
	} catch (Exception e) {
		e.printStackTrace();
	} 
	return result;
}



@RequestMapping(value = {"/service/action/deleteUserReportHistory"}, method = RequestMethod.GET)
public String deleteUserReportHistory(final HttpServletRequest request){
	Gson json = new Gson();
	ArrayList<Object> obs = new ArrayList<Object>();
	String result = "";
	String language = request.getParameter("language").toString();
	String idreport = request.getParameter("idreport").toString();
	String fileName = idreport+".json";
	File reportFile = new File(reportsFolder+System.getProperty("file.separator")+"history"+System.getProperty("file.separator")+fileName);
	boolean flag = false;
	try {
        Files.delete(Paths.get(reportFile.getAbsolutePath()));
        flag= true;
    } catch (IOException e) {
        e.printStackTrace();
    }
	
	/*
	if(reportFile.exists()) {
		flag = reportFile.delete();
	}
	//obs.add(userReports);
	 * 
	 */
	result = json.toJson(new MessageResponse(flag,language,obs));
	return result;
}


}
