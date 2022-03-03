/**
 * 
 */
package com.grvtech.cdis.model;

import java.util.HashMap;

/**
 * @author Radu
 *
 */
public class ScheduleVisit {
	private String idpatient;
	private String iduser;
	private String datevisit;
	private String frequency;
	private String idprofesion;
	
	public String getIdpatient() {
		return idpatient;
	}
	public void setIdpatient(String idpatient) {
		this.idpatient = idpatient;
	}
	public String getIduser() {
		return iduser;
	}
	public void setIduser(String iduser) {
		this.iduser = iduser;
	}
	public String getDatevisit() {
		return datevisit;
	}
	public void setDatevisit(String datevisit) {
		this.datevisit = datevisit;
	}
	public String getFrequency() {
		return frequency;
	}
	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}
	
	public String getIdprofesion() {
		return idprofesion;
	}
	public void setIdprofesion(String idprofesion) {
		this.idprofesion = idprofesion;
	}
	
	public ScheduleVisit() {
		super();
	}
	
	public ScheduleVisit(String idpatient, String iduser, String datevisit,
			String frequency,String idprofesion) {
		super();
		this.idpatient = idpatient;
		this.iduser = iduser;
		this.datevisit = datevisit;
		this.frequency = frequency;
		this.idprofesion = idprofesion;
	}
	
	public void setScheduleVisit(HashMap<String, String> rol){
		this.idpatient = rol.get("idpatient");
		this.iduser = rol.get("iduser");
		this.datevisit = rol.get("datevisit");
		this.frequency = rol.get("frequency");
		this.idprofesion = rol.get("idprofesion");
		
	}
	

}
