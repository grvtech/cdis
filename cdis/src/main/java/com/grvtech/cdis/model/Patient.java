/**
 * 
 */
package com.grvtech.cdis.model;


import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Hashtable;
import java.util.Map;
import java.util.Vector;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;

import com.grvtech.cdis.db.CdisDBridge;
import com.grvtech.cdis.db.ChbDBridge;
import com.grvtech.cdis.util.LanguageTool;
import com.grvtech.cdis.util.Misc;

/**
 * @author radu
 *
 */
@SuppressWarnings("unchecked")
public class Patient {
	
	private int idpatient;
	private String ramq;
	private String chart;
	private String band;
	private String giu;
	private String jbnqa;
	private String fname;
	private String lname;
	private String sex; //1 Male | 2 Female
	private String dob; //date of birth
	private String mfname;
	private String mlname;
	private String pfname;
	private String plname;
	private String address;
	private String city;
	private String province;
	private String idprovince;
	private String postalcode;
	private int consent;
	private int iscree;
	private String dod;//date of death
	private String dcause;
	private String entrydate;
	private String idcommunity;
	private String community;
	private String phone;
	
	
	
	public Patient(int idpatient, String ramq, String chart, String band,
			String giu, String jbnqa, String fname, String lname, String sex,
			String dob, String mfname, String mlname, String pfname,
			String plname, String address, String city, String province,
			String postalcode, int consent, int iscree, String dod,
			String dcause, String entrydate,  String idcommunity,  String community, String idprovince,String phone) {
		super();
		this.idpatient = idpatient;
		this.ramq = ramq;
		this.chart = chart;
		this.band = band;
		this.giu = giu;
		this.jbnqa = jbnqa;
		this.fname = fname;
		this.lname = lname;
		this.sex = sex;
		if(dob!= null && dob.equals("1900-01-01")){
			this.dob = "";
		}else{
			this.dob = dob;
		}
		this.mfname = mfname;
		this.mlname = mlname;
		this.pfname = pfname;
		this.plname = plname;
		this.address = address;
		this.city = city;
		this.province = province;
		this.idprovince = idprovince;
		this.postalcode = postalcode;
		this.consent = consent;
		this.iscree = iscree;
		if( dod!=null && dod.equals("1900-01-01")){
			this.dod = "";
		}else{
			this.dod = dod;
		}
		this.dcause = dcause;
		this.entrydate = entrydate;
		this.idcommunity = idcommunity;
		this.community = community;
		this.phone= phone;
	}

	public MessageResponse setPatient(Map<String, String[]> map) {
		MessageResponse result = new MessageResponse();
		String language = ((String[])map.get("language"))[0];
		boolean flag = false;
		if(map.get("ramq") != null){
			String v = ((String[])map.get("ramq"))[0];
			if(this.ramq != null){
				if(v.equals(this.ramq)){
					flag = true;
				}else{
					result.setLanguage(language);
					result.setMessage("error");
					result.setStatus(0);
					return result;
				}
			}else{
				if(v.equals("") || v.equals("NULL") || v == null){
					result.setLanguage(language);
					result.setMessage("error");
					result.setStatus(0);
					return result;
				}else{
					this.ramq = v;
					flag = true;
				}
				
			}
			
		}
		
		if(map.get("chart") != null){
			String v = ((String[])map.get("chart"))[0];
			this.chart = v;
		}
		
		if(map.get("band") != null){this.band = ((String[])map.get("band"))[0];}
		if(map.get("giu") != null){this.giu = ((String[])map.get("giu"))[0];}
		if(map.get("jbnqa") != null){this.jbnqa = ((String[])map.get("jbnqa"))[0];}
		if(map.get("fname") != null){this.fname = ((String[])map.get("fname"))[0];}
		if(map.get("lname") != null){this.lname = ((String[])map.get("lname"))[0];}
		if(map.get("sex") != null){this.sex = ((String[])map.get("sex"))[0];}
		if(map.get("iscree") != null){this.iscree = Integer.parseInt(((String[])map.get("iscree"))[0]);}
		if(map.get("dob") != null){this.dob = ((String[])map.get("dob"))[0];}
		if(map.get("mfname") != null){this.mfname = ((String[])map.get("mfname"))[0];}
		if(map.get("mlname") != null){this.mlname = ((String[])map.get("mlname"))[0];}
		if(map.get("pfname") != null){this.pfname = ((String[])map.get("pfname"))[0];}
		if(map.get("plname") != null){this.plname = ((String[])map.get("plname"))[0];}
		if(map.get("address") != null){this.address = ((String[])map.get("address"))[0];}
		if(map.get("postalcode") != null){this.postalcode = ((String[])map.get("postalcode"))[0];}
		if(map.get("dod") != null){this.dod = ((String[])map.get("dod"))[0];}
		if(map.get("dcause") != null){this.dcause = ((String[])map.get("dcause"))[0];}
		if(map.get("idcommunity") != null){this.idcommunity = ((String[])map.get("idcommunity"))[0];}
		if(map.get("idprovince") != null){this.idprovince = ((String[])map.get("idprovince"))[0];}
		if(map.get("phone") != null){this.phone = ((String[])map.get("phone"))[0];}
	
		if(flag){
			result.setLanguage(language);
			//result.setMessage(LanguageTool.getError("EDITP-CHART-EMPTY", language));
			//if()
			result.setStatus(1);
		}
		return result;
	}
	
	
	
	public Patient() {
		super();
		idpatient = 0;
	}
	
	
	public String getIdprovince() {
		return idprovince;
	}

	public void setIdprovince(String idprovince) {
		this.idprovince = idprovince;
	}
	
	
	public String getIdcommunity() {
		return idcommunity;
	}

	public void setIdcommunity(String idcommunity) {
		this.idcommunity = idcommunity;
	}

	public String getCommunity() {
		return community;
	}

	public void setCommunity(String community) {
		this.community = community;
	}

	public static Patient getPatientByRamq(String rmq){
		CdisDBridge db = new CdisDBridge();
		return db.getPatientByRamq(rmq);
	}

	public boolean isValidPatient(){
		if(idpatient == 0 )return false;
		else return true;
	}

	
	
	public int getIdpatient() {
		return idpatient;
	}

	public void setIdpatient(int idpatient) {
		this.idpatient = idpatient;
	}

	public String getRamq() {
		return ramq;
	}

	public void setRamq(String ramq) {
		this.ramq = ramq;
	}

	public String getChart() {
		return chart;
	}

	public void setChart(String chart) {
		this.chart = chart;
	}

	public String getBand() {
		return band;
	}

	public void setBand(String band) {
		this.band = band;
	}

	public String getGiu() {
		return giu;
	}

	public void setGiu(String giu) {
		this.giu = giu;
	}

	public String getJbnqa() {
		return jbnqa;
	}

	public void setJbnqa(String jbnqa) {
		this.jbnqa = jbnqa;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getMfname() {
		return mfname;
	}

	public void setMfname(String mfname) {
		this.mfname = mfname;
	}

	public String getMlname() {
		return mlname;
	}

	public void setMlname(String mlname) {
		this.mlname = mlname;
	}

	public String getPfname() {
		return pfname;
	}

	public void setPfname(String pfname) {
		this.pfname = pfname;
	}

	public String getPlname() {
		return plname;
	}

	public void setPlname(String plname) {
		this.plname = plname;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getPostalcode() {
		return postalcode;
	}

	public void setPostalcode(String postalcode) {
		this.postalcode = postalcode;
	}

	public int getConsent() {
		return consent;
	}

	public void setConsent(int consent) {
		this.consent = consent;
	}

	public int getIscree() {
		return iscree;
	}

	public void setIscree(int iscree) {
		this.iscree = iscree;
	}

	public String getDod() {
		return dod;
	}

	public void setDod(String dod) {
		this.dod = dod;
	}

	public String getDcause() {
		return dcause;
	}

	public void setDcause(String dcause) {
		this.dcause = dcause;
	}

	public String getEntrydate() {
		return entrydate;
	}

	public void setEntrydate(String entrydate) {
		this.entrydate = entrydate;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	

	
}
