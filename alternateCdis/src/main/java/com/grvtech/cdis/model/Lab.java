/**
 * 
 */
package com.grvtech.cdis.model;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import com.grvtech.cdis.util.Misc;

/**
 * @author radu
 *
 */
public class Lab {
	
	private Values hba1c;
	private Values acglu;
	private Values ogtt;
	public Lab(Values hba1c, Values acglu, Values ogtt) {
		super();
		this.hba1c = hba1c;
		this.acglu = acglu;
		this.ogtt = ogtt;
	}
	
	public Lab(HashMap<String, Values> map) {
		super();
		this.hba1c = map.get("hba1c");
		this.acglu = map.get("acglu");
		this.ogtt = map.get("ogtt");
	}
	
	public HashMap<String, Value> getLatestLab(){
		HashMap<String, Value> result = new HashMap<String, Value>();
		result.put("hba1c",this.hba1c.getLastValue());
		result.put("acglu",this.acglu.getLastValue());
		result.put("ogtt",this.ogtt.getLastValue());
		return result;
	}

	
	
	
	public Values getHba1c() {
		return hba1c;
	}
	public void setHba1c(Values hba1c) {
		this.hba1c = hba1c;
	}
	public Values getAcglu() {
		return acglu;
	}
	public void setAcglu(Values acglu) {
		this.acglu = acglu;
	}
	public Values getOgtt() {
		return ogtt;
	}
	public void setOgtt(Values ogtt) {
		this.ogtt = ogtt;
	}


}
