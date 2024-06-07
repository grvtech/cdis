package com.grvtech.cdis.db;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.grvtech.cdis.model.Action;
import com.grvtech.cdis.model.Cisystem;
import com.grvtech.cdis.model.Message;
import com.grvtech.cdis.model.Note;
import com.grvtech.cdis.model.Profile;
import com.grvtech.cdis.model.Role;
import com.grvtech.cdis.model.ScheduleVisit;
import com.grvtech.cdis.model.SearchPatient;
import com.grvtech.cdis.model.Session;
import com.grvtech.cdis.model.User;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/*
 * Data bridge to users databases and actions also for messaging between users
 * all methods call stored procedures in the db server
 * methods :
 * 
 * add users
 * modify user
 * 
 * 
 * */
@Service
public class ChbDBridge {
	
	Logger logger = LogManager.getLogger(ChbDBridge.class);
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	public ChbDBridge(){}
	
	
public Action getAction(String actionCode){
	Action result = new Action();
	String sql = "SELECT a.* from ncdis.action a where a.action_code = '"+actionCode+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		result.setIdaction(row.get("idaction").toString());
        result.setName(row.get("action_name").toString());
        result.setDescription(row.get("action_description").toString());
        result.setCode(row.get("action_code").toString());    
    }
	logger.log(Level.INFO, "Get Action :"+result.getCode());
	return result;
}
	
	
public User getUser(String username, String password){
	User result = new User();
	String sql = "SELECT * from ncdis.users u where u.username = '"+username+"' and u.password = '"+password+"' and u.active = 1";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    if(rows.size() > 0 ) {
    	Map<String, Object> row = rows.get(0);
    	result.setUsername(row.get("username").toString());
    	result.setPassword(row.get("password").toString());
    	result.setFirstname((String)row.get("firstname"));
    	result.setLastname((String)row.get("lastname"));
    	result.setEmail(row.get("email").toString());
    	result.setIduser(row.get("iduser").toString());
    	result.setPhone((String)row.get("phone"));
    	result.setIdcommunity(row.get("idcommunity").toString());
    	result.setActive(row.get("active").toString());
    	result.setIdprofesion(row.get("idprofesion")==null?"":row.get("idprofesion").toString());
    }
    logger.log(Level.INFO, "Get User :"+result.getUsername()+"  "+result.getEmail()+"  iduser : "+result.getIduser() );
	return result;
}
	

public ArrayList<Object> getUsers(){
	ArrayList<Object> result = new ArrayList<>();
	String sql = "select * from ncdis.ncdis.users where iduser > 0 and active = 1 order by fname,lname asc ";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    for (Map row : rows) {
        User obj = new User();
        obj.setUsername(row.get("username").toString());
        obj.setPassword(row.get("password").toString());
        obj.setFirstname((String)row.get("fname"));
        obj.setLastname((String)row.get("lname"));
        obj.setEmail(row.get("email").toString());
        obj.setIduser(row.get("iduser").toString());
        obj.setPhone((String)row.get("phone"));
        obj.setIdcommunity(row.get("idcommunity").toString());
        obj.setActive(row.get("active").toString());
        obj.setIdprofesion(row.get("idprofesion")==null?"":row.get("idprofesion").toString());
        result.add(obj);
    }
    logger.log(Level.INFO, "Get List of users :"+result.size());
	return result;
}
	

public Role getUserRole(User u){
	Role result = new Role();
	String sql = "select r.* from ncdis.ncdis.profile p left join ncdis.ncdis.role r on p.idrole=r.idrole where p.iduser = "+u.getIduser()+" ";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	if(rows.size() > 0 ) {
		Map row = rows.get(0);
		result.setIdrole((Integer)row.get("idrole"));
		result.setName(row.get("role_name")==null?"":row.get("role_name").toString());
		result.setCode(row.get("role_code")==null?"":row.get("role_code").toString());
	}
	return result;
}

public Cisystem getUserSystem(User u){
	Cisystem result = new Cisystem();
	String sql = "select idsystem from ncdis.ncdis.profile where iduser = "+u.getIduser()+" ";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	if(rows.size() > 0 ) {
		Map row = rows.get(0);
		result.setIdsystem((Integer)row.get("idsystem"));
		result.setName(row.get("role_name")==null?"":row.get("role_name").toString());
		result.setCode(row.get("role_code")==null?"":row.get("role_code").toString());
	}
	return result;
}


public User getUser(int iduser){
	User result = new User();
    String sql="select * from ncdis.ncdis.users where iduser="+iduser+" and active=1";
    List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    if(rows.size() > 0 ) {
    	Map<String, Object> row = rows.get(0);
    	result.setUsername(row.get("username").toString());
    	result.setPassword(row.get("password").toString());
    	result.setFirstname((String)row.get("fname"));
    	result.setLastname((String)row.get("lname"));
    	result.setEmail(row.get("email").toString());
    	result.setIduser(row.get("iduser").toString());
    	result.setPhone((String)row.get("phone"));
    	result.setIdcommunity(row.get("idcommunity").toString());
    	result.setActive(row.get("active").toString());
    	result.setIdprofesion(row.get("idprofesion")==null?"":row.get("idprofesion").toString());
    	result.setReset(row.get("reset")==null?"":row.get("reset").toString());
    	result.setConfirmmail(row.get("confirmmail")==null?"":row.get("confirmmail").toString());
    }
    logger.log(Level.INFO, "Get User by ID:"+result.getUsername()+"  "+result.getEmail()+"  iduser : "+result.getIduser() );
	return result;
}

	
public void setUser(User user){
	HashMap<String, String> result = new HashMap<String, String>();
	String sql = "update ncdis.ncdis.users set fname='"+user.getFirstname()+"', "
   		+ "lname='"+user.getLastname()+"', "
   		+ "phone='"+user.getPhone()+"', "
   		+ "email='"+user.getEmail()+"', "
   		+ "password='"+user.getPassword()+"', "
   		+ "active='"+user.getActive()+"', "
   		+ "idcommunity='"+user.getIdcommunity()+"', "
   		+ "reset='"+user.getReset()+"', "
   		+ "confirmmail='"+user.getConfirmmail()+"', "
   		+ "idprofesion='"+user.getIdprofesion()+"' "
   		+ "where iduser = '"+Integer.parseInt(user.getIduser())+"'";
	
	jdbcTemplate.update(sql);
	logger.log(Level.INFO, "Set User : iduser : "+user.getIduser() );
}

public int addUser(User user){
	int result = 0;
	String sql = "insert into ncdis.ncdis.users (fname,lname,username,password,email,phone,idcommunity,idprofesion,active, reset,confirmmail) "
		    		+ "values ('"+user.getFirstname()+"','"+user.getLastname()+"','"+user.getUsername()+"','"+user.getPassword()+"','"+user.getEmail()+"',"
    				+ "'"+user.getPhone()+"','"+user.getIdcommunity()+"','"+user.getIdprofesion()+"','"+user.getActive()+"',"+"'"+user.getReset()+"',"+"'"+user.getConfirmmail()+"')";
	jdbcTemplate.update(sql);

	String sql1 = "select TOP 1 iduser from ncdis.ncdis.users order by iduser desc";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql1);
	if(rows.size() > 0) {
		Map row = rows.get(0);
		result = (Integer) row.get("iduser");
		logger.log(Level.INFO, "Set User :"+result );
    }
	
	return result;
}

	
public boolean setUserProfile(int iduser, int idsystem, int idrole){
	boolean result = false;
	String sql = "update  ncdis.ncdis.profile set idrole = '"+idrole+"' where iduser = '"+iduser+"' and idsystem = '"+idsystem+"'";
	jdbcTemplate.update(sql);
	result = true;
	return result;
}
	

public boolean saveUserProfile(int iduser, int idsystem, int idrole){
	boolean result = false;
	String sql = "insert into ncdis.ncdis.profile (iduser,idsystem,idrole) values ('"+iduser+"','"+idsystem+"','"+idrole+"')";
	jdbcTemplate.update(sql);
	result = true;
	return result;
}

	
	
public Profile getUserProfile(int iduser, int idsystem){
	Profile result = new Profile();
	String sql = "select * from ncdis.profile where iduser = '"+iduser+"' and idsystem = '"+idsystem+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
    	User u = getUser(iduser);
    	Role r =  getUserRole(u);
    	Cisystem c = getUserSystem(u);
    	result.setUser(u);
    	result.setRole(r);
    	result.setSystem(c);
    }
	return result;
}
	
	
	
public User getUser(String idsession){
	User result = new User();
	String sql = "SELECT nnu.* , nnr.role_code from ncdis.users nnu left join ncdis.profile nnp on nnu.iduser=nnp.iduser "
			+ "	left join ncdis.role nnr on nnp.idrole = nnr.idrole "
			+ "	left join ncdis.session nns on nnu.iduser = nns.iduser "
			+ "	where nns.idsession = '"+idsession+"' and nnu.active = 1";
	
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    if(rows.size() > 0 ) {
    	Map<String, Object> row = rows.get(0);
    	result.setUsername(row.get("username").toString());
    	result.setPassword(row.get("password").toString());
    	result.setFirstname(row.get("fname")==null?"":row.get("fname").toString());
    	result.setLastname(row.get("lname")==null?"":row.get("lname").toString());
    	result.setEmail(row.get("email").toString());
    	result.setIduser(row.get("iduser").toString());
    	result.setPhone(row.get("phone")==null?"":row.get("phone").toString());
    	result.setIdcommunity(row.get("idcommunity").toString());
    	result.setActive(row.get("active").toString());
    	result.setIdprofesion(row.get("idprofesion")==null?"":row.get("idprofesion").toString());
    	result.setReset(row.get("reset").toString());
    	result.setConfirmmail(row.get("confirmmail").toString());
    }
    logger.log(Level.INFO, "Get User ID Session :"+result.getUsername()+"  "+result.getEmail()+"  iduser : "+result.getIduser() );
	return result;
}


public String getUsernameByEmail(String email){
	String result = "";
	String sql = "SELECT nnu.username from ncdis.ncdis.users nnu where nnu.email = '"+email+"' and nnu.active = 1";
	
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    if(rows.size() == 1) {
    	for(Map row:rows) {
    		result = row.get("username").toString();
    	}
    }
		
	return result;
}


public boolean setEvent(String iduser, String idaction, String idsystem, String idsession){
	boolean result = false;
	String sql = "INSERT INTO ncdis.events (idaction,idsystem,iduser,idsession,created )  VALUES ("+idaction+", "+idsystem+", "+iduser+", '"+idsession+"',GETDATE()) ";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Set Event : "+idaction+"  user:"+iduser+" session:"+idsession );
	return result;
}
	
public boolean setEvent(String iduser, String idaction, String idsystem, String idsession, String data){
	boolean result = false;
	String sql = "INSERT INTO ncdis.events (idaction,idsystem,iduser,idsession,data,created )  VALUES ("+idaction+", "+idsystem+", "+iduser+", '"+idsession+"','"+data+"',GETDATE()) ";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Set Event : "+idaction+"  user:"+iduser+" session:"+idsession );
	return result;
}
	

public Session getUserSession(String ipuser, String iduser) {
	Session result = new Session();
	String sql = "select * from ncdis.ncdis.session ss where iduser = "+iduser+" and ipuser='"+ipuser+"' and active=1 group by  idsession,iduser, ipuser, created,modified,reswidth,resheight,active having  datediff(minute, max(modified), GETDATE()) < (Select convert(int,value) from ncdis.ncdis.configuration where keia='session')";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    if(rows.size() > 0 ) {
    	Map<String, Object> row = rows.get(0);
    	result.setIdsession(row.get("idsession").toString());
    	//result.setIduser(row.get("iduser").toString());
    	result.setIpuser(row.get("ipuser")==null?"":row.get("ipuser").toString());
    	result.setCreated(row.get("created")==null?0:((java.util.Date)row.get("created")).getTime());
    	result.setModified(row.get("modified")==null?0:((java.util.Date)row.get("modified")).getTime());
    	result.setReswidth(row.get("reswidth")==null?0:((Integer)row.get("reswidth")));
    	result.setResheight(row.get("resheight")==null?0:((Integer)row.get("resheight")));
    	result.setActive(row.get("active")==null?0:((Integer)row.get("active")));
    }
    logger.log(Level.INFO, "Get User Session by iduser and ipuser : iduser:"+result.getIduser()+"  session:"+result.getIdsession() );
	return result;
}

public Session getUserSession(String idsession) {
	Session result = new Session();
	String sql = "select * from ncdis.ncdis.session ss where idsession = '"+idsession+"' and active=1 group by  idsession,iduser, ipuser, created,modified,reswidth,resheight,active having  datediff(minute, max(modified), GETDATE()) < (Select convert(int,value) from ncdis.ncdis.configuration where keia='session');";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    if(rows.size() > 0 ) {
    	Map<String, Object> row = rows.get(0);
    	result.setIdsession(row.get("idsession").toString());
    	result.setIduser(row.get("iduser").toString());
    	result.setIpuser(row.get("ipuser")==null?"":row.get("ipuser").toString());
    	result.setCreated(row.get("created")==null?0:((java.util.Date)row.get("created")).getTime());
    	result.setModified(row.get("modified")==null?0:((java.util.Date)row.get("modified")).getTime());
    	result.setReswidth(row.get("reswidth")==null?0:((Integer)row.get("reswidth")));
    	result.setResheight(row.get("resheight")==null?0:((Integer)row.get("resheight")));
    	result.setActive(row.get("active")==null?0:((Integer)row.get("active")));
    }
    logger.log(Level.INFO, "Get User Session by idsession : iduser:"+result.getIduser()+"  session:"+result.getIdsession() );
	return result;
}



public boolean setUserSession(Session ses){
	boolean result = false;
	Session session = getUserSession(ses.getIpuser(), ses.getIduser());
	SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
	Date now = new Date(System.currentTimeMillis());
	String sql = "";
	if(session.getIdsession().equals("0")) {
		sql = "insert into ncdis.session (idsession, iduser, ipuser, created,modified,reswidth,resheight,active) values ('"+ses.getIdsession()+"', '"+ses.getIduser()+"', '"+ses.getIpuser()+"', '"+sdf.format(now)+"','"+sdf.format(now)+"', '"+ses.getReswidth()+"', '"+ses.getResheight()+"',1)";
	}else {
		sql = "update ncdis.session set modified='"+sdf.format(now)+"',reswidth='"+session.getReswidth()+"',resheight='"+session.getResheight()+"' where idsession='"+session.getIdsession()+"'";
	}
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Set User Session  : iduser:"+session.getIduser()+"  session:"+session.getIdsession() );
	return result;
}
	

public Session getUserSession(int iduser, String ip){
	Session result = new Session();
	String idu = Integer.toString(iduser);
	result = getUserSession(ip,idu);
	return result;
}

public Session isValidSession(String idsession){
	Session result = new Session();
	result = getUserSession(idsession);
	logger.log(Level.INFO, "Valid Session for :"+result.getIduser()+" session : "+idsession+"   "+result.getIpuser());
	return result;
	
}
	
	
public User isValidUser(String email, String username){
	User result = new User();
    String sql = "select * from ncdis.ncdis.users where email='"+email+"' and username = '"+username+"'";
    List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    if(rows.size() > 0 ) {
    	Map<String, Object> row = rows.get(0);
    	result.setUsername(row.get("username").toString());
    	result.setPassword(row.get("password").toString());
    	result.setFirstname((String)row.get("fname"));
    	result.setLastname((String)row.get("lname"));
    	result.setEmail(row.get("email").toString());
    	result.setIduser(row.get("iduser").toString());
    	result.setPhone((String)row.get("phone"));
    	result.setIdcommunity(row.get("idcommunity").toString());
    	result.setActive(row.get("active").toString());
    	result.setIdprofesion(row.get("idprofesion")==null?"":row.get("idprofesion").toString());
    	result.setReset(row.get("reset").toString());
    	result.setConfirmmail(row.get("confirmmail").toString());
    }
    logger.log(Level.INFO, "is Valid user by email and username : iduser:"+result.getIduser()+"  session:"+result.getUsername() );
	return result;
}
	
	
public boolean logoutSession(String idsession){
	boolean result = false;
	String sql = "update ncdis.ncdis.session set active = 0 where idsession = '"+idsession+"'";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Logout session : idsession:"+idsession );
	return result;
}
	
public ArrayList<Object> getPatientsList(String criteria, String term){
	ArrayList<Object> result = new ArrayList<Object>();
	//default search by chart
	String url = "select * from dbo.SearchPatient where chart like '"+term+"%' order by chart";
	if(criteria.equals("ramq")){
		url = "select * from dbo.SearchPatient where ramq like '"+term+"%' order by ramq";
	}else if(criteria.equals("fnamelname")){
		url = "select * from dbo.SearchPatient where fname like '"+term+"%' or lname like '"+term+"%' order by fname,lname";
	}else if(criteria.equals("ipm")){
		url = "select * from dbo.SearchPatient where giu like '"+term+"%' order by giu";
	}
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
    for(Map row : rows) {
    	SearchPatient sp = new SearchPatient(
    			(row.get("fname")==null?"":row.get("fname").toString()), 
    			(row.get("lname")==null?"":row.get("lname").toString()),
    			(row.get("ramq")==null?"":row.get("ramq").toString()), 
    			(row.get("name_en")==null?"":row.get("name_en").toString()), 
    			(row.get("chart")==null?0:(Integer)row.get("chart")), 
    			(row.get("idpatient")==null?0:(Integer)row.get("idpatient")), 
    			(row.get("giu")==null?"":row.get("giu").toString()));
    	result.add(sp);
    }
    
    logger.log(Level.INFO, "Get Patient List : patients:"+result.size() );
	return result;
}
	
	
public ArrayList<Object> getPatientsList(String criteria, String term, User user){
	ArrayList<Object> result = new ArrayList<Object>();
	String comfilter = " and idcommunity = '"+user.getIdcommunity()+"'";
	if(user.getIdcommunity().equals("0")){
		comfilter = "";
	}
			
	//default search by chart
	String url = "select * from dbo.SearchPatient where chart like '"+term+"%' "+comfilter+" order by chart";
	if(criteria.equals("ramq")){
		url = "select * from dbo.SearchPatient where ramq like '"+term+"%' "+comfilter+" order by ramq";
	}else if(criteria.equals("fnamelname")){
		url = "select * from dbo.SearchPatient where fname like '"+term+"%' or lname like '"+term+"%' "+comfilter+" order by fname,lname";
	}else if(criteria.equals("ipm")){
		url = "select * from dbo.SearchPatient where giu like '"+term+"%' "+comfilter+" order by giu";
	}
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
    for(Map row : rows) {
    	SearchPatient sp = new SearchPatient(
    			(row.get("fname")==null?"":row.get("fname").toString()), 
    			(row.get("lname")==null?"":row.get("lname").toString()),
    			(row.get("ramq")==null?"":row.get("ramq").toString()), 
    			(row.get("name_en")==null?"":row.get("name_en").toString()), 
    			(row.get("chart")==null?0:(Integer)row.get("chart")), 
    			(row.get("idpatient")==null?0:(Integer)row.get("idpatient")), 
    			(row.get("giu")==null?"":row.get("giu").toString()));
    	result.add(sp);
    }
    logger.log(Level.INFO, "Get Patient List : patients:"+result.size() );
	return result;
}
	
public ArrayList<Object> getDiabetByCommunity(String graphtype){
	ArrayList<Object> result = new ArrayList<Object>();
	String url = "select * from dbo.diabetByCommunity where community != 'Non-Cree Community' order by community asc";
    ArrayList<Object> men = new ArrayList<Object>();
	ArrayList<Object> women = new ArrayList<Object>();
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
    for(Map row : rows) {
    	ArrayList<Object> vmen = new ArrayList<Object>();
	    ArrayList<Object> vwomen = new ArrayList<Object>();
	    if(!graphtype.equals("pyramid")){
	    	vmen.add(row.get("community").toString());
	    	vmen.add((Integer)row.get("men"));
	    	men.add(vmen);
	    }else{
	    	men.add((Integer)row.get("men"));
	    }
	    
	    if(!graphtype.equals("pyramid")){
	    	vwomen.add(row.get("community").toString());
	    	vwomen.add((Integer)row.get("women"));
	    	women.add(vwomen);
	    }else{
	    	women.add((Integer)row.get("women"));
	    }
    }
   	result.add(men);
   	result.add(women);
   	
   	logger.log(Level.INFO, "Get Diabet By Community ");
	return result;
}
	
public ArrayList<Object> getDiabetByType(){
	ArrayList<Object> result = new ArrayList<Object>();
	String url = "select * from dbo.diabetByType";
	ArrayList<ArrayList<String>> series = new ArrayList<ArrayList<String>>();
	ArrayList<Object> men = new ArrayList<Object>();
    ArrayList<Object> women = new ArrayList<Object>();
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
    for(Map row : rows) {
    	ArrayList<Object> vmen = new ArrayList<Object>();
	    ArrayList<Object> vwomen = new ArrayList<Object>();
	    vmen.add(row.get("diabet").toString());
	    vmen.add((Integer)row.get("men"));
    	
	    vwomen.add(row.get("diabet").toString());
    	vwomen.add((Integer)row.get("women"));
    	
    	men.add(vmen);
    	women.add(vwomen);
    }
   	result.add(men);
   	result.add(women);
   	logger.log(Level.INFO, "Get Diabet by Type:" );
	return result;
}
	
	
public ArrayList<Object> getDiabetByYear(String year){
	ArrayList<Object> result = new ArrayList<Object>();
	ArrayList<Object> dataset = new ArrayList<Object>();
	ArrayList<Object> series = new ArrayList<Object>();
	String sqlSeries = "select distinct diabet from dbo.DiabetByYear";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sqlSeries);
    for(Map row : rows) {
    	Hashtable<String, String> ob = new Hashtable<String, String>() ;
    	ob.put("label", row.get("diabet").toString());
    	series.add(ob);
    }		
    result.add(series);
		    
    for(int i=0;i<series.size();i++){
    	ArrayList<Object> serie = new ArrayList<Object>();
    	Hashtable<String, String> vs = (Hashtable<String, String>)series.get(i);
    	String url = "select * from dbo.DiabetByYear where  year > year(GETDATE()) - "+year+" and diabet='"+vs.get("label")+"'  order by year asc, diabet";
    	List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(url);

    	Calendar date = new GregorianCalendar();
    	int yearNow = date.get(Calendar.YEAR);
    	int yearFun = Integer.parseInt(year);
    	
    	for(int j=(yearNow - yearFun +1);j<=yearNow;j++){
    		ArrayList<Object> vals = new ArrayList<Object>();
    		vals.add(Integer.toString(j));
    		vals.add(0);
    		serie.add(vals);
    	}
    	for(Map row : rows1) {
	    	String yearVal = row.get("year").toString();
	    	for(int k=0;k<serie.size();k++){
	    		ArrayList<Object> vval = (ArrayList<Object>)serie.get(k);
	    		String  vY = (String) vval.get(0);
	    		if(vY.equals(yearVal)){
	    			vval.set(1, (Integer)row.get("patients"));
	    		}
	    	}
        }
    	dataset.add(serie);
	}
    result.add(dataset);
    logger.log(Level.INFO, "Get Diabet by Year ");
	return result;
}
	
public String getLastLogin(String iduser){
	String result = "";
	String url = "select convert(nvarchar(MAX), max(nns.created), 20) as val  from ncdis.ncdis.session nns left join ncdis.ncdis.events nne on nns.idsession = nne.idsession  left join ncdis.ncdis.action nna on nne.idaction = nna.idaction where nns.iduser = '"+iduser+"' and nna.action_code = 'LOGIN'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
	for(Map row : rows) {
		result = row.get("val").toString();    
	}
	logger.log(Level.INFO, "Get last Session iduser:"+iduser );
	return result;
}

public HashMap<String, String> getLastPatient(String iduser){
	HashMap<String, String> result = new HashMap<>();
	String url = "select  nnc.system_code app, nne.data from ncdis.ncdis.events nne" 
					+" left join ncdis.ncdis.session nns on nne.idsession = nns.idsession"
						+" left join ncdis.ncdis.action nna on nne.idaction = nna.idaction"
						+" left join ncdis.ncdis.cisystems nnc on nne.idsystem = nnc.idsystem"
						+" where  nna.action_code = 'VIEWP' and nne.iduser = '"+iduser+"'" 
						+" and nne.created = (select max(created) from ncdis.ncdis.events where iduser = '"+iduser+"' and idaction = (select idaction from ncdis.ncdis.action where action_code = 'VIEWP'))";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
	for(Map row : rows) {
		result.put(row.get("app").toString(), row.get("data").toString());    
	}
	logger.log(Level.INFO, "Get Last Patient : iduser:"+iduser);
	return result;
}


public HashMap<String, String> getLastReport(String iduser){
	HashMap<String, String> result = new HashMap<>();
	String url = "select nnr.idreport, nnr.report_name" 
					+" from ncdis.ncdis.reports nnr"
						+" inner join (select nne.* from ncdis.ncdis.events nne"
								+" left join ncdis.ncdis.action nna on nne.idaction = nna.idaction where nna.action_code = 'REPORT') as ne on nnr.idreport = ne.data"
						+" where ne.iduser = '"+iduser+"'"
						+" and ne.created = (select max(created) from ncdis.ncdis.events where iduser = '"+iduser+"' and idaction = (select idaction from ncdis.ncdis.action where action_code = 'REPORT'))";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
	for(Map row : rows) {
		result.put("id", row.get("idreport").toString());
    	result.put("name", row.get("report_name").toString());    
	}
	logger.log(Level.INFO, "Get Last Report  iduser:"+iduser+"  idreport:"+result.get("id"));
	return result;
}
	

public ArrayList<Object> getUserMessages(String iduser){
	ArrayList<Object> result = new ArrayList<>();
	ArrayList<Message> received = new ArrayList<>();
    String sql = "select uu.lname as from_user_lname,uu.fname as from_user_fname, mm.*,convert(nvarchar(MAX), mm.created, 23) as dcreate from ncdis.mesages mm left join ncdis.users uu on mm.from_iduser = uu.iduser where mm.to_iduser = "+iduser+"";
    List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		received.add(new Message(row.get("idmessage").toString(), (row.get("from_user_fname")==null?"":row.get("from_user_fname").toString())+" "+(row.get("from_user_lname")==null?"":row.get("from_user_lname").toString()),(row.get("to_iduser")==null?"":row.get("to_iduser").toString()),(Boolean)row.get("read"), (Boolean)row.get("isdelivered"), (row.get("dcreate")==null?"":row.get("dcreate").toString()),(row.get("message")==null?"":row.get("message").toString())));    
	}
    result.add(received);
		    
   String sql1 = "select uu.lname as from_user_lname,uu.fname as from_user_fname, mm.*,convert(nvarchar(MAX), mm.created, 23) as dcreate from ncdis.mesages mm left join ncdis.users uu on mm.to_iduser = uu.iduser where mm.from_iduser = "+iduser+"";
   ArrayList<Message> sent = new ArrayList<>();
   List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
  	for(Map row1 : rows1) {
  		sent.add(new Message(row1.get("idmessage").toString(), (row1.get("from_user_fname")==null?"":row1.get("from_user_fname").toString())+" "+(row1.get("from_user_lname")==null?"":row1.get("from_user_lname").toString()),(row1.get("to_iduser")==null?"":row1.get("to_iduser").toString()),(Boolean)row1.get("read"), (Boolean)row1.get("isdelivered"), (row1.get("dcreate")==null?"":row1.get("dcreate").toString()),(row1.get("message")==null?"":row1.get("message").toString())));    
  	}
    result.add(sent);
    logger.log(Level.INFO, "Get User Messages iduser:"+iduser);
	return result;
}
	
	
public HashMap<String, String> getCisystem(int idsystem){
	HashMap<String, String> result = new HashMap<String, String>();
	//default search by chart
	String url = "select * from ncdis.ncdis.cisystems where idsystem = '"+idsystem+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
	for(Map row : rows) {
    	result.put("idsystem", row.get("idsystem").toString());
    	result.put("system_name", row.get("system_name").toString());
    	result.put("system_code", row.get("system_code").toString());
	}
	return result;
}
	
public HashMap<String, String> getRole(int idrole){
	HashMap<String, String> result = new HashMap<String, String>();
	//default search by chart
	String url = "select * from ncdis.ncdis.role where idrole = '"+idrole+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(url);
	for(Map row : rows) {
    	result.put("idrole", row.get("idrole").toString());
    	result.put("role_name", row.get("role_name").toString());
    	result.put("role_code", row.get("role_code").toString());
	}
	return result;
}
	
	
public ArrayList<ArrayList<String>> getUserActions(){
	ArrayList<ArrayList<String>> result = new ArrayList<>();
	String sql = "select top 1000 uu.lname, uu.fname, aa.action_name, ee.data, ee.created 	from ncdis.ncdis.events ee 	left join ncdis.ncdis.users uu on ee.iduser = uu.iduser left join ncdis.ncdis.action aa on ee.idaction = aa.idaction where uu.lname is not null order by ee.created desc";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
    	ArrayList<String> line = new ArrayList<>();
    	line.add(row.get("lname").toString());
    	line.add(row.get("fname").toString());
    	line.add(row.get("action_name").toString());
    	line.add((row.get("data")!=null)?row.get("data").toString():"");
    	line.add(row.get("created").toString());
    	result.add(line);
	}
	logger.log(Level.INFO, "Get User Actions ");
	return result;
}

	
public ArrayList<Note> getUserNotes(String iduserto){
	ArrayList<Note> result = new ArrayList<>();
	String sql = "select * from ncdis.ncdis.notes nn where iduserto="+iduserto+" and active=1 and viewed=0 order by datenote desc";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    for (Map row : rows) {
    	Note note = new Note(
    			row.get("idnote").toString(),
    			row.get("note").toString(),
    			row.get("datenote").toString(),
    			row.get("iduser").toString(),
    			row.get("idpatient").toString(),
    			row.get("active").toString(), 
    			row.get("iduserto").toString(), 
    			row.get("viewed").toString());
        result.add(note);
    }
    
    logger.log(Level.INFO, "Get User Notes iduser:"+iduserto );
    
	return result;
}
	
	
	
public ArrayList<ArrayList<Object>> getUserActionsTop5Dataset(){
	ArrayList<ArrayList<Object>> result = new ArrayList<>();
	String sql = "select top 5 aa.action_name,count(ee.idaction) as cnt  from ncdis.ncdis.events ee left join ncdis.ncdis.action aa on ee.idaction=aa.idaction where ee.created between DATEDIFF(day,7,getdate())  and getdate() group by ee.idaction,aa.action_name";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
    	ArrayList<Object> line = new ArrayList<>();
    	line.add(row.get("action_name"));
    	line.add((Integer)row.get("cnt"));
    	result.add(line);
	}
	return result;
}
	
	
public ArrayList<ArrayList<Object>> getUserTop5Dataset(){
	ArrayList<ArrayList<Object>> result = new ArrayList<>();
	String sql = "select top 5  concat(uu.lname, ' ', uu.fname) as name, count(ee.iduser) acts from ncdis.ncdis.events ee left join ncdis.ncdis.users uu on ee.iduser = uu.iduser where ee.created between DATEDIFF(day,7,getdate())  and getdate() group by  ee.iduser, uu.lname, uu.fname order by acts desc";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
    	ArrayList<Object> line = new ArrayList<>();
    	line.add(row.get("name").toString());
    	line.add((Integer)row.get("acts"));
    	result.add(line);
	}
	return result;
}
	
	
public boolean readPatientNote(String noteid){
	boolean result = false;
	String sql = "update ncdis.ncdis.notes set viewed=1 where idnote = '"+noteid+"'";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Read Patient Note idnote:"+noteid );
	return result;
}
	
public boolean deletePatientNote(String noteid){
	boolean result = false;
	String sql = "delete from ncdis.ncdis.notes where idnote = '"+noteid+"'";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Delete Patient Note idnote :"+noteid);
	return result;
}

	
public ScheduleVisit getScheduleVisit(String idpatient, String iduser){
	ScheduleVisit result  = new ScheduleVisit();
	String sql = "select top 1 case when datediff(month, DATEADD(month, DATEDIFF(month, 0, datevisit), 0), getdate()) > 0 then dateadd(month,frequency * ceiling( datediff(month, DATEADD(month, DATEDIFF(month, 0, datevisit), 0), getdate() ) / cast(frequency as float)) ,datevisit) else	datevisit end as nextdate , idpatient,iduser, idprofesion, frequency from ncdis.ncdis.schedulevisits  where idpatient="+idpatient+" and iduser="+iduser+" order by datevisit desc";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		if(row != null) {
			result = new ScheduleVisit(row.get("idpatient").toString(), row.get("iduser").toString(), row.get("nextdate").toString(), row.get("frequency").toString(), row.get("idprofesion").toString());
		}
    }
	logger.log(Level.INFO, "Get Scheduled Visits iduser:"+iduser+"   idpatient:"+idpatient );
	return result;
}

public boolean setScheduleVisit(String idschedule, String iduser, String idpatient, String scheduledate, String idprofesion, String frequency){
	boolean result = false;
	String sql = "";
	if(idschedule.equals("0")){
		sql="insert into ncdis.ncdis.schedulevisits (iduser,datevisit,idpatient,idprofesion,frequency) values ("+iduser+",'"+scheduledate+"',"+idpatient+","+idprofesion+",'"+frequency+"')";
	}else{
		sql = "update ncdi.ncdis.schedulevisits set iduser="+iduser+", datevisit='"+scheduledate+"', idpatient="+idpatient+", frequency='"+frequency+"' where idschedulevisits="+idschedule+"";
	}
	
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Set Scheduled  Visit  iduser:"+iduser +"   idpatient:"+idpatient );
	return result;
}

	
public ArrayList<Object> getUserPatients(String iduser, String hcpcat){
	ArrayList<Object> result = new ArrayList<>();
    String sql = "SELECT pp.idpatient,concat(pp.fname,' ',pp.lname) as fullname, pp.ramq,pp.chart,pp.idcommunity, cc.name_en as community"
		    + " FROM [ncdis].[ncdis].[patient] pp "
		    + " left join ncdis.ncdis.community cc on pp.idcommunity = cc.idcommunity"
		    + " left join ncdis.ncdis.patient_hcp ph on pp.idpatient = ph.idpatient "
		    + " where pp.active=1 and (pp.dod is null or pp.dod='1900-01-01') and ph."+hcpcat+" = '"+iduser+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
    	HashMap<String, String> obj = new HashMap<>();
    	obj.put("fullname", row.get("fullname").toString());
    	obj.put("idpatient", row.get("idpatient").toString());
    	obj.put("ramq", row.get("ramq").toString());
    	obj.put("chart", row.get("chart").toString());
    	obj.put("idcommunity", row.get("idcommunity").toString());
    	obj.put("community", row.get("community").toString());
    	ScheduleVisit sv = getScheduleVisit(row.get("idpatient").toString(), iduser);
    	obj.put("datevisit", sv.getDatevisit());
    	result.add(obj);
    }
	
	logger.log(Level.INFO, "Get User Patient List : iduser:"+iduser );
	return result;
}

public boolean setResetPassword(String iduser, String rbit){
	boolean result = false;
    String sql = "update ncdis.ncdis.users set reset = "+rbit+" where iduser = "+iduser+"";
    jdbcTemplate.update(sql);
    result = true;
    logger.log(Level.INFO, "Set Reset Password  iduser:"+iduser);
	return result;
}

public boolean setEmailConfirm(String iduser, String confirm){
	boolean result = false;
	String sql = "update ncdis.ncdis.users set confirmmail = "+confirm+" where iduser = "+iduser+"";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Set Email Confirm iduser:"+iduser);
	return result;
}	
	

public void resetUserPassword(User user){
	String sql = "update ncdis.ncdis.users set password='"+user.getPassword()+"', "
				+ "reset='0' "
				+ "where iduser = "+Integer.parseInt(user.getIduser())+" ";
	jdbcTemplate.update(sql);
	logger.log(Level.INFO, "Reset User Password:"+user.getIduser() );
}

public Hashtable<String,ArrayList<ArrayList<String>>> getUserDashboard(String iduser){
	Hashtable<String,ArrayList<ArrayList<String>>> result = new Hashtable();

		String sql1 = "select top 5 count(*) actions, x.action_name from ("
				+ "select  ee.iduser, ee.idaction, u.fname,u.lname, aa.action_code,aa.action_name "
				+ "from ncdis.ncdis.events ee "
				+ "left join ncdis.ncdis.users u on ee.iduser=u.iduser "
				+ "	left join ncdis.ncdis.action aa on ee.idaction = aa.idaction "
				+ "where ee.iduser="+iduser+" "
				+ "and  ee.created between DATEDIFF(day,30,getdate())  and getdate() ) x "
				+ "group by x.iduser,x.fname,x.lname,x.action_code,x.action_name "
				+ "order by actions desc";

		List<Map<String,Object>> rs =  jdbcTemplate.queryForList(sql1);
		
	    ArrayList<ArrayList<String>> actions = new ArrayList();
	    for(int i=0;i<rs.size();i++) {
	    	Map<String,Object> line = rs.get(i);
	    	ArrayList<String> l = new ArrayList();
	    	l.add(line.get("actions").toString());
	    	l.add(line.get("action_name").toString());
	    	actions.add(l);
	    }
	    result.put("actions",actions);
	    
	    
	    String sql2 = "select top 10 data, cast(max(created) as date) as date from ncdis.ncdis.events "
	    		+ "where iduser="+iduser+" and data is not null and created between DATEDIFF(day,30,getdate())  and getdate() "
	    		+ "group by data order by date desc";
	    
	    List<Map<String,Object>> rs2 =  jdbcTemplate.queryForList(sql2);
	    ArrayList<ArrayList<String>> history = new ArrayList();
	    for(int i=0;i<rs2.size();i++) {
	    	Map<String,Object> line = rs2.get(i);
	    	ArrayList<String> l = new ArrayList();
	    	l.add(line.get("date").toString());
	    	l.add(line.get("data").toString());
	    	history.add(l);
	    }
	    result.put("history",history);
	    
	    
	    String sql3 = "select count(*) actions, cast(created as date) date from ncdis.ncdis.events "
	    		+ "where iduser="+iduser+" and created between DATEDIFF(day,30,getdate())  and getdate() "
	    		+ "group by cast(created as date) order by date desc";
	    
	    List<Map<String,Object>> rs3 =  jdbcTemplate.queryForList(sql3);
	    ArrayList<ArrayList<String>> activity = new ArrayList();
	    for(int i=0;i<rs3.size();i++) {
	    	Map<String,Object> line = rs3.get(i);
	    	ArrayList<String> l = new ArrayList();
	    	l.add(line.get("date").toString());
	    	l.add(line.get("actions").toString());
	    	activity.add(l);
	    }
	    result.put("activity",activity);
	    
	    
	return result;
}







}
