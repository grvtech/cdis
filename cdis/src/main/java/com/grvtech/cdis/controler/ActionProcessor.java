package com.grvtech.cdis.controler;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Set;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import com.grvtech.cdis.model.Event;
import com.grvtech.cdis.model.MessageResponse;
import com.grvtech.cdis.model.Note;
import com.grvtech.cdis.model.Renderer;
import com.grvtech.cdis.model.Report;
import com.grvtech.cdis.model.ReportCriteria;
import com.grvtech.cdis.model.ReportSubcriteria;
import com.grvtech.cdis.model.Role;
import com.grvtech.cdis.model.ScheduleVisit;
import com.grvtech.cdis.model.Session;

//import com.grv.cdis.model.SearchPatient;
import com.grvtech.cdis.model.User;
import com.grvtech.cdis.util.FileTool;
import com.grvtech.cdis.util.ImportNames;
import com.grvtech.cdis.util.MailTool;
import com.grvtech.cdis.util.Misc;



@RestController
public class ActionProcessor {
	
	@Autowired
	ChbDBridge chbdb;
	
	@Autowired
	CdisDBridge cdisdb;
	
	@Value("${frontpage}")
	private String frontpageFile;
	
	@Value("${reports}")
	private String reportsFolder;
	
	/*
	 * /ncdis/service/action/login?username=XXXXX&password=&language=en|fr
	 * */
@RequestMapping(value = {"/service/action/loginSession"}, method = RequestMethod.GET)
public String loginSession(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String username = request.getParameter("username").toString();
	String password = request.getParameter("password").toString();
	String language = request.getParameter("language").toString();
	String reswidth = request.getParameter("reswidth").toString();
	String resheight = request.getParameter("resheight").toString();
	User user = chbdb.getUser(username, password);
	Action act = chbdb.getAction("LOGIN");
	Session userSession = null;
	
	if(!user.getIduser().equals("0")){
		String ip =  Misc.getIpAddr(request);
		String combination = ip+user.getUsername()+ (new Date()).toString();
		String idsession = DigestUtils.md5Hex(combination);
		userSession = new Session(idsession, user.getIduser(), ip, 0, 0, Integer.parseInt(reswidth),Integer.parseInt(resheight),1);
		chbdb.setUserSession(userSession);
		ArrayList<Object> obs = new ArrayList<>();
		obs.add(user);
		result = json.toJson(new MessageResponse(act,true,language,obs));
		chbdb.setEvent(user.getIduser(), act.getIdaction(), "1", userSession.getIdsession());
	}else{
		result = json.toJson(new MessageResponse(act,false,language,null));
	}
	return result;
}
	
	
	/*
	 * /ncdis/service/action/search?text=XXXXX&criteria=chart|name|ramq&language=en|fr
	 * */
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
	
	
	/*
	 * /ncdis/service/action/getReports?sid=XXXXX&language=en|fr
	 * */
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
		
		System.out.println("USER ROLE : "+r.getCode());
		
		HashMap<String, ArrayList<Report>> reports = cdisdb.getUserReports(r.getCode(), userData.getIdcommunity(), userData.getIduser());
		obs.add(reports);
		result = json.toJson(new MessageResponse(true,language,obs));
		return result;
	}

@RequestMapping(value = {"/service/action/executeReport"}, method = RequestMethod.POST)
public String executeReport(final HttpServletRequest request){
		Gson json = new Gson();
		String result = "";
		JsonParser jp = new JsonParser();
		String raw = request.getParameter("rawPost").toString();
		String language = request.getParameter("language").toString();
		String repid = "0";
		if(request.getParameter("idreport") != null){
			repid = request.getParameter("language").toString();
		}
		String owner = "";
		if(request.getParameter("owner") != null){
			owner = request.getParameter("owner").toString();
		}
		String type = "list";
		if(request.getParameter("type") != null){
			type = request.getParameter("type").toString();
		}
		
		String graphtype = "none";
		if(request.getParameter("graphtype") != null){
			graphtype = request.getParameter("graphtype").toString();
		}
		
		String title = "Custom Report";
		if(request.getParameter("title") != null){
			title = request.getParameter("title").toString();
		}
		
		String subcriteriatype = "multi"; //multi or single multi - set combined with all sub criterias; single set split by subcriteria
		if(request.getParameter("subcriteriatype") != null){
			subcriteriatype = request.getParameter("subcriteriatype").toString();
		}
		
		/*
		 * cache conditions:
		 * 
		 * is last add data > timestame cache then execute report + store cache
		 * after each import data execute reports with flag store cache directly
		 * 
		 * */
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		
		Gson gson = new Gson();
	    JsonParser parser = new JsonParser();
	    JsonObject jObject = parser.parse(raw).getAsJsonObject();
	    
	    //System.out.println(raw);
	    
	    
	    JsonArray jArrayC = jObject.get("criteria").getAsJsonArray();
	    JsonArray jArraySC = jObject.get("subcriteria").getAsJsonArray();

	    ArrayList<ReportCriteria> lcs = new ArrayList<ReportCriteria>();
	    ArrayList<ReportSubcriteria> slcs = new ArrayList<ReportSubcriteria>();

	    
	    String filter = "all";
	    String hcp = "";
	    String hcpid = "";
	   
	    
	    if(jObject.has("filter")){
	    	filter = jObject.get("filter").getAsString();
			hcp = jObject.get("hcp").getAsString();
			hcpid = jObject.get("hcpid").getAsString();
	    }
	    
		
	   
	    
	    for(JsonElement obj : jArrayC ){
	        ReportCriteria cse = gson.fromJson( obj , ReportCriteria.class);
	        cse.loadIddata();
	        lcs.add(cse);
	    }
	    for(JsonElement obj : jArraySC ){
	        ReportSubcriteria scse = gson.fromJson( obj , ReportSubcriteria.class);
	        scse.loadIddata();
	        //System.out.println("SUBCRITERIA : "+scse.getSuboperator()+"   VALUE : "+ scse.getSubvalue());
        	slcs.add(scse);
	    }
	    ArrayList<String> header = new ArrayList<>();
	    ArrayList<ArrayList<String>> set = new ArrayList<>();
	    //ArrayList<Object> graphdata = new ArrayList<>();
	    
	    if(type.equals("list")){
	    	ArrayList<String> allIdpatients = new ArrayList<>();
	    	
	    	//System.out.println("Filter : "+filter+"    hcp:"+hcp+"    hcpid:"+hcpid);
	    	
	    	if(filter.equals("all")){
	    		allIdpatients = cdisdb.getIdPatients();
	    	}else{
	    		allIdpatients = cdisdb.getIdFilterPatients(hcp,hcpid);
	    	}
	    	
	    	ArrayList<String> idpatients = allIdpatients;
	    	
	    	
	    	Hashtable<String, ArrayList<ArrayList<String>>> report = new Hashtable<>();
		    for(int i=0;i<lcs.size();i++){
		    	ReportCriteria rc = lcs.get(i);
		    	
		    	header.add(rc.getDisplay());
		    	if(rc.getDate().equals("yes")){
		    		header.add(rc.getDatedisplay());
		    	}
		    	
		    		//list : count | idpatient | key | value | date 
			    	//graph : count | key | value 
		    		
			    	ArrayList<ArrayList<String>> criteriaSet = cdisdb.executeReport(rc, "list", slcs);
			    	
			    	report.put(rc.getName(), criteriaSet);
			    	ArrayList<String> criteriaPatients = new ArrayList<>();
			    	for(int ii=0;ii<criteriaSet.size();ii++){
			    		ArrayList<String> line = criteriaSet.get(ii);
			    		String idp = line.get(1);
			    		if(!criteriaPatients.contains(idp)){
			    			criteriaPatients.add(idp);
			    		}
			    	}
			    	
			    	if(rc.getType().equals("set")){
			    		
			    		int rem = 0;
			    		int iter = 0;
			    		int iterfound = 0;
			    		ArrayList<String> toRemove = new ArrayList<>();
			    		
			    		
			    		for(int k=0;k<idpatients.size();k++){
			    			String idpatientP = idpatients.get(k);
			    			if(!criteriaPatients.contains(idpatientP)){
		    					if(!toRemove.contains(idpatientP)){
		    						toRemove.add(idpatientP);
		    					}
			    			}
			    		}
			    		idpatients.removeAll(toRemove);
			    	}else{
			    		
			    		ArrayList<String> toRemove = new ArrayList<>();
			    		if(criteriaPatients.size() > idpatients.size()){
			    			for(String idpatient : criteriaPatients){
			    				if(!idpatients.contains(idpatient)){
			    					if(!toRemove.contains(idpatient)){
			    						toRemove.add(idpatient);
			    					}
			    				}
			    			}
			    		}
			    		idpatients.removeAll(toRemove);
			    	}
		    }	
		    
		    for(int x=0;x<idpatients.size();x++){
		    	String idpat = idpatients.get(x);
		    	Hashtable<ReportCriteria, ArrayList<ArrayList<String>>> patientMap = new Hashtable<>();
		    	
		    	for(int y=0;y<lcs.size();y++){
		    		ReportCriteria rcc = lcs.get(y);
		    		String rccName = rcc.getName();
		    		boolean hasCD = false;
		    		if(rcc.getDate().equals("yes")){
		    			hasCD = true;
		    		}
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
		    			
		    			if(r.getName().equals("dtype")){
		    				
		    				if(q >= rpset.size()){
		    					if(rpset.size() == 0){
		    						setLine.add("");
			    					if(r.getDate().equals("yes")){
			    						setLine.add("");
			    					}
		    					}else{
		    						
			    					ArrayList<String> rpsetLine = rpset.get(rpset.size()-1);
			    					setLine.add(rpsetLine.get(3));
			    					if(r.getDate().equals("yes")){
			    						setLine.add(rpsetLine.get(4));
			    					}
		    					}
		    				}else{
		    					ArrayList<String> rpsetLine = rpset.get(q);
		    					setLine.add(rpsetLine.get(3));
		    					if(r.getDate().equals("yes")){
		    						setLine.add(rpsetLine.get(4));
		    					}
		    				}
		    				/**/
		    			}else{
		    				//ArrayList<ArrayList<String>> rpset = patientMap.get(r);
		    				
		    				
		    				if(rpset.size() > 0){
				    			if(r.getSection().equals("1")){
				    				//the set size is 1
				    				ArrayList<String> rpsetLine = rpset.get(0);
				    				setLine.add(rpsetLine.get(3));
				    			}else{
				    				
				    				if(q >= rpset.size()){
				    					setLine.add(" ");
				    					if(r.getDate().equals("yes")){
				    						setLine.add(" ");
				    					}
				    				}else{
				    					ArrayList<String> rpsetLine = rpset.get(q);
				    					setLine.add(rpsetLine.get(3));
				    					if(r.getDate().equals("yes")){
				    						setLine.add(rpsetLine.get(4));
				    					}
				    				}
				    			}
		    				}else{
		    					setLine.add(" ");
		    					if(r.getDate().equals("yes")){
		    						setLine.add(" ");
		    					}
		    				}
		    			}
		    		}
		    		set.add(setLine);
		    	}
		    	/**/
		    	
		    }
		   
		    
	    }else{
	    	//graphdata = getGraphdata
	    	
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
	    	
	    	
	    }
	    	    
	    Hashtable<String, Object> reportObject = new Hashtable<>();
	    
	    reportObject.put("dataset", set);
	    reportObject.put("header", header);
		ArrayList<Object> obs = new ArrayList<Object>();
		obs.add(reportObject);
		result = json.toJson(new MessageResponse(true,language,obs));
		return result;
	}
	
	
@RequestMapping(value = {"/service/action/setFrontPageMessage"}, method = RequestMethod.GET)
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
		FileTool.setMessage(frontPageFile.getAbsolutePath(), message);
	} catch (IOException e) {
		e.printStackTrace();
	}
	
	//obs.add(reports);
	result = json.toJson(new MessageResponse(true,language,obs));
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
	MailTool.sendMailInHtml("CDIS User Message", messagEmail, FileTool.getEmailProperty("admin."+adminUser));
	
	ArrayList<Object> obs = new ArrayList<Object>();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}


@RequestMapping(value = {"/service/action/forgotPassword"}, method = RequestMethod.GET)
public String forgotPassword(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String firstnameUser = request.getParameter("firstnameUser").toString();
	String lastnameUser = request.getParameter("lastnameUser").toString();
	String usernameUser = request.getParameter("usernameUser").toString();
	String profesionUser = request.getParameter("profesionUser").toString();
	String emailUser = request.getParameter("emailUser").toString();
	String language = request.getParameter("language").toString();

	User u = chbdb.isValidUser(emailUser, usernameUser);
	if(!u.getIduser().equals("0")){
		String messagEmail = "<h2>Recovery Password</h2> <p>Hello "+u.getFirstname()+" "+u.getLastname()+"<br><br>Your password has been recovered.<br><br><b>Your username is :</b>"+u.getUsername()+"<br><b>Your password is :</b>"+u.getPassword()+"<br><br>You can now login to CDIS by clicking here : <a href='http://cdis.reg18.rtss.qc.ca/ncdis/'>go to CDIS</a></p>";
		MailTool.sendMailInHtml("CDIS Recover Password", messagEmail, emailUser);
		
		ArrayList<Object> obs = new ArrayList<Object>();
		result = json.toJson(new MessageResponse("FORGOT-TRUE",false,language,obs));
	}else{
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
		String usernameUser = lastnameUser.toLowerCase().trim()+firstnameUser.toLowerCase().substring(0,1);
		User u = chbdb.isValidUser(emailUser, usernameUser);
		if(!u.getIduser().equals("0")){
			String message = "Subscribe to CDIS \nYour information is already in CDIS database.\nIf you forgot your password you should click on forgot password link to recover your password.";
			//MailTool.sendMailText("CDIS Recover Password", message, emailUser);
			ArrayList<Object> obs = new ArrayList<Object>();
			MessageResponse mr = new MessageResponse(false,language,obs);
			mr.setMessage(message);
			result = json.toJson(mr);
		}else{
			u.setActive("0");
			u.setEmail(emailUser);
			u.setFirstname(firstnameUser);
			u.setLastname(lastnameUser);
			u.setUsername(usernameUser);
			u.setPassword("cdis2017");
			u.setIdcommunity(idcommunityUser);
			u.setIdprofesion(idprofesionUser);
			u.setPhone("GRV");
			int idPendingUser = chbdb.addUser(u);
			
			
			if(chbdb.saveUserProfile(idPendingUser, 1, 2)){
				//MailTool.sendMailText("CDIS New User Subscribe", , "support@grvtech.ca");
				
				String messagEmail = "<b><p>Hello Administrator</p></b><p>New user is subscribed to CDIS.<br>Login to CDIS and go to Users section.<br>Click on the button pending users to see the users that subscribed to CDIS but are not active yet.Click on the user to select it and click on the button Activate to allow the user to log in to CDIS.<br><br><b>An email will be sent to the user to annouce the activation.</b></p>";
				MailTool.sendMailInHtml("CDIS New User Subscribe", messagEmail, "support@grvtech.ca");
				
				String message = "Subscribe to CDIS \nYour account is sent to CDIS Administrators to be activated.\nYou will receive an email with the authentification information when your account will be activated";
				ArrayList<Object> obs = new ArrayList<Object>();
				MessageResponse mr = new MessageResponse(true,language,obs);
				mr.setMessage(message);
				result = json.toJson(mr);
				
			}else{
				ArrayList<Object> obs = new ArrayList<Object>();
				MessageResponse mr = new MessageResponse(false,language,obs);
				result = json.toJson(mr);
			}
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
		message = FileTool.getMessage(frontPageFile.getAbsolutePath());
		
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
	String noteid = request.getParameter("nojteid").toString();
	User user = chbdb.getUser(sid);
	chbdb.readPatientNote(noteid);
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
	
@RequestMapping(value = {"/service/action/saveReport"}, method = RequestMethod.GET)
public String saveReport(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	JsonParser jp = new JsonParser();
	String raw = request.getParameter("rawPost").toString();
	String language = request.getParameter("language").toString();
	String iduser = request.getParameter("iduser").toString();
	
	Gson gson = new Gson();
    JsonParser parser = new JsonParser();
    JsonObject jObject = parser.parse(raw).getAsJsonObject();
    
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
			        cse.loadIddata();
			        lcs.add(cse);
			    }
			    
			    for(JsonElement obj : jArraySC ){
			        ReportSubcriteria scse = gson.fromJson( obj , ReportSubcriteria.class);
			        scse.loadIddata();
		        	slcs.add(scse);
			    }
			    
			    //build subcriteria from input if exists 
			    ArrayList<ArrayList<ReportSubcriteria>> matrix = new ArrayList<>();
			    
			    //System.out.println("INput array size : "+jArrayI.size());
			    for(int iobj=0;iobj<jArrayI.size();iobj++){
			        JsonObject input = jArrayI.get(iobj).getAsJsonObject();
			        String iname = input.get("name").getAsString();
			        
			        if(matrix.size() > 0){
			        	JsonArray varr = input.get("values").getAsJsonArray();
			        	int ml = matrix.size();
			        	//System.out.println("freeze matrix size : "+ml);
			        	//System.out.println("start loop for subscriteria :   "+iname);
			        	
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
				        		//System.out.println("subcriteria array size in loop: "+ars.size());
				        		for(ReportSubcriteria xx : ars){
				        			ars1.add(xx);
				        		}
				        		//System.out.println("subcriteria array1 size in loop before add: "+ars1.size());
			        			//ars1 = ars;
				        		ars1.add(scs1);
				        		//System.out.println("subcriteria array1 size in loop after add: "+ars1.size());
					        	matrix.add(ars1);
				        	}
			        	}
			        	
			        	for(int iii=0;iii<ml;iii++){
			        		ArrayList<ReportSubcriteria> d1 = matrix.get(0);
			        		//System.out.println("delete array from index :"+iii+"   with size : "+d1.size());
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

	    		//System.out.println("-------------------------------------------------matrix size "+matrix.size());
			    for(int x=0;x<matrix.size();x++){
			    	ArrayList<ReportSubcriteria> sc = matrix.get(x);
				    ArrayList<ArrayList<String>> set = new ArrayList<>();
				    Hashtable<ReportCriteria, ArrayList<ArrayList<String>>> map = new Hashtable<>();
			    	for(int i=0;i<lcs.size();i++){
			    		ReportCriteria rc = lcs.get(i);
			    		if(!header.contains(rc.getDisplay())){
			    			header.add(rc.getDisplay());
			    		}
			    		ArrayList<ArrayList<String>> criteriaSet = cdisdb.executeReport(rc, reportType, sc);
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
				        if(cse.getDate().equals("yes")){
				        	HashMap<String, String> cold = new HashMap<>();
				        	cold.put("name", cse.getDatename());
				        	cold.put("display", cse.getDatedisplay());
				        	cold.put("type", "date");
				        	cold.put("format", cse.getDateformat());
				        	header.add(cold);
				        }
				    }
		    	 String dataName = reportId.substring("LIST.".length()).toLowerCase();
		    	 datasets = executeReportFlist(dataName, jArrayC, jArraySC); 
		    	 
		    }else if(reportType.equals("locallist")){
		    	 JsonArray hdr = jObject.get("data").getAsJsonObject().get("header").getAsJsonArray();
		    	 for(JsonElement obj : hdr ){header.add(obj);}
		    	 datasets = executeReportLocalList(); 
		    	 
		    }
		    
		    System.out.println("-------------------------------------------------");
		    dataObject.put("header",header);
		    dataObject.put("datasets",datasets);
			
			jObject.add("data", json.toJsonTree(dataObject));
			writeReportFile(reportCode, jObject.toString());
			System.out.println("-------------------------------------------------");
			
			System.out.println("REPORT "+ reportCode+" GENERATED");
			System.out.println("-------------------------------------------------");
			
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
	
	ArrayList<Hashtable<String, String>> dataset = cdisdb.executeReportFlist(dataName, criterias);
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


}
