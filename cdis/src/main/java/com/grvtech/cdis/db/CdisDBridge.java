package com.grvtech.cdis.db;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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
import com.grvtech.cdis.model.Value;
import com.grvtech.cdis.model.ValueLimit;
import com.grvtech.cdis.model.Values;


@Service
public class CdisDBridge {
	
	Logger logger = LogManager.getLogger(CdisDBridge.class);
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@Autowired
	Renderer renderer;
	
	
	@org.springframework.beans.factory.annotation.Value("${filesfolder}")
	private String filesFolder;
	
	
	
	
	public HashMap<String,String> getAllCommunities(){
		HashMap<String,String> result = new HashMap();
		String sql = "select idcommunity,name_en from ncdis.community where community_code != 'NONC' order by name_en asc";
			
		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);
	    for(int i=0;i<rs.size();i++) {
	    	Map<String,Object> line = rs.get(i);
	    	result.put(line.get("idcommunity").toString(),line.get("name_en").toString());
	    }
	    logger.log(Level.INFO, "Get all comunities :"+result.size() );
		return result;
	}
	
	public ArrayList<String> getAllCommunitiesList(){
		ArrayList<String> result = new ArrayList();
		String sql = "select idcommunity,name_en from ncdis.community where community_code != 'NONC' order by name_en asc";
			
		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);
	    for(int i=0;i<rs.size();i++) {
	    	Map<String,Object> line = rs.get(i);
	    	result.add(line.get("name_en").toString());
	    }
	    logger.log(Level.INFO, "Get all comunities :"+result.size() );
		return result;
	}
	
	public HashMap<String,String> getDiabetesTypes(String config){
		HashMap<String,String> result = new HashMap();
		String limit = "4";
		if(config.equals("extended"))limit = "5"; 
		String sql = "select iddiabet, diabet_name from ncdis.cdis_diabet where iddiabet <= '"+limit+"' order by iddiabet asc";
			
		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);
	    for(int i=0;i<rs.size();i++) {
	    	Map<String,Object> line = rs.get(i);
	    	result.put(line.get("iddiabet").toString(),line.get("diabet_name").toString());
	    }
	    logger.log(Level.INFO, "Get diabet Types :"+result.size() );
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
        logger.log(Level.INFO, "Get HCPs hcp:"+hcp + "Search term :"+term );
		return result;
	}
	
	public ArrayList<HashMap<String, String>> getAllHcps(){
		ArrayList<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();
		String sql = "SELECT iduser,idprofesion, concat(UPPER(LEFT(fname,1))+LOWER(SUBSTRING(fname,2,LEN(fname))),' ',UPPER(LEFT(lname,1))+LOWER(SUBSTRING(lname,2,LEN(lname)))) as name  FROM ncdis.ncdis.users where active=1 ";
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
        for (Map row : rows) {
        	HashMap<String, String> line = new HashMap<>();
            line.put("iduser",row.get("iduser").toString());
            line.put("name",(row.get("name")==null?"":row.get("name").toString()));
            line.put("idprofesion",row.get("idprofesion").toString());
            result.add(line);
        }
        logger.log(Level.INFO, "Get All HCPs ");
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
		
		System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++");
		System.out.println(sql);
		System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++");
		
		if(rows.size() > 0 ) {
			Map<String, Object> row = rows.get(0);
			result = 	new Patient((Integer)row.get("idpatient"), row.get("ramq").toString(), row.get("chart").toString(), (row.get("band")==null?"":row.get("band").toString()),
	        		(row.get("giu")==null?"":row.get("giu").toString()), (row.get("jbnqa")==null?"":row.get("jbnqa").toString()), (row.get("fname")==null?"":row.get("fname").toString()), (row.get("lname")==null?"":row.get("lname").toString()), row.get("sex").toString(),
	        		(row.get("dob")==null?"":row.get("dob").toString()), (row.get("mfname")==null?"":row.get("mfname").toString()), (row.get("mlname")==null?"":row.get("mlname").toString()), (row.get("pfname")==null?"":row.get("pfname").toString()),
	        		(row.get("plname")==null?"":row.get("plname").toString()), (row.get("address")==null?"":row.get("address").toString()), (row.get("city")==null?"":row.get("city").toString()), (row.get("province")==null?"":row.get("province").toString()),
	        		(row.get("postalcode")==null?"":row.get("postalcode").toString()), row.get("consent")==null?0:(short)row.get("consent"), row.get("iscree")==null?-1:(short)row.get("iscree"), (row.get("dod")==null?"":row.get("dod").toString()),
	        		(row.get("dcause")==null?"":row.get("dcause").toString()), (row.get("entrydate")==null?"":row.get("entrydate").toString()), (row.get("idcommunity")==null?"":row.get("idcommunity").toString()), (row.get("community")==null?"":row.get("community").toString()), (row.get("idprovince")==null?"":row.get("idprovince").toString()),(row.get("phone")==null?"":row.get("phone").toString()),(row.get("active")==null?"0":row.get("active").toString()));
			
		}
		logger.log(Level.INFO, "Get Patient By RAMQ :"+result.getIdpatient()+ "RAMQ:"+result.getRamq() );
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
	        		(row.get("postalcode")==null?"":row.get("postalcode").toString()), row.get("consent")==null?0:Integer.parseInt(row.get("consent").toString()), row.get("iscree")==null?1:Integer.parseInt(row.get("iscree").toString()), (row.get("dod")==null?"":row.get("dod").toString()),
	        		(row.get("dcause")==null?"":row.get("dcause").toString()), (row.get("entrydate")==null?"":row.get("entrydate").toString()), (row.get("idcommunity")==null?"":row.get("idcommunity").toString()), (row.get("community")==null?"":row.get("community").toString()), (row.get("idprovince")==null?"":row.get("idprovince").toString()),(row.get("phone")==null?"":row.get("phone").toString()),(row.get("active")==null?"0":row.get("active").toString()));
			
		}
		logger.log(Level.INFO, "Get Patient By ID :"+result.getIdpatient()+ "RAMQ:"+result.getRamq() );
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
	    logger.log(Level.INFO, "Update Patient idpatient:"+pat.getIdpatient() );
		return result;
	}
	
	public MessageResponse addPatient(Patient pat){
		
		MessageResponse result = new MessageResponse("EDITP-DB",false,"en",new ArrayList<>());
		SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
		
		String query = "insert into ncdis.ncdis.patient (ramq,chart,band,giu,jbnqa,fname,lname,sex,dob,mfname,mlname,pfname,plname,address,postalcode,dod,death_cause,idcommunity,phone,iscree,entrydate,active) "
				+" values("
				+ "'"+pat.getRamq().toUpperCase()+"'"+","
				+ "'"+pat.getChart()+"'"+","
				+ "'"+pat.getBand().toUpperCase()+"'"+","
				+ "'"+pat.getGiu()+"'"+","
				+ "'"+pat.getJbnqa()+"'"+","
				+ "'"+pat.getFname()+"'"+","
				+ "'"+pat.getLname()+"'"+","
				+ "'"+pat.getSex()+"'"+","
				+ "'"+pat.getDob()+"'"+","
				+ "'"+pat.getMfname()+"'"+","
				+ "'"+pat.getMlname()+"'"+","
				+ "'"+pat.getPfname()+"'"+","
				+ "'"+pat.getPlname()+"'"+","
				+ "'"+pat.getAddress()+"'"+","
				+ "'"+pat.getPostalcode()+"'"+","
				+ "'"+pat.getDod()+"'"+","
				+ "'"+pat.getDcause()+"'"+","
				+ "'"+pat.getIdcommunity()+"'"+","
				+ "'"+pat.getPhone()+"'"+","
				+ "'"+pat.getIscree()+"'"+","
				+ "'"+sdf.format(new Date())+"'"+","
				+ "'1')";
		logger.log(Level.INFO, query);
	    int stat = jdbcTemplate.update(query);
	    logger.log(Level.INFO, "Add Patient ramq:"+pat.getRamq() );    
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
	 logger.log(Level.INFO, "Get HCP by IDpatient  idpatient:"+idpatient );
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
	logger.log(Level.INFO, "Get HCP by IDpatient  idpatient:"+idpatient );
	return result;
}
	



public int deleteHcpOfPatient(int idpatient){
	int result = 0;
	String sql="delete from ncdis.patient_hcp where idpatient = "+idpatient+";";
	result = jdbcTemplate.update(sql);
	logger.log(Level.INFO, "Delete HCP of IDpatient  idpatient:"+idpatient );
	return result;
}


	
public boolean setHcpOfPatient(int idpatient,  String casem, String md, String nut, String nur, String chr){
	boolean result = false;
	deleteHcpOfPatient(idpatient);
	String sql = "insert into ncdis.patient_hcp (idpatient, casem, md, nut, nur,chr, idsystem) values ("+idpatient+",0,'"+md+"','"+nut+"','"+nur+"','"+chr+"',1)";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Set HCP by IDpatient  idpatient:"+idpatient+ " HCPS casem:"+casem+"  MD:"+md+"  nut:"+nut+"  nur:"+nur+" chr:"+chr );
	return result;
}


public boolean setOneHcpOfPatient(String idpatient,  String iduser, String hcpcode){
	boolean result = false;
	String sql= "update ncdis.ncdis.patient_hcp set "+hcpcode+"="+iduser+" where idpatient="+idpatient;
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Set ONE HCP by IDpatient  idpatient:"+idpatient+ " iduser:"+iduser+"  code:"+hcpcode );
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
	sections.put("Miscellaneous", "MISC");
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
        Value val = new Value(row.get("idvalue")==null?0:Integer.parseInt(row.get("idvalue").toString()), (row.get("name")==null?"":row.get("name").toString()) , (row.get("value")==null?"":row.get("value").toString()), (row.get("type")==null?"":row.get("type").toString()), dStr, (row.get("unit")==null?"":row.get("unit").toString()), (row.get("code")==null?"":row.get("code").toString()), row.get("dorder")==null?0:(int)row.get("dorder"));
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
    logger.log(Level.INFO, "Get Values  idpatient:"+idpatient+ " section:"+section);   
	return result;
}


public Object getAllValues(String section, String sectionCODE, int idpatient, String sort){
	Object result = null;
	
	
	try {
		
		String sql = "select avv.idvalue , dv.data_name as name, dv.data_unit as unit, avv.datevalue as date, avv.value as value , dv.data_type as type, lower(dv.data_code) as code, dv.data_order as dorder"
				+ " from"
				+ " (select dd.iddata, dd.data_name, dd.data_unit , dd.data_code,dd.data_type, dd.data_order"
				+ " from ncdis.ncdis.cdis_data dd left join ncdis.ncdis.cdis_section css on dd.idsection = css.idsection "
				+ " where css.section_code = '"+sectionCODE+"') as dv"
				+ " "
			+ " left join (select vv.idvalue, vv.datevalue, vv.value, vv.iddata"
			+ " from ncdis.ncdis.cdis_value vv where vv.idpatient = '"+idpatient+"'  and vv.iddata in (select dd.iddata"
									+ " from ncdis.ncdis.cdis_data dd left join ncdis.ncdis.cdis_section css on dd.idsection = css.idsection"
									+ " where css.section_code = '"+sectionCODE+"' )"
			+ " ) avv on dv.iddata = avv.iddata order by avv.datevalue desc";
		
		//System.out.println("++++++++++++++++++++++++++++++++++++++++");
		//System.out.println("sql :"+sql);
		//System.out.println("++++++++++++++++++++++++++++++++++++++++");
		
		List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql);
	    //rs = cs.executeQuery();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    DateTimeFormatter sdf1 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    HashMap<String, Values> params = new HashMap<String, Values>();
	    ArrayList<String> columns = new ArrayList<>();
	    
	    for(Map row : rows) {
	    	Values av = new Values();
	    	String c = row.get("code").toString();
	    	if(columns.contains(c)){
	    		av = params.get(c);
	    	}else{
	    		columns.add(c);
	    	}
	    	
	    	String dStr = "NULL";
	    	if(row.get("date") != null){
	    		
	    		//System.out.println("++++++++++++++++++++++++++++++++++++++++");
				//System.out.println("date :"+row.get("date").toString());
				//System.out.println("++++++++++++++++++++++++++++++++++++++++");
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");
	    		LocalDateTime ldt =  LocalDateTime.parse(row.get("date").toString(), formatter);
	    		
	    		//dStr = sdf.format(Date.parse(row.get("date").toString()));
	    		dStr = sdf1.format(ldt);
	    		
	    		
	    		
	    		//System.out.println("++++++++++++++++++++++++++++++++++++++++");
		    	//System.out.println("params  :"+row.get("idvalue") +" "+ row.get("name") +" "+ row.get("value")+" "+ row.get("type")+" "+ dStr+" "+ row.get("unit")+" "+ row.get("code")+" "+ row.get("dorder"));
				//System.out.println("params  :"+Integer.parseInt(row.get("idvalue").toString()) +" "+ row.get("name").toString() +" "+ row.get("value").toString()+" "+ row.get("type").toString()+" "+ dStr+" "+ row.get("unit").toString()+" "+ row.get("code").toString()+" "+ Integer.parseInt(row.get("dorder").toString()));
				//System.out.println("++++++++++++++++++++++++++++++++++++++++");
		    	
		        Value val = new Value(Integer.parseInt(row.get("idvalue").toString()) , row.get("name").toString(), row.get("value").toString(), row.get("type").toString(), dStr, row.get("unit").toString(), row.get("code").toString(), Integer.parseInt(row.get("dorder").toString()));
		        av.addValue(val);
		        params.put(c,av);
	    		
	    		
	    	}
	    	
	    	
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
	    
	}catch (Exception e) {
		e.printStackTrace();
	} 
	
	logger.log(Level.INFO, "Get ALL Values  idpatient:"+idpatient+ " section:"+section);
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
	logger.log(Level.INFO, "Get Values limit  for value:"+valuename);
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
	logger.log(Level.INFO, "Get ABC data");
	return result;
}

public boolean addValue(String valueName, String valueValue, String valueDate, String idpatient){
	boolean result = false;
	String sql = "insert into ncdis.ncdis.cdis_value (idpatient, datevalue, value, iddata, entrydate) values ("+idpatient+", '"+valueDate+"', '"+valueValue+"', (select iddata from ncdis.ncdis.cdis_data where data_code = '"+valueName+"'), getDate())";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Add value for idpatient:"+idpatient+"  value:"+valueName+"   value:"+valueValue +"  valuedate:"+valueDate);
	return result;	
}
	
public boolean deleteValue(String idvalue){
	boolean result = false;
	String sql = "delete from ncdis.ncdis.cdis_value where idvalue = '"+idvalue+"'";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Delete Value idvalue:"+idvalue);
	return result;	
}
	
	
public boolean editValue(String valueName, String valueValue, String valueDate, String idpatient, String idvalue){
	boolean result = false;
	String sql = "update ncdis.ncdis.cdis_value set datevalue = '"+valueDate+"', value = '"+valueValue+"' where idpatient = '"+idpatient+"' and iddata = (select iddata from ncdis.ncdis.cdis_data where data_code = '"+valueName+"') and idvalue = '"+idvalue+"';";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Edit Value idvalue:"+idvalue+ " for idpatient:"+idpatient );
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
	logger.log(Level.INFO, "Edit Patient idpatient:"+patient.getIdpatient());
	return result;	
}
	
	
public boolean deletePatient(String idpatient){
	boolean result = false;
	String sql = "update ncdis.ncdis.patient  set active=0 where idpatient = '"+idpatient+"'";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Delete Patient idpatient:"+idpatient);
	return result;	
}


public boolean deleteDeletePatient(int idpatient){
	boolean result = false;
	String sql = "delete from ncdis.ncdis.patient where idpatient = '"+idpatient+"'";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Delete for Real Patient idpatient:"+idpatient);
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
	logger.log(Level.INFO, "Get Reports ");
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
	logger.log(Level.INFO, "Get  User Reports iduser:"+iduser);
	return result;
}



	
public String saveReport(JsonObject reportObject){
	String result = "";
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	result = sdf.format(new Date());
	String sql = "insert into ncdis.ncdis.reports (report_name, report_code, iduser, created) values ('"+reportObject.get("title").getAsString()+"','PERSONAL"+sdf.format(new Date())+"','"+reportObject.get("iduser").getAsString()+"','"+reportObject.get("generated").getAsString()+"')";
	jdbcTemplate.update(sql);
	logger.log(Level.INFO, "Save Report report: "+reportObject.get("title").getAsString());
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
	

public ArrayList<HashMap<String,String>> executeReportCriteria(HashMap<String, Object> item){
	ArrayList<HashMap<String,String>> result = new ArrayList<>();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	boolean isDoubleData = false;
	
	String valValue = "";
	String nomValue = "";
	String opValue = "";
	String valValueDate = "";
	String nomValueDate = "";
	String opValueDate = "";
	ReportCriteria criteria = null;
	ReportCriteria criteriaDate = null;
	Set<String> keys = item.keySet();
			
	if(item.get("flag").equals("1")) {
		//avem variabile cu date
		isDoubleData = true;
		for(String key : keys ) {
			if(key.indexOf("CollectedDate") >= 0)criteriaDate = (ReportCriteria)item.get(key); 
			if(key.indexOf("CollectedDate") < 0 && key.indexOf("flag") <0)criteria = (ReportCriteria)item.get(key);
		}
		valValue = criteria.getValue();
		nomValue = criteria.getName();
		opValue = renderer.renderOperator(criteria.getOperator());
		valValueDate = criteriaDate.getValue();
		nomValueDate = criteriaDate.getName();
		opValueDate = renderer.renderOperator(criteriaDate.getOperator());
	}else {
		for(String key : keys ) {
			if(key.indexOf("CollectedDate") < 0 && key.indexOf("flag") <0)criteria = (ReportCriteria)item.get(key);
		}
		valValue = criteria.getValue();
		nomValue = criteria.getName();
		opValue = renderer.renderOperator(criteria.getOperator());
	}
	
	//String op = renderer.renderOperator(criteria.getOperator());
			
	if(criteria.getSection().equals("1")){
			String criteriaStr = " and nn."+nomValue+" "+opValue+" '"+valValue+"' ";
			if(opValue.equals("between")){
				String[] parts = valValue.split("\\s*\\|+\\s*");
				String part1 = parts[0].trim();
				String part2 = parts[1].trim();
				String between1 = "'"+part1+"'";
				String between2 = "'"+part2+"'";
				if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
				if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
				criteriaStr = " and nn."+nomValue+" "+opValue+" "+between1+" and "+ between2;
			}
				
			if(valValue.equals("0")){criteriaStr = "";}
			String vn = "nn."+nomValue;
			String sql = "select nn.idpatient, "+vn+"  from ncdis.ncdis.patient nn  "
					+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
					+ " "+ criteriaStr+ " "
					+ "order by nn.idpatient asc";
			//System.out.println("=========================================");
			//System.out.println("SQL : "+sql);
			//System.out.println("=========================================");
			
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			
		    int index=0;
			for(Map row : rows) {
		    	HashMap<String,String> line = new HashMap();
		    	if(row.get(nomValue) == null || row.get(nomValue).toString().equals("null")) {
		    		line.put("id",Integer.toString(index));
		    		line.put("idpatient",row.get("idpatient").toString());
		    	}else{
		    		line.put("id",Integer.toString(index));
		    		line.put("idpatient",row.get("idpatient").toString());
		    		if(criteria.getName().equals("sex") || criteria.getName().equals("idcommunity") || criteria.getName().equals("dtype")){
		    			line.put(criteria.getName(), renderer.renderName(nomValue+"."+row.get(nomValue).toString()));
					}else{
						line.put(nomValue,row.get(nomValue).toString());
					}
		    	}
		    	result.add(line);
		    	index++;
			}
			
	}else{
			String sql = "";
			if(opValue.equals("between")){
				String[] parts = valValue.split("\\s*\\|+\\s*");
				String part1 = parts[0].trim();
				String part2 = parts[1].trim();
				String between1 = "'"+part1+"'";
				String between2 = "'"+part2+"'";
				if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
				if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
				valValue = between1+" and "+ between2;
			}else {
				valValue = "'"+valValue+"'";
			}
			
			if(opValueDate.equals("between")){
				String[] parts = valValueDate.split("\\s*\\|+\\s*");
				String part1 = parts[0].trim();
				String part2 = parts[1].trim();
				String between1 = "'"+part1+"'";
				String between2 = "'"+part2+"'";
				if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
				if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
				valValueDate = between1+" and "+ between2;
			}else {
				valValueDate = "'"+valValueDate+"'";
			}
			
			
			String criteriaStr = " and cast(value as float) "+opValue+" "+valValue+" ";
			
			if(isDoubleData) {
				criteriaStr += " and cast(datevalue as datetime) "+opValueDate+" "+valValueDate+" ";
				
			}
			
			System.out.println("=========================================");
			System.out.println("Value Name : "+nomValue);
			System.out.println("Value Value: "+valValue);
			System.out.println("Value Name Date: "+nomValueDate);
			System.out.println("Value Value Date: "+valValueDate);
			System.out.println("=========================================");
				
			if(criteria.getValue().equals("0")){
				criteriaStr = "";
				
			}	
			
			/*
			sql = "select aa.idpatient,replace(convert(varchar,aa.datevalue,102),'.','-') as datevalue, aa.value "
						+ " from ncdis.dbo.LastdateValue aa "
						+ "where isnumeric(aa.value)=1  "
						+ "and aa.iddata='"+criteria.getIddata()+"' "
						+ " "+ criteriaStrSub+ " "
						+ "order by aa.idpatient asc";
				
			sql = "select aa.idpatient,replace(convert(varchar,aa.datevalue,102),'.','-') as datevalue, aa.value "
					+ " from ncdis.ncdis.cdis_value aa "
					+ "where isnumeric(aa.value)=1  "
					+ "and aa.iddata='"+criteria.getIddata()+"' "
					+ " "+ criteriaStr+ " "
					+ " group by idpatient, datevalue,value"
					+ " having datevalue = max(datevalue)";
			*/
			sql = "select aa.idpatient,aa.datevalue,aa.value from "
					+ " (select  idpatient, max(datevalue) as datevalue from ncdis.ncdis.cdis_value " 
					+ " 	where isnumeric(value)=1 and iddata='"+criteria.getIddata()+"' "+ criteriaStr+ " group by idpatient) as bb "
					+ "   	left join (select * from ncdis.ncdis.cdis_value where iddata='"+criteria.getIddata()+"' " 
					+ "  "+ criteriaStr+ " ) as aa on bb.idpatient = aa.idpatient and bb.datevalue=aa.datevalue ";
			
			
			
			
			//System.out.println("=========================================");
			//System.out.println("SQL : "+sql);
			//System.out.println("=========================================");
			/**/
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		    int index=0;
			for(Map row : rows) {
				HashMap<String,String> line = new HashMap<>();
		    	line.put("id",Integer.toString(index));
	    		line.put("idpatient",row.get("idpatient").toString());
	    		if(isDoubleData) {
					line.put("datevalue",row.get("datevalue").toString());
				}
				line.put("value",row.get("value").toString());
			
	    		result.add(line);
	    		index++;
			}
	}
	
	logger.log(Level.INFO, "Execute Report ");
	return result;
}


public ArrayList<HashMap<String,String>> executeReportCriteriaGraphTotals(String filter, HashMap<String,String> header, ReportCriteria criteria ){
	
	ArrayList<HashMap<String,String>> result = new ArrayList<>();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	
	String hcpfilter = " ";
	String hcpfilterCriteria = " ";
	if(!filter.equals("allhcp")) {
		hcpfilter = " left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient ";
		hcpfilterCriteria = " and (ph.md='"+filter+"' or ph.nut='"+filter+"'or ph.nur='"+filter+"' or ph.chr='"+filter+"') ";
	}
	
	Set<String> keysHeader = header.keySet();
	for(String keyHeader : keysHeader) {
		if(criteria.getName().equals("idcommunity")) {
			if(criteria.getValue().equals("0")) {
					String criteriaStr = " and nn.idcommunity='"+keyHeader+"' ";
					String sql = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+ criteriaStr
							+ hcpfilterCriteria
							+ " ";
					System.out.println("=========================================");
					System.out.println("SQL : "+sql);
					System.out.println("=========================================");
					
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
					HashMap<String,String> m = new HashMap();
					m.put(keyHeader,Integer.toString(rows.size()));
					result.add(m);
				}else if(criteria.getValue().indexOf("_") >= 0){
					//dates 2 sets
					String[] parts = criteria.getValue().split("_");
					String keia1 = parts[0];
					String keia2 = parts[1];
					String keia1Criteria = " and nn.idcommunity = '"+keia1+"' ";
					String keia2Criteria = " and nn.idcommunity = '"+keia2+"' ";
					if(keia1.equals("0")) keia1Criteria = " ";
					if(keia2.equals("0")) keia2Criteria = " ";
					String sql1 = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ "		left join (select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd on nn.idpatient=dd.idpatient "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+" and dd.ddate <= '"+header.get(keyHeader)+"' "+keia1Criteria+" "
							+ hcpfilterCriteria
							+ " order by nn.idpatient asc";
					String sql2 = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ "		left join (select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd on nn.idpatient=dd.idpatient "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+" and dd.ddate <= '"+header.get(keyHeader)+"' "+keia2Criteria+" "
							+ hcpfilterCriteria
							+ " ";
					System.out.println("=========================================");
					System.out.println("SQL : "+sql1);
					System.out.println("SQL : "+sql2);
					System.out.println("=========================================");
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					List<Map<String, Object>> rows2 = jdbcTemplate.queryForList(sql2);
					
					HashMap<String,String> m = new HashMap();
					m.put(keyHeader+"_"+keia1,Integer.toString(rows1.size()));
					m.put(keyHeader+"_"+keia2,Integer.toString(rows2.size()));
					result.add(m);
					
				}else {
					//dates 1 set
					String keia1 = criteria.getValue();
					String sql1 = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ "		left join (select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd on nn.idpatient=dd.idpatient "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+" and dd.ddate <= '"+header.get(keyHeader)+"' and nn.idcommunity = '"+keia1+"'"
							+ hcpfilterCriteria
							+ " order by nn.idpatient asc";
					System.out.println("=========================================");
					System.out.println("SQL : "+sql1);
					System.out.println("=========================================");
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					HashMap<String,String> m = new HashMap();
					m.put(keyHeader+"_"+keia1,Integer.toString(rows1.size()));
					result.add(m);
				}//end 
			}else if(criteria.getName().equals("dtype")) {
				String sql = "select distinct nn.idpatient as idpatient"
						+ "	from "
						+ "		ncdis.ncdis.patient nn "
						+ "		inner join "
						+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 and value='"+keyHeader+"' group by idpatient) as dd "
						+ "			on nn.idpatient=dd.idpatient "
						+ "	where  "
						+ "	(nn.dod='1900-01-01' or dod is null) and nn.active='1' ";
				System.out.println("=========================================");
				System.out.println("SQL : "+sql);
				System.out.println("=========================================");
				
				List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
				HashMap<String,String> m = new HashMap();
				m.put(keyHeader,Integer.toString(rows.size()));
				result.add(m);
			}
		}
	
	
	logger.log(Level.INFO, "Execute Report Totals ");
	return result;
}


public ArrayList<HashMap<String,ArrayList<String>>> executeReportCriteriaGraph(HashMap<String, Object> item, String filter, HashMap<String,String> header, ArrayList<HashMap<String,ArrayList<String>>> idpatientsWithCriteria,ReportCriteria criteria ){
	ArrayList<HashMap<String,ArrayList<String>>> result = idpatientsWithCriteria;
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	
	String valValue = "";
	String nomValue = "";
	String opValue = "";
	
	ReportCriteria subcriteria = null;
	Set<String> keys = item.keySet();
	for(String key : keys ) {
		if(key.indexOf("CollectedDate") < 0 && key.indexOf("flag") <0)subcriteria = (ReportCriteria)item.get(key);
	}
	valValue = subcriteria.getValue();
	nomValue = subcriteria.getName();
	opValue = renderer.renderOperator(subcriteria.getOperator());
	
	String hcpfilter = " ";
	String hcpfilterCriteria = " ";
	if(!filter.equals("allhcp")) {
		hcpfilter = " left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient ";
		hcpfilterCriteria = " and (ph.md='"+filter+"' or ph.nut='"+filter+"'or ph.nur='"+filter+"' or ph.chr='"+filter+"') ";
	}
	
	String subcriteriaStr = " and nn."+nomValue+" "+opValue+" '"+valValue+"' ";
	if(opValue.equals("between")){
		String[] parts = valValue.split("\\s*\\|+\\s*");
		String part1 = parts[0].trim();
		String part2 = parts[1].trim();
		String between1 = "'"+part1+"'";
		String between2 = "'"+part2+"'";
		if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
		if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
		subcriteriaStr = " and nn."+nomValue+" "+opValue+" "+between1+" and "+ between2;
	}
	
	
	if(subcriteria.getSection().equals("1")){
		Set<String> keysHeader = header.keySet();
		
		for(String keyHeader : keysHeader) {
			
			if(criteria.getName().equals("idcommunity")) {
				
				if(criteria.getValue().equals("0")) {
					String criteriaStr = " and nn.idcommunity='"+keyHeader+"' ";
					String sql = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+ " "+ subcriteriaStr+ " " + criteriaStr
							+ hcpfilterCriteria
							+ " ";
					System.out.println("=========================================");
					System.out.println("SQL : "+sql);
					System.out.println("=========================================");
					
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
					for(int i=0;i<result.size();i++) {
						HashMap<String, ArrayList<String>> headerMap = result.get(i);
						if(headerMap.keySet().contains(keyHeader)) {
							ArrayList<String> list =  headerMap.get(keyHeader);
							ArrayList<String> newlist =  new ArrayList<>();
							for(Map row : rows) {
								String p = row.get("idpatient").toString();
								if(list.contains(p))newlist.add(p);
							}
							headerMap.put(keyHeader,newlist);
							result.set(i,headerMap);
							break;
						}
					}
				}else if(criteria.getValue().indexOf("_") >= 0){
					//dates 2 sets
					String[] parts = criteria.getValue().split("_");
					String keia1 = parts[0];
					String keia2 = parts[1];
					String keia1Criteria = " and nn.idcommunity = '"+keia1+"' ";
					String keia2Criteria = " and nn.idcommunity = '"+keia2+"' ";
					if(keia1.equals("0")) keia1Criteria = " ";
					if(keia2.equals("0")) keia2Criteria = " ";
					String sql1 = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ "		left join (select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd on nn.idpatient=dd.idpatient "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+ " "+ subcriteriaStr+ " "+" and dd.ddate <= '"+header.get(keyHeader)+"' "+keia1Criteria+" "
							+ hcpfilterCriteria
							+ " order by nn.idpatient asc";
					String sql2 = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ "		left join (select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd on nn.idpatient=dd.idpatient "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+ " "+ subcriteriaStr+ " "+" and dd.ddate <= '"+header.get(keyHeader)+"' "+keia2Criteria+" "
							+ hcpfilterCriteria
							+ " ";
					System.out.println("=========================================");
					System.out.println("SQL : "+sql1);
					System.out.println("SQL : "+sql2);
					System.out.println("=========================================");
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					List<Map<String, Object>> rows2 = jdbcTemplate.queryForList(sql2);
					for(int i=0;i<result.size();i++) {
						HashMap<String, ArrayList<String>> headerMap = result.get(i);
						String k1 = keyHeader+"_"+keia1;
						String k2 = keyHeader+"_"+keia2;
						if(headerMap.keySet().contains(k1)  && headerMap.keySet().contains(k2)) {
							ArrayList<String> list1 =  headerMap.get(k1);
							ArrayList<String> list2 =  headerMap.get(k2);
							ArrayList<String> newlist1 =  new ArrayList<>();
							ArrayList<String> newlist2 =  new ArrayList<>();
							for(Map row1 : rows1) {
								String p = row1.get("idpatient").toString();
								if(list1.contains(p))newlist1.add(p);
							}
							headerMap.put(k1,newlist1);
							for(Map row2 : rows2) {
								String p = row2.get("idpatient").toString();
								if(list2.contains(p))newlist2.add(p);
							}
							headerMap.put(k2,newlist2);
							result.set(i,headerMap);
						}
					}
					
				}else {
					//dates 1 set
					String keia1 = criteria.getValue();
					String sql1 = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn  "
							+ "		left join (select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd on nn.idpatient=dd.idpatient "
							+ hcpfilter
							+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
							+ " "+ subcriteriaStr+ " "+" and dd.ddate <= '"+header.get(keyHeader)+"' and nn.idcommunity = '"+keia1+"'"
							+ hcpfilterCriteria
							+ " order by nn.idpatient asc";
					System.out.println("=========================================");
					System.out.println("SQL : "+sql1);
					System.out.println("=========================================");
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					for(int i=0;i<result.size();i++) {
						HashMap<String, ArrayList<String>> headerMap = result.get(i);
						String k1 = keyHeader;
						if(headerMap.keySet().contains(k1)) {
							ArrayList<String> list1 =  headerMap.get(k1);
							ArrayList<String> newlist1 =  new ArrayList<>();
							for(Map row1 : rows1) {
								String p = row1.get("idpatient").toString();
								if(list1.contains(p))newlist1.add(p);
							}
							headerMap.put(k1,newlist1);
							result.set(i,headerMap);
						}
					}
				}//end 
			}else if(criteria.getName().equals("dtype")) {
				
				String sql = "select distinct nn.idpatient as idpatient"
						+ "	from "
						+ "		ncdis.ncdis.patient nn "
						+ "		left join "
						+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
						+ "			on nn.idpatient=dd.idpatient "
						+ "		left join "
						+ "			ncdis.ncdis.cdis_value cv on dd.idpatient = cv.idpatient and dd.ddate = cv.datevalue "
						+ "	where cv.iddata=1 and cv.value = '"+keyHeader+"' "
						+ "	and (nn.dod='1900-01-01' or dod is null) and nn.active='1' " + subcriteriaStr;
				System.out.println("=========================================");
				System.out.println("SQL : "+sql);
				System.out.println("=========================================");
				
				List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
				for(int i=0;i<result.size();i++) {
					HashMap<String, ArrayList<String>> headerMap = result.get(i);
					if(headerMap.keySet().contains(keyHeader)) {
						ArrayList<String> list =  headerMap.get(keyHeader);
						ArrayList<String> newlist =  new ArrayList<>();
						for(Map row : rows) {
							String p = row.get("idpatient").toString();
							if(list.contains(p))newlist.add(p);
						}
						headerMap.put(keyHeader,newlist);
						result.set(i,headerMap);
						break;
					}
				}
			}
						
		}
	}else{
		//section is not 1
		Set<String> keysHeader = header.keySet();
		subcriteriaStr = " cast(value as float) "+opValue + "'"+valValue+"'";
		for(String keyHeader : keysHeader) {
			
			if(criteria.getName().equals("idcommunity")) {
				
				if(criteria.getValue().equals("0")) {
					//subcriteriaStr += " and nn.idcommunity='"+keyHeader+"' ";
					String sql = "select nn.idpatient as idpatient from   "
							+ " (select idpatient, max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata = '"+subcriteria.getIddata()+"' and "+subcriteriaStr+" group by idpatient) as nn "
							+ " left join ncdis.ncdis.patient pp on nn.idpatient = pp.idpatient"
							+ hcpfilter
							+ " where pp.idpatient > 0 and pp.active=1 and (pp.dod is null or pp.dod = '1900-01-01') "
							+ " and pp.idcommunity = '"+keyHeader+"' "
							+ hcpfilterCriteria
							+ " ";
					System.out.println("=========================================");
					System.out.println("SQL : "+sql);
					System.out.println("=========================================");
					
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
					for(int i=0;i<result.size();i++) {
						HashMap<String, ArrayList<String>> headerMap = result.get(i);
						if(headerMap.keySet().contains(keyHeader)) {
							ArrayList<String> list =  headerMap.get(keyHeader);
							ArrayList<String> newlist =  new ArrayList<>();
							for(Map row : rows) {
								String p = row.get("idpatient").toString();
								if(list.contains(p))newlist.add(p);
							}
							headerMap.put(keyHeader,newlist);
							result.set(i,headerMap);
							break;
						}
						
					}
				}else if(criteria.getValue().indexOf("_") >= 0){
					//dates 2 sets
					String[] parts = criteria.getValue().split("_");
					String keia1 = parts[0];
					String keia2 = parts[1];
					String keia1Criteria = " and pp.idcommunity = '"+keia1+"' ";
					String keia2Criteria = " and pp.idcommunity = '"+keia2+"' ";
					if(keia1.equals("0")) keia1Criteria = " ";
					if(keia2.equals("0")) keia2Criteria = " ";
					String sql1 = "select nn.idpatient as idpatient from   "
							+ " (select idpatient, max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata = '"+subcriteria.getIddata()+"' and "+subcriteriaStr+" group by idpatient) as nn "
							+ " left join ncdis.ncdis.patient pp on nn.idpatient = pp.idpatient"
							+ hcpfilter
							+ " where pp.idpatient > 0 and pp.active=1 and (pp.dod is null or pp.dod = '1900-01-01') "
							+ " and nn.ddate <= '"+header.get(keyHeader)+"' "+ keia1Criteria
							+ hcpfilterCriteria
							+ " ";
					String sql2 = "select nn.idpatient as idpatient from  "
							+ " (select idpatient, max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata = '"+subcriteria.getIddata()+"' and "+subcriteriaStr+" group by idpatient) as nn "
							+ " left join ncdis.ncdis.patient pp on nn.idpatient = pp.idpatient"
							+ hcpfilter
							+ " where pp.idpatient > 0 and pp.active=1 and (pp.dod is null or pp.dod = '1900-01-01') "
							+ " and nn.ddate <= '"+header.get(keyHeader)+"' "+keia2Criteria
							+ hcpfilterCriteria
							+ " ";
					System.out.println("=========================================");
					System.out.println("SQL1 : "+sql1);
					System.out.println("SQL2 : "+sql2);
					System.out.println("=========================================");
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					List<Map<String, Object>> rows2 = jdbcTemplate.queryForList(sql2);
					for(int i=0;i<result.size();i++) {
						HashMap<String, ArrayList<String>> headerMap = result.get(i);
						System.out.println("=========================================");
						System.out.println("key set : "+headerMap.keySet());
						System.out.println("key header : "+keyHeader);
						System.out.println("=========================================");
						String k1 = keyHeader+"_"+keia1;
						String k2 = keyHeader+"_"+keia2;
						if(headerMap.keySet().contains(k1)  && headerMap.keySet().contains(k2)) {
							ArrayList<String> list1 =  headerMap.get(k1);
							ArrayList<String> list2 =  headerMap.get(k2);
							ArrayList<String> newlist1 =  new ArrayList<>();
							ArrayList<String> newlist2 =  new ArrayList<>();
							for(Map row1 : rows1) {
								String p = row1.get("idpatient").toString();
								if(list1.contains(p))newlist1.add(p);
							}
							headerMap.put(k1,newlist1);
							for(Map row2 : rows2) {
								String p = row2.get("idpatient").toString();
								if(list2.contains(p))newlist2.add(p);
							}
							headerMap.put(k2,newlist2);
							result.set(i,headerMap);
						}
					}
					
				}else {
					//dates 1 set
					String keia1 = criteria.getValue();
					String sql1 = "select nn.idpatient as idpatient from "
							+ " (select idpatient, max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata = '"+subcriteria.getIddata()+"' and "+subcriteriaStr+" group by idpatient) as nn "
							+ " left join ncdis.ncdis.patient pp on nn.idpatient = pp.idpatient"
							+ hcpfilter
							+ " where pp.idpatient > 0 and pp.active=1 and (pp.dod is null or pp.dod = '1900-01-01') "
							+ " and nn.ddate <= '"+header.get(keyHeader)+"' and pp.idcommunity = '"+keia1+"'"
							+ hcpfilterCriteria
							+ " ";
					
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					for(int i=0;i<result.size();i++) {
						HashMap<String, ArrayList<String>> headerMap = result.get(i);
						String k1 = keyHeader;
						if(headerMap.keySet().contains(k1)) {
							ArrayList<String> list1 =  headerMap.get(k1);
							ArrayList<String> newlist1 =  new ArrayList<>();
							for(Map row1 : rows1) {
								String p = row1.get("idpatient").toString();
								if(list1.contains(p))newlist1.add(p);
							}
							headerMap.put(k1,newlist1);
							result.set(i,headerMap);
						}
					}
				}//end 
			}else if(criteria.getName().equals("dtype")) {
				String sql = "select distinct nn.idpatient as idpatient from "
						+ " (select idpatient, max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata = '"+subcriteria.getIddata()+"' and "+subcriteriaStr+" group by idpatient) as nn "
						+ "	left join ncdis.ncdis.patient as pp  on nn.idpatient=pp.idpatient "
						+ "	inner join (select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 and value='"+keyHeader+"' group by idpatient) as dd  on nn.idpatient=dd.idpatient "
						+ hcpfilter
						+ "	where pp.idpatient > 0 and pp.active='1' and (pp.dod='1900-01-01' or pp.dod is null) "
						+ hcpfilterCriteria
						+ "	" ;
				System.out.println("=========================================");
				System.out.println("SQL : "+sql);
				System.out.println("=========================================");
				
				List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
				
				System.out.println("=========================================");
				System.out.println("result size : "+result.size());
				System.out.println("=========================================");
				
				for(int i=0;i<result.size();i++) {
					
					
					
					HashMap<String, ArrayList<String>> headerMap = result.get(i);
					
					System.out.println("=========================================");
					System.out.println("map : "+headerMap);
					System.out.println("=========================================");
					System.out.println("=========================================");
					System.out.println("rows : "+rows.size());
					System.out.println("=========================================");
					if(headerMap.keySet().contains(keyHeader)) {
						ArrayList<String> list =  headerMap.get(keyHeader);
						ArrayList<String> newlist =  new ArrayList<>();
						for(Map row : rows) {
							String p = row.get("idpatient").toString();
							if(list.contains(p))newlist.add(p);
						}
						headerMap.put(keyHeader,newlist);
						result.set(i,headerMap);
						break;
					}
				}
			}
						
		}
		
	}
	
	logger.log(Level.INFO, "Execute Report ");
	return result;
}

public ArrayList<ArrayList<String>> executeReport(ReportCriteria criteria){
	ArrayList<ArrayList<String>> result = new ArrayList<>();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

	
	String val = criteria.getValue();
	String nom = criteria.getName();
	String op = renderer.renderOperator(criteria.getOperator());
			
	if(criteria.getSection().equals("1")){
			String criteriaStr = " and nn."+nom+" "+op+" '"+val+"' ";
			if(op.equals("between")){
				String[] parts = val.split("\\s*\\|+\\s*");
				String part1 = parts[0].trim();
				String part2 = parts[1].trim();
				String between1 = "'"+part1+"'";
				String between2 = "'"+part2+"'";
				if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
				if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
				criteriaStr = " and nn."+nom+" "+op+" "+between1+" and "+ between2;
			}
				
			if(val.equals("0")){criteriaStr = "";}
			String vn = "nn."+nom;
			String sql = "select nn.idpatient, "+vn+"  from ncdis.ncdis.patient nn  "
					+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
					+ " "+ criteriaStr+ " "
					+ "order by nn.idpatient asc";
			//System.out.println("=========================================");
			//System.out.println("SQL : "+sql);
			//System.out.println("=========================================");
			
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
		    			line.add(renderer.renderName(nom+"."+row.get(nom).toString()));
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
			if(op.equals("between")){
				String[] parts = val.split("\\s*\\|+\\s*");
				String part1 = parts[0].trim();
				String part2 = parts[1].trim();
				String between1 = "'"+part1+"'";
				String between2 = "'"+part2+"'";
				if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
				if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
				val = between1+" and "+ between2;
			}else {
				val = "'"+val+"'";
			}				
			
			String criteriaStr = " and cast(nn.value as float) "+op+" "+val+" ";
			String criteriaStrSub = " and cast(aa.value as float) "+op+" "+val+" ";
			
			if(nom.indexOf("CollectedDate") >= 0) {
				criteriaStr = " and cast(nn.datevalue as datetime) "+op+" "+val+" ";
				criteriaStrSub = " and cast(aa.datevalue as datetime) "+op+" "+val+" ";
			}
			
			System.out.println("=========================================");
			System.out.println("Value : "+nom);
			System.out.println("Value : "+val);
			System.out.println("=========================================");
				
			if(criteria.getValue().equals("0")){
				criteriaStr = "";
				criteriaStrSub = "";
			}	
				
			sql = "select aa.idpatient,replace(convert(varchar,aa.datevalue,102),'.','-') as datevalue, aa.value "
						+ " from ncdis.dbo.LastdateValue aa "
						+ "where isnumeric(aa.value)=1  "
						+ "and aa.iddata='"+criteria.getIddata()+"' "
						+ " "+ criteriaStrSub+ " "
						+ "order by aa.idpatient asc";
				
				
			
			System.out.println("=========================================");
			System.out.println("SQL : "+sql);
			System.out.println("=========================================");
			/**/
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		    int index=0;
			for(Map row : rows) {
				ArrayList<String> line = new ArrayList<>();
		    	line.add(Integer.toString(index));
	    		line.add(row.get("idpatient").toString());
	    		line.add(nom);
	    		if(criteria.getName().equals("sex") || criteria.getName().equals("idcommunity") || criteria.getName().equals("dtype")){
	    			line.add( renderer.renderName(nom+"."+row.get("value").toString()));
				}else{
					if(nom.indexOf("CollectedDate") >= 0) {
						line.add(row.get("datevalue").toString());
					}else {
						line.add(row.get("value").toString());
					}
				}
	    		result.add(line);
	    		index++;
			}
	}
	
	logger.log(Level.INFO, "Execute Report ");
	return result;
	}


public ArrayList<HashMap<String,String>> getSetGraphCustomReportPeriod(ReportCriteria criteria, HashMap<String,String> header){
	ArrayList<HashMap<String,String>> result = new ArrayList<>();
	String section = criteria.getSection();
	String val = criteria.getValue();
	String nom = criteria.getName();
	String op = renderer.renderOperator(criteria.getOperator());
	String sql = "";
	// if idcommunity is criteria there is no header we fall on value=0
	//if section=1 data come from different tables  idcommunity - date of birth header applies like that : 
	
	if(section.equals("1")) {
		//basicaly the only criteria here is date of birth
		String criteriaStr = " and nn."+nom+" "+op+" '"+val+"'";
		if(op.equals("between")){
			String[] parts = val.split("\\s*\\|+\\s*");
			String part1 = parts[0].trim();
			String part2 = parts[1].trim();
			String between1 = "'"+part1+"'";
			String between2 = "'"+part2+"'";
			if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
			if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
			criteriaStr = " and nn."+nom+" "+op+" '"+between1+"' and '"+ between2+"'";
		}
		sql = "select nn.idpatient as idpatient from ncdis.ncdis.patient nn where (nn.dod='1900-01-01' or nn.dod is null) and nn.active='1' "+criteriaStr;
		System.out.println("=====================================");
		System.out.println(sql);
		System.out.println("=====================================");
		
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		// for each column in th header we add the same list of id patients - special for section 1
		HashMap<String,String> column= new HashMap();
		for(Map row:rows) {
			column.put("idpatient",row.get("idpatient").toString());
		}
		for(int i=0;i<header.size();i++) {
			//result.add(column);
		}
	}else {
		if(op.equals("between")){
			String[] parts = val.split("\\s*\\|+\\s*");
			String part1 = parts[0].trim();
			String part2 = parts[1].trim();
			String between1 = "'"+part1+"'";
			String between2 = "'"+part2+"'";
			if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
			if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
			val = between1+" and "+ between2;
		}else {
			val = "'"+val+"'";
		}
		String criteriaStr = " and cast(aa.value as float) "+op+" "+val+" ";
		
		for(int i=0;i<header.size();i++) {
			String c = header.get(i);
			sql = "select x.idpatient as idpatient,aa.value from "
					+ " (select cv.idpatient, max(cv.datevalue) as ddate from ncdis.ncdis.cdis_value cv "
					+ "	left join  ncdis.ncdis.patient p on cv.idpatient = p.idpatient "
					+ " where "
					+ "	cv.iddata='"+criteria.getIddata()+"'  and cv.datevalue <= '"+c+"'  "
					+ "	and (p.dod='1900-01-01' or p.dod is null) and p.active='1' "
					+ " group by cv.idpatient) as x "
					+ " left join ncdis.ncdis.cdis_value aa on x.idpatient = aa.idpatient and aa.iddata='"+criteria.getIddata()+"' and x.ddate=aa.datevalue "
					+ " where aa.idpatient>0 "+criteriaStr;
			
			System.out.println("=====================================");
    		System.out.println(sql);
    		System.out.println("=====================================");
    		
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			ArrayList<String> column= new ArrayList<>();
			for(Map row:rows) {
				column.add(row.get("idpatient").toString());
			}
			//result.add(column);
		}
	}
	return result;
}

public ArrayList<ArrayList<String>> executeReportBackupMethod(ReportCriteria criteria, String reportType, ArrayList<ReportSubcriteria> subcriterias){
ArrayList<ArrayList<String>> result = new ArrayList<>();
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

if(reportType.equals("list")){
	String val = criteria.getValue();
	String nom = criteria.getName();
	String op = renderer.renderOperator(criteria.getOperator());
		
	if(criteria.getSection().equals("1")){
		String criteriaStr = " and nn."+nom+" "+op+" '"+val+"' ";
		if(op.equals("between")){
			String[] parts = val.split("\\s*\\|+\\s*");
			String part1 = parts[0].trim();
			String part2 = parts[1].trim();
			String between1 = "'"+part1+"'";
			String between2 = "'"+part2+"'";
			if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
			if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
			criteriaStr = " and nn."+nom+" "+op+" "+between1+" and "+ between2;
		}
			
		if(val.equals("0")){criteriaStr = "";}
		String vn = "nn."+nom;
		String sql = "select nn.idpatient, "+vn+"  from ncdis.ncdis.patient nn  "
				+ " where nn.idpatient > 0 and nn.active=1 and (nn.dod is null or nn.dod = '1900-01-01') "
				+ " "+ criteriaStr+ " "
				+ "order by nn.idpatient asc";
		System.out.println("=========================================");
		System.out.println("SQL : "+sql);
		System.out.println("=========================================");
		
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
	    			line.add(renderer.renderName(nom+"."+row.get(nom).toString()));
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
		if(op.equals("between")){
			String[] parts = val.split("\\s*\\|+\\s*");
			String part1 = parts[0].trim();
			String part2 = parts[1].trim();
			String between1 = "'"+part1+"'";
			String between2 = "'"+part2+"'";
			if(part1.indexOf("(") >= 0 && part1.indexOf(")") >= 0){between1 = part1;}
			if(part2.indexOf("(") >= 0 && part2.indexOf(")") >= 0){between2 = part2;}
			val = between1+" and "+ between2;
		}else {
			val = "'"+val+"'";
		}				
		
		String criteriaStr = " and cast(nn.value as float) "+op+" "+val+" ";
		String criteriaStrSub = " and cast(aa.value as float) "+op+" "+val+" ";
		
		if(nom.indexOf("CollectedDate") >= 0) {
			criteriaStr = " and cast(nn.datevalue as datetime) "+op+" "+val+" ";
			criteriaStrSub = " and cast(aa.datevalue as datetime) "+op+" "+val+" ";
		}
		
		/*
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
		*/
		
		System.out.println("=========================================");
		System.out.println("Value : "+nom);
		System.out.println("Value : "+val);
		System.out.println("=========================================");
			
		if(criteria.getValue().equals("0")){
			criteriaStr = "";
			criteriaStrSub = "";
		}	
			
		sql = "select aa.idpatient,replace(convert(varchar,aa.datevalue,102),'.','-') as datevalue, aa.value "
					+ " from ncdis.dbo.LastdateValue aa "
					+ "where isnumeric(aa.value)=1  "
					+ "and aa.iddata='"+criteria.getIddata()+"' "
					+ " "+ criteriaStrSub+ " "
					+ "order by aa.idpatient asc";
			
			
		
		System.out.println("=========================================");
		System.out.println("SQL : "+sql);
		System.out.println("=========================================");
		/**/
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	    int index=0;
		for(Map row : rows) {
			ArrayList<String> line = new ArrayList<>();
	    	line.add(Integer.toString(index));
    		line.add(row.get("idpatient").toString());
    		line.add(nom);
    		if(criteria.getName().equals("sex") || criteria.getName().equals("idcommunity") || criteria.getName().equals("dtype")){
    			line.add( renderer.renderName(nom+"."+row.get("value").toString()));
			}else{
				if(nom.indexOf("CollectedDate") >= 0) {
					line.add(row.get("datevalue").toString());
				}else {
					line.add(row.get("value").toString());
				}
			}
    		result.add(line);
    		index++;
		}
	}
	
}else if(reportType.equals("graph")){
		
		String val = criteria.getValue();
		String nom = criteria.getName();
		String op = renderer.renderOperator(criteria.getOperator());
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
						subStrWhere = " and bb."+rsc.getSubname()+" "+renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+ "' ";
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
								+ "     inner join 	(select xx.idpatient, max(xx.datevalue) as mdate from ncdis.ncdis.cdis_value xx where xx.iddata='"+criteria.getIddata()+"'	and cast(case when coalesce(patindex('%[0-9]%', xx.value),0) = 0  then '0' else xx.value end as float) "+renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+"' group by xx.idpatient) dd on dd.idpatient = bb.idpatient"
								+ " where"
								+ " bb.active  = '1' "
								+ " and "+nom+" "+op+" "+"'"+val+"'"
								+ " and (bb.dod is null or bb.dod = '1900-01-01')";

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
			
			
			
			// start section 50++   
			String criteriaStr = "select count(*) as cnt  from "+table+" bb";
			String criteriaWhere = "where bb."+criteria.getName()+" "+renderer.renderOperator(criteria.getOperator())+" "+criteria.getValue();
			
			
			String subcriteriaStr = "";
			if(subcriterias.size() > 0){
				for(int x=0;x<subcriterias.size();x++){
					ReportSubcriteria rsc = subcriterias.get(x);
					if(rsc.getSubsection().equals("1")){
						//subcriteriaStr += " inner join (select distinct idpatient from ncdis.ncdis.patient where "+rsc.getSubname()+" "+renderer.renderOperator(rsc.getSuboperator())+" "+rsc.getSubvalue()+" and (dod is null or dod ='1900-01-01')) cc"+x+" on bb.idpatient = cc"+x+".idpatient";
						subcriteriaStr += " and bb."+rsc.getSubname()+" "+renderer.renderOperator(rsc.getSuboperator())+" "+rsc.getSubvalue()+" ";
					}else if(rsc.getSubsection().equals("90")){
						//subcriteriaStr += " inner join (select distinct idpatient from ncdis.ncdis.cdis_value where iddata = '"+rsc.getSubiddata()+"' and value "+renderer.renderOperator(rsc.getSuboperator())+" "+renderer.renderValue(rsc.getSubsection()+"."+rsc.getSubvalue())+") cc"+x+" on bb.idpatient = cc"+x+".idpatient";
						subcriteriaStr += " and bb.dtype "+renderer.renderOperator(rsc.getSuboperator())+" "+renderer.renderValue(rsc.getSubsection()+"."+rsc.getSubvalue())+" ";
					}else{
						subcriteriaStr += " inner join (select distinct idpatient from ncdis.ncdis.cdis_value where iddata = '"+rsc.getSubiddata()+"' and value "+renderer.renderOperator(rsc.getSuboperator())+" "+rsc.getSubvalue()+") cc"+x+" on bb.idpatient = cc"+x+".idpatient";
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
				//section 50 no subcriteria
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
			//end section 50 ++ 
		}else{
			
			//section is not 1
			String criteriaStr = " and nn.value "+op+" '"+val+"' ";
			String criteriaStrSub = " and aa.value "+op+" '"+val+"' ";
			String subStrFrom = "";
			String subStrWhere = "";
			
			if(subcriterias.size() > 0){
				for(int x=0;x<subcriterias.size();x++){
					ReportSubcriteria rsc = subcriterias.get(x);
					
					if(rsc.getSubsection().equals("1")){
						sql = "select count(*) cnt"
								+ " from ncdis.ncdis.patient bb"
								+ "     inner join 	(select aa.idpatient, max(datevalue) maxdate from ncdis.ncdis.cdis_value aa where  aa.iddata='"+criteria.getIddata()+"' and aa.value "+renderer.renderOperator(criteria.getOperator())+" '"+criteria.getValue()+"' group by aa.idpatient) cc"
								+ "     on bb.idpatient = cc.idpatient"
								+ " where (bb.dod is null or bb.dod = '1900-01-01') and "
								+ "  bb."+rsc.getSubname()+" "+renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+ "' ";
					
					}else if(rsc.getSubsection().equals("90")){
						sql = "select count(*) cnt"
								+ " from ncdis.ncdis.cdis_value bb"
								+ "   left join 	(select aa.idpatient, max(datevalue) maxdate from ncdis.ncdis.cdis_value aa where  aa.iddata='"+criteria.getIddata()+"' and aa.value "+renderer.renderOperator(criteria.getOperator())+" '"+criteria.getValue()+"' group by aa.idpatient) cc"
								+ "    on bb.idpatient = cc.idpatient"
								+ " where  "
								+ " bb.iddata  = '"+rsc.getSubiddata()+"'"
								+ " and cast(case when coalesce(patindex('%[0-9]%', bb.value),0) = 0  then '0' else bb.value end as float) "+renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+"'"
								+ " and cc.maxdate is not null"
								+ " and bb.datevalue = (select max(xx.datevalue) from ncdis.ncdis.cdis_value xx where xx.iddata='"+rsc.getSubiddata()+"' and xx.idpatient = bb.idpatient group by xx.idpatient)";
					}else{
						sql = "select count(*) cnt"
								+ " from ncdis.ncdis.cdis_value bb"
								+ "   left join 	(select aa.idpatient, max(datevalue) maxdate from ncdis.ncdis.cdis_value aa where  aa.iddata='"+criteria.getIddata()+"' and aa.value "+renderer.renderOperator(criteria.getOperator())+" '"+criteria.getValue()+"' group by aa.idpatient) cc"
								+ "    on bb.idpatient = cc.idpatient"
								+ " where  "
								+ " bb.iddata  = '"+rsc.getSubiddata()+"'"
								+ " and cast(case when coalesce(patindex('%[0-9]%', bb.value),0) = 0  then '0' else bb.value end as float) "+renderer.renderOperator(rsc.getSuboperator())+" '"+rsc.getSubvalue()+"'"
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
	} //end else type=graph

logger.log(Level.INFO, "Execute Report ");
return result;
}



	public List<Map<String, Object>> executeReportFlist(String dataName, JsonArray criterias){
		List<Map<String, Object>> result = new ArrayList<>();
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
		
		
		if(rows.size() > 0) {
			 int columns;
				try {
					columns = rsm.getColumnCount();
					ArrayList<ReportCriteria> rcList = new ArrayList<>();
				    for(JsonElement criteria : criterias ){
				        ReportCriteria cse = gson.fromJson( criteria , ReportCriteria.class);
				        rcList.add(cse);
				    }
				   

					for(Map row : rows) {
				    	Map<String, Object> r = new Hashtable<>();
				    	for(ReportCriteria rc : rcList){
				    		for(int i=1;i<=columns;i++){
				    
				    			if(rc.getName().equals(rsm.getColumnName(i))){
				    				String colVal = row.get(rsm.getColumnName(i))!=null?row.get(rsm.getColumnName(i)).toString():""; 
				    				if(colVal == null) colVal = "";
				    				r.put(rc.getName(), colVal);
				    				/*
				    				if(rc.getDate().equals("yes")){
				    					String colValDate = row.get(rsm.getColumnName(i)+"Date")!=null?row.get(rsm.getColumnName(i)+"Date").toString():"";
				    					if(colValDate == null) colValDate = "";
				    					r.put(rc.getName()+"_collecteddate", colValDate);
				    				}
				    				*/
				    				break;
				    			}
				    		}
				    	}
				    	result.add(r);
					}
				
				} catch (SQLException e) {
					e.printStackTrace();
				}
		}
		
		logger.log(Level.INFO, "Execute Report FLIST");
    return result;
}
	

	
public ArrayList<Object> executeReportLocalList(){
	ArrayList<Object> result = new ArrayList<>();
	ArrayList<Object> resultBuffer = new ArrayList<>();
	Gson gson = new Gson();
		/*
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
		*/
	
	String sql = "select tt1.idpatient"
			+ ",ISNULL(p.fname,'')+' '+ ISNULL(p.lname,'') as fullname "
			+ ",p.ramq as ramq "
			+ ",p.sex as sex "
			+ ",p.chart as chart"
			+ ",p.idcommunity "
			+ ",datediff(year, p.dob, getdate()) as age "
			+ ",tt3.value as dtype "
			+ ",tt3.datevalue as ddate "
			+ ",datediff(year, tt3.datevalue, getdate()) as dduration "
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
		logger.log(Level.INFO, "Execute Report Locallist");
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

public ArrayList<HashMap<String, ArrayList<String>>> getIdPatientsForCustomReportGraph(ReportCriteria criteria, String hcpid,HashMap<String,String> header){
	
	// this should have the format 
	// if dtype = [{"type 1","list of idpatients"},{"type 2","list of idpatients"}, {"GDM","list of idpatients"}, {"predm","list of idpatients"}]
	// if idcommunnity
		//if idcommunity = 0  [{"Chisasibi","list of idpatient"},{"Mistisini","list of idpatient"}...]
		//if Idcommunity != 0 [{"period1","list of idpatients"},{"period2","list of idpatients"}... ]
		// if idcommunity _ 2 comunities [{"period1_part1":"list of idpatients","period1_part2":"list of idpatients"},{"period2_part1":"list of idpatients","period2_part2":"list of idpatients"}... ]
	
	
	ArrayList<HashMap<String, ArrayList<String>>> result = new ArrayList<>();
	String sql = "";
	if(hcpid.equals("allhcp")) {
		if(criteria.getName().equals("idcommunity")) {
			if(criteria.getValue().equals("0")) {
				//all communities
				Set<String> keys = header.keySet();
				for(String key:keys) {
					sql = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1' and nn.idcommunity = '"+key+"'" ;
					
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql);
					HashMap<String, ArrayList<String>> column = new HashMap<>();
					ArrayList<String> lista1 = new ArrayList<>();
					for(Map row1 : rows1) {
						String p = row1.get("idpatient").toString();
						lista1.add(p);
					}
					column.put(key, lista1);
					result.add(column);
				}
			
				
				
			}else if(criteria.getValue().indexOf("_") >= 0) {
				String[] parts = criteria.getValue().split("_");
				String keia1 = parts[0];
				String keia2 = parts[1];
				String keia1Criteria = " and nn.idcommunity = '"+keia1+"' ";
				String keia2Criteria = " and nn.idcommunity = '"+keia2+"' ";
				if(keia1.equals("0")) keia1Criteria = "";
				if(keia2.equals("0")) keia2Criteria = "";
				//get list of patients for each header
				//bazat pe data din header si data diagnozei
				Set<String> keys = header.keySet();
				for(String key:keys) {
					String sql1 = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ "		left join "
							+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
							+ "			on nn.idpatient=dd.idpatient "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1' "+keia1Criteria+" and  dd.ddate <= '"+header.get(key)+"'";
					
					String sql2 = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ "		left join "
							+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
							+ "			on nn.idpatient=dd.idpatient "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1'  "+keia2Criteria+" and  dd.ddate <= '"+header.get(key)+"'";
					
					
					
					
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					List<Map<String, Object>> rows2 = jdbcTemplate.queryForList(sql2);
					HashMap<String, ArrayList<String>> column = new HashMap<>();
					ArrayList<String> lista1 = new ArrayList<>();
					ArrayList<String> lista2 = new ArrayList<>();
					for(Map row1 : rows1) {
						String p = row1.get("idpatient").toString();
						lista1.add(p);
					}
					for(Map row2 : rows2) {
						String p = row2.get("idpatient").toString();
						lista2.add(p);
					}
					column.put(key+"_"+keia1, lista1);
					column.put(key+"_"+keia2, lista2);
					System.out.println("=====================================");
					System.out.println(key+"_"+keia1+"    "+lista1.size());
					System.out.println(key+"_"+keia2+"    "+lista2.size());
					System.out.println("=====================================");
					result.add(column);
					
				}
				
			}else {
				String keia1 = criteria.getValue();

				//get list of patients for each header
				//bazat pe data din header si data diagnozei
				Set<String> keys = header.keySet();
				for(String key:keys) {
					String sql1 = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ "		left join "
							+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
							+ "			on nn.idpatient=dd.idpatient "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1' and nn.idcommunity = '"+keia1+"' and  dd.ddate <= '"+header.get(key)+"'";
					
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					HashMap<String, ArrayList<String>> column = new HashMap<>();
					ArrayList<String> lista1 = new ArrayList<>();
					for(Map row1 : rows1) {
						String p = row1.get("idpatient").toString();
						lista1.add(p);
					}
					column.put(key, lista1);
					result.add(column);
				}
			}
		}else if(criteria.getName().equals("dtype")) {
			Set<String> keys = header.keySet();
			for(String key:keys) {
				sql = "select distinct nn.idpatient as idpatient"
						+ "	from "
						+ "		ncdis.ncdis.patient nn "
						+ "		left join "
						+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
						+ "			on nn.idpatient=dd.idpatient "
						+ "		left join "
						+ "			ncdis.ncdis.cdis_value cv on dd.idpatient = cv.idpatient and dd.ddate = cv.datevalue "
						+ "		left join  "
						+ "			ncdis.ncdis.cdis_diabet d on cv.value = '"+key+"' "
						+ "	where cv.iddata=1 "
						+ "	and (nn.dod='1900-01-01' or dod is null) and nn.active='1'";
				
				List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql);
				HashMap<String, ArrayList<String>> column = new HashMap<>();
				ArrayList<String> lista1 = new ArrayList<>();
				for(Map row1 : rows1) {
					String p = row1.get("idpatient").toString();
					lista1.add(p);
				}
				column.put(key, lista1);
				result.add(column);
			}
		}
	}else {
		//we have filter
		if(criteria.getName().equals("idcommunity")) {
			if(criteria.getValue().equals("0")) {
				//all communities
				Set<String> keys = header.keySet();
				for(String key:keys) {
					sql = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ " left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1' and nn.idcommunity = '"+key+"'" 
							+ " and (ph.md='"+hcpid+"' or ph.nut='"+hcpid+"'or ph.nur='"+hcpid+"' or ph.chr='"+hcpid+"')";
					
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql);
					HashMap<String, ArrayList<String>> column = new HashMap<>();
					ArrayList<String> lista1 = new ArrayList<>();
					for(Map row1 : rows1) {
						String p = row1.get("idpatient").toString();
						lista1.add(p);
					}
					column.put(key, lista1);
					result.add(column);
				}
			
				
				
			}else if(criteria.getValue().indexOf("_") >= 0) {
				String[] parts = criteria.getValue().split("_");
				String keia1 = parts[0];
				String keia2 = parts[1];
				//get list of patients for each header
				//bazat pe data din header si data diagnozei
				Set<String> keys = header.keySet();
				for(String key:keys) {
					String sql1 = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ " left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient "
							+ "		left join "
							+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
							+ "			on nn.idpatient=dd.idpatient "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1' and nn.idcommunity = '"+keia1+"' and  dd.ddate <= '"+header.get(key)+"'"
							+ " and (ph.md='"+hcpid+"' or ph.nut='"+hcpid+"'or ph.nur='"+hcpid+"' or ph.chr='"+hcpid+"')";
					
					String sql2 = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ " left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient "
							+ "		left join "
							+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
							+ "			on nn.idpatient=dd.idpatient "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1' and nn.idcommunity = '"+keia2+"' and  dd.ddate <= '"+header.get(key)+"'"
							+ " and (ph.md='"+hcpid+"' or ph.nut='"+hcpid+"'or ph.nur='"+hcpid+"' or ph.chr='"+hcpid+"')";
					
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					List<Map<String, Object>> rows2 = jdbcTemplate.queryForList(sql2);
					HashMap<String, ArrayList<String>> column = new HashMap<>();
					ArrayList<String> lista1 = new ArrayList<>();
					ArrayList<String> lista2 = new ArrayList<>();
					for(Map row1 : rows1) {
						String p = row1.get("idpatient").toString();
						lista1.add(p);
					}
					for(Map row2 : rows2) {
						String p = row2.get("idpatient").toString();
						lista2.add(p);
					}
					column.put(key+"_"+keia1, lista1);
					column.put(key+"_"+keia2, lista2);
					result.add(column);
					
				}
				
			}else {
				String keia1 = criteria.getValue();

				//get list of patients for each header
				//bazat pe data din header si data diagnozei
				Set<String> keys = header.keySet();
				for(String key:keys) {
					String sql1 = "select distinct nn.idpatient as idpatient from ncdis.ncdis.patient nn "
							+ " left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient "
							+ "		left join "
							+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
							+ "			on nn.idpatient=dd.idpatient "
							+ " where (nn.dod is null or nn.dod = '1900-01-01') and nn.active = '1' and nn.idcommunity = '"+keia1+"' and  dd.ddate <= '"+header.get(key)+"'"
							+ " and (ph.md='"+hcpid+"' or ph.nut='"+hcpid+"'or ph.nur='"+hcpid+"' or ph.chr='"+hcpid+"')";
					
					List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1);
					HashMap<String, ArrayList<String>> column = new HashMap<>();
					ArrayList<String> lista1 = new ArrayList<>();
					for(Map row1 : rows1) {
						String p = row1.get("idpatient").toString();
						lista1.add(p);
					}
					column.put(key, lista1);
					result.add(column);
				}
			}
		}else if(criteria.getName().equals("dtype")) {
			Set<String> keys = header.keySet();
			for(String key:keys) {
				sql = "select distinct nn.idpatient as idpatient"
						+ "	from "
						+ "		ncdis.ncdis.patient nn "
						+ " left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient "
						+ "		left join "
						+ "			(select idpatient,max(datevalue) as ddate from ncdis.ncdis.cdis_value where iddata=1 group by idpatient) as dd "
						+ "			on nn.idpatient=dd.idpatient "
						+ "		left join "
						+ "			ncdis.ncdis.cdis_value cv on dd.idpatient = cv.idpatient and dd.ddate = cv.datevalue "
						+ "		left join  "
						+ "			ncdis.ncdis.cdis_diabet d on cv.value = '"+key+"' "
						+ "	where cv.iddata=1 "
						+ "	and (nn.dod='1900-01-01' or dod is null) and nn.active='1'"
						+ " and (ph.md='"+hcpid+"' or ph.nut='"+hcpid+"'or ph.nur='"+hcpid+"' or ph.chr='"+hcpid+"')";
				
				List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql);
				HashMap<String, ArrayList<String>> column = new HashMap<>();
				ArrayList<String> lista1 = new ArrayList<>();
				for(Map row1 : rows1) {
					String p = row1.get("idpatient").toString();
					lista1.add(p);
				}
				column.put(key, lista1);
				result.add(column);
			}
		}
	}
	return result;
}



public ArrayList<String> getIdFilterPatients(String hcpid){
	ArrayList<String> result = new ArrayList<>();
	String sql = "select distinct nn.idpatient from ncdis.ncdis.patient nn left join ncdis.ncdis.patient_hcp ph on nn.idpatient = ph.idpatient where (nn.dod is null or nn.dod = '1900-01-01') and (ph.md='"+hcpid+"' or ph.nut='"+hcpid+"'or ph.nur='"+hcpid+"' or ph.chr='"+hcpid+"')";
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
	String sql = "insert into ncdis.ncdis.notes (note,datenote,iduser,idpatient,active,iduserto, viewed) values ('"+note.getNote()+"',getdate(),'"+note.getIduser()+"','"+note.getIdpatient()+"','1', '"+note.getIduserto()+"','"+note.getViewed()+"')";
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
    	fw.close();
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
	

public ArrayList<Object> executeReportNoHBA1c(){
	//ArrayList<Object> result = new ArrayList<>();
	ArrayList<Object> result = new ArrayList<>();
	Gson gson = new Gson();
	
	String sql = "select  u.idpatient,u.active,u.sex, ISNULL(u.fname,'')+' '+ ISNULL(u.lname,'') as fullname, u.ramq,u.chart,u.idcommunity,"
			+ " datediff(year, u.dob, getdate()) as age, "
			+ " tt.value as dtype,tt.datevalue as dtype_collecteddate "
			+ " from "
			+ "(select aa.idpatient, aa.datevalue as date1, aa.value as value1 from "
					+ "(select cc.idpatient, cc.datevalue, cc.value, cc.seqnum from "
							+ "( select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum "
							+ "from ncdis.ncdis.cdis_value cd where cd.iddata=27 ) cc "
					+ "where cc.seqnum =1) aa "
			+ ") dd "
			+ " right join ncdis.ncdis.patient u on dd.idpatient=u.idpatient "
			+ " left join (select cc.idpatient, cc.datevalue, cc.value, cc.seqnum from ( select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 ) cc where cc.seqnum =1) tt  on u.idpatient = tt.idpatient "
			+ "where u.active=1 and (u.dod is null or u.dod='1900-01-01') and value1 is null";
	
	try {
		
		 List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql);
		
		 @SuppressWarnings("unchecked")
			ResultSetMetaData rsm = jdbcTemplate.query(sql,new ResultSetExtractor<ResultSetMetaData>() {
		        @Override
		        public ResultSetMetaData extractData(ResultSet rs) throws SQLException, DataAccessException {
		            ResultSetMetaData rsmd = rs.getMetaData();
		            return rsmd;
		        }
		     });
		
		 int columns = rsm.getColumnCount();
		   
		 for(Map row : rows) {
			 
			/*
	    	for(int i=1;i<=columns;i++){
	    		String colVal = row.get(rsm.getColumnName(i))!=null?row.get(rsm.getColumnName(i)).toString():""; 
	    		if(colVal == null) colVal = "";
					row.put(rsm.getColumnName(i), colVal);
	    	}
	    	*/
		    result.add(row);
		 }

		 
	    //rs = cs.executeQuery(sql);
		/*
		if(rows.size() > 0 ) {
			for(Map row:rows) {
				
			}
		}
		
		
	    ResultSetMetaData rsm =  rs.getMetaData();
	    int columns = rsm.getColumnCount();
	   
	    while (rs.next()) {
	    	Hashtable<String, String> row = new Hashtable<>();
	    	for(int i=1;i<=columns;i++){
	    		String colVal = rs.getString(rsm.getColumnName(i)); 
	    		if(colVal == null) colVal = "";
					row.put(rsm.getColumnName(i), colVal);
	    	}
	    	result.add(row);
	    }
	    */
	    
	}catch (Exception e) {
		e.printStackTrace();
	} 
	
	return result;
}


public  Hashtable<String,ArrayList<Hashtable<String,String>>> getHbA1cTrend(String dtype) {
	Hashtable<String,ArrayList<Hashtable<String,String>>> result = new Hashtable();
	
	
	String cStr = " and a.idcommunity > 0 ";
	String gStr = " and a.sex > 0 ";
	
	String a1cConditionStr = " when try_convert(float, tt1.value) >= 0.07 OR try_convert(float, tt2.value) >= 0.07 ";
	String dtStr =" and (a.dtype=1 or a.dtype=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " a.dtype="+parts[x];
			if(parts[x].equals("3")){
				s = " a.dtype=3 or a.dtype=10 ";
				a1cConditionStr = " when try_convert(float, tt1.value) <= 0.06 OR try_convert(float, tt2.value) <= 0.06 ";
			}
			if(parts[x].equals("4")){
				s = " a.dtype=4 or a.dtype=11 ";
				a1cConditionStr = " when try_convert(float, tt1.value) >= 0.07 OR try_convert(float, tt2.value) >= 0.07 ";
			}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	String aStr = " and a.age > 0 ";
	String vStr = " and a.isgood =1 ";
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	Date now = new Date();
	Calendar calEnd = Calendar.getInstance();

	calEnd.setTime(now);
	calEnd.add(Calendar.MONTH, -1);
	calEnd.set(Calendar.DAY_OF_MONTH, calEnd.getActualMaximum(Calendar.DAY_OF_MONTH));
			
	try {
				
		for(int i=0;i<60;i++){
			
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, calEnd.get(Calendar.YEAR));
			c.set(Calendar.MONTH, calEnd.get(Calendar.MONTH));
			c.add(Calendar.MONTH, -1*i);
			c.set(Calendar.DAY_OF_MONTH, c.getActualMinimum(Calendar.DAY_OF_MONTH));
			String d1 = sdf.format(c.getTime());

			c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
			String d2 = sdf.format(c.getTime());
					
			String sql = "SELECT "
							+ "sum(case when a.deltavalue < 0 "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+vStr+" then 1 else 0 end) as n "
							+ ",a.age"
							+ ",a.sex"
							+ ",a.idcommunity"
							+ " from "
								+ "(select tt1.idpatient, tt1.value as value1, tt2.value as value2 , tt1.datevalue as date1, tt2.datevalue as date2 "
								+ " ,datediff(year, p.dob, getdate()) as age  "
								+ " ,round(try_convert(float, tt1.value) - try_convert(float, tt2.value), 3) as deltavalue "
								+ " ,case "
								+ a1cConditionStr
								+ "		then 1"
								+ "		else 0"
								+ "	end as isgood "
								+ ", p.idcommunity ,p.sex,tt3.value as dtype ,tt3.datevalue as ddate "
									+ " from "  
									+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue between '"+d1+"' and '"+d2+"') aa where aa.seqnum = 1) as tt1 "
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
								+ " ) as a "
								+ " group by a.age,a.sex,a.idcommunity";

			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql); 			
			ArrayList<Hashtable<String,String>> month = new ArrayList<>();

			for(Map row : rows) {
			    	Hashtable<String, String> line = new Hashtable<>();
			    	int n = Integer.parseInt(row.get("n").toString());
			    	if(n > 0){
			    		line.put("n", Integer.toString(n));
			    		line.put("a",row.get("age").toString());
			    		line.put("s",row.get("sex").toString());
			    		line.put("c",row.get("idcommunity").toString());
			    		month.add(line);
			    	}
			    	
			 }
			 result.put("m"+i, month);
		}
				
	}catch (Exception se) {
        se.printStackTrace();
    }
	logger.log(Level.INFO, "Execute HBA1c Trend");
	return result;
}

public  Hashtable<String,ArrayList<Hashtable<String,String>>> getHbA1cPeriod(String dtype) {

	Hashtable<String,ArrayList<Hashtable<String,String>>> result = new Hashtable();
	String cStr = " a.idcommunity > 0 ";
	String gStr = " and a.sex > 0 ";
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
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	Date now = new Date();
	
	Calendar calStart = Calendar.getInstance();
	calStart.setTime(now);
	calStart.add(Calendar.MONTH, -1 ); // we go back period number and 1 month more because we exclude current month
	calStart.set(Calendar.DAY_OF_MONTH, calStart.getActualMaximum(Calendar.DAY_OF_MONTH));
	
	try {
				
		for(int i=0;i<60;i++){
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, calStart.get(Calendar.YEAR));
			c.set(Calendar.MONTH, calStart.get(Calendar.MONTH));
			c.add(Calendar.MONTH, -1*i);
			c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
			String d1 = sdf.format(c.getTime());
			
			c.add(Calendar.MONTH, -12);
			String d2 = sdf.format(c.getTime());
			String dateStr = "and a.date1 < '"+d2+"'"; 
			
			String sql = "SELECT "
							+ " sum(case when "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+dateStr+" then 1 else 0 end) as n "
							+ ", a.sex "
							+ ", a.age "
							+ ", a.idcommunity "
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
								+ " ) as a "
								+ " group by a.sex,a.age,a.idcommunity";

			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql); 
			
			ArrayList<Hashtable<String,String>> month = new ArrayList<>();
			for(Map row:rows) {
				
					Hashtable<String, String> line = new Hashtable<>();
			    	int n = Integer.parseInt(row.get("n").toString());
			    	if(n > 0){
			    		line.put("n", Integer.toString(n));
			    		line.put("a",row.get("age").toString());
			    		line.put("s",row.get("sex").toString());
			    		line.put("c",row.get("idcommunity").toString());
			    		month.add(line);
			    	}
			}
			result.put("m"+i, month);	    
		}
	}catch (Exception se) {
        se.printStackTrace();
    } 
	logger.log(Level.INFO, "Execute HBA1c Period");
	return result;
}


public  Hashtable<String,ArrayList<Hashtable<String,String>>> getHbA1cValue(String dtype) {
	Hashtable<String,ArrayList<Hashtable<String,String>>> result = new Hashtable();
	String cStr = " a.idcommunity > 0 ";
	String gStr = " and a.sex > 0 ";
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
	String vStr = " and try_convert(float,a.value1) > 0 ";
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	Date now = new Date();

	Calendar calStart = Calendar.getInstance();
	calStart.setTime(now);
	calStart.add(Calendar.MONTH, -1 ); // we go back period number and 1 month more because we exclude current month
	calStart.set(Calendar.DAY_OF_MONTH, calStart.getActualMinimum(Calendar.DAY_OF_MONTH));


	try {
		    
	    //label1.put("label", "% of "+dtypelabel+" patients with "+labelDataStr+" - "+communities[Integer.parseInt(idcommunity)]);
		for(int i=0;i<60;i++){
			
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, calStart.get(Calendar.YEAR));
			c.set(Calendar.MONTH, calStart.get(Calendar.MONTH));
			c.set(Calendar.DAY_OF_MONTH, calStart.get(Calendar.DAY_OF_MONTH));
			
			c.add(Calendar.MONTH, i*-1);
			
			String d1 = sdf.format(c.getTime());
					//last 12 month
					
			c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
			String d2 = sdf.format(c.getTime());
			
			c.add(Calendar.MONTH, -12);
			c.set(Calendar.DAY_OF_MONTH, c.getActualMinimum(Calendar.DAY_OF_MONTH));
			String d3 = sdf.format(c.getTime());
			
			String dateStr = " and a.date1 >= '"+d3+"' and  a.date1 <= '"+d2+"' ";
					 
			String sql = "SELECT "
							+ " sum(case when "+cStr+" "+dtStr+" "+gStr+" "+aStr+" "+vStr+" "+dateStr+" then 1 else 0 end) as n "
							+ " , a.sex "
							+ " , a.age "
							+ " , a.idcommunity "
							+ " , ROUND(try_convert(float,a.value1),3) as value1 "
							+ " from "
								+ "(select tt1.idpatient, tt1.value as value1, tt1.datevalue as date1 "
								+ " ,datediff(year, p.dob, getdate()) as age  "
								+ " ,p.idcommunity ,p.sex,tt3.value as dtype ,tt3.datevalue as ddate "
									+ " from "  
									+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and cd.datevalue <= '"+d2+"') aa where aa.seqnum = 1) as tt1 "
									+ "left join "
										+ "ncdis.ncdis.patient p "
									+ "on  tt1.idpatient = p.idpatient and p.active=1 and (p.dod is null or p.dod='1900-01-01') "
									+ "left join "
										+ "(select aa.datevalue, aa.value, aa.idpatient, aa.seqnum from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 ) aa where aa.seqnum = 1) as tt3 "
											+ "on tt1.idpatient = tt3.idpatient "
									+ " where "
										+ " tt1.value is not null "
										+ " and p.idcommunity != 10 "
								+ " ) as a "
								+ " group by a.sex, a.age, a.idcommunity, a.value1";
	
								
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql); 
			ArrayList<Hashtable<String,String>> month = new ArrayList<>();
			for(Map row : rows) {
				Hashtable<String, String> line = new Hashtable<>();
		    	int n = Integer.parseInt(row.get("n").toString());
		    	if(n > 0){
		    		line.put("n", Integer.toString(n));
		    		line.put("a",row.get("age").toString());
		    		line.put("s",row.get("sex").toString());
		    		line.put("c",row.get("idcommunity").toString());
		    		line.put("v",row.get("value1").toString());
		    		month.add(line);
		    	}
		    }
		    result.put("m"+i, month);
		}
			
	}catch (Exception se) {
	    se.printStackTrace();
	} 
	logger.log(Level.INFO, "Execute HBA1c Value");
	return result;
}

public Hashtable<String, Object> a1cReportCustomValue(String cvalue, String idcommunity, String dtype){
	Hashtable<String, Object> result = new Hashtable<String,Object>();
	ArrayList<String> header = new ArrayList<>();
	ArrayList<Object> dataset = new ArrayList<>();
	
	String comop = (idcommunity.equals("0"))?">":"=";
	
	String dt = "(1,2,3,4,10,11)";
	if(dtype.equals("1")){
		dt = "(1,2)";
	}else if(dtype.equals("2")){
		dt = "(3,10)";
	}else if(dtype.equals("3")){
		dt = "(4,11)";
	}
	
	try {
		if(idcommunity.indexOf("_") >= 0 ){
			String[] parts = idcommunity.split("_");
			
			String c1 = "Patients with A1C <= "+cvalue;
			String c2 = "Patients with A1C over "+cvalue;
			
			for(int i=0;i<parts.length;i++){
				String idc = parts[i];
				ArrayList<String> dts = new ArrayList<>();
				int total = 0;
				comop = (idc.equals("0"))?">":"=";
				
				String sql = "select sum(aa.underc) as underc , sum(aa.overc) as overc  from " +
						 " (SELECT " + 
							   " CASE WHEN CAST(value AS numeric(17, 3)) <= "+cvalue+" THEN 1 ELSE 0 END AS underc "+
							   ",CASE WHEN CAST(value AS numeric(17, 3)) > "+cvalue+" THEN 1 ELSE 0 END AS overc "+
						    " FROM [ncdis].[dbo].[A1CGroups] "+
						    " WHERE idpatient > 0 " +
						    " and idcommunity "+comop+" '"+idc+"'" +
						    " and dtype in "+dt+" " +
						  " ) as aa";

				List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql); 
				
				
				for(Map row : rows){
					dts.add(row.get("underc").toString());
					dts.add(row.get("overc").toString());
				}  
				
			    dataset.add(dts);
			}
			header.add(c1);
			header.add(c2);
			
		}else{
			String sql = "select sum(aa.underc) as underc , sum(aa.overc) as overc from " +
					 " (SELECT " + 
						   " CASE WHEN CAST(value AS numeric(17, 3)) <= "+cvalue+" THEN 1 ELSE 0 END AS underc "+
						   ",CASE WHEN CAST(value AS numeric(17, 3)) > "+cvalue+" THEN 1 ELSE 0 END AS overc "+
					    " FROM [ncdis].[dbo].[A1CGroups] "+
					    " WHERE idpatient > 0 " +
					    " and idcommunity "+comop+" '"+idcommunity+"'" +
					    " and dtype in "+dt+" " +
					  " ) as aa";
			
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql); 
			
			
			header.add("Number of patients with A1C equal to "+cvalue+" or under");
		    header.add("Number of patients with A1C over "+cvalue);
			
		    for(Map row:rows){
				dataset.add(row.get("underc").toString());
				dataset.add(row.get("overc").toString());
			}    		
		    if(dataset.size() == 0 ){
		    	dataset.add("0");
				dataset.add("0");
		    }
			
		}
		
	    result.put("header", header);
	    result.put("dataset", dataset);
	    
	} catch (Exception e) {
		e.printStackTrace();
	} 
	logger.log(Level.INFO, "Execute HBA1c custom value");
	return result;
}


public Hashtable<String, Object> ldlReportCustomValue(String sens, String pvalue, String idcommunity, String dtype){
	Hashtable<String, Object> result = new Hashtable<String,Object>();
	ArrayList<String> header = new ArrayList<>();
	ArrayList<Object> dataset = new ArrayList<>();
	
	String comop = (idcommunity.equals("0"))?">":"=";
	
	String dt = "(1,2,3,4,10,11)";
	if(dtype.equals("1")){
		dt = "(1,2)";
	}else if(dtype.equals("2")){
		dt = "(3,10)";
	}else if(dtype.equals("3")){
		dt = "(4,11)";
	}
	
	
	try {
	
	    if(idcommunity.indexOf("_") >= 0){
	    	String[] parts = idcommunity.split("_");
			
			String c1 = "LDL < 2.0 ";
			String c2 = "LDL > 2.0 with reduction of LDL >= 50% ";
			String c3 = "LDL > 2.0 without reduction of 50% of LDL ";
			
			for(int i=0;i<parts.length;i++){
				String idc = parts[i];
				ArrayList<String> dts = new ArrayList<>();
				comop = (idc.equals("0"))?">":"=";
				String sql = "select sum(a.stage1) as stage1, sum(a.stage2) as stage2, sum(a.stage3) as stage3 " +
						 " from " + 
							   " (SELECT"
							   + "	CASE WHEN CAST(value AS numeric(17, 3)) < 2.0 THEN 1 ELSE 0 END AS stage1"
							   + "	, CASE WHEN CAST(value AS numeric(17, 3)) > 2.0  AND pdelta >= 50 THEN 1 ELSE 0 END AS stage2"
							   + "	, CASE WHEN CAST(value AS numeric(17, 3)) > 2.0  AND pdelta < 50 THEN 1 ELSE 0 END AS stage3"
							   + " FROM [ncdis].[dbo].[LDLGroups] "+
							   " where"
							   + "	idpatient > 0"
							   + "	and idcommunity "+comop+" "+idc
							   + "	and dtype in "+dt+") as a";
				
				List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql); 
				
				
				//rs = cs.executeQuery(sql);
				if(rows.size() > 0) {
					for(Map row : rows) {
						dts.add(row.get("stage1").toString());
						dts.add(row.get("stage2").toString());
						dts.add(row.get("stage3").toString());
					}
				}
				dataset.add(dts);
			}	
			header.add(c1);
			header.add(c2);
			header.add(c3);
				
	    }else{
	    	String sql = "select sum(a.stage1) as stage1, sum(a.stage2) as stage2, sum(a.stage3) as stage3 " +
					 " from " + 
						   " (SELECT"
						   + "	CASE WHEN CAST(value AS numeric(17, 3)) < 2.0 THEN 1 ELSE 0 END AS stage1"
						   + "	, CASE WHEN CAST(value AS numeric(17, 3)) > 2.0  AND pdelta >= 50 THEN 1 ELSE 0 END AS stage2"
						   + "	, CASE WHEN CAST(value AS numeric(17, 3)) > 2.0  AND pdelta < 50 THEN 1 ELSE 0 END AS stage3"
						   + " FROM [ncdis].[dbo].[LDLGroups] "+
						   " where"
						   + "	idpatient > 0"
						   + "	and idcommunity "+comop+" "+idcommunity
						   + "	and dtype in "+dt+") as a";
	    	
	    	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql); 
	    	
	    	//rs = cs.executeQuery(sql);
		    header.add("LDL < 2.0 ");
		    header.add("LDL > 2.0 with reduction of LDL >= 50% ");
		    header.add("LDL > 2.0 without reduction of 50% ");
		    
		    
			for(Map row : rows){
				dataset.add(row.get("stage1").toString());
				dataset.add(row.get("stage2").toString());
				dataset.add(row.get("stage3").toString());
				
			}    		
		    if(dataset.size() == 0 ){
		    	dataset.add("0");
				dataset.add("0");
				dataset.add("0");
		    }
	    }
		    result.put("header", header);
	    result.put("dataset", dataset);
	    
	} catch (Exception e) {
		e.printStackTrace();
	} 
	logger.log(Level.INFO, "Execute LDL custom value");
	return result;
}


public  int getNumberOfPatients(String idcommunity, String since, String gender, String dtype, String age) {

	int result = 0;
	
	
	String cStr = " and aa.idcommunity > 0 ";
	if(!idcommunity.equals("0"))cStr = " and aa.idcommunity="+idcommunity+" "; 
	
	String gStr = " and aa.sex > 0 ";
	if(!gender.equals("0"))gStr = " and aa.sex="+gender+" ";
	
	String dtStr =" and (aa.value=1 or aa.value=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " aa.value="+parts[x];
			if(parts[x].equals("3")){s = " aa.value=3 or aa.value=10 ";}
			if(parts[x].equals("4")){s = " aa.value=4 or aa.value=11 ";}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	
	String aStr = " and datediff(year, aa.dob, '"+since+"') > 0 ";
	if(!age.equals("0")){
		if(age.indexOf("_") >= 0){
			String[] parts = age.split("_");
			aStr = " and datediff(year, aa.dob, '"+since+"') between "+parts[0]+" and "+parts[1]+" ";
		}
	}
	
	
		
		String sql = "SELECT count(*) as cnt "
					+ " from "
						+ "("
						+ "		select aa.idpatient"
						+ "		from ncdis.ncdis.patient aa"
						+ "		where"
						+ "			aa.active=1"
						+ "			and (aa.dod is null or aa.dod='1900-01-01')"
						+ aStr
						+ cStr
						+ gStr
						+ ") as p"
						+ " inner join "  
						+ "("
						+ "		select"
						+ "			aa.datevalue,"
						+ "			aa.value,"
						+ "			aa.idpatient,"
						+ "			aa.seqnum"
						+ "		from (select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue <= '"+since+"') aa"
						+ ""
						+ "		where"
						+ "			aa.seqnum = 1"
						+ dtStr
						+ " ) as cv"
						+ " on p.idpatient = cv.idpatient";

	
		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);
		for(int i=0;i<rs.size();i++) {
			Map<String,Object> line = rs.get(i);
			
			result = Integer.parseInt(line.get("cnt").toString());
	    }
		logger.log(Level.INFO, "Get number of patients");
	return result;
}


public  Hashtable<String, ArrayList<Object>> getPValidationData(String idlist) {

	Hashtable<String, ArrayList<Object>> result = new Hashtable();
	
	String sql = "";
	
	ArrayList<Object> header = new ArrayList<>();
	ArrayList<Object> data = new ArrayList<>();
	    
    if(idlist.equals("1")){
	    	HashMap<String, String> hc1 = new HashMap<>();
	    	hc1.put("column", "fullname");
	    	hc1.put("name", "Full name");
	    	header.add(hc1);
	    	
	    	HashMap<String, String> hc11 = new HashMap<>();
	    	hc11.put("column", "ramq");
	    	hc11.put("name", "RAMQ Number");
	    	header.add(hc11);

	    	HashMap<String, String> hc2 = new HashMap<>();
	    	hc2.put("column", "chart");
	    	hc2.put("name", "Chart");
	    	header.add(hc2);

	    	HashMap<String, String> hc3 = new HashMap<>();
	    	hc3.put("column", "idcommunity");
	    	hc3.put("name", "Community");
	    	header.add(hc3);

	    	HashMap<String, String> hc4 = new HashMap<>();
	    	hc4.put("column", "dtype");
	    	hc4.put("name", "Type of diabetes");
	    	header.add(hc4);

	    	HashMap<String, String> hc5 = new HashMap<>();
	    	hc5.put("column", "lastdate");
	    	hc5.put("name", "Last date");
	    	header.add(hc5);

	    	
			sql = "select mm.idpatient, concat(mm.fname,' ',mm.lname) as fullname, mm.ramq, mm.chart, mm.idcommunity, mm.value as dtype, nn.lastdate as lastdate from "
					+ "(select p.idpatient, p.fname,p.lname, p.ramq, p.chart, p.dob, p.idcommunity, ppp.value from ncdis.ncdis.patient p "
					+ "	inner join"
					+ "	(select aa.datevalue,aa.value, aa.idpatient,aa.seqnum  from "
					+ "			(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1) aa"
					+ "				where aa.seqnum = 1) as ppp on p.idpatient = ppp.idpatient "
					+ "		where  p.active=1 and (p.dod='1900-01-01' or p.dod is null) and ppp.value!=4) as mm"
					+ " left join "
					+ "(select idpatient, max(datevalue) as lastdate from ncdis.ncdis.cdis_value group by idpatient) as nn on mm.idpatient = nn.idpatient  "
					+ " where "
					+ " nn.lastdate < dateadd(year, -5, getdate())";

    }else if(idlist.equals("2")){
			HashMap<String, String> hc1 = new HashMap<>();
	    	hc1.put("column", "fullname");
	    	hc1.put("name", "Full name");
	    	header.add(hc1);
	    	
	    	HashMap<String, String> hc11 = new HashMap<>();
	    	hc11.put("column", "ramq");
	    	hc11.put("name", "RAMQ Number");
	    	header.add(hc11);

	    	HashMap<String, String> hc2 = new HashMap<>();
	    	hc2.put("column", "chart");
	    	hc2.put("name", "Chart");
	    	header.add(hc2);

	    	HashMap<String, String> hc3 = new HashMap<>();
	    	hc3.put("column", "idcommunity");
	    	hc3.put("name", "Community");
	    	header.add(hc3);

	    	HashMap<String, String> hc4 = new HashMap<>();
	    	hc4.put("column", "dob");
	    	hc4.put("name", "Date of birth");
	    	header.add(hc4);

	    	HashMap<String, String> hc5 = new HashMap<>();
	    	hc5.put("column", "age");
	    	hc5.put("name", "Age");
	    	header.add(hc5);

	    	
			sql = "select pp.idpatient, concat(pp.fname,' ',pp.lname) as fullname, pp.ramq, pp.chart, pp.idcommunity, pp.dob, pp.age  from "
					+ " (select p.idpatient, p.fname,p.lname, p.ramq, p.chart, p.dob, p.idcommunity, datediff(year, p.dob, getdate()) as age"
					+ "	from ncdis.ncdis.patient p where p.active=1 and (p.dod='1900-01-01' or p.dod is null)) as pp "
					+ " where pp.age > 95";
		
    }else if(idlist.equals("3")){
			HashMap<String, String> hc1 = new HashMap<>();
	    	hc1.put("column", "fullname");
	    	hc1.put("name", "Full name");
	    	header.add(hc1);
	    	
	    	HashMap<String, String> hc11 = new HashMap<>();
	    	hc11.put("column", "ramq");
	    	hc11.put("name", "RAMQ Number");
	    	header.add(hc11);

	    	HashMap<String, String> hc2 = new HashMap<>();
	    	hc2.put("column", "chart");
	    	hc2.put("name", "Chart");
	    	header.add(hc2);

	    	HashMap<String, String> hc3 = new HashMap<>();
	    	hc3.put("column", "idcommunity");
	    	hc3.put("name", "Community");
	    	header.add(hc3);

	    	HashMap<String, String> hc4 = new HashMap<>();
	    	hc4.put("column", "dob");
	    	hc4.put("name", "Date of birth");
	    	header.add(hc4);

	    	HashMap<String, String> hc5 = new HashMap<>();
	    	hc5.put("column", "band");
	    	hc5.put("name", "Band");
	    	header.add(hc5);
			
			sql = "select pat.idpatient,pat.fullname, pat.ramq, pat.chart, pat.dob, pat.idcommunity, pat.band from "
					+ " (select p.idpatient, concat(p.fname,' ',p.lname) as fullname, p.ramq, p.chart, p.dob, p.idcommunity, p.band from ncdis.ncdis.patient p "
					+ " where p.active=1 and (p.dod='1900-01-01' or p.dod is null) ) as pat "
					+ " right join"
					+ "		(select pp.fullname, count(pp.fullname) as doublename from "
					+ " 			(select concat(p.fname,' ',p.lname) as fullname, p.idpatient, p.active, p.dod from ncdis.ncdis.patient p) as pp "
					+ "	    where "
					+ "       pp.fullname != '' and pp.fullname != 'FIRSTNAME LASTNAME' and pp.active=1 and (pp.dod='1900-01-01' or pp.dod is null) "
					+ "     group by pp.fullname "
					+ "     having count(pp.fullname) > 1) as ppd "
					+ " on pat.fullname = ppd.fullname "
					+ " where pat.fullname is not null "
					+ " ";
		
    }else if(idlist.equals("4")){
			HashMap<String, String> hc1 = new HashMap<>();
	    	hc1.put("column", "fullname");
	    	hc1.put("name", "Full name");
	    	header.add(hc1);
	    	
	    	HashMap<String, String> hc11 = new HashMap<>();
	    	hc11.put("column", "ramq");
	    	hc11.put("name", "RAMQ Number");
	    	header.add(hc11);

	    	HashMap<String, String> hc2 = new HashMap<>();
	    	hc2.put("column", "chart");
	    	hc2.put("name", "Chart");
	    	header.add(hc2);

	    	HashMap<String, String> hc3 = new HashMap<>();
	    	hc3.put("column", "idcommunity");
	    	hc3.put("name", "Community");
	    	header.add(hc3);

	    	HashMap<String, String> hc4 = new HashMap<>();
	    	hc4.put("column", "lastvalue");
	    	hc4.put("name", "Last value");
	    	header.add(hc4);

	    	HashMap<String, String> hc5 = new HashMap<>();
	    	hc5.put("column", "beforelastvalue");
	    	hc5.put("name", "Before last value");
	    	header.add(hc5);
	    	
	    	sql = "select mm.idpatient, concat(mm.fname,' ', mm.lname) as fullname, mm.ramq, mm.chart, mm.idcommunity, cast(vv.value1 as decimal(10,3)) as lastvalue, cast(vv.value2 as decimal(10,3)) as beforelastvalue from"
	    			+ " (select p.idpatient, p.fname,p.lname, p.ramq, p.chart, p.dob, p.idcommunity,  ppp.value as dtype from "
	    			+ " ncdis.ncdis.patient p "
	    			+ " inner join "
	    			+ "	(select aa.datevalue,aa.value,aa.idpatient,aa.seqnum from "
	    			+ "		(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1) aa "
	    			+ "  where aa.seqnum = 1) as ppp "
	    			+ " on p.idpatient = ppp.idpatient "
	    			+ " where  p.active=1 and (p.dod='1900-01-01' or p.dod is null) and ppp.value=3) as mm "
	    		+ " inner join "
	    		+ "		(select v1.idpatient,v1.datevalue as ddate1,v1.value as value1, v2.datevalue as ddate2, v2.value as value2 from "
	    		+ "			(select aa.datevalue,aa.value,aa.idpatient,aa.seqnum from "
	    		+ "				(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=27 and TRY_CONVERT(float,cd.value) > 0.065) aa"
	    		+ "         where aa.seqnum = 1) as v1"
	    		+ "		left join"
	    		+ "			(select aa.datevalue,aa.value, aa.idpatient, aa.seqnum from"
	    		+ "				(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum	from ncdis.ncdis.cdis_value cd where cd.iddata=27 and TRY_CONVERT(float,cd.value) > 0.065) aa"
	    		+ "			where aa.seqnum = 2) as v2 "
	    		+ "     on v1.idpatient = v2.idpatient) as vv "
	    		+ " on mm.idpatient = vv.idpatient "
	    		+ " where vv.value1 is not null and vv.value2 is not null ";
	    	
		
    }else if(idlist.equals("5")){
			HashMap<String, String> hc1 = new HashMap<>();
	    	hc1.put("column", "fullname");
	    	hc1.put("name", "Full name");
	    	header.add(hc1);
	    	
	    	HashMap<String, String> hc11 = new HashMap<>();
	    	hc11.put("column", "ramq");
	    	hc11.put("name", "RAMQ Number");
	    	header.add(hc11);

	    	HashMap<String, String> hc2 = new HashMap<>();
	    	hc2.put("column", "chart");
	    	hc2.put("name", "Chart");
	    	header.add(hc2);

	    	HashMap<String, String> hc3 = new HashMap<>();
	    	hc3.put("column", "idcommunity");
	    	hc3.put("name", "Community");
	    	header.add(hc3);

	    	HashMap<String, String> hc4 = new HashMap<>();
	    	hc4.put("column", "dob");
	    	hc4.put("name", "Date of birth");
	    	header.add(hc4);

	    	HashMap<String, String> hc5 = new HashMap<>();
	    	hc5.put("column", "band");
	    	hc5.put("name", "Band");
	    	header.add(hc5);
	    	
	    	sql = "select pat.idpatient,pat.fullname, pat.ramq, pat.chart, pat.dob, pat.idcommunity, pat.band from "
					+ " (select p.idpatient, concat(p.fname,' ',p.lname) as fullname, p.ramq, p.chart, p.dob, p.idcommunity, p.band from ncdis.ncdis.patient p "
					+ " where p.active=1 and (p.dod='1900-01-01' or p.dod is null) ) as pat "
					+ " where pat.idpatient not in (select cd.idpatient from ncdis.ncdis.cdis_value cd where cd.iddata=1)"
					+ " ";
	    	
		}
	    
	   
		
		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);
	    for(int i=0;i<rs.size();i++) {
	    	Map<String,Object> line = rs.get(i);
	    
	    	data.add(line);
	    }
	    
	
		result.put("header", header);
		result.put("data", data);
		
		logger.log(Level.INFO, "Execute Pvalidation data");
	return result;
}

public  Hashtable<String, ArrayList<Object>> getPrevalenceNow(String idcommunity, String sex, String dtype, String age) {

	Hashtable<String, ArrayList<Object>> result = new Hashtable();
	
	String cStr = " and pp.idcommunity > 0 ";
	if(!idcommunity.equals("0"))cStr = " and pp.idcommunity="+idcommunity+" "; 
	
	String gStr = " and pp.sex > 0 ";
	if(!sex.equals("0"))gStr = " and pp.sex="+sex+" ";
	
	String dtStr =" and (ppp.value=1 or ppp.value=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " ppp.value="+parts[x];
			if(parts[x].equals("3")){s = " ppp.value=3 or ppp.value=10 ";}
			if(parts[x].equals("4")){s = " ppp.value=4 or ppp.value=11 ";}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	
	String aStr = " and pp.age > 0 ";
	if(!age.equals("0")){
		if(age.indexOf("p") >= 0 ){
			//more that 75
			aStr = " and pp.age >= 75 ";
		}else{
			if(age.indexOf("-") >= 0){
				String[] parts = age.split("-");
				aStr = " and pp.age >="+parts[0]+" and pp.age <="+parts[1]+" ";
			}
		}
		
	}
	    
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		Calendar calStart = Calendar.getInstance();
		calStart.setTime(now);
		try {
			calStart.setTime(sdf.parse(Integer.toString(calStart.get(Calendar.YEAR))+"-01-01"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	    
		ArrayList<Object> series = new ArrayList<>();
		ArrayList<Object> ticks = new ArrayList<>();
		ArrayList<Object> labels = new ArrayList<>();
			
		labels.add(Integer.toString(calStart.get(Calendar.YEAR)));
		ticks.add(Integer.toString(calStart.get(Calendar.YEAR)));	
		result.put("labels", labels);
		result.put("ticks", ticks);
		
		String sql = "SELECT count(*) as cnt "
					+ " from "
						+ "(SELECT pp.idpatient,pp.idcommunity,pp.age,pp.sex,ppp.value "
							+ " from "  
							+ "(select p.idpatient,p.idcommunity,datediff(year, p.dob, getdate()) as age, p.sex FROM ncdis.ncdis.patient p where p.active=1 and (p.dod='1900-01-01' or p.dod is null)) as pp "
							+ "left join "
								+ " (select aa.datevalue, aa.value, aa.idpatient, aa.seqnum "
								+ " from"
								+ " 	(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1) aa "
								+ "	where "
								+ "		aa.seqnum = 1) as ppp "
							+ "on pp.idpatient = ppp.idpatient "
							+ " where "
								+ " ppp.value is not null "
								+ cStr + gStr + dtStr + aStr 
						+ " ) as t ";
		
		
		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);

		
		for(int i=0;i<rs.size();i++) {
			Map<String,Object> line = rs.get(i);
			String n = line.get("cnt").toString();
			series.add(n);
	    }

	result.put("series", series);
	logger.log(Level.INFO, "Execute Prevalence now");
	return result;
}


public  Hashtable<String, ArrayList<Object>> getPrevalenceNowLastYear(String idcommunity, String sex, String dtype, String age) {

	Hashtable<String, ArrayList<Object>> result = new Hashtable();
	
	String cStr = " and pp.idcommunity > 0 ";
	if(!idcommunity.equals("0"))cStr = " and pp.idcommunity="+idcommunity+" "; 
	
	String gStr = " and pp.sex > 0 ";
	if(!sex.equals("0"))gStr = " and pp.sex="+sex+" ";
	
	String dtStr =" and (ppp.value=1 or ppp.value=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " ppp.value="+parts[x];
			if(parts[x].equals("3")){s = " ppp.value=3 or ppp.value=10 ";}
			if(parts[x].equals("4")){s = " ppp.value=4 or ppp.value=11 ";}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	
	String aStr = " and pp.age > 0 ";
	if(!age.equals("0")){
		if(age.indexOf("p") >= 0 ){
			//more that 75
			aStr = " and pp.age >= 75 ";
		}else{
			if(age.indexOf("-") >= 0){
				String[] parts = age.split("-");
				aStr = " and pp.age >="+parts[0]+" and pp.age <="+parts[1]+" ";
			}
		}
		
	}
	
	    
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		Calendar calStart = Calendar.getInstance();
		Calendar calEnd = Calendar.getInstance();
		calStart.setTime(now);
		calEnd.setTime(now);
		try {
			calStart.setTime(sdf.parse(Integer.toString(calStart.get(Calendar.YEAR))+"-01-01"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	    calStart.add(Calendar.YEAR, -1);
	    calEnd.add(Calendar.YEAR, -1);
		
		ArrayList<Object> series = new ArrayList<>();
		ArrayList<Object> ticks = new ArrayList<>();
		ArrayList<Object> labels = new ArrayList<>();
			
		labels.add(Integer.toString(calStart.get(Calendar.YEAR)));
		ticks.add(Integer.toString(calStart.get(Calendar.YEAR)));	
		result.put("labels", labels);
		result.put("ticks", ticks);
		
		String sql = "SELECT count(*) as cnt "
					+ " from "
						+ "(SELECT pp.idpatient,pp.idcommunity,pp.age,pp.sex,ppp.value "
							+ " from "  
							+ "(select p.idpatient,p.idcommunity,datediff(year, p.dob, '"+sdf.format(calEnd.getTime())+"') as age, p.sex FROM ncdis.ncdis.patient p where p.active=1 and (p.dod='1900-01-01' or p.dod is null)) as pp "
							+ "left join "
								+ " (select aa.datevalue, aa.value, aa.idpatient, aa.seqnum "
								+ " from"
								+ " 	(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue <= '"+sdf.format(calEnd.getTime())+"') aa "
								+ "	where "
								+ "		aa.seqnum = 1) as ppp "
							+ "on pp.idpatient = ppp.idpatient "
							+ " where "
								+ " ppp.value is not null "
								+ cStr + gStr + dtStr + aStr 
						+ " ) as t ";
		System.out.println(sql);
		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);

		
		for(int i=0;i<rs.size();i++) {
			Map<String,Object> line = rs.get(i);
			String n = line.get("cnt").toString();
			series.add(n);
	    }
	    
	result.put("series", series);
	logger.log(Level.INFO, "Execute prevalence now last year");
	return result;
}

public  Hashtable<String, ArrayList<Object>> getIncidenceNow(String idcommunity, String sex, String dtype, String age) {

	Hashtable<String, ArrayList<Object>> result = new Hashtable();
	
	String cStr = " and pp.idcommunity > 0 ";
	if(!idcommunity.equals("0"))cStr = " and pp.idcommunity="+idcommunity+" "; 
	
	String gStr = " and pp.sex > 0 ";
	if(!sex.equals("0"))gStr = " and pp.sex="+sex+" ";
	
	String dtStr =" and (ppp.value=1 or ppp.value=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " ppp.value="+parts[x];
			if(parts[x].equals("3")){s = " ppp.value=3 or ppp.value=10 ";}
			if(parts[x].equals("4")){s = " ppp.value=4 or ppp.value=11 ";}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	
	String aStr = " and pp.age > 0 ";
	if(!age.equals("0")){
		if(age.indexOf("p") >= 0 ){
			//more that 75
			aStr = " and pp.age >= 75 ";
		}else{
			if(age.indexOf("-") >= 0){
				String[] parts = age.split("-");
				aStr = " and pp.age >="+parts[0]+" and pp.age <="+parts[1]+" ";
			}
		}
		
	}
	
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		Calendar calStart = Calendar.getInstance();
		calStart.setTime(now);
		try {
			calStart.setTime(sdf.parse(Integer.toString(calStart.get(Calendar.YEAR))+"-01-01"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}   

		ArrayList<Object> series = new ArrayList<>();
		ArrayList<Object> ticks = new ArrayList<>();
		ArrayList<Object> labels = new ArrayList<>();
				
				
				
		labels.add(Integer.toString(calStart.get(Calendar.YEAR)));
		ticks.add(Integer.toString(calStart.get(Calendar.YEAR)));
		result.put("labels", labels);
		result.put("ticks", ticks);
				
		String sql = "SELECT count(*) as cnt "
					+ " from "
						+ "(SELECT pp.idpatient,pp.idcommunity,pp.age,pp.sex,ppp.value "
							+ " from "  
							+ "(select p.idpatient,p.idcommunity,datediff(year, p.dob, getdate()) as age, p.sex FROM ncdis.ncdis.patient p where p.active=1 and (p.dod='1900-01-01' or p.dod is null)) as pp "
							+ "left join "
								+ " (select aa.datevalue, aa.value, aa.idpatient, aa.seqnum "
								+ " from"
								+ " 	(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue >= '"+sdf.format(calStart.getTime())+"') aa "
								+ "	where "
								+ "		aa.seqnum = 1) as ppp "
							+ "on pp.idpatient = ppp.idpatient "
							+ " where "
								+ " ppp.value is not null "
								+ cStr + gStr + dtStr + aStr 
						+ " ) as t ";

		List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);

		
		for(int i=0;i<rs.size();i++) {
			Map<String,Object> line = rs.get(i);
			String n = line.get("cnt").toString();
			series.add(n);
	    }

		result.put("series", series);
		logger.log(Level.INFO, "Execute Incidence Now");
	return result;
}


public  Hashtable<String, ArrayList<Object>> getIncidenceNowLastYear(String idcommunity, String sex, String dtype, String age) {

	Hashtable<String, ArrayList<Object>> result = new Hashtable();
	
	String cStr = " and pp.idcommunity > 0 ";
	if(!idcommunity.equals("0"))cStr = " and pp.idcommunity="+idcommunity+" "; 
	
	String gStr = " and pp.sex > 0 ";
	if(!sex.equals("0"))gStr = " and pp.sex="+sex+" ";
	
	String dtStr =" and (ppp.value=1 or ppp.value=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " ppp.value="+parts[x];
			if(parts[x].equals("3")){s = " ppp.value=3 or ppp.value=10 ";}
			if(parts[x].equals("4")){s = " ppp.value=4 or ppp.value=11 ";}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	
	String aStr = " and pp.age > 0 ";
	if(!age.equals("0")){
		if(age.indexOf("p") >= 0 ){
			//more that 75
			aStr = " and pp.age >= 75 ";
		}else{
			if(age.indexOf("-") >= 0){
				String[] parts = age.split("-");
				aStr = " and pp.age >="+parts[0]+" and pp.age <="+parts[1]+" ";
			}
		}
		
	}
	
	
		    
		    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date now = new Date();
			Calendar calStart = Calendar.getInstance();
			Calendar calEnd = Calendar.getInstance();

			calEnd.setTime(now);
			calStart.setTime(now);
			
			try {
				calStart.setTime(sdf.parse(calStart.get(Calendar.YEAR)+"-01-01"));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		    calEnd.add(Calendar.YEAR, -1);
		    calStart.add(Calendar.YEAR, -1);

			ArrayList<Object> series = new ArrayList<>();
			ArrayList<Object> ticks = new ArrayList<>();
			ArrayList<Object> labels = new ArrayList<>();
			
			
			labels.add(Integer.toString(calStart.get(Calendar.YEAR)));
			ticks.add(Integer.toString(calStart.get(Calendar.YEAR)));
			result.put("labels", labels);
			result.put("ticks", ticks);
				
			String sql = "SELECT count(*) as cnt "
						+ " from "
							+ "(SELECT pp.idpatient,pp.idcommunity,pp.age,pp.sex,ppp.value "
								+ " from "  
								+ "(select p.idpatient,p.idcommunity,datediff(year, p.dob, '"+sdf.format(calEnd.getTime())+"') as age, p.sex FROM ncdis.ncdis.patient p where p.active=1 and (p.dod='1900-01-01' or p.dod is null)) as pp "
								+ "left join "
									+ " (select aa.datevalue, aa.value, aa.idpatient, aa.seqnum "
									+ " from"
									+ " 	(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue >= '"+sdf.format(calStart.getTime())+"' and cd.datevalue <= '"+sdf.format(calEnd.getTime())+"') aa "
									+ "	where "
									+ "		aa.seqnum = 1) as ppp "
								+ "on pp.idpatient = ppp.idpatient "
								+ " where "
									+ " ppp.value is not null "
									+ cStr + gStr + dtStr + aStr 
							+ " ) as t ";

							
			List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);

			
			for(int i=0;i<rs.size();i++) {
				Map<String,Object> line = rs.get(i);
				String n = line.get("cnt").toString();
				series.add(n);
		    }
			
		result.put("series", series);
		logger.log(Level.INFO, "Execute Incidence Now Last Year");	
	return result;
}




public  Hashtable<String, ArrayList<Object>> getPrevalenceHistory(String idcommunity, String sex, String dtype, String age, String since) {

	Hashtable<String, ArrayList<Object>> result = new Hashtable();
	
	String cStr = " and pp.idcommunity > 0 ";
	if(!idcommunity.equals("0"))cStr = " and pp.idcommunity="+idcommunity+" "; 
	
	String gStr = " and pp.sex > 0 ";
	if(!sex.equals("0"))gStr = " and pp.sex="+sex+" ";
	
	String dtStr =" and (ppp.value=1 or ppp.value=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " ppp.value="+parts[x];
			if(parts[x].equals("3")){s = " ppp.value=3 or ppp.value=10 ";}
			if(parts[x].equals("4")){s = " ppp.value=4 or ppp.value=11 ";}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	
	String aStr = " and pp.age > 0 ";
	if(!age.equals("0")){
		if(age.indexOf("p") >= 0 ){
			//more that 75
			aStr = " and pp.age >= 75 ";
		}else{
			if(age.indexOf("-") >= 0){
				String[] parts = age.split("-");
				aStr = " and pp.age >="+parts[0]+" and pp.age <="+parts[1]+" ";
			}
		}
		
	}
	
	try {
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		Calendar calStart = Calendar.getInstance();
		Calendar calEnd = Calendar.getInstance();
		calStart.setTime(sdf.parse(since+"-12-31"));
		calEnd.setTime(now);
		
		int sinceYear  = Integer.parseInt(since);
		int currentYear = calEnd.get(Calendar.YEAR);
		
	    
		ArrayList<Object> series = new ArrayList<>();
		ArrayList<Object> ticks = new ArrayList<>();
		ArrayList<Object> labels = new ArrayList<>();

    	
		for(int i=sinceYear;i<currentYear;i++){
			labels.add(Integer.toString(i));
			ticks.add(Integer.toString(i));
			
			String sql = "SELECT count(*) as cnt "
					+ " from "
						+ "(SELECT pp.idpatient,pp.idcommunity,pp.age,pp.sex,ppp.value "
							+ " from "  
							+ "(select p.idpatient,p.idcommunity,datediff(year, p.dob, '"+ sdf.format(calStart.getTime())+"') as age, p.sex FROM ncdis.ncdis.patient p where p.active=1 and (p.dod='1900-01-01' or p.dod is null)) as pp "
							+ "left join "
								+ " (select aa.datevalue, aa.value, aa.idpatient, aa.seqnum "
								+ " from"
								+ " 	(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue <= '"+sdf.format(calStart.getTime())+"') aa "
								+ "	where "
								+ "		aa.seqnum = 1) as ppp "
							+ "on pp.idpatient = ppp.idpatient "
							+ " where "
								+ " ppp.value is not null "
								+ cStr + gStr + dtStr + aStr 
						+ " ) as t ";

			List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);
			for(int x=0;x<rs.size();x++) {
				Map<String,Object> line = rs.get(x);
				String n = line.get("cnt").toString();
				series.add(n);
		    }
			
			calStart.add(Calendar.YEAR, 1);
		}
		
		result.put("labels", labels);
		result.put("series", series);
		result.put("ticks", ticks);
	}catch (ParseException e) {
		e.printStackTrace();
	}
	logger.log(Level.INFO, "Execute Prevalence History");
	return result;
}

public  Hashtable<String, ArrayList<Object>> getIncidenceHistory(String idcommunity, String sex, String dtype, String age, String since) {

	Hashtable<String, ArrayList<Object>> result = new Hashtable();
	
	String cStr = " and pp.idcommunity > 0 ";
	if(!idcommunity.equals("0"))cStr = " and pp.idcommunity="+idcommunity+" "; 
	
	String gStr = " and pp.sex > 0 ";
	if(!sex.equals("0"))gStr = " and pp.sex="+sex+" ";
	
	String dtStr =" and (ppp.value=1 or ppp.value=2) ";
	if(!dtype.equals("1_2")){
		dtype = dtype.replaceAll("_", "");
		String[] parts = dtype.split("(?!^)");
		dtStr = " and (";
		for(int x=0;x<parts.length;x++){
			String s = " ppp.value="+parts[x];
			if(parts[x].equals("3")){s = " ppp.value=3 or ppp.value=10 ";}
			if(parts[x].equals("4")){s = " ppp.value=4 or ppp.value=11 ";}
			
			if(x == 0){
				dtStr +=  s;
			}else{
				dtStr +=  " or "+s;
			}
		}
		dtStr += " ) ";
	}
	
	
	String aStr = " and pp.age > 0 ";
	if(!age.equals("0")){
		if(age.indexOf("p") >= 0 ){
			//more that 75
			aStr = " and pp.age >= 75 ";
		}else{
			if(age.indexOf("-") >= 0){
				String[] parts = age.split("-");
				aStr = " and pp.age >="+parts[0]+" and pp.age <="+parts[1]+" ";
			}
		}
		
	}
	
	try {
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		Calendar calStart = Calendar.getInstance();
		Calendar calEnd = Calendar.getInstance();
		calStart.setTime(sdf.parse(since+"-12-31"));
		calEnd.setTime(now);
		
		int sinceYear  = Integer.parseInt(since);
		int currentYear = calEnd.get(Calendar.YEAR);
		
		ArrayList<Object> series = new ArrayList<>();
		ArrayList<Object> ticks = new ArrayList<>();
		ArrayList<Object> labels = new ArrayList<>();

    	
		for(int i=sinceYear;i<currentYear;i++){
			labels.add(Integer.toString(i));
			ticks.add(Integer.toString(i));
			Calendar calS = Calendar.getInstance();
			calS.setTime(calStart.getTime());
			calS.add(Calendar.YEAR, -1);
			
			String sql = "SELECT count(*) as cnt "
					+ " from "
						+ "(SELECT pp.idpatient,pp.idcommunity,pp.age,pp.sex,ppp.value "
							+ " from "  
							+ "(select p.idpatient,p.idcommunity,datediff(year, p.dob, '"+ sdf.format(calStart.getTime())+"') as age, p.sex FROM ncdis.ncdis.patient p where p.active=1 and (p.dod='1900-01-01' or p.dod is null)) as pp "
							+ "left join "
								+ " (select aa.datevalue, aa.value, aa.idpatient, aa.seqnum "
								+ " from"
								+ " 	(select cd.* , row_number() over (partition by cd.idpatient order by datevalue desc) as seqnum from ncdis.ncdis.cdis_value cd where cd.iddata=1 and cd.datevalue>='"+sdf.format(calS.getTime())+"' and cd.datevalue <= '"+sdf.format(calStart.getTime())+"') aa "
								+ "	where "
								+ "		aa.seqnum = 1) as ppp "
							+ "on pp.idpatient = ppp.idpatient "
							+ " where "
								+ " ppp.value is not null "
								+ cStr + gStr + dtStr + aStr 
						+ " ) as t ";

			List<Map<String,Object>> rs = jdbcTemplate.queryForList(sql);
			for(int x=0;x<rs.size();x++) {
				Map<String,Object> line = rs.get(x);
				String n = line.get("cnt").toString();
				series.add(n);
		    }
			
			calStart.add(Calendar.YEAR, 1);
		}
		
		
		result.put("labels", labels);
		result.put("series", series);
		result.put("ticks", ticks);
				
	} catch (ParseException e) {
		e.printStackTrace();
	} 
	logger.log(Level.INFO, "Execute Incidence History");
	return result;
}


public ArrayList<String> getDoubleRamqs(){
	ArrayList<String> result = new ArrayList<>();
	String sql = "SELECT ramq, COUNT(*) FROM ncdis.ncdis.patient GROUP BY ramq HAVING COUNT(*) > 1";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		result.add(row.get("ramq").toString());
	}
	return result;
}


public int getLowestId(String ramq){
	int result = 0;
	String sql = "select min(idpatient) as idpatient from ncdis.ncdis.patient where ramq='"+ramq+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		result = Integer.parseInt(row.get("idpatient").toString());
	}
	return result;
}

public ArrayList<Integer> getIdsOfPatient(String ramq){
	ArrayList<Integer> result = new ArrayList<>();
	String sql = "SELECT idpatient FROM ncdis.ncdis.patient where ramq='"+ramq+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		result.add(Integer.parseInt(row.get("idpatient").toString()));
	}
	return result;
}

public ArrayList<Integer> getIdsOfAllPatients(){
	ArrayList<Integer> result = new ArrayList<>();
	String sql = "SELECT idpatient FROM ncdis.ncdis.patient";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	for(Map row : rows) {
		result.add(Integer.parseInt(row.get("idpatient").toString()));
	}
	return result;
}


public boolean transferCdisValues(int fromid , int toid){
	boolean result = false;
	String sql = "update ncdis.ncdis.cdis_value set idpatient='"+toid+"' where idpatient = '"+fromid+"'";
	jdbcTemplate.update(sql);
	result = true;
	logger.log(Level.INFO, "Transfer data from Id patient:"+fromid+" to Patient idpatient:"+toid);
	return result;
}


public boolean cleanCdisValues(int id){
	boolean result = false;
	String sql = "select * from ncdis.ncdis.cdis_value  where idpatient = '"+id+"'";
	List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
	ArrayList<String> hash = new ArrayList<>();
	for(Map row : rows) {
		String dv = row.get("datevalue")==null?"NULL":row.get("datevalue").toString();
		String v = row.get("value")==null?"NULL":row.get("value").toString();
		
		String h = row.get("idpatient").toString()+dv+v+row.get("iddata").toString();
		if(hash.size() == 0) {
			hash.add(h);
		}
		if(hash.contains(h)) {
			jdbcTemplate.update("delete from ncdis.ncdis.cdis_value where idvalue='"+row.get("idvalue").toString()+"'");
		}else {
			hash.add(h);
		}
	}
	result = true;
	logger.log(Level.INFO, "Clean data for Id patient:"+id);
	return result;
}



}
