package com.grvtech.cdis.controler;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.net.util.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.grvtech.cdis.db.CdisDBridge;
import com.grvtech.cdis.db.ChbDBridge;
import com.grvtech.cdis.model.Action;
import com.grvtech.cdis.model.Community;
import com.grvtech.cdis.model.Complications;
import com.grvtech.cdis.model.Depression;
import com.grvtech.cdis.model.Diabet;
import com.grvtech.cdis.model.Hcp;
import com.grvtech.cdis.model.Lab;
import com.grvtech.cdis.model.Lipid;
import com.grvtech.cdis.model.MDVisit;
import com.grvtech.cdis.model.Meds;
import com.grvtech.cdis.model.MessageResponse;
import com.grvtech.cdis.model.Miscellaneous;
import com.grvtech.cdis.model.Note;
import com.grvtech.cdis.model.Patient;
import com.grvtech.cdis.model.Profile;
import com.grvtech.cdis.model.Renal;
import com.grvtech.cdis.model.Session;
//import com.grvtech.cdis.model.SearchPatient;
import com.grvtech.cdis.model.User;
import com.grvtech.cdis.model.Value;
import com.grvtech.cdis.model.ValueLimit;
import com.grvtech.cdis.model.Values;
import com.grvtech.cdis.util.MailTool;
import com.grvtech.cdis.util.Misc;

@RestController
public class DataProcessor {
	
	
	@Autowired
	ChbDBridge chbdb;
	
	@Autowired
	CdisDBridge cdisdb;
	
	@Autowired
	MailTool mt;
	
/*
 * /service/data/getUser?iduser=XX
 * */
@RequestMapping(value = {"/service/data/getUser"}, method = RequestMethod.GET)
public String getUser(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	int iduser = Integer.parseInt(request.getParameter("iduser").toString());
	String language = request.getParameter("language").toString();
	User user = chbdb.getUser(iduser);
	if(!user.getIduser().equals("0")){
		ArrayList<Object> obs = new ArrayList<>();
		obs.add(user);
		result = json.toJson(new MessageResponse(true,language,obs));
	}else{
		result = json.toJson(new MessageResponse(false,language,null));
	}
	return result;
}
	
@RequestMapping(value = {"/service/data/getUserDashboard"}, method = RequestMethod.POST)
public String getUserDashboard(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	
	String iduser = request.getParameter("iduser").toString();
	String language = request.getParameter("language").toString();
	User user = chbdb.getUser(Integer.parseInt(iduser));
	if(!user.getIduser().equals("0")){
		Hashtable<String,ArrayList<ArrayList<String>>>  dashboard = chbdb.getUserDashboard(iduser); 
		ArrayList<Object> obs = new ArrayList<>();
		obs.add(dashboard);
		result = json.toJson(new MessageResponse(true,language,obs));
	}else{
		result = json.toJson(new MessageResponse(false,language,null));
	}
	return result;
}

@RequestMapping(value = {"/service/data/getUsers"}, method = RequestMethod.GET)
public String getUsers(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language =  request.getParameter("language").toString();
	ArrayList<Object> obs =  chbdb.getUsers();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/getHcps"}, method = RequestMethod.GET)
public String getHcps(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	String criteria = request.getParameter("criteria").toString();
	String term = request.getParameter("term").toString();
	ArrayList<Object> obs = new ArrayList<Object>();
	ArrayList<HashMap<String, String>> hcps = cdisdb.getHcps(criteria,term);
	obs.add(hcps);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/getPatientNotes"}, method = RequestMethod.GET)
public String getPatientNotes(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String ramq = request.getParameter("ramq").toString();
		
	Patient pat = cdisdb.getPatientByRamq(ramq);
	
	ArrayList<Note> notes = cdisdb.getPatientNotes(pat.getIdpatient());
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(notes);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/setPatientNotes"}, method = RequestMethod.POST)
public String setPatientNotes(final HttpServletRequest request){
		Gson json = new Gson();
		
		
		String result = "";
		String sid = request.getParameter("sid").toString();
		String language = request.getParameter("language").toString();
		String ramq = request.getParameter("ramq").toString();
		String notestr = request.getParameter("note").toString();
		String iduserto = request.getParameter("iduserto").toString();
		Session session = chbdb.isValidSession(sid);
		if(session != null){
			chbdb.setUserSession(session);
		}
		
		
		Patient pat = cdisdb.getPatientByRamq(ramq);
		User u = chbdb.getUser(sid);
		Note note = new Note("0", notestr, "", u.getIduser(), Integer.toString(pat.getIdpatient()), "1", iduserto, "0");
		int idu = Integer.parseInt(iduserto);
		User userto = chbdb.getUser(idu);
		String usertoEmail = userto.getEmail();
		if((usertoEmail != null) && (!usertoEmail.equals(""))){
			if(usertoEmail.indexOf("/") >= 0 ){
				mt.sendMailInHtml("CDIS Patient Message", "<h2>Hello Admin</h2> <p>The user "+userto.getFirstname()+" "+userto.getLastname()+" with the username  <b>"+userto.getUsername()+"</b> does not have a valid email defined. Please contact user and set the email.</p>", "support@grvtech.ca");
			}else{
				mt.sendMailInHtml("CDIS Patient Message", "<h2>Hello "+userto.getFirstname()+" "+userto.getLastname()+"</h2> <p>There is a new patient message addressed to you in CDIS.<br><br>Please login to CDIS to see the message!.<br><br><b>Thank you.</b></p>", usertoEmail);
			}
		}else{
			mt.sendMailInHtml("CDIS Patient Message", "<h2>Hello Admin</h2> <p>The user "+userto.getFirstname()+" "+userto.getLastname()+" with the username  <b>"+userto.getUsername()+"</b> does not have a valid email defined. Please contact user and set the email.</p>", "support@grvtech.ca");
		}
		
		ArrayList<Object> obs = new ArrayList<Object>();
		if(cdisdb.setPatientNotes(note)){
			result = json.toJson(new MessageResponse(true,language,obs));
			Action act = chbdb.getAction("NOTE");
			chbdb.setEvent(u.getIduser(), act.getIdaction(), "1", sid, pat.getRamq());
		}else{
			result = json.toJson(new MessageResponse(false,language,obs));
		}
		
		return result;
	}
	
@RequestMapping(value = {"/service/data/deleteUser"}, method = RequestMethod.GET)
public String deleteUser(final HttpServletRequest request){
		Gson json = new Gson();
		
		String result = "";
		String language = request.getParameter("language").toString();
		String iduser = request.getParameter("iduser").toString();
		int ius = Integer.parseInt(iduser);
		User u = chbdb.getUser(ius);
		u.setActive("0");
		chbdb.setUser(u);
		ArrayList<Object> obs = chbdb.getUsers();
		result = json.toJson(new MessageResponse(true,language,obs));
		return result;
}

@RequestMapping(value = {"/service/data/saveUser"}, method = RequestMethod.POST)
public String saveUser(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String language = request.getParameter("language").toString();
	String iduser = request.getParameter("iduser").toString();
	int ius = Integer.parseInt(iduser);
	User u = new User();
	if(!iduser.equals("0") ){
		u = chbdb.getUser(ius);
	}else {
		u.setUsername(request.getParameter("username").toString());
		u.setActive("1");
		u.setReset("1");
		//u.setPassword(request.getParameter("password").toString());
	}
	u.setFirstname(request.getParameter("firstname").toString());
	u.setLastname(request.getParameter("lastname").toString());
	u.setEmail(request.getParameter("email").toString());
	//u.setUsername(request.getParameter("username").toString());
	//u.setPassword(request.getParameter("password").toString());
	u.setPhone(request.getParameter("phone").toString());
	u.setIdcommunity(request.getParameter("idcommunity").toString());
	String profesion = request.getParameter("profession").toString();
	if(profesion.equals("1")){
		u.setIdprofesion("4");
	}else if(profesion.equals("2")){
		u.setIdprofesion("1");
	}else if(profesion.equals("3")){
		u.setIdprofesion("2");
	}else if(profesion.equals("4")){
		u.setIdprofesion("3");
	}
	
	if(!iduser.equals("0") ){
		chbdb.setUser(u);
		chbdb.setUserProfile(Integer.parseInt(u.getIduser()), 1, Integer.parseInt(request.getParameter("role").toString()));
	}else{
		int iu = chbdb.addUser(u);
		chbdb.saveUserProfile(iu, 1, Integer.parseInt(request.getParameter("role").toString()));
		String params = "rst=1&iduser="+iu;
		String server = request.getServerName();
		int port = request.getServerPort();
		String url = "https://"+server+":"+port+"/ncdis/index.html?"+Base64.encodeBase64String(params.getBytes());
		String messagEmail = "<b><p>CDIS Password reset</p></b><p>Hello <b>"+u.getFirstname()+" "+u.getLastname()+"</b></p><p> Click on the button below to reset your password<br><br><a href='"+url+"'>Reset Password</a></p>";
		mt.sendMailInHtml("CDIS Password Reset", messagEmail, u.getEmail());
		
	}
	
	ArrayList<Object> obs = chbdb.getUsers();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}

@RequestMapping(value = {"/service/data/setUserPassword"}, method = RequestMethod.GET)
public String setUserPassword(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	int iduser = Integer.parseInt(request.getParameter("iduser").toString());
	String language = request.getParameter("language").toString();
	User user = chbdb.getUser(iduser);
	user.setPassword(request.getParameter("newpassword").toString());
	
	if(!user.getIduser().equals("0")){
		chbdb.setUser(user);
		ArrayList<Object> obs = new ArrayList<>();
		obs.add(user);
		result = json.toJson(new MessageResponse(true,language,obs));
	}else{
		result = json.toJson(new MessageResponse(false,language,null));
	}
	return result;
}

@RequestMapping(value = {"/service/data/sendResetUserPassword"}, method = RequestMethod.POST)
public String sendResetUserPassword(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String language = request.getParameter("language").toString();
	String iduser = request.getParameter("iduser").toString().trim();
	String server = request.getServerName();
	int port = request.getServerPort();
	
	User user =chbdb.getUser(Integer.parseInt(iduser));
	
	if(!user.getIduser().equals("0")){
		chbdb.setResetPassword(user.getIduser(),"1");
		String params = "rst=1&iduser="+user.getIduser(); 
		String url = "https://"+server+":"+port+"/ncdis/index.html?"+Base64.encodeBase64String(params.getBytes());
		String messagEmail = "<b><p>CDIS Password reset</p></b><p>Hello <b>"+user.getFirstname()+" "+user.getLastname()+"</b></p><p> Click on the button below to reset your password<br><br><a href='"+url+"'>Reset Password</a></p>";
		mt.sendMailInHtml("CDIS Password Reset", messagEmail, user.getEmail());
		
		ArrayList<Object> obs = new ArrayList<>();
		result = json.toJson(new MessageResponse(true,language,obs));
	}else{
		result = json.toJson(new MessageResponse(false,language,null));
	}
	return result;
}

@RequestMapping(value = {"/service/data/activateUser"}, method = RequestMethod.GET)
public String activateUser(final HttpServletRequest request){
		Gson json = new Gson();
		
		MailTool mt = new MailTool();
		String result = "";
		String language = request.getParameter("language").toString();
		String iduser = request.getParameter("iduser").toString().trim();
		
		User u = chbdb.getUser(iduser);
		u.setActive("1");
		u.setPhone("");
		chbdb.setUser(u);
		
		String messagEmail = "<b><p>Hello "+u.getFirstname()+" "+u.getLastname()+"</p></b><p>Your CDIS account was activated.<br>You can login to CDIS by clicking <a href='http://cdis.reg18.rtss.qc.ca/ncdis/'>HERE</a><br> Your login information:<br><b>Username:</b>"+u.getUsername()+"<br><b>Password:</b>"+u.getPassword()+"<br><b>For any problems you can contact <a href='mailto:support@grvtech.ca'>CDIS Support</a></p>";
		mt.sendMailInHtml("CDIS User Activation", messagEmail, u.getEmail());
		
		ArrayList<Object> obs = chbdb.getUsers();
		result = json.toJson(new MessageResponse(true,language,obs));
		return result;
}

@RequestMapping(value = {"/service/data/getUserProfile"}, method = RequestMethod.GET)
public String getUserProfile(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	int iduser = Integer.parseInt(request.getParameter("iduser").toString());
	int idsystem = Integer.parseInt(request.getParameter("idsystem").toString());
	String language = request.getParameter("language").toString();
	Profile userProfile = chbdb.getUserProfile(iduser, idsystem);
	ArrayList<Object> obs = new ArrayList<>();
	obs.add(userProfile);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/getUserBySession"}, method = RequestMethod.GET)
public String getUserBySession(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	User user = chbdb.getUser(sid);
	if(!user.getIduser().equals("0")){
		ArrayList<Object> obs = new ArrayList<>();
		/*add user info*/
		obs.add(user);
		/*add user stats*/
		//Hashtable<String, Object> stats = user.getUserStats();
		//obs.add(stats);
		result = json.toJson(new MessageResponse(true,language,obs));
	}else{
		result = json.toJson(new MessageResponse(false,language,null));
	}
	return result;
}

@RequestMapping(value = {"/service/data/getUserMessages"}, method = RequestMethod.GET)
public String getUserMessages(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String iduser = request.getParameter("iduser").toString();
	String language = request.getParameter("language").toString();
	
	ArrayList<Object> obs = chbdb.getUserMessages(iduser); 
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}

@RequestMapping(value = {"/service/data/getUserSession"}, method = RequestMethod.GET)
public String getUserSession(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	int iduser = Integer.parseInt(request.getParameter("iduser").toString());
	String ip = Misc.getIpAddr(request);
	String language = request.getParameter("language").toString();
	User user = chbdb.getUser(iduser);
	if(!user.getIduser().equals("0")){
		ArrayList<Object> obs = new ArrayList<>();
		Session sess = chbdb.getUserSession(iduser, ip);

		obs.add(sess);
		result = json.toJson(new MessageResponse(true,language,obs));
	}else{
		result = json.toJson(new MessageResponse(false,language,null));
	}
	return result;
}
	
	
@RequestMapping(value = {"/service/data/isValidSession"}, method = RequestMethod.GET)
public String isValidSession(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	ArrayList<Object> obs = new ArrayList<>();
	Session sess = chbdb.isValidSession(sid);
	obs.add(sess);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/logoutSession"}, method = RequestMethod.GET)
public String logoutSession(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	chbdb.logoutSession(sid);
	result = json.toJson(new MessageResponse(true,language,null));
	return result;
}
	
	
@RequestMapping(value = {"/service/data/searchPatient"}, method = RequestMethod.GET)
public String searchPatient(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String criteria = request.getParameter("criteria").toString();
	String term = request.getParameter("term").toString();
	User user = chbdb.getUser(sid);
	Session session = chbdb.isValidSession(sid);
	if(session != null){
		chbdb.setUserSession(session);
	}
	//ArrayList<Object> obs = chb.getPatientsList(criteria,term);
	ArrayList<Object> obs = chbdb.getPatientsList(criteria,term,user);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/getABCData"}, method = RequestMethod.GET)
public String getABCData(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String idpatient = request.getParameter("idpatient").toString();
	HashMap<String, String> abc = cdisdb.getABCData(idpatient);
	ArrayList<Object> obs = new ArrayList<>();
	obs.add(abc);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/diabetByCommunity"}, method = RequestMethod.GET)
public String diabetByCommunity(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String graphtype = request.getParameter("graphtype").toString();
	ArrayList<Object> obs = new ArrayList<>();
	ArrayList<Object> series = chbdb.getDiabetByCommunity(graphtype);
	obs.add(series);
	if(graphtype.equals("pyramid")){
		ArrayList<String> coms = Community.getAllCommunities();
		obs.add(coms);
	}
	
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}

@RequestMapping(value = {"/service/data/diabetByType"}, method = RequestMethod.GET)
public String diabetByType(final HttpServletRequest request){
	Gson json = new Gson();
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	ArrayList<Object> obs = chbdb.getDiabetByType();
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/diabetByYear"}, method = RequestMethod.GET)
public String diabetByYear(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String years = request.getParameter("years").toString();
	ArrayList<Object> obs = chbdb.getDiabetByYear(years);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/getPatientRecord"}, method = RequestMethod.GET)
public String getPatientRecord(final HttpServletRequest request){
		Gson json = new GsonBuilder().serializeNulls().create();
		String result = "";
		String sid = request.getParameter("sid").toString();
		String language = request.getParameter("language").toString();
		Patient pat = null;
		String chart = null, ramq = null, id = null;
		if(request.getParameter("ramq") != null){
			ramq = request.getParameter("ramq").toString();
		}
		
		if(request.getParameter("id") != null){
			id = request.getParameter("id").toString();
		}
		ArrayList<Object> obs = new ArrayList<Object>();
		if(!ramq.equals("") && ramq != null){
			pat = cdisdb.getPatientByRamq(ramq);
		}else{
			pat = cdisdb.getPatientById(Integer.parseInt(id));
		}
		obs.add(pat);
		Hcp hcps = cdisdb.getHcpOfPatient(pat.getIdpatient());
		obs.add(hcps);
		Diabet latest_diabet = (Diabet) cdisdb.getValues("Diabet", pat.getIdpatient(),"asc");
		obs.add(latest_diabet);
		MDVisit latest_mdvisit = (MDVisit) cdisdb.getValues("MDVisit", pat.getIdpatient(),"asc");
		//obs.add(latest_mdvisit.getLatestMDVisit());
		obs.add(latest_mdvisit);
		Renal latest_renal = (Renal) cdisdb.getValues("Renal", pat.getIdpatient(),"asc");
		//obs.add(latest_renal.getLatestRenal());
		obs.add(latest_renal);
		Lipid latest_lipid = (Lipid) cdisdb.getValues("Lipid", pat.getIdpatient(),"asc");
		//obs.add(latest_lipid.getLatestLipid());
		obs.add(latest_lipid);
		Lab latest_lab = (Lab) cdisdb.getValues("Lab", pat.getIdpatient(),"asc");
		//obs.add(latest_lab.getLatestLab());
		obs.add(latest_lab);
		Complications latest_complications = (Complications) cdisdb.getValues("Complications", pat.getIdpatient(),"asc");
		//obs.add(latest_complications.getLatestComplications());
		obs.add(latest_complications);
		Miscellaneous latest_miscellaneous = (Miscellaneous) cdisdb.getValues("Miscellaneous", pat.getIdpatient(),"asc");
		//obs.add(latest_miscellaneous.getLatestMiscellaneous());
		obs.add(latest_miscellaneous);
		Meds latest_meds = (Meds) cdisdb.getValues("Meds", pat.getIdpatient(),"asc");
		obs.add(latest_meds);
		Depression latest_dep = (Depression) cdisdb.getValues("Depression", pat.getIdpatient(),"asc");
		obs.add(latest_dep);
		result = json.toJson(new MessageResponse(true,language,obs));
		Action act = chbdb.getAction("VIEWP");
		User u = chbdb.getUser(sid);
		chbdb.setEvent(u.getIduser(), act.getIdaction(), "1", sid, pat.getRamq());
		return result;
	}
	
@RequestMapping(value = {"/service/data/getPatientInfo"}, method = RequestMethod.GET)
public String getPatientInfo(final HttpServletRequest request){
	Gson json = new GsonBuilder().serializeNulls().create();
	String result = "";
	String language = request.getParameter("language").toString();
	Patient pat = null;
	String idpatient = request.getParameter("idpatient").toString();
	pat = cdisdb.getPatientById(Integer.parseInt(idpatient));
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(pat);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/getValueLimits"}, method = RequestMethod.GET)
public String getValueLimits(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String sid = request.getParameter("sid").toString();
	String value = request.getParameter("name").toString();
	String language = request.getParameter("language").toString();
	
	ValueLimit vl = cdisdb.getValueLimits(value);
	ArrayList<Object> obs = new ArrayList<Object>();
	obs.add(vl);
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/saveValue"}, method = RequestMethod.GET)
public String saveValue(final HttpServletRequest request){
		Gson json = new GsonBuilder().serializeNulls().create();
		String result = "";
		String sid = request.getParameter("sid").toString();
		String valueName = request.getParameter("valueName").toString();
		String valueDate = request.getParameter("date").toString();
		String valueValue = request.getParameter("value").toString();
		String idpatient = request.getParameter("idpatient").toString();
		String idvalue = request.getParameter("idvalue").toString();
		String language = request.getParameter("language").toString();
		Patient pat = null;
		
		Session session = chbdb.isValidSession(sid);
		if(session != null){
			chbdb.setUserSession(session);
		}
		
		boolean flag = false;
		String action = "ADDDATA";
		if(idvalue.equals("0")){
			flag = cdisdb.addValue(valueName, valueValue, valueDate, idpatient);
		}else{
			flag = cdisdb.editValue(valueName, valueValue, valueDate, idpatient, idvalue);
			action = "EDITDATA";
		}
		ArrayList<Object> obs = new ArrayList<Object>();
		
		pat = cdisdb.getPatientById(Integer.parseInt(idpatient));
		obs.add(pat);
		Hcp hcps = cdisdb.getHcpOfPatient(pat.getIdpatient());
		obs.add(hcps);
		Diabet latest_diabet = (Diabet) cdisdb.getValues("Diabet", pat.getIdpatient(),"asc");
		obs.add(latest_diabet);
		MDVisit latest_mdvisit = (MDVisit) cdisdb.getValues("MDVisit", pat.getIdpatient(),"asc");
		//obs.add(latest_mdvisit.getLatestMDVisit());
		obs.add(latest_mdvisit);
		Renal latest_renal = (Renal) cdisdb.getValues("Renal", pat.getIdpatient(),"asc");
		//obs.add(latest_renal.getLatestRenal());
		obs.add(latest_renal);
		Lipid latest_lipid = (Lipid) cdisdb.getValues("Lipid", pat.getIdpatient(),"asc");
		//obs.add(latest_lipid.getLatestLipid());
		obs.add(latest_lipid);
		Lab latest_lab = (Lab) cdisdb.getValues("Lab", pat.getIdpatient(),"asc");
		//obs.add(latest_lab.getLatestLab());
		obs.add(latest_lab);
		Complications latest_complications = (Complications) cdisdb.getValues("Complications", pat.getIdpatient(),"asc");
		//obs.add(latest_complications.getLatestComplications());
		obs.add(latest_complications);
		Miscellaneous latest_miscellaneous = (Miscellaneous) cdisdb.getValues("Miscellaneous", pat.getIdpatient(),"asc");
		//obs.add(latest_miscellaneous.getLatestMiscellaneous());
		obs.add(latest_miscellaneous);
		Meds latest_meds = (Meds) cdisdb.getValues("Meds", pat.getIdpatient(),"asc");
		obs.add(latest_meds);
		Depression latest_dep = (Depression) cdisdb.getValues("Depression", pat.getIdpatient(),"asc");
		obs.add(latest_dep);
		//result = json.toJson(new MessageResponse(true,language,obs));
		Action act = chbdb.getAction(action);
		User u = chbdb.getUser(sid);
		chbdb.setEvent(u.getIduser(), act.getIdaction(), "1", sid, pat.getRamq());
		result = json.toJson(new MessageResponse(true,language,obs));
		return result;
	}

@RequestMapping(value = {"/service/data/deleteValue"}, method = RequestMethod.GET)
public String deleteValue(final HttpServletRequest request){
		Gson json = new GsonBuilder().serializeNulls().create();
		String result = "";
		String sid = request.getParameter("sid").toString();
		String idvalue = request.getParameter("idvalue").toString();
		String idpatient = request.getParameter("idpatient").toString();
		String language = request.getParameter("language").toString();
		Patient pat = null;
		
		
		
		Session session = chbdb.isValidSession(sid);
		if(session != null){
			chbdb.setUserSession(session);
		}
		
		boolean flag = false;
		String action = "DELDATA";
		
		ArrayList<Object> obs = new ArrayList<Object>();
		if(cdisdb.deleteValue(idvalue)){
			pat = cdisdb.getPatientById(Integer.parseInt(idpatient));
			obs.add(pat);
			Hcp hcps = cdisdb.getHcpOfPatient(pat.getIdpatient());
			obs.add(hcps);
			Diabet latest_diabet = (Diabet) cdisdb.getValues("Diabet", pat.getIdpatient(),"asc");
			obs.add(latest_diabet);
			MDVisit latest_mdvisit = (MDVisit) cdisdb.getValues("MDVisit", pat.getIdpatient(),"asc");
			//obs.add(latest_mdvisit.getLatestMDVisit());
			obs.add(latest_mdvisit);
			Renal latest_renal = (Renal) cdisdb.getValues("Renal", pat.getIdpatient(),"asc");
			//obs.add(latest_renal.getLatestRenal());
			obs.add(latest_renal);
			Lipid latest_lipid = (Lipid) cdisdb.getValues("Lipid", pat.getIdpatient(),"asc");
			//obs.add(latest_lipid.getLatestLipid());
			obs.add(latest_lipid);
			Lab latest_lab = (Lab) cdisdb.getValues("Lab", pat.getIdpatient(),"asc");
			//obs.add(latest_lab.getLatestLab());
			obs.add(latest_lab);
			Complications latest_complications = (Complications) cdisdb.getValues("Complications", pat.getIdpatient(),"asc");
			//obs.add(latest_complications.getLatestComplications());
			obs.add(latest_complications);
			Miscellaneous latest_miscellaneous = (Miscellaneous) cdisdb.getValues("Miscellaneous", pat.getIdpatient(),"asc");
			//obs.add(latest_miscellaneous.getLatestMiscellaneous());
			obs.add(latest_miscellaneous);
			Meds latest_meds = (Meds) cdisdb.getValues("Meds", pat.getIdpatient(),"asc");
			obs.add(latest_meds);
			Depression latest_dep = (Depression) cdisdb.getValues("Depression", pat.getIdpatient(),"asc");
			obs.add(latest_dep);
		}
		
		result = json.toJson(new MessageResponse(true,language,obs));
		Action act = chbdb.getAction(action);
		User u = chbdb.getUser(sid);
		chbdb.setEvent(u.getIduser(), act.getIdaction(), "1", sid, pat.getRamq());
		result = json.toJson(new MessageResponse(true,language,obs));
		return result;
	}
	
@RequestMapping(value = {"/service/data/savePatientRecord"}, method = RequestMethod.POST)
public String savePatientRecord(final HttpServletRequest request){
		Gson json = new GsonBuilder().serializeNulls().create();
		
		String result = "";
		String sid = request.getParameter("sid").toString();
		String language = request.getParameter("language").toString();
		String casem = request.getParameter("casem").toString();
		
		String chr = request.getParameter("chrid")==null||request.getParameter("chrid").equals("")?"0":request.getParameter("chrid").toString();
		String md = request.getParameter("mdid")==null||request.getParameter("mdid").equals("")?"0":request.getParameter("mdid").toString();
		String nut = request.getParameter("nutid")==null||request.getParameter("nutid").equals("")?"0":request.getParameter("nutid").toString();
		String nur = request.getParameter("nurid")==null||request.getParameter("nurid").equals("")?"0":request.getParameter("nurid").toString();
		Patient pat = null;
		String chart = null, ramq = null, id = null;
		if(request.getParameter("ramq") != null){
			ramq = request.getParameter("ramq").toString();
		}
		
		if(request.getParameter("idpatient") != null){
			id = request.getParameter("idpatient").toString();
		}
		ArrayList<Object> obs = new ArrayList<Object>();
		if(!ramq.equals("") && ramq != null){
			pat = cdisdb.getPatientByRamq(ramq);
		}else{
			pat = cdisdb.getPatientById(Integer.parseInt(id));
		}
		
		
		Session session = chbdb.isValidSession(sid);
		if(session != null){
			chbdb.setUserSession(session);
		}
		
		Map<String, String[]> args = request.getParameterMap();
		MessageResponse patient =  pat.setPatient(args);
		if(patient.getStatus() == 1){
			patient = cdisdb.updatePatient(pat);
			String valueName = request.getParameter("diabetcode").toString();
			String valueValue = request.getParameter("dtype").toString();
			String valueDate = request.getParameter("ddate").toString();
			String idvalue = request.getParameter("diabetidvalue").toString();
			//we add diabet in edit
			
			Diabet latest_diabet = (Diabet) cdisdb.getValues("Diabet", pat.getIdpatient(),"desc");
			Values dtypes = latest_diabet.getDtype();
			ArrayList<Value> dtypeArray =  dtypes.getValues();
			boolean isUpdateDate = false;
			boolean isUpdateValue = false;
			for(int i=0;i<dtypeArray.size();i++){
				Value vdtype = dtypeArray.get(i);
				String dtypeDateStr = vdtype.getDate();
				String dtypeValueStr = vdtype.getValue();
				if(dtypeDateStr.equals(valueDate)){
					isUpdateDate = true;
				}
				if(dtypeValueStr.equals(valueValue)){
					isUpdateValue = true;
				}
			}
			
			if(isUpdateDate && isUpdateValue){
				patient.setStatus(1);
			}else if(!isUpdateDate && !isUpdateValue){
				if(!cdisdb.addValue(valueName, valueValue, valueDate, String.valueOf(pat.getIdpatient()))){
					patient.setStatus(1);
				}
			}else{
				if(!cdisdb.editValue(valueName, valueValue, valueDate, String.valueOf(pat.getIdpatient()), idvalue)){
					patient.setStatus(1);
				}
			}
			//if(!db.editValue(valueName, valueValue, valueDate, String.valueOf(pat.getIdpatient()), idvalue)){
			cdisdb.setHcpOfPatient(pat.getIdpatient(), casem, md, nut, nur, chr);
			
		}
		
		result = json.toJson(patient);
		Action act = chbdb.getAction("EDITP");
		User u = chbdb.getUser(sid);
		chbdb.setEvent(u.getIduser(), act.getIdaction(), "1", sid, pat.getRamq());
		return result;
	}

@RequestMapping(value = {"/service/data/validateHcp"}, method = RequestMethod.GET)
public String validateHcp(String hcpid, String hcpName){
	String result = "";
	if(hcpid!=null && !hcpid.equals("")){
		User u = chbdb.getUser(Integer.parseInt(hcpid));
		String name = (u.getFirstname().toLowerCase()+ u.getLastname().toLowerCase()).replace(" ", "");
		String hname = hcpName.toLowerCase().replace(" ", "");
		if(name.equals(hname)){result = hcpid;}else{result="";}
	}
	return result;
}

@RequestMapping(value = {"/service/data/addPatientRecord"}, method = RequestMethod.POST)
public String addPatientRecord(final HttpServletRequest request){
		Gson json = new GsonBuilder().serializeNulls().create();
		
		String result = "";
		String sid = request.getParameter("sid").toString();
		String language = request.getParameter("language").toString();
		String casem = null;
		String chr = null;
		String md = null;
		String nut = null;
		String nur = null;
		Patient pat = new Patient();
		String chart = null, ramq = null, id = null;
		if(request.getParameter("ramq") != null){
			ramq = request.getParameter("ramq").toString();
		}
		
		if(request.getParameter("casemid") != null){casem = request.getParameter("casemid").toString();}
		if(request.getParameter("chrid") != null){chr = request.getParameter("chrid").toString();}
		if(request.getParameter("mdid") != null){md = request.getParameter("mdid").toString();}
		if(request.getParameter("nutid") != null){nut = request.getParameter("nutid").toString();}
		if(request.getParameter("nurid") != null){nur = request.getParameter("nurid").toString();}
		
		
		Session session = chbdb.isValidSession(sid);
		if(session != null){
			chbdb.setUserSession(session);
		}
		ArrayList<Object> obs = new ArrayList<Object>();
		Map<String, String[]> args =  request.getParameterMap();
		MessageResponse patient =  pat.setPatient(args);
		if(patient.getStatus() == 1){
			patient = cdisdb.addPatient(pat);
			pat = cdisdb.getPatientByRamq(pat.getRamq());
			String valueName = request.getParameter("diabetcode").toString();
			String valueValue = request.getParameter("dtype").toString();
			String valueDate = request.getParameter("ddate").toString();
			String idvalue = request.getParameter("diabetidvalue").toString();
			if(!cdisdb.addValue(valueName, valueValue, valueDate, String.valueOf(pat.getIdpatient()))){
				patient.setStatus(1);
			}
			cdisdb.setHcpOfPatient(pat.getIdpatient(), casem, md, nut, nur, chr);
		}
		
		result = json.toJson(patient);
		Action act = chbdb.getAction("ADDP");
		User u = chbdb.getUser(sid);
		chbdb.setEvent(u.getIduser(), act.getIdaction(), "1", sid, pat.getRamq());
		return result;
	}
	
@RequestMapping(value = {"/service/data/deletePatientRecord"}, method = RequestMethod.GET)
public String deletePatientRecord(final HttpServletRequest request){
	Gson json = new GsonBuilder().serializeNulls().create();
	
	
	String result = "";
	String sid = request.getParameter("sid").toString();
	String language = request.getParameter("language").toString();
	String idpatient = request.getParameter("idpatient").toString();
	
	MessageResponse msg = new MessageResponse();
	
	Session session = chbdb.isValidSession(sid);
	if(session != null){
		chbdb.setUserSession(session);
	}
	
	ArrayList<Object> obs = new ArrayList<Object>();
	Session ses = chbdb.isValidSession(sid);
	if (ses != null){
		if(cdisdb.deletePatient(idpatient)){
			Action act = chbdb.getAction("DELP");
			User u = chbdb.getUser(sid);
			chbdb.setEvent(u.getIduser(), act.getIdaction(), "1", sid, idpatient);
			msg = new MessageResponse(act,true,language,null);
		}
	}else{
		msg = new MessageResponse(false,language,null);
	}
	
	result = json.toJson(msg);
	return result;
}
	
@RequestMapping(value = {"/service/data/getUserPatients"}, method = RequestMethod.GET)
public String getUserPatients(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String iduser = request.getParameter("iduser").toString();
	String hcpcat = request.getParameter("hcpcat").toString();
	
	String language = request.getParameter("language").toString();

	ArrayList<Object> obs = chbdb.getUserPatients(iduser, hcpcat); 
	result = json.toJson(new MessageResponse(true,language,obs));
	return result;
}
	
@RequestMapping(value = {"/service/data/getStatsData"}, method = RequestMethod.GET)
public String getStatsData(final HttpServletRequest request){
		Gson json = new Gson();
		String result = "";
		
		
		String idcommunity = request.getParameter("idcommunity").toString();
		String sex = request.getParameter("sex").toString();
		String dtype = request.getParameter("dtype").toString();
		String age = request.getParameter("age").toString();
		String hba1c = request.getParameter("hba1c").toString();
		
		String stats = request.getParameter("stats").toString();
		String period = request.getParameter("period").toString();

		int periodNumber = Integer.parseInt(period);
		
		ArrayList<Object> obs = new ArrayList<>();
		if(stats.equals("trend")){
			Hashtable<String, ArrayList<Object>> serie = cdisdb.getHbA1cTrendItem(periodNumber,idcommunity,sex,dtype, age, hba1c);
			obs.add(serie);
		}else if(stats.equals("period")){
			Hashtable<String, ArrayList<Object>> serie = cdisdb.getHbA1cPeriodItem(periodNumber,idcommunity,sex,dtype,age, hba1c);
			obs.add(serie);
		}else if(stats.equals("value")){
			Hashtable<String, ArrayList<Object>> serie = cdisdb.getHbA1cValueItem(periodNumber,idcommunity,sex,dtype,age, hba1c);
			obs.add(serie);
		}
		
		result = json.toJson(new MessageResponse(true,"en",obs));
		
		return result;
	}
	
@RequestMapping(value = {"/service/data/getNumberOfPatients"}, method = RequestMethod.GET)
public String getNumberOfPatients(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	
	String idcommunity = request.getParameter("idcommunity").toString();
	String sex = request.getParameter("sex").toString();
	String dtype = request.getParameter("dtype").toString();
	String age = request.getParameter("age").toString();
	String period = request.getParameter("period").toString();

	int periodNumber = Integer.parseInt(period);
	ArrayList<Object> obs = new ArrayList<>();
	boolean isMoreCommunities = false;
	String[] parts = null;
	if(idcommunity.indexOf("_") >= 0){
		parts = idcommunity.split("_");
		isMoreCommunities = true;
	}
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	Date now = new Date();
	
	
	Hashtable<String, ArrayList<Hashtable<String, String>>> serie = new Hashtable<>();
	if(isMoreCommunities){
		for(int i=0;i<parts.length;i++){
			ArrayList<Hashtable<String, String>> comm = new ArrayList<>();
			for( int j=0 ; j<periodNumber ; j++){
				Hashtable<String, String> elements = new Hashtable<>();
				Calendar calStart = Calendar.getInstance();
				calStart.setTime(now);
				calStart.add(Calendar.MONTH, -1 ); 
				calStart.add(Calendar.MONTH, j*-1 ); // we go back period number and 1 month more because we exclude current month
				calStart.set(Calendar.DAY_OF_MONTH, calStart.getActualMaximum(Calendar.DAY_OF_MONTH));
				String since = sdf.format(calStart.getTime());
				int n = cdisdb.getNumberOfPatients(parts[i], since, sex, dtype, age);
				elements.put("total", Integer.toString(n));
				elements.put("sex", sex);
				elements.put("age", age);
				elements.put("dtype", dtype);
				elements.put("since", since);
				comm.add(elements);
			}
			serie.put("idcommunity_"+parts[i], comm);
			obs.add(serie);
		}
	}else{
		ArrayList<Hashtable<String, String>> comm = new ArrayList<>();
		for( int j=0 ; j<periodNumber ; j++){
			Hashtable<String, String> elements = new Hashtable<>();
			Calendar calStart = Calendar.getInstance();
			calStart.setTime(now);
			calStart.add(Calendar.MONTH, -1 ); 
			calStart.add(Calendar.MONTH, j*-1 ); // we go back period number and 1 month more because we exclude current month
			calStart.set(Calendar.DAY_OF_MONTH, calStart.getActualMaximum(Calendar.DAY_OF_MONTH));
			String since = sdf.format(calStart.getTime());
			int n = cdisdb.getNumberOfPatients(idcommunity, since, sex, dtype, age);
			elements.put("total", Integer.toString(n));
			elements.put("sex", sex);
			elements.put("age", age);
			elements.put("dtype", dtype);
			elements.put("since", since);
			comm.add(elements);
		}
		serie.put("idcommunity_"+idcommunity, comm);
		obs.add(serie);
	}
	result = json.toJson(new MessageResponse(true,"en",obs));
	return result;
}

@RequestMapping(value = {"/service/data/getPvalidationData"}, method = RequestMethod.GET)
public String getPvalidationData(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	String idlist = request.getParameter("idlist").toString();
	ArrayList<Object> obs = new ArrayList<>();
	Hashtable<String, ArrayList<Object>> serie = cdisdb.getPValidationData(idlist);
	obs.add(serie);
	result = json.toJson(new MessageResponse(true,"en",obs));
	return result;
}

@RequestMapping(value = {"/service/data/getPandiNow"}, method = RequestMethod.GET)
public String getPandiNow(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	
	
	String idcommunity = request.getParameter("idcommunity").toString();
	String sex = request.getParameter("sex").toString();
	String dtype = request.getParameter("dtype").toString();
	String age = request.getParameter("age").toString();
	
	ArrayList<Object> obs = new ArrayList<>();
	
	Hashtable<String, ArrayList<Object>> serie1 = cdisdb.getPrevalenceNow(idcommunity,sex,dtype, age);
	obs.add(serie1);
	Hashtable<String, ArrayList<Object>> serie2 = cdisdb.getIncidenceNow(idcommunity,sex,dtype, age);
	obs.add(serie2);
	
	Hashtable<String, ArrayList<Object>> serie3 = cdisdb.getPrevalenceNowLastYear(idcommunity,sex,dtype, age);
	obs.add(serie3);
	Hashtable<String, ArrayList<Object>> serie4 = cdisdb.getIncidenceNowLastYear(idcommunity,sex,dtype, age);
	obs.add(serie4);
	result = json.toJson(new MessageResponse(true,"en",obs));
	
	return result;
}

@RequestMapping(value = {"/service/data/getPandiHistory"}, method = RequestMethod.GET)
public String getPandiHistory(final HttpServletRequest request){
	Gson json = new Gson();
	String result = "";
	
	
	String idcommunity = request.getParameter("idcommunity").toString();
	String sex = request.getParameter("sex").toString();
	String dtype = request.getParameter("dtype").toString();
	String age = request.getParameter("age").toString();
	String since = request.getParameter("since").toString();
	
	ArrayList<Object> obs = new ArrayList<>();
	
	Hashtable<String, ArrayList<Object>> serie1 = cdisdb.getPrevalenceHistory(idcommunity,sex,dtype, age, since);
	obs.add(serie1);
	Hashtable<String, ArrayList<Object>> serie2 = cdisdb.getIncidenceHistory(idcommunity,sex,dtype, age,since);
	obs.add(serie2);
	Hashtable<String, ArrayList<Object>> serie3 = cdisdb.getPrevalenceHistory(idcommunity,"0",dtype,"0", since);
	obs.add(serie3);
	Hashtable<String, ArrayList<Object>> serie4 = cdisdb.getIncidenceHistory(idcommunity,"0",dtype,"0",since);
	obs.add(serie4);
	result = json.toJson(new MessageResponse(true,"en",obs));
	
	return result;
}


}
