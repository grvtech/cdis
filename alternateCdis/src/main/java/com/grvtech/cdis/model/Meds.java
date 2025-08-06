/**
 * 
 */
package com.grvtech.cdis.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

/**
 * @author radu
 *
 */
public class Meds {

	private Values orala;
	private Values insulin;
	private Values acei;
	private Values statin;
	private Values asa;
	
	public Meds(Values orala, Values insulin, Values acei, Values statin,
			Values asa) {
		super();
		this.orala = orala;
		this.insulin = insulin;
		this.acei = acei;
		this.statin = statin;
		this.asa = asa;
	}
	
	public Meds(HashMap<String, Values> map) {
		super();
		this.orala = map.get("orala");
		this.insulin = map.get("insulin");
		this.acei = map.get("acei");
		this.statin = map.get("statin");
		this.asa = map.get("asa");
	}
	
	public HashMap<String, Value> getLatestMeds(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("orala",this.orala.getLastValue());
		result.put("insulin",this.insulin.getLastValue());
		result.put("acei",this.acei.getLastValue());
		result.put("statin",this.statin.getLastValue());
		result.put("asa",this.asa.getLastValue());
		return result;
	}
	
	public Values getOrala() {
		return orala;
	}
	public void setOrala(Values orala) {
		this.orala = orala;
	}
	public Values getInsulin() {
		return insulin;
	}
	public void setInsulin(Values insulin) {
		this.insulin = insulin;
	}
	public Values getAcei() {
		return acei;
	}
	public void setAcei(Values acei) {
		this.acei = acei;
	}
	public Values getStatin() {
		return statin;
	}
	public void setStatin(Values statin) {
		this.statin = statin;
	}
	public Values getAsa() {
		return asa;
	}
	public void setAsa(Values asa) {
		this.asa = asa;
	}

}
