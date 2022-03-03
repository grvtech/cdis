package com.grvtech.cdis.db;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.grvtech.cdis.model.Hcp;
import com.grvtech.cdis.model.MessageResponse;
import com.grvtech.cdis.model.Note;
import com.grvtech.cdis.model.Patient;
import com.grvtech.cdis.model.Renderer;
import com.grvtech.cdis.model.Report;
import com.grvtech.cdis.model.ReportCriteria;
import com.grvtech.cdis.model.ReportSubcriteria;
import com.grvtech.cdis.model.User;
import com.grvtech.cdis.model.Value;
import com.grvtech.cdis.model.ValueLimit;
import com.grvtech.cdis.model.Values;
import com.grvtech.cdis.util.FileTool;


@Service
public class CdisDBridge {
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@org.springframework.beans.factory.annotation.Value("${filesfolder}")
	private String filesFolder;
	
	public ArrayList<String> getAllCommunities(){
		ArrayList<String> result = new ArrayList<String>();
		Context initContext;
		DataSource ds;
		ResultSet rs = null;
		Statement cs=null;
		Connection conn = null;
		String sql = "select name_en from ncdis.community where community_code != 'NONC' order by name_en asc";
		try {
			initContext = new InitialContext();
			//Context envContext  = (Context)initContext.lookup("java:comp/env");
			ds = (DataSource)initContext.lookup("jdbc/ncdis");
			conn = ds.getConnection();
		    cs=conn.createStatement();		    
		    cs.setEscapeProcessing(true);
		    rs = cs.executeQuery(sql);
		    while (rs.next()) {
		    	result.add(rs.getString(1));
		    }
		    
		}catch (SQLException se) {
		        se.printStackTrace();
	    } catch (NamingException e) {
			e.printStackTrace();
		} finally {
	        try {
	            rs.close();
	            cs.close();
	            conn.close();
	        } catch (SQLException ex) {
	            ex.printStackTrace();
	        }
	   }
		return result;
	}
	
	public ArrayList<HashMap<String, String>> getHcps(String hcp , String term){
		ArrayList<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();
		String sql = "SELECT iduser,concat(UPPER(LEFT(fname,1))+LOWER(SUBSTRING(fname,2,LEN(fname))),' ',UPPER(LEFT(lname,1))+LOWER(SUBSTRING(lname,2,LEN(lname)))) as name FROM ncdis.ncdis.users where active=1 and idprofesion = (select [idprofesion] from ncdis.ncdis.profesion where profesion_code = '"+hcp.toUpperCase()+"') and (lname like '%"+term+"%' or fname like '%"+term+"%')";
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
        for (Map row : rows) {
        	HashMap<String, String> line = new HashMap<>();
            line.put("iduser",row.get("iduser").toString());
            line.put("name",(row.get("name")==null?"":row.get("name").toString()));
            result.add(line);
        }
		return result;
	}
	
	
	public Patient getPatientByRamq(String ramq){
		Patient result = new Patient();
		String sql = "SELECT p.*, p.death_cause as dcause, pp.province_en as province, cc.name_en as community "
				+ "		from ncdis.patient p  "
				+ "			left join ncdis.province pp on p.idprovince = pp.idprovince "
				+ "			left join ncdis.community cc on p.idcommunity = cc.idcommunity "
				+ "		where p.ramq = '"+ramq+"'";
		
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		if(rows.size() > 0 ) {
			Map<String, Object> row = rows.get(0);
			result = 	new Patient((Integer)row.get("idpatient"), row.get("ramq").toString(), row.get("chart").toString(), (row.get("band")==null?"":row.get("band").toString()),
	        		(row.get("giu")==null?"":row.get("giu").toString()), (row.get("jbnqa")==null?"":row.get("jbnqa").toString()), (row.get("fname")==null?"":row.get("fname").toString()), (row.get("lname")==null?"":row.get("lname").toString()), row.get("sex").toString(),
	        		(row.get("dob")==null?"":row.get("dob").toString()), (row.get("mfname")==null?"":row.get("mfname").toString()), (row.get("mlname")==null?"":row.get("mlname").toString()), (row.get("pfname")==null?"":row.get("pfname").toString()),
	        		(row.get("plname")==null?"":row.get("plname").toString()), (row.get("address")==null?"":row.get("address").toString()), (row.get("city")==null?"":row.get("city").toString()), (row.get("province")==null?"":row.get("province").toString()),
	        		(row.get("postalcode")==null?"":row.get("postalcode").toString()), row.get("consent")==null?0:(short)row.get("consent"), row.get("iscree")==null?-1:(short)row.get("iscree"), (row.get("dod")==null?"":row.get("dod").toString()),
	        		(row.get("dcause")==null?"":row.get("dcause").toString()), (row.get("entrydate")==null?"":row.get("entrydate").toString()), (row.get("idcommunity")==null?"":row.get("idcommunity").toString()), (row.get("community")==null?"":row.get("community").toString()), (row.get("idprovince")==null?"":row.get("idprovince").toString()),(row.get("phone")==null?"":row.get("phone").toString()));
			
		}
		return result;
	}
	
	
	
	public Patient getPatientById(int id){
		Patient result = new Patient();
		
		String sql = "SELECT p.*, p.death_cause as dcause, pp.province_en as province, cc.name_en as community "
				+ "		from ncdis.patient p  "
				+ "			left join ncdis.province pp on p.idprovince = pp.idprovince "
				+ "			left join ncdis.community cc on p.idcommunity = cc.idcommunity "
				+ "		where p.idpatient ="+id+" ";
		
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		if(rows.size() > 0 ) {
			Map<String, Object> row = rows.get(0);
			result = 	new Patient((Integer)row.get("idpatient"), row.get("ramq").toString(), row.get("chart").toString(), (row.get("band")==null?"":row.get("band").toString()),
	        		(row.get("giu")==null?"":row.get("giu").toString()), (row.get("jbnqa")==null?"":row.get("jbnqa").toString()), (row.get("fname")==null?"":row.get("fname").toString()), (row.get("lname")==null?"":row.get("lname").toString()), row.get("sex").toString(),
	        		(row.get("dob")==null?"":row.get("dob").toString()), (row.get("mfname")==null?"":row.get("mfname").toString()), (row.get("mlname")==null?"":row.get("mlname").toString()), (row.get("pfname")==null?"":row.get("pfname").toString()),
	        		(row.get("plname")==null?"":row.get("plname").toString()), (row.get("address")==null?"":row.get("address").toString()), (row.get("city")==null?"":row.get("city").toString()), (row.get("province")==null?"":row.get("province").toString()),
	        		(row.get("postalcode")==null?"":row.get("postalcode").toString()), row.get("consent")==null?0:(Integer)row.get("consent"), row.get("iscree")==null?1:(Integer)row.get("iscree"), (row.get("dod")==null?"":row.get("dod").toString()),
	        		(row.get("dcause")==null?"":row.get("dcause").toString()), (row.get("entrydate")==null?"":row.get("entrydate").toString()), (row.get("idcommunity")==null?"":row.get("idcommunity").toString()), (row.get("community")==null?"":row.get("community").toString()), (row.get("idprovince")==null?"":row.get("idprovince").toString()),(row.get("phone")==null?"":row.get("phone").toString()));
			
		}
		
		return result;
	}

	public MessageResponse updatePatient(Patient pat){
		MessageResponse result = new MessageResponse("EDITP-DB",false,"en",new ArrayList<>());
		
			String sql = "update ncdis.ncdis.patient set "
					+ "chart="+pat.getChart()+", "
					+ "band='"+pat.getBand()+"', "
					+ "giu='"+pat.getGiu()+"', "
					+ "jbnqa='"+pat.getJbnqa()+"', "
					+ "fname='"+pat.getFname()+"', "
					+ "lname='"+pat.getLname()+"', "
					+ "sex='"+pat.getSex()+"',"
		    		+ "dob='"+pat.getDob()+"', "
		    		+ "mfname='"+pat.getMfname()+"', "
		    		+ "mlname='"+pat.getMlname()+"', "
		    		+ "pfname='"+pat.getPfname()+"', "
		    		+ "plname='"+pat.getPlname()+"', "
		    		+ "address='"+pat.getAddress()+"', "
		    		+ "postalcode='"+pat.getPostalcode()+"', "
		    		+ "dod='"+pat.getDod()+"', "
		    		+ "death_cause='"+pat.getDcause()+"', "
		    		+ "idcommunity='"+pat.getIdcommunity()+"', "
		    		+ "iscree='"+pat.getIscree()+"', "
		    		+ "phone='"+pat.getPhone()+"' "
		    		+ "where idpatient='"+pat.getIdpatient()+"'";
		    
		jdbcTemplate.update(sql);
			
	    result.setStatus(0);
		return result;
	}
	
	public MessageResponse addPatient(Patient pat){
		
		MessageResponse result = new MessageResponse("EDITP-DB",false,"en",new ArrayList<>());
		SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
		
		String query = "insert into ncdis.ncdis.patient (ramq,chart,band,giu,jbnqa,fname,lname,sex,dob,mfname,mlname,pfname,plname,address,postalcode,dod,death_cause,idcommunity,phone,entrydate,active) "
				+" values("
				+ pat.getRamq().toUpperCase()+","
				+ pat.getChart()+","
				+ pat.getBand().toUpperCase()+","
				+ pat.getGiu()+","
				+ pat.getJbnqa()+","
				+ pat.getFname()+","
				+ pat.getLname()+","
				+ pat.getSex()+","
				+ pat.getDob()+","
				+ pat.getMfname()+","
				+ pat.getMlname()+","
				+ pat.getPfname()+","
				+ pat.getPlname()+","
				+ pat.getAddress()+","
				+ pat.getPostalcode()+","
				+ pat.getDod()+","
				+ pat.getDcause()+","
				+ pat.getIdcommunity()+","
				+ pat.getPhone()+","
				+ sdf.format(new Date())+","
				+ "'1')";
		    
	    int stat = jdbcTemplate.update(query);
		    
	    result.setStatus(stat);
	return result;
}
	
	
public Hcp getHcpById(String idpatient){
	Hcp result = new Hcp();
	String sql="select * from ncdis.ncdis.patient_hcp h  where h.idpatient = "+idpatient+"";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	if(rows.size() > 0) {
		Map row = rows.get(0);
		result = 	new Hcp( (row.get("casem")==null?"":row.get("casem").toString()) , (row.get("md")==null?"":row.get("md").toString()), (row.get("nut")==null?"":row.get("nut").toString()), (row.get("nur")==null?"":row.get("nur").toString()), (row.get("chr")==null?"":row.get("chr").toString()), row.get("idpatient").toString());
	}
	return result;
}
	
	
public Hcp getHcpOfPatient(int idpatient){
	Hcp result = new Hcp();
	String sql="select * from ncdis.ncdis.patient_hcp h  where h.idpatient = "+idpatient+"";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	if(rows.size() > 0) {
		Map row = rows.get(0);
		result = 	new Hcp( (row.get("casem")==null?"":row.get("casem").toString()) , (row.get("md")==null?"":row.get("md").toString()), (row.get("nut")==null?"":row.get("nut").toString()), (row.get("nur")==null?"":row.get("nur").toString()), (row.get("chr")==null?"":row.get("chr").toString()), row.get("idpatient").toString());
	}
	return result;
}
	



public int deleteHcpOfPatient(int idpatient){
	int result = 0;
	String sql="delete from ncdis.patient_hcp where idpatient = "+idpatient+";";
	result = jdbcTemplate.update(sql);
	return result;
}


	
public boolean setHcpOfPatient(int idpatient,  String casem, String md, String nut, String nur, String chr){
	boolean result = false;
	deleteHcpOfPatient(idpatient);
	String sql = "insert into ncdis.patient_hcp (idpatient, casem, md, nut, nur,chr, idsystem) values ("+idpatient+",0,"+md+","+nut+","+nur+","+chr+", 1)";
	System.out.println(sql);
	
	jdbcTemplate.update(sql);
	result = true;
	return result;
}


public boolean setOneHcpOfPatient(String idpatient,  String iduser, String hcpcode){
	boolean result = false;
	String sql= "update ncdis.ncdis.patient_hcp set "+hcpcode+"="+iduser+" where idpatient="+idpatient;
	jdbcTemplate.update(sql);
	result = true;
	return result;
}
	
	
public Object getValues(String section, int idpatient, String sort){
	Object result = null;
	
	Map<String,String> sections = new HashMap<>();
	sections.put("Diabet", "DIAB");
	sections.put("MDVisit", "MDV");
	sections.put("Renal", "REN");
	sections.put("Lipid", "LIP");
	sections.put("Lab", "LAB");
	sections.put("Complications", "COM");
	sections.put("Miscellanous", "MISC");
	sections.put("Meds", "MEDS");
	sections.put("Depression", "DEP");

	String sql = "select avv.idvalue , dv.data_name as name, dv.data_unit as unit, avv.datevalue as date, avv.value as value , dv.data_type as type, lower(dv.data_code) as code, dv.data_order as dorder "
			+ "		from "
			+ "			(select dd.iddata, dd.data_name, dd.data_unit, dd.data_code,dd.data_type, dd.data_order "
			+ "			from ncdis.ncdis.cdis_data dd left join ncdis.ncdis.cdis_section css on dd.idsection = css.idsection  "
			+ "			where css.section_code = '"+sections.get(section)+"' and dd.active=1) as dv "
			+ " "
			+ "		left join (select vv.idvalue, vv.datevalue, vv.value, vv.iddata "
			+ "					from ncdis.ncdis.cdis_value vv  "
			+ "					where vv.idpatient ="+idpatient+" "
			+ "						and vv.iddata in (select dd.iddata "
			+ "											from ncdis.ncdis.cdis_data dd left join ncdis.ncdis.cdis_section css on dd.idsection = css.idsection  "
			+ "											where css.section_code = '"+sections.get(section)+"' ) "
			+ "					) avv on dv.iddata = avv.iddata "
			+ "		order by avv.datevalue desc";

	
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    HashMap<String, Values> params = new HashMap<String, Values>();
    ArrayList<String> columns = new ArrayList<>();
    
	for(Map row: rows) {
		Values av = new Values();
    	String c = row.get("code").toString();
    	if(columns.contains(c)){
    		av = params.get(c);
    	}else{
    		columns.add(c);
    	}
    	String dStr = "NULL";
    	if(row.get("date") != null){
    		dStr = sdf.format(row.get("date"));
    	}
        Value val = new Value(row.get("idvalue")==null?0:(Integer)row.get("idvalue"), (row.get("name")==null?"":row.get("name").toString()) , (row.get("value")==null?"":row.get("value").toString()), (row.get("type")==null?"":row.get("type").toString()), dStr, (row.get("unit")==null?"":row.get("unit").toString()), (row.get("code")==null?"":row.get("code").toString()), row.get("dorder")==null?0:(int)row.get("dorder"));
        av.addValue(val);
        params.put(c,av);
	}

	String className = "com.grvtech.cdis.model."+section;
    try {
    	Class cl = Class.forName(className);
	    Constructor[] cons = cl.getConstructors();
	    //Constructor con = cons[0];
	    Constructor con =  cl.getConstructor(HashMap.class);
		result = con.newInstance(params);
	} catch (InstantiationException | IllegalAccessException
			| IllegalArgumentException | InvocationTargetException e) {
		e.printStackTrace();
	} catch (ClassNotFoundException e) {
		e.printStackTrace();
	} catch (NoSuchMethodException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (SecurityException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	    
	return result;
}

public ValueLimit getValueLimits(String valuename){
	ValueLimit result = null;
	String sql = "select cdl.*  from ncdis.ncdis.cdis_data_limit cdl left join ncdis.ncdis.cdis_data cd on cdl.iddata=cd.iddata where cd.data_code = '"+valuename+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	if(rows.size() > 0) {
		Map row = rows.get(0);
		result = new ValueLimit(row.get("minvalue").toString(), row.get("maxvalue").toString(), row.get("startvalue").toString(), row.get("endvalue").toString());
	}
	return result;
}
	
public HashMap<String, String> getABCData(String idpatient){
	HashMap<String, String> result = new HashMap<>();
	String sql = "select * from ncdis.configuration cc where cc.keia like 'abcgraph%' order by keia asc";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		String k = row.get("keia").toString();
    	String v = row.get("value").toString();
    	result.put(k, v);
	}
	return result;
}

public boolean addValue(String valueName, String valueValue, String valueDate, String idpatient){
	boolean result = false;
	String sql = "insert into ncdis.ncdis.cdis_value (idpatient, datevalue, value, iddata) values ("+idpatient+", '"+valueDate+"', '"+valueValue+"', (select iddata from ncdis.ncdis.cdis_data where data_code = '"+valueName+"'));";
	jdbcTemplate.update(sql);
	result = true;
	return result;	
}
	
public boolean deleteValue(String idvalue){
	boolean result = false;
	String sql = "delete from ncdis.ncdis.cdis_value where idvalue = '"+idvalue+"'";
	jdbcTemplate.update(sql);
	result = true;
	return result;	
}
	
	
public boolean editValue(String valueName, String valueValue, String valueDate, String idpatient, String idvalue){
	boolean result = false;
	String sql = "update ncdis.ncdis.cdis_value set datevalue = '"+valueDate+"', value = '"+valueValue+"' where idpatient = '"+idpatient+"' and iddata = (select iddata from ncdis.ncdis.cdis_data where data_code = '"+valueName+"') and idvalue = '"+idvalue+"';";
	jdbcTemplate.update(sql);
	result = true;
	return result;	
}
	
public boolean editPatient(Patient patient){
	boolean result = false;
	String sql = "update ncdis.ncdis.patient set "
				+ " band = '"+patient.getBand()+"', "
				+ " ramq = '"+patient.getRamq()+"', "
				+ " giu = '"+patient.getGiu()+"', "
				+ " jbnqa = '"+patient.getJbnqa()+"', "
				+ " fname = '"+patient.getFname()+"', "
				+ " lname = '"+patient.getLname()+"', "
				+ " sex = '"+patient.getSex()+"', "
				+ " dob = '"+((patient.getDob() == null)?"":patient.getDob())+"', " 
				+ " mfname = '"+patient.getMfname()+"', "
				+ " mlname = '"+patient.getMlname()+"', "
				+ " pfname = '"+patient.getPfname()+"', "
				+ " plname = '"+patient.getPlname()+"', "
				+ " address = '"+patient.getAddress()+"', "
				+ " city = '"+patient.getCity()+"', "
				+ " idprovince = "+patient.getIdprovince()+", "
				+ " postalcode = '"+patient.getPostalcode()+"', "
				+ " consent = "+patient.getConsent()+", "
				+ " iscree = "+patient.getIscree()+", "
				+ " dod = '"+((patient.getDod() == null)?"":patient.getDod())+"', "
				+ " death_cause = '"+patient.getDcause()+"', "
				+ " idcommunity = "+patient.getIdcommunity()+" "
				+ " where idpatient = '"+patient.getIdpatient()+"' ";
		
	jdbcTemplate.update(sql);
	result = true;
	return result;	
}
	
	
public boolean deletePatient(String idpatient){
	boolean result = false;
	String sql = "update ncdis.ncdis.patient  set active=0 where idpatient = '"+idpatient+"'";
	jdbcTemplate.update(sql);
	result = true;
	return result;	
}
	
	
public ArrayList<Report> getReports(String iduser, String idcommunity, String type){
	ArrayList<Report> result = new ArrayList<>();
	String sql = "";
	if(type.equals("ADMIN")){
		sql = "select rr.*,CONCAT(uu.fname, uu.lname) as owner  from ncdis.ncdis.reports rr left join ncdis.ncdis.users uu on rr.iduser = uu.iduser where rr.report_code like 'ADMIN%'";
	}else if(type.equals("PERSONAL")){
		sql = "select rr.*,CONCAT(uu.fname, uu.lname) as owner  from ncdis.ncdis.reports rr left join ncdis.ncdis.users uu on rr.iduser = uu.iduser where rr.iduser = '"+iduser+"' and rr.report_code like 'PERSONAL%'";
	}else if(type.equals("REP")){
		sql = "select rr.*,CONCAT(uu.fname, uu.lname) as owner  from ncdis.ncdis.reports rr left join ncdis.ncdis.users uu on rr.iduser = uu.iduser where rr.report_code like 'REP%'";
	}else if(type.equals("LIST")){
		sql = "select rr.*,CONCAT(uu.fname, uu.lname) as owner  from ncdis.ncdis.reports rr left join ncdis.ncdis.users uu on rr.iduser = uu.iduser where rr.report_code like 'LIST.%'";
	}

	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		Report rep = new Report(row.get("idreport").toString(), row.get("report_name")==null?"":row.get("report_name").toString(), row.get("report_code")==null?"":row.get("report_code").toString(), row.get("owner")==null?"":row.get("owner").toString(), row.get("modified")==null?"":row.get("modified").toString());
    	result.add(rep);
	}
	return result;
}


public HashMap<String, ArrayList<Report>> getUserReports(String userRole, String idcommunity, String iduser){
	HashMap<String, ArrayList<Report>> result = new HashMap<>();
	ArrayList<Report> predefinedReports = new ArrayList<>();
	ArrayList<Report> listsReports = new ArrayList<>();
	ArrayList<Report> adminReports = new ArrayList<>();
	ArrayList<Report> personalReports = new ArrayList<>();
	
	if(userRole.equals("ROOT")){
		predefinedReports = getReports(iduser, "0","REP"); 
		adminReports = getReports("1", "0", "ADMIN");
		result.put("predefined",predefinedReports);
		if(userRole.equals("ROOT")){
			personalReports = getReports(iduser, "0","PERSONAL");
		}else{
			personalReports = getReports(iduser, idcommunity,"PERSONAL");
		}
		//personalReports = getPersonalReports(iduser, idcommunity, userRole);
		
		//listsReports = getListsReports(iduser, "0");
		listsReports = getReports(iduser, "0","LIST");
		result.put("lists",listsReports);
		result.put("personal",personalReports);
		result.put("admin",adminReports);
	}else if(userRole.equals("USER")){
		//predefinedReports = getPredefinedReports(iduser, idcommunity);
		predefinedReports = getReports(iduser, idcommunity,"REP"); 
		
		
		result.put("predefined",predefinedReports);
		if(userRole.equals("ROOT")){
			personalReports = getReports(iduser, "0","PERSONAL");
		}else{
			personalReports = getReports(iduser, idcommunity,"PERSONAL");
		}
		//personalReports = getPersonalReports(iduser, idcommunity, userRole);
		result.put("personal",personalReports);
		
		//listsReports = getListsReports(iduser, "0");
		listsReports = getReports(iduser, "0","LIST");
		result.put("lists",listsReports);
	}else{
		//predefinedReports = getPredefinedReports(iduser, "0");
		predefinedReports = getReports(iduser, "0","REP"); 
		result.put("predefined",predefinedReports);
	}
	return result;
}



	
public String saveReport(JsonObject reportObject){
	String result = "";
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	result = sdf.format(new Date());
	String sql = "insert into ncdis.ncdis.reports (report_name, report_code, iduser, created) values ('"+reportObject.get("title").getAsString()+"','PERSONAL"+sdf.format(new Date())+"','"+reportObject.get("iduser").getAsString()+"','"+reportObject.get("generated").getAsString()+"')";
	jdbcTemplate.update(sql);
	return result;	
}

	
public String getIddata(String dataName){
	String result = "";
	String sql = "select iddata from ncdis.ncdis.cdis_data where data_code = '"+dataName.toUpperCase()+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	if(rows.size() > 0) {
		Map row = rows.get(0);
		result = row.get("iddata").toString();
	}
	return result;
}
	
	
public ArrayList<ArrayList<String>> executeReport(ReportCriteria criteria, String reportType, ArrayList<ReportSubcriteria> subcriterias){
	ArrayList<ArrayList<String>> result = new ArrayList<>();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

	if(reportType.equals("list")){
		String val = criteria.getValue();
		String nom = criteria.getName();
		String op = Renderer.renderOperator(criteria.getOperator());
			
		if(criteria.getSection().equals("1")){
			String criteriaStr = " and nn."+nom+" "+op+" '"+val+"' ";
			if(op.equals("between")){
				String[] parts = val.split("\\s*and+\\s*");
				String part1 = parts[0].trim();
				String part2 = parts[1].trim();
				String between1 = "'"+part1+"'";
				String between2 = "'"+part2+"'";
				if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
				if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
				criteriaStr = " and nn."+nom+" "+op+" "+between1+" and "+ between2;
			}
				
			if(val.equals("all") || val.equals("0")){criteriaStr = "";}
			String vn = "nn."+nom;
			String sql = "select nn.idpatient, "+vn+"  from ncdis.ncdis.patient nn  "
					+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
					+ " "+ criteriaStr+ " "
					+ "order by nn.idpatient asc";
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		    int index=0;
			for(Map row : rows) {
		    	ArrayList<String> line = new ArrayList<>();
		    	if(row.get(nom) == null || row.get(nom).toString().equals("null")) {
		    		line.add(Integer.toString(index));
		    		line.add(row.get("idpatient").toString());
		    		line.add(nom);
		    		line.add("");
		    		line.add("");
		    	}else{
		    		line.add(Integer.toString(index));
		    		line.add(row.get("idpatient").toString());
		    		line.add(nom);
		    		if(criteria.getName().equals("sex") || criteria.getName().equals("idcommunity") || criteria.getName().equals("dtype")){
		    			line.add( Renderer.renderName(nom+"."+row.get(nom).toString()));
					}else{
						line.add(row.get(nom).toString());
					}
		    		line.add("");
		    	}
		    	result.add(line);
		    	index++;
			}
			
		}else{
			String sql = "";
			String criteriaStr = " and cast(nn.value as float) "+op+" "+val+" ";
			String criteriaStrSub = " and cast(aa.value as float) "+op+" "+val+" ";

			if(op.equals("=")){
				String[] parts = val.split("\\s*or+\\s*");
				if(parts.length > 1){
					criteriaStr = "  ";
					criteriaStrSub = "  ";
					for(int i=0;i<parts.length;i++){
						String part = parts[i].trim();
						if(i == 0){
							criteriaStr += " and (cast(nn.value as float) "+op+" "+part+" ";
							criteriaStrSub += " and (cast(aa.value as float) "+op+" "+part+" ";
						}else if(i == parts.length -1){
							criteriaStr += " or cast(nn.value as float) "+op+" "+part+") ";
							criteriaStrSub += " or cast(aa.value as float) "+op+" "+part+") ";
						}else{
							criteriaStr += " or cast(nn.value as float) "+op+" "+part+" ";
							criteriaStrSub += " or cast(aa.value as float) "+op+" "+part+" ";
						}
						
					}
				}
			}
				
			if(criteria.getDatevalue().equals("last")){
				if(val.equals("all") || val.equals("0")){
					criteriaStr = "";
					criteriaStrSub = "";
				}
				
				sql = "select aa.idpatient,replace(convert(varchar,aa.datevalue,102),'.','-') as datevalue, aa.value "
						+ " from ncdis.dbo.LastdateValue aa "
						+ "where isnumeric(aa.value)=1  "
						+ "and aa.iddata='"+criteria.getIddata()+"' "
						+ " "+ criteriaStrSub+ " "
						+ "order by aa.idpatient asc";
				
				
			}else if(criteria.getDatevalue().equals("all")){
				if(val.equals("all")){
					criteriaStr = "";
				}
				sql = "select nn.idpatient, replace(convert(varchar,nn.datevalue,102),'.','-') as datevalue,nn.value from ncdis.ncdis.cdis_value nn  "
						+ "where "
						+ "isnumeric(nn.value) =1 and  nn.iddata = '"+criteria.getIddata()+"' "
						+ " "+ criteriaStr+ " "
						+ "order by nn.idpatient asc";
			}else{
				if(val.equals("all")){
					criteriaStr = "";
				}
				
				String dateValue = criteria.getDatevalue();
				String dateOperator = criteria.getDateoperator();
				if(dateOperator.equals("between")){
					String[] parts = dateValue.split("\\s*and+\\s*");
					String part1 = parts[0].trim();
					String part2 = parts[1].trim();
					String between1 = "'"+part1+"'";
					String between2 = "'"+part2+"'";
					
					if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){
						between1 = part1;
					}
					if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){
						between2 = part2;
					}
					dateValue = between1+" and "+between2;
				}
				
				sql = "select nn.idpatient, replace(convert(varchar,nn.datevalue,102),'.','-') as datevalue,nn.value from ncdis.ncdis.cdis_value nn  "
						+ "where nn.datevalue "+Renderer.renderOperator(dateOperator)+" "+dateValue
								+ " and nn.iddata = '"+criteria.getIddata()+"' "
								+ " "+ criteriaStr+ " "
										+ "order by nn.idpatient asc";
				
				
			}

			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		    int index=0;
			for(Map row : rows) {
				ArrayList<String> line = new ArrayList<>();
		    	line.add(Integer.toString(index));
	    		line.add(row.get("idpatient").toString());
	    		line.add(nom);
	    		if(criteria.getName().equals("sex") || criteria.getName().equals("idcommunity") || criteria.getName().equals("dtype")){
	    			line.add( Renderer.renderName(nom+"."+row.get("value").toString()));
				}else{
					line.add(row.get("value").toString());
				}
	    		line.add(row.get("datevalue").toString());
	    		result.add(line);
	    		index++;
			}
		}
	}else if(reportType.equals("graph")){
			
			String val = criteria.getValue();
			String nom = criteria.getName();
			String op = Renderer.renderOperator(criteria.getOperator());
			String sql = "";
			int sec = Integer.parseInt(criteria.getSection());
			
			
			if(sec == 1){
				String subStrFrom = "";
				String subStrWhere = "";
				if(subcriterias.size() > 0){
					for(int x=0;x<subcriterias.size();x++){
						ReportSubcriteria rsc = subcriterias.get(x);
						if(rsc.getSubsection().equals("1")){
							//subStrFrom = " left join ncdis.ncdis.patient dd on pp.idpatient = dd.idpatient ";
							subStrWhere = " and bb."+rsc.getSubname()+" "+Renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+ "' ";
							sql = "select count(*) as cnt "
									+ " from ncdis.ncdis.patient bb"
									+ " inner join (select idpatient, dob as maxdate from ncdis.ncdis.patient where "+nom+" "+op+" '"+val+"' and (dod is null or dod ='1900-01-01')) cc"
									+ " on bb.idpatient = cc.idpatient"
									+ " where bb.idpatient > 0 and bb.active=1 and (bb.dod is null or bb.dod = '1900-01-01')"
									+ subStrWhere;
						}else{
							//subStrFrom = " left join ncdis.ncdis.cdis_value dd on pp.idpatient = dd.idpatient ";
							
							sql = "select count(*) cnt"
									+ " from ncdis.ncdis.patient bb"
									+ "     inner join 	(select xx.idpatient, max(xx.datevalue) as mdate from ncdis.ncdis.cdis_value xx where xx.iddata='"+criteria.getIddata()+"'	and cast(case when coalesce(patindex('%[0-9]%', xx.value),0) = 0  then '0' else xx.value end as float) "+Renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+"' group by xx.idpatient) dd on dd.idpatient = bb.idpatient"
									+ " where"
									+ " bb.active  = '1' "
									+ " and "+nom+" "+op+" "+"'"+val+"'"
									+ " and (bb.dod is null or bb.dod = '1900-01-01')";

						}
					
						System.out.println(sql);
						List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
					    int index=0;
						for(Map row : rows) {
							ArrayList<String> line = new ArrayList<>();
					    	line.add(Integer.toString(index));
				    		line.add(nom);
							line.add(row.get("cnt").toString());
				    		result.add(line);
				    		index++;
						}
					}
				}else{
					sql = "select count(pp.idpatient) as cnt from ncdis.ncdis.patient pp "+subStrFrom+" where pp.active=1 and (pp.dod is null or pp.dod = '1900-01-01') and pp."+nom+" "+op+" '"+val+"' "+subStrWhere +"  ";
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
				    int index=0;
					for(Map row : rows) {
						ArrayList<String> line = new ArrayList<>();
				    	line.add(Integer.toString(index));
			    		line.add(nom);
						line.add(row.get("cnt").toString());
			    		result.add(line);
			    		index++;
					}
				}
				
			}else if(sec >= 50 ){
				
				String table = "ncdis.dbo.PatientAgePeriods";
				if(sec == 50){
					table = "ncdis.dbo.PatientAgePeriods";
				}else if(sec == 51){
					table = "ncdis.dbo.DiabetAgePeriods";
				}else if(sec == 52){
					table = "ncdis.dbo.A1CGroups";
				}else if(sec == 53){
					table = "ncdis.dbo.LDLGroups";
				}else if(sec == 54){
					table = "ncdis.dbo.GFRGroups";
				}else if(sec == 55){
					table = "ncdis.dbo.PCRACRGroups";
				}
				
				
				
				/* start section 50++   */
				String criteriaStr = "select count(*) as cnt  from "+table+" bb";
				String criteriaWhere = "where bb."+criteria.getName()+" "+Renderer.renderOperator(criteria.getOperator())+" "+criteria.getValue();
				String subcriteriaStr = "";
				if(subcriterias.size() > 0){
					for(int x=0;x<subcriterias.size();x++){
						ReportSubcriteria rsc = subcriterias.get(x);
						if(rsc.getSubsection().equals("1")){
							//subcriteriaStr += " inner join (select distinct idpatient from ncdis.ncdis.patient where "+rsc.getSubname()+" "+Renderer.renderOperator(rsc.getSuboperator())+" "+rsc.getSubvalue()+" and (dod is null or dod ='1900-01-01')) cc"+x+" on bb.idpatient = cc"+x+".idpatient";
							subcriteriaStr += " and bb."+rsc.getSubname()+" "+Renderer.renderOperator(rsc.getSuboperator())+" "+rsc.getSubvalue()+" ";
						}else if(rsc.getSubsection().equals("90")){
							//subcriteriaStr += " inner join (select distinct idpatient from ncdis.ncdis.cdis_value where iddata = '"+rsc.getSubiddata()+"' and value "+Renderer.renderOperator(rsc.getSuboperator())+" "+Renderer.renderValue(rsc.getSubsection()+"."+rsc.getSubvalue())+") cc"+x+" on bb.idpatient = cc"+x+".idpatient";
							subcriteriaStr += " and bb.dtype "+Renderer.renderOperator(rsc.getSuboperator())+" "+Renderer.renderValue(rsc.getSubsection()+"."+rsc.getSubvalue())+" ";
						}else{
							subcriteriaStr += " inner join (select distinct idpatient from ncdis.ncdis.cdis_value where iddata = '"+rsc.getSubiddata()+"' and value "+Renderer.renderOperator(rsc.getSuboperator())+" "+rsc.getSubvalue()+") cc"+x+" on bb.idpatient = cc"+x+".idpatient";
						}
					}
					
					//sql = criteriaStr +" "+subcriteriaStr + " "+criteriaWhere;
					sql = criteriaStr + " "+criteriaWhere +" "+subcriteriaStr ;
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
				    int index=0;
					for(Map row : rows) {
				    	ArrayList<String> line = new ArrayList<>();
				    	line.add(Integer.toString(index));
			    		line.add(nom);
						line.add(row.get("cnt").toString());
			    		result.add(line);
			    		index++;
					}
					
				}else{
					/*section 50 no subcriteria*/
					sql = criteriaStr + " "+ criteriaWhere;
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
				    int index=0;
					for(Map row : rows) {
				    	ArrayList<String> line = new ArrayList<>();
				    	line.add(Integer.toString(index));
			    		line.add(nom);
						line.add(row.get("cnt").toString());
			    		result.add(line);
			    		index++;
					}
				}
				/*end section 50 ++ */
			}else{
				
				/*section is not 1*/
				String criteriaStr = " and nn.value "+op+" '"+val+"' ";
				String criteriaStrSub = " and aa.value "+op+" '"+val+"' ";
				String subStrFrom = "";
				String subStrWhere = "";
				
				if(subcriterias.size() > 0){
					for(int x=0;x<subcriterias.size();x++){
						ReportSubcriteria rsc = subcriterias.get(x);
						
						//System.out.println("SUBin SQL :"+rsc.getSubvalue());
						
						if(rsc.getSubsection().equals("1")){
							sql = "select count(*) cnt"
									+ " from ncdis.ncdis.patient bb"
									+ "     inner join 	(select aa.idpatient, max(datevalue) maxdate from ncdis.ncdis.cdis_value aa where  aa.iddata='"+criteria.getIddata()+"' and aa.value "+Renderer.renderOperator(criteria.getOperator())+" '"+criteria.getValue()+"' group by aa.idpatient) cc"
									+ "     on bb.idpatient = cc.idpatient"
									+ " where (bb.dod is null or bb.dod = '1900-01-01') and "
									+ "  bb."+rsc.getSubname()+" "+Renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+ "' ";
						
						}else if(rsc.getSubsection().equals("90")){
							sql = "select count(*) cnt"
									+ " from ncdis.ncdis.cdis_value bb"
									+ "   left join 	(select aa.idpatient, max(datevalue) maxdate from ncdis.ncdis.cdis_value aa where  aa.iddata='"+criteria.getIddata()+"' and aa.value "+Renderer.renderOperator(criteria.getOperator())+" '"+criteria.getValue()+"' group by aa.idpatient) cc"
									+ "    on bb.idpatient = cc.idpatient"
									+ " where  "
									+ " bb.iddata  = '"+rsc.getSubiddata()+"'"
									+ " and cast(case when coalesce(patindex('%[0-9]%', bb.value),0) = 0  then '0' else bb.value end as float) "+Renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+"'"
									+ " and cc.maxdate is not null"
									+ " and bb.datevalue = (select max(xx.datevalue) from ncdis.ncdis.cdis_value xx where xx.iddata='"+rsc.getSubiddata()+"' and xx.idpatient = bb.idpatient group by xx.idpatient)";
						}else{
							sql = "select count(*) cnt"
									+ " from ncdis.ncdis.cdis_value bb"
									+ "   left join 	(select aa.idpatient, max(datevalue) maxdate from ncdis.ncdis.cdis_value aa where  aa.iddata='"+criteria.getIddata()+"' and aa.value "+Renderer.renderOperator(criteria.getOperator())+" '"+criteria.getValue()+"' group by aa.idpatient) cc"
									+ "    on bb.idpatient = cc.idpatient"
									+ " where  "
									+ " bb.iddata  = '"+rsc.getSubiddata()+"'"
									+ " and cast(case when coalesce(patindex('%[0-9]%', bb.value),0) = 0  then '0' else bb.value end as float) "+Renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+"'"
									+ " and cc.maxdate is not null"
									+ " and bb.datevalue = (select max(xx.datevalue) from ncdis.ncdis.cdis_value xx where xx.iddata='"+rsc.getSubiddata()+"' and xx.idpatient = bb.idpatient group by xx.idpatient)";
						}
						List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
					    int index=0;
						for(Map row : rows) {
					    	ArrayList<String> line = new ArrayList<>();
					    	line.add(Integer.toString(index));
				    		line.add(nom);
							line.add(row.get("cnt").toString());
				    		result.add(line);
				    		index++;
						}
					}
				}else{
					sql = "select count(nn.idpatient) as cnt from ncdis.ncdis.cdis_value nn  "+subStrFrom
							+ "where nn.datevalue = (select max(datevalue) from ncdis.ncdis.cdis_value aa where aa.idpatient = nn.idpatient "
							+ "and aa.iddata=(select iddata from ncdis.ncdis.cdis_data where data_code = '"+criteria.getName().toUpperCase()+"')) 	"
									+ "and nn.iddata = '"+criteria.getIddata()+"' "
									+ " "+ criteriaStr+ " "+subStrWhere
											+ " ";
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
				    int index=0;
					for(Map row : rows) {
				    	ArrayList<String> line = new ArrayList<>();
				    	line.add(Integer.toString(index));
			    		line.add(nom);
						line.add(row.get("cnt").toString());
			    		result.add(line);
			    		index++;
					}
				}
			}
		}
		return result;
	}

	public ArrayList<Hashtable<String, String>> executeReportFlist(String dataName, JsonArray criterias){
		ArrayList<Hashtable<String, String>> result = new ArrayList<>();
		Gson gson = new Gson();
		String iddata = getIddata(dataName);
		
		String sql = "SELECT p.idpatient, p.ramq, p.chart, p.giu, p.sex, DATEDIFF(year, p.dob, GETDATE()) AS age, p.idcommunity, lv.value as "+dataName+", lv.datevalue as "+dataName+"Date, ldv.value as dtype, ldv.datevalue as dtypeDate"
				+ " FROM ncdis.ncdis.patient as p"
				+ "	left join (select * from ncdis.[dbo].[LastdateValue] where iddata='"+iddata+"') lv on p.idpatient = lv.idpatient"
				+ "	left join ncdis.dbo.LastdateValue ldv on p.idpatient = ldv.idpatient"
				+ "  where p.active =1 and (p.dod is null or p.dod='1900-01-01') and ldv.iddata=1";

		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

		@SuppressWarnings("unchecked")
		ResultSetMetaData rsm = jdbcTemplate.query(sql,new ResultSetExtractor<ResultSetMetaData>() {
	        @Override
	        public ResultSetMetaData extractData(ResultSet rs) throws SQLException, DataAccessException {
	            ResultSetMetaData rsmd = rs.getMetaData();
	            return rsmd;
	        }
	     });

	    //ResultSetMetaData rsmd = rsmdList.get(0);
	    int columns;
		try {
			columns = rsm.getColumnCount();
			ArrayList<ReportCriteria> rcList = new ArrayList<>();
		    for(JsonElement criteria : criterias ){
		        ReportCriteria cse = gson.fromJson( criteria , ReportCriteria.class);
		        rcList.add(cse);
		    }
		   

			for(Map row : rows) {
		    	Hashtable<String, String> r = new Hashtable<>();
		    	for(ReportCriteria rc : rcList){
		    		for(int i=1;i<=columns;i++){
		    
		    			if(rc.getName().equals(rsm.getColumnName(i))){
		    				String colVal = row.get(rsm.getColumnName(i)).toString(); 
		    				if(colVal == null) colVal = "";
		    				r.put(rc.getName(), colVal);
		    				if(rc.getDate().equals("yes")){
		    					String colValDate = row.get(rsm.getColumnName(i)+"Date").toString();
		    					if(colValDate == null) colValDate = "";
		    					r.put(rc.getName()+"_collecteddate", colValDate);
		    				}
		    				break;
		    			}
		    		}
		    	}
		    	result.add(r);
			}
		
		} catch (SQLException e) {
			e.printStackTrace();
		}
    return result;
}
	

	
public ArrayList<Object> executeReportLocalList(){
	ArrayList<Object> result = new ArrayList<>();
	ArrayList<Object> resultBuffer = new ArrayList<>();
	Gson gson = new Gson();
		
		String sql = "select tt1.idpatient"
				+ ",ISNULL(p.fname,'')+' '+ ISNULL(p.lname,'') as fullname "
				+ ",p.ramq as ramq "
				+ ",p.sex as sex "
				+ ",p.chart as chart"
				+ ",p.idcommunity "
				+ ",datediff(year, p.dob, getdate()) as age "
				+ ",tt3.value as dtype "
				+ ",tt3.datevalue as ddate "
				+ ",tt4.users as users "
				+ ",datediff(day, tt1.datevalue, getdate()) as dayslastlab"
				+ ",tt1.datevalue as last_hba1c_collecteddate "
				+ ",round(tt1.value,3) as last_hba1c "
				+ ",tt2.datevalue as secondlast_hba1c_collecteddate "
				+ ",round(tt2.value,3) as secondlast_hba1c "
				+ ",round(try_convert(float, tt1.value) - try_convert(float, tt2.value), 3) as delta"
					+ " from "  
					+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue <= getdate()) aa where aa.seqnum = 1) as tt1 "
					+ "left join "
						+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue <= getdate()) aa where aa.seqnum = 2) as tt2 "
							+ "on tt1.idpatient = tt2.idpatient "
						+ "left join "
						+ "ncdis.ncdis.patient p "
							+ "on  tt1.idpatient = p.idpatient "
						+ "left join "
						+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue <= getdate()) aa where aa.seqnum = 1) as tt3 "
							+ "on tt1.idpatient = tt3.idpatient "
						+ "left join "
						+ "(SELECT idpatient, case when isnumeric(chr) =1  or isnumeric(nut)=1 or isnumeric(nur)=1 or isnumeric(md)=1 then concat(chr,';',nur,';',nut,';',md) else '0' end as users FROM [ncdis].[ncdis].[patient_hcp] where isnumeric(chr) =1  or isnumeric(nut)=1 or isnumeric(nur)=1 or isnumeric(md)=1) as tt4 "
							+ "on tt1.idpatient = tt4.idpatient "
					+ " where "
						+ " tt2.value is not null "
						+ " and p.active=1 and (p.dod is null or p.dod='1900-01-01') "
						+ " and p.idcommunity != 10 "
				+ " order by delta desc ";

		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		@SuppressWarnings("unchecked")
		ResultSetMetaData rsm = jdbcTemplate.query(sql,new ResultSetExtractor<ResultSetMetaData>() {
	        @Override
	        public ResultSetMetaData extractData(ResultSet rs) throws SQLException, DataAccessException {
	            ResultSetMetaData rsmd = rs.getMetaData();
	            return rsmd;
	        }
	     });

	    
	    int index=0;
	    int deltaZTotal = 0;
	    int deltaPTotal = 0;
	    int deltaNTotal = 0;
	    int columns;
		try {
			columns = rsm.getColumnCount();
			for(Map row : rows) {
		    	Hashtable<String, String> r = new Hashtable<>();
		    	for(int i=1;i<=columns;i++){
		    		String colVal = (row.get(rsm.getColumnName(i))==null?"":row.get(rsm.getColumnName(i)).toString()); 
		    		if(colVal == null) colVal = "";
						r.put(rsm.getColumnName(i), colVal);
		    	}
		    	String v = r.get("delta");
		    	if(!v.isEmpty()){
		    		float d = Float.parseFloat(r.get("delta"));
			    	if(d > 0 ){
			    		deltaPTotal++;
			    		r.put("indexDelta",Integer.toString(deltaPTotal));
			    	}
			    	if(d == 0 ){
			    		deltaZTotal++;
			    		r.put("indexDelta",Integer.toString(deltaZTotal));
			    	}
			    	if(d < 0 ){
			    		deltaNTotal++;
			    		r.put("indexDelta",Integer.toString(deltaNTotal));
			    	}
		    	}
		    	if(r.get("dtype").equals("10")){r.put("dtype", "3");}
		    	if(r.get("dtype").equals("11")){r.put("dtype", "4");}
		    	resultBuffer.add(r);
			}
		    for(int i=0;i<resultBuffer.size();i++){
		    	Hashtable<String, String> r = (Hashtable<String, String>)resultBuffer.get(i);
		    	String ss = r.get("delta");
		    	if(!ss.isEmpty()){
			    	float d =  Float.parseFloat(r.get("delta"));
			    	if(d > 0 ){
			    		r.put("totalDelta",Integer.toString(deltaPTotal));
			    	}
			    	if(d == 0 ){
			    		r.put("totalDelta",Integer.toString(deltaZTotal));
			    	}
			    	if(d < 0 ){
			    		r.put("totalDelta",Integer.toString(deltaNTotal));
			    	}
		    	}
		    	result.add(r);
		    }
		
		} catch (SQLException e) {
			e.printStackTrace();
		}
	return result;
}

	
public ArrayList<String> getIdPatients(){
	ArrayList<String> result = new ArrayList<>();
	String sql = "select distinct nn.idpatient from ncdis.ncdis.patient nn where (dod is null or dod = '1900-01-01')";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		result.add(row.get("idpatient").toString());
	}
	return result;
}



public ArrayList<String> getIdFilterPatients(String hcp, String hcpid){
	ArrayList<String> result = new ArrayList<>();
	String sql = "select distinct nn.idpatient from ncdis.ncdis.patient nn left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient where (nn.dod is null or nn.dod = '1900-01-01') and ph."+hcp+"='"+hcpid+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		result.add(row.get("idpatient").toString());
	}
	return result;
}
	
	
public ArrayList<Note> getPatientNotes(int idpatient){
	ArrayList<Note> result = new ArrayList<>();
	String sql = "select * from ncdis.ncdis.notes nn where idpatient = '"+idpatient+"' and active = '1' order by datenote desc";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		Note note = new Note(row.get("idnote").toString(), (row.get("note") == null?"":row.get("note").toString()), (row.get("datenote") == null?"":row.get("datenote").toString()),(row.get("iduser") == null?"":row.get("iduser").toString()),(row.get("idpatient") == null?"":row.get("idpatient").toString()),(row.get("active") == null?"":row.get("active").toString()), (row.get("iduserto") == null?"":row.get("iduserto").toString()), (row.get("viewed") == null?"":row.get("viewed").toString()));
    	result.add(note);
	}
	return result;
}
	
public boolean setPatientNotes(Note note){
	boolean result = false;
	String sql = "insert into ncdis.ncdis.notes (note,datenote,iduser,idpatient,active,iduserto, viewed) values (?,getdate(),'"+note.getIduser()+"','"+note.getIdpatient()+"','1', '"+note.getIduserto()+"','"+note.getViewed()+"')";
	jdbcTemplate.update(sql);
    result = true;
	return result;
}
	
	
public String exportRamq(){
	String result = "";
	Date today = new Date();
    //formatting date in Java using SimpleDateFormat
    SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd-MM-yyyy");
    String dateStr = DATE_FORMAT.format(today);
	File exportFile = new File(filesFolder+System.getProperty("file.separator")+"export_"+dateStr+".csv");
	FileWriter fw;
	try {
		fw = new FileWriter(exportFile);
		String sql = "select distinct ramq from ncdis.ncdis.patient";
    	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
    	for(Map row : rows) {
	    	try {
				fw.write(row.get("ramq").toString().toUpperCase()+"\r\n");
			} catch (IOException e) {
				e.printStackTrace();
			}    	
	    }
	    result = exportFile.getAbsolutePath();
	} catch (IOException e1) {
		e1.printStackTrace();
	}
	return result;
}

public  Hashtable<String, ArrayList<Object>> getHbA1cTrendItem(int period, String idcommunity, String sex, String dtype, String age, String hba1c) {
		Hashtable<String, ArrayList<Object>> result = new Hashtable();
		
		String cStr = " and a.idcommunity > 0 ";
		if(!idcommunity.equals("0"))cStr = " and a.idcommunity="+idcommunity+" "; 
		String gStr = " and a.sex > 0 ";
		if(!sex.equals("0"))gStr = " and a.sex="+sex+" ";
		String dtStr =" and (a.dtype=1 or a.dtype=2) ";
		if(!dtype.equals("1_2")){
			dtype = dtype.replaceAll("_", "");
			String[] parts = dtype.split("(?!^)");
			dtStr = " and (";
			for(int x=0;x<parts.length;x++){
				String s = " a.dtype="+parts[x];
				if(parts[x].equals("3")){s = " a.dtype=3 or a.dtype=10 ";}
				if(parts[x].equals("4")){s = " a.dtype=4 or a.dtype=11 ";}
				
				if(x == 0){
					dtStr +=  s;
				}else{
					dtStr +=  " or "+s;
				}
			}
			dtStr += " ) ";
		}
		String aStr = " and a.age > 0 ";
		if(!age.equals("0")){
			String[] parts = age.split("_");
			aStr = " and a.age >="+parts[0]+" and a.age <="+parts[1]+" ";
		}
		
		String vStr = " and try_convert(float,a.value1) > 0.0 ";
		if(hba1c.equals("0")){
			vStr = vStr;
		}else  if(hba1c.equals("1")){
			vStr = " and try_convert(float,a.value1) >= 0.075 ";
		}else{
			String[] parts = hba1c.split("_");
			vStr = " and try_convert(float,a.value1) >="+parts[0]+" and try_convert(float,a.value1) <="+parts[1]+" ";
		}
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		
		Date now = new Date();
		
		//we have to shift 3 years back because of data
		
		Calendar calStart = Calendar.getInstance();
		Calendar calEnd = Calendar.getInstance();
		calStart.setTime(now);
		//calStart.add(Calendar.YEAR, -3);
		calEnd.setTime(now);
		//calEnd.add(Calendar.YEAR, -3);
		
		calStart.add(Calendar.MONTH, (period)*-1 ); // we go back period number and 1 month more because we exclude current month
		calStart.set(Calendar.DAY_OF_MONTH, 1);
		calEnd.add(Calendar.MONTH, -1);
		calEnd.set(Calendar.DAY_OF_MONTH, calEnd.getActualMaximum(Calendar.DAY_OF_MONTH));

	    
	    ArrayList<Integer> improved = new ArrayList<>();
		ArrayList<Integer> setback = new ArrayList<>();
		ArrayList<Integer> constant = new ArrayList<>();
		ArrayList<Object> series = new ArrayList<>();
		ArrayList<Object> ticks = new ArrayList<>();
					
		ArrayList<Object> labels = new ArrayList<>();
		Hashtable<String, String> label1 = new Hashtable<>();
		label1.put("label", "Increased");
		labels.add(label1);
		Hashtable<String, String> label2 = new Hashtable<>();
		label2.put("label", "No Change");
		labels.add(label2);
		Hashtable<String, String> label3 = new Hashtable<>();
		label3.put("label", "Improved");
		labels.add(label3);
		result.put("labels", labels);
					
		for(int i=0;i<period;i++){
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, calStart.get(Calendar.YEAR));
			c.set(Calendar.MONTH, calStart.get(Calendar.MONTH));
			c.set(Calendar.DAY_OF_MONTH, calStart.get(Calendar.DAY_OF_MONTH));
			c.add(Calendar.MONTH, i);
			String d1 = sdf.format(c.getTime());
			c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
			String d2 = sdf.format(c.getTime());
			
				String sql = "SELECT "
						+ " sum(case when a.deltavalue > 0 "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+vStr+" then 1 else 0 end) as pTotal "
						+ ",sum(case when a.deltavalue < 0 "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+vStr+" then 1 else 0 end) as nTotal "
						+ ",sum(case when a.deltavalue = 0 "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+vStr+" then 1 else 0 end) as cTotal "
						+ " from "
							+ "(select tt1.idpatient, tt1.value as value1, tt2.value as value2 , tt1.datevalue as date1, tt2.datevalue as date2 "
							+ " ,datediff(year, p.dob, getdate()) as age  "
							+ " ,round(try_convert(float, tt1.value) - try_convert(float, tt2.value), 3) as deltavalue , p.idcommunity ,p.sex,tt3.value as dtype ,tt3.datevalue as ddate "
								+ " from "  
								+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue between '"+d1+"' and '"+d2+"') aa where aa.seqnum = 1) as tt1 "
//										+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue between '"+d1+"' and '"+d2+"') aa where aa.seqnum = 1) as tt1 "
								+ "left join "
									+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue <= '"+d2+"' ) aa where aa.seqnum = 2) as tt2 "
										+ "on tt1.idpatient = tt2.idpatient "
									+ "left join "
									+ "ncdis.ncdis.patient p "
										+ "on  tt1.idpatient = p.idpatient and p.active=1 and (p.dod is null or p.dod='1900-01-01') "
									+ "left join "
									+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue <= '"+d2+"') aa where aa.seqnum = 1) as tt3 "
										+ "on tt1.idpatient = tt3.idpatient "
								+ " where "
									+ " tt2.value is not null "
									+ " and p.idcommunity != 10 "
							+ " ) as a ";

							
					//System.out.println(sql);
				List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		    	for(Map row : rows) {
			    	improved.add((Integer)row.get("nTotal"));
			    	setback.add((Integer)row.get("pTotal"));
			    	constant.add((Integer)row.get("cTotal"));
			    	
			    	ArrayList<Object> tick = new ArrayList<Object>();
			    	tick.add(i+1);
			    	tick.add(sdf.format(c.getTime()));
			    	ticks.add(tick);
			    }
			}
					
					
		    series.add(setback);
		    series.add(constant);
		    series.add(improved);
			    
			result.put("series", series);
			result.put("ticks", ticks);
					
		return result;
	}
	
	
	

public  Hashtable<String, ArrayList<Object>> getHbA1cPeriodItem(int period, String idcommunity, String sex, String dtype, String age, String hba1c) {
		Hashtable<String, ArrayList<Object>> result = new Hashtable();
		Context initContext;
		DataSource ds;
		ResultSet rs = null;
		Statement cs=null;
		Connection conn = null;
		
		String cStr = " a.idcommunity > 0 ";
		if(!idcommunity.equals("0"))cStr = " a.idcommunity="+idcommunity+" "; 
		String gStr = " and a.sex > 0 ";
		if(!sex.equals("0"))gStr = " and a.sex="+sex+" ";
		String dtStr =" and (a.dtype=1 or a.dtype=2) ";
		if(!dtype.equals("1_2")){
			dtype = dtype.replaceAll("_", "");
			String[] parts = dtype.split("(?!^)");
			dtStr = " and (";
			for(int x=0;x<parts.length;x++){
				String s = " a.dtype="+parts[x];
				if(parts[x].equals("3")){s = " a.dtype=3 or a.dtype=10 ";}
				if(parts[x].equals("4")){s = " a.dtype=4 or a.dtype=11 ";}
				
				if(x == 0){
					dtStr +=  s;
				}else{
					dtStr +=  " or "+s;
				}
			}
			dtStr += " ) ";
		}
		String aStr = " and a.age > 0 ";
		if(!age.equals("0")){
			String[] parts = age.split("_");
			aStr = " and a.age >="+parts[0]+" and a.age <="+parts[1]+" ";
		}
		
		String vStr = " and try_convert(float,a.value1) > 0.0 ";
		if(hba1c.equals("0")){
			vStr = vStr;
		}else  if(hba1c.equals("1")){
			vStr = " and try_convert(float,a.value1) >= 0.075 ";
		}else{
			String[] parts = hba1c.split("_");
			vStr = " and try_convert(float,a.value1) >="+parts[0]+" and try_convert(float,a.value1) <="+parts[1]+" ";
		}
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		
		Date now = new Date();
		
		//we have to shift 3 years back because of data
		
		Calendar calStart = Calendar.getInstance();
		Calendar calEnd = Calendar.getInstance();
		calStart.setTime(now);
		//calStart.add(Calendar.YEAR, -3);
		calEnd.setTime(now);
		//calEnd.add(Calendar.YEAR, -3);
		
		calStart.add(Calendar.MONTH, (period)*-1 ); // we go back period number and 1 month more because we exclude current month
		calStart.set(Calendar.DAY_OF_MONTH, 1);
		calEnd.add(Calendar.MONTH, -1);
		calEnd.set(Calendar.DAY_OF_MONTH, calEnd.getActualMaximum(Calendar.DAY_OF_MONTH));
		
		    ArrayList<Integer> number = new ArrayList<>();
			ArrayList<Integer> total = new ArrayList<>();

			ArrayList<Object> series = new ArrayList<>();
			ArrayList<Object> ticks = new ArrayList<>();
			
			ArrayList<Object> labels = new ArrayList<>();
			Hashtable<String, String> label1 = new Hashtable<>();
			label1.put("label", "Number");
			labels.add(label1);
			Hashtable<String, String> label2 = new Hashtable<>();
			label2.put("label", "Percentage");
			labels.add(label2);
			result.put("labels", labels);
			
			for(int i=0;i<period;i++){
				Calendar c = Calendar.getInstance();
				c.set(Calendar.YEAR, calStart.get(Calendar.YEAR));
				c.set(Calendar.MONTH, calStart.get(Calendar.MONTH));
				c.set(Calendar.DAY_OF_MONTH, calStart.get(Calendar.DAY_OF_MONTH));
				c.add(Calendar.MONTH, i);
				c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
				String d1 = sdf.format(c.getTime());
				//last 12 month
				String dtick = sdf.format(c.getTime());
				c.add(Calendar.MONTH, -12);
				String d2 = sdf.format(c.getTime());
				String dateStr = "and a.date1 >= '"+d2+"'"; 
				String sql = "SELECT "
						+ " sum(case when "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+vStr+" "+dateStr+" then 1 else 0 end) as pNumber "
						+ ",sum(case when "+cStr+" then 1 else 0 end) as pTotal "
						+ " from "
							+ "(select tt1.idpatient, tt1.value as value1, tt1.datevalue as date1 "
							+ " ,datediff(year, p.dob, getdate()) as age  "
							+ " ,p.idcommunity ,p.sex,tt3.value as dtype ,tt3.datevalue as ddate "
								+ " from "  
								+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue <= '"+d1+"') aa where aa.seqnum = 1) as tt1 "
								+ "left join "
									+ "ncdis.ncdis.patient p "
								+ "on  tt1.idpatient = p.idpatient and p.active=1 and (p.dod is null or p.dod='1900-01-01') "
								+ "left join "
									+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue <= '"+d1+"') aa where aa.seqnum = 1) as tt3 "
										+ "on tt1.idpatient = tt3.idpatient "
								+ " where "
									+ " tt1.value is not null "
									+ " and p.idcommunity != 10 "
							+ " ) as a ";

					//System.out.println(sql);

				List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		    	for(Map row : rows) {
			    	number.add((Integer)row.get("pNumber"));
			    	total.add((Integer)row.get("pTotal"));
			    	
			    	ArrayList<Object> tick = new ArrayList<Object>();
			    	tick.add(i+1);
			    	tick.add(dtick);
			    	ticks.add(tick);
			    }

			}
			series.add(number);
		    series.add(total);
			result.put("series", series);
			result.put("ticks", ticks);
	return result;
}
	
	


public  Hashtable<String, ArrayList<Object>> getHbA1cValueItem(int period, String idcommunity, String sex, String dtype, String age, String hba1c) {
		Hashtable<String, ArrayList<Object>> result = new Hashtable();
		String cStr = " a.idcommunity > 0 ";
		if(!idcommunity.equals("0"))cStr = " a.idcommunity="+idcommunity+" "; 
		String gStr = " and a.sex > 0 ";
		if(!sex.equals("0"))gStr = " and a.sex="+sex+" ";
		String dtStr =" and (a.dtype=1 or a.dtype=2) ";
		if(!dtype.equals("1_2")){
			dtype = dtype.replaceAll("_", "");
			String[] parts = dtype.split("(?!^)");
			dtStr = " and (";
			for(int x=0;x<parts.length;x++){
				String s = " a.dtype="+parts[x];
				if(parts[x].equals("3")){s = " a.dtype=3 or a.dtype=10 ";}
				if(parts[x].equals("4")){s = " a.dtype=4 or a.dtype=11 ";}
				
				if(x == 0){
					dtStr +=  s;
				}else{
					dtStr +=  " or "+s;
				}
			}
			dtStr += " ) ";
		}
		String aStr = " and a.age > 0 ";
		if(!age.equals("0")){
			String[] parts = age.split("_");
			aStr = " and a.age >="+parts[0]+" and a.age <="+parts[1]+" ";
		}
		
		String vStr = " and try_convert(float,a.value1) > 0.0 ";
		if(hba1c.equals("0")){
			vStr = vStr;
		}else  if(hba1c.equals("1")){
			vStr = " and try_convert(float,a.value1) >= 0.075 ";
		}else{
			String[] parts = hba1c.split("_");
			vStr = " and try_convert(float,a.value1) >="+parts[0]+" and try_convert(float,a.value1) <="+parts[1]+" ";
		}
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		
		Date now = new Date();
		
		//we have to shift 3 years back because of data
		
		Calendar calStart = Calendar.getInstance();
		Calendar calEnd = Calendar.getInstance();
		calStart.setTime(now);
		//calStart.add(Calendar.YEAR, -3);
		calEnd.setTime(now);
		//calEnd.add(Calendar.YEAR, -3);
		
		calStart.add(Calendar.MONTH, (period)*-1 ); // we go back period number and 1 month more because we exclude current month
		calStart.set(Calendar.DAY_OF_MONTH, 1);
		calEnd.add(Calendar.MONTH, -1);
		calEnd.set(Calendar.DAY_OF_MONTH, calEnd.getActualMaximum(Calendar.DAY_OF_MONTH));

		
				    
	    ArrayList<Integer> number = new ArrayList<>();
		ArrayList<Integer> total = new ArrayList<>();

		ArrayList<Object> series = new ArrayList<>();
		ArrayList<Object> ticks = new ArrayList<>();
		
		ArrayList<Object> labels = new ArrayList<>();
		Hashtable<String, String> label1 = new Hashtable<>();
		label1.put("label", "Number");
		labels.add(label1);
		Hashtable<String, String> label2 = new Hashtable<>();
		label2.put("label", "Percentage");
		labels.add(label2);
		result.put("labels", labels);
					
		for(int i=0;i<period;i++){
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, calStart.get(Calendar.YEAR));
			c.set(Calendar.MONTH, calStart.get(Calendar.MONTH));
			c.set(Calendar.DAY_OF_MONTH, calStart.get(Calendar.DAY_OF_MONTH));
			c.add(Calendar.MONTH, i);
			c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
			String d1 = sdf.format(c.getTime());
			 
			String sql = "SELECT "
					+ " sum(case when "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+vStr+" then 1 else 0 end) as pNumber "
					+ ",sum(case when "+cStr+" then 1 else 0 end) as pTotal "
					+ " from "
						+ "(select tt1.idpatient, tt1.value as value1, tt1.datevalue as date1 "
						+ " ,datediff(year, p.dob, getdate()) as age  "
						+ " ,p.idcommunity ,p.sex,tt3.value as dtype ,tt3.datevalue as ddate "
							+ " from "  
							+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue <= '"+d1+"') aa where aa.seqnum = 1) as tt1 "
							+ "left join "
								+ "ncdis.ncdis.patient p "
							+ "on  tt1.idpatient = p.idpatient and p.active=1 and (p.dod is null or p.dod='1900-01-01') "
							+ "left join "
								+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue <= '"+d1+"') aa where aa.seqnum = 1) as tt3 "
									+ "on tt1.idpatient = tt3.idpatient "
							+ " where "
								+ " tt1.value is not null "
								+ " and p.idcommunity != 10 "
						+ " ) as a ";

			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	    	for(Map row : rows) {
		    	number.add((Integer)row.get("pNumber"));
		    	total.add((Integer)row.get("pTotal"));
		    	ArrayList<Object> tick = new ArrayList<Object>();
		    	tick.add(i+1);
		    	tick.add(sdf.format(c.getTime()));
		    	ticks.add(tick);
		    }
		}
		series.add(number);
	    series.add(total);
		result.put("series", series);
		result.put("ticks", ticks);

		return result;
	}
	
}
